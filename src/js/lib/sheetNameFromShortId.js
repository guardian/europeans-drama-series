const DEFAULT_DOC = 'a-childhood-on-fire';

export default function sheetNameFromShortId(docsArray, shortUrl) {
    const map = new Map(docsArray);
    const docName = map.get(shortUrl);
    console.log(DEFAULT_DOC)

    // uncomment and just return DEFAULT_DOC
    // to test other docs locally
    // return DEFAULT_DOC;

    return docName ? docName : DEFAULT_DOC;

}
