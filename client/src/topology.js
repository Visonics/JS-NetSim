/////////////////////
//
// topology.js
// 
// This file is responsible for the rendering of nodes on a screen, based on a given json file
//
/////////////////////

var color = d3.scale.category20();


var targetSvgId = "graph"

var nodeElement = function (shape, classType, data, attrfn) {
  var newNode;
  newNode = svg.selectAll(classType)
    .data(data);

  newNode.enter().append(shape);

  newNode.exit()
  .remove();

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

  if (!force) {
    force = d3.layout.force()
    .alpha(0)
    .size([options.width, options.height]);
  }

  var drag = force.drag();
  
  if (name) {
    // $('#graphName').text(name);
  }

  var nodes = [],
      links = [];

  graph.nodes(true).forEach(function(item){
    nodes.push(item[1]);
  });

  graph.edges(true).forEach(function(item){
    links.push({source: item[2].source, target: item[2].target});
  });


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


  circleNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  squareNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  var start = function() {

    var link = svg.selectAll(".link")
        .data(links);

    link.enter().append("line")
      .attr("class", "link");

    link.exit().remove();


    force.on("tick", function() {

      link.attr("x1", function(d) { 
        // Utilize the ticks in D3 to update JSNetworkX Graph
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
    
    force
        .nodes(nodes)
        .links(links)
        .start();
  }

  var addLink = function(sourceIndex, targetIndex) {
    links.push({source: sourceIndex, target: targetIndex});
  }

  var removeLink = function(sourceIndex, targetIndex) {
    for (var i = 0; i < links.length; i++) {
      if ((links[i].source.index === sourceIndex && links[i].target.index === targetIndex) || 
          (links[i].source.index === targetIndex && links[i].target.index === sourceIndex)) {
        links.splice(i, 1);
      }
    }
  }

  var updateVisuals = function(visualChanges) {
    if (visualChanges.addedEdges.length > 0) {
      visualChanges.addedEdges.forEach(function(element){

        addLink(element[0], element[1]);
            
      })
      console.log(visualChanges.addedEdges);
      start();
    } 

    if (visualChanges.removedEdges.length > 0) {
      visualChanges.removedEdges.forEach(function(element){
        removeLink(element[0], element[1]);
      })
      console.log(visualChanges.removedEdges)
      start();
    }
  }

  drag.on('drag', function(d){
    var visualChanges = updateNetwork(graph, d);
    updateVisuals(visualChanges);
  });

  start();

}



