const BOARD = document.getElementById("board");
const LOCK_BOARD = document.getElementById("lockBoard");

const FILES = {"a": 0, "b": 1, "c": 2, "d": 3, "e": 4, "f": 5, "g": 6, "h": 7};
const RANKS = {"8": 0, "7": 1, "6": 2, "5": 3, "4": 4, "3": 5, "2": 6, "1": 7};

var activeColour = "w";
var board = [
	["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
	["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
	["", "", "wp", "wp", "", "", "", ""],
	["", "", "", "", "", "wn", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "bp", "", "", "", "", ""],
	["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
	["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
];
var boardColour = "w";
var moveCount = 0;
var selectedCell = "";

drawBoard();

function getPiecePseudoMoves(type, colour, x, y) {
	// TODO: Promotion, en passant
	let moves = [];
	let otherColour = "b";
	if (colour == "b") {
		otherColour = "w";
	}
	if (type == "p") {
		if (colour == "w") {
			// Every move requires at least one free cell above
			if (y == 0) {
				return moves;
			}
			// Move: Push (up 1)
			if (board[y - 1][x] == "") {
				moves.push([x, y - 1, false]);
			}
			// Move: Double push (up 2, if on 2nd rank)
			if (y == 6 && board[y - 1][x] == "" && board[y - 2][x] == "") {
				moves.push([x, y - 2, false]);
			}
			// Capture: Left (up 1, left 1)
			if (x != 0 && board[y - 1][x - 1].charAt(0) == "b") {
				moves.push([x - 1, y - 1, true]);
			}
			// Capture: Right (up 1, right 1)
			if (x != 7 && board[y - 1][x + 1].charAt(0) == "b") {
				moves.push([x + 1, y - 1, true]);
			}
		}
		else {
			// Every move requires at least one free cell below
			if (y == 7) {
				return moves;
			}
			// Move: Push (down 1)
			if (board[y + 1][x] == "") {
				moves.push([x, y + 1, false]);
			}
			// Move: Double push (down 2, if on 7th rank)
			if (y == 1 && board[y + 1][x] == "" && board[y + 2][x] == "") {
				moves.push([x, y + 2, false]);
			}
			// Capture: Left (down 1, left 1)
			if (x != 0 && board[y + 1][x - 1].charAt(0) == "w") {
				moves.push([x - 1, y + 1, true]);
			}
			// Capture: Right (down 1, right 1)
			if (x != 7 && board[y + 1][x + 1].charAt(0) == "w") {
				moves.push([x + 1, y + 1, true]);
			}
		}
	}
	else if (type == "n") {
		// Top moves require at least two clear cells above
		if (y > 1) {
			// Move/Capture: Top-left
			if (x != 0) {
				if (board[y - 2][x - 1] == "") {
					moves.push([x - 1, y - 2, false]);
				}
				else if (board[y - 2][x - 1].charAt(0) == otherColour) {
					moves.push([x - 1, y - 2, true]);
				}
			}
			// Move/Capture: Top-right
			if (x != 7) {
				if (board[y - 2][x + 1] == "") {
					moves.push([x + 1, y - 2, false]);
				}
				else if (board[y - 2][x + 1].charAt(0) == otherColour) {
					moves.push([x + 1, y - 2, true]);
				}
			}
		}
		// // Right moves require at least two clear cells to the right
		// if (x < 6) {
		// 	// Move/Capture: Upper-right
		// 	if (x != 0) {
		// 		if (board[y - 2][x - 1] == "") {
		// 			moves.push([x - 1, y - 2, false]);
		// 		}
		// 		else if (board[y - 2][x - 1].charAt(0) == otherColour) {
		// 			moves.push([x - 1, y - 2, true]);
		// 		}
		// 	}
		// 	// Move/Capture: Lower-right
		// 	if (x != 7) {
		// 		if (board[y - 2][x + 1] == "") {
		// 			moves.push([x + 1, y - 2, false]);
		// 		}
		// 		else if (board[y - 2][x + 1].charAt(0) == otherColour) {
		// 			moves.push([x + 1, y - 2, true]);
		// 		}
		// 	}
		// }
		// Bottom moves require at least two clear cells below
		if (y < 6) {
			// Move/Capture: Bottom-left
			if (x != 0) {
				if (board[y + 2][x - 1] == "") {
					moves.push([x - 1, y + 2, false]);
				}
				else if (board[y + 2][x - 1].charAt(0) == otherColour) {
					moves.push([x - 1, y + 2, true]);
				}
			}
			// Move/Capture: Bottom-right
			if (x != 7) {
				if (board[y + 2][x + 1] == "") {
					moves.push([x + 1, y + 2, false]);
				}
				else if (board[y + 2][x + 1].charAt(0) == otherColour) {
					moves.push([x + 1, y + 2, true]);
				}
			}
		}
	}
	return moves;
}

function nextMove() {
	// Clear highlighting (e.g. selected cell)
	clearSelectedCell();
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
	let yIndex = 0;
	for (row of BOARD.rows) {
		let xIndex = 0;
		for (cell of row.cells) {
			let piece = board[yIndex][xIndex];
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
		let selected_x = FILES[selectedCell.charAt(0)];
		let selected_y = RANKS[selectedCell.charAt(1)];
		BOARD.rows[selected_y].cells[selected_x].classList.remove("selected");
		selectedCell = "";
		console.log("Cleared selected cell at", selected_x, selected_y);
	}
}

function onCellClicked(cell) {
	console.clear();
	
	// console.log("Selected pos: " + selectedCell);
	// console.log("Clicked pos: " + cell.id);
	// console.log("Clicked innerHTML: " + cell.innerHTML);

	drawBoard();

	let x = FILES[cell.id.charAt(0)];
	let y = RANKS[cell.id.charAt(1)];
	let piece = board[y][x];
	let previousCell = selectedCell;

	clearSelectedCell();

	// Piece exists, belongs to active colour and wasn't previously selected
	if (piece != "" && piece.charAt(0) == activeColour && cell.id != previousCell) {
		BOARD.rows[y].cells[x].classList.add("selected");
		selectedCell = cell.id;
		console.log("Selected cell at", x, y);
		let moves = getPiecePseudoMoves(piece.charAt(1), piece.charAt(0), x, y);
		for (move of moves) {
			let move_x = move[0];
			let move_y = move[1];
			let move_type = move[2];
			BOARD.rows[move_y].cells[move_x].innerHTML += "<img class='above' src='pieces/rk.svg'></img>";
			console.log(move);
		}
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

function fromFen(fen) {
	// Split FEN record into its fields
	fields = fen.split(" ");
	// Pieces
	file = 0;
	rank = 0;
	for (char of fields[0]) {
		// Char is not a number
		if (isNaN(char)) {
			// Char is a new rank
			if (char == "/") {
				file = 0;
				rank += 1;
			}
			// Char is a piece
			else {
				// Piece is white
				if (char == char.toUpperCase()) {
					pieces[rank][file] = "w" + char.toLowerCase();	
				}
				// Piece is black
				else {
					pieces[rank][file] = "b" + char;	
				}
				// Char is last file
				if (file == 8) {
					rank += 1;
					file = 0;
				}
				// Char is not last file
				else {
					file += 1;
				}
			}
		}
		// Char is a number, empty square(s)
		else {
			for (let i = 0; i < char; i++) {
				pieces[rank][file] = "";
				file += 1;
			}
		}
	}
	// Active colour
	activeColour = fields[1];
	// Moves count
	movesCount = parseInt(fields[5]);
	// Draw the pieces
	draw();
}