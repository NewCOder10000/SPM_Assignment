const SettingButton = document.getElementById("setting");
const SettingWindow = document.getElementById("setting-window");
const Background = document.getElementById("body");
const audio = document.getElementById('audio1');
const volumeControl = document.getElementById('volumeControl');

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