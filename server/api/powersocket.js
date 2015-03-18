var socketClient = require('../service/socket.js');

exports.getSocket = function(req,res, next) {
	var payload = req.params.nodeid + "/" + req.params.endpoint + "/"
			+ req.params.value + "/" + req.params.sendmode;
	if(!socketClient.client){
		res.status(400).json({
			message: 'No available Socket on this port'
		});
	}else{
		if (req.params.state === "info") {
			client.write('SocketInformation/' + payload);
			// need response from socket
		} else if (req.params.state === "state") {
			client.write('SocketState/' + payload);
		}
		res.status(200).json({
			message: 'OK'
		});
	}
	next();
};