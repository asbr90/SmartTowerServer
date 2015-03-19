var socketClient = require('../service/socket');

var thunderstorm = "bf";
var drizzle = "af";
var rain = "55";
var snow = "00";
var atmosphere = "40";
var clouds =  "e1";
var extreme = "cf";
var additional = "80";

exports.setWeatherHue = function(req,res,next){
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

	socketClient.client.write('HueColor/' + payload);
	res.status(200).json(
	{
		message: "OK" 
	});
};

exports.changeHue = function(req, res, next) {
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.value + "/" + req.params.sendmode;

	if (req.params.state === "color") {
		socketClient.client.write('HueColor/' + payload);
		res.json({
			message : 'HueColor/' + payload
		});
	} else if (req.params.state === "state") {
		socketClient.client.write('HueState/' + payload);
		res.json({
			message : 'HueState/' + payload
		});
	} else if (req.params.state === "level") {
		socketClient.client.write('HueLevel/' + payload);
		res.json({
			message : 'HueLevel/' + payload
		});
	} else if (req.params.state === "saturation") {
		socketClient.client.write('HueSaturation/' + payload);
		res.json({
			message : 'HueSaturation/' + payload
		});
	}	
};

exports.changeXYHue = function(req, res, next) {
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			 + req.params.sendmode + "/" +req.params.ratex + "/" +req.params.ratey;

	socketClient.client.write('HueColorXY/' + payload);
	res.status(200).json(
	{
		message: payload, 
	})
};