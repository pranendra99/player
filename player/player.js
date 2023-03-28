const video = document.getElementById('video');
const qualityList = document.querySelector('#quality-list');

function playM3u8(url) {
    if (Hls.isSupported()) {
        video.volume = 0.3;
        const hls = new Hls();
        const m3u8Url = decodeURIComponent(url)
        hls.loadSource(m3u8Url);
        hls.currentLevel = -1;
        hls.loadLevel = -1;
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            const levels = hls.levels;
            qualityList.innerHTML = '';

            const liDark = document.createElement('li');
            const btnDark = document.createElement('button');
            btnDark.classList.add('btn', 'btn-dark');
            btnDark.innerHTML = '<i class="fa-regular fa-moon"></i>';
            btnDark.onclick = function () {
                const element = document.body;
                element.classList.toggle("dark-mode");
                btnDark.innerHTML = (btnDark.innerHTML.includes('fa-sun')) ? '<i class="fa-regular fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
                (btnDark.classList[1].includes('btn-dark')) ? btnDark.classList.replace('btn-dark', 'btn-light') : btnDark.classList.replace('btn-light', 'btn-dark');
            }
            liDark.style.listStyle = 'none';
            liDark.appendChild(btnDark);
            qualityList.appendChild(liDark);

            if(levels.length > 1){
                for (let i = 0; i < levels.length; i++) {
                    const level = levels[i];
                    const listItem = document.createElement('li');
                    const levelBtn = document.createElement('button');
                    levelBtn.classList.add('btn', 'btn-danger');
                    levelBtn.textContent = level.height + 'p';
                    levelBtn.value = i;
                    listItem.style.listStyle = 'none';
                    listItem.appendChild(levelBtn);
                    qualityList.appendChild(listItem);
                    levelBtn.addEventListener('click', function () {
                        hls.currentLevel = parseInt(this.value);
                    });
                }
            }
            video.play();
        });
        document.title = "JKT48 Live - " + url;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('canplay', function () {
            video.play();
        });
        video.volume = 0.3;
        document.title = "JKT48 Live - " + url;
    }
}

function playPause() {
    video.paused ? video.play() : video.pause();
}

function volumeUp() {
    if (video.volume <= 0.9) video.volume += 0.1;
}

function volumeDown() {
    if (video.volume >= 0.1) video.volume -= 0.1;
}

function seekRight() {
    video.currentTime += 5;
}

function seekLeft() {
    video.currentTime -= 5;
}

function vidFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    }
}

function toDark() {
    const element = document.body;
    element.classList.toggle("dark-mode");
}

playM3u8(window.location.href.split("#")[1]);
$(window).on('load', function () {
    $('#video').on('click', function () { this.paused ? this.play() : this.pause(); });
    Mousetrap.bind('space', playPause);
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('f', vidFullscreen);
});
