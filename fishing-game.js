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
        
        // 初始化游戏进度状态
        if (!this.gameData.gameState) {
            this.gameData.gameState = {
                totalCaught: 0,
                unlockedFish: ["crucian_carp", "goldfish", "small_crucian", "white_striped"],
                currentScene: 0
            };
        }
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
        // 只包含已解锁的鱼类
        const availableCommon = this.getAvailableFish(this.selectedBait.fishTable.common);
        const availableRare = this.getAvailableFish(this.selectedBait.fishTable.rare);
        const availableEpic = this.getAvailableFish(this.selectedBait.fishTable.epic);
        const availableLegend = this.getAvailableFish(this.selectedBait.fishTable.legend);
        
        const allEvents = [
            ...availableCommon.map(f => ({ type: 'fish', rarity: 'common', fish: f })),
            ...availableRare.map(f => ({ type: 'fish', rarity: 'rare', fish: f })),
            ...availableEpic.map(f => ({ type: 'fish', rarity: 'epic', fish: f })),
            ...availableLegend.map(f => ({ type: 'fish', rarity: 'legend', fish: f })),
            ...this.gameData.events.map(e => ({ type: 'event', event: e }))
        ];
        
        // 如果没有可用的鱼类，只会触发事件
        if (allEvents.length === this.gameData.events.length) {
            // 所有鱼类都被锁定，只能触发基础事件
            const randomEvent = this.gameData.events[Math.floor(Math.random() * this.gameData.events.length)];
            this.onSpecialEvent(randomEvent);
            return;
        }
        
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
        
        // 更新游戏进度
        this.gameData.gameState.totalCaught++;
        this.updateUnlockedFish();
        
        this.state = 'idle';
        this.currentFish = null;
        this.energy = 0;
        
        // 隐藏视觉元素
        this.hideVisualElements();
        
        this.updateUI();
        this.showMessage(`🎉 成功钓到 ${fish.profile.name}！`);
        
        // 检查是否解锁新鱼类或场景
        this.checkUnlocks();
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
        bagOverlay.style.display = bagOverlay.style.display === 'none' ? 'flex' : 'none';
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
        // 根据鱼的难度给出不同的提示，但不显示鱼的名字
        const difficulty = this.currentFish.profile.shrink;
        let message;
        if (difficulty <= 0.12) {
            message = '🎣 有鱼上钩了！感觉很轻松...';
        } else if (difficulty <= 0.16) {
            message = '🎣 有鱼上钩了！有一些阻力...';
        } else if (difficulty <= 0.20) {
            message = '🎣 有鱼上钩了！鱼线很紧！';
        } else if (difficulty <= 0.25) {
            message = '🎣 有大家伙上钩了！鱼竿都在颤抖！';
        } else {
            message = '🎣 传说中的生物上钩了！！！';
        }
        this.showMessage(message);
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

        // 生成每种鱼的卡片 - 包括已解锁和未解锁的
        for (const [fishType, fishData] of Object.entries(this.gameData.fishProfiles)) {
            const fishCard = document.createElement('div');
            const isUnlocked = this.gameData.gameState.unlockedFish.includes(fishType);
            fishCard.className = `fish-card ${isUnlocked ? '' : 'locked'}`;

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

            if (isUnlocked) {
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
            } else {
                fishCard.innerHTML = `
                    <div class="fish-info">
                        <div class="fish-emoji">❓</div>
                        <div class="fish-details">
                            <div class="fish-name">未知鱼类</div>
                            <div class="fish-value">需要钓到 ${fishData.unlockLevel} 条鱼解锁</div>
                            <div class="fish-stats">
                                <span class="fish-rarity rarity-locked">已锁定</span>
                            </div>
                        </div>
                    </div>
                `;
            }

            fishGrid.appendChild(fishCard);
        }
    }

    // 解锁系统相关功能
    updateUnlockedFish() {
        const totalCaught = this.gameData.gameState.totalCaught;
        const allFish = Object.keys(this.gameData.fishProfiles);
        
        for (const fishId of allFish) {
            const fish = this.gameData.fishProfiles[fishId];
            if (fish.unlockLevel <= totalCaught && 
                !this.gameData.gameState.unlockedFish.includes(fishId)) {
                this.gameData.gameState.unlockedFish.push(fishId);
            }
        }
    }

    checkUnlocks() {
        const totalCaught = this.gameData.gameState.totalCaught;
        
        // 检查新解锁的鱼类
        const allFish = Object.keys(this.gameData.fishProfiles);
        const newUnlocks = [];
        
        for (const fishId of allFish) {
            const fish = this.gameData.fishProfiles[fishId];
            if (fish.unlockLevel === totalCaught && 
                this.gameData.gameState.unlockedFish.includes(fishId)) {
                newUnlocks.push(fish.name);
            }
        }
        
        // 检查新解锁的场景
        const scenes = this.gameData.progressSystem.scenes;
        for (const scene of scenes) {
            if (scene.unlockAt === totalCaught) {
                this.showMessage(`🎊 解锁新场景：${scene.name}！`);
                setTimeout(() => {
                    this.showMessage(`${scene.description}`);
                }, 2000);
                break;
            }
        }
        
        // 显示新解锁的鱼类
        if (newUnlocks.length > 0) {
            setTimeout(() => {
                this.showMessage(`🐟 解锁新鱼类：${newUnlocks.join('、')}！`);
            }, newUnlocks.length > 0 ? 4000 : 0);
        }
    }

    // 根据解锁状态过滤可钓到的鱼
    getAvailableFish(fishList) {
        return fishList.filter(fishId => 
            this.gameData.gameState.unlockedFish.includes(fishId)
        );
    }
}
