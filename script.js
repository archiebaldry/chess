const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const BOARD = document.getElementById("board");
const FEN_INPUT = document.getElementById("fen");

var activeColour = "w";
var board = [
	["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
	["bp", "bp", "bp", "bp", "", "bp", "bp", "bp"],
	["", "", "wp", "wp", "bp", "", "", ""],
	["", "", "", "", "", "wb", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "bp", "", "", "", "", ""],
	["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
	["wr", "wn", "wb", "wq", "wk", "", "wn", "wr"]
];
var selectedPos = {x: 5, y: 3};
var lastMovePos = {x: 3, y: 7};
var lastMoveDestPos = {x: 5, y: 6};
var checkPos = {x: 4, y: 7};
var movesPos = [{x: 6, y: 2}, {x: 4, y: 4}, {x: 6, y: 4}, {x: 3, y: 5}, {x: 7, y: 5}];
var capturesPos = [{x: 7, y: 1}, {x: 4, y: 2}];

FEN_INPUT.value = FEN;
drawBoard();

function pieceClicked(piece) {
	console.clear();
	console.log("Piece clicked");
	let classes = piece.classList;
	let colour = classes.item(1).charAt(0);
	if (colour == activeColour) {
		let x = parseInt(classes.item(2).charAt(1));
		let y = parseInt(classes.item(3).charAt(1));
		// Clear selection
		if (x == selectedPos.x && y == selectedPos.y) {
			selectedPos = {x: -1, y: -1};
			movesPos = [];
			capturesPos = [];
		}
		// Select piece, calculate moves
		else {
			selectedPos = {x: x, y: y};
			let type = classes.item(1).charAt(1);
			let pseudo = getPseudo(type, colour, x, y);
			movesPos = pseudo[0];
			capturesPos = pseudo[1];
		}
		drawBoard();
	}
}

function getPseudo(type, colour, x, y) {
	// TODO: Promotion, en passant
	let moves = [];
	let captures = [];
	if (type == "p") {
		if (colour == "w") {
			// Every move requires at least one free cell above
			if (y == 0) {
				return [moves, captures];
			}
			// Move: Push (up 1)
			if (board[y - 1][x] == "") {
				moves.push({x: x, y: y - 1});
			}
			// Move: Double push (up 2, if on 2nd rank)
			if (y == 6 && board[y - 1][x] == "" && board[y - 2][x] == "") {
				moves.push({x: x, y: y - 2});
			}
			// Capture: Left (up 1, left 1)
			if (x != 0 && board[y - 1][x - 1].charAt(0) == "b") {
				captures.push({x: x - 1, y: y - 1});
			}
			// Capture: Right (up 1, right 1)
			if (x != 7 && board[y - 1][x + 1].charAt(0) == "b") {
				captures.push({x: x + 1, y: y - 1});
			}
		}
		else {
			// Every move requires at least one free cell below
			if (y == 7) {
				return [moves, captures];
			}
			// Move: Push (down 1)
			if (board[y + 1][x] == "") {
				moves.push({x: x, y: y + 1});
			}
			// Move: Double push (down 2, if on 7th rank)
			if (y == 1 && board[y + 1][x] == "" && board[y + 2][x] == "") {
				moves.push({x: x, y: y + 2});
			}
			// Capture: Left (down 1, left 1)
			if (x != 0 && board[y + 1][x - 1].charAt(0) == "w") {
				captures.push({x: x - 1, y: y + 1});
			}
			// Capture: Right (down 1, right 1)
			if (x != 7 && board[y + 1][x + 1].charAt(0) == "w") {
				captures.push({x: x + 1, y: y + 1});
			}
		}
	}
	return [moves, captures];
}

function moveClicked(move) {
	console.clear();
	console.log("Move clicked");

	let classes = move.classList;
	let x = classes.item(1).charAt(1);
	let y = classes.item(2).charAt(1);
}

function captureClicked(capture) {
	console.clear();
	console.log("Capture clicked");

	let classes = capture.classList;
	let x = classes.item(1).charAt(1);
	let y = classes.item(2).charAt(1);
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
	for (movePos of movesPos) {
		let m = document.createElement("div");
		m.className = "move " + " x" + movePos.x + " y" + movePos.y;
		m.onclick = function() {moveClicked(this);};
		BOARD.appendChild(m)
	}
	// Draw captures
	for (capturePos of capturesPos) {
		let c = document.createElement("div");
		c.className = "capture " + " x" + capturePos.x + " y" + capturePos.y;
		c.onclick = function() {captureClicked(this);};
		BOARD.appendChild(c)
	}
}