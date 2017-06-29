import {stringToNode} from './dom';

class DocsSupporter {
    constructor({node, docData}) {
        this.docData = docData;

        const badgeNode = this.badgeNode();
        const infoNode = this.infoNode();
        const infoWrapper = node.querySelector('.docs--about-wrapper');

        const badgePlaceholder = node.querySelector('.meta__supporter');
        badgePlaceholder.appendChild(badgeNode);

        const infoPlaceholder = node.querySelector('.docs--about-body');
        infoPlaceholder.appendChild(infoNode);

        // clicking on modal text does nothing
        node.querySelector('.docs--about-body').addEventListener('click', (e) => e.stopPropagation());

        // close modal
        infoWrapper.addEventListener('click', () => {
            infoWrapper.classList.remove('docs--show-about');
        });

        // open modal
        badgeNode.querySelector('.supporter-info').addEventListener('click', () => {
            infoWrapper.classList.add('docs--show-about');
        });
    }

    badgeNode() {
        const htmlString = `
            <div class='supporter-info' id='show-about-these-films'>Supported by</div>
            <a class='supporter-logo' href="${this.docData.supportedSiteUrl}" target="_blank">
                <img src='${this.docData.supportedBadgeUrl}'>
            </a>
        `;

        return stringToNode(htmlString);
    }

    infoNode() {
        return stringToNode(this.docData.supportedInfo);
    }
}

export default DocsSupporter;
