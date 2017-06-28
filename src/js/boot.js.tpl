'use strict';
define([], function() {
    function addCSS(url) {
        var head = document.querySelector('head');
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', url);
        head.appendChild(link);
    }

    return {
        boot: function(el, context, config, mediator) {

            // Loading message while we fetch JS / CSS
            el.innerHTML = '<div style="font-size: 24px; text-align: center; padding: 72px 0; font-family: \'Guardian Egyptian Web\',Georgia,serif;">Loading…</div>';

            var interactiveConfig = {
                'assetPath': '<%= assetPath %>',
                'comingSoonSheetName': 'coming-soon',
                'sheetId': '1jYb4okCk7I42wCoduH-o48DE-EKGajM8w-MTxQYxmck',
                'docsArray':
                [
                  ["world/ng-interactive/2016/sep/16/gun-nation-a-journey-to-the-heart-of-americas-gun-culture-video", "gun-nation"],
                  ["world/ng-interactive/2016/oct/14/desert-fire-the-world-cup-rebels-of-kurdistan-video", "desert-fire"],
                  ["world/ng-interactive/2017/jan/06/radical-brownies-berets-badges-and-social-justice-video", "radical-brownies"],
                  ["world/ng-interactive/2017/feb/10/quipu-the-phone-line-calling-for-justice-in-peru-video", "quipu"],
                  ["world/ng-interactive/2017/mar/10/the-internet-warriors-meet-the-trolls-in-their-own-homes-video", "the-internet-warriors"],
                  ["technology/ng-interactive/2017/apr/07/meet-erica-the-worlds-most-autonomous-android-video", "erica-man-made"],
                  ["sport/ng-interactive/2017/may/12/the-sprinters-factory-the-tournament-where-girls-compete-to-be-jamaicas-next-top-sprinters", "the-sprinter-factory"],
                  ["world/ng-interactive/2017/apr/28/the-valley-rebels-the-french-farmer-helping-refugees-cross-europe-video", "the-valley-rebels"],
                  ["world/ng-interactive/2017/apr/13/crossing-boundaries-crabs-asylum-seekers-and-therapy-on-christmas-island-video", "the-island"],
                  ["world/ng-interactive/2017/may/05/fighting-for-a-pension-disability-rights-protesters-in-bolivia-face-barricades", "the-fight"],
                  ["world/ng-interactive/2017/jun/16/chalk-girl-hong-kong-democracy-umbrella-movement-protester-china", "the-infamous-chalk-girl"],
                  ["film/ng-interactive/2017/jun/30/fish-story-anglesey-video-fish-surnames", "fish-story"],
                  ["global/ng-interactive/2017/jun/28/pitching-up-documentary", "pitching-up"]
                  
                ],
                'emailListId': 3745
            };

            if (config) {
                if (typeof Object.assign != 'function') {
                  (function () {
                    Object.assign = function (target) {
                      'use strict';
                      // We must check against these specific cases.
                      if (target === undefined || target === null) {
                        throw new TypeError('Cannot convert undefined or null to object');
                      }

                      var output = Object(target);
                      for (var index = 1; index < arguments.length; index++) {
                        var source = arguments[index];
                        if (source !== undefined && source !== null) {
                          for (var nextKey in source) {
                            if (source.hasOwnProperty(nextKey)) {
                              output[nextKey] = source[nextKey];
                            }
                          }
                        }
                      }
                      return output;
                    };
                  })();
                }

                Object.assign(interactiveConfig, config);
            }

            //lifted from frontend
            //see: https://github.com/guardian/frontend/blob/master/common/app/views/support/GoogleAnalyticsAccount.scala
            if (! interactiveConfig.googleAnalytics) {
                Object.assign(interactiveConfig, {
                    googleAnalytics: {
                        trackers: {
                            editorial: 'allEditorialPropertyTracker',
                            editorialProd: 'allEditorialPropertyTracker',
                            editorialTest: 'guardianTestPropertyTracker'
                        }
                    }
                });
            }

            // Load CSS asynchronously
            window.setTimeout(function() {
                addCSS('<%= assetPath %>/main.css');
            }, 10);

            // Load JS and init
            require(['<%= assetPath %>/main.js'], function(main) {
                main.init(el, context, interactiveConfig, mediator);
            }, function(err) { console.error('Error loading boot.', err); });
        }
    };
});
