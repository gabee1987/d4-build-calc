const data = {
  Momentum: {
    connections: ["Key Passive"],
    description: `Cutthroat Skills grant a stack of Momentum for 8 seconds if they either:
• Hit a Stunned, Dazed, or Frozen enemy
• Hit any enemy from behind
While at 3 stacks of Momentum you gain:
• 20% increased Damage Reduction
• x30% increased Energy Regeneration
• +15% increased Movement Speed
Tags: Frozen, Daze, Cutthroat, Crowd Control, Energy, Damage Reduction, Movement.`,
    id: 118,
    maxPoints: 1,
    x: -721.136,
    y: -1.72,
  },
  "Close Quarters Combat": {
    connections: ["Key Passive"],
    description: `Damaging a Close enemy with Marksman or Cutthroat Skills each grant a +10% Attack Speed bonus for 8 seconds.
While both Attack Speed bonuses are active, you deal x20% increased damage against Crowd Controlled enemies.
Tags: Marksman, Cutthroat, Crowd Control, Attack Speed, Damage.`,
    id: 119,
    maxPoints: 1,
    x: -564.571,
    y: 251.22,
  },
  Victimize: {
    connections: ["Key Passive"],
    description: `Lucky Hit: Dealing direct damage to a Vulnerable enemy has up to a 30% chance to cause an explosion, dealing 23% of the original damage to them and surrounding enemies.
Tags: Vulnerable, Damage, Physical, Lucky Hit.`,
    id: 120,
    maxPoints: 1,
    x: 493.144,
    y: 247.36,
  },
  Exposure: {
    connections: ["Key Passive"],
    description: `Lucky Hit: Dealing direct damage to an enemy affected by a Trap Skill has up to a 25% chance to:
• Reduce the active Cooldowns of your Trap Skills by 20%
• Drop a cluster of exploding Stun Grenades that deal 40% total Physical damage and Stun enemies for 0.5 seconds
Tags: Trap, Grenade, Damage, Physical, Cooldown, Crowd Control, Lucky Hit.`,
    id: 121,
    maxPoints: 1,
    x: 779.668,
    y: -2.585,
  },
  Precision: {
    connections: ["Key Passive"],
    description: `Critical Strikes with Marksman Skills grant you Precision. You gain x4% increased Critical Strike Damage per stack of Precision, up to a maximum of x20%.
When you reach maximum Precision, your next Marksman Skill is a guaranteed Critical Strike that deals x40% increased Critical Strike Damage, then consumes all stacks of Precision.
Tags: Marksman, Critical Strikes, Damage.`,
    id: 122,
    maxPoints: 1,
    x: 3.252,
    y: 383.425,
  },
};

module.exports = data;
