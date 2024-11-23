const cells = document.querySelectorAll('.cell');
const resultPopup = document.getElementById('resultPopup');
const popupRestartBtn = document.getElementById('popupRestartBtn');
const topRestartBtn = document.getElementById('topRestartBtn');
const difficultyPopup = document.getElementById('popup');
const difficultyBtns = document.querySelectorAll('.difficultyBtn');

let board = Array(9).fill(null);
let isGameActive = false;
let difficulty = 'easy'; // Default difficulty

// Show difficulty selection popup
function showDifficultyPopup() {
    difficultyPopup.classList.remove('hidden');
    isGameActive = false;
}

// Start game
function startGame() {
    board.fill(null);
    isGameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto'; // Enable clicking on cells
    });
}

// Check winner
function checkWinner() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Show result popup
function showPopup(result) {
    isGameActive = false;
    resultPopup.classList.remove('hidden');
    resultPopup.querySelector('h1').textContent = result === 'X' ? 'You Win!' : result === 'O' ? 'You Lose!' : "It's a Draw!";
}

// Easy difficulty: Random move
function easyMove() {
    const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Medium difficulty: Block player's win or random move
function mediumMove() {
    // Check if the computer can win in the next move
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            if (checkWinner() === 'O') {
                board[i] = null; // Undo move
                return i; // Winning move found
            }
            board[i] = null; // Undo move
        }
    }

    // Check if the player can win in the next move and block it
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'X';
            if (checkWinner() === 'X') {
                board[i] = null; // Undo move
                return i; // Blocking move found
            }
            board[i] = null; // Undo move
        }
    }

    // Otherwise, make a random move
    return easyMove();
}

// Hard difficulty: Minimax algorithm
function hardMove() {
    function minimax(newBoard, depth, isMaximizing) {
        const winner = checkWinner();
        if (winner === 'O') return 10 - depth; // AI wins
        if (winner === 'X') return depth - 10; // Player wins
        if (newBoard.every(cell => cell !== null)) return 0; // Draw

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (newBoard[i] === null) {
                    newBoard[i] = 'O';
                    const score = minimax(newBoard, depth + 1, false);
                    newBoard[i] = null; // Undo move
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (newBoard[i] === null) {
                    newBoard[i] = 'X';
                    const score = minimax(newBoard, depth + 1, true);
                    newBoard[i] = null; // Undo move
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = null; // Undo move
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

// Computer move logic
function computerMove() {
    let move;
    if (difficulty === 'easy') {
        move = easyMove();
    } else if (difficulty === 'medium') {
        move = mediumMove();
    } else if (difficulty === 'hard') {
        move = hardMove();
    }

    if (move !== undefined) {
        board[move] = 'O';
        cells[move].textContent = 'O';
        cells[move].style.pointerEvents = 'none';

        const winner = checkWinner();
        if (winner) showPopup(winner);
        else if (!board.includes(null)) showPopup(null); // Check for draw
    }
}

// Add event listeners to difficulty buttons
difficultyBtns.forEach(button => {
    button.addEventListener('click', () => {
        difficulty = button.getAttribute('data-difficulty');
        difficultyPopup.classList.add('hidden');
        startGame();
    });
});

// Game cell click event
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (isGameActive && !board[index]) {
            board[index] = 'X';
            cell.textContent = 'X';
            cell.style.pointerEvents = 'none';

            const winner = checkWinner();
            if (winner) showPopup(winner);
            else if (!board.includes(null)) showPopup(null); // Check for draw
            else setTimeout(computerMove, 500); // Delay for computer's move
        }
    });
});

// Restart button functionality for result popup
popupRestartBtn.addEventListener('click', () => {
    resultPopup.classList.add('hidden');
    startGame();
});

// Restart button functionality for top-left restart button
topRestartBtn.addEventListener('click', () => {
    resultPopup.classList.add('hidden'); // Hide the result popup if visible
    showDifficultyPopup(); // Show difficulty selection popup
});

// Show the difficulty selection popup when the game loads
window.onload = showDifficultyPopup;
