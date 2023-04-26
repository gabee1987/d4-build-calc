import TagType from "./tag-types";

const Tags = {
  BASIC: { name: "Basic", type: TagType.SKILL_CATEGORY, className: "basic" },
  CORE: { name: "Core", type: TagType.SKILL_CATEGORY, className: "core" },
  DEFENSIVE: {
    name: "Defensive",
    type: TagType.SKILL_CATEGORY,
    className: "defensive",
  },
  ULTIMATE: {
    name: "Ultimate",
    type: TagType.SKILL_CATEGORY,
    className: "ultimate",
  },
  CAPSTONE: {
    name: "Capstone",
    type: TagType.SKILL_CATEGORY,
    className: "capstone",
  },

  // =========== BARBARIAN
  BRAWLING: {
    name: "Brawling",
    type: TagType.SKILL_CATEGORY,
    className: "brawling",
  },
  WEAPON_MASTERY: {
    name: "Weapon Mastery",
    type: TagType.SKILL_CATEGORY,
    className: "weapon-mastery",
  },

  // =========== NECROMANCER
  MACABRE: {
    name: "Macabre",
    type: TagType.SKILL_CATEGORY,
    className: "macabre",
  },
  CORRUPTION: {
    name: "Corruption",
    type: TagType.SKILL_CATEGORY,
    className: "curroption",
  },
  SUMMONING: {
    name: "Summoning",
    type: TagType.SKILL_CATEGORY,
    className: "summoning",
  },

  // =========== SORCERER
  CONJURATION: {
    name: "Conjuration",
    type: TagType.SKILL_CATEGORY,
    className: "conjuration",
  },
  MASTERY: {
    name: "Mastery",
    type: TagType.SKILL_CATEGORY,
    className: "mastery",
  },

  // =========== DRUID
  SPIRIT: {
    name: "Spirit",
    type: TagType.SKILL_CATEGORY,
    className: "spirit",
  },
  COMPANION: {
    name: "Companion",
    type: TagType.SKILL_CATEGORY,
    className: "companion",
  },
  WRATH: {
    name: "Wrath",
    type: TagType.SKILL_CATEGORY,
    className: "wrath",
  },
  // =========== ROGUE
  AGILITY: {
    name: "Agility",
    type: TagType.SKILL_CATEGORY,
    className: "agility",
  },
  SUBTERFUGE: {
    name: "Subterfuge",
    type: TagType.SKILL_CATEGORY,
    className: "subterfuge",
  },
  IMBUEMENT: {
    name: "Imbuement",
    type: TagType.SKILL_CATEGORY,
    className: "imbuement",
  },

  FROST: { name: "Frost", type: TagType.DAMAGE_TYPE, className: "frost" },
  FIRE: { name: "Fire", type: TagType.DAMAGE_TYPE, className: "fire" },
  LIGHTNING: {
    name: "Lightning",
    type: TagType.DAMAGE_TYPE,
    className: "lightning",
  },
  SHOCK: { name: "Shock", type: TagType.DAMAGE_TYPE, className: "shock" },
  SHADOW: { name: "Shadow", type: TagType.DAMAGE_TYPE, className: "shadow" },
  POISON: { name: "Poison", type: TagType.DAMAGE_TYPE, className: "poison" },

  CHILL: { name: "Chill", type: TagType.SKILL_EFFECT, className: "chill" },
  BURN: { name: "Burn", type: TagType.SKILL_EFFECT, className: "burn" },
  FROZEN: { name: "Frozen", type: TagType.SKILL_EFFECT, className: "frozen" },
  COLD: { name: "Cold", type: TagType.SKILL_EFFECT, className: "cold" },
  VULNERABLE: {
    name: "Vulnerable",
    type: TagType.SKILL_EFFECT,
    className: "vulnerable",
  },
  BLEED: { name: "Bleed", type: TagType.SKILL_EFFECT, className: "bleed" },
  UNSTOPPABLE: {
    name: "Unstoppable",
    type: TagType.SKILL_EFFECT,
    className: "unstoppable",
  },

  ACTIVE: { name: "Active", type: TagType.SKILL_TYPE, className: "active" },
  PASSIVE: { name: "Passive", type: TagType.SKILL_TYPE, className: "passive" },
  ENHANCMENT: {
    name: "Enhancement",
    type: TagType.SKILL_TYPE,
    className: "enhancement",
  },
  UPGRADE: { name: "Upgrade", type: TagType.SKILL_TYPE, className: "upgrade" },

  CROWD_CONTROL: {
    name: "Crowd Control",
    type: TagType.OTHER,
    className: "crowd-control",
  },
  PYROMANCY: { name: "Pyromancy", type: TagType.OTHER, className: "pyromancy" },
  MANA: { name: "Mana", type: TagType.RESOURCE, className: "mana" },
  CHANNELED: { name: "Channeled", type: TagType.OTHER, className: "channeled" },
  IMMUNE: { name: "Immune", type: TagType.OTHER, className: "immune" },
  BARRIER: { name: "Barrier", type: TagType.OTHER, className: "barrier" },
  COOLDOWN: { name: "Cooldown", type: TagType.OTHER, className: "cooldown" },
  DAMAGE_REDUCTION: {
    name: "Damage Reduction",
    type: TagType.OTHER,
    className: "damage-reduction",
  },
  ELITE_MONSTERS: {
    name: "Elite Monsters",
    type: TagType.OTHER,
    className: "elite-monsters",
  },
  CRITICAL_STRIKES: {
    name: "Critical Strikes",
    type: TagType.OTHER,
    className: "critical-strikes",
  },
  DAMAGE: {
    name: "Damage",
    type: TagType.OTHER,
    className: "damage",
  },
  BLOOD: {
    name: "Blood",
    type: TagType.OTHER,
    className: "blood",
  },
  BONE: {
    name: "Bone",
    type: TagType.OTHER,
    className: "bone",
  },
  DARKNESS: {
    name: "Darkness",
    type: TagType.OTHER,
    className: "darkness",
  },
  STORM: {
    name: "Storm",
    type: TagType.OTHER,
    className: "storm",
  },
  EARTH: {
    name: "Earth",
    type: TagType.OTHER,
    className: "earth",
  },
  WEREWOLF: {
    name: "Werewolf",
    type: TagType.OTHER,
    className: "werewolf",
  },
  WEREBEAR: {
    name: "Werebear",
    type: TagType.OTHER,
    className: "werebear",
  },

  // Add more tags as needed
};

export default Tags;

Object.freeze(Tags);
