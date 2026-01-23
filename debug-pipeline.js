
const DOMPurify = require('isomorphic-dompurify');

function fixImages(html) {
    // Fix src
    let newHtml = html.replace(
        /src=["']https?:\/\/[^"']+\/wp-content\/uploads\/([^"']+)["']/g,
        (match, path) =>
            `src="https://res.cloudinary.com/dcb6bxort/image/upload/${path}"`
    );

    // Fix srcset
    // Strategy: Find srcset="..." match, then replace URLs inside it.
    newHtml = newHtml.replace(
        /srcset=["']([^"']+)["']/g,
        (match, content) => {
            // Replace all occurrences of the WP URL pattern inside the srcset value
            const newContent = content.replace(
                /https?:\/\/[^"'\s,]+\/wp-content\/uploads\/([^"'\s,]+)/g,
                (urlMatch, path) => `https://res.cloudinary.com/dcb6bxort/image/upload/${path}`
            );
            return `srcset="${newContent}"`;
        }
    );

    return newHtml;
}

// Mock function from lib/toc-utils.ts
function processContent(html) {
    const cleanHtml = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'width', 'height', 'style', 'class', 'id', 'loading', 'src', 'srcset', 'sizes', 'alt', 'title', 'align'],
        ADD_TAGS: ['iframe', 'img', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'blockquote', 'a', 'b', 'i', 'strong', 'em', 'br', 'hr', 'code', 'pre', 'figure', 'figcaption'],
    });
    return cleanHtml;
}

// Input with srcset
const input = `<img src="http://bydcarupdates.local/wp-content/uploads/2024/11/full.jpg" srcset="http://bydcarupdates.local/wp-content/uploads/2024/11/full.jpg 1200w, http://bydcarupdates.local/wp-content/uploads/2024/11/medium.jpg 300w" sizes="(max-width: 500px) 100vw, 500px" />`;

console.log("Original: ", input);
const fixed = fixImages(input);
console.log("Fixed:    ", fixed);
const processed = processContent(fixed);
console.log("Processed:", processed);
