
const DOMPurify = require('isomorphic-dompurify');

const html = `
<figure class="wp-caption alignnone">
  <img src="https://res.cloudinary.com/dcb6bxort/image/upload/v12345/test.jpg" alt="Test Image" width="500" height="300" srcset="https://res.cloudinary.com/dcb6bxort/image/upload/w_500/v12345/test.jpg 500w, https://res.cloudinary.com/dcb6bxort/image/upload/w_1000/v12345/test.jpg 1000w" sizes="(max-width: 500px) 100vw, 500px" />
  <figcaption>Caption</figcaption>
</figure>
`;

const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height', 'style', 'class', 'id', 'loading'],
    ADD_TAGS: ['iframe', 'img', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'a', 'b', 'i', 'strong', 'em', 'br', 'hr', 'code', 'pre'],
});

console.log('Original:', html);
console.log('Clean:', cleanHtml);
