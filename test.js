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

function toX(square) {
    switch (square.charAt(0)) {
        case "a": return 0;
        case "b": return 1;
        case "c": return 2;
        case "d": return 3;
        case "e": return 4;
        case "f": return 5;
        case "g": return 6;
        case "h": return 7;
        default: return null;
    }
}

function toY(square) {
    switch (square.charAt(1)) {
        case "8": return 0;
        case "7": return 1;
        case "6": return 2;
        case "5": return 3;
        case "4": return 4;
        case "3": return 5;
        case "2": return 6;
        case "1": return 7;
        default: return null;
    }
}

const MOVES = document.getElementById("moves");
const PIECES = document.getElementById("pieces");

const ACTIVE_COLOUR = document.getElementById("active-colour");
const FEN_INPUT = document.getElementById("fen");
const MOVE_COUNT = document.getElementById("move-count");

const chess = new Chess();

var activeColour = "w";
var selectedSquare;

draw();

function draw() {
	// Clear pieces
	PIECES.innerHTML = "";
    // Update active colour, move count and FEN
    let records = chess.fen().split(" ");
    activeColour = records[1];
	if (activeColour == "w") {
		ACTIVE_COLOUR.innerHTML = "Waiting for white";
	}
	else {
		ACTIVE_COLOUR.innerHTML = "Waiting for black";
	}
	MOVE_COUNT.innerHTML = records[5];
	FEN_INPUT.value = chess.fen();
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
                    p.className += " clickable";
                }
				PIECES.appendChild(p);
			}
			x += 1;
		}
		y += 1;
	}
}

function pieceClicked(piece) {
    // Clear moves
	MOVES.innerHTML = "";
    // Draw moves (unless deselect)
    let square = piece.classList.item(1);
    if (square == selectedSquare) {
        selectedSquare = null;
    } else {
        selectedSquare = square;
        let moves = chess.moves({square: square, verbose: true});
        console.log(square, moves);
        for (move of moves) {
            // What is SAN? Should it replace move.to?
            let m = document.createElement("div");
            if (move.flags.includes("c")) {
                m.className = "capture " + move.to;
                m.onclick = function() {captureClicked(this);};
            }
            else {
                m.className = "move " + move.to;
                m.onclick = function() {moveClicked(this);};
            }
            MOVES.appendChild(m)
        }
    }
}

// while (!chess.game_over()) {
//     const moves = chess.moves()
//     const move = moves[Math.floor(Math.random() * moves.length)]
//     chess.move(move)
// }