var request = require('request');

exports.get = function(req, res, next) {
	console.log('Get Weather condition');
if(req.params.time === "current"){
	request.get('http://api.openweathermap.org/data/2.5/weather?q=Lollar&mode=json&units=metric', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    res.status(200).send(body); 
	  }else{
	  	res.status(400).json({
	  		message: "Bad Request", 
	  	});
	  }   
	});
}else if(req.params.time === "hourly"){
		request.get('http://api.openweathermap.org/data/2.5/forecast?q=Lollar', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    res.status(200).send(body); 
		  }else{
	  	res.status(400).json({
	  		message: "Bad Request", 
	  	});
	  }      
	});
}else if(req.params.time === "daily"){
	request.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=Lollar&mode=json&units=metric&cnt=7', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    res.status(200).send(body); 
	  }else{
	  	res.status(200).json(
	  		{"cod":"200","message":2.1617,"city":{"id":"2876027","name":"Lollar","coord":{"lon":8.70357,"lat":50.6475},"country":"Germany","population":0},"cnt":7,"list":[{"dt":1426762800,"temp":{"day":285.87,"min":277.21,"max":287.59,"night":277.21,"eve":283.84,"morn":285.87},"pressure":998.98,"humidity":85,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"02d"}],"speed":2.12,"deg":44,"clouds":8},{"dt":1426849200,"temp":{"day":284.81,"min":274.57,"max":285.1,"night":275.21,"eve":281.13,"morn":274.57},"pressure":997.01,"humidity":76,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":1.96,"deg":351,"clouds":0},{"dt":1426935600,"temp":{"day":280.42,"min":273.05,"max":280.42,"night":273.05,"eve":278.31,"morn":275.89},"pressure":988.71,"humidity":88,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":6.41,"deg":304,"clouds":32,"rain":1.4,"snow":0.01},{"dt":1427022000,"temp":{"day":276.46,"min":270.1,"max":276.46,"night":270.1,"eve":274.2,"morn":274.83},"pressure":999.8,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":5.17,"deg":56,"clouds":94,"rain":0.5,"snow":0.36},{"dt":1427108400,"temp":{"day":278.45,"min":270.19,"max":278.45,"night":272.07,"eve":277.02,"morn":270.19},"pressure":996.24,"humidity":0,"weather":[{"id":800,"main":"Clear","description":"sky is clear","icon":"01d"}],"speed":2.03,"deg":143,"clouds":3,"snow":0},{"dt":1427194800,"temp":{"day":280.04,"min":271.51,"max":280.04,"night":275.32,"eve":278.23,"morn":271.51},"pressure":989.08,"humidity":0,"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"speed":4.55,"deg":282,"clouds":20,"rain":1.08},{"dt":1427281200,"temp":{"day":277.65,"min":272.24,"max":277.65,"night":272.24,"eve":275.8,"morn":274.74},"pressure":985.46,"humidity":0,"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"speed":2.21,"deg":307,"clouds":62,"rain":2.99,"snow":1.15}]}
	  	);
	  }      
	});
	}
};