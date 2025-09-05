// 钓鱼游戏主类
class FishingGame {
    constructor() {
        this.loadGameData();
        this.initializeGame();
        this.bindEvents();
        this.updateUI();
    }

    loadGameData() {
        this.gameData = GAME_DATA;
    }

    initializeGame() {
        this.state = 'idle'; // idle, waiting, biting, reeling
        this.selectedBait = this.gameData.baits.basic;
        this.beans = this.gameData.economy.startingBeans;
        this.energy = 0;
        this.maxEnergy = 100;
        this.energyDecayInterval = null;
        this.bag = [];
        
        this.currentFish = null;
        this.waitingStartTime = 0;
        this.reelingGame = null;
        this.renderInterval = null;
    }

    bindEvents() {
        // 鱼饵选择
        document.getElementById('bait-basic').addEventListener('click', () => this.selectBait('basic'));
        document.getElementById('bait-pro').addEventListener('click', () => this.selectBait('pro'));
        document.getElementById('bait-gold').addEventListener('click', () => this.selectBait('gold'));
        
        // 游戏控制
        document.getElementById('cast-btn').addEventListener('click', () => this.cast());
        document.getElementById('reel-btn').addEventListener('click', () => this.onReelTap());
        document.getElementById('bag-btn').addEventListener('click', () => this.toggleBag());
        
        // 背包管理
        document.getElementById('close-bag').addEventListener('click', () => this.closeBag());
        document.getElementById('sell-all').addEventListener('click', () => this.sellAll());
        
        // 选项卡管理
        document.getElementById('tab-bag').addEventListener('click', () => this.switchTab('bag'));
        document.getElementById('tab-guide').addEventListener('click', () => this.switchTab('guide'));
    }

    selectBait(type) {
        if (this.state !== 'idle') return;
        
        this.selectedBait = this.gameData.baits[type];
        this.updateUI();
    }

    cast() {
        if (this.state !== 'idle') return;
        if (this.beans < this.selectedBait.cost) return;
        
        this.beans -= this.selectedBait.cost;
        this.state = 'waiting';
        this.waitingStartTime = Date.now();
        this.energy = 0;
        
        // 显示鱼线和鱼漂
        const fishingLine = document.getElementById('fishing-line');
        const fishingFloat = document.getElementById('fishing-float');
        
        if (fishingLine) {
            fishingLine.style.display = 'block';
        }
        if (fishingFloat) {
            fishingFloat.style.display = 'block';
        }
        
        this.updateUI();
        this.scheduleRandomEvent();
    }

    scheduleRandomEvent() {
        const minWait = this.gameData.timing.minWaitTime;
        const maxWait = this.gameData.timing.maxWaitTime;
        const waitTime = minWait + Math.random() * (maxWait - minWait);
        
        setTimeout(() => {
            if (this.state === 'waiting') {
                this.triggerRandomEvent();
            }
        }, waitTime * 1000);
    }

    triggerRandomEvent() {
        const allEvents = [
            ...this.selectedBait.fishTable.common.map(f => ({ type: 'fish', rarity: 'common', fish: f })),
            ...this.selectedBait.fishTable.rare.map(f => ({ type: 'fish', rarity: 'rare', fish: f })),
            ...this.selectedBait.fishTable.epic.map(f => ({ type: 'fish', rarity: 'epic', fish: f })),
            ...this.selectedBait.fishTable.legend.map(f => ({ type: 'fish', rarity: 'legend', fish: f })),
            ...this.gameData.events.map(e => ({ type: 'event', event: e }))
        ];
        
        const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
        
        if (randomEvent.type === 'fish') {
            this.onFishBite(randomEvent.fish, randomEvent.rarity);
        } else {
            this.onSpecialEvent(randomEvent.event);
        }
    }

    onFishBite(fishType, rarity) {
        this.currentFish = {
            type: fishType,
            rarity: rarity,
            profile: this.gameData.fishProfiles[fishType]
        };
        
        this.state = 'biting';
        this.energy = this.currentFish.profile.initialEnergy;
        
        // 显示视觉效果
        const fishingFloat = document.getElementById('fishing-float');
        const fishingLine = document.getElementById('fishing-line');
        const waterRipples = document.getElementById('water-ripples');
        
        if (fishingFloat) {
            fishingFloat.style.display = 'block';
            fishingFloat.classList.add('biting');
        }
        if (fishingLine) {
            fishingLine.style.display = 'block';
        }
        if (waterRipples) {
            waterRipples.classList.add('active');
        }
        
        this.updateUI();
        this.showFishBiteMessage();
        this.startEnergyDecay();
        
        setTimeout(() => {
            if (this.state === 'biting') {
                this.startReeling();
            }
        }, 2000);
    }

