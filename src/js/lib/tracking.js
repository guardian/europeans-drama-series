import events from 'events';

class Tracker {
    buildOphanEventObject(event) {
        return {
            video: {
                id: this.trackingId,
                eventType: `video:content:${event}`
            }
        };
    }

    buildGoogleAnalyticsEventObject(event) {
        // copy `baseEventObject`
        const eventObject = Object.assign({}, this.googleAnalyticsProperties.baseEventObject);
        eventObject[this.googleAnalyticsProperties.metricMap[event]] = 1;
        return eventObject;
    }

    track(property) {
        this.emitter.emit(property);
    }

    constructor(properties) {
        const self = this;

        self.videoId = properties.videoId;

        self.trackingId = `gu-video-youtube-${this.videoId}`;

        self.emitter = new events.EventEmitter();

        //`metricMap` lifted from frontend
        //see: https://github.com/guardian/frontend/blob/master/static/src/javascripts/projects/common/modules/video/events.js#L144-L151
        self.googleAnalyticsProperties = {
            metricMap: {
                'play': 'metric1',
                'skip': 'metric2',
                '25': 'metric3',
                '50': 'metric4',
                '75': 'metric5',
                'end': 'metric6'
            },
            baseEventObject: {
                eventCategory: 'Media',
                eventAction: 'video content',
                eventLabel: window.location.pathname,
                dimension19: self.trackingId,
                dimension20: 'guardian-youtube'
            }
        };

        self.ga = !!window.ga && window.ga;
        self.gaTracker = !!properties.gaTrackers.editorial && properties.gaTrackers.editorial;

        const eventList = ['play', '25', '50', '75', 'end'];

        eventList.forEach(event => self.emitter.once(event, () => {
            const ophanEventObject = self.buildOphanEventObject(event);
            ophanRecord(ophanEventObject);

            if (self.ga) {
                const googleAnalyticsEventObject = self.buildGoogleAnalyticsEventObject(event);
                googleAnalyticsRecord(googleAnalyticsEventObject);
            }
        }));

        function ophanRecord(eventObject) {
            require(['ophan/ng'], (ophan) => ophan.record(eventObject));
        }

        function googleAnalyticsRecord(eventObject) {
            const send = `${self.gaTracker}.send`;
            self.ga(send, 'event', eventObject);
        }
    }
}

export default Tracker;
