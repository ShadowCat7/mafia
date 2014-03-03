var express = require("express");
var http = require("http");
var ws = require("ws");
var crypto = require("crypto");

var port = 8080;

var expressApp = express();
expressApp.use(express.static(__dirname + "/../public"));
var httpServer = http.createServer(expressApp);
httpServer.listen(port);
var webSocketServer = new ws.Server({server: httpServer});
console.log("listening at http://127.0.0.1:" + port);

// a client is anyone with the webpage open (and a socket open) that's watching what's going on.
var clients = {};

webSocketServer.on("connection", function(socket) {
  var client = new Client(socket);
  clients[client.id] = client;
  console.log("client connected:", client.id);

  socket.on("message", function(data, flags) {
    var message = JSON.parse(data);
    console.log("received from " + client.id + ":", message);
    client.handleMessage(message);
  });

  socket.on("close", function() {
    console.log("client disconnected:", client.id);
    delete clients[client.id];
  });
});

function Client(socket) {
  this.socket = socket;
  // id is 12 letters
  this.id = generateRaneomBase64(9);
}
Client.prototype.handleMessage = function(message) {
  this.socket.send(typeof message);
};

function generateRaneomBase64(byteCount) {
  return crypto.pseudoRandomBytes(byteCount).toString('base64');
}
