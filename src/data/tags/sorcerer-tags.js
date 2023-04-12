import TagType from "./tag-types";

const Tags = {
  BASIC: { name: "Basic", type: TagType.SKILL_CATEGORY },
  CORE: { name: "Core", type: TagType.SKILL_CATEGORY },
  DEFENSIVE: { name: "Defensive", type: TagType.SKILL_CATEGORY },
  CONJURATION: { name: "Conjuration", type: TagType.SKILL_CATEGORY },
  MASTERY: { name: "Mastery", type: TagType.SKILL_CATEGORY },
  ULTIMATE: { name: "Ultimate", type: TagType.SKILL_CATEGORY },
  CAPSTONE: { name: "Capstone", type: TagType.SKILL_CATEGORY },

  FROST: { name: "Frost", type: TagType.DAMAGE_TYPE },
  FIRE: { name: "Fire", type: TagType.DAMAGE_TYPE },
  LIGHTNING: { name: "Lightning", type: TagType.DAMAGE_TYPE },
  SHOCK: { name: "Shock", type: TagType.DAMAGE_TYPE },

  CHILL: { name: "Chill", type: TagType.SKILL_EFFECT },
  BURN: { name: "Burn", type: TagType.SKILL_EFFECT },
  FROZEN: { name: "Frozen", type: TagType.SKILL_EFFECT },
  VULNERABLE: { name: "Vulnerable", type: TagType.SKILL_EFFECT },

  ACTIVE: { name: "Active", type: TagType.SKILL_TYPE },
  PASSIVE: { name: "Passive", type: TagType.SKILL_TYPE },
  ENHANCMENT: { name: "Enhancement", type: TagType.SKILL_TYPE },
  UPGRADE: { name: "Upgrade", type: TagType.SKILL_TYPE },

  CROWD_CONTROL: { name: "Crowd Control", type: TagType.OTHER },
  PYROMANCY: { name: "Pyromancy", type: TagType.OTHER },
  MANA: { name: "Mana", type: TagType.RESOURCE },
  CHANNELED: { name: "Channeled", type: TagType.OTHER },
  IMMUNE: { name: "Immune", type: TagType.OTHER },
  BARRIER: { name: "Barrier", type: TagType.OTHER },
  COOLDOWN: { name: "Cooldown", type: TagType.OTHER },
  DAMAGE_REDUCTION: { name: "Damage Reduction", type: TagType.OTHER },
  ELITE_MONSTERS: { name: "Elite Monsters", type: TagType.OTHER },
  CRITICAL_STRIKES: { name: "Critical Strikes", type: TagType.OTHER },

  // Add more tags as needed
};

Object.freeze(Tags);
