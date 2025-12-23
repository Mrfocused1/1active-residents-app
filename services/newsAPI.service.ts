// NewsAPI service for UK local news
// Sign up for free API key at: https://newsapi.org/register
// Free tier: 100 requests/day

import { ENV } from '../config/env';

const NEWS_API_KEY = ENV.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

/**
 * Fetch UK news headlines
 * @param category - News category (business, entertainment, general, health, science, sports, technology)
 * @param searchQuery - Optional search query to filter results
 * @returns News articles
 */
export const getUKNews = async (
  category: string = 'general',
  searchQuery?: string
): Promise<NewsArticle[]> => {
  try {
    // Use everything endpoint if we have a search query, otherwise use top-headlines
    const endpoint = searchQuery ? 'everything' : 'top-headlines';
    const url = `${NEWS_API_URL}/${endpoint}`;

    const params = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      country: 'gb',
      pageSize: '20',
    });

    if (searchQuery) {
      params.append('q', searchQuery);
      params.append('language', 'en');
      params.append('sortBy', 'publishedAt');
    } else {
      params.append('category', category);
    }

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();

    if (data.status !== 'ok') {
      throw new Error('NewsAPI returned error status');
    }

    return data.articles;
  } catch (error) {
    console.warn('NewsAPI unavailable, returning empty results');
    return [];
  }
};

/**
 * Fetch local council news by council name
 * @param councilName - Name of the council (e.g., "Greenwich Council")
 * @param limit - Maximum number of results
 * @returns News articles related to the council
 */
export const getCouncilNews = async (
  councilName: string,
  limit: number = 10
): Promise<NewsArticle[]> => {
  try {
    // Search for council-related news
    // Use a broad search to ensure we get results, then filter client-side
    const searchQuery = `"${councilName}" OR "${councilName} Council"`;
    const url = `${NEWS_API_URL}/everything`;

    const params = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      q: searchQuery,
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: String(Math.min(limit * 3, 30)), // Fetch extra to filter out irrelevant results
      // Add date range to get recent news (last 29 days - free tier limit is 30 days)
      from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    console.log(`🗞️  Fetching NewsAPI for ${councilName}...`);
    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      console.error(`❌ NewsAPI error: ${response.status} for ${councilName}`);
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();

    if (data.status !== 'ok') {
      console.error(`❌ NewsAPI returned error status for ${councilName}:`, data);
      throw new Error('NewsAPI returned error status');
    }

    console.log(`✅ NewsAPI returned ${data.articles.length} articles for ${councilName}`);

    // Filter out obviously irrelevant results
    const filteredArticles = data.articles.filter(article => {
      const text = `${article.title} ${article.description || ''}`.toLowerCase();
      const councilNameLower = councilName.toLowerCase();
      const sourceName = (article.source.name || '').toLowerCase();

      // Must contain council name (check title, description, or source)
      const hasCouncilName = text.includes(councilNameLower) || sourceName.includes(councilNameLower);
      if (!hasCouncilName) {
        return false;
      }

      // Filter out obvious non-council news (crypto, stocks, restaurants, etc.)
      // Only filter if it's clearly irrelevant
      const irrelevantKeywords = [
        'cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'blockchain',
        'stock price', 'share price', 'shareholding', 'pdmr',
        'restaurant review', 'nobu', 'michelin star',
        'ice cream company',
      ];

      // Only exclude if article has multiple irrelevant keywords or very specific ones
      let irrelevantCount = 0;
      for (const keyword of irrelevantKeywords) {
        if (text.includes(keyword)) {
          irrelevantCount++;
        }
      }

      // Exclude only if multiple irrelevant keywords (likely spam)
      if (irrelevantCount >= 2) {
        return false;
      }

      return true;
    });

    console.log(`✅ After filtering: ${filteredArticles.length} relevant articles for ${councilName}`);
    return filteredArticles.slice(0, limit);
  } catch (error) {
    console.error(`❌ NewsAPI error for ${councilName}:`, error);
    console.warn(`NewsAPI unavailable for ${councilName}, returning empty results`);
    return [];
  }
};

/**
 * Search news by keywords
 * @param query - Search query
 * @param limit - Maximum number of results
 * @returns Matching news articles
 */
export const searchNews = async (
  query: string,
  limit: number = 20
): Promise<NewsArticle[]> => {
  try {
    const url = `${NEWS_API_URL}/everything`;

    const params = new URLSearchParams({
      apiKey: NEWS_API_KEY,
      q: query,
      language: 'en',
      sortBy: 'relevancy',
      pageSize: String(limit),
    });

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();

    if (data.status !== 'ok') {
      throw new Error('NewsAPI returned error status');
    }

    return data.articles;
  } catch (error) {
    console.warn('NewsAPI search unavailable, returning empty results');
    return [];
  }
};

export default {
  getUKNews,
  getCouncilNews,
  searchNews,
};
