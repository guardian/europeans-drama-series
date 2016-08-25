export default function emailsignupURL(listId) {
    return  window.location.origin === 'https://www.theguardian.com' ? 'https://www.theguardian.com/email/form/plaindark/' + listId : 'https://m.code.dev-theguardian.com/email/form/plaindark/' + listId;
}