    onSpecialEvent(event) {
        this.state = 'idle';
        this.beans += event.reward;
        this.updateUI();
        this.showMessage(`${event.message} 获得 ${event.reward} 豆子！`);
    }

    startReeling() {
        if (this.state !== 'biting') return;
        
        this.state = 'reeling';
        
        // 添加收线动画
        const fishingRod = document.getElementById('fishing-rod');
        const fishingFloat = document.getElementById('fishing-float');
        const fishingLine = document.getElementById('fishing-line');
        
        if (fishingRod) {
            fishingRod.classList.add('reeling');
        }
        if (fishingFloat) {
            fishingFloat.classList.remove('biting');
            fishingFloat.classList.add('reeling');
        }
        if (fishingLine) {
            fishingLine.classList.add('reeling');
        }
        
        this.reelingGame = new ReelingMinigame(this.selectedBait, this.currentFish.profile);
        this.reelingGame.setCallbacks(
            (energyGained) => this.onReelingSuccess(energyGained),
            (energyLost) => this.onReelingMiss(energyLost)
        );
        this.reelingGame.start();
        this.updateUI();
        this.startRenderLoop();
    }

    onReelingSuccess(energyGained) {
        this.energy = Math.min(this.maxEnergy, this.energy + energyGained);
        this.updateEnergyDisplay();
        
        if (this.energy >= this.maxEnergy) {
            this.landFish();
        }
    }

    onReelingMiss(energyLost) {
        // 错误点击时消耗能量
        this.energy = Math.max(0, this.energy - energyLost);
        this.updateEnergyDisplay();
        
        // 如果能量耗尽，鱼逃走
        if (this.energy <= 0) {
            this.fishEscapes();
        }
    }

    onReelTap() {
        if (this.state === 'reeling' && this.reelingGame) {
            this.reelingGame.onTap();
        }
    }

    startEnergyDecay() {
        this.stopEnergyDecay();
        this.energyDecayInterval = setInterval(() => {
            if (this.state === 'biting' || this.state === 'reeling') {
                this.energy -= this.currentFish.profile.energyDecay;
                this.updateEnergyDisplay();
                
                if (this.energy <= 0) {
                    this.fishEscapes();
                }
            }
        }, 1000);
    }

    stopEnergyDecay() {
        if (this.energyDecayInterval) {
            clearInterval(this.energyDecayInterval);
            this.energyDecayInterval = null;
        }
    }

    landFish() {
        this.stopEnergyDecay();
        this.stopRenderLoop();
        
        const fish = this.currentFish;
        this.bag.push(fish);
        this.state = 'idle';
        this.currentFish = null;
        this.energy = 0;
        
        // 隐藏视觉元素
        this.hideVisualElements();
        
        this.updateUI();
        this.showMessage(`成功钓到 ${fish.profile.name}！`);
    }

    fishEscapes() {
        this.stopEnergyDecay();
        this.stopRenderLoop();
        
        this.state = 'idle';
        this.currentFish = null;
        this.energy = 0;
        
        // 隐藏视觉元素
        this.hideVisualElements();
        
        this.updateUI();
        this.showMessage('鱼逃走了...');
    }

    hideVisualElements() {
        const fishingFloat = document.getElementById('fishing-float');
        const fishingLine = document.getElementById('fishing-line');
        const fishingRod = document.getElementById('fishing-rod');
        const waterRipples = document.getElementById('water-ripples');
        
        if (fishingFloat) {
            fishingFloat.style.display = 'none';
            fishingFloat.classList.remove('biting', 'reeling');
        }
        if (fishingLine) {
            fishingLine.style.display = 'none';
            fishingLine.classList.remove('reeling');
        }
        if (fishingRod) {
            fishingRod.classList.remove('reeling');
        }
        if (waterRipples) {
            waterRipples.classList.remove('active');
        }
        
        // 清理命中指示器
        const hitIndicators = document.getElementById('hit-indicators');
        if (hitIndicators) {
            hitIndicators.innerHTML = '';
        }
    }

