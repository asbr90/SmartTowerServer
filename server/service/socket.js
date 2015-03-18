var net = require('net');

var HOST = '192.168.0.12';
var PORT = 51717;
var client = new net.Socket(); // connect to Hardware-Layer

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