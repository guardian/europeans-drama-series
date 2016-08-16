import reqwest from 'reqwest'
import mainHTML from './text/main.html!text'
import share from './lib/share'
import {pimpYouTubePlayer, getYouTubeVideoDuration} from './lib/youtube'

var shareFn = share('Interactive title', 'http://gu.com/p/URL', '#Interactive');


export function init(el, context, config, mediator) {
    el.innerHTML = mainHTML.replace(/%assetPath%/g, config.assetPath);

    [].slice.apply(el.querySelectorAll('.interactive-share')).forEach(shareEl => {
        var network = shareEl.getAttribute('data-network');
        shareEl.addEventListener('click', () => shareFn(network));
    });

    pimpYouTubePlayer('-Gy7poRbUHY', 'ytGuPlayer', '100%', '100%');
    getYouTubeVideoDuration('-Gy7poRbUHY', function(duration) {
      el.querySelector('.docs__poster--play-button').setAttribute("data-duration", duration);
    })

    var hiddenDesc = el.querySelector('.docs--standfirst-longdesc');
    var showMoreBtn = el.querySelector('.docs--standfirst-read-more');

    var hiddenAbout = el.querySelector('.docs--about-wrapper');
    var showAboutBtn = el.querySelector('.docs--sponsor');
    var hideAboutBtn = el.querySelector('.docs--about-wrapper');

    showMoreBtn.onclick = function(){
        hiddenDesc.classList.toggle('docs--show-longdesc');
    };

    showAboutBtn.onclick = function(){
      hiddenAbout.classList.add('docs--show-about');
    };

    hideAboutBtn.onclick = function(){
      hideAboutBtn.classList.remove('docs--show-about');
    };

}
