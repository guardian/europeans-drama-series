import sheetUrl from './sheetURL';
import reqwest from 'reqwest';
import startsWith from 'lodash.startswith';


export function sheetToDomInnerHtml({sheetId, docName, el, comingSoonSheetName}) {

    const sheet = sheetUrl(sheetId);

    return new Promise((resolve, reject) => {
        reqwest({
            'url': sheet,
            'type': 'json',
            'crossOrigin': true,
            'success': resp => {
                //get list of elements with data-sheet-attribute
                Array.from(el.querySelectorAll('[data-sheet-attribute]')).forEach(node => {
                    const field = node.getAttribute('data-sheet-attribute');

                    if(startsWith(field, `${comingSoonSheetName}-`)){
                        node.innerHTML = resp.sheets[comingSoonSheetName][0][field.split(`${comingSoonSheetName}-`)[1]];
                    }
                    else {
                        const docData = resp.sheets.documentaries.find(_ => _.docName === docName);
                        node.innerHTML = docData[field];
                    }
                });

                resolve(resp);
            },
            'error': err => reject(err)
        });
    });

}

export default sheetToDomInnerHtml;
