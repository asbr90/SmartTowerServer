var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var net = require('net');

var HOST = '127.0.0.1';
var PORT = 51717;
var client = new net.Socket(); // connect to Hardware-Layer

// configure app to use bodyParser()
// this will let us get the data from a POST
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

// test route to make sure everything is working (accessed at GET
// http://localhost:8080/api)
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
			}else if (req.params.state === "saturation") {
				client.write('HueSaturation/' + payload);
				res.json({
					message : 'HueSaturation/' + payload
				});
			}

			// Write a message to the socket as soon as the client is connected,
			// the
			// server will receive it as message from the client
		});

router.get('/hue/:id', function(req, res) {
	res.json({
		message : 'Get information of hue with id: ' + req.params.id
	});
});

router.get('/socket/:nodeid/:endpoint/:sendmode/:value', function(req, res) {
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.value + "/" + req.params.sendmode;
	res.json({
		message : 'SocketState/' + payload
	});

	client.write('SocketState/' + payload);

});

client.connect(PORT, HOST, function() {

	console.log('CONNECTED TO: ' + HOST + ':' + PORT);

});
// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
/*
 * client.on('data', function(data) { console.log('DATA: ' + data); // Close the
 * client socket completely // client.destroy();
 * 
 * });
 */
// Add a 'close' event handler for the client socket
client.on('close', function() {
	console.log('Connection closed');
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Smart Tower server on port ' + port);
