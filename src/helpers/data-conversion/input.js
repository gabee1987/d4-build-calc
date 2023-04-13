const data = {
  "Frost Bolt": {
    connections: ["Basic", "Enhanced Frost Bolt"],
    description: `Lucky Hit Chance: {#}%
Throw a bolt of frost at an enemy, dealing {35/38.5/42/45.5/49/52.5/56/59.5/63/66.5}% damage and Chilling them for 15%.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.
— Enchantment Effect —
Direct damage from Skills applies up to {15/16.5/18/19.5/21/22.5/24/25.5/27/28.5}% Chill.`,
    id: 0,
    maxPoints: 5,
    values: ["30"],
    x: -195.614,
    y: -247.035,
  },
  "Enhanced Frost Bolt": {
    baseSkill: "Frost Bolt",
    connections: ["Frost Bolt", "Flickering Frost Bolt", "Glinting Frost Bolt"],
    description: `Frost Bolt has a 15% chance to explode on Chilled enemies, hitting surrounding enemies. Chance increased to 100% against Frozen enemies.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.`,
    id: 1,
    maxPoints: 1,
    x: -336.656,
    y: -421.415,
  },
  "Flickering Frost Bolt": {
    baseSkill: "Frost Bolt",
    connections: ["Enhanced Frost Bolt"],
    description: `Frost Bolt makes Frozen enemies Vulnerable for 3 seconds.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.`,
    id: 2,
    maxPoints: 1,
    x: -592.019,
    y: -455.675,
  },
  "Glinting Frost Bolt": {
    baseSkill: "Frost Bolt",
    connections: ["Enhanced Frost Bolt"],
    description: `Frost Bolt generates 4 Mana when hitting Chilled or Frozen enemies.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.`,
    id: 3,
    maxPoints: 1,
    x: -263.99,
    y: -545.8,
  },
  Spark: {
    connections: ["Basic", "Enhanced Spark"],
    description: `Lucky Hit Chance: {#}%
Launch a bolt of lightning that shocks an enemy 4 times, dealing {8/8.8/9.6/10.4/11.2/12/12.8/13.6/14.4/15.2}% damage each hit.
Tags: Basic, Shock, Damage, Lightning.
— Enchantment Effect —
Killing an enemy has a {10/11/12/13/14/15/16/17/18/19}% chance to form a Crackling Energy.`,
    id: 4,
    maxPoints: 5,
    values: ["9"],
    x: -489.038,
    y: -81.23,
  },
  "Enhanced Spark": {
    baseSkill: "Spark",
    connections: ["Spark", "Flickering Spark", "Glinting Spark"],
    description: `Each time Spark hits its primary target, it has a 20% chance to hit up to 3 additional enemies, dealing {5.6/6.2/6.7/7.3/7.8/8.4/9/9.5/10.1/10.6}% damage. If there are no other enemies to hit, Spark instead deals x20% increased damage to its primary target.
Tags: Basic, Shock, Damage, Lightning.`,
    id: 5,
    maxPoints: 1,
    x: -762.794,
    y: -204.92,
  },
  "Flickering Spark": {
    baseSkill: "Spark",
    connections: ["Enhanced Spark"],
    description: `Each time Spark hits an enemy it has a 3% chance to form a Crackling Energy.
Tags: Basic, Shock, Damage, Lightning.`,
    id: 6,
    maxPoints: 1,
    x: -782.894,
    y: -342.245,
  },
  "Glinting Spark": {
    baseSkill: "Spark",
    connections: ["Enhanced Spark"],
    description: `Spark grants +2% increased Critical Strike Chance per cast for 3 seconds, up to +10%.
Tags: Basic, Shock, Damage, Lightning.`,
    id: 7,
    maxPoints: 1,
    x: -1028.789,
    y: -207.505,
  },
  "Arc Lash": {
    connections: ["Basic", "Enhanced Arc Lash"],
    description: `Lucky Hit Chance: {#}%
Unleash arcing lightning that deals {42/46.2/50.4/54.6/58.8/63/67.2/71.4/75.6/79.8}% damage to enemies in front of you. Every 10 times Arc Lash swipes, it Stuns all enemies hit for 2 seconds.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.
— Enchantment Effect —
When you use a Cooldown, enemies around you are Stunned for {0.5/0.55/0.6/0.65/0.7/0.75/0.8/0.85/0.9/0.95} seconds.`,
    id: 8,
    maxPoints: 5,
    values: ["30"],
    x: 487.781,
    y: -80.27,
  },
  "Enhanced Arc Lash": {
    baseSkill: "Arc Lash",
    connections: ["Arc Lash", "Glinting Arc Lash", "Flickering Arc Lash"],
    description: `If Arc Lash's initial swipe Critically Strikes, it swipes an additional time.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.`,
    id: 9,
    maxPoints: 1,
    x: 765.421,
    y: -208.87,
  },
  "Glinting Arc Lash": {
    baseSkill: "Arc Lash",
    connections: ["Enhanced Arc Lash"],
    description: `Hitting a Stunned enemy with Arc Lash reduces your Cooldowns by 0.25 seconds.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.`,
    id: 10,
    maxPoints: 1,
    x: 1040.126,
    y: -209,
  },
  "Flickering Arc Lash": {
    baseSkill: "Arc Lash",
    connections: ["Enhanced Arc Lash"],
    description: `Gain +6% Movement Speed for 5 seconds per enemy hit with Arc Lash, up to +18%.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.`,
    id: 11,
    maxPoints: 1,
    x: 759.211,
    y: -351.28,
  },
  "Fire Bolt": {
    connections: ["Basic", "Enhanced Fire Bolt"],
    description: `Lucky Hit Chance: {#}%
Hurl a flaming bolt, dealing {10/11/12/13/14/15/16/17/18/19}% damage and Burning for {40/44/48/52/56/60/64/68/72/76}% damage over 8 seconds.
Tags: Basic, Pyromancy, Damage, Fire, Burn.
— Enchantment Effect —
Direct damage from Skills applies up to an additional {23.2/25.6/28/30.4/32.8/35.2/37.6/40/42.4/44.8}% Burning damage over 8 seconds.`,
    id: 12,
    maxPoints: 5,
    values: ["20"],
    x: 202.516,
    y: -251.18,
  },
  "Enhanced Fire Bolt": {
    baseSkill: "Fire Bolt",
    connections: ["Fire Bolt", "Glinting Fire Bolt", "Flickering Fire Bolt"],
    description: `Fire Bolt pierces through Burning enemies.
Tags: Basic, Pyromancy, Damage, Fire, Burn.`,
    id: 13,
    maxPoints: 1,
    x: 333.76,
    y: -423.11,
  },
  "Glinting Fire Bolt": {
    baseSkill: "Fire Bolt",
    connections: ["Enhanced Fire Bolt"],
    description: `Critical Strikes with Fire Bolt increase the Burning damage you deal to the enemy by x20% for 4 seconds.
Tags: Basic, Pyromancy, Damage, Fire, Burn.`,
    id: 14,
    maxPoints: 1,
    x: 586.526,
    y: -457.72,
  },
  "Flickering Fire Bolt": {
    baseSkill: "Fire Bolt",
    connections: ["Enhanced Fire Bolt"],
    description: `Fire Bolt generates 2 Mana when hitting a Burning enemy.
Tags: Basic, Pyromancy, Damage, Fire, Burn.`,
    id: 15,
    maxPoints: 1,
    x: 249.014,
    y: -546.625,
  },
};

module.exports = data;
