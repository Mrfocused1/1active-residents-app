// MySociety MapIt API service
// Convert UK postcodes to council areas
// Pricing: £20/month (FREE for low-volume non-profit use)
// Documentation: https://mapit.mysociety.org/

const MAPIT_API_URL = 'https://mapit.mysociety.org';
const MAPIT_API_KEY = 'YOUR_MAPIT_API_KEY'; // Get from https://mapit.mysociety.org/

export interface MapItArea {
  id: number;
  name: string;
  country: string;
  type: string;
  type_name: string;
  codes: {
    gss?: string;
    ons?: string;
    [key: string]: string | undefined;
  };
  parent_area?: number;
  generation_high: number;
  generation_low: number;
  all_names: { [lang: string]: string };
}

export interface MapItPostcodeResponse {
  postcode: string;
  wgs84_lat: number;
  wgs84_lon: number;
  coordsyst: string;
  easting: number;
  northing: number;
  areas: { [areaId: string]: MapItArea };
  shortcuts: {
    council?: MapItArea;
    ward?: MapItArea;
  };
}

/**
 * Lookup postcode and get council areas
 * @param postcode - UK postcode
 * @returns Postcode information including councils
 */
export const lookupPostcode = async (
  postcode: string
): Promise<MapItPostcodeResponse | null> => {
  try {
    const cleanPostcode = postcode.replace(/\s/g, '').toUpperCase();
    const url = `${MAPIT_API_URL}/postcode/${encodeURIComponent(cleanPostcode)}`;

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // Add API key if configured
    if (MAPIT_API_KEY && MAPIT_API_KEY !== 'YOUR_MAPIT_API_KEY') {
      headers['X-Api-Key'] = MAPIT_API_KEY;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Postcode ${postcode} not found in MapIt`);
        return null;
      }
      throw new Error(`MapIt API error: ${response.status}`);
    }

    const data: MapItPostcodeResponse = await response.json();
    return data;
  } catch (error) {
    console.warn(`MapIt API unavailable for postcode ${postcode}`);
    return null;
  }
};

/**
 * Get coordinates for a postcode
 * @param postcode - UK postcode
 * @returns Latitude and longitude
 */
export const getPostcodeCoordinates = async (
  postcode: string
): Promise<{ lat: number; lon: number } | null> => {
  try {
    const data = await lookupPostcode(postcode);

    if (!data) return null;

    return {
      lat: data.wgs84_lat,
      lon: data.wgs84_lon,
    };
  } catch (error) {
    console.warn(`Could not get coordinates for ${postcode}`);
    return null;
  }
};

/**
 * Get council name from postcode
 * @param postcode - UK postcode
 * @returns Council name
 */
export const getCouncilFromPostcode = async (
  postcode: string
): Promise<string | null> => {
  try {
    const data = await lookupPostcode(postcode);

    if (!data || !data.shortcuts?.council) return null;

    return data.shortcuts.council.name;
  } catch (error) {
    console.warn(`Could not find council for ${postcode}`);
    return null;
  }
};

/**
 * Get all areas (councils, wards, etc.) for a postcode
 * @param postcode - UK postcode
 * @returns Array of areas
 */
export const getAllAreasForPostcode = async (
  postcode: string
): Promise<MapItArea[]> => {
  try {
    const data = await lookupPostcode(postcode);

    if (!data || !data.areas) return [];

    return Object.values(data.areas);
  } catch (error) {
    console.warn(`Could not get areas for ${postcode}`);
    return [];
  }
};

/**
 * Lookup area by coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Areas at that location
 */
export const lookupByCoordinates = async (
  lat: number,
  lon: number
): Promise<MapItArea[]> => {
  try {
    const url = `${MAPIT_API_URL}/point/4326/${lon},${lat}`;

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (MAPIT_API_KEY && MAPIT_API_KEY !== 'YOUR_MAPIT_API_KEY') {
      headers['X-Api-Key'] = MAPIT_API_KEY;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`MapIt API error: ${response.status}`);
    }

    const data = await response.json();
    return Object.values(data);
  } catch (error) {
    console.warn(`MapIt lookup failed for coordinates ${lat}, ${lon}`);
    return [];
  }
};

/**
 * Check if MapIt API key is configured
 * @returns true if API key is set
 */
export const isConfigured = (): boolean => {
  return MAPIT_API_KEY !== '' && MAPIT_API_KEY !== 'YOUR_MAPIT_API_KEY';
};

export default {
  lookupPostcode,
  getPostcodeCoordinates,
  getCouncilFromPostcode,
  getAllAreasForPostcode,
  lookupByCoordinates,
  isConfigured,
};
