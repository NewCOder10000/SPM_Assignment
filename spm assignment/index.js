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

Save1.addEventListener("click", function () {
    toggleSaveFile(Save1, [Save2, Save3]);
});

Save2.addEventListener("click", function () {
    toggleSaveFile(Save2, [Save1, Save3]);
});

Save3.addEventListener("click", function () {
    toggleSaveFile(Save3, [Save1, Save2]);
});

BackgroundImage.addEventListener("click", function() {
    ContinueButton.classList.remove("show");
    Save3.classList.remove("selected");
    Save2.classList.remove("selected");
    Save1.classList.remove("selected");
})

document.getElementById('setting').addEventListener('mousedown', function () {
    document.getElementById('cogImage').src = 'cog_active.png';
});

document.getElementById('setting').addEventListener('mouseup', function () {
    document.getElementById('cogImage').src = 'cog.png';
});

SettingButton.addEventListener('click', function () {
    SettingWindow.classList.toggle('show');
});

volumeControl.addEventListener('input', function () {
    audio.volume = this.value;
});