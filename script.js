const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let isVsComputer = false;
const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6] // diagonals
];

const gameBoard = document.getElementById('gameBoard');
const statusDisplay = document.getElementById('status');
const winMsg = document.getElementById('winMsg');
const resetBtn = document.getElementById('resetBtn');
const modeToggle = document.getElementById('modeToggle');
const currentMode = document.getElementById('currentMode');

// Create board boxes
for (let i = 0; i < 9; i++) {
    const box = document.createElement('button');
    box.classList.add('box');
    box.dataset.index = i;
    box.addEventListener('click', handleCellClick);
    gameBoard.appendChild(box);
}

function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    if (board[index] || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.disabled = true;

    if (checkWinner()) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        showWinMsg(`Player ${currentPlayer} wins!`);
        return;
    }

    if (board.every(cell => cell)) {
        statusDisplay.textContent = 'Game Draw!';
        gameActive = false;
        showWinMsg('Game Draw!');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;

    if (isVsComputer && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function computerMove() {
    const emptyCells = board.map((cell, i) => cell ? null : i).filter(i => i !== null);
    if (emptyCells.length === 0) return;
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = 'O';
    const box = document.querySelector(`[data-index="${randomIndex}"]`);
    box.textContent = 'O';
    box.disabled = true;

    if (checkWinner()) {
        statusDisplay.textContent = 'Computer (O) wins!';
        gameActive = false;
        showWinMsg('Computer wins!');
        return;
    }

    if (board.every(cell => cell)) {
        statusDisplay.textContent = 'Game Draw!';
        gameActive = false;
        showWinMsg('Game Draw!');
        return;
    }

    currentPlayer = 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function showWinMsg(msg) {
    winMsg.textContent = msg;
}

function resetGame() {
    board.fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    winMsg.textContent = '';
    document.querySelectorAll('.box').forEach(box => {
        box.textContent = '';
        box.disabled = false;
    });
    if (isVsComputer && currentPlayer === 'O') {
        computerMove();
    }
}

function toggleMode() {
    isVsComputer = !isVsComputer;
    currentMode.textContent = isVsComputer ? 'Computer (O)' : 'Two Players';
    modeToggle.textContent = isVsComputer ? 'Play Two Players' : 'Play vs Computer';
    resetGame();
}

resetBtn.addEventListener('click', resetGame);
modeToggle.addEventListener('click', toggleMode);