'use strict';
define([], function () {
    function addCSS(url) {
        var head = document.querySelector('head');
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', url);
        head.appendChild(link);
    }

    return {
        boot: function (el, context, config, mediator) {

            // Loading message while we fetch JS / CSS
            el.innerHTML = '<div style="font-size: 24px; text-align: center; padding: 72px 0; font-family: \'Guardian Headline\',\'Guardian Egyptian Web\',Georgia,serif;">Loading…</div>';

            var interactiveConfig = {
                'assetPath': '<%= assetPath %>',
                'sheetId': '1AVhJxgRIiVrwURZui6Aj9oGge3mEjtkTalYivYxa7LQ',
                'docsArray':
                    [
                        ['world/ng-interactive/2020/mar/02/europeans-borders-by-jakub-zulczyk-starring-jacek-koman', 'poland'],
                        ['world/ng-interactive/2020/mar/02/europeans-terra-firma-by-blanca-domenech-starring-paula-iwasaki', 'spain'],
                        ['world/ng-interactive/2020/mar/02/europeans-top-of-the-class-by-jonas-jonasson-starring-viktor-akerblom', 'sweden'],
                        ['world/ng-interactive/2020/mar/02/europeans-neanderthal-by-marius-von-mayenburg-starring-robert-beyer', 'germany'],
                        ['world/ng-interactive/2020/mar/02/europeans-one-right-answer-by-alice-zeniter-starring-sabrina-ouazani', 'france'],
                        ['world/ng-interactive/2020/mar/02/europeans-fake-tan-by-lisa-mcinerney-starring-evanna-lynch', 'ireland'],
                        ['world/ng-interactive/2020/mar/02/europeans-dim-sum-by-clint-dyer-starring-javone-prince', 'uk']

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
            if (!interactiveConfig.googleAnalytics) {
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
            window.setTimeout(function () {
                addCSS('<%= assetPath %>/main.css');
            }, 10);

            // Load JS and init
            if (typeof require === 'undefined' && typeof curl !== 'undefined') {
                window.require = curl;
            }

            require(['<%= assetPath %>/main.js'], function (main) {
                main.init(el, context, interactiveConfig, mediator);
            }, function (err) { console.error('Error loading boot.', err); });
        }
    };
});
