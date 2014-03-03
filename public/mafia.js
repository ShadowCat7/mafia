
var loginDiv = document.getElementById("loginDiv");
var loginNameTextbox = document.getElementById("loginNameTextbox");
var loginButton = document.getElementById("loginButton");

loginNameTextbox.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
    // Enter
    login();
    event.preventDefault();
  }
});
loginButton.addEventListener("click", login);
function login() {
  var name = loginNameTextbox.value;
  name = name.trim();
  if (name === "") return;

  loginNameTextbox.setAttribute("disabled", "true");
  loginButton.setAttribute("disabled", "true");
  sendCommand("login", {name: name}, function(response) {
    playerList.innerHTML += '<li>login result: ' + sanitizeHtml(JSON.stringify(response)) + '</li>';
    loginDiv.style.display = "none";
  });
}

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
  });
  webSocket.addEventListener("message", function(event) {
    playerList.innerHTML += '<li>message received: ' + sanitizeHtml(event.data) + '</li>';
    var message = JSON.parse(event.data);
    receiveMessage(message);
  });
}

var nextMessageId = 0;
var messageCallbacks = {};
function sendCommand(commandName, args, callback) {
  var cookie = nextMessageId++;
  messageCallbacks[cookie] = callback;
  var commandObject = {
    command: commandName,
    args: args,
    cookie: cookie,
  };
  webSocket.send(JSON.stringify(commandObject));
}
function receiveMessage(message) {
  var cookie = message.cookie;
  var callback = messageCallbacks[cookie];
  callback(message.response);
}

function sanitizeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
