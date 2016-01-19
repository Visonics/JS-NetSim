// This will change based on what a user picks...
var wipeOnNewLoad = false;

var loadFile = function() {
  var input, file, fr;

  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('fileinput');
  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];

    if (!file || file.type !== "application/json") {
      alert("Pick a file, and ensure that it is type json");
      return;
    }

    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e) {
    lines = e.target.result;
    var graphData = JSON.parse(lines); 
    if (!wipeOnNewLoad) wipeOnNewLoad = true;
    var network = NetworkXGenerator(graphData);
    render(network, {wipeOnNewLoad: wipeOnNewLoad, width: graphData.height, height: graphData.width}, graphData.graph.name);
  }
}