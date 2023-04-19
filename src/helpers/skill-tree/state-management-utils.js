export function encodeSkillTreeState(classname, skillTreeState) {
  console.log("skillTreeSTate -> ", skillTreeState);
  if (!skillTreeState) return "";

  const skillState = skillTreeState[classname];
  if (!skillState) return "";

  const skillStateString = skillState
    .filter((node) => node.allocatedPoints > 0)
    .map((node) => `${node.id}:${node.allocatedPoints}`)
    .join(";");

  return `skill-tree/${classname}/${skillStateString}`;
}

export function decodeSkillTreeState(encodedString) {
  const [, classname, skillStateString] = encodedString.split("/");

  const skillTreeState = skillStateString.split(";").reduce((acc, entry) => {
    const [skillId, points] = entry.split(":");
    return { ...acc, [skillId]: parseInt(points, 10) };
  }, {});

  return { classname, skillTreeState: { [classname]: skillTreeState } };
}

export function generateSkillTreeUrl(classname, nodes) {
  const allocatedSkills = [];

  const traverseNodes = (node) => {
    if (node.allocatedPoints > 0) {
      allocatedSkills.push(`${node.id}:${node.allocatedPoints}`);
    }

    if (node.children) {
      node.children.forEach(traverseNodes);
    }
  };

  nodes.forEach(traverseNodes);

  return `/skill-tree/${classname}/${allocatedSkills.join(";")}`;
}
