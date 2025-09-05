// 钓鱼小游戏数据模型 - 简体中文版
const GAME_DATA = {
  "baits": {
    "basic": {
      "name": "基础鱼饵",
      "cost": 8,
      "baseWidth": 0.24,
      "cursorSpeed": 0.60,
      "fishTable": {
        "common": ["crucian_carp", "goldfish", "small_crucian", "white_striped"],
        "rare": ["grass_carp", "silver_carp", "bighead_carp"],
        "epic": ["black_carp", "carp", "catfish"],
        "legend": ["sturgeon"]
      }
    },
    "pro": {
      "name": "高级鱼饵",
      "cost": 20,
      "baseWidth": 0.20,
      "cursorSpeed": 0.65,
      "fishTable": {
        "common": ["crucian_carp", "grass_carp", "silver_carp"],
        "rare": ["black_carp", "carp", "catfish"],
        "epic": ["sturgeon", "mandarin_fish", "perch"],
        "legend": ["chinese_sturgeon"]
      }
    },
    "gold": {
      "name": "黄金鱼饵",
      "cost": 50,
      "baseWidth": 0.18,
      "cursorSpeed": 0.70,
      "fishTable": {
        "common": ["carp", "catfish"],
        "rare": ["sturgeon", "mandarin_fish", "perch"],
        "epic": ["chinese_sturgeon", "paddlefish", "giant_salamander"],
        "legend": ["dragon_fish"]
      }
    }
  },
  "fishProfiles": {
    // 新手鱼类 (1-8种) - 池塘/小河
    "crucian_carp": {
      "name": "鲫鱼",
      "emoji": "🐟",
      "value": 12,
      "shrink": 0.12,
      "initialEnergy": 30,
      "energyDecay": 1.5,
      "speedIncrease": 0.08,
      "maxSpeed": 1.2,
      "unlockLevel": 0,
      "zoneConfig": {
        "initialWidthMultiplier": 1.3,
        "fastShrinkSpeed": 1.8,
        "slowShrinkSpeed": 0.5,
        "slowPhaseThreshold": 0.75
      }
    },
    "goldfish": {
      "name": "金鱼",
      "emoji": "🐠",
      "value": 15,
      "shrink": 0.11,
      "initialEnergy": 25,
      "energyDecay": 1.4,
      "speedIncrease": 0.07,
      "maxSpeed": 1.1,
      "unlockLevel": 0,
      "zoneConfig": {
        "initialWidthMultiplier": 1.35,
        "fastShrinkSpeed": 1.7,
        "slowShrinkSpeed": 0.5,
        "slowPhaseThreshold": 0.8
      }
    },
    "small_crucian": {
      "name": "小鲫鱼",
      "emoji": "🐟",
      "value": 8,
      "shrink": 0.10,
      "initialEnergy": 20,
      "energyDecay": 1.3,
      "speedIncrease": 0.06,
      "maxSpeed": 1.0,
      "unlockLevel": 0,
      "zoneConfig": {
        "initialWidthMultiplier": 1.4,
        "fastShrinkSpeed": 1.6,
        "slowShrinkSpeed": 0.6,
        "slowPhaseThreshold": 0.8
      }
    },
    "white_striped": {
      "name": "白条鱼",
      "emoji": "🐟",
      "value": 10,
      "shrink": 0.13,
      "initialEnergy": 25,
      "energyDecay": 1.6,
      "speedIncrease": 0.09,
      "maxSpeed": 1.3,
      "unlockLevel": 0,
      "zoneConfig": {
        "initialWidthMultiplier": 1.25,
        "fastShrinkSpeed": 1.9,
        "slowShrinkSpeed": 0.45,
        "slowPhaseThreshold": 0.7
      }
    },
    "loach": {
      "name": "泥鳅",
      "emoji": "🐍",
      "value": 6,
      "shrink": 0.14,
      "initialEnergy": 15,
      "energyDecay": 1.8,
      "speedIncrease": 0.12,
      "maxSpeed": 1.4,
      "unlockLevel": 5,
      "zoneConfig": {
        "initialWidthMultiplier": 1.2,
        "fastShrinkSpeed": 2.0,
        "slowShrinkSpeed": 0.4,
        "slowPhaseThreshold": 0.65
      }
    },
    "pond_smelt": {
      "name": "池沼公鱼",
      "emoji": "🐟",
      "value": 14,
      "shrink": 0.12,
      "initialEnergy": 28,
      "energyDecay": 1.5,
      "speedIncrease": 0.08,
      "maxSpeed": 1.2,
      "unlockLevel": 8,
      "zoneConfig": {
        "initialWidthMultiplier": 1.3,
        "fastShrinkSpeed": 1.8,
        "slowShrinkSpeed": 0.5,
        "slowPhaseThreshold": 0.75
      }
    },
    "bluegill": {
      "name": "蓝鳃太阳鱼",
      "emoji": "🐠",
      "value": 18,
      "shrink": 0.13,
      "initialEnergy": 35,
      "energyDecay": 1.7,
      "speedIncrease": 0.09,
      "maxSpeed": 1.3,
      "unlockLevel": 10,
      "zoneConfig": {
        "initialWidthMultiplier": 1.25,
        "fastShrinkSpeed": 1.9,
        "slowShrinkSpeed": 0.45,
        "slowPhaseThreshold": 0.7
      }
    },
    "bass": {
      "name": "鲈鱼",
      "emoji": "🐟",
      "value": 22,
      "shrink": 0.14,
      "initialEnergy": 40,
      "energyDecay": 1.8,
      "speedIncrease": 0.10,
      "maxSpeed": 1.4,
      "unlockLevel": 12,
      "zoneConfig": {
        "initialWidthMultiplier": 1.2,
        "fastShrinkSpeed": 2.0,
        "slowShrinkSpeed": 0.4,
        "slowPhaseThreshold": 0.68
      }
    },

    // 进阶鱼类 (9-16种) - 湖泊
    "grass_carp": {
      "name": "草鱼",
      "emoji": "🐠",
      "value": 28,
      "shrink": 0.15,
      "initialEnergy": 50,
      "energyDecay": 2.0,
      "speedIncrease": 0.12,
      "maxSpeed": 1.5,
      "unlockLevel": 15,
      "zoneConfig": {
        "initialWidthMultiplier": 1.2,
        "fastShrinkSpeed": 2.0,
        "slowShrinkSpeed": 0.4,
        "slowPhaseThreshold": 0.7
      }
    },
    "silver_carp": {
      "name": "鲢鱼",
      "emoji": "🐟",
      "value": 26,
      "shrink": 0.14,
      "initialEnergy": 45,
      "energyDecay": 1.9,
      "speedIncrease": 0.11,
      "maxSpeed": 1.4,
      "unlockLevel": 18,
      "zoneConfig": {
        "initialWidthMultiplier": 1.25,
        "fastShrinkSpeed": 1.9,
        "slowShrinkSpeed": 0.42,
        "slowPhaseThreshold": 0.72
      }
    },
    "bighead_carp": {
      "name": "鳙鱼",
      "emoji": "🐠",
      "value": 32,
      "shrink": 0.16,
      "initialEnergy": 55,
      "energyDecay": 2.1,
      "speedIncrease": 0.13,
      "maxSpeed": 1.6,
      "unlockLevel": 20,
      "zoneConfig": {
        "initialWidthMultiplier": 1.15,
        "fastShrinkSpeed": 2.1,
        "slowShrinkSpeed": 0.38,
        "slowPhaseThreshold": 0.68
      }
    },
    "black_carp": {
      "name": "青鱼",
      "emoji": "🎣",
      "value": 55,
      "shrink": 0.18,
      "initialEnergy": 70,
      "energyDecay": 2.5,
      "speedIncrease": 0.16,
      "maxSpeed": 1.8,
      "unlockLevel": 25,
      "zoneConfig": {
        "initialWidthMultiplier": 1.1,
        "fastShrinkSpeed": 2.2,
        "slowShrinkSpeed": 0.35,
        "slowPhaseThreshold": 0.65
      }
    },
    "carp": {
      "name": "鲤鱼",
      "emoji": "🎣",
      "value": 48,
      "shrink": 0.17,
      "initialEnergy": 65,
      "energyDecay": 2.3,
      "speedIncrease": 0.15,
      "maxSpeed": 1.7,
      "unlockLevel": 22,
      "zoneConfig": {
        "initialWidthMultiplier": 1.12,
        "fastShrinkSpeed": 2.1,
        "slowShrinkSpeed": 0.36,
        "slowPhaseThreshold": 0.66
      }
    },
    "catfish": {
      "name": "鲶鱼",
      "emoji": "🐟",
      "value": 42,
      "shrink": 0.16,
      "initialEnergy": 60,
      "energyDecay": 2.2,
      "speedIncrease": 0.14,
      "maxSpeed": 1.6,
      "unlockLevel": 28,
      "zoneConfig": {
        "initialWidthMultiplier": 1.14,
        "fastShrinkSpeed": 2.0,
        "slowShrinkSpeed": 0.37,
        "slowPhaseThreshold": 0.67
      }
    },
    "mandarin_fish": {
      "name": "桂鱼",
      "emoji": "🐠",
      "value": 65,
      "shrink": 0.19,
      "initialEnergy": 75,
      "energyDecay": 2.6,
      "speedIncrease": 0.17,
      "maxSpeed": 1.9,
      "unlockLevel": 30,
      "zoneConfig": {
        "initialWidthMultiplier": 1.08,
        "fastShrinkSpeed": 2.3,
        "slowShrinkSpeed": 0.34,
        "slowPhaseThreshold": 0.64
      }
    },
    "perch": {
      "name": "鳜鱼",
      "emoji": "🐟",
      "value": 58,
      "shrink": 0.18,
      "initialEnergy": 72,
      "energyDecay": 2.4,
      "speedIncrease": 0.16,
      "maxSpeed": 1.8,
      "unlockLevel": 32,
      "zoneConfig": {
        "initialWidthMultiplier": 1.1,
        "fastShrinkSpeed": 2.2,
        "slowShrinkSpeed": 0.35,
        "slowPhaseThreshold": 0.65
      }
    },

    // 高级鱼类 (17-24种) - 江河
    "sturgeon": {
      "name": "鲟鱼",
      "emoji": "🐲",
      "value": 120,
      "shrink": 0.22,
      "initialEnergy": 90,
      "energyDecay": 3.0,
      "speedIncrease": 0.20,
      "maxSpeed": 2.2,
      "unlockLevel": 35,
      "zoneConfig": {
        "initialWidthMultiplier": 1.0,
        "fastShrinkSpeed": 2.5,
        "slowShrinkSpeed": 0.3,
        "slowPhaseThreshold": 0.6
      }
    },
    "chinese_sturgeon": {
      "name": "中华鲟",
      "emoji": "🐉",
      "value": 200,
      "shrink": 0.25,
      "initialEnergy": 120,
      "energyDecay": 3.5,
      "speedIncrease": 0.25,
      "maxSpeed": 2.5,
      "unlockLevel": 40,
      "zoneConfig": {
        "initialWidthMultiplier": 0.9,
        "fastShrinkSpeed": 2.8,
        "slowShrinkSpeed": 0.25,
        "slowPhaseThreshold": 0.55
      }
    },
    "paddlefish": {
      "name": "白鲟",
      "emoji": "🦈",
      "value": 180,
      "shrink": 0.24,
      "initialEnergy": 110,
      "energyDecay": 3.3,
      "speedIncrease": 0.23,
      "maxSpeed": 2.4,
      "unlockLevel": 42,
      "zoneConfig": {
        "initialWidthMultiplier": 0.92,
        "fastShrinkSpeed": 2.7,
        "slowShrinkSpeed": 0.26,
        "slowPhaseThreshold": 0.56
      }
    },
    "giant_salamander": {
      "name": "大鲵",
      "emoji": "🦎",
      "value": 150,
      "shrink": 0.23,
      "initialEnergy": 100,
      "energyDecay": 3.2,
      "speedIncrease": 0.22,
      "maxSpeed": 2.3,
      "unlockLevel": 38,
      "zoneConfig": {
        "initialWidthMultiplier": 0.95,
        "fastShrinkSpeed": 2.6,
        "slowShrinkSpeed": 0.27,
        "slowPhaseThreshold": 0.57
      }
    },
    "yangtze_finless": {
      "name": "江豚",
      "emoji": "🐬",
      "value": 300,
      "shrink": 0.28,
      "initialEnergy": 150,
      "energyDecay": 4.0,
      "speedIncrease": 0.30,
      "maxSpeed": 2.8,
      "unlockLevel": 45,
      "zoneConfig": {
        "initialWidthMultiplier": 0.85,
        "fastShrinkSpeed": 3.0,
        "slowShrinkSpeed": 0.22,
        "slowPhaseThreshold": 0.52
      }
    },
    "chinese_sucker": {
      "name": "中华倒刺鲃",
      "emoji": "🐟",
      "value": 85,
      "shrink": 0.20,
      "initialEnergy": 80,
      "energyDecay": 2.7,
      "speedIncrease": 0.18,
      "maxSpeed": 2.0,
      "unlockLevel": 35,
      "zoneConfig": {
        "initialWidthMultiplier": 1.05,
        "fastShrinkSpeed": 2.4,
        "slowShrinkSpeed": 0.32,
        "slowPhaseThreshold": 0.62
      }
    },
    "northern_snakehead": {
      "name": "乌鳢",
      "emoji": "🐍",
      "value": 75,
      "shrink": 0.19,
      "initialEnergy": 78,
      "energyDecay": 2.6,
      "speedIncrease": 0.17,
      "maxSpeed": 1.95,
      "unlockLevel": 33,
      "zoneConfig": {
        "initialWidthMultiplier": 1.06,
        "fastShrinkSpeed": 2.35,
        "slowShrinkSpeed": 0.33,
        "slowPhaseThreshold": 0.63
      }
    },
    "wuchang_fish": {
      "name": "武昌鱼",
      "emoji": "🐠",
      "value": 68,
      "shrink": 0.18,
      "initialEnergy": 75,
      "energyDecay": 2.5,
      "speedIncrease": 0.16,
      "maxSpeed": 1.85,
      "unlockLevel": 31,
      "zoneConfig": {
        "initialWidthMultiplier": 1.08,
        "fastShrinkSpeed": 2.25,
        "slowShrinkSpeed": 0.34,
        "slowPhaseThreshold": 0.64
      }
    },

    // 传说鱼类 (25-30种) - 特殊场景
    "dragon_fish": {
      "name": "龙鱼",
      "emoji": "🐲",
      "value": 500,
      "shrink": 0.30,
      "initialEnergy": 200,
      "energyDecay": 4.5,
      "speedIncrease": 0.35,
      "maxSpeed": 3.0,
      "unlockLevel": 50,
      "zoneConfig": {
        "initialWidthMultiplier": 0.8,
        "fastShrinkSpeed": 3.2,
        "slowShrinkSpeed": 0.2,
        "slowPhaseThreshold": 0.5
      }
    },
    "golden_dragon": {
      "name": "金龙鱼",
      "emoji": "🐉",
      "value": 800,
      "shrink": 0.32,
      "initialEnergy": 250,
      "energyDecay": 5.0,
      "speedIncrease": 0.40,
      "maxSpeed": 3.5,
      "unlockLevel": 60,
      "zoneConfig": {
        "initialWidthMultiplier": 0.75,
        "fastShrinkSpeed": 3.5,
        "slowShrinkSpeed": 0.18,
        "slowPhaseThreshold": 0.48
      }
    },
    "phoenix_fish": {
      "name": "凤鱼",
      "emoji": "🦅",
      "value": 600,
      "shrink": 0.31,
      "initialEnergy": 220,
      "energyDecay": 4.7,
      "speedIncrease": 0.37,
      "maxSpeed": 3.2,
      "unlockLevel": 55,
      "zoneConfig": {
        "initialWidthMultiplier": 0.78,
        "fastShrinkSpeed": 3.3,
        "slowShrinkSpeed": 0.19,
        "slowPhaseThreshold": 0.49
      }
    },
    "crystal_fish": {
      "name": "水晶鱼",
      "emoji": "💎",
      "value": 1000,
      "shrink": 0.35,
      "initialEnergy": 300,
      "energyDecay": 5.5,
      "speedIncrease": 0.45,
      "maxSpeed": 4.0,
      "unlockLevel": 70,
      "zoneConfig": {
        "initialWidthMultiplier": 0.7,
        "fastShrinkSpeed": 3.8,
        "slowShrinkSpeed": 0.15,
        "slowPhaseThreshold": 0.45
      }
    },
    "rainbow_fish": {
      "name": "彩虹鱼",
      "emoji": "🌈",
      "value": 750,
      "shrink": 0.33,
      "initialEnergy": 280,
      "energyDecay": 5.2,
      "speedIncrease": 0.42,
      "maxSpeed": 3.7,
      "unlockLevel": 65,
      "zoneConfig": {
        "initialWidthMultiplier": 0.72,
        "fastShrinkSpeed": 3.6,
        "slowShrinkSpeed": 0.16,
        "slowPhaseThreshold": 0.46
      }
    },
    "mythical_koi": {
      "name": "神话锦鲤",
      "emoji": "🎋",
      "value": 1500,
      "shrink": 0.38,
      "initialEnergy": 400,
      "energyDecay": 6.0,
      "speedIncrease": 0.50,
      "maxSpeed": 4.5,
      "unlockLevel": 80,
      "zoneConfig": {
        "initialWidthMultiplier": 0.65,
        "fastShrinkSpeed": 4.0,
        "slowShrinkSpeed": 0.12,
        "slowPhaseThreshold": 0.42
      }
    }
  },
  "fishTable": {
    "common": ["crucian_carp", "goldfish", "small_crucian", "white_striped"],
    "rare": ["grass_carp", "silver_carp", "bighead_carp"],
    "epic": ["black_carp", "carp", "catfish"],
    "legend": ["sturgeon"]
  },
  "progressSystem": {
    "unlockThresholds": [0, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28, 30, 31, 32, 33, 35, 35, 38, 40, 42, 45, 50, 55, 60, 65, 70, 80],
    "scenes": [
      { "name": "村庄池塘", "unlockAt": 0, "description": "宁静的村庄小池塘" },
      { "name": "山间小溪", "unlockAt": 15, "description": "清澈的山间溪流" },
      { "name": "湖心深处", "unlockAt": 35, "description": "神秘的湖心深水区" },
      { "name": "长江支流", "unlockAt": 50, "description": "奔腾的长江支流" },
      { "name": "东海近岸", "unlockAt": 70, "description": "波涛汹涌的东海" },
      { "name": "传说之地", "unlockAt": 100, "description": "神话传说中的钓鱼圣地" }
    ]
  },
  "gameState": {
    "totalCaught": 0,
    "unlockedFish": ["crucian_carp", "goldfish", "small_crucian", "white_striped"],
    "currentScene": 0
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