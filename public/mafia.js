
var playerList = document.getElementById("playerList");

var webSocket = null;
connectWebSocket();
function connectWebSocket() {
  var url = "ws://" + location.hostname + ":" + location.port + location.pathname;
  webSocket = new WebSocket(url);
  playerList.innerHTML += '<li>websocket connecting...</li>';
  webSocket.addEventListener("close", function() {
    playerList.innerHTML += '<li>websocket closed</li>';
  });
  webSocket.addEventListener("open", function() {
    playerList.innerHTML += '<li>websocket open</li>';
    webSocket.send(JSON.stringify(["hello", "world"]));
  });
  webSocket.addEventListener("message", function(event) {
    playerList.innerHTML += '<li>message received: ' + event.data + '</li>';
  });
}
