var selected_id = -1;

var setPane = function(target, options){
  //console.log(options);
  width = parseInt(options.width);
  height = parseInt(options.height);
  if (width > DEFAULT_GEN.max_width) width = DEFAULT_GEN.max_width;
  if (height > DEFAULT_GEN.max_height) height = DEFAULT_GEN.max_height;
  generalNetworkData.graph.width = width;
  generalNetworkData.graph.height = height;
  
  if (options.wipeOnNewLoad) {
    target.selectAll("*").remove();
  }
  target.attr("width", width + options.padding*2)
    .attr("height", height + options.padding*2);
	
   drawGrid(target, width, height);	
};

var drawGrid = function(svg, width, height) {
      
  var op=0;
  
  if (document.getElementById('grid').checked)
    op = 1;
	
  svg.selectAll(".axis").remove();	
  
  // Add the x-axis.
  x = svg.append("g")
      .attr("class", "x axis")
  for (var k = 0; k <= width; k += 100)
  {     
    x.append("line").attr("x1", k).attr("y1", 0).attr("x2", k).attr("y2", height)
        .style("stroke-dasharray", ("1, 2"))
        .style("stroke-width", op)
        .style("stroke", '#DC143C');
    x.append("text").text(""+(k/100)).attr("x",k-5).attr("y", -2)
    .style("font-size", "10px").style("fill", 'transparent');    
  }
  // Add the y-axis.
  y = svg.append("g")
      .attr("class", "y axis");
  for (var k = 0; k <= height; k += 100) {      
    y.append("line").attr("x1", 0).attr("y1", k).attr("x2", width).attr("y2", k)
        .style("stroke-dasharray", ("1, 2"))
        .style("stroke-width", op)
        .style("stroke", '#DC143C');
    if (k>0)     
        y.append("text").text(""+(k/100)).attr("x",-8).attr("y", k)
        .style("font-size", "10px").style("fill", 'transparent'); 
  }          
};

function isNumber(evt) {
	evt = (evt) ? evt : window.event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}

function showNode(node)
{
	show_tab = false;
	if (typeof node === 'number')
	{
		show_tab = true;
		node = generalNetworkData.nodes[node];  // read object
	}
	show_node = document.getElementById("show_node");
	if (show_node && show_node.checked)
		show_tab = true;
		
	if (show_tab)
		$('.nav-tabs a[href="#node_control"]').tab('show');

	selected_id = node.id;
	console.log(selected_id);
	document.getElementById("node_id").innerHTML = "" + node.id;
	document.getElementById("node_name").value = node.name;
	document.getElementById("node_x").innerHTML = "" + Math.round(node.x);
	document.getElementById("node_y").innerHTML = "" + Math.round(node.y);
	color_id = getColorCode(node.color);
	document.getElementById("node_color").value = color_id;
	document.getElementById("node_size").value = node.size;
	document.getElementById("node_size_range").value = node.size;
	document.getElementById("node_shape").value = node.shape;
}


function setNode(action)
{	
	id = parseInt(document.getElementById("node_id").innerHTML);
	node = generalNetworkData.nodes[id];
	node.name = document.getElementById("node_name").value;
	node.shape = document.getElementById("node_shape").value;
	node.color = getColor(document.getElementById("node_color").value);
	node.size = document.getElementById("node_size").value;
	if (action==1) { //Add
		newId = generalNetworkData.nodes.length;
		if (node.name==''+node.id) node.name = ''+newId;
		node.id = newId;
		node.index = newId;
		node.weight = 0;
	}
	if (action==-1) { //Remove
		node.remove = true;
		if (selected)  d3.select(selected).style("stroke-width", '0');
	}
	if (action==-2) { //Undo Remove
		delete node.remove;
	}			
	updateCallback(node);
}


