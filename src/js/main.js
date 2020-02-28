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
import DocumentaryMetadata from './lib/sheetData';

export function init(el, context, config) {
    const builder = document.createElement('div');
    builder.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    const docName = sheetNameFromShortId(config.docsArray, window.guardian.config.page.pageId);

    const docMetadata = new DocumentaryMetadata({
        sheetId: config.sheetId,
        docName: docName,
        comingSoonSheetName: config.comingSoonSheetName
    });

    docMetadata.getMetadata().then(docData => {
        sheetToDomInnerHtml({
            el: builder,
            docData: docData,
            comingSoonSheetName: config.comingSoonSheetName
        });

        const headline = window.guardian && window.guardian.config && window.guardian.config.page && window.guardian.config.page.headline;
        const shareText = headline || docData.title;
        const shareFn = share(shareText, window.location);

        Array.from(builder.querySelectorAll('.interactive-share')).forEach(shareEl => {
            const network = shareEl.getAttribute('data-network');
            shareEl.addEventListener('click', () => shareFn(network));
        });

        const hiddenDesc = builder.querySelector('#intro-expansion');
        const showMoreBtn = builder.querySelector('#intro-expand-btn');

        if (docData.isSupported) {
            new DocsSupporter({
                node: builder,
                docData: docData
            });
        }

        if (docData.isBertha) {
            DocsComingSoon.render({ node: builder });
        }

        //Show the long description
        showMoreBtn.onclick = function () {
            hiddenDesc.classList.toggle('expanded');
        };

        const emailIframe = builder.querySelector('.js-email-sub__iframe');

        setAttributes(emailIframe, {
            src: emailsignupURL(config.emailListId)
        });


        builder.querySelector('.docs__poster--loader').addEventListener('click', function () {
            const player = new PimpedYouTubePlayer(docData.youtubeId, builder, '100%', '100%', config);
            player.play();
        });


        setStyles(builder.querySelector('.docs__poster--image'), {
            'background-image': `url('${docData.backgroundImageUrl}')`
        });

        setStyles(builder.querySelector('.coming-soon-background'), {
            'background-image': `url('${docData.comingNext.image}')`
        });

        el.parentNode.replaceChild(builder, el);

        if (docData.linkedDocs.length > 0) {
            // use linkedDocs data to inject onward journey elements
            docData.linkedDocs.forEach((linkedDoc, i) => {
                const el = builder.querySelector(`section#more-documentaries .fc-slice__item:nth-child(${++i}) .nextSnap`);
                el.innerHTML = `<div class="doc-card"><img class="doc-card__poster" src="${linkedDoc.posterImage}"><div class="doc-card__meta"><p class="doc-card__description">${linkedDoc.logline}</p><a class="doc-card__link" href="${linkedDoc.fullLink}"></a></div></div>`;
            });
        } else {
            // Use legacy doc-cards snaps
            docData.onwardJourneyLinks.forEach(snapLink => {
                reqwest({
                    'url': snapLink.jsonUrl,
                    'type': 'json',
                    'crossOrigin': true,
                    'success': snapJSON => {
                        const el = builder.querySelector(`section#more-documentaries .nextSnap${snapLink.position}`);
                        el.innerHTML = snapJSON.html;
                    }
                });
            });
        }

        const autoplayReferrers = [
            /^https?:\/\/localhost:8000/,
            /^https?:\/\/.*.gutools.co.uk/,
            /^https?:\/\/m.code.dev-theguardian.com/,
            /^https?:\/\/www.theguardian.com/
        ];


        const shouldAutoPlay = autoplayReferrers.find(ref => ref.test(document.referrer));

        builder.querySelector('.docs__poster--loader').addEventListener('click', function () {
            const player = new PimpedYouTubePlayer(docData.youtubeId, builder, '100%', '100%', config);
            player.play();
        });

        let autoplayTimeout;

        if (shouldAutoPlay && !isMobile()) {
            builder.querySelector('.docs__poster--title').classList.add('will-autoplay');
            autoplayTimeout = setTimeout(() => {
                builder.querySelector('.docs__poster--title').classList.remove('will-autoplay');
                const player = new PimpedYouTubePlayer(docData.youtubeId, builder, '100%', '100%', config);
                player.play();
            }, 6000);
        }

        builder.querySelector('.docs__poster--autoplay-stop-button').addEventListener('click', function (e) {
            e.stopPropagation();
            clearTimeout(autoplayTimeout);
            builder.querySelector('.docs__poster--title').classList.remove('will-autoplay');
            builder.querySelector('.docs__poster--title').classList.add('cancelled-autoplay');
        });
    });

    window.addEventListener('scroll', () => {
        const s = window.scrollY;
        const bodyHeight = document.querySelector('body').offsetHeight;
        const windowHeight = window.innerHeight;
        const faders = document.querySelectorAll('.should-fade-in');

        if (s === 0 && windowHeight < bodyHeight) {
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
