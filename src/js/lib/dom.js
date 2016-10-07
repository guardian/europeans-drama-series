function setAttributes(el, attrs) {
    Object.keys(attrs).forEach(attr => el.setAttribute(attr, attrs[attr]));
}

function setData(el, data) {
    Object.keys(data).forEach(key => el.dataset[key] = data[key]);
}

function setStyles(el, styles) {
    Object.keys(styles).forEach(style => el.style[style] = styles[style]);
}

export {setAttributes, setData, setStyles};
