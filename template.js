let board = [];
let openedSquares = [];
let flaggedSquares = [];
let bombCount = 0;
let squaresLeft = 0;
let rowCount, colCount;

class BoardSquare {
    constructor(hasBomb, bombsAround) {
        this.hasBomb = hasBomb;
        this.bombsAround = bombsAround;
    }
}

class Pair {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function minesweeperGameBootstrapper(difficulty) {
    let easy = {
        'rowCount': 9,
        'colCount': 9,
    };
    let medium = {
        'rowCount': 16,
        'colCount': 16,
    };
    let expert = {
        'rowCount': 16,
        'colCount': 30,
    };


    if (difficulty === 'Easy') {
        rowCount = 9;
        colCount = 9;
    } else if (difficulty === 'Medium') {
        rowCount = 16;
        colCount = 16;
    } else if (difficulty === 'Expert') {
        rowCount = 16;
        colCount = 30;
    } else {
        rowCount = 9;
        colCount = 9;
    }



    generateBoard({ 'rowCount': rowCount, 'colCount': colCount });
}

function generateBoard(boardMetadata) {
    squaresLeft = boardMetadata.colCount * boardMetadata.rowCount;

    for (let i = 0; i < boardMetadata.colCount; i++) {
        board[i] = new Array(boardMetadata.rowCount);
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            const hasBomb = Math.random() * maxProbability < bombProbability;
            board[i][j] = new BoardSquare(hasBomb, 0);
        }
    }

    for (let i = 0; i < boardMetadata.colCount; i++) {
        for (let j = 0; j < boardMetadata.rowCount; j++) {
            if (!board[i][j].hasBomb) {
                let bombCount = 0;
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        const newX = i + x;
                        const newY = j + y;
                        if (newX >= 0 && newX < boardMetadata.colCount && newY >= 0 && newY < boardMetadata.rowCount && board[newX][newY].hasBomb) {
                            bombCount++;
                        }
                    }
                }
                board[i][j].bombsAround = bombCount;
            }
        }
    }

    console.log(board);
}


var selectedValue;
var bombProbability;
var maxProbability;

function setupDropdownListener() {
    const dropdownMenu = document.querySelector(".dropdown-menu");

    const selectedOption = document.getElementById("selectedOption");


    dropdownMenu.addEventListener("click", function (e) {
        if (e.target && e.target.nodeName === "A") {
            selectedValue = e.target.getAttribute("data-difficulty");
            selectedOption.textContent = selectedValue;
            console.log(selectedValue)

        }
    });
}
document.addEventListener("DOMContentLoaded", setupDropdownListener);


document.addEventListener("DOMContentLoaded", function () {
    function getInputValues() {
        bombProbability = document.getElementById("exampleInputEmail1").value;
        maxProbability = document.getElementById("exampleInputPassword1").value;
        console.log("Bomb Probability: " + bombProbability);
        console.log("Max Probability: " + maxProbability);
    }
    var getValuesButton = document.getElementById("getValuesButton");
    getValuesButton.addEventListener("click", getInputValues);
});

document.addEventListener('DOMContentLoaded', function () {
    function startGame() {
        console.log("   Game started!")
        console.log("--- GAME STATS ---")

        if (bombProbability == null || maxProbability == null) {
            bombProbability = 3;
            maxProbability = 15;
        }

        console.log("Bomb Probability: " + bombProbability);
        console.log("Max Probability: " + maxProbability);

        if (selectedValue == null)
            selectedValue = "Easy"
        console.log("Game difficulty: " + selectedValue);

        console.log("------------------")

        minesweeperGameBootstrapper(selectedValue);
        printMatrix();
        buildGrid();
    }
    var start = document.getElementById("start-game");
    start.addEventListener("click", startGame);
})

function pairExists(arr, x, y) {
    return arr.some(pair => pair.x == x && pair.y == y);
}


function readFlag(){
    const xInput = document.getElementById("xParam");
    const yInput = document.getElementById("yParam");

    const getValuesButton = document.getElementById("getValuesButtonFlags");

    getValuesButton.addEventListener("click", function () {
        const xValue = xInput.value;
        const yValue = yInput.value;
        flaggedSquares.push(new Pair(xValue,yValue));
        console.log("Flag added!")
        console.log("x:", xValue);
        console.log("y:", yValue);
    });
}
document.addEventListener("DOMContentLoaded", readFlag);


function buildGrid() {
    const gridContainer = document.getElementById('minesweeper-grid');
    for (let i = 0; i < colCount; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < rowCount; j++) {
            const cell = document.createElement('td');
            cell.addEventListener('click', () => {
                const object = board[i][j];
                if (object.hasBomb == true) {
                    cell.textContent = `*`;
                }
                else {
                    if (object.bombsAround == 0)
                        cell.textContent = `+`;
                    else
                        cell.textContent = object.bombsAround;
                }
                reveal(i, j);
                updateGame(object);
                printRevealed()
            });
            row.appendChild(cell);
        }
        gridContainer.appendChild(row);
    }
}
document.addEventListener("DOMContentLoaded", buildGrid);


function updateGame(object) {
    if (object.hasBomb)
        alert("You lost!")

    if(openedSquares.length == rowCount * colCount)
        alert("You won!")

    console.log("update game")

}


function printMatrix() {
    for (let row = 0; row < board.length; row++) {
        let set = " ";
        for (let col = 0; col < board[row].length; col++) {
            const object = board[row][col];
            if (object.hasBomb == true)
                set = set + `*`;
            else {
                if (object.bombsAround == 0)
                    set = set + `+`;
                else
                    set = set + `-`;
            }
        }
        console.log(set);
        set = null;
    }
}


function printRevealed() {
    for (let row = 0; row < board.length; row++) {
        let set = " ";
        for (let col = 0; col < board[row].length; col++) {
            if (pairExists(openedSquares,row,col))
                set = set + `R`;
            else {
                set = set + `N`;
            }
        }
        console.log(set);
        set = null;
    }
}

function reveal(row, col) {
    if (row < 0 || row >= rowCount || col < 0 || col >= colCount || pairExists(openedSquares, row, col)) {
        return;
    }

    openedSquares.push(new Pair(row, col));

    const object = board[row][col];
    if ( object.bombsAround == 0) {
        const directions = [
            [-1, 0], [-1, 1], [0, 1], [1, 1],
            [1, 0], [1, -1], [0, -1], [-1, -1]
        ];

        for (const [dr, dc] of directions) {
            reveal(row + dr, col + dc);
        }
    }
}


