/**
 * Utility functions for cleaning up report titles
 */

/**
 * Cleans a report title by removing URLs, coordinates, and extracting meaningful text
 * @param title - The raw title string that may contain URLs and coordinates
 * @returns A clean, user-friendly title
 */
export const cleanReportTitle = (title: string | undefined | null): string => {
  if (!title) return 'Reported Issue';

  let cleanedTitle = title;

  // Remove URLs (http, https, ftp)
  cleanedTitle = cleanedTitle.replace(/https?:\/\/[^\s]+/gi, '');
  cleanedTitle = cleanedTitle.replace(/ftp:\/\/[^\s]+/gi, '');

  // Remove coordinate patterns like "51°32'09.2"N 0°08'49.1"W"
  cleanedTitle = cleanedTitle.replace(/\d+°\d+'[\d."]+"?[NSEW]\s*\d*°?\d*'?[\d."]*"?[NSEW]?/gi, '');

  // Remove patterns like "51.5392, -0.1426" or "51.5392,-0.1426"
  cleanedTitle = cleanedTitle.replace(/-?\d+\.\d+\s*,\s*-?\d+\.\d+/g, '');

  // Remove " or " that might be left over from coordinate removal
  cleanedTitle = cleanedTitle.replace(/\s+or\s+/gi, ' ');

  // Remove extra whitespace and trim
  cleanedTitle = cleanedTitle.replace(/\s+/g, ' ').trim();

  // Remove leading/trailing punctuation
  cleanedTitle = cleanedTitle.replace(/^[,\s\-()]+|[,\s\-()]+$/g, '').trim();

  // If the title starts with a parenthesis, try to extract the content
  if (cleanedTitle.startsWith('(')) {
    const match = cleanedTitle.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      cleanedTitle = match[1].trim();
    }
  }

  // If title is now empty or too short, return a default
  if (!cleanedTitle || cleanedTitle.length < 3) {
    return 'Reported Issue';
  }

  // Capitalize first letter
  cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);

  // Truncate if too long (for display purposes)
  if (cleanedTitle.length > 80) {
    cleanedTitle = cleanedTitle.substring(0, 77) + '...';
  }

  return cleanedTitle;
};

/**
 * Extracts a short summary from a longer description
 * @param description - The full description text
 * @param maxLength - Maximum length of the summary
 * @returns A truncated summary
 */
export const getShortSummary = (description: string | undefined | null, maxLength: number = 100): string => {
  if (!description) return '';

  // Clean up the description
  let summary = description.replace(/\s+/g, ' ').trim();

  // Remove URLs
  summary = summary.replace(/https?:\/\/[^\s]+/gi, '');

  if (summary.length <= maxLength) return summary;

  // Truncate at word boundary
  const truncated = summary.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};

export default {
  cleanReportTitle,
  getShortSummary,
};
