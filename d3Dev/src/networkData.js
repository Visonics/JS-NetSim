var NetworkXGenerator = function(networkJSON){


  var dist = function(x1, y1, x2, y2){ 
    if (!x2) x2 = 0; 
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)); 
  }

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
    var sourcePos = {}
    var sourceIndex;
    var destinationName = link.target.toString();
    var destinationPos = {};
    var destinationIndex;

    g.nodes(true).forEach(function(node, index){
      if (node[0] === sourceName) {
        sourcePos.x = node[1].x;
        sourcePos.y = node[1].y;
        sourceIndex = index;
      } else if (node[0] === destinationName) {
        destinationPos.x = node[1].x;
        destinationPos.y = node[1].y;
        destinationIndex = index;
      }
    });

    var distance = dist(sourcePos.x, sourcePos.y, destinationPos.x, destinationPos.y);

    g.addEdge(sourceName, destinationName, {weight: distance, source: sourceIndex, target: destinationIndex});

  })

  return g;

}