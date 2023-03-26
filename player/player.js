var video = document.getElementById('video');
var qualityWrapper = document.getElementById('quality-wrapper');
var userAgent = navigator.userAgent.toLowerCase();

function playM3u8(url) {
    if (Hls.isSupported()) {
        video.volume = 0.3;
        var hls = new Hls();
        var m3u8Url = decodeURIComponent(url)
        hls.loadSource(m3u8Url);
        hls.loadLevel = -1
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
        document.title = url;

        var qualityBtn = document.querySelector('#quality-btn');
        var qualityList = document.querySelector('#quality-list');
        qualityBtn.addEventListener('click', function () {
            var levels = hls.levels;
            qualityList.innerHTML = '';
            for (var i = 0; i < levels.length; i++) {
                var level = levels[i];
                console.log(level)
                var listItem = document.createElement('li');
                var levelBtn = document.createElement('button');
                levelBtn.classList.add('btn', 'btn-danger');
                levelBtn.textContent = level.height + 'p';
                levelBtn.value = i;
                listItem.appendChild(levelBtn);
                qualityList.appendChild(listItem);
                levelBtn.addEventListener('click', function () {
                    hls.currentLevel = parseInt(this.value);
                    qualityList.style.display = 'none';
                });
            }

            // toggle the display style between "block" and "none"
            if (qualityList.style.display === 'none') {
                qualityList.style.display = 'block';
            } else {
                qualityList.style.display = 'none';
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('canplay', function () {
            video.play();
        });
        video.volume = 0.3;
        document.title = url;
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

playM3u8(window.location.href.split("#")[1]);
if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1 || userAgent.indexOf('ipod') !== -1) {
    qualityWrapper.style.display = 'none';
}
$(window).on('load', function () {
    $('#video').on('click', function () { this.paused ? this.play() : this.pause(); });
    Mousetrap.bind('space', playPause);
    Mousetrap.bind('up', volumeUp);
    Mousetrap.bind('down', volumeDown);
    Mousetrap.bind('right', seekRight);
    Mousetrap.bind('left', seekLeft);
    Mousetrap.bind('f', vidFullscreen);
});
