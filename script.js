const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
const HUMAN = 'X';
const AI = 'O';

// 初始化
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) {
        return;
    }

    makeMove(index, HUMAN);

    if (checkWin(board, HUMAN)) {
        endGame(HUMAN);
        return;
    }
    if (checkDraw(board)) {
        endGame('draw');
        return;
    }

    // 電腦思考
    statusText.innerText = "Computer is thinking...";
    gameActive = false;

    setTimeout(() => {
        const bestMoveIndex = minimax(board, AI).index;
        makeMove(bestMoveIndex, AI);

        if (checkWin(board, AI)) {
            endGame(AI);
        } else if (checkDraw(board)) {
            endGame('draw');
        } else {
            statusText.innerText = "Your turn";
            gameActive = true;
        }
    }, 400); // 輕快的節奏
}

function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.innerText = player;
    cell.classList.add('taken');
    cell.classList.add(player.toLowerCase());
}

// Minimax 核心演算法 (不敗邏輯)
function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    if (checkWin(newBoard, HUMAN)) {
        return { score: -10 };
    } else if (checkWin(newBoard, AI)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === AI) {
            const result = minimax(newBoard, HUMAN);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, AI);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === AI) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWin(board, player) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winCombos.some(combo => {
        return combo.every(index => board[index] === player);
    });
}

function checkDraw(board) {
    return board.every(cell => cell !== '');
}

function endGame(winner) {
    gameActive = false;
    if (winner === 'draw') {
        statusText.innerText = "It's a Draw";
        statusText.style.color = "#b2bec3";
    } else {
        if (winner === AI) {
            statusText.innerText = "Computer Wins";
            statusText.style.color = "var(--accent-o)";
        } else {
            statusText.innerText = "You Win";
            statusText.style.color = "var(--accent-x)";
        }
    }
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    statusText.innerText = "Ready to play";
    statusText.style.color = "var(--text-secondary)";
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('taken', 'x', 'o');
    });
}