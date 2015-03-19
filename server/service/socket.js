var net = require('net');

var HOST = '192.168.0.23';
var PORT = 51717;
var socketClient = new net.Socket(); 
exports.client = socketClient;

socketClient.connect(PORT, HOST, function() {
	console.log('CONNECTED TO: ' + HOST + ':' + PORT);
});

// Add a 'close' event handler for the client socket
socketClient.on('close', function() {
	console.log('Connection closed');
});

socketClient.on('error', function() {
	console.log('No available Socket on this port');
});