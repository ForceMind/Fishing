// 游戏初始化和工具函数
function initializeGame() {
    // 检查游戏数据是否已加载
    if (typeof GAME_DATA === 'undefined') {
        console.error('游戏数据未加载！请确保 game-data.js 已正确引入。');
        return;
    }
    
    console.log('游戏数据验证中...');
    if (validateGameData(GAME_DATA)) {
        console.log('游戏数据验证通过，启动游戏...');
        window.fishingGame = new FishingGame();
    } else {
        console.error('游戏数据验证失败！');
    }
}

// 等待DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initializeGame);

// 调试用全局函数
function debugGameState() {
    if (window.fishingGame) {
        console.log('当前游戏状态:', {
            state: window.fishingGame.state,
            beans: window.fishingGame.beans,
            energy: window.fishingGame.energy,
            selectedBait: window.fishingGame.selectedBait.name,
            bagItems: window.fishingGame.bag.length,
            currentFish: window.fishingGame.currentFish
        });
    } else {
        console.log('游戏未初始化');
    }
}

// 调试用重置游戏函数
function resetGame() {
    if (window.fishingGame) {
        window.fishingGame.initializeGame();
        window.fishingGame.updateUI();
        console.log('游戏已重置');
    }
}

// 调试用添加豆子函数
function addBeans(amount = 100) {
    if (window.fishingGame) {
        window.fishingGame.beans += amount;
        window.fishingGame.updateUI();
        console.log(`已添加 ${amount} 个豆子`);
    }
}
