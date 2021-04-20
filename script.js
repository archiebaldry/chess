const FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const BOARD = document.getElementById("board");
const FEN_INPUT = document.getElementById("fen");

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
var capturesPos = [{x: 7, y: 1}, {x: 4, y: 2}];
var movesPos = [{x: 6, y: 2}, {x: 4, y: 4}, {x: 6, y: 4}, {x: 3, y: 5}, {x: 7, y: 5}];

FEN_INPUT.value = FEN;
drawBoard();

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
	if (lastMoveDestPos.x != -1 && (lastMoveDestPos.x != lastMovePos.x || lastMoveDestPos.y != lastMovePos.y)) {
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
				BOARD.appendChild(p);
			}
			x += 1;
		}
		y += 1;
	}
	// Draw captures
	for (capturePos of capturesPos) {
		let c = document.createElement("div");
		c.className = "capture " + " x" + capturePos.x + " y" + capturePos.y;
		BOARD.appendChild(c)
	}
	// Draw moves
	for (movePos of movesPos) {
		let m = document.createElement("div");
		m.className = "move " + " x" + movePos.x + " y" + movePos.y;
		BOARD.appendChild(m)
	}
}