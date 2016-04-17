var width = 700;
var height = 500;
var selected_id = -1;

var setPane = function(target, options){
  // console.log(options);

  if (options.wipeOnNewLoad) {
    target.selectAll("*").remove();
  }

  if (options.width && options.height) {
    svg.attr("width", options.width)
    .attr("id", targetSvgId)
    .attr("height", options.height);
  } else {
    svg.attr("width", width)
    .attr("id", targetSvgId)
    .attr("height", height);
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
	show_node = document.getElementById("show_node");

	if (show_node && show_node.checked)
		$('.nav-tabs a[href="#node_control"]').tab('show');

	selected_id = node.id;
	document.getElementById("node_id").innerHTML = "" + node.id;
	document.getElementById("node_name").value = node.name;
	document.getElementById("node_x").innerHTML = "" + Math.round(node.x);
	//document.getElementById("node_x").max = network.width;
	document.getElementById("node_y").innerHTML = "" + Math.round(node.y);
	//document.getElementById("node_y").max = network.height;
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
	//node.x = document.getElementById("node_x").value;
	//node.y = document.getElementById("node_y").value;
	if (action==1) { //Add
		newId = generalNetworkData.nodes.length;
		if (node.name==''+node.id) node.name = ''+newId;
		node.id = newId;
		node.index = newId;
		node.weight = 0;
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
    if (nn > 0) {
        str += '<table class="table table-condensed table-bordered"><tr>';
        str += '<th>Id/Name</th><th style="text-align: center;">Shape (size)</th><th style="text-align: center;">Location/Links</th></tr>';
    }
	for (i = 0; i < nn; i++) {
		bg_color = '';
		if (i==selected_id) bg_color = 'style="background-color: grey"';
        color = generalNetworkData.nodes[i].color;
		if (color=='blue') color = "0000ff";
		if (color=='red') color = "ff0000";
        color = color.replace('#', '');
		text_color = getContrastYIQ(color);
		//console.log("*****", color, text_color);
        colorCtr = '<td style="text-align: center; vertical-align: middle; padding: 3px; border-radius:8px; color: ' +
            text_color +'; background-color: #' + color +'">' + generalNetworkData.nodes[i].shape + ' (' + generalNetworkData.nodes[i].size +  ')</td>';
        str += "<tr " + bg_color + "><td>" + generalNetworkData.nodes[i].id + '-' + generalNetworkData.nodes[i].name + "</td>" + colorCtr;
        str += "<td align='center'>" + Math.round(generalNetworkData.nodes[i].x) +", " + Math.round(generalNetworkData.nodes[i].y) + "  (" +
				generalNetworkData.nodes[i].weight + ")</td></tr>";
    }
	str += '</table>';
	if (display)
        info_div.innerHTML = str;

}

function getColorCode(color_code) {
    Colors = ['FF0000', '008000', '0000FF', 'FFFF00', '000000', '808080', 'A52A2A', '00FFFF', 'FFA07A'];
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
    Colors = ['FF0000', '008000', '0000FF', 'FFFF00', '000000', '808080', 'A52A2A', '00FFFF', 'FFA07A'];
	coloringElem = document.getElementById("nodecolor");

	if (id>=0) {
		coloring = id;
		if (id < 0 || id > 8) return null;
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
