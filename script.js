const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const BOARD = document.getElementById("board");
const FEN_INPUT = document.getElementById("fen");

var activeColour = "w";
var board = [
	["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
	["", "bp", "bp", "bp", "", "bp", "bp", "bp"],
	["", "", "wp", "wp", "bp", "", "", ""],
	["bp", "", "", "", "", "", "wq", ""],
	["", "wk", "wn", "", "wr", "wb", "", ""],
	["", "", "bp", "", "", "", "", ""],
	["wp", "wp", "wp", "", "wp", "wp", "wp", ""],
	["wr", "wn", "wb", "wq", "wk", "", "wn", "wr"]
];
var selectedPos = {x: -1, y: -1};
var lastMovePos = {x: 3, y: 7};
var lastMoveDestPos = {x: 5, y: 6};
var checkPos = {x: 4, y: 7};
var moves = [];

FEN_INPUT.value = FEN;
drawBoard();

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
			let type = classes.item(1).charAt(1);
			selectedPos = {x: x, y: y};
			moves = getPseudoMoves(type, colour, x, y);
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

function getPawnMoves(colour, x, y) {
	let m = [];
	// White
	if (colour == "w") {
		// Every move requires at least one free cell above
		if (y == 0) {
			return m;
		}
		// Push
		if (board[y - 1][x] == "") {
			m.push({isCapture: false, x: x, y: y - 1});
		}
		// Double push
		if (y == 6 && board[y - 1][x] == "" && board[y - 2][x] == "") {
			m.push({isCapture: false, x: x, y: y - 2});
		}
		// Left
		if (x != 0 && board[y - 1][x - 1].charAt(0) == "b") {
			m.push({isCapture: true, x: x - 1, y: y - 1});
		}
		// Right
		if (x != 7 && board[y - 1][x + 1].charAt(0) == "b") {
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
		if (board[y + 1][x] == "") {
			m.push({isCapture: false, x: x, y: y + 1});
		}
		// Double push
		if (y == 1 && board[y + 1][x] == "" && board[y + 2][x] == "") {
			m.push({isCapture: false, x: x, y: y + 2});
		}
		// Left (black perspective)
		if (x != 7 && board[y + 1][x + 1].charAt(0) == "w") {
			m.push({isCapture: true, x: x + 1, y: y + 1});
		}
		// Right (black perspective)
		if (x != 0 && board[y + 1][x - 1].charAt(0) == "w") {
			m.push({isCapture: true, x: x - 1, y: y + 1});
		}
	}
	return m;
}

function getKnightMoves(opponent, x, y) {
	let m = [];
	// Top-left and top-right
	if (y > 1) {
		// Top-left
		if (x != 0) {
			// Move
			if (board[y - 2][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y - 2});
			}
			// Capture
			else if (board[y - 2][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y - 2});
			}
		}
		// Top-right
		if (x != 7) {
			// Move
			if (board[y - 2][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y - 2});
			}
			// Capture
			else if (board[y - 2][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y - 2});
			}
		}
	}
	// Upper-right and lower-right
	if (x < 6) {
		// Upper-right
		if (y != 0) {
			// Move
			if (board[y - 1][x + 2] == "") {
				m.push({isCapture: false, x: x + 2, y: y - 1});
			}
			// Capture
			else if (board[y - 1][x + 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 2, y: y - 1});
			}
		}
		// Lower-right
		if (y != 7) {
			// Move
			if (board[y + 1][x + 2] == "") {
				m.push({isCapture: false, x: x + 2, y: y + 1});
			}
			// Capture
			else if (board[y + 1][x + 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 2, y: y + 1});
			}
		}
	}
	// Bottom-left and bottom-right
	if (y < 6) {
		// Bottom-left
		if (x != 0) {
			// Move
			if (board[y + 2][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y + 2});
			}
			// Capture
			else if (board[y + 2][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y + 2});
			}
		}
		// Bottom-right
		if (x != 7) {
			// Move
			if (board[y + 2][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y + 2});
			}
			// Capture
			else if (board[y + 2][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y + 2});
			}
		}
	}
	// Upper-left and lower-left
	if (x > 1) {
		// Upper-left
		if (y != 0) {
			// Move
			if (board[y - 1][x - 2] == "") {
				m.push({isCapture: false, x: x - 2, y: y - 1});
			}
			// Capture
			else if (board[y - 1][x - 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 2, y: y - 1});
			}
		}
		// Lower-left
		if (y != 7) {
			// Move
			if (board[y + 1][x - 2] == "") {
				m.push({isCapture: false, x: x - 2, y: y + 1});
			}
			// Capture
			else if (board[y + 1][x - 2].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 2, y: y + 1});
			}
		}
	}
	return m;
}

