
const turnElement = document.getElementById("turn");
const scoreElement = document.getElementById("score");
const coinElement = document.getElementById("coins");
const gridElement = document.getElementById("gameField-grid");


const gameOverPopup = document.getElementById("gameover-popup");
const finalScoreElement = document.getElementById("finalscore");
const savePopup = document.getElementById("savegame-popup");
const overwritePrompt = document.getElementById("repeat-file");

let totalCoins = 4;
let currentTurn = 1;
let totalScore = 0;
let gameEnded = false;
let currentAction = "";
const gridDimensions = [20, 20];
let totalBuildings = 0; // Track number of buildings to know when all tiles are filled
let previousSave = null; // Check if user has saved game
const buildingTypes = {
    "residential": [1, 1],
    "industry": [2, 1]
};

const adjacentBuildingScores = {
    "residential": [
        ["industry", 1, true], 
        ["residential", 1, false], 
        ["commercial", 1, false], 
        ["park", 2, false]
    ],
    "commercial": [
        ["commercial", 1, false]
    ],
    "park": [
        ["park", 1, false]
    ]
};

let gameGrid = []; // Store the buildings on the grid
let scoreGrid = []; // Store the score of the buildings on the grid

for (let y = 0; y < gridDimensions[0]; y++) {
    let gridRow = [];
    let scoreRow = [];
    for (let x = 0; x < gridDimensions[1]; x++) {
        gridElement.innerHTML += `
            <div class="gridBorder" id="${x},${y}" ondrop="handleDrop(event)" ondragover="allowDrop(event)" ondragenter="highlightDropArea(event)" ondragleave="removeHighlight(event)"></div>
        `;
        gridRow.push("");
        scoreRow.push(0);
    }
    gameGrid.push(gridRow);
    scoreGrid.push(scoreRow);
}

// Load saved game if it exists
const activeSave = localStorage.getItem("activeSave");
if (activeSave != null) {
    const save = JSON.parse(localStorage.getItem(`${activeSave}-save`));
    previousSave = save;
    totalCoins = save.coins;
    currentTurn = save.turn;
    totalScore = save.score;
    gameGrid = save.gridData;
    
    // Update HTML elements
    coinElement.innerText = totalCoins;
    scoreElement.innerText = totalScore;
    turnElement.innerText = currentTurn;
    for (let y = 0; y < gameGrid.length; y++) {
        for (let x = 0; x < gameGrid[0].length; x++) {
            if (gameGrid[y][x]) placeBuildingOnGrid(gameGrid[y][x], x, y);
        }
    }
}

function placeBuildingOnGrid(type, x, y) {
    const spot = document.getElementById(`${x},${y}`);
    spot.innerHTML = `<img src="./icon/${type}.png" width="100%" draggable="false"></img>`;
    spot.classList.add(type);
    spot.style.backgroundColor = "";
    gameGrid[y][x] = type;
    totalBuildings += 1;
}

function removeBuildingFromGrid(x, y) {
    const spot = document.getElementById(`${x},${y}`);
    const type = gameGrid[y][x];
    spot.innerHTML = ``;
    spot.classList.remove(type);
    spot.style.backgroundColor = "";
    gameGrid[y][x] = "";
    updateCoins(-1);
    totalBuildings -= 1;
}

function generateRandomBuildings() {
    if (gameEnded) return;
    const buildingTypes = ["commercial", "industry", "residential", "park", "road"];
    let choice1 = Math.floor(Math.random() * 5);
    let choice2 = Math.floor(Math.random() * 5);
    while (choice2 == choice1) {
        choice2 = Math.floor(Math.random() * 5);
    }
    choice1 = buildingTypes[choice1];
    choice2 = buildingTypes[choice2];
    const randomBuilding1 = document.getElementById('randomBuilding1');
    const randomBuilding2 = document.getElementById('randomBuilding2');
    randomBuilding1.innerHTML = `<img src="./icon/${choice1}.png" width="100%" draggable="true" ondragstart="startDrag(event)" id="building1" data-type="${choice1}"></img>`;
    randomBuilding2.innerHTML = `<img src="./icon/${choice2}.png" width="100%" draggable="true" ondragstart="startDrag(event)" id="building2" data-type="${choice2}"></img>`;
}

function getAdjacentBuildings(x, y, relativeCoords) {
    if (y === undefined || x === undefined) return null;
    let adjacentBuildings = [];
    for (let i in relativeCoords) {
        const tileY = relativeCoords[i][0] + y;
        const tileX = relativeCoords[i][1] + x;
        if (tileY < 0 || tileX < 0 || tileY == gridDimensions[0] || tileX == gridDimensions[1]) continue;
        if (gameGrid[tileY][tileX]) adjacentBuildings.push(gameGrid[tileY][tileX]);
    }
    return adjacentBuildings;
}

function calculateBuildingScore(x, y, type) {
    let calculatedScore = 0;
    const adjacentRelativeCoords = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]];
    if (type in adjacentBuildingScores) {
        const buildingData = adjacentBuildingScores[type];
        const adjacentBuildings = getAdjacentBuildings(x, y, adjacentRelativeCoords);
        for (let i in buildingData) {
            let data = buildingData[i];
            for (let j in adjacentBuildings) {
                if (data[0] == adjacentBuildings[j]) {
                    if (data[2]) return data[1];
                    calculatedScore += data[1];
                }
            }
        }
        if (type == "commercial") {
            for (let i in adjacentBuildings) {
                if (adjacentBuildings[i] == "residential") {
                    updateCoins(1);
                }
            }
        }
    } else if (type == "industry") {
        calculatedScore = 1;
        const adjacentBuildings = getAdjacentBuildings(x, y, adjacentRelativeCoords);
        for (let i in adjacentBuildings) {
            if (adjacentBuildings[i] == "residential") {
                updateCoins(1);
            }
        }
    } else if (type == "road") {
        const rowRelativeCoords = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const rowBuildings = getAdjacentBuildings(x, y, rowRelativeCoords);
        for (let i in rowBuildings) {
            if (rowBuildings[i] == "road") {
                calculatedScore = 1;
                break;
            }
        }
    }
    return calculatedScore;
}

