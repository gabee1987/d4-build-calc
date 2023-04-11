const data = {
  Shatter: {
    connections: ["Key Passive"],
    description: `After Freeze expires, enemies explode for 25% of the damage you dealt to them while Frozen.
Tags: Frozen, Crowd Control, Damage.`,
    id: 124,
    maxPoints: 1,
    x: -633.197,
    y: 203.26,
  },
  Avalanche: {
    connections: ["Key Passive"],
    description: `Lucky Hit: Your Frost Skills have up to a 10% chance to make your next cast of Ice Shards, Frozen Orb, or Blizzard consume no Mana and deal x40% increased damage. Chance is doubled against Vulnerable enemies.
Tags: Vulnerable, Lucky Hit, Mana, Damage, Frost.`,
    id: 140,
    maxPoints: 1,
    x: -636.932,
    y: -2.225,
  },
  Combustion: {
    connections: ["Key Passive"],
    description: `Your Burning effects deal x{2/4/6/8/10/12/14/16/18/20}% increased damage per unique source of Burning you have applied to the enemy. If the enemy is Burning from 3 or more sources, this bonus is doubled.
Tags: Burn, Damage.`,
    id: 141,
    maxPoints: 1,
    x: 633.813,
    y: -3.15,
  },
  "Esu's Ferocity": {
    connections: ["Key Passive"],
    description: `Your Fire Critical Strike Damage is increased by x25% against enemies above 50% Life. Your Fire Critical Strike Chance is increased by +5% against enemies below 50% Life.
Killing an enemy with a Critical Strike grants both bonuses against all enemies for 3 seconds.
Tags: Damage, Critical Strikes, Life, Fire.`,
    id: 127,
    maxPoints: 1,
    x: 637.394,
    y: 202.605,
  },
  "Overflowing Energy": {
    connections: ["Key Passive"],
    description: `Crackling Energy hits 1 additional enemy. Each time Crackling Energy hits an enemy, your Shock Skill Cooldowns are reduced by 0.1 seconds, increased to 0.25 seconds against Elites.
Tags: Crackling Energy, Cooldown, Elite Monsters, Damage, Shock.`,
    id: 128,
    maxPoints: 1,
    x: -187.52,
    y: 388.355,
  },
  "Vyr's Mastery": {
    connections: ["Key Passive"],
    description: `Close enemies take x10% increased damage from your Shock Skills and deal 20% less damage to you. Critical Strikes increase these bonuses by 25% for 3 seconds.
Tags: Shock, Damage, Damage Reduction, Critical Strikes.`,
    id: 129,
    maxPoints: 1,
    x: 185.762,
    y: 389.005,
  },
};

module.exports = data;
