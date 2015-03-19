var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var cors = require('express-cors');
var request = require('request');
var ioSocket = require('./service/socket');
var weather = require('./api/weather');
var hue = require('./api/hue');
var zigbee = require('./api/zigbee');
var powersocket = require('./api/powersocket');


app.use(cors({
	allowedOrigins : [ 'http://localhost:8001','http://localhost:3000' ]
}));

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

router.get('/', function(req, res) {
	res.json({
		message : 'Smart Towert API!'
	});
});
router.get('/weather/:time', weather.get);

//set the color on dependency of weather conditions
router.get('/bulb/:nodeid/:endpoint/:sendmode/:weatherCcondition', hue.setWeatherHue);

router.get('/network/open', zigbee.network);

router.get('/hue/:state/:nodeid/:endpoint/:sendmode/:value', hue.changeHue);

router.get('/hue/colorXY/:nodeid/:endpoint/:sendmode/:ratex/:ratey',hue.changeXYHue);

router.get('/group/:nodeid/:endpoint/:sendmode/:gpid/:gpname', zigbee.AddDeviceToGroup);

router.delete('/group/:nodeid/:endpoint/:sendmode/:gpid', zigbee.RemoveGroupFromDevice);

router.get('/devices', zigbee.getDevice);

router.get('/socket/:state/:nodeid/:endpoint/:sendmode/:value', powersocket.getSocket);

app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Smart Tower server on port ' + port);
