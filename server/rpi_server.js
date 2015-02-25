var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var net = require('net');
var Forecast = require('forecast');
var cors = require('express-cors')

var HOST = '192.168.1.114';
var PORT = 51717;
var client = new net.Socket(); // connect to Hardware-Layer

// Initialize
var forecast = new Forecast({
	service : 'forecast.io',
	key : '88e750b2992857ef17c874e812bc4ad0',
	units : 'celcius', // Only the first letter is parsed
	cache : true, // Cache API requests?
	ttl : { // How long to cache requests. Uses syntax from moment.js:
		// http://momentjs.com/docs/#/durations/creating/
		minutes : 27,
		seconds : 45
	}
});

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

// Retrieve weather information, ignoring the cache
forecast.get([ 50.5833, 8.65 ], true, function(err, weather) {
	if (err)
		return console.dir(err);
	console.dir(weather);
});

router.get('/weather', function(req, res, next) {
	forecast.get([ 50.5833, 8.65 ], true, function(err, weather) {
		if (err)
			return console.dir(err);
		res.json({
			weather : weather.currently
		});
	});
		next();
});

router.get('/', function(req, res) {
	res.json({
		message : 'Smart Towert API!'
	});
});

app.post('/network', function(req, res) {
	res.json({
		message : 'network information'
	});
});

router.get('/network/scan', function(req, res) {
	res.json({
		message : 'Scan network information'
	});
});

router.get('/network/open', function(req, res) {
	res.json({
		message : 'Open network information'
	});
});

router.get('/hue', function(req, res) {
	res.json({
		message : 'List of hues'
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

router.get('/hue/:id', function(req, res) {
	res.json({
		message : 'Get information of hue with id: ' + req.params.id
	});
});

router.get('/devices', function(req, res, next) {
	client.write('UpdateList');
	console.log('GET /devices');
	
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

		}3000

		console.log('JSON',jsonResponse);
		jsonResponse = jsonResponse.concat("]");
		//TODO asnychrone response not work. Need it for dynmical calls
		res.json(JSON.parse(jsonResponse));
	});	
	var DefjsonResponse = " [{ \"nodeid\": \"05A3\", \"endpoint\": \"0B\" ,\"deviceid\": \"0210\"},{\"nodeid\": \"30A5\", \"endpoint\": \"0B\" ,\"deviceid\": \"0210\"},{\"nodeid\": \"3A4F\", \"endpoint\": \"01\" ,\"deviceid\": \"0009\"}]";//Default Values

	//res.json(JSON.parse(DefjsonResponse));
		
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
// Add a 'data' event handler for the client socket
// data is what the server sent to this socket

// Add a 'close' event handler for the client socket
client.on('close', function() {
	console.log('Connection closed');
});

client.on('error', function() {
	console.log('No available Socket on this port');
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Smart Tower server on port ' + port);
