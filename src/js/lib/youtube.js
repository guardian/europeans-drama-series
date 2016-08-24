import youTubeIframe from 'youtube-iframe-player'
import reqwest from 'reqwest'

export function pimpYouTubePlayer(videoId, node, height, width) {
    youTubeIframe.init(function() {
        //preload youtube iframe API
        node.querySelector('#ytGuPlayer').addEventListener('click', function() {
            var youTubePlayer = youTubeIframe.createPlayer(this, {
                height: height,
                width: width,
                videoId: videoId,
                playerVars: { 'autoplay': 0, 'controls': 1 },
                events: {
                    'onReady': playerReady
                }
            });

            node.classList.add('docs__poster--wrapper--playing');
            scrollTo(document.body, 0, 300);

            function playerReady(event) {
                youTubePlayer.playVideo();
            }
        });
    })
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
            callback(duration.replace(re,'$1:$2'))}
    });
}

export { pimpYouTubePlayer, getYouTubeVideoDuration };
