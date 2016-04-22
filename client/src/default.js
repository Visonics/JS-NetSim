
/////////////////////
//
// default.js
//
// This file is responsible for the rendering of nodes on a screen, on initial load
//
/////////////////////
//

var Nodeshapes = {
  "diamond": {"d": "M0,-9.306048591020996L5.372849659117709,0 0,9.306048591020996 -5.372849659117709,0Z", "zoom": 11 },
  "circle": {"d": "M0,5.641895835477563A5.641895835477563,5.641895835477563 0 1,1 0,-5.641895835477563A5.641895835477563,5.641895835477563 0 1,1 0,5.641895835477563Z", 
              "zoom": 11 },
  "square": {"d": "M-5,-5L5,-5 5,5 -5,5Z", "zoom": 11 },
  "cross": {"d": "M-3,-10L3,-10L3,10L-3,10z M-10,3L-10,-3L10,-3L10,3z", "zoom": 11 },
  //"star-cross": {"d": "M-3,-10L3,10L-3,10z M-10,-3L-10,3L10,3z", "zoom": 11 },
  "triangle-up": {"d": "M0,-9.3L8.3,9.3 -8.3,9.3z", "zoom": 11 },
  "triangle-down": {"d": "M0,9.3L8.3,-9.3 -8.3,-9.3z", "zoom": 11 },
}


var DEFAULT_GEN = {
  r: 120,
  min_r: 5,
  max_r: 200,
  name: 'Random Graph',
  width: 700,
  height: 500,
  drag: true,
  color: '#0000FF',  // blue
  max_color: 2,
  shape: 'square',
  size: 10,
  min_size: 5,
  max_size: 30,
  numPixels: 40,
  max_nodes: 500,
  randomFactor: 10
};


var newMap = generateTopology(
  null,
  DEFAULT_GEN.randomFactor,
  {
    graphSpecific: {
      name: 'Random Nodes',
      r: DEFAULT_GEN.r,
      width: DEFAULT_GEN.width,
      height: DEFAULT_GEN.height,
      drag: DEFAULT_GEN.drag
    },
    nodeSpecific: {
      color: null, //Use random
      shape: null,
      size: null
    }
  });

displayNetwork(newMap);
updateCallback(newMap.nodes[0]); 
