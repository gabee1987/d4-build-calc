import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";

import SkillNodeComponent from "../skill-node/skill-node.component.jsx";
import sorcererData from "../../data/sorcerer-test.json";
import { convertClassDataToTreeData } from "../../helpers/class-data-converter.js";

import styles from "./skill-tree.styles.scss";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const SkillTreeComponent = ({
  skillData,
  allocatedPoints,
  activeSkills,
  onSkillClick,
  onSkillActivation,
}) => {
  const treeContainerRef = useRef(null);

  // const skillTreeData = createSkillTreeData(skillData);
  const skillTreeData = sorcererData;

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    // console.log(nodeDatum);
    console.log("nodeDatum.attributes: " + nodeDatum.name);
    console.log("nodeDatum.id: " + nodeDatum.id);
    console.log("nodeDatum.nodeType: " + nodeDatum.nodeType);
    // if (!nodeDatum || !nodeDatum.data) {
    //   return null;
    // }
    // const isActive = activeSkills.includes(nodeDatum.id);
    // const points = allocatedPoints[nodeDatum.allocatedPoints] || 0;

    const isActive = false;
    const points = 0;

    return (
      <SkillNodeComponent
        skill={nodeDatum}
        isActive={isActive}
        points={points}
        onClick={() => {
          toggleNode();
          onSkillClick(nodeDatum.attributes.id, points + 1);
        }}
        onActivation={() => onSkillActivation(nodeDatum.attributes.id)}
      />
    );
  };

  const handleSkillClick = (skillId, points) => {
    console.log("skill clicked");
    // setAllocatedPoints((prevAllocatedPoints) => {
    //   return { ...prevAllocatedPoints, [skillId]: points };
    // });
  };

  const allocatePoint = (skillId) => {
    console.log("Point allocated to: " + skillId);
    // setAllocatedPoints((prevAllocatedPoints) => {
    //   const points = prevAllocatedPoints[skillId] || 0;
    //   const skill = getSkillById(skillId);
    //   if (points < skill.maxPoints) {
    //     return { ...prevAllocatedPoints, [skillId]: points + 1 };
    //   }
    //   return prevAllocatedPoints;
    // });
  };

  const deallocatePoint = (skillId) => {
    // setAllocatedPoints((prevAllocatedPoints) => {
    //   const points = prevAllocatedPoints[skillId] || 0;
    //   if (points > 0) {
    //     return { ...prevAllocatedPoints, [skillId]: points - 1 };
    //   }
    //   return prevAllocatedPoints;
    // });
  };

  const toggleActiveSkill = (skillId) => {
    // setActiveSkills((prevActiveSkills) => {
    //   if (prevActiveSkills.includes(skillId)) {
    //     return prevActiveSkills.filter((id) => id !== skillId);
    //   } else {
    //     return [...prevActiveSkills, skillId];
    //   }
    // });
  };

  useEffect(() => {
    if (treeContainerRef.current) {
      treeContainerRef.current.scrollLeft =
        treeContainerRef.current.scrollWidth / 2;
    }
  }, []);

  return (
    <div
      className={styles.skillTree}
      ref={treeContainerRef}
      style={containerStyles}
    >
      <Tree
        data={skillTreeData}
        nodeSize={{ x: 150, y: 250 }}
        translate={{ x: 0, y: 50 }}
        renderCustomNodeElement={renderCustomNodeElement}
        orientation={"vertical"}
      />
    </div>
  );
};

// const renderRectSvgNode = ({ nodeDatum, toggleNode }) => (
//   <g>
//     <rect width="20" height="20" x="-10" onClick={toggleNode} />
//     <text fill="black" strokeWidth="1" x="20">
//       {nodeDatum.name}
//     </text>
//     {nodeDatum.attributes?.department && (
//       <text fill="black" x="20" dy="20" strokeWidth="1">
//         Department: {nodeDatum.attributes?.department}
//       </text>
//     )}
//   </g>
// );

// const renderNodeWithCustomEvents = ({
//   nodeDatum,
//   toggleNode,
//   handleNodeClick,
// }) => (
//   <g>
//     <circle r="15" onClick={() => handleNodeClick(nodeDatum)} />
//     <text fill="black" strokeWidth="1" x="20" onClick={toggleNode}>
//       {nodeDatum.name} (click me to toggle 👋)
//     </text>
//     {nodeDatum.attributes?.department && (
//       <text fill="black" x="20" dy="20" strokeWidth="1">
//         Department: {nodeDatum.attributes?.department}
//       </text>
//     )}
//   </g>
// );

// Patch Function for customizing the links bezween nodes
// const straightPathFunc = (linkDatum, orientation) => {
//   const { source, target } = linkDatum;
//   return orientation === "horizontal"
//     ? `M${source.y},${source.x}L${target.y},${target.x}`
//     : `M${source.x},${source.y}L${target.x},${target.y}`;
// };

// const SkillTreeComponent = ({ classData }) => {
//   const [nodes, setNodes] = useState([]);
//   // const treeData = convertClassDataToTreeData(sorcererData);

//   // useEffect(() => {
//   //   setNodes(sorcererData.nodes);
//   //   console.log(nodes);
//   //   console.log(data);
//   // }, []);

//   // const onNodeClick = (nodeId) => {
//   //   setNodes((prevNodes) =>
//   //     prevNodes.map((node) =>
//   //       node.id === nodeId ? { ...node, learned: !node.learned } : node
//   //     )
//   //   );
//   // };

//   return (
//     <div style={containerStyles}>
//       {/* <h1>HELLO!!!!!!</h1> */}
//       <Tree
//         data={sorcererData}
//         orientation="vertical"
//         translate={{ x: 150, y: 100 }}
//         zoomable
//         collapsible={false}
//         scaleExtent={{ max: 3, min: 1 }}
//         renderCustomNodeElement={renderRectSvgNode}
//         pathFunc={straightPathFunc}
//       />
//     </div>
//     // <div>
//     //   <SkillTree
//     //     nodes={nodes}
//     //     nodeWidth={180}
//     //     nodeHeight={100}
//     //     nodeSpacing={50}
//     //     onNodeClick={onNodeClick}
//     //   />
//     // </div>
//   );
// };

export default SkillTreeComponent;
