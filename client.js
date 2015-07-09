var net = require('net');
var PORT = 8080;
var ADDRESS = '0.0.0.0';

var client = net.connect({port: PORT}, connectedToServer);

function connectedToServer(){
  console.log('client connected')
}