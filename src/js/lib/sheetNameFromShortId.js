const DEFAULT_DOC = 'crisanto-street';

export default function sheetNameFromShortId(docsArray, shortUrl) {
    const map = new Map(docsArray);
    const docName = map.get(shortUrl);
    return docName ? docName : DEFAULT_DOC;
}
