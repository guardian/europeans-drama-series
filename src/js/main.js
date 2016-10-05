import mainHTML from './text/main.html!text';
import {pimpYouTubePlayer, getYouTubeVideoDuration} from './lib/youtube';
import share from './lib/share';
import sheetToDomInnerHtml from './lib/sheettodom';
import emailsignupURL from './lib/emailsignupURL';
import setAttributes from './lib/dom';


export function init(el, context, config) {
    const builder = document.createElement('div');
    builder.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    sheetToDomInnerHtml(config.sheetId, config.sheetName, builder, function callback(resp){
        var shareFn = share(resp.sheets[config.sheetName][0].title, window.location);

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
            setAttributes(builder.querySelector('.docs__poster--play-button'), {
                'data-duration': duration
            });
        });

        const showAboutBtn = builder.querySelector('.docs--sponsor-aboutfilms');
        const hideAboutBtn = builder.querySelector('.docs--about-wrapper');
        const aboutBody = builder.querySelector('.docs--about-body');
        const hiddenDesc = builder.querySelector('.docs--standfirst-hidden');
        const showMoreBtn = builder.querySelector('.docs--standfirst-read-more');

        function compressString(string) {
            return string.replace(/[\s+|\W]/g, '').toLowerCase();
        }

        const chaptersWrapper = builder.querySelector('.docs--chapters-wrapper');
        const chaptersUl = document.createElement('ul');

        chapters.forEach( function(chapter, index){
            const chapterDataLinkName = `${compressString(config.sheetChapter)} | ${compressString(chapter.chapterTitle)}`;
            const chaptersLi = document.createElement('li');
            const chaptersLiProgress = document.createElement('span');
            chaptersLiProgress.classList.add('progress');
            chaptersUl.classList.add('docs--chapters');

            setAttributes(chaptersLi, {
                'data-sheet-timestamp': chapter.chapterTimestamp,
                'data-link-name': chapterDataLinkName,
                title: `Skip to chapter ${index+1}: ${chapter.chapterTitle}`
            });

            chaptersLi.innerText = `${chapter.chapterTitle}`;
            chaptersUl.appendChild(chaptersLi);
            chaptersLi.appendChild(chaptersLiProgress);
        });

        chaptersWrapper.appendChild(chaptersUl);

        //Show the long description
        showMoreBtn.onclick = function(){
            hiddenDesc.classList.toggle('docs--show-longdesc');
        };

        //Show and hide the about these films overlay
        showAboutBtn.addEventListener('click', () => hideAboutBtn.classList.add('docs--show-about'));
        hideAboutBtn.addEventListener('click', () => hideAboutBtn.classList.remove('docs--show-about'));
        aboutBody.addEventListener('click', (e) => e.stopPropagation());

        const embedContainer = builder.querySelector('.doc-trailer__embed');

        const showTrailer = builder.querySelector('.docs__shows-trailer');
        showTrailer.onclick = () => {
            builder.classList.add('show-trailer');
            const embedIframe = document.createElement('iframe');

            setAttributes(embedIframe, {
                width: '100%',
                height: '100%',
                src: `https://www.youtube.com/embed/${youTubeTrailerId}?autoplay=1&rel=0`,
                frameborder: '0',
                allowfullscreen: 'true'
            });

            embedIframe.classList.add('doc-trailer__player');
            embedContainer.appendChild(embedIframe);
        };

        // Hide the trailer
        const hideTrailerAll = builder.querySelectorAll('.docs__hides-trailer');
        [].forEach.call(hideTrailerAll, function(hideTrailer) {
            hideTrailer.onclick = () => {
                builder.classList.remove('show-trailer');
                embedContainer.removeChild(builder.querySelector('.doc-trailer__player'));
            };
        });

        const emailIframe = builder.querySelector('.js-email-sub__iframe');

        setAttributes(emailIframe, {
            src: emailsignupURL(config.emailListId)
        });

        pimpYouTubePlayer(youTubeId, builder, '100%', '100%', chapters);

        setAttributes(builder.querySelector('.docs__poster--image'), {
            style: {
                'background-image': `url('${resp.sheets[config.sheetName][0].backgroundImageUrl}')`
            }
        });

        setAttributes(builder.querySelector('.cutout'), {
            src: resp.sheets[config.sheetName][0].nextDocImageUrl
        });

        el.parentNode.replaceChild(builder, el);
    });
}
