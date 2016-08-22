import youTubeIframe from 'youtube-iframe-player'
import reqwest from 'reqwest'

export function pimpYouTubePlayer(videoId, node, height, width) {
    youTubeIframe.init(function() {
        //preload youtube iframe API
        node.addEventListener('click', function() {
            var youTubePlayer = youTubeIframe.createPlayer(node, {
                height: height,
                width: width,
                videoId: videoId,
                playerVars: { 'autoplay': 0, 'controls': 1 },
                events: {
                    'onReady': playerReady
                }
            });

            function playerReady(event) {
                youTubePlayer.playVideo();
            }
        });
    })
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
