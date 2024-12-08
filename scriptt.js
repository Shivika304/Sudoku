let numSelected = null;
let tileSelected = null;
let errors = 0;

const puzzles = [
    {
        board: [
            "--74916-5",
            "2---6-3-9",
            "-----7-1-",
            "-586----4",
            "--3----9-",
            "--62--187",
            "9-4-7---2",
            "67-83----",
            "81--45---"
        ],
        solution: [
            "387491625",
            "241568379",
            "569327418",
            "758619234",
            "123784596",
            "496253187",
            "934176852",
            "675832941",
            "812945763"
        ]
    },
    {
        board: [
            "53--7----",
            "6--195---",
            "-98----6-",
            "8---6---3",
            "4--8-3--1",
            "7---2---6",
            "-6----28-",
            "---419--5",
            "----8--79"
        ],
        solution: [
            "534678912",
            "672195348",
            "198342567",
            "859761423",
            "426853791",
            "713924856",
            "961537284",
            "287419635",
            "345286179"
        ]
        
    },
];

let currentPuzzle = {};

window.onload = function () {
    generateNewPuzzle();
};

function generateNewPuzzle() {
    // Reset errors
    errors = 0;
    document.getElementById("errors").innerText = `Errors: ${errors}`;

    // Select a random puzzle
    currentPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    // Render the grid
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById("sudoku-grid");
    const digits = document.getElementById("digits");

    // Clear the grid and digits
    grid.innerHTML = "";
    digits.innerHTML = "";

    // Create the digits 1-9
    for (let i = 1; i <= 9; i++) {
        const number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        digits.appendChild(number);
    }

    // Create the Sudoku grid
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;

            // Only make the empty cells (denoted by "-") editable
            if (currentPuzzle.board[r][c] !== "-") {
                tile.innerText = currentPuzzle.board[r][c]; // Fixed value
                tile.classList.add("tile-start");
            } else {
                tile.classList.add("tile-editable"); // Editable tile
            }

            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            grid.appendChild(tile);
        }
    }

    // Attach event listeners for buttons
    document.getElementById("validate-btn").addEventListener("click", validateBoard);
    document.getElementById("reset-btn").addEventListener("click", resetGame);
}

function selectNumber() {
    if (numSelected) numSelected.classList.remove("number-selected");
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (!numSelected) return;
    if (this.classList.contains("tile-start")) return; // Don't allow editing of starting tiles

    const [r, c] = this.id.split("-").map(Number);
    const selectedNum = numSelected.id;

    // Set the tile's value
    this.innerText = selectedNum;

    // If the number is correct, mark it as correct (light green), otherwise mark as wrong (red)
    if (isValidPlacement(r, c, selectedNum)) {
        this.classList.remove("tile-wrong");
        this.classList.add("tile-correct");
    } else {
        this.classList.add("tile-wrong");
        errors++;
    }

    document.getElementById("errors").innerText = `Errors: ${errors}`;
}

function isValidPlacement(row, col, num) {
    num = parseInt(num);

    // Check if number already exists in the row, column, or sub-grid
    for (let i = 0; i < 9; i++) {
        if (document.getElementById(`${row}-${i}`).innerText == num && i != col) return false;
        if (document.getElementById(`${i}-${col}`).innerText == num && i != row) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const tile = document.getElementById(`${startRow + i}-${startCol + j}`);
            if (tile.innerText == num && (startRow + i != row || startCol + j != col)) return false;
        }
    }

    return true;
}

function validateBoard() {
    let correct = true;

    // Check if the board is correct
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.getElementById(`${r}-${c}`);
            if (tile.innerText != currentPuzzle.solution[r][c]) {
                correct = false;
                tile.classList.add("tile-wrong");
            }
        }
    }

    if (correct) {
        alert(`Congratulations! You completed the Sudoku with ${errors} errors.`);
        generateNewPuzzle();
    } else {
        alert("The Sudoku is incorrect. Please try again.");
    }
}

function resetGame() {
    errors = 0;
    document.getElementById("errors").innerText = "Errors: 0";
    renderGrid();
}
