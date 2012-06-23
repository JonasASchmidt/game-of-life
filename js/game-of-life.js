var dimension = 50;
var chanceOfLiveCell = 0.5;
var table;
var cells;

$(function () {
	table = $('#main');
	initializeGame();
	cells = table.find('td');
	placeRandomCells();
	playGame();
});

function initializeGame()  {
	var trHtml = [];
	for (var y = 0; y < dimension; y++) {
		trHtml.push('<tr>');
		for (var x = 0; x < dimension; x++) {
			trHtml.push('<td></td>');
		}
		trHtml.push('</tr>');
	}
	trHtml = trHtml.join('');
	table.append($(trHtml));
};

function placeRandomCells() {
	for (var y = 0; y < dimension; y++) {
		for (var x = 0; x < dimension; x++) {
			var cell = getCell(x, y);
			if (Math.random() > chanceOfLiveCell) { cell.addClass('alive'); }
			else { cell.removeClass('alive'); }
		}
	}
};

function playGame() {
	playGeneration();
};

function playGeneration() {
	prepareNextGeneration();
	renderNextGeneration();
	
	setTimeout('playGeneration()', 250);
};

function prepareNextGeneration() {
	for (var y = 0; y < dimension; y++) {
		for (var x = 0; x < dimension; x++) {
			var cell = getCell(x, y);
			var neighbours = getLiveNeighbourCount(x, y);
			
			cell.attr('isalive', 'false');
			if (isCellAlive(x, y)) {
				if (neighbours === 2 || neighbours === 3) {
					cell.attr('isalive', 'true');
				}
			} else if (neighbours === 3) {
				cell.attr('isalive', 'true');
			}
		}
	}
}

function renderNextGeneration() {
	cells.each(function () {
		var cell = $(this);
		cell.removeClass('alive');
		if (cell.attr('isalive') === 'true') cell.addClass('alive');
		cell.removeAttr('isalive');
	});
};

function getLiveNeighbourCount(x, y) {
	var count = 0;
	if (isCellAlive(x-1, y-1)) count++;
	if (isCellAlive(x, y-1)) count++;
	if (isCellAlive(x+1, y-1)) count++;
	if (isCellAlive(x-1, y)) count++;
	if (isCellAlive(x+1, y)) count++;
	if (isCellAlive(x-1, y+1)) count++;
	if (isCellAlive(x, y+1)) count++;
	if (isCellAlive(x+1, y+1)) count++;
	return count;
};

function isCellAlive(x, y) {
	return getCell(x, y).attr('class') === 'alive';
};

function getCell(x, y) {
	if (x >= dimension) { x = 0; }
	if (y >= dimension) { Y = 0; }
	if (x < 0) { x = dimension -  1; }
	if (y < 0) { y = dimension - 1; }
	return $(cells[y * dimension + x]);
}
