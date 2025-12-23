// Perplexity API service for fetching department and department head information

import { ENV } from '../config/env';

const PERPLEXITY_API_KEY = ENV.PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface DepartmentInfo {
  department: string;
  departmentHead: string;
  confidence: number;
}

/**
 * Fetch department and department head information using Perplexity AI
 * @param issueTitle - The title of the issue being reported
 * @param issueDescription - Optional description for more context
 * @param location - Optional location for local council context
 * @returns Department information including department name and head
 */
export const getDepartmentInfo = async (
  issueTitle: string,
  issueDescription?: string,
  location?: string
): Promise<DepartmentInfo> => {
  try {
    const locationContext = location
      ? `in ${location}`
      : 'in a UK local council';

    const prompt = `For the issue "${issueTitle}"${issueDescription ? ` - ${issueDescription}` : ''} ${locationContext}, provide:
1. The specific council department that would handle this issue
2. The typical job title of the person who heads that department (e.g., "Head of Highways", "Director of Waste Services")

Respond in this exact JSON format:
{
  "department": "Department Name",
  "departmentHead": "Job Title of Department Head"
}

Only provide the JSON response, no additional text.`;

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate information about UK local council departments and their leadership. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      // Silently fail - API key may not be configured
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Perplexity API');
    }

    const content = data.choices[0].message.content;

    // Parse JSON from the response
    let parsedData;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = JSON.parse(content);
      }
    } catch (parseError) {
      // Silently fail and return fallback data
      throw new Error('Failed to parse department information');
    }

    return {
      department: parsedData.department || 'General Services',
      departmentHead: parsedData.departmentHead || 'Council Team',
      confidence: 0.9,
    };
  } catch (error) {
    // Silently return fallback data when API is unavailable
    return {
      department: 'General Services',
      departmentHead: 'Council Team',
      confidence: 0.0,
    };
  }
};

/**
 * Batch fetch department information for multiple issues
 * @param issues - Array of issue objects with title and optional description
 * @returns Array of department information
 */
export const getBatchDepartmentInfo = async (
  issues: Array<{ title: string; description?: string }>
): Promise<DepartmentInfo[]> => {
  const promises = issues.map(issue =>
    getDepartmentInfo(issue.title, issue.description)
  );

  return Promise.all(promises);
};

export interface DepartmentHeadDetails {
  name: string;
  title: string;
  department: string;
  council: string;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  confidence: number;
  sources: string[];
}

/**
 * Search for actual department head name using Perplexity with web search
 * @param councilName - Name of the council/borough
 * @param issueCategory - Category of the issue (roads, rubbish, etc.)
 * @param departmentName - Optional specific department name
 * @returns Department head details with name and contact info
 */
export const getDepartmentHeadName = async (
  councilName: string,
  issueCategory: string,
  departmentName?: string
): Promise<DepartmentHeadDetails> => {
  try {
    const categoryToDepartment: Record<string, string> = {
      roads: 'Highways and Transportation',
      rubbish: 'Waste Management and Recycling',
      lighting: 'Street Lighting and Public Realm',
      parks: 'Parks and Green Spaces',
      noise: 'Environmental Health',
      graffiti: 'Community Safety and Enforcement',
      parking: 'Parking and Traffic Management',
      other: 'General Services',
    };

    const department = departmentName || categoryToDepartment[issueCategory] || 'General Services';

    const prompt = `Search Google, LinkedIn, and official sources to find the current head of ${department} at ${councilName}.

I need:
1. Full name of the person currently in this role
2. Their exact job title
3. Contact information (email, phone if publicly available)
4. LinkedIn profile URL if available

Search the following sources:
- ${councilName} official website and staff directory
- LinkedIn for current employees of ${councilName} in ${department} roles
- Recent council meeting minutes and press releases
- Local government news articles

Respond in this exact JSON format:
{
  "name": "Full Name",
  "title": "Official Job Title",
  "department": "${department}",
  "council": "${councilName}",
  "contact": {
    "email": "email@council.gov.uk or null",
    "phone": "phone number or null",
    "linkedin": "LinkedIn URL or null"
  },
  "sources": ["source1 URL", "source2 URL"]
}

Only provide the JSON response. If you cannot find a specific person, use "Not publicly listed" for name.`;

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro', // Using pro model for web search
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant that searches the web for accurate, up-to-date information about UK local council staff. Always cite your sources and respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 800,
        search_domain_filter: ['gov.uk', 'linkedin.com'],
        return_citations: true,
      }),
    });

    if (!response.ok) {
      // Silently fail - API key may not be configured
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const citations = data.citations || [];

    // Check if Perplexity couldn't find the information
    if (content.includes('cannot provide') || content.includes('No relevant search results')) {
      // This is expected - not all department heads are publicly listed
      return {
        name: 'Not publicly listed',
        title: 'Department Head',
        department: departmentName || 'General Services',
        council: councilName,
        confidence: 0.0,
        sources: [],
      };
    }

    let parsedData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = JSON.parse(content);
      }
    } catch (parseError) {
      // Silently handle parse errors - this is expected when info isn't available
      return {
        name: 'Not publicly listed',
        title: 'Department Head',
        department: departmentName || 'General Services',
        council: councilName,
        confidence: 0.0,
        sources: [],
      };
    }

    return {
      name: parsedData.name || 'Not publicly listed',
      title: parsedData.title || `Head of ${department}`,
      department: department,
      council: councilName,
      contact: {
        email: parsedData.contact?.email || undefined,
        phone: parsedData.contact?.phone || undefined,
        linkedin: parsedData.contact?.linkedin || undefined,
      },
      confidence: parsedData.name !== 'Not publicly listed' ? 0.85 : 0.3,
      sources: parsedData.sources || citations,
    };
  } catch (error) {
    // Silently return fallback - this is expected behavior
    return {
      name: 'Not publicly listed',
      title: 'Department Head',
      department: departmentName || 'General Services',
      council: councilName,
      confidence: 0.0,
      sources: [],
    };
  }
};

