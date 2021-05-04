const ACTIVE_COLOUR = document.getElementById("active-colour");
const BOARD = document.getElementById("board");
const FEN_INPUT = document.getElementById("fen");
const MOVE_COUNT = document.getElementById("move-count");

// Reference game: https://lichess.org/vg8ou0o1#41
// 2R1k2r/2n3pp/3bpp2/B6q/2PP1P2/6P1/1Q5P/1N2KBNR b Kk - 0 21

var activeColour = "b";
var board = [
	["", "", "wr", "", "bk", "", "", "br"],
	["", "", "bn", "", "", "", "bp", "bp"],
	["", "", "", "bb", "bp", "bp", "", ""],
	["wb", "", "", "", "", "", "", "bq"],
	["", "", "wp", "wp", "", "wp", "", ""],
	["", "", "", "", "", "", "wp", ""],
	["", "wq", "", "", "", "", "", "wp"],
	["", "wn", "", "", "wk", "wb", "wn", "wr"]
];
var moveCount = 21;

var selectedPos = {x: -1, y: -1};
var lastMovePos = {x: 1, y: 0};
var lastMoveDestPos = {x: 2, y: 0};
var checkPos = {x: 4, y: 0};
var moves = [];

drawBoard();

function getFen() {
	let fen = "";
	let y = 0;
	for (row of board) {
		let emptyCount = 0;
		for (piece of row) {
			if (piece == "") {
				emptyCount += 1;
			}
			else {
				if (emptyCount > 0) {
					fen += emptyCount;
					emptyCount = 0;
				}
				let p = piece.charAt(1);
				if (piece.charAt(0) == "w") {
					fen += p.toUpperCase();
				}
				else {
					fen += p;
				}
			}
		}
		if (y < 7) {
			fen += "/";
			y += 1;
		}
	}
	fen += " " + activeColour + " KQkq - 0 " + moveCount;
	return fen;
}

function getOpponent(colour) {
	if (colour == "w") {
		return "b";
	}
	return "w";
}

function isLegalMove(colour, oldX, oldY, newX, newY) {
	let opponent = getOpponent(colour);
	let tempBoard = board;
	tempBoard[newY][newX] = tempBoard[oldY][oldX];
	tempBoard[oldY][oldX] = "";
	let y = 0;
	for (row of board) {
		let x = 0;
		for (piece of row) {
			if (piece.charAt(0) == opponent) {
				let m = [];
				let type = piece.charAt(1);
				if (type == "p") {
					m = getPawnMoves(opponent, x, y, tempBoard);
				}
				else if (type == "n") {
					m = getKnightMoves(opponent, x, y, tempBoard);
				}
				else if (type == "b") {
					m = getBishopMoves(opponent, x, y, tempBoard);
				}
				else if (type == "r") {
					m = getRookMoves(opponent, x, y, tempBoard);
				}
				else if (type == "q") {
					m = getBishopMoves(opponent, x, y, tempBoard).concat(getRookMoves(opponent, x, y, tempBoard));
				}
				else {
					m = getKingMoves(opponent, x, y, tempBoard);
				}
				for (move of m) {
					if (tempBoard[move.y][move.x] == colour + "k") {
						return false;
					}
				}
			}
			x += 1;
		}
		y += 1;
	}
	return true;
}

function pieceClicked(piece) {
	let classes = piece.classList;
	let colour = classes.item(1).charAt(0);
	if (colour == activeColour) {
		let x = parseInt(classes.item(2).charAt(1));
		let y = parseInt(classes.item(3).charAt(1));
		// Clear selection
		if (x == selectedPos.x && y == selectedPos.y) {
			selectedPos = {x: -1, y: -1};
			moves = [];
		}
		// Select piece, calculate moves
		else {
			let pseudoMoves = [];
			let type = classes.item(1).charAt(1);
			selectedPos = {x: x, y: y};
			if (type == "p") {
				pseudoMoves = getPawnMoves(colour, x, y);
			}
			else if (type == "n") {
				pseudoMoves = getKnightMoves(colour, x, y);
			}
			else if (type == "b") {
				pseudoMoves = getBishopMoves(colour, x, y);
			}
			else if (type == "r") {
				pseudoMoves = getRookMoves(colour, x, y);
			}
			else if (type == "q") {
				pseudoMoves = getBishopMoves(colour, x, y).concat(getRookMoves(colour, x, y));
			}
			else {
				pseudoMoves = getKingMoves(colour, x, y);
			}
			moves = [];
			for (move of pseudoMoves) {
				if (isLegalMove(getOpponent(colour), x, y, move.x, move.y)) {
					moves.push(move);
				}
			}
		}
		drawBoard();
	}
}

