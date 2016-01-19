var controller = require('./controller.js');
var express = require('express');
var app = express();

app.get('/data/:name', controller.getData);
app.get('/data/', controller.getDataList);


app.get('/', function(req, res){
  res.send('JS-Netsim.')
})

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

