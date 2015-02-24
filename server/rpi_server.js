var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var net = require('net');
var Forecast = require('forecast');
var cors = require('express-cors')

var HOST = '127.0.0.1';
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
	allowedOrigins : [ 'http://localhost:8001' ]
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
	console.log('Received Request', req.query);
	next(); // make sure we go to the next routes and don't stop here
});

// Retrieve weather information, ignoring the cache
forecast.get([ 50.5833, 8.65 ], true, function(err, weather) {
	if (err)
		return console.dir(err);
	console.dir(weather);
});

router.get('/weather', function(req, res) {
	forecast.get([ 50.5833, 8.65 ], true, function(err, weather) {
		if (err)
			return console.dir(err);
		res.json({
			weather : weather.currently
		});
	});
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
		function(req, res) {

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

router.get('/devices', function(req, res) {
	var nodeID;
	var deviceID;
	var endpoint;
	var cmd;
	
	client.write('UpdateList');
	
	client.on('data', function(data) {
		console.log('DATA: ' + data);
		var values = String(data);
	
		});
});

router.get('/socket/:state/:nodeid/:endpoint/:sendmode/:value', function(req,
		res) {
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.value + "/" + req.params.sendmode;

	if (req.params.state === "info") {
		client.write('SocketInformation/' + payload);
		// need response from socket
	} else if (req.params.state === "set") {
		client.write('SocketState/' + payload);
	}

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
