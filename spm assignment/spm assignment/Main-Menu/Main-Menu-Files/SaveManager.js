const fs = require('fs');
const saveFilePath = './savegame.json';

/*const saveGame = (gameState) => {
    const json = JSON.stringify(gameState);
    fs.writeFile(saveFilePath, json, 'utf8', (err) => {
        if (err) {
            console.error('Error saving game:', err);
        } else {
            console.log('Game saved successfully.');
        }
    });
};

const loadGame = (callback) => {
    fs.readFile(saveFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error loading game:', err);
            callback(null);
        } else {
            const gameState = JSON.parse(data);
            callback(gameState);
        }
    });
};*/

function saveGame(gameState) {
    localStorage.setItem('savedGame', JSON.stringify(gameState));
    console.log('Game saved successfully.');
}

function loadGame() {
    const savedGame = localStorage.getItem(`savedGame_${slot}`);
    if (savedGame) {
        return savedGame ? JSON.parse(savedGame) : null;
    } else {
        return null;
    }
}

export { saveGame, loadGame };

module.exports = {
    saveGame,
    loadGame
};