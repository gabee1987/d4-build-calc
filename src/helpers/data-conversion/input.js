const data = {
	"Frost Bolt": {
		connections: [ "Basic", "Enhanced Frost Bolt" ],
		description: `Lucky Hit Chance: {#}%
Throw a bolt of frost at an enemy, dealing {#}% damage and Chilling them for {#}%.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.
— Enchantment Effect —
Direct damage from Skills applies up to {#}% Chill.`,
		id: 0,
		maxPoints: 5,
		values: [ "30", "35", "15" ],
		extraValues: [ "30" ],
		x: -195.614,
		y: -247.035
	},
	"Enhanced Frost Bolt": {
		baseSkill: "Frost Bolt",
		connections: [ "Frost Bolt", "Flickering Frost Bolt", "Glinting Frost Bolt" ],
		description: `Frost Bolt has a {#}% chance to explode on Chilled enemies, hitting surrounding enemies. Chance increased to 100% against Frozen enemies.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.`,
		id: 1,
		maxPoints: 1,
		values: [ "15" ],
		x: -336.656,
		y: -421.415
	},
	"Flickering Frost Bolt": {
		baseSkill: "Frost Bolt",
		connections: [ "Enhanced Frost Bolt" ],
		description: `Frost Bolt makes Frozen enemies Vulnerable for {#} seconds.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.`,
		id: 2,
		maxPoints: 1,
		values: [ "3" ],
		x: -592.019,
		y: -455.675
	},
	"Glinting Frost Bolt": {
		baseSkill: "Frost Bolt",
		connections: [ "Enhanced Frost Bolt" ],
		description: `Frost Bolt generates {#} Mana when hitting Chilled or Frozen enemies.
Tags: Basic, Frost, Chill, Damage, Cold, Crowd Control.`,
		id: 3,
		maxPoints: 1,
		values: [ "4" ],
		x: -263.99,
		y: -545.8
	},
	"Spark": {
		connections: [ "Basic", "Enhanced Spark" ],
		description: `Lucky Hit Chance: {#}%
Launch a bolt of lightning that shocks an enemy {#} times, dealing {#}% damage each hit.
Tags: Basic, Shock, Damage, Lightning.
— Enchantment Effect —
Killing an enemy has a {#}% chance to form a Crackling Energy.`,
		id: 4,
		maxPoints: 5,
		values: [ "9", "4", "8" ],
		extraValues: [ "10" ],
		x: -489.038,
		y: -81.23
	},
	"Enhanced Spark": {
		baseSkill: "Spark",
		connections: [ "Spark", "Flickering Spark", "Glinting Spark" ],
		description: `Each time Spark hits its primary target, it has a {#}% chance to hit up to {#} additional enemies, dealing {#}% damage. If there are no other enemies to hit, Spark instead deals x{#}% increased damage to its primary target.
Tags: Basic, Shock, Damage, Lightning.`,
		id: 5,
		maxPoints: 1,
		values: [ "20", "3", "6", "20" ],
		x: -762.794,
		y: -204.92
	},
	"Flickering Spark": {
		baseSkill: "Spark",
		connections: [ "Enhanced Spark" ],
		description: `Each time Spark hits an enemy it has a {#}% chance to form a Crackling Energy.
Tags: Basic, Shock, Damage, Lightning.`,
		id: 6,
		maxPoints: 1,
		values: [ "3" ],
		x: -782.894,
		y: -342.245
	},
	"Glinting Spark": {
		baseSkill: "Spark",
		connections: [ "Enhanced Spark" ],
		description: `Spark grants +{#}% increased Critical Strike Chance per cast for {#} seconds, up to +{#}%.
Tags: Basic, Shock, Damage, Lightning.`,
		id: 7,
		maxPoints: 1,
		values: [ "2", "3", "10" ],
		x: -1028.789,
		y: -207.505
	},
	"Arc Lash": {
		connections: [ "Basic", "Enhanced Arc Lash" ],
		description: `Lucky Hit Chance: {#}%
Unleash arcing lightning that deals {#}% damage to enemies in front of you. Every {#} times Arc Lash swipes, it Stuns all enemies hit for {#} seconds.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.
— Enchantment Effect —
When you use a Cooldown, enemies around you are Stunned for {#} seconds.`,
		id: 8,
		maxPoints: 5,
		values: [ "30", "42", "10", "2" ],
		extraValues: [ "0.5" ],
		x: 487.781,
		y: -80.27
	},
	"Enhanced Arc Lash": {
		baseSkill: "Arc Lash",
		connections: [ "Arc Lash", "Glinting Arc Lash", "Flickering Arc Lash" ],
		description: `If Arc Lash's initial swipe Critically Strikes, it swipes an additional time.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.`,
		id: 9,
		maxPoints: 1,
		x: 765.421,
		y: -208.87
	},
	"Glinting Arc Lash": {
		baseSkill: "Arc Lash",
		connections: [ "Enhanced Arc Lash" ],
		description: `Hitting a Stunned enemy with Arc Lash reduces your Cooldowns by {#} seconds.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.`,
		id: 10,
		maxPoints: 1,
		values: [ "0.25" ],
		x: 1040.126,
		y: -209
	},
	"Flickering Arc Lash": {
		baseSkill: "Arc Lash",
		connections: [ "Enhanced Arc Lash" ],
		description: `Gain +{#}% Movement Speed for {#} seconds per enemy hit with Arc Lash, up to +{#}%.
Tags: Basic, Shock, Damage, Lightning, Crowd Control.`,
		id: 11,
		maxPoints: 1,
		values: [ "6", "5", "18" ],
		x: 759.211,
		y: -351.28
	},
	"Fire Bolt": {
		connections: [ "Basic", "Enhanced Fire Bolt" ],
		description: `Lucky Hit Chance: {#}%
Hurl a flaming bolt, dealing {#}% damage and Burning for {#}% damage over {#} seconds.
Tags: Basic, Pyromancy, Damage, Fire, Burn.
— Enchantment Effect —
Direct damage from Skills applies up to an additional {#}% Burning damage over {#} seconds.`,
		id: 12,
		maxPoints: 5,
		values: [ "20", "10", "40", "8" ],
		extraValues: [ "23", "8" ],
		x: 202.516,
		y: -251.18
	},
	"Enhanced Fire Bolt": {
		baseSkill: "Fire Bolt",
		connections: [ "Fire Bolt", "Glinting Fire Bolt", "Flickering Fire Bolt" ],
		description: `Fire Bolt pierces through Burning enemies.
Tags: Basic, Pyromancy, Damage, Fire, Burn.`,
		id: 13,
		maxPoints: 1,
		x: 333.76,
		y: -423.11
	},
	"Glinting Fire Bolt": {
		baseSkill: "Fire Bolt",
		connections: [ "Enhanced Fire Bolt" ],
		description: `Critical Strikes with Fire Bolt increase the Burning damage you deal to the enemy by x{#}% for {#} seconds.
Tags: Basic, Pyromancy, Damage, Fire, Burn.`,
		id: 14,
		maxPoints: 1,
		values: [ "20", "4" ],
		x: 586.526,
		y: -457.72
	},
	"Flickering Fire Bolt": {
		baseSkill: "Fire Bolt",
		connections: [ "Enhanced Fire Bolt" ],
		description: `Fire Bolt generates {#} Mana when hitting a Burning enemy.
Tags: Basic, Pyromancy, Damage, Fire, Burn.`,
		id: 15,
		maxPoints: 1,
		values: [ "2" ],
		x: 249.014,
		y: -546.625
	}
}

module.exports = data;