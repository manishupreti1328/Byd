// Using native fetch in Node 18+

// Using native fetch in Node 18+

const endpoint = 'http://bydcarupdates.local/graphql';

const fs = require('fs');
const path = require('path');

const faqs = [];
for (let i = 1; i <= 10; i++) {
  faqs.push(`faq${i}Title`);
  faqs.push(`faq${i}Value`);
}

const facts = [];
for (let i = 1; i <= 10; i++) {
  facts.push(`fact${i}Title`);
  facts.push(`fact${i}Value`);
}

const query = `
  query ProbeFields {
    models {
      nodes {
        fAQ {
          ${faqs.join('\n          ')}
        }
        quickFacts {
          ${facts.join('\n          ')}
        }
      }
    }
  }
`;

async function run() {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();
    if (json.errors) {
      // Print the raw error messages to parse missing fields
      console.log('Errors:', JSON.stringify(json.errors, null, 2));
    } else {
      console.log('Success - All probed fields exist!');
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

run();
