
var playerList = document.getElementById("playerList");

var webSocket = null;
connectWebSocket();
function connectWebSocket() {
  var url = "ws://" + location.hostname + ":" + location.port + location.pathname;
  webSocket = new WebSocket(url);
playerList.innerHTML += '<li>websocket connecting...</li>';
  webSocket.addEventListener("error", function() {
    playerList.innerHTML += '<li>websocket error</li>';
  });
  webSocket.addEventListener("open", function() {
    playerList.innerHTML += '<li>websocket open</li>';
    webSocket.send("fdsa");
  });
  webSocket.addEventListener("message", function(event) {
    playerList.innerHTML += '<li>message received: ' + event.data + '</li>';
  });
}
