var generalNetworkData = {};
var removed = {};


var dist = function(x1, y1, x2, y2) {
  if (!x2) x2 = 0;
  if (!y2) y2 = 0;
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

var NetworkXGenerator = function(networkJSON) {

  generalNetworkData = {};
  removed = {};

  var g;
  if (networkJSON.directed) {
    g = new jsnx.DiGraph();
  } else {
    g = new jsnx.Graph();
  }

  // Load nodes
  networkJSON.nodes.forEach(function(node) {
    var name = node.name.toString();
    g.addNode(name, node);
  });

  // See if r exists, and save it.
  if (networkJSON.graph.r) {
    generalNetworkData.r = networkJSON.graph.r;
  } 

  // Our edge weight will be defined using distance between coordiantes.
  // See pythagorean theorom
  networkJSON.links.forEach(function(link) {

    var sourceName = link.source.toString();
    var sourceIndex;
    var sourceNode;
    var destinationName = link.target.toString();
    var destinationIndex;
    var destinationNode;

    g.nodes(true).forEach(function(node, index) {
      if (node[0] === sourceName) {
        sourceIndex = index;
        sourceNode = node;
      } else if (node[0] === destinationName) {
        destinationIndex = index;
        destinationNode = node;
      }
    });


    g.addEdge(sourceName, destinationName, {
      source: sourceIndex,
      target: destinationIndex,
      destinationNode: destinationNode,
      sourceNode: sourceNode
    });

  })

  return g;

}

// These network settings methods play with the modal. They are aspects of a view.
// TODO: Maybe use backbone for MVC setup. Or React
var updateNetworkSettings = function() {
  debugger;
  for (var key in generalNetworkData) {
    if ($('#' + key).val()) {
      generalNetworkData[key] = $('#' + key).val();
    }
  }
}

var displayNetworkSettings = function() {
  
  var makeInputDiv = function(name, val) {
    return '<div class="input-group">' + 
      '<div class="input-group-addon">' + name + '</div>' + 
      '<input type="text" class="form-control" id="' + name + '" placeholder="' + val +'">' + 
      '</div><br >';
  }

  $('.graph-selection').empty();
  for (var key in generalNetworkData) {
    $('.graph-selection').append(makeInputDiv(key, generalNetworkData[key]));
  }

}

// TODO: Clean this up, and make it more efficient.
// Meaning, it doesn't need to run on "every tickback"
var updateNetwork = function(graph, nodeData) {

  //  Calculate a new distance
  var changes = {};
  changes.addedEdges = [];
  changes.removedEdges = [];

  // Replace nodes with new x and y positions
  graph.addNode(nodeData.name, nodeData);


  // console.log(nodeData.source.name);

  // graph.removeEdge(nodeData.name, );
  // changes.removedEdge = [nodeData.source.name, nodeData.target.name];

  // if (removed[nodeData.source.name + nodeData.target.name]) {
  //   changes.addedEdge = [nodeData.source.name, nodeData.target.name]
  //   removed[nodeData.source.name + nodeData.target.name] = false;
  // }

  // graph.addEdge(nodeData.source.name, nodeData.target.name, {
  //   weight: newDist
  // });
  if (generalNetworkData.r) {
    var nodes = graph.nodes(true);
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i][0] === nodeData.name) {
        continue;
      }

      var newDist = dist(nodes[i][1].x, nodes[i][1].y, nodeData.x, nodeData.y);

      if (generalNetworkData.r > newDist) {
        if (!removed[nodeData.name + nodes[i][0]]) {
          changes.removedEdges.push([nodeData.name, nodes[i][0]]);
          graph.removeEdge(nodeData.name, nodes[i][0]);
          removed[nodeData.name + nodes[i][0]] = true;
        }
      } else {
        if (removed[nodeData.name + nodes[i][0]]) {
          changes.addedEdges.push([nodeData.name, nodes[i][0]]);
          graph.addEdge(nodeData.name, nodes[i][0], {
            weight: newDist
          });
          removed[nodeData.name + nodes[i][0]] = false;
        }
      }

    }

  }


  // Graph is mutated. No need to return. 
  // TODO: return settings, which topology.js will read, and update svg accordingly.
  return changes;
}
