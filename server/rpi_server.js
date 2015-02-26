var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var net = require('net');
var cors = require('express-cors');
var request = require('request');

var HOST = '192.168.0.12';
var PORT = 51717;
var client = new net.Socket(); // connect to Hardware-Layer

var thunderstorm = "bf";
var drizzle = "af";
var rain = "55";
var snow = "00";
var atmosphere = "40";
var clouds =  "a9";
var extreme = "cf";
var additional = "80";

app.use(cors({
	allowedOrigins : [ 'http://localhost:8001','http://localhost:3000' ]
}))

app.use(bodyParser.urlencoded({
	extended : true
}));

app.use(bodyParser.json());

var port = process.env.PORT || 3000; // set our port

var router = express.Router(); // get an instance of the express Router
// middleware to use for all requests

router.use(function(req, res, next) {
	// do logging
	console.log('Received Request', req.originalUrl);
	next(); // make sure we go to the next routes and don't stop here
});

router.get('/weather/:time', function(req, res, next) {

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
});

//set the color on dependency of weather conditions
router.get('/bulb/:nodeid/:endpoint/:sendmode/:weatherCcondition', function(req,res,next){
	var condition = req.params.weatherCcondition;
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/";

	if(condition >= 200 && condition <=232){
		//Thunderstorm: 
		payload = payload + thunderstorm + "/";
	}else if(condition >= 300 && condition <=321){
		//drizzle: 
		payload = payload + drizzle + "/";
	}else  if(condition >= 500 && condition <=531){
		//rain: 
		payload = payload + rain + "/";
	}else if(condition >= 600  && condition <=622){
		//snow: 
		payload = payload + snow + "/";
	}else if(condition >= 701 && condition <=781){
		//atmosphere: 
		payload = payload + atmosphere + "/";
	}else if(condition >= 800 && condition <=804){
		//clouds: 
		payload = payload + clouds + "/";
	}else if(condition >= 900 && condition <=906){
		//extreme: 
		payload = payload + extreme + "/";
	}else if(condition >= 951 && condition <=962){
		//additional: 
		payload = payload + additional + "/";
	}
	payload += req.params.sendmode;

	client.write('HueColor/' + payload);
});

router.get('/', function(req, res) {
	res.json({
		message : 'Smart Towert API!'
	});
});

router.get('/network/open', function(req, res) {
	client.write('OpenNetwork');
	res.json({
		message : 'Open network for 60s'
	});
});


router.get('/hue/:state/:nodeid/:endpoint/:sendmode/:value',
		function(req, res, next) {
			var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
					+ req.params.value + "/" + req.params.sendmode;

			if (req.params.state === "color") {
				client.write('HueColor/' + payload);
				res.json({
					message : 'HueColor/' + payload
				});
			} else if (req.params.state === "state") {
				client.write('HueState/' + payload);
				res.json({
					message : 'HueState/' + payload
				});
			} else if (req.params.state === "level") {
				client.write('HueLevel/' + payload);
				res.json({
					message : 'HueLevel/' + payload
				});
			} else if (req.params.state === "saturation") {
				client.write('HueSaturation/' + payload);
				res.json({
					message : 'HueSaturation/' + payload
				});
			}	
		});


router.get('/hue/colorXY/:nodeid/:endpoint/:sendmode/:ratex/:ratey',
		function(req, res, next) {
			console.log("Change XY Color")
			var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
					 + req.params.sendmode + "/" +req.params.ratex + "/" +req.params.ratey;

			client.write('HueColorXY/' + payload);
			next();
		});

router.get('/group/:nodeid/:endpoint/:sendmode/:gpid/:gpname', function(req,res,next){
	console.log('Add Device to Group');
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.sendmode + "/" + req.params.gpid +"/" + req.params.gpname;
	client.write('AddToGroup/' + payload);
	next();
});

router.get('/group/:nodeid/:endpoint/:sendmode/:gpid', function(req,res,next){
	console.log('Remove Device to Group');
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.sendmode + "/" + req.params.gpid ;
	client.write('RemoveFromGroup/' + payload);
	next();
});

router.delete('/group/:nodeid/:endpoint/:sendmode/:gpid/', function(req,res,next){
	consolose.log("Delete");
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.sendmode + "/" + req.params.gpid;
			client.write(payload);
	next();
});

router.get('/devices', function(req, res, next) {
	client.write('UpdateList');
	console.log('GET /devices');
	var issend = false;
	client.on('data', function(data) {
		var values = String(data);
		var a = values.split("\r\n");
		var jsonResponse = String("[");

		for (var i = 0; i < a.length - 1; i++) {
			var result = a[i].split("/");
			var nodeID = result[1].split(":")[0];
			var deviceID = result[1].split(":")[1];
			var endpoint = result[1].split(":")[2];

			jsonResponse = jsonResponse.concat("{ \"nodeid\": \"" + nodeID
					+ "\"");
			jsonResponse = jsonResponse.concat(", \"endpoint\": \""
					+ result[1].split(":")[2] + "\"");
			jsonResponse = jsonResponse.concat(" ,\"deviceid\": \"" + deviceID
					+ "\"}");
			if ((i + 1) < (a.length - 1))
				jsonResponse = jsonResponse.concat(",");
		}
	
		jsonResponse = jsonResponse.concat("]");
		if(!issend){
				res.json(JSON.parse(jsonResponse));
				issend = true;
			}
	});			
});

router.get('/socket/:state/:nodeid/:endpoint/:sendmode/:value', function(req,
		res, next) {
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.value + "/" + req.params.sendmode;

	if (req.params.state === "info") {
		client.write('SocketInformation/' + payload);
		// need response from socket
	} else if (req.params.state === "state") {
		client.write('SocketState/' + payload);
	}
	next();
});

client.connect(PORT, HOST, function() {
	console.log('CONNECTED TO: ' + HOST + ':' + PORT);
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
	console.log('Connection closed');
});

client.on('error', function() {
	console.log('No available Socket on this port');
});

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Smart Tower server on port ' + port);
