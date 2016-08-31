import mainHTML from './text/main.html!text';
import share from './lib/share';
import {pimpYouTubePlayer, getYouTubeVideoDuration} from './lib/youtube';
import sheetToDOM from './lib/sheettodom';

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');

export function init(el, context, config) {
    const builder = document.createElement('div');
    builder.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    sheetToDOM(config.sheetId, config.sheetName, builder, function callback(resp){
        [].slice.apply(builder.querySelectorAll('.interactive-share')).forEach(shareEl => {
            var network = shareEl.getAttribute('data-network');
            shareEl.addEventListener('click', () => shareFn(network));
        });
        const youTubeId = resp.sheets[config.sheetName][0].youTubeId;
        const chapters = resp.sheets[config.sheetChapter];

        getYouTubeVideoDuration(youTubeId, function(duration) {
            builder.querySelector('.docs__poster--play-button').setAttribute('data-duration', duration);
        });

        var hiddenDesc = builder.querySelector('.docs--standfirst-hidden');
        var showMoreBtn = builder.querySelector('.docs--standfirst-read-more');

        var hiddenAbout = builder.querySelector('.docs--about-wrapper');
        var showAboutBtn = builder.querySelector('.docs--sponsor-aboutfilms');
        var hideAboutBtn = builder.querySelector('.docs--about-wrapper');

        var chapterButtons = builder.querySelector('.docs--chapters');
        chapters.forEach( function(chapter){
          chapterButtons.innerHTML += '<li data-sheet-timestamp="'+ chapter.chapterTimestamp +'">' + chapter.chapterTitle + '</li>';
        });

        //Show the long description
        showMoreBtn.onclick = function(){
            hiddenDesc.classList.toggle('docs--show-longdesc');
        };

        //Show and hide the about these films overlay
        showAboutBtn.onclick = function(){
            hiddenAbout.classList.add('docs--show-about');
            console.log('eh?');
        };

        hideAboutBtn.onclick = function(){
            hideAboutBtn.classList.remove('docs--show-about');
        };


        // Show the trailer on click #docs__playTrailer
        const showTrailer = builder.querySelector('.docs__shows-trailer');
        showTrailer.onclick = () => {
            builder.querySelector('#interactive-container').classList.add('show-trailer');
        };

        // Hide the trailer
        const hideTrailerAll = builder.querySelectorAll('.docs__hides-trailer');
        [].forEach.call(hideTrailerAll, function(hideTrailer) {
            hideTrailer.onclick = () => {
                builder.querySelector('#interactive-container').classList.remove('show-trailer');
            };
        });


        pimpYouTubePlayer(youTubeId, builder.querySelector('#playerWrapper'), '100%', '100%', builder);
        el.parentNode.replaceChild(builder, el);
    });
}
