// Unified Data Aggregator Service
// Combines data from all APIs intelligently
// Priority: FixMyStreet > RSS > NewsAPI

import fixMyStreetService, { FixMyStreetReport } from './fixmystreet.service';
import newsAPIService, { NewsArticle } from './newsAPI.service';
import rssFeedService, { RSSFeedItem } from './rssFeed.service';
import govUKService from './govUK.service';
import mapItService from './mapIt.service';
import geminiService, { CouncilDepartmentInfo } from './gemini.service';
import councilsDatabaseService from './councilsDatabase.service';

export interface AggregatedReport {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'investigating' | 'planned' | 'fixed' | 'closed';
  date: string;
  location?: {
    lat: number;
    lon: number;
  };
  source: 'fixmystreet' | 'mock';
  department?: {
    name: string;
    contact: string;
    reason: string;
  };
}

export interface AggregatedNews {
  id: string;
  title: string;
  summary: string;
  date: string;
  url: string;
  imageUrl?: string;
  source: 'newsapi' | 'rss' | 'council';
  category?: string;
  aiSummary?: {
    summary: string;
    keyPoints: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
  };
}

export interface CouncilData {
  councilName: string;
  reports: AggregatedReport[];
  news: AggregatedNews[];
  updates: AggregatedNews[];
  stats: {
    totalReports: number;
    openReports: number;
    fixedReports: number;
  };
  departments?: CouncilDepartmentInfo;
}

/**
 * Get comprehensive council data from all available sources
 * @param councilName - Name of the council
 * @param options - Options for data fetching
 * @returns Aggregated council data
 */
