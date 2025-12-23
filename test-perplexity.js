// Test Perplexity API
// Node 24+ has built-in fetch
// Run with: node test-perplexity.js
// Make sure .env file exists with PERPLEXITY_API_KEY

require('dotenv').config();

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

if (!PERPLEXITY_API_KEY) {
  console.error('Error: PERPLEXITY_API_KEY not found in .env file');
  process.exit(1);
}

async function testPerplexityAPI() {
  try {
    console.log('Testing Perplexity API...');

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'user',
            content: 'What is the latest news from Greenwich Council in London? Provide 2-3 recent updates.',
          },
        ],
        max_tokens: 500,
      }),
    });

    console.log('Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return;
    }

    const data = await response.json();
    console.log('\n=== SUCCESS ===');
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices[0]) {
      console.log('\n=== CONTENT ===');
      console.log(data.choices[0].message.content);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPerplexityAPI();
