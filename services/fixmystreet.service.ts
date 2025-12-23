// FixMyStreet API service for fetching live council reports and updates

export interface FixMyStreetReport {
  service_request_id: number;
  service_code: string;
  service_name: string;
  lat: string;
  long: string;
  title: string;
  description: string;
  detail: string;
  status: 'open' | 'closed' | 'investigating' | 'planned' | 'fixed';
  requested_datetime: string;
  updated_datetime: string;
  agency_sent_datetime: string;
  interface_used: string;
  media_url?: string;
  comment_count?: number;
  agency_responsible: {
    recipient: string[];
  };
}

export interface FixMyStreetResponse {
  service_requests: FixMyStreetReport[];
}

/**
 * Map of council names to their FixMyStreet config
 * Only includes councils that have their own FixMyStreet instance
 * Format: { subdomain: string, isBromley?: boolean, isSouthwark?: boolean }
 */
const COUNCIL_CONFIG: { [key: string]: { subdomain: string, customDomain?: string } } = {
  // London Boroughs
  'Camden': { subdomain: 'camden' },
  'Westminster': { subdomain: 'westminster' },
  'Islington': { subdomain: 'islington' },
  'Hackney': { subdomain: 'hackney' },
  'Bromley': { subdomain: 'bromley', customDomain: 'fix.bromley.gov.uk' },
  'Southwark': { subdomain: 'southwark', customDomain: 'report.southwark.gov.uk' },

  // County Councils
  'Buckinghamshire': { subdomain: 'buckinghamshire', customDomain: 'fixmystreet.buckinghamshire.gov.uk' },
  'Oxfordshire': { subdomain: 'oxfordshire', customDomain: 'fixmystreet.oxfordshire.gov.uk' },
  'West Northamptonshire': { subdomain: 'westnorthants', customDomain: 'fix.westnorthants.gov.uk' },
};

/**
 * Normalize council name by removing "Council" suffix and extra whitespace
 */
const normalizeCouncilName = (councilName: string): string => {
  return councilName.replace(/\s+Council$/i, '').trim();
};

/**
 * Check if a council has a dedicated FixMyStreet instance
 */
export const hasFixMyStreetAPI = (councilName: string): boolean => {
  const normalized = normalizeCouncilName(councilName);
  return COUNCIL_CONFIG[normalized] !== undefined;
};

/**
 * Get the FixMyStreet base URL for a council
 */
const getCouncilBaseUrl = (councilName: string): string => {
  const normalized = normalizeCouncilName(councilName);
  const config = COUNCIL_CONFIG[normalized];
  if (config) {
    // Use custom domain if specified, otherwise use standard format
    if (config.customDomain) {
      return `https://${config.customDomain}`;
    }
    return `https://fixmystreet.${config.subdomain}.gov.uk`;
  }
  // Councils without dedicated FixMyStreet instance cannot use the API
  throw new Error(`No FixMyStreet API available for ${councilName}`);
};

/**
 * Get the jurisdiction ID for a council
 */
const getJurisdictionId = (councilName: string): string => {
  const normalized = normalizeCouncilName(councilName);
  const config = COUNCIL_CONFIG[normalized];
  if (!config) {
    throw new Error(`No FixMyStreet API available for ${councilName}`);
  }
  return config.subdomain;
};

/**
 * Fetch recent reports from FixMyStreet Open311 API
 * @param councilName - Name of the council (e.g., "Camden")
 * @param status - Filter by status ('open', 'closed', or undefined for all)
 * @param limit - Maximum number of reports to return (default: 10)
 * @returns Array of reports
 */
