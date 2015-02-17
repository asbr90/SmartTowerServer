/*Start here the nodejs server to define a RESTful API */

var express = require('express');
var http = require('http'); 

var app = express();
app.get('*', function (req, res) {
  res.contentType('text/html');
  res.send(200, 'Hallo Welt!');
});
http.createServer(app).listen(3000);