function showInfo(display, graph)
{
	info_div = document.getElementById("infodiv");

	if (!info_div || info_div==undefined)
        return;

	info_div.innerHTML = 'No Nodes!';

	nn = graph.numberOfNodes();
	sum = 0;
	degs = graph.degree().values();
	for (v of degs) {
          sum += v;
    }
	avg_deg = sum/nn;
	//console.log(selected_id);
	len = generalNetworkData.nodes.length;
	str = "<h3>Network Info</h3>";
	str += "<p>Name:  " + generalNetworkData.graph.name  + "</p>";
    str += "<p>No. of Nodes: " + nn + ", ";
	str += "No. of Edges: " + graph.numberOfEdges() + "</p>";
	str += "<p>Avg. Degree: " + avg_deg.toFixed(2) + ", ";
	str += "Node Density: " + jsnx.density(graph).toFixed(4) + "</p>";
    str += "<p>Comm. range:  " + generalNetworkData.graph.r  + "</p>";
    str += "<p>Width:  " + generalNetworkData.graph.width  + ",  ";
    str += "Height:  " + generalNetworkData.graph.height  + "</p>";
    holeData = generalNetworkData.graph.holes;
    //console.log(holeData);
    if (holeData && holeData.obstacle.length > 0) {			
		str += "<p>Obstacle(s):";
		for (var k = 0; k < holeData.obstacle.length; k++) {
			holeCoords = holeData.obstacle[k];
			str += "<br>&nbsp;&nbsp;" + (k + 1) + "." + holeCoords.name + ", Top Left: (" + holeCoords.x + ", " +  holeCoords.y + "), " +  
				"&nbsp;Width: " + holeCoords.width + ", Height:" + holeCoords.height;
		}
		str += "</p>";	
	}	
	
    if (nn > 0) {
        str += '<table class="table table-condensed table-bordered"><tr>';
        str += '<th>Id/Name</th><th style="text-align: center;">Shape (size)</th><th style="text-align: center;">Location/Links</th>'+
			'<th style="text-align: center;">Action</th></tr>';
    }
	for (i = 0; i < nn; i++) {
		bg_color = ' ';
		
		node = generalNetworkData.nodes[i];
		links = ""+node.weight;
		if (i==selected_id) bg_color = ' style="background-color: lightgreen"';
		nodeTab = "$('.nav-tabs a[href=\"#node_control\"]').tab('show');";
		edit = '<input type="button" class="btn btn-primary btn-xs" value="Edit"'+
				'onclick="showNode('+ i + ');" />';
			
		if (node.remove==true) {
			bg_color = ' style="background-color: darkgrey"';
			links = "Removed";
			edit = '<input type="button" class="btn btn-primary btn-xs" value="Undo" onclick="showNode('+ i + ');setNode(-2);" />';
		}	
        color = node.color;
		if (color=='blue') color = "0000ff";
		if (color=='red') color = "ff0000";
        color = color.replace('#', '');
		text_color = getContrastYIQ(color);
		//console.log("*****", color, text_color);
        colorCtr = '<td data-toggle="tooltip" data-placement="right" title="Click to Edit"' + 
			' style="cursor: pointer; text-align: center; vertical-align: center; padding: 2px; border-radius:8px; color: ' + 
			text_color +'; background-color: #' + color +'" onclick="showNode('+ i + ');">' + node.shape + ' (' + node.size +  ')</td>';
        //colorCtr = '<td style="text-align: center; vertical-align: middle; padding: 3px; border-radius:8px; color: ' +
        //    text_color +'; background-color: #' + color +'">' + node.shape + ' (' + node.size +  ')</td>';
			
        str += "<tr id=info"+ i + bg_color + "><td>" + node.id + '-' + node.name + "</td>" + colorCtr;
        str += "<td align='center'>" + Math.round(node.x) +", " + Math.round(node.y) + "  (" + links
				 + ")</td>";
		str += "<td align='center'>" + edit	 + "</td>";				 
		str += "</tr>"		 
    }
	str += '</table>';
	if (display)
        info_div.innerHTML = str;

}

function getColorCode(color_code) {
    Colors = ['FF0000', '008000', '0000FF', 'FFFF00', '303030', '808080', 'A52A2A', '00FFFF', 'FFA07A', 'F7F7F7'];
	var i=0;
	if (color_code=='blue') color = "0000ff";
	if (color_code=='red') color = "ff0000";	
	for (i = 0; i < Colors.length; i++) {
		color = "#"+Colors[i];
		if (color == color_code) break;		
	} 
	return i;
}
	
function getColor(id) {
    Colors = ['FF0000', '008000', '0000FF', 'FFFF00', '303030', '808080', 'A52A2A', '00FFFF', 'FFA07A', 'F7F7F7'];
	coloringElem = document.getElementById("nodecolor");

	if (id>=0) {
		coloring = id;
		if (id < 0 || id > 9) return null;
	} else
	   coloring = coloringElem.value;

    // console.log(id, coloring);
    if (coloring == -1) {
        color = null;
    }
    else {
        color = "#" + Colors[coloring];
    }
    return color
}

function getContrastColor(color)
{

	var rgbs = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	var brightness = 1;

	var r = rgbs[1];
	var g = rgbs[2];
	var b = rgbs[3];

	var o = Math.round(((parseInt(r) * 299) + (parseInt(g) * 587) + (parseInt(b) * 114)) /1000);
	cct = 'FFFFFF';
	if (o > 125) cct = '000000';


	var ir = Math.floor((255-r)*brightness);
	var ig = Math.floor((255-g)*brightness);
	var ib = Math.floor((255-b)*brightness);

	cc = rgb(ir,ig,ib);
	// console.log(color, cc, cct);
    return cc;
}

function getContrastYIQ(hexcolor)
{
	if ( hexcolor.charAt(0) == '#' )
		hexcolor = hexcolcor.slice(1);
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function label_control()
{
	updateCallback(generalNetworkData.nodes[0]);
}

function dark_control()
{
	updateCallback(generalNetworkData.nodes[0]);	
}

function grid_control()
{
	updateCallback(generalNetworkData.nodes[0]);	
}

function getBgInvColor() {
   bg = "transparent";//document.getElementById("network").style.backgroundColor;
   ibg = "#000";
   if (document.getElementById('dark').checked) {ibg = "#fff"; bg = "#000"; }
   return [bg, ibg];
} 

function addInput(divName, choices) {
    var select = $("<select/>")
    $.each(choices, function(a, b) {
        select.append($("<option/>").attr("value", b).text(b));
    });
    $("#" + divName).append(select);
}