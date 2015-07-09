module.exports = (function(){

  var ok200 = 'HTTP/1.1 200 OK';
  var notFound404 = 'HTTP/1.0 404 Not Found';
  var notModified304 = 'HTTP/1.1 304 Not Modified';
  var type = 'Content-Type: text/html; charset=utf-8';

  return  {
    ok200 : ok200,
    notFound404 : notFound404,
    notModified304 : notModified304,
    type : type
  }
})();