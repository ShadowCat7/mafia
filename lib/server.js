var express = require("express");
var ws = require("ws");

var port = 8080;

var app = express();
app.use(express.static(__dirname + "/../public"));
app.listen(port);

console.log("listening at http://127.0.0.1:" + port);

var webSocketServer = new ws.Server({server: app});
webSocketServer.on("connection", function(socket) {
  socket.on("message", function(data, flags) {
    console.log("received data:", JSON.stringify(data));
    socket.send("asdf");
  });
});
