export const matchSearchKeyword = (term, nodeData) => {
  // Keyword for allocated points
  if (term.startsWith("p:")) {
    const points = parseInt(term.slice(2), 10);
    return nodeData.allocatedPoints === points;
  }

  // Keyword for name
  if (term.startsWith("n:")) {
    const searchValue = term.slice(2);
    return nodeData.name.toLowerCase().includes(searchValue);
  }

  // Keyword for tags
  if (term.startsWith("t:")) {
    const searchValue = term.slice(2);
    return nodeData.tags.some((tag) => tag.toLowerCase().includes(searchValue));
  }

  // Keyword for maxPoints
  if (term.startsWith("mp:")) {
    const points = parseInt(term.slice(3), 10);
    return nodeData.maxPoints === points;
  }

  // Keyword for nodeType
  if (term.startsWith("nt:")) {
    const searchValue = term.slice(3);
    return nodeData.nodeType.toLowerCase().includes(searchValue);
  }

  // Return null when no keyword is found
  return null;
};

export const handleSearch =
  (nodes, treeGroupRef, setHighlightedNodes) => (searchText) => {
    const searchTerms = searchText.toLowerCase().split(" ");
    const newHighlightedNodes = new Set();

    nodes.forEach((node) => {
      if (node.name === "" || !node.description) return;

      const nodeData = {
        ...node,
        description: node.description.description,
        tags: node.description.tags,
      };

      // Remove "connections" and "children" properties
      delete nodeData.connections;
      delete nodeData.children;
      delete nodeData.x;
      delete nodeData.y;
      delete nodeData.isActivated;

      const match = searchTerms.every((term) => {
        const keywordMatch = matchSearchKeyword(term, nodeData);

        // If a keyword match is found, return the result
        if (keywordMatch !== null) {
          return keywordMatch;
        }

        // If no keyword is found, perform a regular search
        const nodeValues = Object.values(nodeData).map((v) =>
          v ? v.toString().toLowerCase() : ""
        );
        return nodeValues.some((value) => value.includes(term));
      });

      if (match) {
        newHighlightedNodes.add(node);
      }
    });

    setHighlightedNodes(newHighlightedNodes);

    // Update the opacity of the nodes based on the newHighlightedNodes set
    treeGroupRef.current
      .selectAll("g.node")
      .attr("opacity", (d) =>
        searchText === "" || newHighlightedNodes.has(d) ? 1 : 0.3
      );

    // Update the opacity of the links based on the newHighlightedNodes set
    treeGroupRef.current
      .selectAll(
        "path.node-link, path.hub-link, path.active-path, path.highlighted-path,  path.activeNodeHubPath"
      )
      .attr("opacity", (d) =>
        searchText === "" ||
        (newHighlightedNodes.has(d.source) && newHighlightedNodes.has(d.target))
          ? 1
          : 0.1
      );
  };
