var express = require("express");
var http = require("http");
var ws = require("ws");

var port = 8080;

var expressApp = express();
expressApp.use(express.static(__dirname + "/../public"));
var httpServer = http.createServer(expressApp);
httpServer.listen(port);
console.log("listening at http://127.0.0.1:" + port);

var webSocketServer = new ws.Server({server: httpServer});
webSocketServer.on("connection", function(socket) {
  console.log("websocket open");
  socket.on("message", function(data, flags) {
    console.log("received data:", JSON.stringify(data));
    socket.send("asdf");
  });
});
