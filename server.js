var http = require('http')
  , nodestatic = require('node-static')
  , john = require('longjohn')

var port = process.argv[2] || 1337;
var files = new nodestatic.Server('./public');

http.createServer(function (request, response) {
  request.addListener('end', function() {
    files.serve(request, response);
  }).resume();
}).listen(port, function() {
  if(process.send) process.send({msg: 'ready', 'sender': port});
});