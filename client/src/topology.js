/////////////////////
//
// topology.js
// 
// This file is responsible for the rendering of nodes on a screen, based on a given json file
//
/////////////////////

var color = d3.scale.category20();
var ww = 0;

var targetSvgId = "graph"

var nodeElement = function (shape, classType, data, attrfn) {
  var newNode;
  newNode = svg.selectAll(".node" + classType)
    .data(data);

  newNode.enter().append(shape);

  newNode.exit()
  .remove();

  return attrfn(newNode);
}

var render = function(graph, options, settings) {

  if (!svg) {
    svg = d3.select(".networkview").append("svg")
    .attr("id", targetSvgId)

    $(".networkview").addClass("svgborder");
  }

  if (!options.width) {
    options.width = 650;
  }

  if (!options.height) {
    options.height = 500;
  }

  var radiusBorder = 6;
  ww = options.width;
  if (options) {
    setPane(svg, options);
  }

  if (!force) {
    force = d3.layout.force()
    .alpha(0)
    .size([options.width, options.height]);
  }

  var drag = force.drag();
  
  if (settings.name) {
     $('#graphName').text(settings.name);
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
    element = element
      .filter(function(d){return (d.shape === "circle")})
      .attr("class", "node")
      .attr("r", function(d) {d.fixed = true; return d.size/2})
      .style("fill", function(d) { return d.color; })

    if (settings.drag) {
      element.call(force.drag());
    }
    
    return element;
  });

  var squareNode = nodeElement("rect", ".sqrNode", nodes, function(element) {
    element = element
      .filter(function(d){return (d.shape === "square")})
      .attr("class", "node")
      .attr("width", function(d) { return d.size })
      .attr("height", function(d) { return d.size })
      .style("fill", function(d) { d.fixed = true; return d.color; });

      if (settings.drag) {
        element.call(force.drag());
      }

      return element;
  });


  circleNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  squareNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  var start = function() {

    var link = svg.selectAll(".link")
        .data(links);

    link.enter().append("line")
      .attr("class", "link")
      .style("stroke-dasharray", ("5, 5"));

    link.exit().remove();


    force.on("tick", function() {

      link.attr("x1", function(d) { 
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


      circleNode.attr("cx", function(d) {
        return d.x = Math.max(radiusBorder, Math.min(options.width - radiusBorder, d.x)); 
      })
      .attr("cy", function(d) { 
        return d.y = Math.max(radiusBorder, Math.min(options.height - radiusBorder, d.y)); 
      });


      squareNode.attr("x", function(d) {
        return d.x = Math.max(radiusBorder, Math.min(options.width - radiusBorder, d.x)); 
      })
      .attr("y", function(d) { 
        return d.y = Math.max(radiusBorder, Math.min(options.height - radiusBorder, d.y)); 
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
      start();
    } 

    if (visualChanges.removedEdges.length > 0) {
      visualChanges.removedEdges.forEach(function(element){
        removeLink(element[0], element[1]);
      })
      start();
    }
  }


  // Instead of running on tick, we only run on drags.
  // Way more efficient.
  drag.on('drag', function(d){
    var visualChanges = updateNetwork(graph, d);
    updateVisuals(visualChanges);
  });


  start();


  var updateCompleteNetwork = function(graph) {
    d3.selectAll(".node").each(function(d){
      var visualChanges = updateNetwork(graph, d);
      updateVisuals(visualChanges);
    })
  }

  updateCompleteNetwork(graph);
}



