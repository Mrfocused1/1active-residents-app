/**
 * Councils Service
 * Manages UK council and local authority data
 * Uses Postcodes.io and Location services for council lookup
 */

import PostcodesService from './postcodes.service';
import LocationService from './location.service';

export interface Region {
  id: string;
  name: string;
  icon: string;
}

export interface Council {
  id: string;
  name: string;
  location: string;
  region?: string;
  code?: string;
  website?: string;
  email?: string;
  phone?: string;
}

export interface IssueCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
  priority?: number;
}

class CouncilsService {
  /**
   * Get list of UK regions
   * @returns Array of UK regions
   */
  getRegions(): Region[] {
    return [
      { id: 'england', name: 'England', icon: 'cottage' },
      { id: 'scotland', name: 'Scotland', icon: 'landscape' },
      { id: 'wales', name: 'Wales', icon: 'hiking' },
      { id: 'northern-ireland', name: 'Northern Ireland', icon: 'sailing' },
    ];
  }

  /**
   * Get councils filtered by region
   * Uses real UK council data
   * @param regionId - Region to filter by
   * @returns Array of councils
   */
  async getCouncilsByRegion(regionId?: string): Promise<Council[]> {
    // This would ideally come from a backend API
    // For now, returning a curated list of major UK councils
    const allCouncils: Council[] = [
      // England - London (All 32 Boroughs + City of London)
      {
        id: 'barking-dagenham',
        name: 'Barking and Dagenham Council',
        location: 'London, IG11',
        region: 'england',
        code: 'E09000002',
        website: 'https://www.lbbd.gov.uk',
      },
      {
        id: 'barnet',
        name: 'Barnet Council',
        location: 'London, N3',
        region: 'england',
        code: 'E09000003',
        website: 'https://www.barnet.gov.uk',
      },
      {
        id: 'bexley',
        name: 'Bexley Council',
        location: 'London, DA5',
        region: 'england',
        code: 'E09000004',
        website: 'https://www.bexley.gov.uk',
      },
      {
        id: 'brent',
        name: 'Brent Council',
        location: 'London, HA9',
        region: 'england',
        code: 'E09000005',
        website: 'https://www.brent.gov.uk',
      },
      {
        id: 'bromley',
        name: 'Bromley Council',
        location: 'London, BR1',
        region: 'england',
        code: 'E09000006',
        website: 'https://www.bromley.gov.uk',
      },
      {
        id: 'camden',
        name: 'Camden Council',
        location: 'London, NW1',
        region: 'england',
        code: 'E09000007',
        website: 'https://www.camden.gov.uk',
      },
      {
        id: 'croydon',
        name: 'Croydon Council',
        location: 'London, CR0',
        region: 'england',
        code: 'E09000008',
        website: 'https://www.croydon.gov.uk',
      },
      {
        id: 'ealing',
        name: 'Ealing Council',
        location: 'London, W5',
        region: 'england',
        code: 'E09000009',
        website: 'https://www.ealing.gov.uk',
      },
      {
        id: 'enfield',
        name: 'Enfield Council',
        location: 'London, EN1',
        region: 'england',
        code: 'E09000010',
        website: 'https://www.enfield.gov.uk',
      },
      {
        id: 'greenwich',
        name: 'Greenwich Council',
        location: 'London, SE10',
        region: 'england',
        code: 'E09000011',
        website: 'https://www.greenwich.gov.uk',
      },
      {
        id: 'hackney',
        name: 'Hackney Council',
        location: 'London, E8',
        region: 'england',
        code: 'E09000012',
        website: 'https://www.hackney.gov.uk',
      },
      {
        id: 'hammersmith-fulham',
        name: 'Hammersmith and Fulham Council',
        location: 'London, W6',
        region: 'england',
        code: 'E09000013',
        website: 'https://www.lbhf.gov.uk',
      },
      {
        id: 'haringey',
        name: 'Haringey Council',
        location: 'London, N22',
        region: 'england',
        code: 'E09000014',
        website: 'https://www.haringey.gov.uk',
      },
      {
        id: 'harrow',
        name: 'Harrow Council',
        location: 'London, HA1',
        region: 'england',
        code: 'E09000015',
        website: 'https://www.harrow.gov.uk',
      },
      {
        id: 'havering',
        name: 'Havering Council',
        location: 'London, RM1',
        region: 'england',
        code: 'E09000016',
        website: 'https://www.havering.gov.uk',
      },
      {
        id: 'hillingdon',
        name: 'Hillingdon Council',
        location: 'London, UB8',
        region: 'england',
        code: 'E09000017',
        website: 'https://www.hillingdon.gov.uk',
      },
      {
        id: 'hounslow',
        name: 'Hounslow Council',
        location: 'London, TW3',
        region: 'england',
        code: 'E09000018',
        website: 'https://www.hounslow.gov.uk',
      },
      {
        id: 'islington',
        name: 'Islington Council',
        location: 'London, N1',
        region: 'england',
        code: 'E09000019',
        website: 'https://www.islington.gov.uk',
      },
      {
        id: 'kensington-chelsea',
        name: 'Kensington and Chelsea Council',
        location: 'London, W8',
        region: 'england',
        code: 'E09000020',
        website: 'https://www.rbkc.gov.uk',
      },
      {
        id: 'kingston',
        name: 'Kingston upon Thames Council',
        location: 'London, KT1',
        region: 'england',
        code: 'E09000021',
        website: 'https://www.kingston.gov.uk',
      },
      {
        id: 'lambeth',
        name: 'Lambeth Council',
        location: 'London, SW2',
        region: 'england',
        code: 'E09000022',
        website: 'https://www.lambeth.gov.uk',
      },
      {
        id: 'lewisham',
        name: 'Lewisham Council',
        location: 'London, SE13',
        region: 'england',
        code: 'E09000023',
        website: 'https://www.lewisham.gov.uk',
      },
      {
        id: 'merton',
        name: 'Merton Council',
        location: 'London, SW19',
        region: 'england',
        code: 'E09000024',
        website: 'https://www.merton.gov.uk',
      },
      {
        id: 'newham',
        name: 'Newham Council',
        location: 'London, E15',
        region: 'england',
        code: 'E09000025',
        website: 'https://www.newham.gov.uk',
      },
      {
        id: 'redbridge',
        name: 'Redbridge Council',
        location: 'London, IG1',
        region: 'england',
        code: 'E09000026',
        website: 'https://www.redbridge.gov.uk',
      },
      {
        id: 'richmond',
        name: 'Richmond upon Thames Council',
        location: 'London, TW9',
        region: 'england',
        code: 'E09000027',
        website: 'https://www.richmond.gov.uk',
      },
      {
        id: 'southwark',
        name: 'Southwark Council',
        location: 'London, SE1',
        region: 'england',
        code: 'E09000028',
        website: 'https://www.southwark.gov.uk',
      },
      {
        id: 'sutton',
        name: 'Sutton Council',
        location: 'London, SM1',
        region: 'england',
        code: 'E09000029',
        website: 'https://www.sutton.gov.uk',
      },
      {
        id: 'tower-hamlets',
        name: 'Tower Hamlets Council',
        location: 'London, E14',
        region: 'england',
        code: 'E09000030',
        website: 'https://www.towerhamlets.gov.uk',
      },
      {
        id: 'waltham-forest',
        name: 'Waltham Forest Council',
        location: 'London, E17',
        region: 'england',
        code: 'E09000031',
        website: 'https://www.walthamforest.gov.uk',
      },
      {
        id: 'wandsworth',
        name: 'Wandsworth Council',
        location: 'London, SW18',
        region: 'england',
        code: 'E09000032',
        website: 'https://www.wandsworth.gov.uk',
      },
      {
        id: 'westminster',
        name: 'Westminster City Council',
        location: 'London, SW1',
        region: 'england',
        code: 'E09000033',
        website: 'https://www.westminster.gov.uk',
      },
      {
        id: 'city-of-london',
        name: 'City of London Corporation',
        location: 'London, EC2',
        region: 'england',
        code: 'E09000001',
        website: 'https://www.cityoflondon.gov.uk',
      },

      // England - Other major cities
      {
        id: 'manchester',
        name: 'Manchester City Council',
        location: 'Manchester, M1',
        region: 'england',
        code: 'E08000003',
        website: 'https://www.manchester.gov.uk',
      },
      {
        id: 'birmingham',
        name: 'Birmingham City Council',
        location: 'Birmingham, B1',
        region: 'england',
        code: 'E08000025',
        website: 'https://www.birmingham.gov.uk',
      },
      {
        id: 'leeds',
        name: 'Leeds City Council',
        location: 'Leeds, LS1',
        region: 'england',
        code: 'E08000035',
        website: 'https://www.leeds.gov.uk',
      },
      {
        id: 'liverpool',
        name: 'Liverpool City Council',
        location: 'Liverpool, L1',
        region: 'england',
        code: 'E08000012',
        website: 'https://www.liverpool.gov.uk',
      },
      {
        id: 'bristol',
        name: 'Bristol City Council',
        location: 'Bristol, BS1',
        region: 'england',
        code: 'E06000023',
        website: 'https://www.bristol.gov.uk',
      },

      // Scotland
      {
        id: 'edinburgh',
        name: 'City of Edinburgh Council',
        location: 'Edinburgh, EH1',
        region: 'scotland',
        code: 'S12000036',
        website: 'https://www.edinburgh.gov.uk',
      },
      {
        id: 'glasgow',
        name: 'Glasgow City Council',
        location: 'Glasgow, G1',
        region: 'scotland',
        code: 'S12000049',
        website: 'https://www.glasgow.gov.uk',
      },
      {
        id: 'aberdeen',
        name: 'Aberdeen City Council',
        location: 'Aberdeen, AB10',
        region: 'scotland',
        code: 'S12000033',
        website: 'https://www.aberdeencity.gov.uk',
      },

      // Wales
      {
        id: 'cardiff',
        name: 'Cardiff Council',
        location: 'Cardiff, CF10',
        region: 'wales',
        code: 'W06000015',
        website: 'https://www.cardiff.gov.uk',
      },
      {
        id: 'swansea',
        name: 'Swansea Council',
        location: 'Swansea, SA1',
        region: 'wales',
        code: 'W06000011',
        website: 'https://www.swansea.gov.uk',
      },

      // Northern Ireland
      {
        id: 'belfast',
        name: 'Belfast City Council',
        location: 'Belfast, BT1',
        region: 'northern-ireland',
        code: 'N09000003',
        website: 'https://www.belfastcity.gov.uk',
      },
    ];

    if (regionId) {
      return allCouncils.filter((council) => council.region === regionId);
    }

    return allCouncils;
  }

