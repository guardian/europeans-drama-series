const DEFAULT_DOC = 'where-the-river-runs-red';

export default function sheetNameFromShortId(docsArray, shortUrl) {
    const map = new Map(docsArray);
    const docName = map.get(shortUrl);
    return docName ? docName : DEFAULT_DOC;
}
