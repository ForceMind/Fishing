// 钓鱼小游戏数据模型 - 简体中文版
const GAME_DATA = {
  "baits": {
    "basic": {
      "name": "基础鱼饵",
      "cost": 8,
      "baseWidth": 0.24,
      "cursorSpeed": 0.60,
      "fishTable": {
        "common": ["small", "small", "small", "mid"],
        "rare": ["mid", "mid", "big"],
        "epic": ["big", "big", "boss"],
        "legend": ["boss"]
      }
    },
    "pro": {
      "name": "高级鱼饵",
      "cost": 20,
      "baseWidth": 0.20,
      "cursorSpeed": 0.65,
      "fishTable": {
        "common": ["small", "mid", "mid"],
        "rare": ["mid", "big", "big"],
        "epic": ["big", "boss", "boss"],
        "legend": ["boss"]
      }
    },
    "gold": {
      "name": "黄金鱼饵",
      "cost": 50,
      "baseWidth": 0.18,
      "cursorSpeed": 0.70,
      "fishTable": {
        "common": ["mid", "big"],
        "rare": ["big", "big", "boss"],
        "epic": ["boss", "boss"],
        "legend": ["boss"]
      }
    }
  },
  "fishProfiles": {
    "small": {
      "name": "小鱼",
      "emoji": "🐟",
      "value": 12,
      "shrink": 0.12,
      "initialEnergy": 30,
      "energyDecay": 1.5,
      "speedIncrease": 0.08,
      "maxSpeed": 1.2,
      "zoneConfig": {
        "initialWidthMultiplier": 1.3,
        "fastShrinkSpeed": 1.8,
        "slowShrinkSpeed": 0.5,
        "slowPhaseThreshold": 0.75
      }
    },
    "mid": {
      "name": "中鱼",
      "emoji": "🐠",
      "value": 28,
      "shrink": 0.15,
      "initialEnergy": 50,
      "energyDecay": 2.0,
      "speedIncrease": 0.12,
      "maxSpeed": 1.5,
      "zoneConfig": {
        "initialWidthMultiplier": 1.2,
        "fastShrinkSpeed": 2.0,
        "slowShrinkSpeed": 0.4,
        "slowPhaseThreshold": 0.7
      }
    },
    "big": {
      "name": "大鱼",
      "emoji": "🎣",
      "value": 55,
      "shrink": 0.18,
      "initialEnergy": 70,
      "energyDecay": 2.5,
      "speedIncrease": 0.16,
      "maxSpeed": 1.8,
      "zoneConfig": {
        "initialWidthMultiplier": 1.1,
        "fastShrinkSpeed": 2.2,
        "slowShrinkSpeed": 0.35,
        "slowPhaseThreshold": 0.65
      }
    },
    "boss": {
      "name": "传说鱼",
      "emoji": "🐲",
      "value": 120,
      "shrink": 0.22,
      "initialEnergy": 90,
      "energyDecay": 3.0,
      "speedIncrease": 0.20,
      "maxSpeed": 2.2,
      "zoneConfig": {
        "initialWidthMultiplier": 1.0,
        "fastShrinkSpeed": 2.5,
        "slowShrinkSpeed": 0.3,
        "slowPhaseThreshold": 0.6
      }
    }
  },
  "fishTable": {
    "common": ["small", "small", "small", "mid"],
    "rare": ["mid", "mid", "big"],
    "epic": ["big", "big", "boss"],
    "legend": ["boss"]
  },
  "events": [
    {
      "message": "发现了宝箱",
      "reward": 25
    },
    {
      "message": "钓到了垃圾",
      "reward": 2
    }
  ],
  "economy": {
    "startingBeans": 100
  },
  "timing": {
    "minWaitTime": 3,
    "maxWaitTime": 8
  }
};

// 验证游戏数据的函数
function validateGameData(data) {
  const required = ['baits', 'fishProfiles', 'fishTable', 'events', 'economy', 'timing'];
  return required.every(key => key in data);
}