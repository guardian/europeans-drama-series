import mainHTML from './text/main.html!text';
import {PimpedYouTubePlayer, getYouTubeVideoDuration} from './lib/youtube';
import share from './lib/share';
import sheetToDomInnerHtml from './lib/sheettodom';
import emailsignupURL from './lib/emailsignupURL';
import {setAttributes, setData, setStyles} from './lib/dom';

function initChapters(rootEl, config, chapters) {
    chapters.sort((a,b) => parseInt(a.chapterTimestamp) - parseInt(b.chapterTimestamp));

    chapters.forEach(function(chapter, index){
        chapter.start = parseInt(chapter.chapterTimestamp);
        if(chapters.length > index+1){
            const nextChapter = chapters[index+1];
            chapter.end = parseInt(nextChapter.chapterTimestamp);
        }
    });

    const compressString = (str) => str.replace(/[\s+|\W]/g, '').toLowerCase();

    const getDataLinkName = (title) => `${compressString(config.sheetChapter)} | ${title}`;

    const ul = document.createElement('ul');
    ul.classList.add('docs--chapters');

    chapters.forEach( function(chapter, index){
        const dataLinkName = getDataLinkName(chapter.chapterTitle);
        const li = document.createElement('li');

        setAttributes(li, {
            title: `Skip to chapter ${index+1}: ${chapter.chapterTitle}`
        });

        setData(li, {
            start: chapter.start,
            end: chapter.end,
            linkName: dataLinkName,
            role: 'chapter'
        });

        li.innerText = `${chapter.chapterTitle}`;

        const progress = document.createElement('span');
        progress.classList.add('progress');
        li.appendChild(progress);

        ul.appendChild(li);
    });

    const chaptersWrapper = rootEl.querySelector('.docs--chapters-wrapper');
    chaptersWrapper.appendChild(ul);
}

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
        initChapters(builder, config, chapters);

        getYouTubeVideoDuration(youTubeTrailerId, function(duration) {
            // builder.querySelector('.docs--actions__trailer__duration').textContent = duration;
        });

        getYouTubeVideoDuration(youTubeId, function(duration) {
            setData(builder.querySelector('.docs__poster--play-button'), {
                duration: duration
            });
        });

        const showAboutBtn = builder.querySelector('.docs--sponsor-aboutfilms');
        const hideAboutBtn = builder.querySelector('.docs--about-wrapper');
        const aboutBody = builder.querySelector('.docs--about-body');
        const hiddenDesc = builder.querySelector('.docs--standfirst-hidden');
        const showMoreBtn = builder.querySelector('.docs--standfirst-read-more');

        //Show the long description
        showMoreBtn.onclick = function(){
            hiddenDesc.classList.toggle('docs--show-longdesc');
        };

        //Show and hide the about these films overlay
        showAboutBtn.addEventListener('click', () => hideAboutBtn.classList.add('docs--show-about'));
        hideAboutBtn.addEventListener('click', () => hideAboutBtn.classList.remove('docs--show-about'));
        aboutBody.addEventListener('click', (e) => e.stopPropagation());

        const embedContainer = builder.querySelector('.doc-trailer__embed');

        const showTrailer = builder.querySelector('#shows-trailer');
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

        builder.querySelector('.docs__poster--loader').addEventListener('click', function() {
            const player = new PimpedYouTubePlayer(youTubeId, builder, '100%', '100%', chapters, config);
            player.play();
        });

        setStyles(builder.querySelector('.docs__poster--image'), {
            'background-image': `url('${resp.sheets[config.sheetName][0].backgroundImageUrl}')`
        });

        // setAttributes(builder.querySelector('.cutout'), {
        //     src: resp.sheets[config.sheetName][0].nextDocImageUrl
        // });

        el.parentNode.replaceChild(builder, el);
    });
}
