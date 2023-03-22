import React, { useState, useEffect } from "react";
import { Tree } from "react-d3-tree";

import sorcererData from "../../data/sorcerer.json";
import { convertClassDataToTreeData } from "../../helpers/class-data-converter.js";

import "./skill-tree.styles.scss";

const containerStyles = {
  width: "100%",
  height: "100vh",
};

const SkillTreeComponent = ({ classData }) => {
  const [nodes, setNodes] = useState([]);
  const treeData = convertClassDataToTreeData(sorcererData);

  // useEffect(() => {
  //   setNodes(sorcererData.nodes);
  //   console.log(nodes);
  //   console.log(data);
  // }, []);

  // const onNodeClick = (nodeId) => {
  //   setNodes((prevNodes) =>
  //     prevNodes.map((node) =>
  //       node.id === nodeId ? { ...node, learned: !node.learned } : node
  //     )
  //   );
  // };

  return (
    <div style={containerStyles}>
      <Tree
        data={treeData}
        orientation="vertical"
        translate={{ x: 150, y: 100 }}
        zoomable
        collapsible
      />
    </div>
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
