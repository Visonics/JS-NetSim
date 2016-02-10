var DATA_DIRECTORY = '/data/';
var fs = require('fs');
module.exports = {
  // body...
  getData: function(req, res) {
    fs.readFile(__dirname + DATA_DIRECTORY + req.params.name, 'utf8', function (err, data) {
      res.send(data);
    });
  },

  getDataList: function(req, res) {
    fs.readdir(__dirname + DATA_DIRECTORY, function(err, dataNames){
      res.send(dataNames);
    });
  }
}