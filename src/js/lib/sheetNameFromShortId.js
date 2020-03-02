const DEFAULT_DOC = 'france';
// const DEFAULT_DOC = 'poland';
// const DEFAULT_DOC = 'uk';
// const DEFAULT_DOC = 'spain';
// const DEFAULT_DOC = 'germany';
// const DEFAULT_DOC = 'sweden';
// const DEFAULT_DOC = 'ireland';

export default function sheetNameFromShortId(docsArray, shortUrl) {
    const map = new Map(docsArray);
    const docName = map.get(shortUrl);

    if (window.location.hostname == 'localhost') {
        return DEFAULT_DOC;
    } else {
        return docName ? docName : DEFAULT_DOC;
    }

}
