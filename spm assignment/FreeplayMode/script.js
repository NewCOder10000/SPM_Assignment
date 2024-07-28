let gridSize = 5;
let coins = Infinity;
let score = 0;
let profit = 0;
let upkeep = 0;
let turn = 0;
let lossCounter = 0;
let selectedBuilding = null;
let demolishMode = false;
let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));

document.addEventListener("DOMContentLoaded", () => {
    createGrid();
    updateGameInfo();
});

function createGrid() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 50px)`;
    gameBoard.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${i}-${j}`;
            cell.onclick = () => (demolishMode ? demolishBuilding(i, j) : placeBuilding(i, j));
            gameBoard.appendChild(cell);

            if (grid[i][j] !== '') {
                cell.innerText = grid[i][j];
                cell.style.backgroundColor = getBuildingColor(grid[i][j]);
            }
        }
    }
}

function selectBuilding(building) {
    selectedBuilding = building;
    demolishMode = false;
}

function placeBuilding(row, col) {
    if (!selectedBuilding || grid[row][col] !== '') return;

    grid[row][col] = selectedBuilding;
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.innerText = selectedBuilding;
    cell.style.backgroundColor = getBuildingColor(selectedBuilding);

    if (row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1) {
        expandGrid();
    }

    turn++;
    calculateScore();
    calculateIncomeAndUpkeep();
    updateGameInfo();
    checkEndGame();
}

function demolishBuilding(row, col) {
    if (grid[row][col] === '') return;

    grid[row][col] = '';
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.innerText = '';
    cell.style.backgroundColor = '#fff';
    coins -= 1;

    turn++;
    calculateScore();
    calculateIncomeAndUpkeep();
    updateGameInfo();
    checkEndGame();
}

function enableDemolishMode() {
    selectedBuilding = null;
    demolishMode = true;
}

function exitToMainMenu() {
    // Logic to exit to main menu
    alert("Exiting to main menu...");
}

function getBuildingColor(building) {
    switch (building) {
        case 'R': return '#ffcccc';
        case 'I': return '#ccffcc';
        case 'C': return '#ccccff';
        case 'O': return '#ffffcc';
        case '*': return '#cccccc';
        default: return '#fff';
    }
}

function expandGrid() {
    const oldGridSize = gridSize;
    gridSize += 5;
    const newGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));

    for (let i = 0; i < oldGridSize; i++) {
        for (let j = 0; j < oldGridSize; j++) {
            newGrid[i + 2][j + 2] = grid[i][j];
        }
    }

    grid = newGrid;
    createGrid();
}

function calculateScore() {
    score = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] !== '') {
                score += getBuildingScore(i, j);
            }
        }
    }
}

function getBuildingScore(row, col) {
    const building = grid[row][col];
    let buildingScore = 0;
    const adjacentBuildings = getAdjacentBuildings(row, col);

    switch (building) {
        case 'R':
            if (adjacentBuildings.includes('I')) {
                buildingScore = 1;
            } else {
                buildingScore += adjacentBuildings.filter(b => b === 'R' || b === 'C').length;
                buildingScore += adjacentBuildings.filter(b => b === 'O').length * 2;
            }
            break;
        case 'I':
            buildingScore = grid.flat().filter(b => b === 'I').length;
            break;
        case 'C':
            buildingScore += adjacentBuildings.filter(b => b === 'C').length;
            break;
        case 'O':
            buildingScore += adjacentBuildings.filter(b => b === 'O').length;
            break;
        case '*':
            buildingScore += getConnectedRoadLength(row, col);
            break;
    }

    return buildingScore;
}

function getAdjacentBuildings(row, col) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    const adjacentBuildings = [];

    directions.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
            adjacentBuildings.push(grid[newRow][newCol]);
        }
    });

    return adjacentBuildings;
}

function getConnectedRoadLength(row, col) {
    let length = 0;
    let visited = new Set();
    let queue = [[row, col]];

    while (queue.length > 0) {
        let [r, c] = queue.shift();
        let key = `${r}-${c}`;

        if (!visited.has(key) && grid[r][c] === '*') {
            length++;
            visited.add(key);

            const directions = [
                [-1, 0], [1, 0], [0, -1], [0, 1]
            ];

            directions.forEach(([dx, dy]) => {
                const newRow = r + dx;
                const newCol = c + dy;
                if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && grid[newRow][newCol] === '*') {
                    queue.push([newRow, newCol]);
                }
            });
        }
    }

    return length;
}

function calculateIncomeAndUpkeep() {
    income = 0;
    upkeep = 0;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const building = grid[i][j];
            if (building !== '') {
                switch (building) {
                    case 'R':
                        income += 1;
                        if (isResidentialCluster(i, j)) {
                            upkeep += 1;
                        }
                        break;
                    case 'I':
                        income += 2;
                        upkeep += 1;
                        break;
                    case 'C':
                        income += 3;
                        upkeep += 2;
                        break;
                    case 'O':
                        upkeep += 1;
                        break;
                    case '*':
                        if (!isConnectedRoad(i, j)) {
                            upkeep += 1;
                        }
                        break;
                }
            }
        }
    }

    profit = income - upkeep;
    coins += profit;
    if (profit < 0) {
        lossCounter++;
    } else {
        lossCounter = 0;
    }
}

function isResidentialCluster(row, col) {
    return getAdjacentBuildings(row, col).includes('R');
}

function isConnectedRoad(row, col) {
    return getConnectedRoadLength(row, col) > 1;
}

function updateGameInfo() {
    document.getElementById('coins').innerText = coins;
    document.getElementById('turn').innerText = turn;
    document.getElementById('score').innerText = score;
    document.getElementById('profit').innerText = profit;
    document.getElementById('upkeep').innerText = upkeep;
}

function checkEndGame() {
    if (lossCounter >= 20) {
        alert("Game Over! The city has been making a loss for 20 turns.");
        exitToMainMenu();
    }
}

function resizeGameBoard() {
    const gameBoard = document.getElementById('game-board');
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    // Calculate max number of cells that fit into viewport
    const cellSize = 50; // Size of each cell
    const maxCols = Math.floor(containerWidth / cellSize);
    const maxRows = Math.floor(containerHeight / cellSize);

    gameBoard.style.gridTemplateColumns = `repeat(${maxCols}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${maxRows}, ${cellSize}px)`;
}

window.addEventListener('resize', resizeGameBoard);
resizeGameBoard(); // Call once to set initial size

