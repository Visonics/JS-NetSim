var generalNetworkData = {};

var updateLinksCallback;

function dist(x1, y1, x2, y2) {
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

var NetworkXGenerator = function (networkJSON) {

    generalNetworkData = JSON.parse(JSON.stringify(networkJSON));
    removed = {};

    var g;
    if (networkJSON.directed) {
        g = new jsnx.DiGraph();
    } else {
        g = new jsnx.Graph();
    }

    // Load nodes
    networkJSON.nodes.forEach(function (node) {
        var id = node.id.toString();
        g.addNode(id, node);
    });

    // See if r exists, and save it.
    if (networkJSON.graph.r) {
        console.log("/*/*", networkJSON.graph.r);
        generalNetworkData.graph.r = networkJSON.graph.r;
    }

    if (networkJSON.graph.name) {
        generalNetworkData.graph.name = networkJSON.graph.name;
    }


    // Our edge weight will be defined using distance between coordiantes.
    // See pythagorean theorom
    networkJSON.links.forEach(function (link) {

        var sourceName = link.source.toString();
        var sourceIndex;
        var sourceNode;
        var destinationName = link.target.toString();
        var destinationIndex;
        var destinationNode;

        g.nodes(true).forEach(function (node, index) {
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

    });
    return g;

};

// These network settings methods play with the modal. They are aspects of a view.
// TODO: Maybe use backbone for MVC setup. Or React

var updateNetworkSettings = function () {
    for (var key in generalNetworkData.graph) {
        value = $('#' + key).val();
        if (value) {
            generalNetworkData.graph[key] = value;
        }
        if (key=='drag')
            generalNetworkData.graph[key] = document.getElementById(key).checked;
    }

    if (generalNetworkData.graph.name) {
        $('#graphTitle').text(generalNetworkData.graph.name + " (" + 
            generalNetworkData.nodes.length + " nodes)");
        //$("#graphName").text(generalNetworkData.graph.name + ", r = " +
       //    generalNetworkData.graph.r + ", Drag = " + generalNetworkData.graph.drag);
    }
    options =  {
        wipeOnNewLoad: false, width: generalNetworkData.graph.width,
        height: generalNetworkData.graph.height, drag: generalNetworkData.graph.drag
    };
    //console.log(options);    
    updateLinksCallback(options);
};

var displayNetworkSettings = function () {
    $('#graphSettingsModal').modal('show');
    var makeInputDiv = function (name, val) {
        type = "text";
        value = ' value ="' + val + '"';
        if (val=='true' || val=='false' || typeof(val)=="boolean") {
            type = "checkbox";
            if (val == 'true' || val == true) value = "checked"; else value = "";
        }
        return '<div class="input-group">' +
            '<div class="input-group-addon">' + name + '</div>' +
            '<input type="' + type + '" class="form-control" id="' + name + '" ' + value + ' />' +
            '</div><br >';
    };

    $('.graph-selection').empty();
    for (var key in generalNetworkData.graph) {
        if (key=='holes') continue;
        $('.graph-selection').append(makeInputDiv(key, generalNetworkData.graph[key]));
    }

};

var updateNetwork = function (graph, nodeData) {

    var changes = {};
    changes.addedEdges = [];
    changes.removedEdges = [];

    // Replace nodes with new x and y positions
    graph.addNode(nodeData.id.toString(), nodeData);
    
    // Begin by checking if r exists anywhere.
    if (generalNetworkData.graph.r) {

        // Get nodes from jsnetwork data structure
        var nodes = graph.nodes(true);
		id = nodeData.id.toString();
		//console.log("*****", id, nodes.length, nodeData.x, nodeData.y); 
        for (var i = 0; i < nodes.length; i++) {
			
            // Skip over the current node.
            if (nodes[i][0] === id) {
                continue;
            }

            // Calculate distance for every node.
            var newDist = dist(nodes[i][1].x, nodes[i][1].y, nodeData.x, nodeData.y);

            if (generalNetworkData.graph.r < newDist || nodeData.remove==true) {

                // We check both combinations against the hash table.
                // Protects against bi-links.
                if (graph.hasEdge(nodes[i][0], id)) {

                    // Remove bi-links, again. That's why there are two remove edges.
                    changes.removedEdges.push([nodeData.index, nodes[i][1].index]);
                    changes.removedEdges.push([nodes[i][1].index, nodeData.index]);

                    // Remvoe link from data structure
                    graph.removeEdge(id, nodes[i][0]);
                }
            } else {
                edge = [nodeData.index, nodes[i][1].index];
                // Only run if both possible links are not there.
                //if (edge in changes.addedEdges || edge2 in changes.addedEdges) continue;
                if (!graph.hasEdge(nodes[i][0], id)) {

                    // Add the edge to changes.
                    changes.addedEdges.push(edge);

                    // Update the structure with the distance as the weight
                    graph.addEdge(id, nodes[i][0], {
                         weight: newDist
                      });
                }
            }

        }

    }

    // Graph is mutated. No need to return.
    // return settings, which topology.js will read, and update svg accordingly.
    return changes;
}

//Update Network object for JSON
var updateNetworkObject = function (nodes, links) {
    newlinks = [];
    //console.log("*****", links.length); 
    for (var i = 0; i < links.length; i++) {
        newlinks.push({source: links[i].source.index, target: links[i].target.index});
    }
    generalNetworkData.nodes = nodes;
    generalNetworkData.links = newlinks;
}