export const getCouncilData = async (
  councilName: string,
  options: {
    includeReports?: boolean;
    includeNews?: boolean;
    includeUpdates?: boolean;
    includeDepartments?: boolean;
    includeReportDepartments?: boolean;
    includeNewsSummaries?: boolean;
    maxReports?: number;
    maxNews?: number;
  } = {}
): Promise<CouncilData> => {
  const {
    includeReports = true,
    includeNews = true,
    includeUpdates = true,
    includeDepartments = false, // Default to false for performance
    includeReportDepartments = false, // Default to false - too expensive for list views
    includeNewsSummaries = false, // Default to false - only use in detail views
    maxReports = 20,
    maxNews = 10,
  } = options;

  const result: CouncilData = {
    councilName,
    reports: [],
    news: [],
    updates: [],
    stats: {
      totalReports: 0,
      openReports: 0,
      fixedReports: 0,
    },
  };

  // Fetch reports from FixMyStreet
  if (includeReports && fixMyStreetService.hasFixMyStreetAPI(councilName)) {
    try {
      console.log(`Fetching FixMyStreet data for ${councilName}...`);
      const fmsReports = await fixMyStreetService.getRecentReports(councilName, undefined, maxReports);
      console.log(`FixMyStreet returned ${fmsReports.length} reports`);

      // Only fetch departments if explicitly requested
      if (includeReportDepartments) {
        const reportsWithDepartments = fmsReports.map((report) => {
          // Use local database to find department (instant, no API call)
          let department;
          try {
            const deptInfo = councilsDatabaseService.findDepartmentForCategory(
              councilName,
              report.service_name || 'General'
            );
            if (deptInfo) {
              department = {
                name: deptInfo.department.name,
                contact: `${deptInfo.department.phone} | ${deptInfo.department.email}`,
                reason: deptInfo.reason,
              };
            }
          } catch (error) {
            // Silent fail - department is optional
          }

          return {
            id: String(report.service_request_id),
            title: report.title,
            description: report.detail || report.description,
            category: report.service_name || 'General',
            status: report.status,
            date: report.requested_datetime,
            location: {
              lat: parseFloat(report.lat),
              lon: parseFloat(report.long),
            },
            source: 'fixmystreet' as const,
            department: department || undefined,
          };
        });
        result.reports = reportsWithDepartments;
      } else {
        // Skip department lookups for faster loading
        result.reports = fmsReports.map(report => ({
          id: String(report.service_request_id),
          title: report.title,
          description: report.detail || report.description,
          category: report.service_name || 'General',
          status: report.status,
          date: report.requested_datetime,
          location: {
            lat: parseFloat(report.lat),
            lon: parseFloat(report.long),
          },
          source: 'fixmystreet' as const,
        }));
      }

      // Calculate stats
      result.stats.totalReports = fmsReports.length;
      result.stats.openReports = fmsReports.filter(r => r.status === 'open' || r.status === 'investigating').length;
      result.stats.fixedReports = fmsReports.filter(r => r.status === 'fixed' || r.status === 'closed').length;
    } catch (error) {
      console.warn('FixMyStreet data unavailable for', councilName);
    }
  }

  // Fetch news from multiple sources
  // Priority: RSS feeds (free, official) > NewsAPI (limited quota)
  if (includeNews) {
    const newsFromAllSources: AggregatedNews[] = [];

    // Try RSS feed first (free and official council news)
    if (rssFeedService.hasRSSFeed(councilName)) {
      try {
        console.log(`Fetching RSS feed data for ${councilName}...`);
        const rssItems = await rssFeedService.getCouncilRSSNews(councilName, maxNews);
        console.log(`RSS feed returned ${rssItems.length} articles`);

        newsFromAllSources.push(
          ...rssItems.map(item => ({
            id: item.guid,
            title: item.title,
            summary: item.description,
            date: item.pubDate,
            url: item.link,
            source: 'rss' as const,
            category: item.category || 'Council News',
          }))
        );
      } catch (error) {
        console.warn('RSS feed unavailable for', councilName);
      }
    }

    // Use NewsAPI as backup if we don't have enough news from RSS
    if (newsFromAllSources.length < maxNews) {
      try {
        console.log(`Fetching NewsAPI data for ${councilName}...`);
        const newsArticles = await newsAPIService.getCouncilNews(councilName, maxNews - newsFromAllSources.length);
        console.log(`NewsAPI returned ${newsArticles.length} articles`);

      // Only add AI summaries if explicitly requested (expensive operation)
      if (includeNewsSummaries) {
        const articlesWithSummaries = await Promise.all(
          newsArticles.map(async (article, index) => {
            let aiSummary;

            // Only summarize first 3 articles to save costs
            if (index < 3 && article.content) {
              try {
                const summary = await geminiService.summarizeNews(
                  article.title,
                  article.content
                );
                if (summary) {
                  aiSummary = {
                    summary: summary.summary,
                    keyPoints: summary.keyPoints,
                    sentiment: summary.sentiment,
                  };
                }
              } catch (error) {
                // Silent fail - AI summary is optional
              }
            }

            return {
              id: article.url,
              title: article.title,
              summary: article.description || '',
              date: article.publishedAt,
              url: article.url,
              imageUrl: article.urlToImage || undefined,
              source: 'newsapi' as const,
              category: 'News',
              aiSummary: aiSummary || undefined,
            };
          })
        );
        newsFromAllSources.push(...articlesWithSummaries);
      } else {
        // Skip AI summaries for faster loading
        newsFromAllSources.push(
          ...newsArticles.map(article => ({
            id: article.url,
            title: article.title,
            summary: article.description || '',
            date: article.publishedAt,
            url: article.url,
            imageUrl: article.urlToImage || undefined,
            source: 'newsapi' as const,
            category: 'News',
          }))
        );
      }
      } catch (error) {
        console.warn('NewsAPI unavailable for', councilName);
      }
    }

    result.news = newsFromAllSources.slice(0, maxNews);
  }

  // Fetch updates (recent fixes/closures)
  if (includeUpdates && fixMyStreetService.hasFixMyStreetAPI(councilName)) {
    try {
      const updates = await fixMyStreetService.getRecentUpdates(councilName, 5);
      result.updates = updates.map(report => ({
        id: String(report.service_request_id),
        title: `Fixed: ${report.title}`,
        summary: report.detail || report.description,
        date: report.updated_datetime,
        url: `https://www.fixmystreet.com/report/${report.service_request_id}`,
        source: 'council' as const,
        category: 'Update',
      }));
    } catch (error) {
      console.warn('FixMyStreet updates unavailable for', councilName);
    }
  }

  // Fetch department information from local database (instant, no API call)
  if (includeDepartments) {
    try {
      const leadership = councilsDatabaseService.getCouncilLeadership(councilName);
      const departments = councilsDatabaseService.getCouncilDepartments(councilName);

      if (leadership && departments) {
        // Transform to match OpenAI format for compatibility
        result.departments = {
          councilName: councilsDatabaseService.getCouncilInfo(councilName)?.name || councilName,
          leader: {
            name: leadership.councilLeader.name,
            role: leadership.councilLeader.role,
            party: leadership.councilLeader.party,
            contact: leadership.councilLeader.email,
          },
          chiefExecutive: {
            name: leadership.chiefExecutive.name,
            role: leadership.chiefExecutive.role,
            contact: leadership.chiefExecutive.email,
          },
          keyDepartments: Object.entries(departments).map(([key, dept]) => ({
            name: dept.name,
            head: dept.head,
            contact: `${dept.phone} | ${dept.email}`,
            responsibilities: dept.categories,
          })),
        };
      }
    } catch (error) {
      console.warn('Council database info unavailable for', councilName);
    }
  }

  return result;
};

