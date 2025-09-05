// 收线小游戏类
class ReelingMinigame {
    constructor(bait, fishProfile) {
        this.bait = bait;
        this.fishProfile = fishProfile;
        this.reset();
    }
    
    reset() {
        this.isActive = false;
        this.cursorPos = 0.5;
        this.cursorDir = 1;
        
        // 使用鱼类的区域配置 - 从100%开始缩小
        const zoneConfig = this.fishProfile.zoneConfig || {};
        this.greenWidth = 0.9; // 从90%的屏幕宽度开始
        this.initialWidth = this.greenWidth; // 记录初始宽度
        this.targetWidth = this.bait.baseWidth * (zoneConfig.initialWidthMultiplier || 1.0); // 最终目标宽度
        
        // 初始时绿色区域居中，收缩时保持居中
        this.greenStart = 0.05; // 90%宽度时，左右各留5%
        
        this.startTime = 0;
        this.currentSpeed = this.bait.cursorSpeed; // 当前速度
        this.speedIncrease = this.fishProfile.speedIncrease || 0.1; // 使用鱼类配置的加速度
        this.maxSpeed = this.fishProfile.maxSpeed || 2.0; // 使用鱼类配置的最大速度
        this.shrinkPhase = 'fast'; // 收缩阶段：fast 或 slow
        
        // 缩小速度配置
        this.fastShrinkSpeed = zoneConfig.fastShrinkSpeed || 2.5;
        this.slowShrinkSpeed = zoneConfig.slowShrinkSpeed || 0.4;
        this.slowPhaseThreshold = zoneConfig.slowPhaseThreshold || 0.8;
    }
    
    start() {
        this.isActive = true;
        this.startTime = Date.now();
        this.cursorPos = 0.5;
        this.cursorDir = 1;
        this.currentSpeed = this.bait.cursorSpeed; // 重置速度
        this.maxSpeed = this.fishProfile.maxSpeed || 2.0; // 重置最大速度
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        const dt = deltaTime / 1000;
        
        // 光标速度逐渐增加，但不超过最大速度
        this.currentSpeed = Math.min(this.maxSpeed, this.currentSpeed + this.speedIncrease * dt);
        
        // 更新光标位置（使用加速后的速度）
        this.cursorPos += this.cursorDir * dt * this.currentSpeed;
        
        // 光标边界反弹
        if (this.cursorPos >= 0.98) {
            this.cursorPos = 0.98;
            this.cursorDir = -1;
        } else if (this.cursorPos <= 0.02) {
            this.cursorPos = 0.02;
            this.cursorDir = 1;
        }
        
        // 绿色窗口不断收缩，增加难度 - 分阶段收缩，从100%往回缩小
        const slowShrinkThreshold = this.initialWidth * this.slowPhaseThreshold; // 使用鱼类特定的阈值
        
        let shrinkRate;
        if (this.greenWidth > slowShrinkThreshold) {
            // 快速收缩阶段：使用鱼类特定的快速收缩速度
            shrinkRate = this.fishProfile.shrink * this.fastShrinkSpeed;
            this.shrinkPhase = 'fast';
        } else {
            // 慢速收缩阶段：使用鱼类特定的慢速收缩速度
            shrinkRate = this.fishProfile.shrink * this.slowShrinkSpeed;
            this.shrinkPhase = 'slow';
        }
        
        // 不能小于目标宽度
        const newWidth = Math.max(this.targetWidth, this.greenWidth * (1 - dt * shrinkRate));
        
        // 如果宽度发生变化，更新位置保持居中
        if (newWidth !== this.greenWidth) {
            const centerPos = this.greenStart + this.greenWidth / 2;
            this.greenWidth = newWidth;
            this.greenStart = centerPos - this.greenWidth / 2;
            
            // 确保不超出边界
            this.greenStart = Math.max(0.05, Math.min(0.95 - this.greenWidth, this.greenStart));
        }
        
        // 当达到目标宽度时，可以随机移动位置增加难度
        if (this.greenWidth <= this.targetWidth + 0.01) {
            // 偶尔随机调整位置
            if (Math.random() < 0.02) { // 2%的概率每帧
                const maxStart = 0.95 - this.greenWidth;
                this.greenStart = 0.05 + Math.random() * (maxStart - 0.05);
            }
        }
    }
    
    onTap() {
        if (!this.isActive) return false;
        
        // 立即记录点击时的光标位置，避免延迟
        const clickPosition = this.cursorPos;
        
        const greenEnd = this.greenStart + this.greenWidth;
        // 增加一点容差，避免浮点数精度问题
        const tolerance = 0.001;
        const isHit = clickPosition >= (this.greenStart - tolerance) && clickPosition <= (greenEnd + tolerance);
        
        // 显示命中指示器
        this.showHitIndicator(clickPosition, isHit);
        
        if (isHit) {
            // 计算获得的能量
            const centerPos = this.greenStart + this.greenWidth / 2;
            const distanceFromCenter = Math.abs(clickPosition - centerPos);
            const maxDistance = this.greenWidth / 2;
            const accuracy = 1 - (distanceFromCenter / maxDistance);
            
            // 能量获得：基础5点 + 精确度奖励(0-15点)
            const energyGained = 5 + (accuracy * 15);
            
            if (this.onSuccessCallback) {
                this.onSuccessCallback(energyGained);
            }
            return true;
        } else {
            // 错误点击消耗能量：固定消耗3-8点能量
            const energyLost = 3 + Math.random() * 5;
            
            if (this.onMissCallback) {
                this.onMissCallback(energyLost);
            }
            return false;
        }
    }
    
    showHitIndicator(position, isSuccess) {
        const hitIndicators = document.getElementById('hit-indicators');
        if (!hitIndicators) return;
        
        const indicator = document.createElement('div');
        indicator.className = `hit-indicator ${isSuccess ? 'success' : 'miss'}`;
        indicator.style.left = `${position * 100}%`;
        
        hitIndicators.appendChild(indicator);
        
        // 2秒后移除指示器
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 2000);
    }
    
    setCallbacks(onSuccess, onMiss) {
        this.onSuccessCallback = onSuccess;
        this.onMissCallback = onMiss;
    }
}
