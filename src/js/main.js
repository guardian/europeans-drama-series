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
          chapterButtons.innerHTML += '<li class="" data-sheet-attribute="'+ chapter.chapterTimestamp +'">' + chapter.chapterTitle + '</li>';
        });

        showMoreBtn.onclick = function(){
            hiddenDesc.classList.toggle('docs--show-hidden');
        };

        showAboutBtn.onclick = function(){
            hiddenAbout.classList.add('docs--show-about');
        };

        hideAboutBtn.onclick = function(){
            hideAboutBtn.classList.remove('docs--show-about');
        };
        pimpYouTubePlayer(youTubeId, builder.querySelector('#playerWrapper'), '100%', '100%', builder);
        el.parentNode.replaceChild(builder, el);
    });
}
