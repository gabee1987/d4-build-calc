import barbarianData from "../../data/barbarian.json";
import necromancerData from "../../data/necromancer.json";
import sorcererData from "../../data/sorcerer.json";
import rogueData from "../../data/rogue.json";
import druidData from "../../data/druid.json";

export const parseSkillTreeUrl = (encodedString) => {
  const [, classname, skillStateString] = encodedString.match(
    /(?:\/skill-tree\/)([^/]+)(?:\/([^/]*))?/
  );

  const skillTreeState = skillStateString
    ? skillStateString.split(";").reduce((acc, entry) => {
        const [skillId, points] = entry.split(":");
        return { ...acc, [skillId]: parseInt(points, 10) };
      }, {})
    : {};

  return { classname, skillTreeState: { [classname]: skillTreeState } };
};

export const generateSkillTreeUrl = (classname, nodes) => {
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
};

export const handleSetSkillTreeData = (
  selectedClass,
  initialSkillTreeData,
  setSkillTreeState,
  navigate,
  skillTreeStateFromUrl = {}
) => {
  // Update initialSkillTreeData with the allocated points from skillTreeStateFromUrl
  const updatedSkillTreeData = JSON.parse(JSON.stringify(initialSkillTreeData));
  console.log("updatedSkillTreeData", updatedSkillTreeData);
  const traverseAndUpdatePoints = (node) => {
    if (skillTreeStateFromUrl[node.id]) {
      node.allocatedPoints = skillTreeStateFromUrl[node.id];
    }

    if (node.children) {
      node.children.forEach(traverseAndUpdatePoints);
    }
  };

  traverseAndUpdatePoints(updatedSkillTreeData);

  setSkillTreeState((prevState) => {
    const updatedState = {
      ...prevState,
      [selectedClass]: updatedSkillTreeData,
    };
    const url = generateSkillTreeUrl(
      selectedClass,
      updatedState[selectedClass]
    );
    navigate(url, { replace: true });
    return updatedState;
  });
};

export const updateTreeFromUrl = (nodes) => {
  nodes.forEach((node) => {
    if (node.allocatedPoints > 0) {
      // Call the onPointAllocated function with a modified version of the node object
      //onPointAllocated({ ...node, allocatedPoints: 0 });
      // Update the total points spent counter
      //const updatedTotalAllocatedPoints = calculateTotalAllocatedPoints(nodes);
    }
  });
};

export const handleInitialDataLoad = (classname) => {
  let initialData;

  switch (classname) {
    case "Barbarian":
      initialData = barbarianData;
      break;
    case "Necromancer":
      initialData = necromancerData;
      break;
    case "Sorcerer":
      initialData = sorcererData;
      break;
    case "Rogue":
      initialData = rogueData;
      break;
    case "Druid":
      initialData = druidData;
      break;
    default:
      initialData = barbarianData;
      break;
  }

  return initialData;
};

export const generateUpdatedSkillTreeData = (
  selectedClass,
  classname,
  skillTreeStateFromUrl
) => {
  let initialData;

  switch (selectedClass) {
    case "Barbarian":
      initialData = barbarianData;
      break;
    case "Necromancer":
      initialData = necromancerData;
      break;
    case "Sorcerer":
      initialData = sorcererData;
      break;
    case "Rogue":
      initialData = rogueData;
      break;
    case "Druid":
      initialData = druidData;
      break;
    default:
      initialData = barbarianData;
      break;
  }

  console.log("initialData -> ", initialData);
  const updatedSkillTreeData = JSON.parse(JSON.stringify(initialData));
  console.log("updatedSkillTreeData -> ", updatedSkillTreeData);

  console.log(
    "skillTreeStateFromUrl[selectedClass] -> ",
    skillTreeStateFromUrl[selectedClass]
  );

  if (classname === selectedClass && skillTreeStateFromUrl[selectedClass]) {
    const traverseAndUpdatePoints = (node) => {
      if (skillTreeStateFromUrl[selectedClass][node.id]) {
        node.allocatedPoints = skillTreeStateFromUrl[selectedClass][node.id];
      }

      if (node.children) {
        node.children.forEach(traverseAndUpdatePoints);
      }
    };

    traverseAndUpdatePoints(updatedSkillTreeData);
  }

  return updatedSkillTreeData;
};
