var request = require('request');


exports.get = function(req, res, next) {
if(req.params.time === "current"){
	request.get('http://api.openweathermap.org/data/2.5/weather?q=Lollar&mode=json&units=metric', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    res.send(body); 
	  }   
	});
}else if(req.params.time === "hourly"){
		request.get('http://api.openweathermap.org/data/2.5/forecast?q=Lollar', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    res.send(body); 
		  }   
	});
}else if(req.params.time === "daily"){
	request.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=Lollar&mode=json&units=metric&cnt=7', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    res.send(body); 
	  }   
	});
	}
};