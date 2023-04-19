export function parseSkillTreeUrl(encodedString) {
  const [, classname, skillStateString] = encodedString.match(
    /(?:\/skill-tree\/)([^/]+)(?:\/([^/]*))?/
  );
  console.log("-> ", encodedString);
  console.log("-> ", classname);
  console.log("-> ", skillStateString);

  const skillTreeState = skillStateString
    ? skillStateString.split(";").reduce((acc, entry) => {
        const [skillId, points] = entry.split(":");
        return { ...acc, [skillId]: parseInt(points, 10) };
      }, {})
    : {};

  return { classname, skillTreeState: { [classname]: skillTreeState } };
}

export function generateSkillTreeUrl(classname, nodes) {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return `/skill-tree/${classname}/`;
  }

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

export function handleSetSkillTreeData(
  selectedClass,
  newData,
  setSkillTreeState,
  navigate
) {
  setSkillTreeState((prevState) => {
    const updatedState = { ...prevState, [selectedClass]: newData };
    const url = generateSkillTreeUrl(
      selectedClass,
      updatedState[selectedClass]
    );
    navigate(url, { replace: true });
    return updatedState;
  });
}
