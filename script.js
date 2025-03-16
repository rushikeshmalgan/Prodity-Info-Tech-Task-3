// Selecting elements
const modeSelectionScreen = document.getElementById("mode-selection");
const gameScreen = document.getElementById("game-container");
const board = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const statusText = document.getElementById("status");
const multiplayerBtn = document.getElementById("multiplayer-btn");
const aiBtn = document.getElementById("ai-btn");

// Game variables
let gameState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = false;
let isMultiplayer = false;

// Winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

// Handle mode selection
multiplayerBtn.addEventListener("click", () => startGame(true));
aiBtn.addEventListener("click", () => startGame(false));

function startGame(multiplayer) {
    isMultiplayer = multiplayer;
    modeSelectionScreen.style.display = "none";  // Hide selection screen
    gameScreen.style.display = "block";         // Show game screen
    resetGame();
}

// Handle cell click
function handleCellClick(index) {
    if (gameState[index] !== "" || !isGameActive) return;

    // Player move
    gameState[index] = currentPlayer;
    board[index].textContent = currentPlayer;

    // Check for winner
    if (checkWinner()) return;

    // Switch turn
    if (isMultiplayer) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    } else {
        // AI Move (if single-player mode)
        setTimeout(aiMove, 500);
    }
}

// Function to check winner
function checkWinner() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            isGameActive = false;
            statusText.textContent = `Player ${currentPlayer} Wins!`;
            highlightWinner(combo);
            return true;
        }
    }

    // Check draw
    if (!gameState.includes("")) {
        statusText.textContent = "It's a Draw!";
        isGameActive = false;
        return true;
    }

    return false;
}

// Highlight winning cells
function highlightWinner(combo) {
    combo.forEach(index => {
        board[index].classList.add("win");
    });
}

// **AI Move using Minimax**
function aiMove() {
    if (!isGameActive) return;

    let bestScore = -Infinity;
    let bestMove;
    
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O";  // AI tries this move
            let score = minimax(gameState, 0, false);
            gameState[i] = "";  // Undo move

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    gameState[bestMove] = "O";
    board[bestMove].textContent = "O";
    checkWinner();
}

// **Minimax Algorithm for unbeatable AI**
function minimax(state, depth, isMaximizing) {
    let result = checkWinnerForAI();
    if (result !== null) return result;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === "") {
                state[i] = "O";
                let score = minimax(state, depth + 1, false);
                state[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === "") {
                state[i] = "X";
                let score = minimax(state, depth + 1, true);
                state[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// AI Winner Checker
function checkWinnerForAI() {
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a] === "O" ? 1 : -1;
        }
    }
    if (!gameState.includes("")) return 0;
    return null;
}

// Reset game
function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    currentPlayer = "X";
    board.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
    });
    statusText.textContent = "Tic-Tac-Toe";
}

// Event Listeners
board.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index));
});

resetButton.addEventListener("click", resetGame);
