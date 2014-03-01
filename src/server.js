var http = require('http');

var port = 8080;
console.log('listening at http://127.0.0.1:' + port);

http.createServer(function (request, response) {
	request.on('end', function () {
		response.end('let\'s play some mafia!');
	});

}).listen(port);

