var express = require("express");
var http = require("http");
var ws = require("ws");
var crypto = require("crypto");

// setup networking
var port = 8080;
var expressApp = express();
expressApp.use(express.static(__dirname + "/../public"));
var httpServer = http.createServer(expressApp);
httpServer.listen(port);
var webSocketServer = new ws.Server({server: httpServer});
console.log("listening at http://127.0.0.1:" + port);

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

// a client is anyone with the webpage open (and a socket open) that's watching what's going on.
function Client(socket) {
  this.socket = socket;
  // id is 12 characters
  this.id = generateRaneomBase64(9);
  // human name
  this.name = "Anonymous";
}
Client.prototype.handleMessage = function(message) {
  var commandName = message.command;
  var args = message.args;
  var cookie = message.cookie;
  switch (commandName) {
    case "login":
      this.login(cookie, args);
      break;
    default:
      console.log("bad command name: " + JSON.stringify(commandName));
  }
};
Client.prototype.login = function(cookie, args) {
  this.name = args.name;
  this.sendMessage(cookie, "OK");
};
Client.prototype.sendMessage = function(cookie, response) {
  var message = {
    cookie: cookie,
    response: response,
  };
  this.socket.send(JSON.stringify(message));
};

function generateRaneomBase64(byteCount) {
  return crypto.pseudoRandomBytes(byteCount).toString('base64');
}
