import {stringToNode} from './dom';

class DocsSupporter {
    static get defaults() {
        return {
            badgeUrl: 'https://uploads.guim.co.uk/2017/01/11/bertha-foundation-logo-grey.png',
            siteUrl: 'http://www.berthafoundation.org/',
            info: `
                <p class="docs--about-headline">About the Guardian Bertha documentary partnership</p>
                <p>The Guardian is partnering with Bertha Foundation to tell international documentary film stories with global impact.</p>
                <p><a href='http://berthafoundation.org/'>Bertha Foundation</a> support activists, storytellers and lawyers who are working to bring about social and economic justice, and human rights for all.</p>
                <p>The Guardian and Bertha Foundation are commissioning a series of 12 short documentary films from independent filmmakers. The series covers global stories, with a focus on films that have the ability to advance the contemporary issues they address, and and raise awareness of people and movements who are catalysts for change.</p>
                <p>These documentaries help the Guardian audience to understand the world in creative, entertaining and surprising ways designed for a wide online audience. All documentaries are editorially independent and follow GNM's published editorial code.</p>
                <p>This unique collaboration involves the Guardian and Bertha Foundation engaging a network of film-makers with embedded access to, and deep knowledge of, the communities in which they are filming. The Guardian are delighted to be working with Bertha Foundation who have a track record of supporting documentary makers that make a significant difference in the world.</p>
                <p class="docs--about-legal">Unless otherwise stated, all statements and materials in these documentaries reflect the views of the individual documentary makers and not those of Bertha Foundation or the Guardian.</p>
            `
        };
    }

    constructor({node, badgeUrl, siteUrl, info}) {
        this.badgeUrl = badgeUrl || DocsSupporter.defaults.badgeUrl;
        this.siteUrl = siteUrl || DocsSupporter.defaults.siteUrl;
        this.info = info || DocsSupporter.defaults.info;

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
            <a class='supporter-logo' href="${this.siteUrl}" target="_blank">
                <img src='${this.badgeUrl}'>
            </a>
        `;

        return stringToNode(htmlString);
    }

    infoNode() {
        return stringToNode(this.info);
    }
}

export default DocsSupporter;
