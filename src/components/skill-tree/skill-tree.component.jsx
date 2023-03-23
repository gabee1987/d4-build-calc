import React, { useRef, useEffect, useState } from "react";
import Tree from "react-d3-tree";
import * as d3 from "d3";

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
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  // const skillTreeData = createSkillTreeData(skillData);
  const skillTreeData = sorcererData;
  const nodeSize = { x: 150, y: 150 };

  const generateTree = () => {
    const root = d3.hierarchy(skillTreeData);
    console.log("skillTreeData: " + skillTreeData);
    const treeLayout = d3
      .tree()
      .size([containerStyles.width, containerStyles.height]);
    treeLayout(root);

    console.log("d3 root:" + root);
    console.log("treeLayout: " + treeLayout);

    // Set custom positions
    root.each((node) => {
      if (node.data.x !== undefined) {
        node.x = node.data.x;
      }
      if (node.data.y !== undefined) {
        node.y = node.data.y;
      }
    });

    setNodes(root.descendants());
    setLinks(root.links());
  };

  useEffect(() => {
    generateTree();
  }, []);

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
      // <g transform={`translate(${nodeDatum.x}, ${nodeDatum.y})`}>
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
      //</g>
    );
  };

  const customLinkPath = (linkDatum) => {
    const source = linkDatum.source;
    const target = linkDatum.target;
    console.log("customLinkPath source.x: " + source.x);
    console.log("customLinkPath target.x: " + target.x);
    return `M${source.x},${source.y} L${target.x},${target.y}`;
  };

  // const updateSkillTreeData = (skillTreeData) => {
  //   skillTreeData.forEach((cluster, index) => {
  //     cluster.x = index * 300;
  //     cluster.y = index * 150;
  //   });
  //   return skillTreeData;
  // };

  // const customPathFunc = (source, destination, orientation) => {
  //   const s = { x: source.x, y: source.y + source.radius };
  //   const d = { x: destination.x, y: destination.y - destination.radius };

  //   const dx = d.x - s.x;
  //   const dy = d.y - s.y;
  //   const dr = Math.sqrt(dx * dx + dy * dy);

  //   const angle = 45; // or 60
  //   const angleRad = (angle * Math.PI) / 180;
  //   const rx = dr * Math.cos(angleRad);
  //   const ry = dr * Math.sin(angleRad);

  //   return `M${s.x},${s.y}C${s.x + rx},${s.y + ry} ${d.x - rx},${d.y - ry} ${
  //     d.x
  //   },${d.y}`;
  // };

  const straightPathFunc = (linkDatum, orientation) => {
    const { source, target } = linkDatum;
    return orientation === "horizontal"
      ? `M${source.y},${source.x}L${target.y},${target.x}`
      : `M${source.x},${source.y}L${target.x},${target.y}`;
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
        translate={{ x: nodeSize.x, y: nodeSize.y }}
        // renderCustomNodeElement={renderCustomNodeElement}
        // renderCustomNodeElement={(rd3tProps) => (
        //   <SkillNodeComponent {...rd3tProps} />
        // )}
        orientation="vertical"
        // pathFunc={customLinkPath}
        collapsible="{false}"
        pathFunc="straight"
        pathClassFunc={() => "link"}
        scaleExtent={{ max: 3, min: 0.5 }}
        shouldCollapseNeighborNodes={false}
        rootNodeClassName="root-node"
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
