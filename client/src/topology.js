/////////////////////
//
// topology.js
// 
// This file is responsible for the rendering of nodes on a screen, based on a given json file
//
/////////////////////

var width = 700,
    height = 400;

var color = d3.scale.category20();

var force = d3.layout.force()
    .alpha(0)
    .size([width, height]);

var drag = force.drag();

var targetSvgId = "graph"

var svg;

var nodeElement = function (shape, classType, data, attrfn) {
  var newNode;
  newNode = svg.selectAll(classType)
    .data(data)
  .enter().append(shape);

  return attrfn(newNode);
}

var render = function(graph, options, name) {

  if (!svg) {
    svg = d3.select(".networkview").append("svg")
    .attr("id", targetSvgId)

    $(".networkview").addClass("svgborder");
  }

  if (options) {
    setPane(svg, options);
  }

  if (name) {
    // $('#graphName').text(name);
  }

  var nodes = [],
      links = [],
      bilinks = [];

  graph.nodes(true).forEach(function(item){
    nodes.push(item[1]);
  });

  graph.edges(true).forEach(function(item){
    links.push({source: item[2].source, target: item[2].target});
  });

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .style("color", "black")
      .style("stroke-color", "black")
      .style("stroke-dotarray", "5,5");

  var circleNode = nodeElement("circle", ".circleNode", nodes, function(element) {
    return element
      .filter(function(d){return (d.shape === "circle")})
      .attr("class", "node")
      .attr("r", function(d) {d.fixed = true; return d.size/2})
      .style("fill", function(d) { return d.color; })
      .call(force.drag);
  });

  var squareNode = nodeElement("rect", ".sqrNode", nodes, function(element) {
    return element
      .filter(function(d){return (d.shape === "square")})
      .attr("class", "node")
      .attr("width", function(d) { return d.size })
      .attr("height", function(d) { return d.size })
      .style("fill", function(d) { d.fixed = true; return d.color; })
      //.select("title")
      //.text(function(d) { return d.id; })
      .call(force.drag());
  });

  var updateVisuals = function(data, link) {

    if (data.removedEdge) {
      debugger;

      var link = link.filter(function(d){ 
        return d.source.name === data.removedEdge[0] && d.target.name === data.removedEdge[1]
      })
      link.style("stroke", "none");
    } else if (data.addedEdge) {
      debugger;

      var link = link.filter(function(d){ 
        return d.source.name === data.addedEdge[0] && d.target.name === data.addedEdge[1]
      })
      link.style("stroke", "#bbb");    }
  }

  circleNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  squareNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  force.on("tick", function() {

    link.attr("x1", function(d) { 
      // Utilize the ticks in D3 to update JSNetworkX Graph
      var changes = updateNetwork(graph, d);
      updateVisuals(changes, link);
      return d.source.x; 
    })

    .attr("y1", function(d) { 
      return d.source.y; 
    })

    .attr("x2", function(d) {
      return d.target.x; 
    })

    .attr("y2", function(d) {
     return d.target.y; 
    });

    circleNode.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    squareNode.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  });

}



