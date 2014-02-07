var fileSystem = require('fs');
var viewEngine = require('./viewengine');

var methods = {
	get: 'GET',
	post: 'POST',
	put: 'PUT',
	delete: 'DELETE'
};

var statusCodes = {
	ok: 200
}

var index = function (pathData, callback) {
	viewEngine.getView('index.html', undefined, function (view) {
		callback({
			statusCode: statusCodes.ok,
			data: view
		});
	});
};
index.path = '/';
index.method = methods.get;

var createGame = function (pathData, callback) {
	var fileName = './games/' + pathData.gameId;
	console.log(fileName);

	fileSystem.exists(fileName, function (exists) {
		if (exists) {
			callback({
				statusCode: 409,
				data: 'That name is already taken.'
			});
		}
		else {
			fileSystem.writeFile(fileName, 'taken', function (fileError) {
				if (fileError) {
					callback({
						statusCode: 500,
						data: 'Failure. Please try again.'
					});
				}
				else {
					callback({
						statusCode: 201,
						headers: {
							Location: '/games?gameId=' + pathData.gameId
						}
					});
				}
			});
		}
	});
};
createGame.path = '/games/create';
createGame.method = methods.post;

var getGame = function (pathData, callback) {
	var fileName = './games/' + pathData.gameId;

	fileSystem.exists(fileName, function (exists) {
		if (!exists) {
			callback({
				statusCode: 404,
				data: 'That game does not exist.'
			});
		}
		else {
			fileSystem.readFile(fileName, function (fileError, gameData) {
				if (fileError) {
					callback({
						statusCode: 500,
						data: 'Error while finding game.'
					});
				}
				else {
					viewEngine.getView('game.html', null, function (view) {
						callback({
							statusCode: 200,
							data: view
						});
					});
				}
			});
		}
	});
};
getGame.path = '/games';
getGame.method = methods.get;

module.exports = {
	index: index,
	createGame: createGame,
	getGame: getGame
};

