// RSS Feed parser service for UK council news
// Free - councils provide RSS feeds for news and updates
// RSS feed URLs are loaded from councils-database.json

import councilsDatabaseService from './councilsDatabase.service';

export interface RSSFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
  category?: string;
}

/**
 * Strip HTML tags from text
 */
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp;
    .replace(/&amp;/g, '&') // Replace &amp;
    .replace(/&lt;/g, '<') // Replace &lt;
    .replace(/&gt;/g, '>') // Replace &gt;
    .replace(/&quot;/g, '"') // Replace &quot;
    .replace(/&#039;/g, "'") // Replace &#039;
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
};

/**
 * Parse RSS feed XML to extract items
 * @param xmlText - RSS feed XML content
 * @returns Array of feed items
 */
const parseRSSFeed = (xmlText: string): RSSFeedItem[] => {
  try {
    const items: RSSFeedItem[] = [];

    // Simple regex-based XML parsing for RSS items
    // This works for most standard RSS feeds
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/;
    const descRegex = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
    const guidRegex = /<guid.*?>(.*?)<\/guid>/;
    const categoryRegex = /<category>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category>/;

    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXML = match[1];

      let title = titleRegex.exec(itemXML)?.[1] || '';
      let description = descRegex.exec(itemXML)?.[1] || '';
      const link = linkRegex.exec(itemXML)?.[1] || '';
      const pubDate = pubDateRegex.exec(itemXML)?.[1] || '';
      const guid = guidRegex.exec(itemXML)?.[1] || link;
      const category = categoryRegex.exec(itemXML)?.[1];

      // Strip HTML from title and description
      title = stripHtml(title);
      description = stripHtml(description);

      if (title && link) {
        items.push({
          title: title.trim(),
          description: description.trim(),
          link: link.trim(),
          pubDate: pubDate.trim(),
          guid: guid.trim(),
          category: category ? stripHtml(category) : undefined,
        });
      }
    }

    return items;
  } catch (error) {
    console.warn('Error parsing RSS feed:', error);
    return [];
  }
};

/**
 * Fetch and parse RSS feed
 * @param feedUrl - URL of the RSS feed
 * @param limit - Maximum number of items to return
 * @returns Array of feed items
 */
export const fetchRSSFeed = async (
  feedUrl: string,
  limit: number = 10
): Promise<RSSFeedItem[]> => {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`RSS feed error: ${response.status}`);
    }

    const xmlText = await response.text();
    const items = parseRSSFeed(xmlText);

    return items.slice(0, limit);
  } catch (error) {
    console.warn(`RSS feed unavailable: ${feedUrl}`);
    return [];
  }
};

/**
 * Get council news from RSS feed
 * @param councilName - Name of the council
 * @param limit - Maximum number of items
 * @returns Array of news items
 */
export const getCouncilRSSNews = async (
  councilName: string,
  limit: number = 10
): Promise<RSSFeedItem[]> => {
  // Get RSS feeds from database
  const rssFeeds = councilsDatabaseService.getCouncilRSSFeeds(councilName);

  if (!rssFeeds || rssFeeds.length === 0) {
    console.warn(`No RSS feed configured for ${councilName}`);
    return [];
  }

  // Fetch from the first news feed (councils typically have one)
  const newsFeed = rssFeeds.find(feed => feed.type === 'news');
  if (newsFeed) {
    return fetchRSSFeed(newsFeed.url, limit);
  }

  // Fallback to first available feed
  return fetchRSSFeed(rssFeeds[0].url, limit);
};

/**
 * Check if council has RSS feed configured
 * @param councilName - Name of the council
 * @returns true if RSS feed is available
 */
export const hasRSSFeed = (councilName: string): boolean => {
  const rssFeeds = councilsDatabaseService.getCouncilRSSFeeds(councilName);
  return rssFeeds && rssFeeds.length > 0;
};

/**
 * Get list of councils with RSS feeds
 * @returns Array of council names
 */
export const getCouncilsWithRSS = (): string[] => {
  return councilsDatabaseService.getAllCouncils().filter(councilName => hasRSSFeed(councilName));
};

export default {
  fetchRSSFeed,
  getCouncilRSSNews,
  hasRSSFeed,
  getCouncilsWithRSS,
};
