import startsWith from 'lodash.startswith';

export function sheetToDomInnerHtml({el, docData, comingSoonSheetName}) {
    Array.from(el.querySelectorAll('[data-sheet-attribute]')).forEach(node => {
        const field = node.getAttribute('data-sheet-attribute');

        if(startsWith(field, `${comingSoonSheetName}-`)){
            node.innerHTML = docData.comingNext[field.split(`${comingSoonSheetName}-`)[1]];
        }
        else {
            node.innerHTML = docData.getField(field);
        }
    });
}

export default sheetToDomInnerHtml;
