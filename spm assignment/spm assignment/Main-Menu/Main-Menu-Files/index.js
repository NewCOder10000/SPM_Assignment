const SettingButton = document.getElementById("setting");
const SettingWindow = document.getElementById("setting-window");
const Background = document.getElementById("body");
const audio = document.getElementById('audio1');
const volumeControl = document.getElementById('volumeControl');
const Save1 = document.getElementById("SaveFile1");
const Save2 = document.getElementById("SaveFile2");
const Save3 = document.getElementById("SaveFile3");
const ContinueButton = document.getElementById("Continue");
const BackgroundImage = document.getElementById("img1")
const HSButton = document.getElementById("HS")

if (SettingButton) {
    SettingButton.addEventListener('mousedown', function () {
        document.getElementById('cogImage').src = 'cog_active.png';
    });
}

if (SettingButton) {
    SettingButton.addEventListener('mouseup', function () {
        document.getElementById('cogImage').src = 'cog.png';
    });
}

if (SettingButton) {
    SettingButton.addEventListener('click', function () {
        SettingWindow.classList.toggle('show');
    });
}

if (SettingButton) {
    volumeControl.addEventListener('input', function () {
        audio.volume = this.value;
    });
}

if (HSButton) {
    HSButton.addEventListener('click', function () {
        window.location.href = "part3.html";
    })
}

if (window.location.pathname === "/part3.html") {
    fetch('/api/highscore')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error, status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Data retrieved: ${data}`)
            DisplayHighscores(data);
        })
        .catch(error => {
            console.error("Something went wrong.", error);
        })
}

function DisplayHighscores(data) {
    for (let i = 1; i <= 10; i++) {
        const highScoreList = document.getElementById(`highscore${i}`);
        highScoreList.innerHTML = '';
    }

    data.forEach((score, index) => {
        if (index < 10) {
            const listItem = document.createElement('li');

            const usernameSpan = document.createElement('span');
            usernameSpan.textContent = score.Username;

            const scoreSpan = document.createElement('span');
            scoreSpan.textContent = score.Score;

            listItem.appendChild(usernameSpan);
            listItem.appendChild(scoreSpan);

            document.getElementById(`highscore${index + 1}`).appendChild(listItem);
        }
    });
}

if (Save1) {
    function toggleSaveFile(saveFile, otherSaveFiles) {
        if (saveFile.classList.contains("selected")) {
            saveFile.classList.remove("selected");
            ContinueButton.classList.remove("show");
        } else {
            saveFile.classList.add("selected");
            otherSaveFiles.forEach(file => file.classList.remove("selected"));
            ContinueButton.classList.add("show");
        }
    }
}

if (Save1) {
    Save1.addEventListener("click", function () {
        toggleSaveFile(Save1, [Save2, Save3]);
    });
}

if (Save1) {
    Save2.addEventListener("click", function () {
        toggleSaveFile(Save2, [Save1, Save3]);
    });
}

if (Save1) {
    Save3.addEventListener("click", function () {
        toggleSaveFile(Save3, [Save1, Save2]);
    });
}

if (Save1) {
    BackgroundImage.addEventListener("click", function () {
        ContinueButton.classList.remove("show");
        Save3.classList.remove("selected");
        Save2.classList.remove("selected");
        Save1.classList.remove("selected");
    })
}

import { loadGame } from './SaveManager.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("SaveFile1").addEventListener("click", () => loadAndRedirect(1));
    document.getElementById("SaveFile2").addEventListener("click", () => loadAndRedirect(2));
    document.getElementById("SaveFile3").addEventListener("click", () => loadAndRedirect(3));
});

function loadAndDisplaySave(slot) {
    const gameState = loadGame(slot);
    if (gameState) {
        if (slot === 1) {
            document.getElementById("scoreCount1").innerText = `Score: ${gameState.score}`;
            document.getElementById("coinCount1").innerText = `Coins: ${gameState.coins}`;
        }
        else if (slot === 2) {
            document.getElementById("scoreCount2").innerText = `Score: ${gameState.score}`;
            document.getElementById("coinCount2").innerText = `Coins: ${gameState.coins}`;
        }
        else if (slot === 3) {
            document.getElementById("scoreCount2").innerText = `Score: ${gameState.score}`;
            document.getElementById("coinCount2").innerText = `Coins: ${gameState.coins}`;
        }

        // Handle continue button click
        document.getElementById("Continue").onclick = () => {
            sessionStorage.setItem('loadedGameState', JSON.stringify(gameState));

            // Redirect based on game mode
            const gameMode = gameState.gameMode || 'freeplay';
            if (gameMode === 'arcade') {
                window.location.href = '../../ArcadeMode/ArcadeMode.html';
            } else {
                window.location.href = '../../FreeplayMode/index.html';
            }
        };
    } else {
        alert("No saved game found.");
    }
}
