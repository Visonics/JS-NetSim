// This will change based on what a user picks...
var svg = false;
var force = false;

var serverURL = "http://jsnetsim.herokuapp.com"

var wipeOnNewLoad = false;

var JSONLoaded = false;

var clearpane = function(){
  JSONLoaded = false;
  changeLoadButton();
  $('.networkview').empty();
  $(".networkview").removeClass("svgborder");
  svg = false;
  force = false;
}

var makeRadioDiv = function(name) {
  return '<div class="radio"><label><input type="radio" name="optradio" value="' + name + '">' + name + '</label></div>';
}

var changeLoadButton = function() {
  if (JSONLoaded) {
    $('#loadbutton').text('Graph Settings');
  } else {
    $('#loadbutton').text('Load JSON');

  }
}

var showModal = function() {
  if (!JSONLoaded) {

    $('#filePickerModal').modal('show');

    $.ajax({
      url: serverURL + '/data',
      success: function(data) {
        $('.server-selection').empty();
        data.forEach(function(element){
          $('.server-selection').append(makeRadioDiv(element));
        })
      }
    })

  } else {
    displayNetworkSettings();
    $('#graphSettingsModal').modal('show');
  }
}

var displayNetwork = function(graphData) {
  if (!wipeOnNewLoad) wipeOnNewLoad = true;
  var network = NetworkXGenerator(graphData);
  render(network, {wipeOnNewLoad: wipeOnNewLoad, width: graphData.graph.width,
    height: graphData.graph.height}, graphData.graph.name);
}

var loadFile = function() {

  $('#filePickerModal').modal('hide');


  var serverDataFile = $('input[name=optradio]:checked', '.server-selection').val();
  if (serverDataFile) {
    $.ajax({
      url: serverURL + '/data/' + serverDataFile,
      success: function(data) {
        var parsed = JSON.parse(data);
        displayNetwork(parsed);
      }
    })

    JSONLoaded = true;
    changeLoadButton();
    return;
  }

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
      //Farrukh - I need to comment following 2 lines to make it work
      //alert("Pick a file, and ensure that it is type json");
      //return;
    }

    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
    JSONLoaded = true;
    changeLoadButton();
  }

  function receivedText(e) {
    lines = e.target.result;
    var graphData = JSON.parse(lines); 
    displayNetwork(graphData);
  }
}

