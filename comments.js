// Create web server
// Create a web server that can listen to requests for /hello and responds with some HTML that says <h1>Hello World</h1>
// For an extra challenge, make the homepage (localhost:8080) display a file index that links to both hello and goodbye and returns the HTML files for the selected option.

var http = require('http');
var fs = require('fs');
var url = require('url');
var port = 8080;

// create a server
var server = http.createServer(function (req, res) {
  console.log('request was made: ' + req.url);

  // get the url and parse it
  var parsedUrl = url.parse(req.url, true);
  // get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the query string as an object
  var queryStringObject = parsedUrl.query;

  // get the http method
  var method = req.method.toLowerCase();

  // get the headers as an object
  var headers = req.headers;

  // get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  req.on('end', function () {
    buffer += decoder.end();

    // choose the handler this request should go to, if one is not found, use the notFound handler
    var chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound;

    // construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200;

      // use the payload called back by the handler, or default to an empty object
      payload = typeof payload == 'object' ? payload : {};

      // convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // return the response