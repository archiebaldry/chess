const BOARD = document.getElementById("board");
const MOVES = document.getElementById("moves");
const PIECES = document.getElementById("pieces");
const SPECIAL = document.getElementById("special");

const ACTIVE_COLOUR = document.getElementById("active-colour");
const FEN_INPUT = document.getElementById("fen");
const MOVE_COUNT = document.getElementById("move-count");

// Reference game: https://lichess.org/vg8ou0o1#41
// 2R1k2r/2n3pp/3bpp2/B6q/2PP1P2/6P1/1Q5P/1N2KBNR b Kk - 0 21
const chess = new Chess();

var lastSquare;
var lastToSquare;
var selectedSquare;

draw();

function draw() {
    // Update active colour, FEN and move count
	if (chess.turn() == "w") {
		ACTIVE_COLOUR.innerHTML = "White's move";
	} else {
		ACTIVE_COLOUR.innerHTML = "Black's move";
	}
    FEN_INPUT.value = chess.fen();
	MOVE_COUNT.innerHTML = chess.move_number();
	// Clear moves, pieces (including selected indicator) and special
	MOVES.innerHTML = "";
	PIECES.innerHTML = "";
    SPECIAL.innerHTML = "";
    // Draw last square and last to square
    if (lastSquare != null) {
        let l = document.createElement("div");
        l.className = "last " + lastSquare;
        SPECIAL.appendChild(l);
    }
    if (lastToSquare != null) {
        let lt = document.createElement("div");
        lt.className = "last " + lastToSquare;
        SPECIAL.appendChild(lt);
    }
    // Unset last square, last to square and selected square
    lastSquare = null;
    lastToSquare = null;
	selectedSquare = null;
	// Draw pieces
	let y = 0;
	for (row of chess.board()) {
		let x = 0;
		for (piece of row) {
			if (piece != null) {
				let p = document.createElement("div");
                let square = toSquare(x, y);
				p.className = piece.color + piece.type + " " + square;
                if (piece.color == chess.turn()) {
                    p.onclick = function() {pieceClicked(this);};
                    p.className += " active";
                    if (piece.type == "k" && chess.in_check()) {
                        // Draw check
                        let c = document.createElement("div");
                        c.className = "check " + square;
                        SPECIAL.appendChild(c);
                    }
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
    let m;
	if (classes.length == 2) {
		m = chess.move(classes.item(1));
	} else {
		m = chess.move(classes.item(2));
	}
    lastSquare = m.from;
    lastToSquare = m.to;
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