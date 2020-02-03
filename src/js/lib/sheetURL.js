export default function sheetURL(sheetID) {
    var protocol = window.location.protocol === 'file:' ? 'https://' : '//';
    var type = (window.location.hostname == 'localhost' ? 'docsdata-test' : 'docsdata');
    return `${protocol}interactive.guim.co.uk/${type}/${sheetID}.json`;
}