export const getRecentReports = async (
  councilName: string,
  status?: string,
  limit: number = 10
): Promise<FixMyStreetReport[]> => {
  try {
    console.log('getRecentReports - Input council name:', councilName);
    const normalized = normalizeCouncilName(councilName);
    console.log('getRecentReports - Normalized council name:', normalized);

    // Check if council has FixMyStreet API
    if (!hasFixMyStreetAPI(councilName)) {
      console.log(`No FixMyStreet API available for ${councilName}. Available councils: Camden, Westminster, Islington, Hackney, Bromley, Southwark, Buckinghamshire, Oxfordshire, West Northamptonshire`);
      return [];
    }

    const baseUrl = getCouncilBaseUrl(councilName);
    const jurisdictionId = getJurisdictionId(councilName);

    console.log('getRecentReports - Base URL:', baseUrl);
    console.log('getRecentReports - Jurisdiction ID:', jurisdictionId);

    let url = `${baseUrl}/open311/v2/requests.json?jurisdiction_id=${jurisdictionId}`;

    if (status) {
      url += `&status=${status}`;
    }

    console.log('getRecentReports - Full URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('getRecentReports - Response status:', response.status);

    if (!response.ok) {
      throw new Error(`FixMyStreet API error: ${response.status} ${response.statusText}`);
    }

    const data: FixMyStreetResponse = await response.json();

    console.log('getRecentReports - Got', data.service_requests.length, 'reports');

    // Return limited number of most recent reports
    return data.service_requests.slice(0, limit);
  } catch (error) {
    // This is expected for councils without FixMyStreet API - just use NewsAPI instead
    console.log(`ℹ️  FixMyStreet reports not available for ${councilName} (no API support)`);
    // Return empty array on error so app doesn't break
    return [];
  }
};

/**
 * Fetch recently updated/resolved reports (for "Recent Updates" section)
 * @param councilName - Name of the council
 * @param limit - Maximum number of updates to return (default: 5)
 * @returns Array of recently updated reports
 */
export const getRecentUpdates = async (
  councilName: string,
  limit: number = 5
): Promise<FixMyStreetReport[]> => {
  try {
    console.log('getRecentUpdates - Input council name:', councilName);
    const normalized = normalizeCouncilName(councilName);
    console.log('getRecentUpdates - Normalized council name:', normalized);

    // Check if council has FixMyStreet API
    if (!hasFixMyStreetAPI(councilName)) {
      console.log(`No FixMyStreet API available for ${councilName}. Available councils: Camden, Westminster, Islington, Hackney, Bromley, Southwark, Buckinghamshire, Oxfordshire, West Northamptonshire`);
      return [];
    }

    const baseUrl = getCouncilBaseUrl(councilName);
    const jurisdictionId = getJurisdictionId(councilName);

    console.log('getRecentUpdates - Base URL:', baseUrl);
    console.log('getRecentUpdates - Jurisdiction ID:', jurisdictionId);

    // Get recently closed/fixed reports
    const url = `${baseUrl}/open311/v2/requests.json?jurisdiction_id=${jurisdictionId}&status=closed`;

    console.log('getRecentUpdates - Full URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('getRecentUpdates - Response status:', response.status);

    if (!response.ok) {
      throw new Error(`FixMyStreet API error: ${response.status} ${response.statusText}`);
    }

    const data: FixMyStreetResponse = await response.json();

    console.log('getRecentUpdates - Got', data.service_requests.length, 'updates');

    // Sort by updated_datetime to get most recently updated
    const sortedReports = data.service_requests.sort((a, b) => {
      return new Date(b.updated_datetime).getTime() - new Date(a.updated_datetime).getTime();
    });

    return sortedReports.slice(0, limit);
  } catch (error) {
    // This is expected for councils without FixMyStreet API - just use NewsAPI instead
    console.log(`ℹ️  FixMyStreet updates not available for ${councilName} (no API support)`);
    return [];
  }
};

/**
 * Get a single report by ID
 * @param councilName - Name of the council
 * @param reportId - ID of the report
 * @returns Single report or null if not found
 */
export const getReportById = async (
  councilName: string,
  reportId: string
): Promise<FixMyStreetReport | null> => {
  try {
    const baseUrl = getCouncilBaseUrl(councilName);
    const jurisdictionId = getJurisdictionId(councilName);

    const url = `${baseUrl}/open311/v2/requests/${reportId}.json?jurisdiction_id=${jurisdictionId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: FixMyStreetResponse = await response.json();
    return data.service_requests[0] || null;
  } catch (error) {
    console.error('Error fetching FixMyStreet report:', error);
    return null;
  }
};

/**
 * Format a timestamp for display
 */
export const formatReportTime = (datetime: string): string => {
  const date = new Date(datetime);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/**
 * Get a friendly status label
 */
export const getStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'open': 'Received',
    'investigating': 'In Progress',
    'planned': 'Planned',
    'fixed': 'Fixed',
    'closed': 'Closed',
  };
  return statusMap[status] || status;
};

/**
 * Get status color for UI
 */
export const getStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    'open': '#9CA3AF',
    'investigating': '#FFD572',
    'planned': '#5B7CFA',
    'fixed': '#4DB6AC',
    'closed': '#4DB6AC',
  };
  return colorMap[status] || '#9CA3AF';
};

export default {
  hasFixMyStreetAPI,
  getRecentReports,
  getRecentUpdates,
  getReportById,
  formatReportTime,
  getStatusLabel,
  getStatusColor,
};
