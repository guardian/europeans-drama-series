import sheetUrl from './sheetURL';
import reqwest from 'reqwest';


class DocumentaryMetadata {
    constructor({ sheetId, docName }) {
        this._sheetId = sheetId;
        this._docName = docName;
    }

    getMetadata() {
        const url = sheetUrl(this._sheetId);

        return new Promise((resolve, reject) => {
            reqwest({
                url: url,
                type: 'json',
                crossOrigin: true,
                success: resp => {
                    const metadata = resp.sheets.documentaries.find(_ => _.docName === this._docName);

                    if (!metadata && window.console) {
                        // eslint-disable-next-line no-console
                        console.warn(`Unable to find sheet data for ${this._docName}`);
                    }

                    this._docData = Object.assign(
                        {},
                        metadata
                    );

                    resolve(this);
                },
                error: err => reject(err)
            });
        });
    }

    getField(field) {
        if (this._docData) {
            return this._docData[field];
        }
    }

    get title() {
        return this.getField('title');
    }

    get shortDescription() {
        return this.getField('shortDecription');
    }

    get longDescription() {
        return this.getField('longDescription');
    }

    get youtubeId() {
        return this.getField('youTubeId');
    }

    get credits() {
        return this.getField('credits');
    }

    get docDate() {
        return this.getField('docDate');
    }

    get backgroundImageUrl() {
        return this.getField('backgroundImageUrl');
    }

    get isSupported() {
        // is supported unless explicitly set to `FALSE` in the sheet
        return this.getField('showSupported') !== 'FALSE';
    }

    get supportedBadgeUrl() {
        return this.getField('supportedBadgeUrl');
    }

    get supportedSiteUrl() {
        return this.getField('supportedSiteUrl');
    }

    get supportedInfo() {
        return this.getField('supportedInfo');
    }

}

export default DocumentaryMetadata;
