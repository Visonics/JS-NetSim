// Done. 
// Not optimised for efficiency or readability. Just "works".

// Returns an array. 
// First element is a matrix with all coordinates.
// Second element is the width and height
// Last multiple is the number used for the pixels

var pixelScreen = function  (numPixels) {

  if (numPixels === 0) {
    return;
  }
  // body...
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

  var coordinateGenerator = function (w, h) {
    var SET_INTERVAL_FINAL = .5;
    var cooridantes = [];
    var startingH = h -.5;
    for (var i = 0; i < h; i++) {
      var startingW = .5;
      cooridantes.push([]);
      for (var j = 0; j < w ; j++) {

        cooridantes[i].push([startingW, startingH]);
        startingW += 1;
      }
      startingH -= 1;
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

  return [coordinateGenerator(w, h), smallestMultiple, unPrimePixel];


}