/**
 * Get council name from postcode using GOV.UK API and MapIt
 * @param postcode - UK postcode
 * @returns Council name or null
 */
export const getCouncilFromPostcode = async (postcode: string): Promise<string | null> => {
  // Try GOV.UK API first (free, no auth needed)
  try {
    const govUKResult = await govUKService.findCouncilByPostcode(postcode);
    if (govUKResult && govUKResult.local_authorities.length > 0) {
      // Return the first unitary/district council
      const council = govUKResult.local_authorities.find(
        la => la.tier === 'unitary' || la.tier === 'district'
      ) || govUKResult.local_authorities[0];
      return council.name;
    }
  } catch (error) {
    console.warn('GOV.UK API failed, trying MapIt');
  }

  // Fallback to MapIt if configured
  if (mapItService.isConfigured()) {
    try {
      return await mapItService.getCouncilFromPostcode(postcode);
    } catch (error) {
      console.warn('MapIt API also failed');
    }
  }

  return null;
};

/**
 * Search for reports by location
 * @param lat - Latitude
 * @param lon - Longitude
 * @param radius - Search radius in meters
 * @returns Reports near the location
 */
// TODO: Implement getReportsByLocation in fixmystreet.service.ts
export const getReportsByLocation = async (
  lat: number,
  lon: number,
  radius: number = 1000
): Promise<AggregatedReport[]> => {
  console.warn('getReportsByLocation not yet implemented');
  return [];
};

/**
 * Get comprehensive news from all sources
 * @param query - Search query
 * @param limit - Maximum results
 * @returns Aggregated news
 */
export const searchNews = async (query: string, limit: number = 20): Promise<AggregatedNews[]> => {
  const allNews: AggregatedNews[] = [];

  // NewsAPI
  try {
    const newsArticles = await newsAPIService.searchNews(query, limit);
    allNews.push(
      ...newsArticles.map(article => ({
        id: article.url,
        title: article.title,
        summary: article.description || '',
        date: article.publishedAt,
        url: article.url,
        imageUrl: article.urlToImage || undefined,
        source: 'newsapi' as const,
      }))
    );
  } catch (error) {
    console.warn('NewsAPI search failed');
  }

  return allNews.slice(0, limit);
};

/**
 * Validate and format UK postcode
 * @param postcode - Postcode to validate
 * @returns Formatted postcode or null if invalid
 */
export const validatePostcode = (postcode: string): string | null => {
  if (!govUKService.isValidPostcode(postcode)) {
    return null;
  }
  return govUKService.formatPostcode(postcode);
};

export default {
  getCouncilData,
  getCouncilFromPostcode,
  getReportsByLocation,
  searchNews,
  validatePostcode,
};
