var net = require('net');
var PORT = 8080;
var ADDRESS = '0.0.0.0';
var resources = require('./resources.js');
var responses = require('./responses.js');
var server = net.createServer(socketConnected);
var timeServerStarted = Date.now();

server.listen(PORT, function(){
  console.log('server bound to ',PORT)
})

  //write a function that generates a header giving it input like statuscode and bodylength
function generateHeader(statuscode,bodylength){
  var date = new Date().toUTCString();
  var responseHeader = '';
  switch(statuscode){
    case 200:
      responseHeader+= responses.ok200+'\n';
      break;
    case 404:
      responseHeader+= responses.notFound404+'\n';
      break;
    case 304:
      responseHeader += response.notModified304+'\n';
      break;
  }
  responseHeader+= 'Server: Const Server 1.0'+'\n'
  responseHeader+= 'Date:'+ date + '\n';
  responseHeader+= 'Content-Length: '+ bodylength + '\n';
  responseHeader+= 'Connection: Close';
  return responseHeader;
}

function checkForIfModifiedRequest(text){
  var reg = /If-Modified-Since:/gi;
  var reg2 = /(If-Modified-Since): (\w+, \d{1,2} \w{3} \d{4} \d{1,2}:\d{1,2}:\d{1,2} \w{3})/gi;
  if(reg.test(text)){
    var regArray = reg2.exec(text);
    var date = regArray[2];
    var parsedDate = Date.parse(date);
    console.log('parsed date',parsedDate)
    return parsedDate;
  }
  return false;
}

function socketConnected(socket){
  console.log('socket is connected')
  socket.setEncoding('utf8');
  socket.on('data',function(chunk){
    var bodyString ='';
    var responseString ='';
    var statuscode = null;
    var contentLength = null;
    var requestURI;
    var medhod;
    var httpVersion;
    console.log(chunk)
    method = chunk.split(' ')[0];
    requestURI = chunk.split(' ')[1];
    httpVersion = chunk.split(' ')[2];
    console.log('method',method)
    console.log('uri',requestURI)
    console.log('vertion',httpVersion)

    //checking for uri and adding content
    switch(requestURI){
      case '/':
        statuscode = 200;
        bodyString += '\n\n'+ resources.index;
        contentLength = resources.index.length;
        break;
      case '/hydrogen.html' :
        statuscode = 200;
        bodyString += '\n\n'+ resources.hydrogen;
        contentLength = resources.hydrogen.length;
        break;
      case '/helium.html' :
        statuscode = 200;
        bodyString += '\n\n'+ resources.helium;
        contentLength = resources.helium.length;
        break;
      case '/404.html' :
        statuscode = 200;
        bodyString += '\n\n'+ resources.fourofour;
        contentLength = resources.fourofour.length;
        break;
      case '/css/styles.css' :
        statuscode = 200;
        bodyString += '\n\n'+ resources.styles;
        contentLength = resources.styles.length;
        break;
      default :
        statuscode = 404;
        break;
    }

    //check for If-modified-request
    // if(checkForIfModifiedRequest(chunk)){
      console.log('what is chunk',typeof chunk)
      var ifModifiedRequestDate = checkForIfModifiedRequest(chunk);
      if(ifModifiedRequestDate){
        //see if time is different and thus chang status code
        if(timeServerStarted < ifModifiedRequestDate){
          statuscode = 304;
        }
      }
    // }

    //attach head
    var head = generateHeader(statuscode,contentLength);
    console.log('header',head)
    responseString+= head;


    //attach body
    if (method === 'GET' && statuscode === 200){
      responseString += bodyString;
    }

    //send to socket and disconnect socket
    socket.write(responseString)
    socket.end();
  });


  // socket.end();
}

