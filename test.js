const MOVES = document.getElementById("moves");
const PIECES = document.getElementById("pieces");

const ACTIVE_COLOUR = document.getElementById("active-colour");
const FEN_INPUT = document.getElementById("fen");
const MOVE_COUNT = document.getElementById("move-count");
const PGN_INPUT = document.getElementById("pgn");

const chess = new Chess(
"1Rb1k2r/2n3pp/3bpp2/B6q/2PP1P2/6P1/1Q5P/1N2KBNR w Kk - 0 21");

var activeColour = "w";
var selectedSquare;

draw();

function draw() {
	// Clear moves, pieces and selected indicator
	MOVES.innerHTML = "";
	PIECES.innerHTML = "";
	// Unset selected square
	selectedSquare = null;
    // Update active colour, move count, FEN and PGN
    let records = chess.fen().split(" ");
    activeColour = records[1];
	if (activeColour == "w") {
		ACTIVE_COLOUR.innerHTML = "White's move";
	} else {
		ACTIVE_COLOUR.innerHTML = "Black's move";
	}
	MOVE_COUNT.innerHTML = records[5];
	FEN_INPUT.value = chess.fen();
	PGN_INPUT.value = chess.pgn({newline_char: "/n"});
	// Draw pieces
	let y = 0;
	for (row of chess.board()) {
		let x = 0;
		for (piece of row) {
			if (piece != null) {
				let p = document.createElement("div");
				p.className = piece.color + piece.type + " " + toSquare(x, y);
                if (piece.color == activeColour) {
                    p.onclick = function() {pieceClicked(this);};
                    p.className += " active";
                }
				PIECES.appendChild(p);
			}
			x += 1;
		}
		y += 1;
	}
}

function moveClicked(move) {
	let classes = move.classList;
	if (classes.length == 2) {
		chess.move(classes.item(1));
	} else {
		chess.move(classes.item(2));
	}
	draw();
}

function pieceClicked(piece) {
    // Clear moves
	MOVES.innerHTML = "";
	// Clear selected indicator
	let selected = document.getElementById("selected");
	if (PIECES.contains(selected)) {
		selected.remove();
	}
    let square = piece.classList.item(1);
    if (square == selectedSquare) {
		// Unset selected square
        selectedSquare = null;
    } else {
		// Draw selected indicator
		let s = document.createElement("div");
		s.className = square;
		s.id = "selected";
		PIECES.insertBefore(s, PIECES.firstChild);
		// Set selected square
        selectedSquare = square;
		// Draw moves
        let moves = chess.moves({square: square, verbose: true});
		for (move of moves) {
            let m = document.createElement("div");
			let cname = move.flags + " " + move.to;
			if (move.san != move.to) {
				cname += " " + move.san;
			}
			m.className = cname;
			m.onclick = function() {moveClicked(this);};
            MOVES.appendChild(m);
        }
    }
}

function toSquare(x, y) {
    let file;
    switch (x) {
        case 0: file = "a"; break;
        case 1: file = "b"; break;
        case 2: file = "c"; break;
        case 3: file = "d"; break;
        case 4: file = "e"; break;
        case 5: file = "f"; break;
        case 6: file = "g"; break;
        case 7: file = "h"; break;
        default: return null;
    }
    let rank;
    switch (y) {
        case 0: rank = "8"; break;
        case 1: rank = "7"; break;
        case 2: rank = "6"; break;
        case 3: rank = "5"; break;
        case 4: rank = "4"; break;
        case 5: rank = "3"; break;
        case 6: rank = "2"; break;
        case 7: rank = "1"; break;
        default: return null;
    }
    return file + rank;
}

function tryFen(fen) {
	if (chess.load(fen)) {
		draw();
	}
}

// while (!chess.game_over()) {
//     const moves = chess.moves()
//     const move = moves[Math.floor(Math.random() * moves.length)]
//     chess.move(move)
// }