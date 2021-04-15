const BOARD = document.getElementById("board");
const LOCK_BOARD = document.getElementById("lockBoard");

const FILES = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7};
const RANKS = {"8": 0, "7": 1, "6": 2, "5": 3, "4": 4, "3": 5, "2": 6, "1": 7};

var activeColour = "w";
var board = [
	["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
	["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
	["", "", "wp", "wp", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "bp", "", "", "", "", ""],
	["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
	["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
];
var boardColour = "w";
var moveCount = 0;
var selectedCell = "";

drawBoard();

function getPseudoMoves() {
	for (row of board) {
		for (cell of board) {
			if (cell.charAt(0) == activeColour) {
				console.log("TODO");
			}
		}
	}
}

function nextMove() {
	// Clear highlighting (e.g. selected cell)
	if (selectedCell != "") {
		y = RANKS[selectedCell.charAt(1)];
		x = FILES[selectedCell.charAt(0)];
		BOARD.rows[y].cells[x].classList.remove("selected");
		selectedCell = "";
	}
	// Update active colour
	if (activeColour == "w") {
		activeColour = "b";
		document.getElementById("ac").innerHTML = "Black's move";
		document.getElementById("ac").style.color = "#000000";
	}
	else {
		activeColour = "w";
		document.getElementById("ac").innerHTML = "White's move";
		document.getElementById("ac").style.color = "#ffffff";
	}
	// Update move counter (half-move)
	moveCount += 1;
	document.getElementById("mc").innerHTML = moveCount + " moves";
	// Draw board
	drawBoard();
}

function drawBoard() {
	yIndex = 0;
	for (row of BOARD.rows) {
		xIndex = 0;
		for (cell of row.cells) {
			piece = board[yIndex][xIndex];
			if (piece == "") {
				cell.innerHTML = "<p>" + cell.id + "</p>";
			}
			else {
				cell.innerHTML = "<img src='pieces/" + piece + ".svg'>";
			}
			xIndex += 1;
		}
		yIndex += 1;
	}
	if (!LOCK_BOARD.checked && boardColour != activeColour) {
		flipBoard();
	}
}

function clearSelectedCell() {
	if (selectedCell != "") {
		console.log("Deselecting selected cell...");
		x = FILES[selectedCell.charAt(0)];
		y = RANKS[selectedCell.charAt(1)];
		BOARD.rows[y].cells[x].classList.remove("selected");
		selectedCell = "";
	}
}

function clickedCell(cell) {
	console.clear();
	
	console.log("Selected pos: " + selectedCell);
	console.log("Clicked pos: " + cell.id);
	console.log("Clicked innerHTML: " + cell.innerHTML);
	
	x = FILES[cell.id.charAt(0)];
	y = RANKS[cell.id.charAt(1)];
	piece = board[y][x];
	
	// Click the selected cell to deselect
	if (cell.id == selectedCell) {
		clearSelectedCell();
	}
	// If active colour's piece
	else if (piece != "" && piece.charAt(0) == activeColour) {
		clearSelectedCell();
		console.log("Selecting clicked cell...");
		BOARD.rows[y].cells[x].classList.add("selected");
		selectedCell = cell.id;
	}
	// Not active colour's piece
	else {
		clearSelectedCell();
	}
}

function flipBoard() {
	if (boardColour == "w") {
		boardColour = "b";
		BOARD.style.transform = "rotate(180deg)";
		for (row of BOARD.rows) {
			for (cell of row.cells) {
				cell.style.transform = "rotate(180deg)";
			}
		}
	}
	else {
		boardColour = "w";
		BOARD.style.transform = "";
		for (row of BOARD.rows) {
			for (cell of row.cells) {
				cell.style.transform = "";
			}
		}
	}
}