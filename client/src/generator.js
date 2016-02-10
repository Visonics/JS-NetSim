

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var pixelScreen = function  (numPixels, randomFactor, width, height) {

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
  }

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
  }

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
  }

  var coordinateGenerator = function (w, h, width, height) {
    var SET_INTERVAL_HEIGHT = height/h;
    var SET_INTERVAL_WIDTH = width/w;
    var cooridantes = [];
    var startingH = height - SET_INTERVAL_HEIGHT;
    for (var i = 0; i < h; i++) {
      var startingW = SET_INTERVAL_WIDTH;
      cooridantes.push([]);
      debugger;
      for (var j = 0; j < w ; j++) {
        debugger;
        var randomW = getRandom(randomFactor * -1, randomFactor);
        var randomH = getRandom(randomFactor * -1, randomFactor);
        cooridantes[i].push([startingW + randomW, startingH + randomH]);
        startingW += SET_INTERVAL_WIDTH;
      }

      startingH -= SET_INTERVAL_HEIGHT;

    }

    return cooridantes;
  }


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

  return [coordinateGenerator(w, h, width, height), smallestMultiple, unPrimePixel];
}

var generateTopology = function(numPixels, randomFactor, graphData) {
  var cooridantes = pixelScreen(
    numPixels, 
    randomFactor, 
    graphData.graphSpecific.width, 
    graphData.graphSpecific.height
  )[0];

  var graph = {};
  graph.graph = {};

  for (var key in graphData.graphSpecific) {
    graph.graph[key] = specificData[key];
  }


  graph.nodes = [];
  int idCount = 0;
  for (int i = 0; i < cooridantes.length; i++) {
    for (int j = 0; j < cooridantes[i].length; j++) {

      var node = {
        x: cooridantes[i][j][0];
        y: cooridantes[i][j][1];
        color: graphData.nodeSpecific.color;
        id: idCount,
        shape: graphData.nodeSpecific.shape;
        name: idCount + ""; 
      }

      idCount++;
    }
  }

  return graph;

}