function getBishopMoves(opponent, x, y) {
	let m = [];
	// North-east
	for (let i = 1; i < 8; i ++) {
		if (x + i < 8 && y - i > -1) {
			// Move
			if (board[y - i][x + i] == "") {
				m.push({isCapture: false, x: x + i, y: y - i});
			}
			// Capture
			else if (board[y - i][x + i].charAt(0) == opponent) {
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
			if (board[y + i][x + i] == "") {
				m.push({isCapture: false, x: x + i, y: y + i});
			}
			// Capture
			else if (board[y + i][x + i].charAt(0) == opponent) {
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
			if (board[y + i][x - i] == "") {
				m.push({isCapture: false, x: x - i, y: y + i});
			}
			// Capture
			else if (board[y + i][x - i].charAt(0) == opponent) {
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
			if (board[y - i][x - i] == "") {
				m.push({isCapture: false, x: x - i, y: y - i});
			}
			// Capture
			else if (board[y - i][x - i].charAt(0) == opponent) {
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

function getRookMoves(opponent, x, y) {
	let m = [];
	// North
	for (let i = 1; i < 8; i++) {
		if (y - i > -1) {
			// Move
			if (board[y - i][x] == "") {
				m.push({isCapture: false, x: x, y: y - i});
			}
			// Capture
			else if (board[y - i][x].charAt(0) == opponent) {
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
			if (board[y][x + i] == "") {
				m.push({isCapture: false, x: x + i, y: y});
			}
			// Capture
			else if (board[y][x + i].charAt(0) == opponent) {
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
			if (board[y + i][x] == "") {
				m.push({isCapture: false, x: x, y: y + i});
			}
			// Capture
			else if (board[y + i][x].charAt(0) == opponent) {
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
			if (board[y][x - i] == "") {
				m.push({isCapture: false, x: x - i, y: y});
			}
			// Capture
			else if (board[y][x - i].charAt(0) == opponent) {
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

function getKingMoves(opponent, x, y) {
	let m = [];
	// North-west, north and north-east
	if (y != 0) {
		// North-west
		if (x != 0) {
			// Move
			if (board[y - 1][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y - 1});
			}
			// Capture
			else if (board[y - 1][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y - 1});
			}
		}
		// North, Move
		if (board[y - 1][x] == "") {
			m.push({isCapture: false, x: x, y: y - 1});
		}
		// North, Capture
		else if (board[y - 1][x].charAt(0) == opponent) {
			m.push({isCapture: true, x: x, y: y - 1});
		}
		// North-east
		if (x != 7) {
			// Move
			if (board[y - 1][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y - 1});
			}
			// Capture
			else if (board[y - 1][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y - 1});
			}
		}
	}
	// East
	if (x != 7) {
		// Move
		if (board[y][x + 1] == "") {
			m.push({isCapture: false, x: x + 1, y: y});
		}
		// Capture
		else if (board[y][x + 1].charAt(0) == opponent) {
			m.push({isCapture: true, x: x + 1, y: y});
		}
	}
	// South-east, south and south-west
	if (y != 7) {
		// South-east
		if (x != 7) {
			// Move
			if (board[y + 1][x + 1] == "") {
				m.push({isCapture: false, x: x + 1, y: y + 1});
			}
			// Capture
			else if (board[y + 1][x + 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x + 1, y: y + 1});
			}
		}
		// South, Move
		if (board[y + 1][x] == "") {
			m.push({isCapture: false, x: x, y: y + 1});
		}
		// South, Capture
		else if (board[y + 1][x].charAt(0) == opponent) {
			m.push({isCapture: true, x: x, y: y + 1});
		}
		// South-west
		if (x != 0) {
			// Move
			if (board[y + 1][x - 1] == "") {
				m.push({isCapture: false, x: x - 1, y: y + 1});
			}
			// Capture
			else if (board[y + 1][x - 1].charAt(0) == opponent) {
				m.push({isCapture: true, x: x - 1, y: y + 1});
			}
		}
	}
	// West
	if (x != 0) {
		// Move
		if (board[y][x - 1] == "") {
			m.push({isCapture: false, x: x - 1, y: y});
		}
		// Capture
		else if (board[y][x - 1].charAt(0) == opponent) {
			m.push({isCapture: true, x: x - 1, y: y});
		}
	}
	return m;
}

function getPseudoMoves(type, colour, x, y) {
	// TODO: Promotion, en passant
	let pseudoMoves = [];
	// Pawn
	if (type == "p") {
		pseudoMoves = getPawnMoves(colour, x, y);
	}
	else {
		let opponent = "b";
		if (activeColour == "b") {
			opponent = "w";
		}
		// Knight
		else if (type == "n") {
			pseudoMoves = getKnightMoves(opponent, x, y);
		}
		// Bishop
		else if (type == "b") {
			pseudoMoves = getBishopMoves(opponent, x, y);
		}
		// Rook
		else if (type == "r") {
			pseudoMoves = getRookMoves(opponent, x, y);
		}
		// Queen
		else if (type == "q") {
			pseudoMoves = getBishopMoves(opponent, x, y).concat(getRookMoves(opponent, x, y));
		}
		// King
		else {
			pseudoMoves = getKingMoves(opponent, x, y);
		}
	}
	return pseudoMoves;
}

function drawBoard() {
	// Clear board
	BOARD.innerHTML = "";
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