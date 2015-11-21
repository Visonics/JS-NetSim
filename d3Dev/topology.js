var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .alpha(0)
    .size([width, height]);

var drag = force.drag();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var nodeElement = function (shape, classType, data, attrfn) {
  var newNode;
  newNode = svg.selectAll(classType)
    .data(data)
  .enter().append(shape);

  return attrfn(newNode);
}

d3.json("/data.json", function(error, graph) {
  if (error) throw error;

  var nodes = graph.nodes.slice(),
      links = [],
      bilinks = [];

  graph.links.forEach(function(link) {
    var s = nodes[link.source],
        t = nodes[link.target],
        i = {}; // intermediate node
    nodes.push(i);
    links.push({source: s, target: i}, {source: i, target: t});
    bilinks.push([s, i, t]);
  });

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = nodeElement("path", ".link", bilinks, function(element) {
    return element.attr("class", "link");
  })

  var circleNode = nodeElement("circle", ".circleNode", graph.nodes, function(element) {
    return element
      .filter(function(d){return (d.shape === "circle")})
      .attr("class", "node")
      .attr("r", function(d) {d.fixed = true; return d.size})
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);
  });

  var squareNode = nodeElement("rect", ".sqrNode", graph.nodes, function(element) {
    return element
      .filter(function(d){return (d.shape === "square")})
      .attr("class", "node")
      .attr("width", function(d) { return d.size })
      .attr("height", function(d) { return d.size })
      .style("fill", function(d) { d.fixed = true; return color(d.group); })
      .call(force.drag());
  });


  var texts = nodeElement("text", ".label", graph.nodes, function(element){
    return element
      .attr("class", "label")
      .attr("fill", "black")
      .attr("font-family", "Arial")
      .text(function(d) {  return d.name;  });
  })


  circleNode.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("d", function(d) {

      return "M" + d[0].x + "," + d[0].y
          + "S" + d[1].x + "," + d[1].y
          + " " + d[2].x + "," + d[2].y;
    });

    circleNode.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    squareNode.attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    texts.attr("transform", function(d) {
        return "translate(" +( d.x + -25 )+ "," + ( d.y + 30 ) + ")";
    });
  });
});


