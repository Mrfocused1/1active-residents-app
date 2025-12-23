/**
 * Postcodes.io Service
 * Free UK postcode lookup and geocoding
 * Documentation: https://postcodes.io/docs
 */

import { API_CONFIG, API_TIMEOUT, DEFAULT_HEADERS } from './api.config';

export interface PostcodeResult {
  postcode: string;
  quality: number;
  eastings: number;
  northings: number;
  country: string;
  nhs_ha: string;
  longitude: number;
  latitude: number;
  european_electoral_region: string;
  primary_care_trust: string;
  region: string;
  lsoa: string;
  msoa: string;
  incode: string;
  outcode: string;
  parliamentary_constituency: string;
  admin_district: string;
  parish: string;
  admin_county: string | null;
  admin_ward: string;
  ced: string | null;
  ccg: string;
  nuts: string;
  codes: {
    admin_district: string;
    admin_county: string;
    admin_ward: string;
    parish: string;
    parliamentary_constituency: string;
    ccg: string;
    ccg_id: string;
    ced: string;
    nuts: string;
    lsoa: string;
    msoa: string;
    lau2: string;
  };
}

export interface ReverseGeocodeResult {
  postcode: string;
  quality: number;
  eastings: number;
  northings: number;
  country: string;
  nhs_ha: string;
  longitude: number;
  latitude: number;
  european_electoral_region: string;
  primary_care_trust: string;
  region: string;
  lsoa: string;
  msoa: string;
  incode: string;
  outcode: string;
  parliamentary_constituency: string;
  admin_district: string;
  parish: string;
  admin_county: string | null;
  admin_ward: string;
  ced: string | null;
  ccg: string;
  nuts: string;
  distance: number;
}

class PostcodesService {
  private baseUrl = API_CONFIG.POSTCODES_IO.BASE_URL;

  /**
   * Lookup a single postcode
   * @param postcode - UK postcode (e.g., "SW1A 1AA")
   * @returns Postcode data including coordinates and administrative areas
   */
  async lookupPostcode(postcode: string): Promise<PostcodeResult | null> {
    try {
      const cleanPostcode = postcode.replace(/\s/g, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${this.baseUrl}/postcodes/${cleanPostcode}`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Postcode not found: ${postcode}`);
          return null;
        }
        throw new Error(`Postcode lookup failed: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error looking up postcode:', error);
      throw error;
    }
  }

  /**
   * Reverse geocode - find nearest postcode(s) from coordinates
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @param limit - Number of results to return (default: 10, max: 100)
   * @returns Array of nearby postcodes with distance
   */
  async reverseGeocode(
    latitude: number,
    longitude: number,
    limit: number = 10
  ): Promise<ReverseGeocodeResult[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(
        `${this.baseUrl}/postcodes?lon=${longitude}&lat=${latitude}&limit=${limit}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Reverse geocode failed: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  /**
   * Autocomplete postcode search
   * @param partial - Partial postcode to search (e.g., "SW1A")
   * @param limit - Number of results to return (default: 10)
   * @returns Array of matching postcodes
   */
  async autocomplete(partial: string, limit: number = 10): Promise<string[]> {
    try {
      const cleanPartial = partial.replace(/\s/g, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(
        `${this.baseUrl}/postcodes/${cleanPartial}/autocomplete?limit=${limit}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Autocomplete failed: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error autocompleting postcode:', error);
      throw error;
    }
  }

  /**
   * Validate a postcode
   * @param postcode - UK postcode to validate
   * @returns true if valid, false if invalid
   */
  async validatePostcode(postcode: string): Promise<boolean> {
    try {
      const cleanPostcode = postcode.replace(/\s/g, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(`${this.baseUrl}/postcodes/${cleanPostcode}/validate`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Postcode validation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error validating postcode:', error);
      return false;
    }
  }

  /**
   * Get nearest postcodes to a given postcode
   * @param postcode - Base postcode
   * @param limit - Number of results (default: 10, max: 100)
   * @returns Array of nearby postcodes with distance
   */
  async getNearestPostcodes(postcode: string, limit: number = 10): Promise<PostcodeResult[]> {
    try {
      const cleanPostcode = postcode.replace(/\s/g, '');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(
        `${this.baseUrl}/postcodes/${cleanPostcode}/nearest?limit=${limit}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Nearest postcodes lookup failed: ${response.status}`);
      }

      const data = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error getting nearest postcodes:', error);
      throw error;
    }
  }

  /**
   * Get the local authority / council for a postcode
   * @param postcode - UK postcode
   * @returns Council name and code
   */
  async getCouncilFromPostcode(postcode: string): Promise<{
    name: string;
    code: string;
  } | null> {
    try {
      const result = await this.lookupPostcode(postcode);
      if (!result) return null;

      return {
        name: result.admin_district,
        code: result.codes.admin_district,
      };
    } catch (error) {
      console.error('Error getting council from postcode:', error);
      return null;
    }
  }
}

export default new PostcodesService();
