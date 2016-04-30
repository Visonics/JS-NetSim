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

function click(d) {
  
  if (d.remove==true) return;
    
  stc = getBgInvColor(); 
      
  if (selected)  d3.select(selected).style("stroke-width", '0');
  
  selected = this;
  d3.select(selected).style("stroke-width", '1').style("stroke", stc[1]);

  showNode(d);
  d3.event.stopPropagation();   
}

var nodeElement = function (data, options) {
    var newNode;  
    newNode = svg.select("#nodes").selectAll(".node").data(data);

    newNode.enter().append("g").attr("class", "node");
    
    var node_object = newNode.append("path")
      .attr("d", function(d) { d.fixed = true; return Nodeshapes[d.shape]["d"];})
          
    node_object.on("click", click);   
    node_object.on('mouseover', function(d) {
        if (d.remove!=true)
            d3.select(this) 
            .style("fill-opacity", 0.5)
    })
    .on('mouseout', function(d) {
        if (d.remove!=true)
            d3.select(this) 
            .style("fill-opacity", 1.0)
            .style("fill", function (d) {		
                return d.color;})   
    });
       
    newNode.append("title")
        .text(function (d) {
            return d.id + "-" + d.size + "\nx = " + d.x + ", y = " + d.y;
        });
              
    newNode.append("text")
      .attr("dy", ".35em")
      .text(function(d) { return "" });
                        
    newNode.exit().remove();

    return newNode;
};

var showGrid = function(show) {
    op=0; fill="transparent";
    if (show) { op=1; fill="#DC143C"; }
    d3.selectAll('.axis').selectAll("line").style("stroke-width", op); 
    d3.selectAll('.axis').selectAll("text").style("fill", fill);
}

var render = function (graph, options, settings) {

    var padding = 10, margin = 5;
    options.padding = padding;
    if (!svg) {
        svg = d3.select(".networkview").append("svg")
            .attr("id", targetSvgId)
            //.style("outline", "thin solid #5280FF")
            .style("padding", padding+"px")
            .style("margin", margin+"px")
            .on("click", function (d) {                  
                if (selected) { d3.select(selected).style("stroke-width", '0'); selected = null}
            });
    }

    if (!options.width) {
        options.width = 700;
    }

    if (!options.height) {
        options.height = 500;
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
    
    holeData = settings.holes;
    if (holeData) {
        for (var k = 0; k < holeData.obstacle.length; k++) {
            var holeCoords = holeData.obstacle[k];
            var rectAttrs = {
                x: holeCoords.x,
                y: holeCoords.y,
                width: holeCoords.width,
                height: holeCoords.height                
            };
            var hole = svg.append("rect")
                .attr("class", "obstacle-svg")
                .attr(rectAttrs);
                
            var fillcolor = hole.style("fill");
            var fillopacity = hole.style("fill-opacity");
            hole.style('fill', fillcolor).style('fill-opacity', fillopacity);          
        }
    }
    if (settings.name) {
        $('#graphTitle').text(settings.name + " (" + graph.numberOfNodes() + " nodes)");
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

	var nd = nodeElement(nodes, options);
    if (settings.drag) {
			d3.selectAll('.node').call(drag);
	};
    
    var start = function () {		
        var link = svg.select("#links").selectAll(".link")
            .data(links);
        stc = getBgInvColor();  
        link.enter().append("line")
			.attr("class", "link")
			.style("opacity", '0.6')
            .style("stroke", stc)
            .style("stroke-dasharray", ("5, 5"));

        link.exit().remove();


        force.on("tick", function () {

            link.attr("x1", function (d) {
                    return d.source.x = Math.max(padding, Math.min(options.width - padding, d.source.x));
                })

                .attr("y1", function (d) {
                    return d.source.y = Math.max(padding, Math.min(options.height - padding, d.source.y));
                })

                .attr("x2", function (d) {
                    return d.target.x = Math.max(padding, Math.min(options.width - padding, d.target.x));
                })

                .attr("y2", function (d) {
                    return d.target.y = Math.max(padding, Math.min(options.height - padding, d.target.y));
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
        showInfo(true, graph);
    };

    // Instead of running on tick, we only run on drags.
    // Way more efficient.
    drag.on('drag', function (d) {
		updateCallback(d);
    });

	updateCallback = function (d) {
        option = {"labels": document.getElementById('labels').checked, 
                  "label_in": document.getElementById('label_in').checked};
		//console.log("x=", d.x, 'y=',d.y); 
		//console.log(d.color, d.size, d.shape);
        showGrid(document.getElementById('grid').checked);
         	
        d3.selectAll('.node').select("title").text(function (d) {
                    return d.id + "-" + d.size + "\nx= " + d.x + ", y= " + d.y;
                }
        );
        stc = getBgInvColor();
        //links 
        svg.style("background-color", stc[0]); 
        d3.selectAll('.link').style("stroke", stc[1]);
              
        
        if (option)	
            d3.selectAll('.node').select("text").text(function (d) {
                    if ((option.labels || option.label_in) && d.remove!=true) return d.name; else return "";
                }
            ).attr("x", function (d) { return d.x;})
             .attr("y", function (d) { return d.y;})
             .attr("dx", function (d) {
                    if (option.label_in) return -d.size/4; else return d.size;
                }                
            ).style('font-size', '12px')
            .style('fill', function (d) {
                    text_color = d.color;
                    if (option.label_in || text_color=='#FFFFFF') {
                        color = text_color.replace('#', '');
		                text_color = getContrastYIQ(color);
                    }    
                    return text_color;
            });        	
            

        d3.selectAll('.node').select("path").style('fill', function (d) {
                    if (d.remove==true) return "transparent";
                    return d.color;
               })
               .style('fill-rule', "nonzero")
               .attr("d", function(d) { return Nodeshapes[d.shape]["d"]; });
                                                    
        d3.selectAll('.node').select("path").attr("transform", function(d) { 
            dx = Math.max(padding, Math.min(options.width - padding, d.x)); 
            dy = Math.max(padding, Math.min(options.height - padding, d.y));
            dz = Nodeshapes[d.shape]["zoom"] || 1;
            dm = (Nodeshapes[d.shape]["move_x"] || 0) * d.size/2;
            return "translate(" + (dx - dm)  + "," + (dy - dm) + ") scale(" + 
             (d.size / dz) +  ")"; 
        });
        
		var visualChanges = updateNetwork(graph, d);
        
        updateVisuals(visualChanges);
        updateNetworkObject(nodes, links);
		
		start();		
	};
 
 // Called when settings are changed.
    // Look at networkData.js
    updateLinksCallback = function (new_options) {
        options = new_options;
        options.padding = padding;
        setPane(svg, options);
        console.log(options);
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
        });
    };

	start();
    updateCompleteNetwork(graph);
};