function moveClicked(move) {
	console.clear();
	console.log("Move clicked");
	let classes = move.classList;
	let x = parseInt(classes.item(1).charAt(1));
	let y = parseInt(classes.item(2).charAt(1));
}

function captureClicked(capture) {
	console.clear();
	console.log("Capture clicked");
	let classes = capture.classList;
	let x = parseInt(classes.item(1).charAt(1));
	let y = parseInt(classes.item(2).charAt(1));
}

function getPawnMoves(colour, x, y, b = board) {
	let m = [];
	// White
	if (colour == "w") {
		// Every move requires at least one free cell above
		if (y == 0) {
			return m;
		}
		// Push
		if (b[y - 1][x] == "") {
			m.push({isCapture: false, x: x, y: y - 1});
		}
		// Double push
		if (y == 6 && b[y - 1][x] == "" && b[y - 2][x] == "") {
			m.push({isCapture: false, x: x, y: y - 2});
		}
		// Left
		if (x != 0 && b[y - 1][x - 1].charAt(0) == "b") {
			m.push({isCapture: true, x: x - 1, y: y - 1});
		}
		// Right
		if (x != 7 && b[y - 1][x + 1].charAt(0) == "b") {
			m.push({isCapture: true, x: x + 1, y: y - 1});
		}
	}
	// Black
	else {
		// Every move requires at least one free cell below
		if (y == 7) {
			return m;
		}
		// Push
		if (b[y + 1][x] == "") {
			m.push({isCapture: false, x: x, y: y + 1});
		}
		// Double push
		if (y == 1 && b[y + 1][x] == "" && b[y + 2][x] == "") {
			m.push({isCapture: false, x: x, y: y + 2});
		}
		// Left (black perspective)
		if (x != 7 && b[y + 1][x + 1].charAt(0) == "w") {
			m.push({isCapture: true, x: x + 1, y: y + 1});
		}
		// Right (black perspective)
		if (x != 0 && b[y + 1][x - 1].charAt(0) == "w") {
			m.push({isCapture: true, x: x - 1, y: y + 1});
		}
	}
	return m;
}

function getKnightMoves(colour, x, y, b = board) {
	let m = [];
	let opponent = getOpponent(colour);
	// Top-left and top-right
	if (y > 1) {
		// Top-left
		if (x != 0) {
			// Move
			if (b[y - 2][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y - 2});
			}
			// Capture
			else if (b[y - 2][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y - 2});
			}
		}
		// Top-right
		if (x != 7) {
			// Move
			if (b[y - 2][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y - 2});
			}
			// Capture
			else if (b[y - 2][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y - 2});
			}
		}
	}
	// Upper-right and lower-right
	if (x < 6) {
		// Upper-right
		if (y != 0) {
			// Move
			if (b[y - 1][x + 2] == "") {
				m.push({isCapture: false, x: x + 2, y: y - 1});
			}
			// Capture
			else if (b[y - 1][x + 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 2, y: y - 1});
			}
		}
		// Lower-right
		if (y != 7) {
			// Move
			if (b[y + 1][x + 2] == "") {
				m.push({isCapture: false, x: x + 2, y: y + 1});
			}
			// Capture
			else if (b[y + 1][x + 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 2, y: y + 1});
			}
		}
	}
	// Bottom-left and bottom-right
	if (y < 6) {
		// Bottom-left
		if (x != 0) {
			// Move
			if (b[y + 2][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y + 2});
			}
			// Capture
			else if (b[y + 2][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y + 2});
			}
		}
		// Bottom-right
		if (x != 7) {
			// Move
			if (b[y + 2][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y + 2});
			}
			// Capture
			else if (b[y + 2][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y + 2});
			}
		}
	}
	// Upper-left and lower-left
	if (x > 1) {
		// Upper-left
		if (y != 0) {
			// Move
			if (b[y - 1][x - 2] == "") {
				m.push({isCapture: false, x: x - 2, y: y - 1});
			}
			// Capture
			else if (b[y - 1][x - 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 2, y: y - 1});
			}
		}
		// Lower-left
		if (y != 7) {
			// Move
			if (b[y + 1][x - 2] == "") {
				m.push({isCapture: false, x: x - 2, y: y + 1});
			}
			// Capture
			else if (b[y + 1][x - 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 2, y: y + 1});
			}
		}
	}
	return m;
}

