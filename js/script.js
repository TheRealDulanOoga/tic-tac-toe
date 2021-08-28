const TILE_STATUSES = {
    X: 'x',
    O: 'o',
    UNMARKED: 'unmarked'
}
const BOARD = [];
const BOARD_ELEMENT = document.querySelector('.board');
var activePlayer = 'X'

for (let x = 0; x < 3; x++) {
    const row = [];
    for (let y = 0; y < 3; y++) {
        const element = document.createElement('div');
        element.dataset.status = TILE_STATUSES.UNMARKED;
        const tile = {
            element,
            x,
            y,
            get status() {
                return element.dataset.status;
            },
            set status(newStatus) {
                this.element.dataset.status = newStatus;
            }
        }
        element.className = "column-" + (x + 1) + ", row-" + (y + 1);
        row.push(tile);
    }
    BOARD.push(row);
}

BOARD.forEach(row => {
    row.forEach(tile => {
        BOARD_ELEMENT.append(tile.element);
        tile.element.addEventListener('click', () => {
            markTile(tile);
            checkWin(tile);
        });
    });
});

function markTile(tile) {
    if (tile.status === TILE_STATUSES.X || tile.status === TILE_STATUSES.O) {
        return
    }

    if (activePlayer === 'X') {
        tile.status = TILE_STATUSES.X;
        tile.element.innerHTML = 'X';
        activePlayer = 'O';
    }
    else {
        tile.status = TILE_STATUSES.O;
        tile.element.innerHTML = 'O';
        activePlayer = 'X';
    };
};

function checkDiaganol(tile) {
    const x = tile.x;
    const y = tile.y;
    const tilePos = x + ', ' + y;
    const noDiagPos = ['1, 0', '0, 1', '2, 1', '1, 2'];
    const notInTRBL = ['0, 0', '2, 2']; //top right to bottom left diaganol
    const notInTLBR = ['2, 0', '0, 2']; //top left to bottom riht diaganol
    var result = ""

    if (noDiagPos.indexOf(tilePos) == -1) {
        if (notInTLBR.indexOf(tilePos) == -1) {
            result = result + "TLBR;"
        };
        if (notInTRBL.indexOf(tilePos) == -1) {
            result = result + "TRBL;"
        };
    };

    return result
}

function checkWin(tileInput) {
    const X = tileInput.x;
    const Y = tileInput.y;
    const STATUS = tileInput.status;
    var upDownCount = 0;
    var leftRightCount = 0;
    var diaganolTLBRCount = 0;
    var diaganolTRBLCount = 0;
    var activeTilesCount = 0;

    BOARD.forEach(row => {
        row.forEach(tile => {
            if (tile.x === X && tile.status === STATUS) {
                leftRightCount += 1;
            };

            if (tile.y === Y && tile.status === STATUS) {
                upDownCount += 1;
            };

            if (tile.x === tile.y && tile.status === STATUS) {
                diaganolTLBRCount += 1;
            };

            if (((tile.x === 2 && tile.y === 0) || (tile.x === 1 && tile.y === 1) || (tile.x === 0 && tile.y === 2)) && tile.status === STATUS) {
                diaganolTRBLCount += 1;
            };

            if (tile.status === "x" || tile.status === "o") {
                activeTilesCount += 1;
            };
        });
    });

    switch(3) {
        case leftRightCount:
            gameEnd("LR", STATUS);
            break;
        case upDownCount:
            gameEnd("UD", STATUS);
            break;
        case diaganolTLBRCount:
            gameEnd("TLBR", STATUS);
            break;
        case diaganolTRBLCount:
            gameEnd("TRBL", STATUS);
            break;
        default:
            break;
    };

    if (activeTilesCount >= 8) {
        gameEnd("none", "draw!");
        console.log("hi")
    };
};

function gameEnd(condition, player) {
    const gameOverDisplay = document.getElementById('game-over-nav');
    var gameOverText = player;
    if (player !== "draw!") {
        gameOverText += " wins!"
    }
    console.log("Player: " + player + ", " + condition);

    gameOverDisplay.style.zIndex = "1";
    gameOverDisplay.style.backgroundColor = "rgba(0,0,0,0.5)";
    gameOverDisplay.style.color = "rgba(203, 255, 231, 1)";
    document.querySelector('.game-over-text').innerHTML = gameOverText;

    document.querySelector('.overlay').addEventListener('click', () => {
        gameOverDisplay.style.transitionDuration = "0.25s";
        gameOverDisplay.style.zIndex = "-1";
        gameOverDisplay.style.backgroundColor = "rgba(0,0,0,0)";
        gameOverDisplay.style.color = "rgba(0,0,0,0)";
    });

    BOARD_ELEMENT.addEventListener('click', stopProp, { capture: true });
};

function stopProp(e) {
    e.stopImmediatePropagation();
};