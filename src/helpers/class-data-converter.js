export function convertClassDataToTreeData(classData) {
  const treeData = {
    name: classData.name,
    children: classData.clusters.map((cluster) => ({
      name: cluster.type,
      children: cluster.nodes.map((node) => ({
        ...node,
        name: node.name,
      })),
    })),
  };

  return treeData;
}