  /**
   * Search councils by name
   * @param query - Search query
   * @returns Matching councils
   */
  async searchCouncils(query: string): Promise<Council[]> {
    const allCouncils = await this.getCouncilsByRegion();
    const lowercaseQuery = query.toLowerCase();

    return allCouncils.filter(
      (council) =>
        council.name.toLowerCase().includes(lowercaseQuery) ||
        council.location.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Get council by postcode using Postcodes.io
   * @param postcode - UK postcode
   * @returns Council information
   */
  async getCouncilByPostcode(postcode: string): Promise<Council | null> {
    try {
      const result = await PostcodesService.getCouncilFromPostcode(postcode);
      if (!result) return null;

      // Try to find in our database, otherwise create from API result
      const allCouncils = await this.getCouncilsByRegion();
      const foundCouncil = allCouncils.find((c) => c.code === result.code);

      if (foundCouncil) {
        return foundCouncil;
      }

      // Return council from API data
      return {
        id: result.code.toLowerCase(),
        name: result.name,
        location: postcode,
        code: result.code,
      };
    } catch (error) {
      console.error('Error getting council by postcode:', error);
      return null;
    }
  }

  /**
   * Get nearest council based on current location
   * @returns Council information
   */
  async getNearestCouncil(): Promise<Council | null> {
    try {
      const councilData = await LocationService.getCurrentCouncil();
      if (!councilData) return null;

      // Try to find in our database
      const allCouncils = await this.getCouncilsByRegion();
      const foundCouncil = allCouncils.find((c) => c.code === councilData.code);

      if (foundCouncil) {
        return foundCouncil;
      }

      // Return council from location service
      return {
        id: councilData.code.toLowerCase(),
        name: councilData.name,
        location: 'Current Location',
        code: councilData.code,
      };
    } catch (error) {
      console.error('Error getting nearest council:', error);
      return null;
    }
  }

  /**
   * Get issue categories
   * These could be customized per council in a real implementation
   * @param councilId - Optional council ID to get council-specific categories
   * @returns Array of issue categories
   */
  getIssueCategories(councilId?: string): IssueCategory[] {
    return [
      {
        id: 'roads',
        name: 'Roads & Pavements',
        icon: 'edit-road',
        description: 'Potholes, damaged pavements, road markings',
        priority: 1,
      },
      {
        id: 'rubbish',
        name: 'Rubbish & Recycling',
        icon: 'recycling',
        description: 'Missed collections, fly-tipping, overflowing bins',
        priority: 2,
      },
      {
        id: 'lighting',
        name: 'Street Lighting',
        icon: 'lightbulb',
        description: 'Broken streetlights, flickering lights',
        priority: 3,
      },
      {
        id: 'parks',
        name: 'Parks & Green Spaces',
        icon: 'park',
        description: 'Damaged equipment, overgrown areas, graffiti',
        priority: 4,
      },
      {
        id: 'noise',
        name: 'Noise Nuisance',
        icon: 'volume-up',
        description: 'Loud music, construction noise, anti-social behaviour',
        priority: 5,
      },
      {
        id: 'graffiti',
        name: 'Graffiti',
        icon: 'brush',
        description: 'Vandalism, graffiti on public property',
        priority: 6,
      },
      {
        id: 'parking',
        name: 'Illegal Parking',
        icon: 'local-parking',
        description: 'Blocked driveways, dangerous parking',
        priority: 7,
      },
      {
        id: 'other',
        name: 'Other Issue',
        icon: 'more-horiz',
        description: 'Report something else',
        priority: 8,
      },
    ];
  }

  /**
   * Get council details by ID
   * @param councilId - Council ID
   * @returns Council information
   */
  async getCouncilById(councilId: string): Promise<Council | null> {
    const allCouncils = await this.getCouncilsByRegion();
    return allCouncils.find((c) => c.id === councilId) || null;
  }
}

export default new CouncilsService();
