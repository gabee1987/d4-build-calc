import barbarian from "../../data/barbarian.json";
import necromancer from "../../data/necromancer.json";
import sorcerer from "../../data/sorcerer.json";
import rogue from "../../data/rogue.json";
import druid from "../../data/druid.json";

export const loadSkills = () => {
  const classesJson = {
    Barbarian: barbarian,
    Necromancer: necromancer,
    Sorcerer: sorcerer,
    Rogue: rogue,
    Druid: druid,
  };
  let skills = [];

  Object.entries(classesJson).forEach(([className, classJson]) => {
    const classSkills = flattenSkillData(classJson, className);
    skills = [...skills, ...classSkills];
  });

  return skills;
};

const flattenSkillData = (data, className) => {
  const skills = [];

  function traverse(node, baseSkill = null) {
    if (node.nodeType === "activeSkill") {
      baseSkill = node;
    }

    if (
      node.nodeType &&
      node.nodeType.includes("activeSkill") &&
      node.name !== ""
    ) {
      const skill = {
        id: node.id,
        name: node.name,
        class: className,
        baseSkill: baseSkill,
        category: node.description.tags[0],
        maxPoints: node.maxPoints,
        description: node.description.description,
        tags: node.description.tags,
        luckyHitValues: node.luckyHitValues,
        manaCostValues: node.manaCostValues,
        values1: node.values1,
        children: [],
      };

      // Add the skill to the base skill's children if it's not the base skill itself
      if (baseSkill !== node) {
        const baseSkillObj = skills.find((skill) => skill.id === baseSkill.id);
        if (baseSkillObj) {
          baseSkillObj.children.push(skill);
        }
      } else {
        skills.push(skill);
      }
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, baseSkill));
    }

    if (node.connections) {
      node.connections.forEach((connection) => {
        const parentNode = skills.find((n) => n.name === connection);
        if (parentNode) {
          traverse(parentNode, baseSkill);
        }
      });
    }
  }

  traverse(data);
  return skills;
};
