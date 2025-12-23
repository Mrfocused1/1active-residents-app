// OpenAI service for intelligent council data enrichment
// Uses GPT to find departments, contacts, and provide context

import { ENV } from '../config/env';

const OPENAI_API_KEY = ENV.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface CouncilDepartmentInfo {
  councilName: string;
  departments: {
    name: string;
    head: string;
    role: string;
    responsibilities: string[];
    contactEmail?: string;
    contactPhone?: string;
  }[];
  chiefExecutive?: {
    name: string;
    email?: string;
  };
  councilLeader?: {
    name: string;
    party?: string;
  };
  lastUpdated: string;
}

export interface NewsSummary {
  originalTitle: string;
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

/**
 * Use OpenAI to find department heads and contact information for a UK council
 */
export const getCouncilDepartments = async (
  councilName: string
): Promise<CouncilDepartmentInfo | null> => {
  try {
    const prompt = `You are a UK local government expert. Provide accurate, up-to-date information about ${councilName} Council.

Please provide:
1. Key departments (e.g., Planning, Housing, Waste Management, Transport, Social Services)
2. For each department: the current head/director, their role, and main responsibilities
3. Chief Executive name
4. Council Leader name and party

Format your response as a valid JSON object with this structure:
{
  "councilName": "${councilName}",
  "departments": [
    {
      "name": "Department name",
      "head": "Person's full name",
      "role": "Their job title",
      "responsibilities": ["Main area 1", "Main area 2"],
      "contactEmail": "email if publicly available",
      "contactPhone": "phone if publicly available"
    }
  ],
  "chiefExecutive": {
    "name": "Full name",
    "email": "email if available"
  },
  "councilLeader": {
    "name": "Full name",
    "party": "Political party"
  },
  "lastUpdated": "${new Date().toISOString()}"
}

Only include information you're confident is current and accurate. If you don't know specific contact details, omit those fields.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate information about UK local councils. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse the JSON response
    const departmentInfo = JSON.parse(content);
    return departmentInfo;
  } catch (error) {
    console.warn(`Failed to get department info for ${councilName}:`, error);
    return null;
  }
};

/**
 * Find the right department and contact for a specific issue
 */
export const findDepartmentForIssue = async (
  councilName: string,
  issueCategory: string,
  issueDescription: string
): Promise<{
  department: string;
  contact: string;
  reason: string;
} | null> => {
  try {
    const prompt = `For ${councilName} Council, which department should handle this issue?

Issue Category: ${issueCategory}
Description: ${issueDescription}

Provide:
1. The most appropriate department name
2. The person in charge (director/head)
3. A brief explanation of why this department handles this issue

Respond with valid JSON:
{
  "department": "Department name",
  "contact": "Person's name and role",
  "reason": "Brief explanation"
}`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert on UK local government structure. Respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return null;
    }

    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to find department:', error);
    return null;
  }
};

/**
 * Summarize a news article using OpenAI
 */
export const summarizeNews = async (
  title: string,
  content: string
): Promise<NewsSummary | null> => {
  try {
    const prompt = `Summarize this UK local council news article in a concise, easy-to-read format.

Title: ${title}
Content: ${content}

Provide:
1. A brief 2-sentence summary
2. 3-4 key points as bullet points
3. Overall sentiment (positive, negative, or neutral)

Respond with valid JSON:
{
  "originalTitle": "${title}",
  "summary": "2-sentence summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "sentiment": "positive/negative/neutral"
}`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes news articles. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return null;
    }

    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to summarize news:', error);
    return null;
  }
};

/**
 * Get context and explanation for a council service or issue
 */
export const explainCouncilService = async (
  councilName: string,
  service: string
): Promise<string | null> => {
  try {
    const prompt = `Explain how ${service} works in ${councilName} Council in 2-3 sentences. Be specific and practical.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that explains UK local council services clearly and concisely.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.warn('Failed to explain service:', error);
    return null;
  }
};

/**
 * Smart categorization of issues using OpenAI
 */
export const categorizeIssue = async (
  description: string
): Promise<{
  category: string;
  priority: 'low' | 'medium' | 'high';
  suggestedAction: string;
} | null> => {
  try {
    const prompt = `Categorize this council issue:

"${description}"

Respond with valid JSON:
{
  "category": "Choose from: Potholes, Street Lights, Bins, Graffiti, Fly-tipping, Trees, Noise, Planning, Other",
  "priority": "low/medium/high based on urgency",
  "suggestedAction": "Brief suggestion for the resident"
}`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at categorizing UK council issues. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return null;
    }

    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to categorize issue:', error);
    return null;
  }
};

export default {
  getCouncilDepartments,
  findDepartmentForIssue,
  summarizeNews,
  explainCouncilService,
  categorizeIssue,
};
