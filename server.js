var http = require('http')
  , nodestatic = require('node-static')
  , john = require('longjohn')
  , gs = require('./gitstore')('store');

var port = process.argv[2] || 1337;
var files = new nodestatic.Server('./public');

var server = http.createServer(function (request, response) {
               var url = request.url.split('/').filter(function(d){ return d });
               if(url[0] == 'show') {
                 var ref = url[1] || 'ROOT';
                 gs.show(ref, response);
               } else if (url[0] == 'commit') {
                 var buffer = "";
                 request.on('data', function(data) {
                   buffer += data;
                   if (buffer.length > 1e6) {
                     request.connection.destroy();
                   }
                 });
                 request.on('end', function() {
                   var message = JSON.parse(buffer);
                   gs.commit(JSON.stringify(message.state), message.parent, message.newref, response);
                 });
               } else {
                 if(url[0] == 'js') {
                   files.serve(request, response);
                 } else {
                   files.serveFile('index.html', 200, {}, request, response);
                 }
               }
             });

var initialTree = JSON.stringify([{children: [{children: [], parent: null, is_leaf: true, id: 'p0', chart: null, is_active: false }]}]);
gs.init(initialTree);

gs.on('init', function(){
  server.listen(port, function() {
    if(process.send) process.send({msg: 'ready', 'sender': port});
  });
})