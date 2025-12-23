// Report Submission Service
// Handles submitting reports directly to councils via FixMyStreet or email

import { hasFixMyStreetAPI } from './fixmystreet.service';
import councilsDatabaseService from './councilsDatabase.service';
import { Linking } from 'react-native';

export interface ReportSubmissionData {
  category: string;
  title: string;
  description: string;
  location: {
    coordinates?: [number, number];
    address?: string;
  };
  photo?: string;
  council: string;
}

export interface SubmissionResult {
  success: boolean;
  method: 'fixmystreet' | 'email' | 'failed';
  message: string;
  reportId?: string;
  error?: string;
}

/**
 * Submit a report directly to FixMyStreet API
 * Uses Open311 POST endpoint for councils that support it
 */
const submitToFixMyStreet = async (
  reportData: ReportSubmissionData
): Promise<SubmissionResult> => {
  try {
    const normalized = reportData.council.replace(/\s+Council$/i, '').trim();

    if (!hasFixMyStreetAPI(normalized)) {
      return {
        success: false,
        method: 'failed',
        message: 'Council does not have FixMyStreet API',
      };
    }

    // Get council config from fixmystreet.service
    const COUNCIL_CONFIG: { [key: string]: { subdomain: string, customDomain?: string } } = {
      'Camden': { subdomain: 'camden' },
      'Westminster': { subdomain: 'westminster' },
      'Islington': { subdomain: 'islington' },
      'Hackney': { subdomain: 'hackney' },
      'Bromley': { subdomain: 'bromley', customDomain: 'fix.bromley.gov.uk' },
      'Southwark': { subdomain: 'southwark', customDomain: 'report.southwark.gov.uk' },
      'Buckinghamshire': { subdomain: 'buckinghamshire', customDomain: 'fixmystreet.buckinghamshire.gov.uk' },
      'Oxfordshire': { subdomain: 'oxfordshire', customDomain: 'fixmystreet.oxfordshire.gov.uk' },
      'West Northamptonshire': { subdomain: 'westnorthants', customDomain: 'fix.westnorthants.gov.uk' },
    };

    const config = COUNCIL_CONFIG[normalized];
    if (!config) {
      return {
        success: false,
        method: 'failed',
        message: 'Council configuration not found',
      };
    }

    const baseUrl = config.customDomain
      ? `https://${config.customDomain}`
      : `https://fixmystreet.${config.subdomain}.gov.uk`;

    // FixMyStreet Open311 POST endpoint
    const url = `${baseUrl}/open311/v2/requests.json`;

    const formData = new URLSearchParams();
    formData.append('jurisdiction_id', config.subdomain);
    formData.append('service_code', reportData.category);
    formData.append('description', `${reportData.title}\n\n${reportData.description}`);

    if (reportData.location.coordinates) {
      formData.append('lat', reportData.location.coordinates[1].toString());
      formData.append('long', reportData.location.coordinates[0].toString());
    }

    if (reportData.location.address) {
      formData.append('address_string', reportData.location.address);
    }

    console.log(`🚀 Submitting report to FixMyStreet: ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ FixMyStreet submission failed: ${response.status}`, errorText);

      return {
        success: false,
        method: 'failed',
        message: `FixMyStreet API error: ${response.status}`,
        error: errorText,
      };
    }

    const result = await response.json();
    console.log('✅ Report submitted to FixMyStreet:', result);

    return {
      success: true,
      method: 'fixmystreet',
      message: 'Report submitted successfully to FixMyStreet',
      reportId: result[0]?.service_request_id?.toString(),
    };

  } catch (error) {
    console.error('❌ Error submitting to FixMyStreet:', error);
    return {
      success: false,
      method: 'failed',
      message: 'Network error submitting to FixMyStreet',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Submit report via email to council's department
 * Opens the device's email client with pre-filled details
 */
const submitViaEmail = async (
  reportData: ReportSubmissionData
): Promise<SubmissionResult> => {
  try {
    // Get council info from database
    const councilInfo = councilsDatabaseService.getCouncilInfo(reportData.council);

    if (!councilInfo) {
      return {
        success: false,
        method: 'failed',
        message: 'Council information not found',
      };
    }

    // Find the appropriate department for this category
    const deptInfo = councilsDatabaseService.findDepartmentForCategory(
      reportData.council,
      reportData.category
    );

    const departmentEmail = deptInfo?.department.email || councilInfo.departments.highways?.email;
    const departmentName = deptInfo?.department.name || 'General Enquiries';

    if (!departmentEmail) {
      return {
        success: false,
        method: 'failed',
        message: 'No email address found for this department',
      };
    }

    // Compose email
    const subject = encodeURIComponent(`Report: ${reportData.title}`);
    const body = encodeURIComponent(
      `Dear ${departmentName},\n\n` +
      `I would like to report the following issue:\n\n` +
      `Category: ${reportData.category}\n` +
      `Title: ${reportData.title}\n\n` +
      `Description:\n${reportData.description}\n\n` +
      (reportData.location.address ? `Location: ${reportData.location.address}\n\n` : '') +
      `Please investigate and take appropriate action.\n\n` +
      `Thank you,\n` +
      `Submitted via Active Residents App`
    );

    const mailto = `mailto:${departmentEmail}?subject=${subject}&body=${body}`;

    console.log(`📧 Opening email client for ${departmentName} at ${departmentEmail}`);

    const canOpen = await Linking.canOpenURL(mailto);
    if (!canOpen) {
      return {
        success: false,
        method: 'failed',
        message: 'Cannot open email client',
      };
    }

    await Linking.openURL(mailto);

    return {
      success: true,
      method: 'email',
      message: `Email composed to ${departmentName}. Please send it from your email app.`,
    };

  } catch (error) {
    console.error('❌ Error composing email:', error);
    return {
      success: false,
      method: 'failed',
      message: 'Error opening email client',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Main report submission function
 * Tries FixMyStreet first, falls back to email
 */
export const submitReport = async (
  reportData: ReportSubmissionData
): Promise<SubmissionResult> => {
  console.log('📝 Submitting report for council:', reportData.council);

  // Try FixMyStreet first if council supports it
  if (hasFixMyStreetAPI(reportData.council)) {
    console.log('✅ Council has FixMyStreet API, attempting direct submission...');
    const result = await submitToFixMyStreet(reportData);

    if (result.success) {
      return result;
    }

    console.warn('⚠️  FixMyStreet submission failed, falling back to email...');
  } else {
    console.log('ℹ️  Council does not have FixMyStreet API, using email...');
  }

  // Fallback to email
  return await submitViaEmail(reportData);
};

export default {
  submitReport,
  submitToFixMyStreet,
  submitViaEmail,
};
