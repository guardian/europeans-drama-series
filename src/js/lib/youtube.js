/*globals YT*/
import YouTubePlayer from 'youtube-player';
import reqwest from 'reqwest';
import {isMobile} from './detect';
import Tracker from './tracking';
import {setStyles, scrollTo} from './dom';
import {parse} from 'iso8601-duration';

function pimpYouTubePlayer(videoId, node, height, width, chapters) {
    const tracker = new Tracker({videoId: videoId});

    const youtubePlayer = new YouTubePlayer(node.querySelector('#ytGuPlayer'), {
        height: height,
        width: width,
        videoId: videoId,
        playerVars: { 'autoplay': 0, 'controls': 1, 'rel': 0 }
    });

    youtubePlayer.on('ready', () => {
        addChapterEventHandlers(node, youtubePlayer);
        node.querySelector('.docs__poster--loader').addEventListener('click', function() {
            playVideo(node.querySelector('.docs__poster--wrapper'), youtubePlayer, this);
        });

        node.querySelector('.docs__shows-trailer').addEventListener('click', function() {
            youtubePlayer.pauseVideo();
        });
    });

    youtubePlayer.on('stateChange', event => {
        let playTimer;
        if (event.data === YT.PlayerState.PLAYING) {
            youtubePlayer.getDuration().then(duration => {
                playTimer = setInterval(function() {
                    trackChapterProgress(youtubePlayer, duration);
                    sendPercentageCompleteEvents(youtubePlayer, duration);
                }, 1000);
            });
        } else {
            clearTimeout(playTimer);
        }
    });

    function trackChapterProgress(youtubePlayer, playerTotalTime) {
        youtubePlayer.getCurrentTime().then(playerCurrentTime => {
            const currentChapter = chapters.filter(function(value){
                const chapStart = value.start;
                const chapEnd = value.end || playerTotalTime;
                if (playerCurrentTime >= chapStart && playerCurrentTime < chapEnd){
                    return value;
                }
            });
            if (currentChapter.length === 1){
                const chapterElements = node.querySelectorAll('.docs--chapters li[data-role="chapter"]');

                Array.from(chapterElements).forEach(function(el){
                    const dataStart = parseInt(el.dataset.start);

                    if (dataStart === currentChapter[0].start){
                        el.classList.add('docs--chapters-active');
                        el.classList.remove('docs--chapters-inactive');

                        const dataEnd = parseInt(el.dataset.end);
                        const nextChapter = dataEnd || playerTotalTime;
                        const chapterCurrentProgress = (playerCurrentTime - dataStart)/(nextChapter - dataStart);

                        const progress = el.querySelector('.progress');

                        setStyles(progress, {
                            width: `${chapterCurrentProgress * 100}%`
                        });
                    } else {
                        el.classList.add('docs--chapters-inactive');
                        el.classList.remove('docs--chapters-active');
                    }
                });
            }
        });
    }

    function sendPercentageCompleteEvents(youtubePlayer, playerTotalTime) {
        const quartile = playerTotalTime / 4;

        const playbackEvents = {
            '25': quartile,
            '50': quartile * 2,
            '75': quartile * 3,
            'end': playerTotalTime
        };

        youtubePlayer.getCurrentTime().then(currentTime => {
            for (let prop in playbackEvents) {
                if (currentTime >= playbackEvents[prop]) {
                    tracker.track(prop);
                }
            }
        });
    }

    function playVideo(videoExpand, youtubePlayer, posterHide) {
        if (! isMobile()) {
            videoExpand.classList.add('docs__poster--wrapper--playing');
        }

        scrollTo(document.body, 0, 300);
        tracker.track('play');
        youtubePlayer.playVideo();
        posterHide.classList.add('docs__poster--hide');
    }

    function addChapterEventHandlers(node, youTubePlayer) {
        const chapterElements = node.querySelectorAll('.docs--chapters li[data-role="chapter"]');

        Array.from(chapterElements).forEach( function(chapterBtn) {
            chapterBtn.onclick = function(){
                const chapStart = parseInt(chapterBtn.getAttribute('data-start'));
                playVideo(node.querySelector('.docs__poster--wrapper'), youTubePlayer, node.querySelector('.docs__poster--loader'));
                youTubePlayer.seekTo(chapStart, true);
            };
        });
    }
}

function getYouTubeVideoDuration(videoId, callback){
    //Note: This is a browser key intended to be exposed on the client-side.
    const apiKey = 'AIzaSyCtM2CJsgRhfXVj_HesBIs540tzD4JUXqc';

    reqwest({
        url: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + videoId + '&key=' + apiKey,
        type: 'json',
        crossOrigin: true,
        success: (resp) => {
            //duration is an ISO8601 duration
            //see: https://developers.google.com/youtube/v3/docs/videos#contentDetails.duration
            const duration =  resp.items[0].contentDetails.duration;

            const parsedDuration = parse(duration);

            const paddedSeconds = `${parsedDuration.seconds < 10 ? '0' : ''}${parsedDuration.seconds}`;

            //assumes video duration is less than an hour
            const formattedDuration = `${parsedDuration.minutes}:${paddedSeconds}`;

            callback(formattedDuration);
        }
    });
}
export { pimpYouTubePlayer, getYouTubeVideoDuration };