    startRenderLoop() {
        this.stopRenderLoop();
        let lastTime = Date.now();
        
        this.renderInterval = setInterval(() => {
            const currentTime = Date.now();
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            if (this.reelingGame && this.state === 'reeling') {
                this.reelingGame.update(deltaTime);
                this.renderReelingGame();
            }
        }, 16); // ~60fps
    }

    stopRenderLoop() {
        if (this.renderInterval) {
            clearInterval(this.renderInterval);
            this.renderInterval = null;
        }
    }

    renderReelingGame() {
        const game = this.reelingGame;
        const timingBar = document.getElementById('timing-bar');
        const cursor = document.getElementById('timing-cursor');
        const greenZone = document.getElementById('timing-green');
        
        // 更新光标位置
        cursor.style.left = `${game.cursorPos * 100}%`;
        
        // 更新绿色区域
        greenZone.style.left = `${game.greenStart * 100}%`;
        greenZone.style.width = `${game.greenWidth * 100}%`;
        
        // 根据收缩阶段改变绿色区域的颜色
        if (game.shrinkPhase === 'fast') {
            // 快速收缩阶段：亮绿色，表示还比较容易
            greenZone.style.background = '#22c55e';
            greenZone.style.boxShadow = '0 0 15px rgba(34,197,94,0.6)';
        } else {
            // 慢速收缩阶段：橙绿色，表示更有挑战性
            greenZone.style.background = 'linear-gradient(90deg, #22c55e, #eab308)';
            greenZone.style.boxShadow = '0 0 15px rgba(234,179,8,0.6)';
        }
        
        timingBar.style.display = 'block';
    }

    toggleBag() {
        const bagOverlay = document.getElementById('bag-overlay');
        bagOverlay.style.display = bagOverlay.style.display === 'none' ? 'block' : 'none';
        this.updateBagUI();
    }

    closeBag() {
        document.getElementById('bag-overlay').style.display = 'none';
    }

    sellAll() {
        let totalEarnings = 0;
        this.bag.forEach(fish => {
            totalEarnings += fish.profile.value;
        });
        
        this.beans += totalEarnings;
        this.bag = [];
        this.updateUI();
        this.updateBagUI();
        this.showMessage(`出售完成！获得 ${totalEarnings} 豆子`);
    }

