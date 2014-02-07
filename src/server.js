var http = require('http');
var urlHelper = require('url');
var queryStringParser = require('querystring');

var controller = require('./controller.js');

var pathMap = {};
pathMapInit();

http.createServer(function (request, response) {
	var parsedUrl = urlHelper.parse(request.url);
	var requestData;

	request.setEncoding('utf-8');

	request.on('data', function (chunk) {
		requestData = queryStringParser.parse(chunk);
	});

	request.on('end', function () {
		doPathAction({
			path: parsedUrl.pathname,
			method: request.method,
			data: requestData
		}, function (result) {
			response.writeHead(result.statusCode, result.headers);
			response.end(result.data);
		});
	});
}).listen(8080);

function doPathAction(pathDetails, callback) {
	var path = pathMap[pathDetails.path];
	var pathFound = false;

	if (path) {
		var pathAction = path[pathDetails.method];

		if (pathAction) {
			pathFound = true;
			pathAction(pathDetails.data, callback);
		}
	}
	
	if (!pathFound) {
		callback({
			statusCode: 404,
			data: '404: Not Found'
		});
	}
}

function pathMapInit() {
	for (var actionName in controller) {
		var action = controller[actionName];

		if (!pathMap[action.path])
			pathMap[action.path] = {};

		if (pathMap[action.path][action.method]) {
			throw new Error([
				'Two paths with the same name and method:',
				pathMap[action.path][action.method],
				pathMap[action.path][action.method]
			].join('\n'));
		}

		pathMap[action.path][action.method] = action;
	}
}

