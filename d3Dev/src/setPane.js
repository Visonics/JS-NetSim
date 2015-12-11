var setPane = function(target, options){
  console.log(options);

  if (options.wipeOnNewLoad) {
    target.selectAll("*").remove();
  }

};