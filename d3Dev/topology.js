var width = 1000,
    height = 550;

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

d3.json("/cluster.json", function(error, graph) {
  if (error) throw error;

  var nodes = graph.nodes.slice(),
      links = [],
      bilinks = [];

  //graph.links.forEach(function(link) {
  //  var s = nodes[link.source],
  //      t = nodes[link.target],
  //      i = {}; // intermediate node
  //  nodes.push(i);
  //  links.push({source: s, target: t});
  //  bilinks.push([s, i, t]);
  //});

    		//x and y axis maps.
  //		var x = d3.scale.linear().domain([0, 600]).range([0, width]);
  //		var y = d3.scale.linear().domain([0, 500]).range([height, 0]);
  //svg.append("rect").attr("x",100).attr("y",0).attr("width",600).attr("height",500).style("fill","rgb(235,235,209)");

  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  //var link = nodeElement("path", ".link", graph.links, function(element) {
  //  return element
  //      .attr("class", "link"
  //      .attr("weight", 1));
  //});


  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-dasharray", "5,5");

  var circleNode = nodeElement("circle", ".circleNode", graph.nodes, function(element) {
    return element
      .filter(function(d){return (d.shape === "circle")})
      .attr("class", "node")
      .attr("r", function(d) {d.fixed = true; return d.size/2})
      .style("fill", function(d) { return d.color; })
      .call(force.drag);
  });

  var squareNode = nodeElement("rect", ".sqrNode", graph.nodes, function(element) {
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


  var texts = nodeElement("text", ".label", graph.nodes, function(element){
    return element
      .attr("class", "label")
      .attr("fill", "black")
      .attr("font-family", "Arial")
      .text(function(d) {  return '';  });
  })


  circleNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  squareNode.append("title")
      .text(function(d) { return d.name + "\nx= "+  d.x + ", y= " + d.y; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

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


