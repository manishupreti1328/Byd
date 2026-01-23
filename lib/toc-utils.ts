export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export async function processContent(
  html: string,
  faqData?: any // Add FAQ data as second parameter
): Promise<{ processedContent: string; tocItems: TocItem[] }> {
  const tocItems: TocItem[] = [];
  
  if (typeof window !== 'undefined') {
    // Client-side processing
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Process headings from HTML content
    const headings = doc.querySelectorAll('h2, h3, h4');
    headings.forEach((heading, index) => {
      const text = heading.textContent?.trim() || '';
      if (!text) return;
      
      const level = parseInt(heading.tagName.charAt(1), 10);
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `heading-${index}`;
      
      heading.id = id;
      tocItems.push({ id, text, level });
    });
    
    // Add FAQ section and questions to TOC
    if (faqData) {
      const hasValidFaq = [1,2,3,4,5,6,7,8,9,10].some(num => 
        faqData[`faq_title_${num}`] && faqData[`faq_value_${num}`]
      );
      
      if (hasValidFaq) {
        // Add FAQ section as H2
        tocItems.push({
          id: 'frequently-asked-questions',
          text: 'Frequently Asked Questions',
          level: 2
        });
        
        // Add individual FAQ questions as H3
        for (let i = 1; i <= 10; i++) {
          const question = faqData[`faq_title_${i}`];
          const answer = faqData[`faq_value_${i}`];
          
          if (question && answer) {
            // Create FAQ ID
            const id = `faq-${i}`;
            tocItems.push({
              id,
              text: question.length > 50 ? question.substring(0, 50) + '...' : question,
              level: 3
            });
          }
        }
      }
    }
    
    const processedContent = doc.body.innerHTML;
    return { processedContent, tocItems };
  } else {
    // Server-side processing
    const tocItems: TocItem[] = [];
    
    // Process headings from HTML content
    const regex = /<(h[2-4])([^>]*)>(.*?)<\/\1>/gi;
    
    const processedContent = html.replace(regex, (match, tag, attrs, content, offset) => {
      const cleanText = content.replace(/<[^>]*>/g, '').trim();
      if (!cleanText) return match;
      
      // Create deterministic ID
      const id = `h-${Buffer.from(`${cleanText}-${offset}`).toString('base64')
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase()
        .slice(0, 12)}`;
      
      const level = parseInt(tag.charAt(1), 10);
      tocItems.push({ id, text: cleanText, level });
      
      // Add id attribute if not present
      if (attrs.includes('id=')) {
        return match;
      } else {
        return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
      }
    });
    
    // Add FAQ section and questions to TOC
    if (faqData) {
      const hasValidFaq = [1,2,3,4,5,6,7,8,9,10].some(num => 
        faqData[`faq_title_${num}`] && faqData[`faq_value_${num}`]
      );
      
      if (hasValidFaq) {
        // Add FAQ section as H2
        tocItems.push({
          id: 'frequently-asked-questions',
          text: 'Frequently Asked Questions',
          level: 2
        });
        
        // Add individual FAQ questions as H3
        for (let i = 1; i <= 10; i++) {
          const question = faqData[`faq_title_${i}`];
          const answer = faqData[`faq_value_${i}`];
          
          if (question && answer) {
            // Create FAQ ID
            const id = `faq-${i}`;
            tocItems.push({
              id,
              text: question.length > 50 ? question.substring(0, 50) + '...' : question,
              level: 3
            });
          }
        }
      }
    }
    
    return { processedContent, tocItems };
  }
}