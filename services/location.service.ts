/**
 * Location Service
 * Handles geolocation using expo-location
 * Documentation: https://docs.expo.dev/versions/latest/sdk/location/
 */

import * as Location from 'expo-location';
import PostcodesService from './postcodes.service';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number | null;
  accuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface LocationAddress {
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  name?: string | null;
  isoCountryCode?: string | null;
  formattedAddress?: string;
}

class LocationService {
  private hasPermission: boolean = false;

  /**
   * Request location permissions from the user
   * @returns true if permission granted, false otherwise
   */
  async requestPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  /**
   * Check if location permissions are granted
   * @returns true if permission granted
   */
  async checkPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      this.hasPermission = status === 'granted';
      return this.hasPermission;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  }

  /**
   * Get current location coordinates
   * @returns Current latitude and longitude
   */
  async getCurrentLocation(): Promise<LocationCoordinates | null> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          throw new Error('Location permission not granted');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  /**
   * Get address from coordinates (reverse geocoding)
   * Uses expo-location's reverse geocoding
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Address information
   */
  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<LocationAddress | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        return {
          street: addr.street,
          city: addr.city,
          region: addr.region,
          postalCode: addr.postalCode,
          country: addr.country,
          name: addr.name,
          isoCountryCode: addr.isoCountryCode,
          formattedAddress: this.formatAddress(addr),
        };
      }

      return null;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  }

  /**
   * Get coordinates from address (forward geocoding)
   * @param address - Address string to geocode
   * @returns Coordinates
   */
  async getCoordinatesFromAddress(address: string): Promise<LocationCoordinates | null> {
    try {
      const locations = await Location.geocodeAsync(address);

      if (locations && locations.length > 0) {
        const location = locations[0];
        return {
          latitude: location.latitude,
          longitude: location.longitude,
          altitude: location.altitude,
          accuracy: location.accuracy,
        };
      }

      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  }

  /**
   * Get current location with address information
   * Combines getCurrentLocation and getAddressFromCoordinates
   * @returns Location coordinates and address
   */
  async getCurrentLocationWithAddress(): Promise<{
    coordinates: LocationCoordinates;
    address: LocationAddress;
  } | null> {
    try {
      const coordinates = await this.getCurrentLocation();
      if (!coordinates) return null;

      const address = await this.getAddressFromCoordinates(
        coordinates.latitude,
        coordinates.longitude
      );

      if (!address) return null;

      return {
        coordinates,
        address,
      };
    } catch (error) {
      console.error('Error getting current location with address:', error);
      return null;
    }
  }

  /**
   * Get UK council from current location
   * Uses postcodes.io for accurate council lookup
   * @returns Council name and code
   */
  async getCurrentCouncil(): Promise<{ name: string; code: string } | null> {
    try {
      const coordinates = await this.getCurrentLocation();
      if (!coordinates) return null;

      // Use postcodes.io to find nearest postcode and council
      const nearbyPostcodes = await PostcodesService.reverseGeocode(
        coordinates.latitude,
        coordinates.longitude,
        1
      );

      if (nearbyPostcodes && nearbyPostcodes.length > 0) {
        const postcode = nearbyPostcodes[0];
        return {
          name: postcode.admin_district,
          code: postcode.codes.admin_district,
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting current council:', error);
      return null;
    }
  }

  /**
   * Watch location changes in real-time
   * @param callback - Function to call when location updates
   * @returns Subscription object (call remove() to stop watching)
   */
  async watchLocation(
    callback: (location: LocationCoordinates) => void
  ): Promise<Location.LocationSubscription | null> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          throw new Error('Location permission not granted');
        }
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            accuracy: location.coords.accuracy,
            heading: location.coords.heading,
            speed: location.coords.speed,
          });
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error watching location:', error);
      return null;
    }
  }

  /**
   * Format address object into a readable string
   * @param address - Address object from expo-location
   * @returns Formatted address string
   */
  private formatAddress(address: Location.LocationGeocodedAddress): string {
    const parts: string[] = [];

    if (address.name) parts.push(address.name);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.postalCode) parts.push(address.postalCode);

    return parts.join(', ');
  }

  /**
   * Calculate distance between two coordinates in meters
   * @param lat1 - First latitude
   * @param lon1 - First longitude
   * @param lat2 - Second latitude
   * @param lon2 - Second longitude
   * @returns Distance in meters
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

export default new LocationService();
