import events from 'events';

class Tracker {
    static getEventObject(videoId, event) {
        return {
            video: {
                id: `gu-video-youtube-${videoId}`,
                eventType: `video:content:${event}`
            }
        };
    }

    track (property) {
        this.emitter.emit(property);
    }

    constructor(properties) {
        this.videoId = properties.videoId;

        this.emitter = new events.EventEmitter();

        const eventList = ['play', '25', '50', '75', 'end'];

        eventList.forEach(event => this.emitter.once(event, () => {
            const eventObject = Tracker.getEventObject(this.videoId, event);
            ophanRecord(eventObject);
        }));

        function ophanRecord(eventObject) {
            require(['ophan/ng'], (ophan) => ophan.record(eventObject));
        }
    }
}

export default Tracker;
