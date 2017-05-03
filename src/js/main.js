import mainHTML from './text/main.html!text';
import { PimpedYouTubePlayer } from './lib/youtube';
import share from './lib/share';
import sheetToDomInnerHtml from './lib/sheettodom';
import emailsignupURL from './lib/emailsignupURL';
import { setAttributes, setData, setStyles } from './lib/dom';
import { isMobile } from './lib/detect';
import sheetNameFromShortId from './lib/sheetnamefromshortid';
import reqwest from 'reqwest';
import DocsSupporter from './lib/docs-supporter';
import DocsComingSoon from './lib/docs-coming-soon';

function initChapters(rootEl, chapters, chapterSheetName) {
    chapters.sort((a, b) => parseInt(a.chapterTimestamp) - parseInt(b.chapterTimestamp));

    chapters.forEach(function(chapter, index) {
        chapter.start = parseInt(chapter.chapterTimestamp);
        if (chapters.length > index + 1) {
            const nextChapter = chapters[index + 1];
            chapter.end = parseInt(nextChapter.chapterTimestamp);
        }
    });

    const compressString = (str) => str.replace(/[\s+|\W]/g, '').toLowerCase();

    const getDataLinkName = (chapterSheetName, title) => `${compressString(chapterSheetName)} | ${title}`;

    const ul = document.createElement('ul');
    ul.classList.add('docs--chapters');

    chapters.forEach(function(chapter, index) {
        const dataLinkName = getDataLinkName(chapterSheetName, chapter.chapterTitle);
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

    const sheetName = sheetNameFromShortId(config.docsArray, window.guardian.config.page.pageId);
    sheetToDomInnerHtml(config.sheetId, sheetName, builder, config.comingSoonSheetName, function callback(resp) {
        const sheetValues = resp.sheets[sheetName][0]; // TODO refactor all instances of `resp.sheets[sheetName][0]` to use this `const`
        
        const headline = window.guardian && window.guardian.config && window.guardian.config.page && window.guardian.config.page.headline;
        const shareText = headline || resp.sheets[sheetName][0].title;
        const shareFn = share(shareText, window.location);

        Array.from(builder.querySelectorAll('.interactive-share')).forEach(shareEl => {
            const network = shareEl.getAttribute('data-network');
            shareEl.addEventListener('click', () => shareFn(network));
        });


        const youTubeId = resp.sheets[sheetName][0].youTubeId;
        const chaptersSheetName = `${sheetName}-chapters`;
        const chaptersResp = resp.sheets[chaptersSheetName];
        initChapters(builder, chaptersResp, chaptersSheetName);

        const hiddenDesc = builder.querySelector('#intro-expansion');
        const showMoreBtn = builder.querySelector('#intro-expand-btn');

        // show the supported section unless explicitly set to `FALSE` in the sheet
        if (sheetValues.showSupported !== 'FALSE') {
            new DocsSupporter({
                node: builder,
                badgeUrl: sheetValues.supportedBadgeUrl,
                siteUrl: sheetValues.supportedSiteUrl,
                info: sheetValues.supportedInfo
            });
        }

        // show the Bertha coming soon message unless explicitly set to `FALSE` in the sheet
        if (sheetValues.isBertha !== 'FALSE') {
            DocsComingSoon.render({node: builder});
        }

        //Show the long description
        showMoreBtn.onclick = function() {
            hiddenDesc.classList.toggle('expanded');
        };

        const emailIframe = builder.querySelector('.js-email-sub__iframe');

        setAttributes(emailIframe, {
            src: emailsignupURL(config.emailListId)
        });


        builder.querySelector('.docs__poster--loader').addEventListener('click', function() {
            const player = new PimpedYouTubePlayer(youTubeId, builder, '100%', '100%', chaptersResp, config);
            player.play();
        });


        setStyles(builder.querySelector('.docs__poster--image'), {
            'background-image': `url('${resp.sheets[sheetName][0].backgroundImageUrl}')`
        });

        setStyles(builder.querySelector('.coming-soon-background'), {
            'background-image': `url('${resp.sheets[config.comingSoonSheetName][0].image}')`
        });

        el.parentNode.replaceChild(builder, el);

        const snapLinks = ['One', 'Two', 'Three', 'Four'];
        snapLinks.forEach((snapLink) => {
            const jsonURL = resp.sheets[sheetName][0]['jsonSnap' + snapLink];
            reqwest({
                'url': jsonURL,
                'type': 'json',
                'crossOrigin': true,
                'success': snapJSON => {
                    const el = builder.querySelector('section#more-documentaries .nextSnap' + snapLink);
                    el.innerHTML = snapJSON.html;
                }
            });
        });

        const autoplayReferrers = [
            /^https?:\/\/localhost:8000/,
            /^https?:\/\/.*.gutools.co.uk/,
            /^https?:\/\/m.code.dev-theguardian.com/,
            /^https?:\/\/www.theguardian.com/
        ];


        const shouldAutoPlay = autoplayReferrers.find(ref => ref.test(document.referrer));

        builder.querySelector('.docs__poster--loader').addEventListener('click', function() {
            const player = new PimpedYouTubePlayer(youTubeId, builder, '100%', '100%', chaptersResp, config);
            player.play();
        });

        let autoplayTimeout;

        if (shouldAutoPlay && !isMobile()) {
            builder.querySelector('.docs__poster--title').classList.add('will-autoplay');
            autoplayTimeout = setTimeout(()=> {
                builder.querySelector('.docs__poster--title').classList.remove('will-autoplay');
                const player = new PimpedYouTubePlayer(youTubeId, builder, '100%', '100%', chaptersResp, config);
                player.play();
            }, 6000);
        }

        builder.querySelector('.docs__poster--autoplay-stop-button').addEventListener('click', function(e) {
            e.stopPropagation();
            clearTimeout(autoplayTimeout);
            builder.querySelector('.docs__poster--title').classList.remove('will-autoplay');
            builder.querySelector('.docs__poster--title').classList.add('cancelled-autoplay');
        });

    });

    window.addEventListener('scroll', ()=> {
        const s = window.scrollY;
        const bodyHeight = document.querySelector('body').offsetHeight;
        const windowHeight = window.innerHeight;
        const faders = document.querySelectorAll('.should-fade-in');

        if (s===0 && windowHeight<bodyHeight) {
            for (let i = 0; i < faders.length; i++) {
                faders[i].classList.remove('fade-in');
            }
        } else {
            for (let i = 0; i < faders.length; i++) {
                faders[i].classList.add('fade-in');
            }
        }
    });

}