export interface BoroughInfo {
  councilName: string;
  recentNews: Array<{
    title: string;
    summary: string;
    date: string;
    source: string;
    url?: string;
  }>;
  recentUpdates: Array<{
    title: string;
    description: string;
    date: string;
    category: string;
  }>;
  alerts: Array<{
    title: string;
    description: string;
    date: string;
    severity: 'high' | 'medium' | 'low';
    url?: string;
  }>;
  statistics?: {
    population?: string;
    area?: string;
    councilType?: string;
  };
  keyContacts: Array<{
    role: string;
    name: string;
    department: string;
  }>;
  confidence: number;
}

/**
 * Search for local borough information, news, and updates using Perplexity
 * @param councilName - Name of the council/borough
 * @param councilWebsite - Optional council website URL for focused search
 * @returns Comprehensive borough information including news and updates
 */
export const getBoroughInformation = async (
  councilName: string,
  councilWebsite?: string
): Promise<BoroughInfo> => {
  try {
    const websiteContext = councilWebsite
      ? `Focus primarily on ${councilWebsite} and related official sources.`
      : '';

    const prompt = `Search for comprehensive, up-to-date information about ${councilName}. ${websiteContext}

Please find:
1. Recent news (last 3-6 months) about the council or area
2. Recent council updates, initiatives, or service changes
3. Current alerts or urgent notices (weather warnings, road closures, service disruptions, emergency announcements)
4. Key statistics about the borough
5. Important contacts and department heads

Search these sources:
- ${councilWebsite || councilName + ' official website'}
- Local news websites covering ${councilName}
- Council press releases and news pages
- Recent council meeting minutes
- Government databases and statistics
- Met Office weather warnings for the area

Respond in this exact JSON format:
{
  "councilName": "${councilName}",
  "recentNews": [
    {
      "title": "News headline",
      "summary": "Brief summary",
      "date": "YYYY-MM-DD",
      "source": "Source name",
      "url": "URL if available"
    }
  ],
  "recentUpdates": [
    {
      "title": "Update title",
      "description": "What changed or was announced",
      "date": "YYYY-MM-DD",
      "category": "service|policy|infrastructure|community"
    }
  ],
  "alerts": [
    {
      "title": "Alert title",
      "description": "Detailed description of the alert",
      "date": "YYYY-MM-DD",
      "severity": "high|medium|low",
      "url": "URL if available"
    }
  ],
  "statistics": {
    "population": "Population figure",
    "area": "Area in sq km or sq miles",
    "councilType": "Metropolitan/London Borough/etc"
  },
  "keyContacts": [
    {
      "role": "Council Leader/Chief Executive/etc",
      "name": "Full name",
      "department": "Department name"
    }
  ]
}

Include at least 3-5 recent news items and updates. If there are no current alerts, return an empty alerts array. Only provide JSON response.`;

    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a local government research assistant that provides accurate, current information about UK councils and boroughs. Always cite sources and respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
        search_recency_filter: 'month', // Focus on recent information
        return_citations: true,
      }),
    });

    if (!response.ok) {
      // Silently fail - API key may not be configured
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsedData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = JSON.parse(content);
      }
    } catch (parseError) {
      // Silently fail and return empty data
      throw new Error('Failed to parse borough information');
    }

    return {
      councilName: parsedData.councilName || councilName,
      recentNews: parsedData.recentNews || [],
      recentUpdates: parsedData.recentUpdates || [],
      alerts: parsedData.alerts || [],
      statistics: parsedData.statistics || {},
      keyContacts: parsedData.keyContacts || [],
      confidence: 0.8,
    };
  } catch (error) {
    // Silently return empty data when API is unavailable
    return {
      councilName,
      recentNews: [],
      recentUpdates: [],
      alerts: [],
      keyContacts: [],
      confidence: 0.0,
    };
  }
};
