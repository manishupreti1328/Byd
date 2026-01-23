
import DOMPurify from 'isomorphic-dompurify';

const html = `
<p>Here is some text.</p>
<p><img src="https://res.cloudinary.com/dcb6bxort/image/upload/v12345/test.jpg" alt="Test Image" width="500" height="300" /></p>
<iframe src="https://youtube.com/embed/123" width="100%" height="400"></iframe>
`;

const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height', 'style', 'class', 'id', 'loading'],
    ADD_TAGS: ['iframe', 'img', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'a', 'b', 'i', 'strong', 'em', 'br', 'hr', 'code', 'pre'],
});

console.log('Original:', html);
console.log('Clean:', cleanHtml);
