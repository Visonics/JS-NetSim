/////////////////////
//
// topology.js
// 
// This file is responsible for the rendering of nodes on a screen, based on a given json file
//
/////////////////////

var color = d3.scale.category20();

var targetSvgId = "graph";

var selected=null;
function click(d){
   if(!selected){
     selected = this;
     d3.select(selected).style("stroke-width", '3');
  }
  else {
     d3.select(selected).style("stroke-width", '1');
     selected = this;
     d3.select(selected).style("stroke-width", '3');
  }
  showNode(d);
}

var nodeElement = function (shape, classType, data, attrfn) {
    var newNode;
    newNode = svg.select("#nodes").selectAll(".node" + classType)
        .data(data);

    newNode.enter().append(shape).attr("class", "node").on("click", click)
	    .style("stroke", '#000')
        .style("fill", function (d) {
			d.fixed = true;
            return d.color;
    });
    newNode.on('mouseover', function(d) {
        d3.select(this).style({"stroke": "#fff"})
    })
    .on('mouseout', function(d){
        d3.select(this).style({"stroke": '#000'})
    });

	newNode.append("title")
        .text(function (d) {
            return d.id + "-" + d.name + "\nx = " + d.x + ", y = " + d.y;
        });

    newNode.exit().remove();

    return attrfn(newNode);
};

var render = function (graph, options, settings) {

    if (!svg) {
        svg = d3.select(".networkview").append("svg")
            .attr("id", targetSvgId);
    }

    if (!options.width) {
        options.width = 650;
    }

    if (!options.height) {
        options.height = 500;
    }

    var radiusBorder = 6;
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
        $('#graphTitle').text(settings.name);
        svg.append("svg:title").text(settings.name);
    }
	svg.append("g").attr("id", "links");
	svg.append("g").attr("id", "nodes");

    var nodes = [],
        links = [];

    graph.edges(true).forEach(function (item) {
        links.push({source: item[2].source, target: item[2].target});
    });
	
	graph.nodes(true).forEach(function (item) {
        nodes.push(item[1]);
    });

	var circleNode = nodeElement("circle", ".circleNode", nodes, function (element) {
		element = element
			.filter(function (d) {
				return (d.shape === "circle")
			})
			.attr("r", function (d) {                
				return d.size / 2
			});

		if (settings.drag) {
			element.call(force.drag());
		}

		return element;
	});

	var squareNode = nodeElement("rect", ".sqrNode", nodes, function (element) {
		element = element
			.filter(function (d) {
				return (d.shape === "square")
			})
			.attr("width", function (d) {
				return d.size
			})
			.attr("height", function (d) {
				return d.size
			});

		if (settings.drag) {
			element.call(force.drag());
		}

		return element;
	});	

    var start = function () {		
        var link = svg.select("#links").selectAll(".link")
            .data(links);

        link.enter().append("line")
			.attr("class", "link")
			.style("opacity", '0.6')
            .style("stroke", '#000')
            .style("stroke-dasharray", ("5, 5"))
            .style("stroke-width", 1);

        link.exit().remove();


        force.on("tick", function () {

            link.attr("x1", function (d) {
                    return d.source.x = Math.max(radiusBorder, Math.min(options.width - radiusBorder, d.source.x));
                })

                .attr("y1", function (d) {
                    return d.source.y = Math.max(radiusBorder, Math.min(options.height - radiusBorder, d.source.y));
                })

                .attr("x2", function (d) {
                    return d.target.x = Math.max(radiusBorder, Math.min(options.width - radiusBorder, d.target.x));
                })

                .attr("y2", function (d) {
                    return d.target.y = Math.max(radiusBorder, Math.min(options.height - radiusBorder, d.target.y));
                });

            circleNode.attr("cx", function (d) {
                    return d.x = Math.max(radiusBorder, Math.min(options.width - radiusBorder, d.x));
                })
                .attr("cy", function (d) {
                    return d.y = Math.max(radiusBorder, Math.min(options.height - radiusBorder, d.y));
                });

            squareNode.attr("x", function (d) {
				    dx = Math.max(radiusBorder, Math.min(options.width - radiusBorder, d.x)); 
					return dx - d.size/2; 
                })
                .attr("y", function (d) {
                    dy = Math.max(radiusBorder, Math.min(options.height - radiusBorder, d.y));
					return dy - d.size/2; 
                });	

        });

        force
            .links(links)
			.nodes(nodes)            
            .start();
    };

    var addLink = function (sourceIndex, targetIndex) {
        links.push({source: sourceIndex, target: targetIndex});
    };

    var removeLink = function (sourceIndex, targetIndex) {
        for (var i = 0; i < links.length; i++) {
            if ((links[i].source.index === sourceIndex && links[i].target.index === targetIndex) ||
                (links[i].source.index === targetIndex && links[i].target.index === sourceIndex)) {
                links.splice(i, 1);
            }
        }
    };

    var updateVisuals = function (visualChanges) {
        if (visualChanges.addedEdges.length > 0) {
            visualChanges.addedEdges.forEach(function (element) {
                addLink(element[0], element[1]);
            });
            start();
        }

        if (visualChanges.removedEdges.length > 0) {
            visualChanges.removedEdges.forEach(function (element) {
                removeLink(element[0], element[1]);
            })
            start();
        }
        showInfo(true);
    };

	//d3.selectAll('.node').on("click", function(d) {
     //   click();
	//	showNode(d);
	//});

    // Instead of running on tick, we only run on drags.
    // Way more efficient.
    drag.on('drag', function (d) {
		updateCallback(d);
    });

	updateCallback = function (d) {
		console.log("x=", d.x, 'y=',d.y); 
		console.log(d.color, d.size, d.shape);	
        d3.selectAll('.node').select("title").text(function (d) {
                    return d.id + "-" + d.name + "\nx= " + d.x + ", y= " + d.y;
                }
        );		
        d3.selectAll('.node').style('fill', function (d) {
                    return d.color;
                }
        );
		if (d.shape=='circle') 	{	
			circleNode.attr('r', function (d) {
                    return d.size/2;
                }
			);
		}	
		else {	
			squareNode.attr('width', function (d) {
						return d.size;
					}
			);
			squareNode.attr("height", function (d) {
						return d.size;
					}
			);			
		}
		var visualChanges = updateNetwork(graph, d);
        updateVisuals(visualChanges);
        updateNetworkObject(nodes, links);
		
		start();		
	};
 
 // Called when settings are changed.
    // Look at networkData.js
    updateLinksCallback = function (new_options) {
        options = new_options;
        setPane(svg, options);
        if (options.drag)
            d3.selectAll('.node').call(force.drag);
        else
            d3.selectAll('.node').on('mousedown.drag', null);

        updateCompleteNetwork(graph);
    };

    var updateCompleteNetwork = function (graph) {

        d3.selectAll(".node").each(function (d) {
            var visualChanges = updateNetwork(graph, d);
            updateVisuals(visualChanges);
        })
    };

	start();
    updateCompleteNetwork(graph);
    //showInfo(true);
};
