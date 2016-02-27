
/////////////////////
//
// default.js
//
// This file is responsible for the rendering of nodes on a screen, on initial load
//
/////////////////////
//

var graphData = {
    "graph": {
        "name": "A Sample Network (move nodes to make a ring)",
        "r": 250,
        "drag": true,
        "width": 500,
        "height": 500
    },
    "nodes": [
        {
            "name": "0",
            "color": "blue",
            "shape": "square",
            "y": 105.0,
            "x": 104.0,
            "id": 0,
            "size": 10
        },
        {
            "name": "1",
            "color": "black",
            "shape": "circle",
            "y": 215.0,
            "x": 360.0,
            "id": 1,
            "size": 10
        },
        {
            "name": "2",
            "color": "red",
            "shape": "square",
            "y": 215.0,
            "x": 260.0,
            "id": 2,
            "size": 10
        },
        {
            "name": "3",
            "color": "green",
            "shape": "circle",
            "y": 315.0,
            "x": 10.0,
            "id": 3,
            "size": 15
        }
    ],
    "links": [
        {
            "source": 0,
            "target": 1
        },
        {
            "source": 0,
            "target": 2
        },
        {
            "source": 3,
            "target": 2
        },
        {
            "source": 3,
            "target": 1
        }
    ]
}

var DEFAULT_GEN = {
    r: 100,
    name: 'Random Graph',
    width: 700,
    height: 500,
    drag: true,
    color: 'blue',
    shape: 'circle',
    size: 10,
    numPixels: 50,
    randomFactor: 20
};


var newMap = generateTopology(DEFAULT_GEN.numPixels, DEFAULT_GEN.randomFactor, {

  graphSpecific: {
    name: 'Random 50 Nodes',
    r: DEFAULT_GEN.r,
    width: DEFAULT_GEN.width,
    height: DEFAULT_GEN.height,
    drag: DEFAULT_GEN.drag
  },

  nodeSpecific: {
    color: DEFAULT_GEN.color,
    shape: DEFAULT_GEN.shape,
    size: DEFAULT_GEN.size
  }

});

displayNetwork(newMap);