function canPlaceBuilding(x, y) {
    if (!totalBuildings) return true;
    if (y === undefined || x === undefined) return false;
    const orthogonalRelativeCoords = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    return getAdjacentBuildings(x, y, orthogonalRelativeCoords).length;
}

function allowDrop(event) {
    if (gameEnded) return;
    event.preventDefault();
}

function startDrag(event) {
    currentAction = "build";
    event.dataTransfer.setData("building", event.target.id);
}

function setDestroyAction(event) {
    currentAction = "destroy";
}

function advanceTurn() {
    scoreElement.innerHTML = totalScore;
    currentTurn += 1;
    turnElement.innerText = currentTurn;
    generateRandomBuildings();
    checkGameOver();
}

function handleDrop(event) {
    event.preventDefault();
    if (currentAction == "build") {
        const targetId = event.target.id;
        const [x, y] = targetId.split(',').map(Number);
        const data = event.dataTransfer.getData("building");
        const img = document.getElementById(data);
        const type = img.getAttribute("data-type");
        if (!canPlaceBuilding(x, y)) return;
        placeBuildingOnGrid(type, x, y);
        totalScore += calculateBuildingScore(x, y, type);
        scoreGrid[y][x] = totalScore;
        updateCoins(-1);
        advanceTurn();
    } else {
        const targetId = event.target.parentElement.id;
        const [x, y] = targetId.split(',').map(Number);
        if (x === undefined || y === undefined) return;
        removeBuildingFromGrid(x, y);
        advanceTurn();
    }
}

function highlightDropArea(event) {
    const [x, y] = event.target.id.split(',').map(Number);
    if (currentAction == "destroy") {
        if (y != undefined && x != undefined) return;
        event.target.style.backgroundColor = "red";
    } else {
        if (!canPlaceBuilding(x, y)) return;
        event.target.style.backgroundColor = "lightblue";
    }
}

function removeHighlight(event) {
    event.target.style.backgroundColor = "";
}

function updateCoins(value = 0) {
    totalCoins += value;
    coinElement.innerText = totalCoins;
}

//gameover section
function checkGameOver() {
    if (totalCoins < 1 || totalBuildings == gridDimensions[0] * gridDimensions[1]) {
        gameOverPopup.style.display = "flex";
        finalScoreElement.innerText = `${totalScore} - Game Over!`;
        gameEnded = true;
        const saveInput = document.getElementById("sname").value;
        if (saveInput) {
            localStorage.removeItem(`${saveInput}-save`);
        } else if (activeSave) {
            localStorage.removeItem(`${activeSave}-save`);
        }
    }
}

let saveMode = "normal";

function finalizeSaveAction() {
    overwritePrompt.style.display = "none";
    document.getElementById('save-success').style.display = 'none';
    if (saveMode == "exit") {
        window.location = './ArcadeMode/index.html';
    }
}

function promptSaveGame(type = "normal") {
    if (type != "none") saveMode = type;
    if (previousSave) {
        updateSaveFile();
        return;
    }
    savePopup.style.display = "flex";
    overwritePrompt.style.display = "none";
    if (type == "leave" || type == "exit") document.getElementById("save-game").innerText += "?";
}

function objectsEqual(obj1, obj2) {
    if (obj1 == null || obj2 == null) return false;
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

function createSaveObject() {
    return {
        type: "arcade",
        turn: currentTurn,
        coins: totalCoins,
        score: totalScore,
        gridData: gameGrid
    };
}

function hasSavedGame() {
    return objectsEqual(previousSave, createSaveObject());
}

function updateSaveFile(name) {
    const saveData = createSaveObject();
    localStorage.setItem(`${name}-save`, JSON.stringify(saveData));
    previousSave = saveData;
    if (saveMode == "exit" && hasSavedGame()) {
        finalizeSaveAction();
        return;
    }
    document.getElementById("save-success").style.display = "flex";
}
function displaySaveGame(type = "normal"){
    if (type != "none") saveType = type
    if (previousSave){
        updateSaveFile()
        return
    }
    savePopup.style.display = "flex"
    overwritePrompt.style.display = "none"
    if (type == "leave" || type == "exit") document.getElementById("save-game").innerText += "?"
}

function saveGame(override = false) {
    const saveName = document.getElementById("sname").value;
    if (!saveName) return;
    let saveFiles = localStorage.getItem("saveFiles") ? JSON.parse(localStorage.getItem("saveFiles")) : [];
    if (saveFiles.includes(saveName)) {
        if (!override) {
            savePopup.style.display = "none";
            overwritePrompt.style.display = "flex";
            document.getElementById("repeat-title").innerText = `Another save file with the name ${saveName} has been found. Do you want to override it?`;
            return;
        }
    } else {
        saveFiles.push(saveName);
    }
    localStorage.setItem("saveFiles", JSON.stringify(saveFiles));
    updateSaveFile(saveName);
    savePopup.style.display = "none";
    overwritePrompt.style.display = "none";
}

const beforeUnloadHandler = (event) => {
    if (!hasSavedGame() && !gameEnded) {
        event.preventDefault();
        promptSaveGame("leave");
    }
};

window.addEventListener("beforeunload", beforeUnloadHandler);

generateRandomBuildings()
