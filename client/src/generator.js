$('.generatedsettings').toggle();

var getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var pixelScreen = function  (numPixels, randomFactor, width, height, holes) {

  if (numPixels === 0) {
    return;
  }

  var isPrime = function (num) {
    for (var i = 2; i < Math.floor(num / 2) + 1; i++) {
      if (num % i === 0) {
        return false;
      }
    }

    return true;
  };

  var unPrimePixel = function(num){

    var belowNum = num;

    while (isPrime(belowNum)) {
      belowNum++;
    }

    return belowNum;

  };

  var factorArray = function(num) {
    var factors = [];
    var paired = [];

    paired.push([1, num]);

    for (var i = 2; i < Math.floor(num / 2) + 1; i++) {
      if (num % i === 0) {
        if (factors.length === 0) {
          factors.push(i);
        } else {
          for (var j = 0; j < factors.length; j++) {
            if (factors[j] * i === num) {
              paired.push([factors[j], i]);
            } 
          }
          factors.push(i);
        }
      }

      if (i * i === num) {
        paired.push([i, i]);
      }

    }

    return paired;
  };

  var smallestDistance = function (arr) {
    var lowest = Infinity;
    var lowestLocation;
    for (var i = 0; i < arr.length; i++) {
      if ((arr[i][1] - arr[i][0]) < lowest) {
        lowest = arr[i][1] - arr[i][0];
        lowestLocation = i;
      }
    }

    return lowestLocation;
  };

  var coordinateGenerator = function (w, h, width, height, holeData) {
    var SET_INTERVAL_HEIGHT = 0.95*height/h;
    var SET_INTERVAL_WIDTH = 0.95*width/w;
    var cooridantes = [];
    var startingH = height - SET_INTERVAL_HEIGHT;
    for (var i = 0; i < h; i++) {
      var startingW = randomFactor;
      cooridantes.push([]);
      for (var j = 0; j < w ; j++) {

        var randomW = getRandom(randomFactor * -1, randomFactor) + startingW;
        var randomH = getRandom(randomFactor * -1, randomFactor) + startingH;

        var skip = false;

        if (holeData) {
          for (var k = 0; k < holeData.obstacle.length; k++) {

            var holeCoords = holeData.obstacle[k];
            //var distance = dist(randomW, randomH, holeCoords.x * 2, holeCoords.y * 2);
            if (randomW > holeCoords.x * 2 && randomW < holeCoords.x * 2 + holeCoords.width * 2 && 
                randomH > holeCoords.y * 2 && randomH < holeCoords.y * 2 + holeCoords.height * 2) {
              skip = true;
              break;
            }
          }
        }

        if (!skip) {
          cooridantes[i].push([randomW, randomH]);
        }

        startingW += SET_INTERVAL_WIDTH;

      }
      startingH -= SET_INTERVAL_HEIGHT;
    }
    return cooridantes;
  };


  if (isPrime(numPixels)) {
    unPrimePixel = unPrimePixel(numPixels);
  } else {
    unPrimePixel = numPixels;
  }

  var x = factorArray(unPrimePixel);
  var smallestMultiple = x[smallestDistance(x)];

  // Larger multiple will be width. 
  // Smaller will be height.
  var w = smallestMultiple[1];
  var h = smallestMultiple[0];

  return [coordinateGenerator(w, h, width, height, holes), smallestMultiple, unPrimePixel];
};

var generateTopology = function(numNodes, randomFactor, graphData) {
  numPixels = numNodes || getRandom(20,100);
  var cooridantes = pixelScreen(
    numPixels, 
    randomFactor, 
    graphData.graphSpecific.width, 
    graphData.graphSpecific.height,
    graphData.graphSpecific.holes
  )[0];

  var graph = {};
  graph.graph = {};

  graph.links = [];

  for (var key in graphData.graphSpecific) {
       graph.graph[key] = graphData.graphSpecific[key];
  }

  shapes = ["square", "circle"];
  graph.nodes = [];

  var idCount = 0;
  for (var i = 0; i < cooridantes.length; i++) {
    for (var j = 0; j < cooridantes[i].length; j++) {

      var node = {
        x: cooridantes[i][j][0],
        y: cooridantes[i][j][1],
        color: graphData.nodeSpecific.color || getColor(getRandom(0,DEFAULT_GEN.max_color)),
        id: idCount,
        shape: graphData.nodeSpecific.shape || shapes[getRandom(0,1)],
        name: idCount + "",
        size: graphData.nodeSpecific.size || getRandom(DEFAULT_GEN.min_size,DEFAULT_GEN.max_size)
      };

      graph.nodes.push(node);

      idCount++;
    }
  }

  return graph;
};

