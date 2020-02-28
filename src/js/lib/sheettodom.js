import startsWith from 'lodash.startswith';

export function sheetToDomInnerHtml({ el, docData }) {
    Array.from(el.querySelectorAll('[data-sheet-attribute]')).forEach(node => {
        const field = node.getAttribute('data-sheet-attribute');

        node.innerHTML = docData.getField(field);
    });
}

export default sheetToDomInnerHtml;
