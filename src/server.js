var http = require('http');
var ws = require('ws');

var port = 8080;

var httpServer = http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('let\'s play some mafia!');
});
httpServer.listen(port);
console.log('listening at http://127.0.0.1:' + port);

var webSocketServer = new ws.Server({server: httpServer});
webSocketServer.on('connection', function (socket) {
  socket.on('message', function (data, flags) {
    console.log('received data:', JSON.stringify(data));
    socket.send('asdf');
  });
});
