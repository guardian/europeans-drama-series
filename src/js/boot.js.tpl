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
                  ["world/ng-interactive/2017/jul/14/pitching-up-ancient-sports-for-children-in-irelands-most-ethnically-diverse-town", "pitching-up"],
                  ["us-news/ng-interactive/2017/aug/04/dearborn-michigan-divided-muslim-american-donald-trump-documentary", "dearborn-michigan"],
                  ["world/ng-interactive/2017/sep/07/second-innings-how-cricket-is-helping-three-afghan-boys-build-a-new-life-in-london", "second-innings"],
                  ["world/ng-interactive/2017/sep/22/qandeel-baloch-the-life-death-and-impact-of-pakistans-working-class-icon", "qandeel"],
                  ["world/ng-interactive/2017/oct/06/home-match-a-young-ukrainian-woman-torn-between-football-and-family", "home-match"],
                  ["world/ng-interactive/2017/oct/27/muxes-documentary-the-mexican-town-where-gender-is-fluid", "muxes"],
                  ["world/ng-interactive/2017/nov/24/on-the-road-living-and-working-on-the-italian-road-of-love", "on-the-road"],
                  ["world/ng-interactive/2017/dec/15/killing-gavle-swedish-city-40ft-goat-battle-for-the-spirit-of-christmas", "killing-gavle"],
                  ["world/ng-interactive/2018/feb/02/pork-crackling-wifi-parks-havana-hotspot-conectifai-documentary", "conectifai"],
                  ["artanddesign/ng-interactive/2018/mar/02/how-to-make-a-pearl-the-san-francisco-man-who-lives-in-darkness", "how-to-make-a-pearl"],
                  ["world/ng-interactive/2018/mar/13/white-fright", "white-fright"],
                  ["environment/ng-interactive/2018/apr/13/the-climate-and-the-cross-us-evangelical-christians-tussle-with-climate-change", "the-climate-and-the-cross"],
                  ["news/ng-interactive/2018/may/14/four-weddings-four-alternative-nuptials-to-harry-and-meghans-video", "four-weddings"],
                  ["society/ng-interactive/2018/jun/01/our-house-the-homeless-man-the-hippy-and-the-property-developer", "our-house"],
                  ["uk-news/ng-interactive/2018/jun/14/the-tower-next-door-living-in-the-shadow-of-grenfell", "the-tower-next-door"],
                  ["us-news/ng-interactive/2018/jun/29/the-trap-sex-trafficking-american-prisons", "the-trap"],
                  ["world/ng-interactive/2018/jul/20/white-fright-the-plot-to-attack-muslims-that-the-us-media-ignored", "white-fright"],
                  ["world/ng-interactive/2018/aug/03/little-pyongyang-a-north-korean-in-south-london", "little-pyongyang"],
                  ["uk-news/ng-interactive/2018/sep/21/silent-sam-the-mute-punk-singer-video", "silent-sam"],
                  ["us-news/ng-interactive/2018/jul/27/cops-and-robbers-corey-pegues-new-york-documentary-video", "cops-and-robbers"],
                  ["news/ng-interactive/2018/oct/26/black-sheep-the-black-teenager-who-made-friends-with-racists-video", "black-sheep"],
                  ["world/ng-interactive/2018/oct/25/julians-wait-julian-cole-visiting-the-man-paralysed-after-police-incident-outside-a-nightclub-video", "julians-wait"],
                  ["news/ng-interactive/2018/nov/29/skip-day-high-school-friendship-and-everyday-racism-at-the-beach-in-florida-video", "skip-day"],
                  ["news/ng-interactive/2018/dec/18/crisanto-street-a-child-living-in-a-mobile-home-in-silicon-valley-video", "crisanto-street"],
                  ["world/ng-interactive/2018/dec/28/marielle-and-monica-the-lgbt-activists-resisting-bolsonaros-brazil", "marielle-and-monica"],
                  ["global/ng-interactive/2019/jan/04/fighting-shame", "fighting-shame"]
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
            if (typeof require !== 'undefined') {
                require(['<%= assetPath %>/main.js'], function(main) {
                    main.init(el, context, interactiveConfig, mediator);
                }, function(err) { console.error('Error loading boot.', err); });
            } else if (typeof curl !== 'undefined') {
                curl(['<%= assetPath %>/main.js'], function(main) {
                    main.init(el, context, interactiveConfig, mediator);
                }, function(err) { console.error('Error loading boot.', err); });
            }
        }
    };
});
