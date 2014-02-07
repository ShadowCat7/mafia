var fileSystem = require('fs');

var anyPattern = /\@(?!!)\(.*?\)/;
var layoutPattern = /^layout\=/i;
var dataPattern = /^data\./i;

function getView(viewName, viewData, callback) {
	fileSystem.readFile('views/' + viewName, 'utf-8', function (fileError, fileData) {
		if (fileError)
			throw fileError;

		fillView(fileData, viewData, callback);
	});
}

function fillView(view, viewData, callback) {
	var match = anyPattern.exec(view);

	if (!match || match === null) {
		callback(view);
	}
	else {
		match = match[0].slice(2, match[0].length - 1);

		if (layoutPattern.test(match))
			getLayout(match.slice(7, match.length), view, viewData, callback);
		else if (dataPattern.test(match))
			fillData(match.slice(5, match.length), view, viewData, callback);
	}
}

function getLayout(layoutName, view, viewData, callback) {
	fileSystem.readFile('views/' + layoutName, 'utf-8', function (fileError, fileData) {
		if (fileError)
			throw fileError;

		fillView(fileData.replace(anyPattern, view.replace(anyPattern, '')), viewData, callback);
	}); 
}

function fillData(fieldName, view, viewData, callback) {
	fillView(view.replace(anyPattern, viewData[fieldName]), viewData, callback);
}

module.exports = {
	getView: getView
};