// Blockade dataset
var dataset = 
  {
    r: 120,
    obstacle: []
  };

function updateBlockadeCircle(isHeight) {

  d3.select('.obstacle-map').selectAll('*').remove();
  dataset = 
  {
    r: 120,
    obstacle: []
  };

  if (isHeight) {
    height = parseInt($('#graphheight').val());
  } else {
    width = parseInt($('#graphwidth').val());
  }

  var obstacle_map = d3.select('.obstacle-map')
      .append("svg")
      .attr("width", width/2) // Scale it down
      .attr("height", height/2)
      .attr("class", "obstacle-svg")
      .on("click", function(){
          var coords = d3.mouse(this);
          var newData = {
              x: Math.round( coords[0]),  // Takes the pixel number to convert to number
              y: Math.round( coords[1])
          };

          var circleAttrs = {
            cx: function(d) { return coords[0]; },
            cy: function(d) { return coords[1]; },
            r: parseInt($('#holeradius').val())/2
          };

          dataset.obstacle.push(newData);

          obstacle_map.selectAll("circle")  // For new circle, go through the update process
              .data(dataset.obstacle)
              .enter()
              .append("circle")
              .attr(circleAttrs); // Get attributes from circleAttrs var
      });

}

function updateBlockade(isHeight) {

  d3.select('.obstacle-map').selectAll('*').remove();
  w =  parseInt($('#holeWidth').val());
  h =  parseInt($('#holeHeight').val());    
  dataset = 
  {
    width: w,
    height: h,
    obstacle: []
  };

  //if (isHeight) {
    height = parseInt($('#graphheight').val());
  //} else {
    width = parseInt($('#graphwidth').val());
  //}

  var obstacle_map = d3.select('.obstacle-map')
      .append("svg")
      .attr("width", width/2) // Scale it down
      .attr("height", height/2)
      .attr("class", "obstacle-svg")
      .on("click", function(){
          var coords = d3.mouse(this);
          var newData = {
              x: Math.round( coords[0]),  // Takes the pixel number to convert to number
              y: Math.round( coords[1]),
              width: w,
              height: h              
          };
          //console.log(newData, w, h);
          dataset.obstacle.push(newData);
          obstacle_map.selectAll("rect")  // For new rect, go through the update process
              .data(dataset.obstacle)
              .enter()
              .append("rect")
              .attr(newData); // Get attributes from rectAttrs var
      });

}

var generateFromForm = function () {

  // Load data from text
  // Call generate with data (see default.js)
  // Call displayNetwork with data returned from generate
  var numPixels = parseInt($('#nodenum').val() || DEFAULT_GEN.numPixels);
  var color_code = parseInt($('#nodecolor').val());
  var randomFactor = parseInt($('#randomfactor').val() || DEFAULT_GEN.randomFactor);
  var holeRadius = parseInt($('#holeradius').val());

  dataset.r = holeRadius || dataset.r;

  var graphData = {
    graphSpecific: {
      r: parseInt($("#rval").val() || DEFAULT_GEN.r),
      name: $("#graphname").val() || DEFAULT_GEN.name,
      width: parseInt($('#graphwidth').val() || DEFAULT_GEN.width),
      height: parseInt($('#graphheight').val() || DEFAULT_GEN.height),
      drag: DEFAULT_GEN.drag,
      holes: dataset
    },

    nodeSpecific: {
      color: getColor(color_code),
      shape: $('#nodeshape').val(),
      size: $('nodesize').val() || DEFAULT_GEN.size
    }
  };

  var newMap = generateTopology(numPixels, randomFactor, graphData);
  displayNetwork(newMap);

  // updateBlockade(); // Resets the obstacle interface on a graph generation.
};

