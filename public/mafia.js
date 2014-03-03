
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
    console.log("login result:", JSON.stringify(response));
    loginDiv.style.display = "none";
  });
}

var clientList = document.getElementById("clientList");

var myClientId = null;
var webSocket = null;
connectWebSocket();
function connectWebSocket() {
  var url = "ws://" + location.hostname + ":" + location.port + location.pathname;
  webSocket = new WebSocket(url);
  console.log("websocket connecting");
  webSocket.addEventListener("close", function() {
    console.log("websocket closed");
  });
  webSocket.addEventListener("open", function() {
    console.log("websocket open");
  });
  webSocket.addEventListener("message", function(event) {
    console.log("message received:", event.data);
    var message = JSON.parse(event.data);
    receiveMessage(message);
  });
}

function updateStatus(status) {
  var clients = [];
  for (var id in status.clients) {
    clients.push(status.clients[id]);
  }
  clientList.innerHTML = clients.map(function(player) {
    return '<li>' + sanitizeHtml(player.name) + '</li>';
  }).join("");
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
  var response = message.response;
  if (cookie === "status") {
    updateStatus(response);
  } else {
    var callback = messageCallbacks[cookie];
    callback(message.response);
  }
}

function sanitizeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
