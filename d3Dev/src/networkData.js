var dist = function(x1, y1, x2, y2){ 
  if (!x2) x2 = 0; 
  if (!y2) y2 = 0;
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)); 
}

var NetworkXGenerator = function(networkJSON){

  var g;
  if (networkJSON.directed) {
    g = new jsnx.DiGraph();
  } else {
    g = new jsnx.Graph();
  }

  // Load nodes
  networkJSON.nodes.forEach(function(node){
    var name = node.name.toString();
    g.addNode(name, node);
  });


  // Our edge weight will be defined using distance between coordiantes.
  // See pythagorean theorom
  networkJSON.links.forEach(function(link){

    var sourceName = link.source.toString();
    var sourceIndex;
    var sourceNode;
    var destinationName = link.target.toString();
    var destinationIndex;
    var destinationNode;

    g.nodes(true).forEach(function(node, index){
      if (node[0] === sourceName) {
        sourceIndex = index;
        sourceNode = node;
      } else if (node[0] === destinationName) {
        destinationIndex = index;
        destinationNode = node;
      }
    });


    g.addEdge(sourceName, destinationName, 
      {
        source: sourceIndex, 
        target: destinationIndex, 
        destinationNode: destinationNode,
        sourceNode: sourceNode
      });

  })

  return g;

}

var updateNetworkEdge = function (graph, nodeData) {
  //  Calculate a new distance
  var newDist = dist(nodeData.source.x, nodeData.source.y, nodeData.target.x, nodeData.target.y);

  // replace the edge with new weight
  graph.addEdge(nodeData.source.name, nodeData.target.name, {weight: newDist});
  graph.addNode(nodeData.source.name, nodeData.source);
  graph.addNode(nodeData.target.name, nodeData.target);

  debugger;

  return graph;
}

