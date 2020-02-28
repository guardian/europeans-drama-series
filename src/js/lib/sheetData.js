import sheetUrl from './sheetURL';
import reqwest from 'reqwest';

const DEFAULT_SUPPORTED_DATA = {
    supportedBadgeUrl: 'https://uploads.guim.co.uk/2017/01/11/bertha-foundation-logo-grey.png',
    supportedSiteUrl: 'http://www.berthafoundation.org/',
    supportedInfo: `
        <p class="docs--about-headline">About the Guardian Bertha documentary partnership</p>
        <p>The Guardian is partnering with Bertha Foundation to tell international documentary film stories with global impact.</p>
        <p><a href='http://berthafoundation.org/'>Bertha Foundation</a> support activists, storytellers and lawyers who are working to bring about social and economic justice, and human rights for all.</p>
        <p>The Guardian and Bertha Foundation are commissioning a series of 12 short documentary films from independent filmmakers. The series covers global stories, with a focus on films that have the ability to advance the contemporary issues they address, and and raise awareness of people and movements who are catalysts for change.</p>
        <p>These documentaries help the Guardian audience to understand the world in creative, entertaining and surprising ways designed for a wide online audience. All documentaries are editorially independent and follow GNM's published editorial code.</p>
        <p>This unique collaboration involves the Guardian and Bertha Foundation engaging a network of film-makers with embedded access to, and deep knowledge of, the communities in which they are filming. The Guardian are delighted to be working with Bertha Foundation who have a track record of supporting documentary makers that make a significant difference in the world.</p>
        <p class="docs--about-legal">Unless otherwise stated, all statements and materials in these documentaries reflect the views of the individual documentary makers and not those of Bertha Foundation or the Guardian.</p>
    `
};

class DocumentaryMetadata {
    constructor({ sheetId, docName, comingSoonSheetName }) {
        this._sheetId = sheetId;
        this._docName = docName;
        this._comingSoonSheetName = comingSoonSheetName;
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

                    const linkedDocs = ['1', '2', '3', '4'].map((i) => {
                        const linkedDocName = metadata[`watchNext${i}`];
                        const linkedDocMetadata = resp.sheets.documentaries.find(_ => _.docName === linkedDocName);
                        if (linkedDocName && linkedDocMetadata) {
                            return linkedDocMetadata;
                        } else {
                            return undefined;
                        }
                    }).filter((doc) => {
                        return doc !== undefined;
                    });

                    // supported columns are optional in the sheet, use defaults if not set
                    Object.keys(DEFAULT_SUPPORTED_DATA).forEach(supportedKey => {
                        if (metadata[supportedKey] === '') {
                            metadata[supportedKey] = DEFAULT_SUPPORTED_DATA[supportedKey];
                        }
                    });

                    const comingSoon = resp.sheets[this._comingSoonSheetName];

                    this._docData = Object.assign(
                        {},
                        metadata,
                        { linkedDocs: linkedDocs },
                        { comingSoon: comingSoon }
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

    get isBertha() {
        // is a Bertha doc unless explicitly set to `FALSE` in the sheet
        return this.getField('isBertha') !== 'FALSE';
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

    get comingSoon() {
        return this.getField('comingSoon');
    }

    get comingNext() {
        return this.comingSoon[0];
    }

    get linkedDocs() {
        return this._docData.linkedDocs;
    }

    get onwardJourneyLinks() {
        return ['One', 'Two', 'Three', 'Four'].reduce((links, i) => {
            links.push({ position: i, jsonUrl: this.getField(`jsonSnap${i}`) });
            return links;
        }, []);
    }
}

export default DocumentaryMetadata;
