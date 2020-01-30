export default function sheetURL(sheetID) {
  var protocol = window.location.protocol === 'file:' ? 'https://' : '//';
  if (window.location.hostname == 'localhost') {
    var type = 'docsdata-test';
  } else {
    var type = 'docsdata';
  }
  return `${protocol}interactive.guim.co.uk/${type}/${sheetID}.json`;
}
