// GOV.UK API service for finding local councils by postcode
// Free API - no authentication required
// Documentation: https://www.gov.uk/find-local-council

const GOVUK_API_URL = 'https://www.gov.uk';

export interface LocalAuthority {
  name: string;
  homepage_url: string;
  tier: string; // 'district', 'county', 'unitary'
}

export interface CouncilLookupResult {
  postcode: string;
  local_authorities: LocalAuthority[];
}

/**
 * Find local council by postcode
 * @param postcode - UK postcode (e.g., "SW1A 1AA")
 * @returns Council information
 */
export const findCouncilByPostcode = async (
  postcode: string
): Promise<CouncilLookupResult | null> => {
  try {
    // Clean postcode (remove spaces, uppercase)
    const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();

    const response = await fetch(
      `${GOVUK_API_URL}/find-local-council/${cleanPostcode}.json`
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Postcode ${postcode} not found`);
        return null;
      }
      throw new Error(`GOV.UK API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      postcode: postcode,
      local_authorities: data.local_authorities || [],
    };
  } catch (error) {
    console.warn(`GOV.UK API unavailable for postcode ${postcode}`);
    return null;
  }
};

/**
 * Validate UK postcode format
 * @param postcode - Postcode to validate
 * @returns true if valid format
 */
export const isValidPostcode = (postcode: string): boolean => {
  // UK postcode regex pattern
  const postcodeRegex = /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
  return postcodeRegex.test(postcode);
};

/**
 * Format postcode to standard format (e.g., "SW1A1AA" -> "SW1A 1AA")
 * @param postcode - Postcode to format
 * @returns Formatted postcode
 */
export const formatPostcode = (postcode: string): string => {
  const clean = postcode.replace(/\s/g, '').toUpperCase();

  if (clean.length < 5) return clean;

  // Insert space before last 3 characters
  return `${clean.slice(0, -3)} ${clean.slice(-3)}`;
};

/**
 * Get council website URL
 * @param councilName - Name of the council
 * @returns Council website URL or null
 */
export const getCouncilWebsite = (councilName: string): string | null => {
  // Common UK council website patterns
  const councilSlug = councilName
    .toLowerCase()
    .replace(/\s+council$/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');

  // Try common patterns
  const patterns = [
    `https://www.${councilSlug}.gov.uk`,
    `https://${councilSlug}.gov.uk`,
    `https://www.${councilSlug}council.gov.uk`,
  ];

  // Return first pattern (caller should verify if URL is accessible)
  return patterns[0];
};

export default {
  findCouncilByPostcode,
  isValidPostcode,
  formatPostcode,
  getCouncilWebsite,
};
