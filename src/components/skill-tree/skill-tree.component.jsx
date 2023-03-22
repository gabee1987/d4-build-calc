import React, { useState, useEffect } from "react";

import sorcererData from "../../data/sorcerer.json";
import "./skill-tree.styles.scss";

import {
  SkillTreeGroup,
  SkillTree,
  SkillProvider,
  SkillType,
  SkillGroupDataType,
} from "beautiful-skill-tree";

const SkillTreeComponent = () => {
  const [nodes, setNodes] = useState([]);
  
  useEffect(() => {
    setNodes(sorcererData.nodes);
    console.log(nodes);
    console.log(data);
  }, []);

  const onNodeClick = (nodeId) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, learned: !node.learned } : node
      )
    );
  };

  return (

    // <div>
    //   <SkillTree
    //     nodes={nodes}
    //     nodeWidth={180}
    //     nodeHeight={100}
    //     nodeSpacing={50}
    //     onNodeClick={onNodeClick}
    //   />
    // </div>
  );
};

export default SkillTreeComponent;
