var width = 700;
var height = 500;

var setPane = function(target, options){
  console.log(options);

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