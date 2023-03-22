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
  const data = [
    {
      id: "hello-world",
      title: "Hello World",
      tooltip: {
        content:
          "This node is the top most level, and will be unlocked, and ready to be clicked.",
      },
      children: [
        {
          id: "hello-sun",
          title: "Hello Sun",
          tooltip: {
            content:
              "This is a parent of the top node, and will locked while the parent isn’t in a selected state.",
          },
          children: [],
        },
        {
          id: "hello-stars",
          title: "Hello Stars",
          tooltip: {
            content:
              "This is the child of ‘Hello World and the sibling of ‘Hello Sun’. Notice how the app takes care of the layout automatically? That’s why this is called Beautiful Skill Tree and not just ‘Skill Tree’. (Also the npm namespace had already been taken for the latter so (flick hair emoji).",
          },
          children: [],
        },
      ],
    },
  ];

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
    <SkillProvider>
      <SkillTreeGroup>
        {() => {
          return (
            <SkillTree
              treeId="treeOne"
              title="Save Example"
              data={data} // defined elsewhere
              //   handleSave={handleSave}
              //   savedData={savedData}
            />
          );
        }}
      </SkillTreeGroup>
    </SkillProvider>

    // <SkillProvider>
    //   <SkillTreeGroup>
    //     <SkillTree>
    //       {nodes.map((node) => (
    //         <SkillTree.Node
    //           key={node.id}
    //           id={node.id}
    //           title={node.name}
    //           description={node.description}
    //           learned={node.learned}
    //           onClick={() => onNodeClick(node.id)}
    //         />
    //       ))}
    //     </SkillTree>
    //   </SkillTreeGroup>
    // </SkillProvider>

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
