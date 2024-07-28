import { saveGame, loadGame } from '../Main-Menu/Main-Menu-Files/SaveManager';

class NgeeAnnCityGame {
    constructor() {
        this.boardSize = 5;
        this.board = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(''));
        this.coins = Infinity;
        this.turnNumber = 0;
        this.score = 0;
        this.profit = 0;
        this.upkeep = 0;
        this.highScores = this.loadHighScores();
        this.expansionCount = 0;
    }

    loadHighScores() {
        return JSON.parse(localStorage.getItem('highScores')) || [];
    }

    saveHighScores() {
        localStorage.setItem('highScores', JSON.stringify(this.highScores));
    }

    saveGame(slot = 1) {
        const data = {
            board: this.board,
            coins: this.coins,
            turnNumber: this.turnNumber,
            score: this.score,
            profit: this.profit,
            upkeep: this.upkeep,
            expansionCount: this.expansionCount
        };
        saveGame(slot, data);
        alert("Game saved.");
    }

    loadGame(slot = 1) {
        const data = loadGame(slot);
        if (data) {
            this.board = data.board;
            this.boardSize = this.board.length;
            this.coins = data.coins;
            this.turnNumber = data.turnNumber;
            this.score = data.score;
            this.profit = data.profit;
            this.upkeep = data.upkeep;
            this.expansionCount = data.expansionCount;
            this.updateGameStatus();
            this.renderBoard();
        } else {
            alert("No saved game found.");
        }
    }

    startNewGame() {
        this.constructor();
        document.getElementById('main-menu').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        this.updateGameStatus();
        this.renderBoard();
    }

    updateGameStatus() {
        document.getElementById('turn-number').innerText = `Turn: ${this.turnNumber}`;
        document.getElementById('coins').innerText = `Coins: ${this.coins}`;
        document.getElementById('score').innerText = `Score: ${this.score}`;
        document.getElementById('profit').innerText = `Profit: ${this.profit}`;
        document.getElementById('upkeep').innerText = `Upkeep: ${this.upkeep}`;
    }

    expandCity() {
        const newSize = this.boardSize + 10;
        const newBoard = Array.from({ length: newSize }, () => Array(newSize).fill(''));
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                newBoard[i][j] = this.board[i][j];
            }
        }
        this.board = newBoard;
        this.boardSize = newSize;
        this.expansionCount += 1;
        alert(`City expanded to ${this.boardSize}x${this.boardSize}.`);
    }

    buildBuilding() {
        const buildingType = prompt("Enter building type (R, I, C, O, *):");
        if (!['R', 'I', 'C', 'O', '*'].includes(buildingType)) {
            alert("Invalid building type.");
            return;
        }
        const coordinates = prompt("Enter coordinates (x y):").split(' ').map(Number);
        const [x, y] = coordinates;
        if (0 <= x && x < this.boardSize && 0 <= y && y < this.boardSize && !this.board[x][y]) {
            this.board[x][y] = buildingType;
            if (x === 0 || y === 0 || x === this.boardSize - 1 || y === this.boardSize - 1) {
                if (this.expansionCount < 2) {
                    this.expandCity();
                }
            }
            this.turnNumber += 1;
            this.updateGameStatus();
            this.renderBoard();
        } else {
            alert("Invalid coordinates or cell already occupied.");
        }
    }

    demolishBuilding() {
        const coordinates = prompt("Enter coordinates (x y):").split(' ').map(Number);
        const [x, y] = coordinates;
        if (0 <= x && x < this.boardSize && 0 <= y && y < this.boardSize && this.board[x][y]) {
            this.board[x][y] = '';
            this.turnNumber += 1;
            this.updateGameStatus();
            this.renderBoard();
        } else {
            alert("Invalid coordinates or no building to demolish.");
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('game-board');
        boardElement.style.gridTemplateColumns = `repeat(${this.boardSize}, 20px)`;
        boardElement.innerHTML = '';
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                if (this.board[i][j]) {
                    cell.classList.add(this.board[i][j]);
                }
                cell.innerText = this.board[i][j];
                boardElement.appendChild(cell);
            }
        }
    }
}

const game = new NgeeAnnCityGame();

function startNewGame() {
    game.startNewGame();
}

function loadGame(slot = 1) {
    game.loadGame(slot);
}

function displayHighScores() {
    const highScores = game.loadHighScores();
    alert("High Scores:\n" + highScores.join('\n'));
}

function saveGame(slot, gameState) {
    gameState.gameMode = 'freeplay';
    localStorage.setItem(`savedGame_${slot}`, JSON.stringify(gameState));
}


function exitGame() {
    alert("Exiting game.");
    window.close();
}

function buildBuilding() {
    game.buildBuilding();
}

function demolishBuilding() {
    game.demolishBuilding();
}

function exitToMainMenu() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}
