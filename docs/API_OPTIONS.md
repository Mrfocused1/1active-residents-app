# API Options for UK Council Reporting App

This document outlines available APIs for fetching council data, news, and reports.

## Current Configuration

### Perplexity AI (ACTIVE)
- **Status**: ✅ API Key Configured (stored in .env)
- **API Key**: Store in `.env` as `PERPLEXITY_API_KEY`
- **Use Case**: AI-powered search for council information, news, department heads
- **Cost**: Pay-as-you-go pricing
- **Documentation**: https://docs.perplexity.ai/

---

## Recommended Additional APIs

### 1. **FixMyStreet / Open311 API** ⭐ HIGHLY RECOMMENDED
- **Provider**: mySociety (UK Charity)
- **Cost**: FREE (open source)
- **Use Cases**:
  - Submit reports directly to councils
  - Track report status
  - View existing reports by location
  - Access council backend systems
- **API Standard**: Open311 (established 2011)
- **Contact**: support@fixmystreet.com
- **Website**: https://www.fixmystreet.com/
- **Benefits**:
  - Direct integration with UK council systems
  - Real report tracking
  - Widely adopted by UK councils
  - Free implementation support

### 2. **NewsAPI** ⭐ RECOMMENDED
- **Cost**: FREE tier available (for development)
- **Use Cases**:
  - UK local news by location
  - Real-time news headlines
  - Historical news articles
- **Coverage**: 150,000+ worldwide sources
- **Register**: https://newsapi.org/register
- **UK Endpoint**: Set country parameter to "gb"
- **Categories**: General, Business, Health, Science, Sports, Technology
- **Format**: JSON REST API

### 3. **GOV.UK APIs**
- **Cost**: FREE
- **Use Cases**:
  - Find local council by postcode
  - Access government open data
- **API Catalogue**: https://www.api.gov.uk/
- **Find Council API**: https://www.gov.uk/find-local-council
- **Note**: Not versioned, may change without notice

### 4. **MySociety MapIt API**
- **Cost**: £20/month (FREE for low-volume non-profit)
- **Use Cases**:
  - Convert postcodes to council areas
  - Geographic boundaries
  - Administrative area lookups
- **Website**: https://mapit.mysociety.org/

### 5. **data.gov.uk**
- **Cost**: FREE
- **Use Cases**:
  - Access open government datasets
  - Council statistics
  - Public sector data
- **Website**: https://www.data.gov.uk/
- **Format**: Various (CSV, JSON, XML, API)

### 6. **LG Inform Plus (opendata.esd.org.uk)**
- **Cost**: FREE
- **Use Cases**:
  - Local government ward data
  - Up-to-date council statistics
  - Small area data
- **Website**: https://opendata.esd.org.uk/

---

## Council-Specific RSS Feeds

Many UK councils provide RSS feeds for news and updates:

### Examples:
- **Camden Council**: https://opendata.camden.gov.uk/
- **Durham County Council**: Council news RSS feed available
- **London City Hall**: https://www.london.gov.uk/rss-feeds
- **Doncaster Council**: RSS news feeds available
- **LocalGov.co.uk**: https://www.localgov.co.uk/RSS-Feeds/701

### Usage:
Most council websites have RSS feeds at:
- `/rss`
- `/news/rss`
- `/feeds`
- Check individual council websites under "News" or "Stay informed"

---

## Implementation Priority

### Phase 1 (Current)
- ✅ Perplexity AI (ACTIVE)

### Phase 2 (Recommended Next)
1. **FixMyStreet API** - Real council integration
2. **NewsAPI** - Better local news coverage

### Phase 3 (Optional Enhancements)
1. **GOV.UK Find Council API** - Postcode lookup
2. **Council-specific RSS feeds** - Direct council news
3. **MapIt API** - Geographic features

---

## Notes

- **API Keys**: Store in environment variables, never commit to git
- **Rate Limits**: Monitor API usage to avoid hitting limits
- **Caching**: Implement caching for frequently accessed data
- **Fallbacks**: Always have fallback data when APIs are unavailable
- **GDPR**: Ensure compliance when storing user location data

---

## Testing

Test API integrations in this order:
1. Verify Perplexity API responses
2. Add FixMyStreet for real council data
3. Add NewsAPI for better news coverage
4. Test fallback mechanisms

---

Last Updated: December 23, 2025
