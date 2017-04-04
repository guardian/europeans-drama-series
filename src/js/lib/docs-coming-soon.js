class DocsComingSoon {
    static render({node}) {
        const text = 'Next up from the groundbreaking Guardian Bertha documentary partnership';
        node.querySelector('.coming-soon__container-title .details').innerText = text;
    }
}

export default DocsComingSoon;
