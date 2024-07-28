const turn = document.getElementById("turn");
const score = document.getElementById("score");
const coins = document.getElementById("coins");
const grid = document.getElementById("gameField-grid")
import { saveGame } from '../../Main-Menu/Main-Menu-Files/SaveManager';
const GameMode = "arcade";


var turnCounter = 1;
var scoreCounter = 0;
var coinCounter = 16;
var action = "";
var savingGame = null;
var GameOver = false;
var buildingNumber = 0;
const gridSize = [20,20]

const building = {
    "residential": [1,1],
    "industrial": [2,1]
};


const buildingScoringSystem = {
    "residential": [
        ["residential",1,false],
        ["industrial",1,true],
        ["commercial",1,false],
        ["park",2,false]
    ],
    "commercial":[
        ["commercial",1,false]
    ],
    "park":[
        ["park",1,false]
    ]
}

var gridData = [] //store index of building position
var scoreList = [] //store score in an array
for(var row = 0; row< gridSize[0]; row++){ //number of row
    var gridRow = []
    var scoring = []
    for(var column = 0; column < gridSize[1]; column++){
        grid.innerHTML += `<div class="gridBorder" id ="${column},${row}" ondrop ="drop(event)" ondragover="allowDrop(event)" ondragenter= "spotDragEnter(event)" ondragleave="spotDragLeave(event)"></div>`
        
        gridData.push(`${column},${row}`)
        scoreList.push(0)
    }
    gridData.push(gridRow)
    scoreList.push(scoring)
}

//game start
const savedGame = localStorage.getItem("savedGame"); //localstorage stores data from savedGame const
if(savedGame != null){
    const save = JSON.parse(localStorage.getItem(`${savedGame}-saved`))
    savingGame = save;
    turnCounter=save.turnCounter;
    coinCounter=save.coinCounter;
    scoreCounter=save.scoreCounter;
    gridData=save.gridData;
    turn.innerText=turnCounter;
    score.innerText=score;
    coins.innerText=coins;
    for(var row=0; row < gridData.length; row++){
        for(var column=0; column<gridData[0].length; column++){
            if(gridData[row][column]) 
                placeBuilding(gridData[row][column],row,column)
        }
    }
}

function placeBuilding(type, column,row){
    const gridIndex = document.getElementById(`${column},${row}`)
    gridIndex.innerHTML = `<img src="./icon/${type}.png" width ="100%" draggable = "false">`

    gridIndex.classList.add(type);

    gridIndex.style.backgroundColor =""

    gridData[row][column] = type;
    buildingNumber += 1;
}

function saveGameState() {
    const gameState = {
        turnCounter: turnCounter,
        scoreCounter: scoreCounter,
        coinCounter: coinCounter,
        gridData: gridData,
        gameMode: GameMode
    };
    saveGame(1, gameState);
}

document.getElementById("saveButton").addEventListener("click", saveGameState);

