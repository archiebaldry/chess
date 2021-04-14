const BOARD = document.getElementById("board");

var board = [
	"br", "bn", "bb", "bq", "bk", "bb", "bn", "br",
	"bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp",
	"", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "",
	"wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp",
	"wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"
];
var selectedCell = "";

drawBoard();

function drawBoard() {
	index = 0;
	for (row of BOARD.rows) {
		for (cell of row.cells) {
			piece = board[index];
			if (piece == "") {
				cell.innerHTML = "<p>" + cell.id + "</p>";
			}
			else {
				cell.innerHTML = "<img src='pieces/" + piece + ".svg'>";
			}
			index += 1;
		}
	}
}

function clickedCell(cell) {
	console.clear();
	console.log("Selected pos: " + selectedCell);
	console.log("Clicked pos: " + cell.id);
	console.log("Clicked innerHTML: " + cell.innerHTML);
	if (cell.id == selectedCell) {
		console.log("Deselecting cell...");
		selectedCell = "";
	}
	else {
		console.log("Selecting cell...");
		selectedCell = cell.id;
	}
}