    updateUI() {
        // 更新豆子显示
        document.getElementById('beans-count').textContent = this.beans;
        
        // 更新鱼饵选择
        document.querySelectorAll('.bait-option').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.type === this.getSelectedBaitType()) {
                btn.classList.add('selected');
            }
        });
        
        // 更新控制按钮
        const castBtn = document.getElementById('cast-btn');
        const reelingControls = document.getElementById('reeling-controls');
        const baitSelection = document.getElementById('bait-selection');
        const bagBtn = document.getElementById('bag-btn');
        const energyDisplay = document.getElementById('energy-display');
        const timingBar = document.getElementById('timing-bar');
        
        // 根据状态显示/隐藏控件
        if (this.state === 'idle') {
            castBtn.style.display = 'block';
            reelingControls.style.display = 'none';
            baitSelection.style.display = 'block';
            bagBtn.style.display = 'block';
            energyDisplay.classList.remove('active');
            timingBar.style.display = 'none';
            castBtn.textContent = `抛竿 (${this.selectedBait.cost} 豆子)`;
            castBtn.disabled = this.beans < this.selectedBait.cost;
        } else if (this.state === 'waiting') {
            castBtn.style.display = 'none';
            reelingControls.style.display = 'none';
            baitSelection.style.display = 'none';
            bagBtn.style.display = 'none';
            energyDisplay.classList.remove('active');
            timingBar.style.display = 'none';
        } else if (this.state === 'biting') {
            castBtn.style.display = 'none';
            reelingControls.style.display = 'none';
            baitSelection.style.display = 'none';
            bagBtn.style.display = 'none';
            energyDisplay.classList.add('active');
            timingBar.style.display = 'none';
        } else if (this.state === 'reeling') {
            castBtn.style.display = 'none';
            reelingControls.style.display = 'flex';
            baitSelection.style.display = 'none';
            bagBtn.style.display = 'none';
            energyDisplay.classList.add('active');
            timingBar.style.display = 'block';
        }
        
        // 更新能量显示
        this.updateEnergyDisplay();
        
        // 更新背包计数
        document.getElementById('bag-count').textContent = this.bag.length;
    }

    updateEnergyDisplay() {
        const energyFill = document.getElementById('energy-fill');
        const energyText = document.getElementById('energy-text');
        
        if (energyFill && energyText) {
            const percentage = (this.energy / this.maxEnergy) * 100;
            energyFill.style.width = `${Math.max(0, percentage)}%`;
            energyText.textContent = `${Math.round(this.energy)}/${this.maxEnergy}`;
            
            // 根据能量值改变颜色
            if (percentage >= 80) {
                energyFill.style.backgroundColor = '#4CAF50'; // 绿色
            } else if (percentage >= 40) {
                energyFill.style.backgroundColor = '#FF9800'; // 橙色
            } else {
                energyFill.style.backgroundColor = '#f44336'; // 红色
            }
        }
    }

    updateBagUI() {
        const bagItems = document.getElementById('bag-items');
        bagItems.innerHTML = '';
        
        if (this.bag.length === 0) {
            bagItems.innerHTML = '<p style="text-align: center; color: #666;">背包空空如也</p>';
            return;
        }
        
        const fishCounts = {};
        this.bag.forEach(fish => {
            const key = `${fish.type}-${fish.rarity}`;
            if (!fishCounts[key]) {
                fishCounts[key] = { fish: fish, count: 0 };
            }
            fishCounts[key].count++;
        });
        
        Object.values(fishCounts).forEach(item => {
            const fishItem = document.createElement('div');
            fishItem.className = 'bag-item';
            fishItem.innerHTML = `
                <span>${item.fish.profile.name} ${item.fish.profile.emoji}</span>
                <span>×${item.count}</span>
                <span>${item.fish.profile.value * item.count} 豆子</span>
            `;
            bagItems.appendChild(fishItem);
        });
    }

    getSelectedBaitType() {
        for (const [type, bait] of Object.entries(this.gameData.baits)) {
            if (bait === this.selectedBait) {
                return type;
            }
        }
        return 'basic';
    }

    showFishBiteMessage() {
        this.showMessage(`🎣 有鱼上钩了！是 ${this.currentFish.profile.name}！`);
    }

    showMessage(text) {
        const messageDiv = document.getElementById('message') || this.createMessageDiv();
        messageDiv.textContent = text;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }

    createMessageDiv() {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-size: 16px;
            z-index: 1000;
            display: none;
            text-align: center;
            max-width: 80%;
        `;
        document.body.appendChild(messageDiv);
        return messageDiv;
    }

    // 选项卡功能
    switchTab(tabName) {
        // 切换选项卡按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');
        
        // 切换内容显示
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`content-${tabName}`).classList.add('active');
        
        // 如果切换到图鉴选项卡，生成图鉴内容
        if (tabName === 'guide') {
            this.generateFishGuide();
        }
    }

    generateFishGuide() {
        const fishGrid = document.getElementById('fish-grid');
        fishGrid.innerHTML = '';

        // 定义稀有度颜色和出现概率
        const rarityInfo = {
            common: { name: '常见', class: 'rarity-common', probability: '60%' },
            rare: { name: '稀有', class: 'rarity-rare', probability: '25%' },
            epic: { name: '史诗', class: 'rarity-epic', probability: '12%' },
            legend: { name: '传说', class: 'rarity-legend', probability: '3%' }
        };

        // 生成每种鱼的卡片
        for (const [fishType, fishData] of Object.entries(this.gameData.fishProfiles)) {
            const fishCard = document.createElement('div');
            fishCard.className = 'fish-card';

            // 确定这种鱼的稀有度
            let rarity = 'common';
            for (const [baitType, bait] of Object.entries(this.gameData.baits)) {
                for (const [rarityLevel, fishList] of Object.entries(bait.fishTable)) {
                    if (fishList.includes(fishType)) {
                        rarity = rarityLevel;
                        break;
                    }
                }
            }

            fishCard.innerHTML = `
                <div class="fish-info">
                    <div class="fish-emoji">${fishData.emoji}</div>
                    <div class="fish-details">
                        <div class="fish-name">${fishData.name}</div>
                        <div class="fish-value">💰 价值: ${fishData.value} 豆</div>
                        <div class="fish-stats">
                            <span class="fish-rarity ${rarityInfo[rarity].class}">
                                ${rarityInfo[rarity].name} (${rarityInfo[rarity].probability})
                            </span>
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; margin-top: 5px;">
                            难度: 速度+${Math.round(fishData.speedIncrease * 100)}% | 收缩+${Math.round(fishData.shrink * 100)}%
                        </div>
                    </div>
                </div>
            `;

            fishGrid.appendChild(fishCard);
        }
    }
}