function getBishopMoves(colour, x, y, b = board) {
	let m = [];
	let opponent = getOpponent(colour);
	// North-east
	for (let i = 1; i < 8; i ++) {
		if (x + i < 8 && y - i > -1) {
			// Move
			if (b[y - i][x + i] == "") {
				m.push({isCapture: false, x: x + i, y: y - i});
			}
			// Capture
			else if (b[y - i][x + i].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + i, y: y - i});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	// South-east
	for (let i = 1; i < 8; i ++) {
		if (x + i < 8 && y + i < 8) {
			// Move
			if (b[y + i][x + i] == "") {
				m.push({isCapture: false, x: x + i, y: y + i});
			}
			// Capture
			else if (b[y + i][x + i].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + i, y: y + i});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	// South-west
	for (let i = 1; i < 8; i ++) {
		if (x - i > -1 && y + i < 8) {
			// Move
			if (b[y + i][x - i] == "") {
				m.push({isCapture: false, x: x - i, y: y + i});
			}
			// Capture
			else if (b[y + i][x - i].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - i, y: y + i});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	// North-west
	for (let i = 1; i < 8; i ++) {
		if (x - i > -1 && y - i > -1) {
			// Move
			if (b[y - i][x - i] == "") {
				m.push({isCapture: false, x: x - i, y: y - i});
			}
			// Capture
			else if (b[y - i][x - i].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - i, y: y - i});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	return m;
}

function getRookMoves(colour, x, y, b = board) {
	let m = [];
	let opponent = getOpponent(colour);
	// North
	for (let i = 1; i < 8; i++) {
		if (y - i > -1) {
			// Move
			if (b[y - i][x] == "") {
				m.push({isCapture: false, x: x, y: y - i});
			}
			// Capture
			else if (b[y - i][x].charAt(0) == opponent) {
				m.push({isCapture: true, x: x, y: y - i});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	// East
	for (let i = 1; i < 8; i++) {
		if (x + i < 8) {
			// Move
			if (b[y][x + i] == "") {
				m.push({isCapture: false, x: x + i, y: y});
			}
			// Capture
			else if (b[y][x + i].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + i, y: y});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	// South
	for (let i = 1; i < 8; i++) {
		if (y + i < 8) {
			// Move
			if (b[y + i][x] == "") {
				m.push({isCapture: false, x: x, y: y + i});
			}
			// Capture
			else if (b[y + i][x].charAt(0) == opponent) {
				m.push({isCapture: true, x: x, y: y + i});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	// West
	for (let i = 1; i < 8; i++) {
		if (x - i > -1) {
			// Move
			if (b[y][x - i] == "") {
				m.push({isCapture: false, x: x - i, y: y});
			}
			// Capture
			else if (b[y][x - i].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - i, y: y});
				break;
			}
			else {
				break;
			}
		}
		else {
			break;
		}
	}
	return m;
}

function getKingMoves(colour, x, y, b = board) {
	let m = [];
	let opponent = getOpponent(colour);
	// North-west, north and north-east
	if (y != 0) {
		// North-west
		if (x != 0) {
			// Move
			if (b[y - 1][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y - 1});
			}
			// Capture
			else if (b[y - 1][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y - 1});
			}
		}
		// North, Move
		if (b[y - 1][x] == "") {
			m.push({isCapture: false, x: x, y: y - 1});
		}
		// North, Capture
		else if (b[y - 1][x].charAt(0) == opponent) {
			m.push({isCapture: true, x: x, y: y - 1});
		}
		// North-east
		if (x != 7) {
			// Move
			if (b[y - 1][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y - 1});
			}
			// Capture
			else if (b[y - 1][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y - 1});
			}
		}
	}
	// East
	if (x != 7) {
		// Move
		if (b[y][x + 1] == "") {
			m.push({isCapture: false, x: x + 1, y: y});
		}
		// Capture
		else if (b[y][x + 1].charAt(0) == opponent) {
			m.push({isCapture: true, x: x + 1, y: y});
		}
	}
	// South-east, south and south-west
	if (y != 7) {
		// South-east
		if (x != 7) {
			// Move
			if (b[y + 1][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y + 1});
			}
			// Capture
			else if (b[y + 1][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y + 1});
			}
		}
		// South, Move
		if (b[y + 1][x] == "") {
			m.push({isCapture: false, x: x, y: y + 1});
		}
		// South, Capture
		else if (b[y + 1][x].charAt(0) == opponent) {
			m.push({isCapture: true, x: x, y: y + 1});
		}
		// South-west
		if (x != 0) {
			// Move
			if (b[y + 1][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y + 1});
			}
			// Capture
			else if (b[y + 1][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y + 1});
			}
		}
	}
	// West
	if (x != 0) {
		// Move
		if (b[y][x - 1] == "") {
			m.push({isCapture: false, x: x - 1, y: y});
		}
		// Capture
		else if (b[y][x - 1].charAt(0) == opponent) {
			m.push({isCapture: true, x: x - 1, y: y});
		}
	}
	return m;
}

function drawBoard() {
	// Clear board
	BOARD.innerHTML = "";
	// Update banner
	if (activeColour == "w") {
		ACTIVE_COLOUR.innerHTML = "Waiting for white";
	}
	else {
		ACTIVE_COLOUR.innerHTML = "Waiting for black";
	}
	MOVE_COUNT.innerHTML = moveCount;
	// Update FEN
	FEN_INPUT.value = getFen();
	// Draw selected
	if (selectedPos.x != -1) {
		let s = document.createElement("div");
		s.className = "selected " + " x" + selectedPos.x + " y" + selectedPos.y;
		BOARD.appendChild(s)
	}
	// Draw last move
	if (lastMovePos.x != -1 && (lastMovePos.x != selectedPos.x || lastMovePos.y != selectedPos.y)) {
		let lm = document.createElement("div");
		lm.className = "last-move " + " x" + lastMovePos.x + " y" + lastMovePos.y;
		BOARD.appendChild(lm);
	}
	// Draw last move destination
	if (lastMoveDestPos.x != -1 && (lastMoveDestPos.x != selectedPos.x || lastMoveDestPos.y != selectedPos.y)) {
		let lmd = document.createElement("div");
		lmd.className = "last-move " + " x" + lastMoveDestPos.x + " y" + lastMoveDestPos.y;
		BOARD.appendChild(lmd);
	}
	// Draw check
	if (checkPos.x != -1) {
		let c = document.createElement("div");
		c.className = "check " + " x" + checkPos.x + " y" + checkPos.y;
		BOARD.appendChild(c)
	}
	// Draw pieces
	let y = 0;
	for (row of board) {
		let x = 0;
		for (piece of row) {
			if (piece != "") {
				let p = document.createElement("div");
				p.className = "piece " + piece + " x" + x + " y" + y;
				p.onclick = function() {pieceClicked(this);};
				BOARD.appendChild(p);
			}
			x += 1;
		}
		y += 1;
	}
	// Draw moves
	for (move of moves) {
		let m = document.createElement("div");
		if (move.isCapture) {
			m.className = "capture " + " x" + move.x + " y" + move.y;
			m.onclick = function() {captureClicked(this);};
		}
		else {
			m.className = "move " + " x" + move.x + " y" + move.y;
			m.onclick = function() {moveClicked(this);};
		}
		BOARD.appendChild(m)
	}
}