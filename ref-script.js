const BOARD = document.getElementById("board");

pieces = [
	["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
	["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
	["", "", "wp", "wp", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "bp", "", "", "", "", ""],
	["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
	["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
];
activeColour = "b";
movesCount = 1;

selectedX = -1;
selectedY = -1;

draw();

function draw() {
	r = 0;
	for (rank of pieces) {
		f = 0;
		for (file of rank) {
			if (file == "") {
				BOARD.rows[r].cells[f].innerHTML = "";
			}
			else {
				BOARD.rows[r].cells[f].innerHTML = "<img src='pieces/" + file + ".svg' alt='" + file + "'>";
			}
			f += 1;
		}
		r += 1;
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

function selectSquare(cell) {
	x = cell.cellIndex;
	y = cell.parentElement.rowIndex;
	colour = pieces[y][x].charAt(0);
	piece = pieces[y][x].charAt(1);
	// Remove highlighting
	if (selectedX != -1) {
		BOARD.rows[selectedY].cells[selectedX].classList.remove("selected");
	}
	// If new pos is active colour's piece
	if (colour == activeColour) {
		// If new pos equals selected pos
		if (x == selectedX && y == selectedY) {
			// Clear selected pos
			selectedX = -1;
			selectedY = -1;
		}
		// If new pos not equals selected pos
		else {
			// Set selected pos, add highlighting
			selectedX = x;
			selectedY = y;
			BOARD.rows[selectedY].cells[selectedX].classList.add("selected");
			if (piece == "p") {
				output = "";
				for (move of getPawnPseudoMoves(colour, x, y)) {
					output += move + " : ";
				}
				document.getElementById("moves").innerHTML = output;
			}
		}
	}
	// If new pos not active colour's piece and there is a selected pos
	else if (selectedX != -1) {
		// Clear selected pos
		selectedX = -1;
		selectedY = -1;
	}
}

function getKnightPseudoMoves(colour, x, y) {
	// . 1 . 2 .
	// 8 . . . 3
	// . . K . .
	// 7 . . . 4
	// . 6 . 5 .
	moves = [];
	m1x = x - 1;
	m1y = y - 2;
	if (m1x in pieces && m1y in pieces) {
		if (pieces[m1x])
		moves.push([0, m1x, m1y]);
	}
	moves.push([0, x - 1, y - 2]);
	moves.push([0, x + 1, y - 2]);
	moves.push([0, x + 2, y - 1]);
	moves.push([0, x + 2, y + 1]);
	moves.push([0, x + 1, y + 2]);
	moves.push([0, x - 1, y + 2]);
	moves.push([0, x - 2, y + 1]);
	moves.push([0, x - 2, y - 1]);
	return moves;
}

function getPawnPseudoMoves(colour, x, y) {
	// TODO: Promotion, en passant
	moves = [];
	if (colour == "w") {
		// Every white pawn move requires at least one rank above
		if (y == 0) {
			return moves;
		}
		// a) Up 1 is a standard move
		if (pieces[y - 1][x] == "") {
			moves.push([x, y - 1, 0]);
		}
		// b) Up 2 is a standard move (if on 2nd rank)
		if (y == 6 && pieces[y - 1][x] == "" && pieces[y - 2][x] == "") {
			moves.push([x, y - 2, 0]);
		}
		// c) Up 1, left 1 is a capture
		if (x != 0 && pieces[y - 1][x - 1].charAt(0) == "b") {
			moves.push([x - 1, y - 1, 1]);
		}
		// d) Up 1, right 1 is a capture
		if (x != 7 && pieces[y - 1][x + 1].charAt(0) == "b") {
			moves.push([x + 1, y - 1, 1]);
		}
	}
	else {
		// Every black pawn move requires at least one rank below
		if (y == 7) {
			return moves;
		}
		// a) Down 1 is a standard move
		if (pieces[y + 1][x] == "") {
			moves.push([x, y + 1, 0]);
		}
		// b) Down 2 is a standard move (if on 7th rank)
		if (y == 1 && pieces[y + 1][x] == "" && pieces[y + 2][x] == "") {
			moves.push([x, y + 2, 0]);
		}
		// c) Down 1, left 1 is a capture
		if (x != 0 && pieces[y + 1][x - 1].charAt(0) == "w") {
			moves.push([x - 1, y + 1, 1]);
		}
		// d) Down 1, right 1 is a capture
		if (x != 7 && pieces[y + 1][x + 1].charAt(0) == "w") {
			moves.push([x + 1, y + 1, 1]);
		}
	}
	return moves;
}