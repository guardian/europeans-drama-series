/*globals YT*/
import youTubeIframe from 'youtube-iframe-player';
import reqwest from 'reqwest';

export function pimpYouTubePlayer(videoId, node, height, width, chapters) {
    youTubeIframe.init(function() {
        //preload youtube iframe API
        const promise = new Promise(function(resolve) {
            var youTubePlayer = youTubeIframe.createPlayer(node.querySelector('#ytGuPlayer'), {
                height: height,
                width: width,
                videoId: videoId,
                playerVars: { 'autoplay': 0, 'controls': 1 },
                events: {
                    'onReady': function(){
                        resolve(youTubePlayer);
                    },
                    'onStateChange': function(event){
                        let chapTimer;
                        if (event.data == YT.PlayerState.PLAYING){

                            const playerTotalTime = youTubePlayer.getDuration();
                            chapTimer = setInterval(function() {
                                const playerCurrentTime = youTubePlayer.getCurrentTime();
                                const currentChapter = chapters.filter(function(value){
                                    const chapStart = value.chapterTimestamp;
                                    const chapNext = value.nextChapter || playerTotalTime;
                                    if(playerCurrentTime >= chapStart && playerCurrentTime <= chapNext){
                                        return value;
                                    }
                                });
                                if (currentChapter.length === 1){
                                    const chapterAll = [].slice.call(document.querySelectorAll('li[data-sheet-timestamp]'));
                                    chapterAll.forEach(function(el){
                                        if (el.dataset.sheetTimestamp === currentChapter[0].chapterTimestamp){
                                            el.classList.add('docs--chapters-active');
                                            el.classList.remove('docs--chapters-inactive');
                                        } else {
                                            el.classList.add('docs--chapters-inactive');
                                            el.classList.remove('docs--chapters-active');
                                        }
                                    });
                                }
                            },1000);
                        } else {
                            clearTimeout(chapTimer);
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
}

function performPlayActions(videoExpand, youTubePlayer, posterHide) {
    videoExpand.classList.add('docs__poster--wrapper--playing');
    scrollTo(document.body, 0, 300);
    youTubePlayer.playVideo();
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
            callback(duration.replace(re,'$1:$2'));
        }
    });
}
export { pimpYouTubePlayer, getYouTubeVideoDuration };
