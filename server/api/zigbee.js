var socketClient = require('../service/socket.js');

exports.AddDeviceToGroup = function(req,res,next){
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.sendmode + "/" + req.params.gpid +"/" + req.params.gpname;
	if(!socketClient.client){
		res.status(400).json({
			message: 'No available Socket on this port'
		});
	}else{
		socketClient.client.write('AddToGroup/' + payload);
		res.status(200).json({
			message: 'OK'
		});
    }
	next();
};

exports.RemoveGroupFromDevice = function(req,res,next){
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.sendmode + "/" + req.params.gpid ;

	if(!socketClient.client){
		res.status(400).json({
			message: 'No available Socket on this port'
		});
	}else{
		socketClient.client.write('RemoveFromGroup/' + payload);
		res.status(200).json({
			message: 'OK'
		});
	}
	next();
};

exports.getDevice = function(req, res, next) {
	console.log('GET /devices');
	var issend = false;

	if(!socketClient.client){
		res.status(400).json({
			message: 'No available Socket on this port'
		});
	}else{
		socketClient.client.write('UpdateList');
		socketClient.client.on('data', function(data) {
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
					res.status(200).json(JSON.parse(jsonResponse));
					issend = true;
				}
			});
	}			
};

exports.network = function(req, res) {
	if(!socketClient.client){
		res.status(400).json({
			message: 'No available Socket on this port'
		});
	}else{
		socketClient.client.write('OpenNetwork');
		res.status(200).json({
			message : 'OK'
		});
	}
};