/*Start here the nodejs server to define a RESTful API */

var express = require('express');
var http = require('http'); 

var app = express();
app.get('/', function (req, res) {
  res.contentType('text/html');
  res.send(200, '<h1>Illuminate the Smart Tower</h1>');
});

app.get('/Hue',function(req,res){

});

http.createServer(app).listen(3000);