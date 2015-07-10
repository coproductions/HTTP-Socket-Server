var net = require('net');
var PORT = 8080;
var ADDRESS = '0.0.0.0';
var method = 'GET';

var responseCache = {};

process.stdin.setEncoding('utf8');
var requestArgument = process.argv[process.argv.length - 1];
var requestHost = requestArgument.split('/')[0];
console.log('host: ',requestHost);
var requestURI = requestArgument.slice(requestHost.length,requestArgument.length)
console.log('uri: ',requestURI);


if(process.argv.length > 3){
  switch(process.argv[2]){
    case '-method':
      method = process.argv[3];
      break;
    case '-head' :
      method = 'HEAD';
      break;
    case '-port' :
      PORT = Number(process.argv[3]);
      break;
  }

    var client = net.connect({port: PORT}, connectedToServer);
  client.setEncoding('utf8');

} else if(process.argv.length > 2){


  //only connect if there is a request argument
  var client = net.connect({port: PORT}, connectedToServer);
  client.setEncoding('utf8');

}
else{
  process.stdout.write('The following commands are available to you:\n-method: allows you to determine the method. Follow it with a method.\n-head: requests only the head.\n-port: needs to be followed by a port to determine the port.')
  //include held menu here
}


function connectedToServer(){
  console.log('client connected')
  client.on('data',responseHandler)
  var requestHeader = generateHeader(requestURI,requestHost,method)
  client.write(requestHeader);
}

function generateHeader(uri,host,method){
  var requestString = '';
  requestString += method+''+uri+' HTTP/1.1'+'\n';
  requestString += 'Date: '+new Date().toUTCString()+ '/n';
  requestString += 'Host: '+host + '/n';
  requestString += 'Const Http';
  console.log('requestString',requestString)
  return requestString;
}

function responseHandler(chunk){
  process.stdout.write(chunk);
  var responseHeader = chunk.split('\n\n')[0];
  var timeReceived = new Date().toUTCString();;
  responseCache[timeReceived] = responseHeader;
  console.log('cache',responseCache)

}