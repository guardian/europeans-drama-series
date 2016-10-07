function setAttributes(el, attrs) {
    Object.keys(attrs).forEach(attr => {
        if (attr === 'style') {
            Object.keys(attrs[attr]).forEach(style => el.style[style] = attrs[attr][style]);
        } else {
            el.setAttribute(attr, attrs[attr]);
        }
    });
}

export default setAttributes;
