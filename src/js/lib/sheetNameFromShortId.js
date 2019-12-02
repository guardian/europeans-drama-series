const DEFAULT_DOC = 'lost-rambos';

export default function sheetNameFromShortId(docsArray, shortUrl) {
    const map = new Map(docsArray);
    const docName = map.get(shortUrl);
    console.log("hihihihhihi")
    console.log("hihihihhihi")
    console.log(DEFAULT_DOC)
    console.log("hihihihhihi")
    console.log("hihihihhihi")

    // uncomment and just return DEFAULT_DOC
    // to test other docs locally
    // return DEFAULT_DOC;

    return docName ? docName : DEFAULT_DOC;

}
