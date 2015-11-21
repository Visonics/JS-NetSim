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

  var link = svg.selectAll(".link")
      .data(bilinks)
    .enter().append("path")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .filter(function(d){return (d.shape === "circle")})
      .attr("class", "node")
      .attr("r", function(d) {d.fixed = true; return d.size})
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  var squareNode = svg.selectAll(".sqrNode")
      .data(graph.nodes)
    .enter().append("rect")
      .filter(function(d){return (d.shape === "square")})
      .attr("class", "node")
      .attr("width", function(d) { return d.size })
      .attr("height", function(d) { return d.size })
      .style("fill", function(d) { d.fixed = true; return color(d.group); })
      .call(force.drag());

  var texts = svg.selectAll(".label")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class", "label")
      .attr("fill", "black")
      .attr("font-family", "Arial")
      .text(function(d) {  return d.name;  });


  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("d", function(d) {

      return "M" + d[0].x + "," + d[0].y
          + "S" + d[1].x + "," + d[1].y
          + " " + d[2].x + "," + d[2].y;
    });

    node.attr("transform", function(d) {

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


