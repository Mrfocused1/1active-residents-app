// Local Council Database Service
// Provides instant access to UK council data without API calls
// Data source: councils-database.ts (manually curated and updated)

import {
  councilsDatabase,
  CouncilDepartment,
  CouncilLeadership,
  RSSFeed,
  CouncilInfo,
  CouncilsDatabase
} from '../data/councils-database';

export type {
  CouncilDepartment,
  CouncilLeadership,
  RSSFeed,
  CouncilInfo
};

const database: CouncilsDatabase = councilsDatabase;

/**
 * Normalize council name by removing "Council" suffix and extra whitespace
 */
const normalizeCouncilName = (councilName: string): string => {
  return councilName
    .replace(/\s+Council$/i, '')
    .replace(/^London\s+Borough\s+of\s+/i, '')
    .replace(/^City\s+of\s+/i, '')
    .trim();
};

/**
 * Get all available councils
 */
export const getAllCouncils = (): string[] => {
  return Object.keys(database);
};

/**
 * Check if a council exists in the database
 */
export const hasCouncilData = (councilName: string): boolean => {
  const normalized = normalizeCouncilName(councilName);
  return database[normalized] !== undefined;
};

/**
 * Get full council information
 */
export const getCouncilInfo = (councilName: string): CouncilInfo | null => {
  const normalized = normalizeCouncilName(councilName);
  return database[normalized] || null;
};

/**
 * Get council leadership information
 */
export const getCouncilLeadership = (councilName: string): CouncilLeadership | null => {
  const council = getCouncilInfo(councilName);
  return council?.leadership || null;
};

/**
 * Get all departments for a council
 */
export const getCouncilDepartments = (councilName: string): { [key: string]: CouncilDepartment } | null => {
  const council = getCouncilInfo(councilName);
  return council?.departments || null;
};

/**
 * Find the appropriate department for a given issue category
 * @param councilName - Name of the council
 * @param category - Issue category (e.g., "potholes", "bins", "trees")
 * @returns Department information or null
 */
export const findDepartmentForCategory = (
  councilName: string,
  category: string
): {
  department: CouncilDepartment;
  departmentKey: string;
  reason: string;
} | null => {
  const departments = getCouncilDepartments(councilName);
  if (!departments) return null;

  const categoryLower = category.toLowerCase();

  // Search through all departments to find one that handles this category
  for (const [key, dept] of Object.entries(departments)) {
    const matchingCategory = dept.categories.find(cat =>
      categoryLower.includes(cat.toLowerCase()) || cat.toLowerCase().includes(categoryLower)
    );

    if (matchingCategory) {
      return {
        department: dept,
        departmentKey: key,
        reason: `${dept.name} handles ${matchingCategory} issues`,
      };
    }
  }

  // If no exact match, return highways department as default (most common)
  const highways = departments.highways;
  if (highways) {
    return {
      department: highways,
      departmentKey: 'highways',
      reason: `${highways.name} is the default contact for general issues`,
    };
  }

  return null;
};

/**
 * Get RSS feed URLs for a council
 */
export const getCouncilRSSFeeds = (councilName: string): RSSFeed[] => {
  const council = getCouncilInfo(councilName);
  return council?.rssFeeds || [];
};

/**
 * Get contact information for a council
 */
export const getCouncilContact = (councilName: string): {
  phone: string;
  website: string;
} | null => {
  const council = getCouncilInfo(councilName);
  if (!council) return null;

  return {
    phone: council.phone,
    website: council.website,
  };
};

/**
 * Search councils by region
 */
export const getCouncilsByRegion = (region: string): CouncilInfo[] => {
  return Object.values(database).filter(council =>
    council.region.toLowerCase() === region.toLowerCase()
  );
};

/**
 * Get all London boroughs
 */
export const getLondonBoroughs = (): CouncilInfo[] => {
  return getCouncilsByRegion('London');
};

export default {
  getAllCouncils,
  hasCouncilData,
  getCouncilInfo,
  getCouncilLeadership,
  getCouncilDepartments,
  findDepartmentForCategory,
  getCouncilRSSFeeds,
  getCouncilContact,
  getCouncilsByRegion,
  getLondonBoroughs,
};
