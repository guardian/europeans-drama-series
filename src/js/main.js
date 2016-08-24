import mainHTML from './text/main.html!text'
import share from './lib/share'
import {pimpYouTubePlayer, getYouTubeVideoDuration} from './lib/youtube'
import sheetToDOM from './lib/sheettodom'

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');


export function init(el, context, config, mediator) {
const builder = document.createElement('div');
builder.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    sheetToDOM('1NcSvccw77rHAncarwfeq7RGZF7yez9mP1Icf3oLMA7g', config.sheetName, builder, function callback(){
        [].slice.apply(builder.querySelectorAll('.interactive-share')).forEach(shareEl => {
            var network = shareEl.getAttribute('data-network');
            shareEl.addEventListener('click', () => shareFn(network));
        });

        getYouTubeVideoDuration('-Gy7poRbUHY', function(duration) {
            builder.querySelector('.docs__poster--play-button').setAttribute("data-duration", duration);
        });

        pimpYouTubePlayer('-Gy7poRbUHY', builder.querySelector('#ytGuPlayer'), '100%', '100%');

        var hiddenDesc = builder.querySelector('.docs--standfirst-longdesc');
        var showMoreBtn = builder.querySelector('.docs--standfirst-read-more');

        var hiddenAbout = builder.querySelector('.docs--about-wrapper');
        var showAboutBtn = builder.querySelector('.docs--sponsor');
        var hideAboutBtn = builder.querySelector('.docs--about-wrapper');

        showMoreBtn.onclick = function(){
            hiddenDesc.classList.toggle('docs--show-longdesc');
        };

        showAboutBtn.onclick = function(){
            hiddenAbout.classList.add('docs--show-about');
        };

        hideAboutBtn.onclick = function(){
            hideAboutBtn.classList.remove('docs--show-about');
        };

        el.parentNode.replaceChild(builder, el);
    })

}
