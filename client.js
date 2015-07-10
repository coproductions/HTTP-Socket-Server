var net = require('net');
var PORT = 8080;
var ADDRESS = '0.0.0.0';

var responseCache = {};

process.stdin.setEncoding('utf8');
var requestArgument = process.argv[2];


if(requestArgument){
  var requestHost = requestArgument.split('/')[0];
  console.log('host: ',requestHost);
  var requestURI = requestArgument.slice(requestHost.length,requestArgument.length)
  console.log('uri: ',requestURI);

  //only connect if there is a request argument
  var client = net.connect({port: PORT}, connectedToServer);
  client.setEncoding('utf8');

} else{
  process.stdout.write('hello')

}


function connectedToServer(){
  console.log('client connected')
  client.on('data',responseHandler)
  var requestHeader = generateHeader(requestURI,requestHost)
  client.write(requestHeader);
}

function generateHeader(uri,host){
  var requestString = '';
  requestString += 'GET '+uri+' HTTP/1.1'+'\n';
  requestString += 'Date: '+new Date().toUTCString()+ '/n';
  requestString += 'Host: '+host + '/n';
  requestString += 'Const Http';
  return requestString;
}

function responseHandler(chunk){
  process.stdout.write(chunk);
  console.log('chunk:',chunk)
  var responseHeader = chunk.split('\n\n')[0];
  var timeReceived = toString(Date.now());
  responseCache[timeReceived] = responseHeader;
  console.log('cache',responseCache)

}