// Quick test script to verify APIs work
const councilName = 'Camden';

console.log('\n=== Testing APIs for Camden ===\n');

// Test 1: NewsAPI
console.log('1. Testing NewsAPI...');
fetch('https://newsapi.org/v2/everything?q=Camden+London+UK&apiKey=324967a792d445bb989be156984cc600&pageSize=5&language=en&sortBy=publishedAt')
  .then(r => r.json())
  .then(d => {
    console.log('✅ NewsAPI Status:', d.status);
    console.log('   Articles found:', d.totalResults);
    console.log('   First article:', d.articles[0]?.title.substring(0, 60) + '...');
  })
  .catch(e => console.log('❌ NewsAPI Error:', e.message));

// Test 2: Camden RSS Feed
console.log('\n2. Testing Camden RSS Feed...');
fetch('https://news.camden.gov.uk/feed/')
  .then(r => r.text())
  .then(t => {
    const hasItems = t.includes('<item>');
    console.log('✅ RSS Feed Status:', hasItems ? 'OK' : 'No items');
    if (hasItems) {
      const titleMatch = t.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      console.log('   First item:', titleMatch ? titleMatch[1].substring(0, 60) + '...' : 'Could not parse');
    }
  })
  .catch(e => console.log('❌ RSS Error:', e.message));

// Test 3: FixMyStreet Camden API
console.log('\n3. Testing FixMyStreet Camden API...');
fetch('https://fixmystreet.camden.gov.uk/open311/v2/requests.json?jurisdiction_id=camden')
  .then(r => r.json())
  .then(d => {
    console.log('✅ FixMyStreet Status: OK');
    console.log('   Reports found:', d.length || d.service_requests?.length || 0);
  })
  .catch(e => console.log('❌ FixMyStreet Error:', e.message));

setTimeout(() => {
  console.log('\n=== All tests complete ===\n');
}, 5000);
