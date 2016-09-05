import mainHTML from './text/main.html!text';
import {pimpYouTubePlayer, getYouTubeVideoDuration} from './lib/youtube';
import share from './lib/share';
import sheetToDOM from './lib/sheettodom';
import emailsignupURL from './lib/emailsignupURL';

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
        const youTubeTrailerId = resp.sheets[config.sheetName][0].youTubeTrailerId;
        const chapters = resp.sheets[config.sheetChapter];

        chapters.sort((a,b) => parseInt(a.chapterTimestamp) - parseInt(b.chapterTimestamp));

        chapters.forEach(function(chapter, index){
          if(chapters.length > index+1){
            const nextChapter = chapters[index+1];
            chapter.nextChapter = parseInt(nextChapter.chapterTimestamp) - 1;
          }
        });

        getYouTubeVideoDuration(youTubeTrailerId, function(duration) {
            builder.querySelector('.docs--actions__trailer__duration').textContent = duration;
        });

        getYouTubeVideoDuration(youTubeId, function(duration) {
            builder.querySelector('.docs__poster--play-button').setAttribute('data-duration', duration);
        });

        const hiddenAbout = builder.querySelector('.docs--about-wrapper');
        const showAboutBtn = builder.querySelector('.docs--sponsor-aboutfilms');
        const hideAboutBtn = builder.querySelector('.docs--about-wrapper');
        const hiddenDesc = builder.querySelector('.docs--standfirst-hidden');
        const showMoreBtn = builder.querySelector('.docs--standfirst-read-more');

        const chapterButtons = builder.querySelector('.docs--chapters');
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
        };

        hideAboutBtn.onclick = function(){
            hideAboutBtn.classList.remove('docs--show-about');
        };

        const embedContainer = builder.querySelector('.doc-trailer__embed');

        const showTrailer = builder.querySelector('.docs__shows-trailer');
        showTrailer.onclick = () => {
            builder.classList.add('show-trailer');
            embedContainer.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${youTubeTrailerId}?autoplay=1" frameborder="0" allowfullscreen class="doc-trailer__player"></iframe>`;
        };

        // Hide the trailer
        const hideTrailerAll = builder.querySelectorAll('.docs__hides-trailer');
        [].forEach.call(hideTrailerAll, function(hideTrailer) {
            hideTrailer.onclick = () => {
                builder.classList.remove('show-trailer');
                embedContainer.removeChild(builder.querySelector('.doc-trailer__player'))
            };
        });

        const emailIframe = builder.querySelector('.js-email-sub__iframe');
        emailIframe.setAttribute('src', emailsignupURL(config.emailListId));

        pimpYouTubePlayer(youTubeId, builder, '100%', '100%', chapters);
        el.parentNode.replaceChild(builder, el);
    });
}
