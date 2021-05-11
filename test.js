const BOARD = document.getElementById("board");
const CONTAINER = document.getElementById("container");
const PLAYER_BOTTOM = document.getElementById("player-bottom");
const PLAYER_TOP = document.getElementById("player-top");

window.addEventListener("resize", scaleElements);

scaleElements();

function scaleElements() {
    let cW = window.innerWidth - 64;
    let cH;
    let bWH;
    let pW;

    if (window.innerHeight < window.innerWidth) {
        cH = window.innerHeight - 16;
        bWH = (cH - 16) * 0.9;
        pW = bWH;
    } else {
        cH = (cW + 14.4) / 0.9;
        bWH = cW;
        pW = cW;
    }

    CONTAINER.setAttribute("style", "width:" + cW + "px;height:" + cH + "px");
    CONTAINER.style.width = cW;
    CONTAINER.style.height = cH;

    PLAYER_TOP.setAttribute("style", "width:" + pW + "px");
    PLAYER_TOP.style.width = pW;

    BOARD.setAttribute("style", "width:" + bWH + "px;height:" + bWH + "px");
    BOARD.style.width = bWH;
    BOARD.style.height = bWH;

    PLAYER_BOTTOM.setAttribute("style", "width:" + pW + "px");
    PLAYER_BOTTOM.style.width = pW;
}