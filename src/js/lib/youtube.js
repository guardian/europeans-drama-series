/*globals YT*/
import youTubeIframe from 'youtube-iframe-player';
import reqwest from 'reqwest';
import events from 'events';

const emitter = new events.EventEmitter();

function pimpYouTubePlayer(videoId, node, height, width, chapters) {

    function initEvents() {

        const eventList = ['play', '25', '50', '75', 'end'];

        eventList.forEach(e => emitter.once(e, () => ophanRecord(e)));

        function ophanRecord(event) {
            require(['ophan/ng'], function (ophan) {
                var eventObject = {
                    video: {
                        id: 'gu-video-youtube-' + videoId,
                        eventType: 'video:content:' + event
                    }
                };
                ophan.record(eventObject);
            });
        }
    }

    initEvents();

    youTubeIframe.init(function() {
        //preload youtube iframe API
        const promise = new Promise(function(resolve) {
            var youTubePlayer = youTubeIframe.createPlayer(node.querySelector('#ytGuPlayer'), {
                height: height,
                width: width,
                videoId: videoId,
                playerVars: { 'autoplay': 0, 'controls': 1, 'rel': 0 },
                events: {
                    'onReady': function(){
                        resolve(youTubePlayer);
                    },
                    'onStateChange': function(event){
                        let playTimer;
                        if (event.data == YT.PlayerState.PLAYING) {

                            const playerTotalTime = youTubePlayer.getDuration();
                            playTimer = setInterval(function() {
                                chapterTimer(youTubePlayer, playerTotalTime);
                                sendPercentageCompleteEvents(youTubePlayer, playerTotalTime);
                            }, 1000);
                        } else {
                            clearTimeout(playTimer);
                        }
                    }
                }
            });
        });

        promise.then(function(youTubePlayer) {
            addChapterEventHandlers(node, youTubePlayer);
            node.querySelector('.docs__poster--loader').addEventListener('click', function() {
                performPlayActions(node.querySelector('.docs__poster--wrapper'), youTubePlayer, this);
            });

            node.querySelector('.docs__shows-trailer').addEventListener('click', function() {
                youTubePlayer.pauseVideo();
            });
        });
    });


    function chapterTimer(youTubePlayer, playerTotalTime) {
        let chapterCurrentProgress;
        const playerCurrentTime = youTubePlayer.getCurrentTime();
        const currentChapter = chapters.filter(function(value){
            const chapStart = value.chapterTimestamp;
            const chapNext = value.nextChapter || playerTotalTime;
            if(playerCurrentTime >= chapStart && playerCurrentTime <= chapNext){
                chapterCurrentProgress = (playerCurrentTime-chapStart)/(chapNext-chapStart);
                return value;
            }
        });
        if (currentChapter.length === 1){
            const chapterAll = [].slice.call(document.querySelectorAll('li[data-sheet-timestamp]'));
            chapterAll.forEach(function(el){
                if (el.dataset.sheetTimestamp === currentChapter[0].chapterTimestamp){
                    el.classList.add('docs--chapters-active');
                    el.classList.remove('docs--chapters-inactive');
                    const progress = el.querySelector('.progress');
                    progress.style.width = `${chapterCurrentProgress*100}%`;
                } else {
                    el.classList.add('docs--chapters-inactive');
                    el.classList.remove('docs--chapters-active');
                }
            });
        }
    }

    function sendPercentageCompleteEvents(youTubePlayer, playerTotalTime) {
        const quartile = playerTotalTime / 4;

        const playbackEvents =
        {
            '25': quartile,
            '50': quartile * 2,
            '75': quartile * 3,
            'end': playerTotalTime
        };


        function* entries(obj) {
            for (let key of Object.keys(obj)) {
                yield [key, obj[key]];
            }
        }

        for (let [eventName, eventTrigger] of entries(playbackEvents)) {
            if (youTubePlayer.getCurrentTime() > eventTrigger) {
                emitter.emit(eventName);
            }
        }
    }
}

function performPlayActions(videoExpand, youTubePlayer, posterHide) {

    function isMobile() {
        function isIOS() {
            return /(iPad|iPhone|iPod touch)/i.test(navigator.userAgent);
        }

        function isAndroid() {
            return /Android/i.test(navigator.userAgent);
        }

        return isIOS() || isAndroid();
    }

    if (!isMobile()) {
        videoExpand.classList.add('docs__poster--wrapper--playing');
    }

    scrollTo(document.body, 0, 300);
    youTubePlayer.playVideo();
    emitter.emit('play');
    posterHide.classList.add('docs__poster--hide');
}


function addChapterEventHandlers(node, youTubePlayer) {
    const chapterBtns = [].slice.call(document.querySelectorAll('.docs--chapters li'));
    chapterBtns.forEach( function(chapterBtn) {
        chapterBtn.onclick = function(){
            const chapTime = parseInt(chapterBtn.getAttribute('data-sheet-timestamp'));
            performPlayActions(node.querySelector('.docs__poster--wrapper'), youTubePlayer, node.querySelector('.docs__poster--loader'));
            youTubePlayer.seekTo(chapTime, true);
        };
    });
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;

    setTimeout(() => {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

function getYouTubeVideoDuration(videoId, callback){
    //Note: This is a browser key intended to be exposed on the client-side.
    const apiKey = 'AIzaSyCtM2CJsgRhfXVj_HesBIs540tzD4JUXqc';

    reqwest({
        url: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=' + videoId + '&key=' + apiKey,
        type: 'json',
        crossOrigin: true,
        success: (resp) => {
            let duration =  resp.items[0].contentDetails.duration;
            let re = /PT(\d+)M(\d+)S/;
            callback(duration.replace(re,function(match, p1, p2) {
                function numberToTwoDigits(number) {
                    return (number < 10 ? '0' : '') + number;
                }
                return `${p1}:${numberToTwoDigits(p2)}`;
            }));
        }
    });
}
export { pimpYouTubePlayer, getYouTubeVideoDuration };
