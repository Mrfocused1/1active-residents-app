// Google Gemini 1.5 Flash AI service for smart features
// Used for: Report categorization, news summarization, department matching
// Cost: FREE up to 1,500 requests/day (15 req/min), then $0.075 per 1M input tokens (50% cheaper than OpenAI)
// Speed: Very fast, 1M token context window

import { ENV } from '../config/env';

const GEMINI_API_KEY = ENV.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface CouncilDepartmentInfo {
  councilName: string;
  leader: {
    name: string;
    role: string;
    party: string;
    contact: string;
  };
  chiefExecutive: {
    name: string;
    role: string;
    contact: string;
  };
  keyDepartments: {
    name: string;
    head: string;
    contact: string;
    responsibilities: string[];
  }[];
}

export interface NewsSummary {
  originalTitle: string;
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
}

/**
 * Helper function to call Gemini API
 */
const callGemini = async (prompt: string, temperature: number = 0.3, maxTokens: number = 2000): Promise<string | null> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No content in Gemini response');
    }

    return text;
  } catch (error) {
    console.warn('Gemini API call failed:', error);
    return null;
  }
};

/**
 * Use Gemini to find department heads and contact information for a UK council
 * NOTE: This is now handled by local database for instant, accurate results
 * This function is kept for backwards compatibility but not used
 */
export const getCouncilDepartments = async (
  councilName: string
): Promise<CouncilDepartmentInfo | null> => {
  try {
    const prompt = `You are a UK local government expert. Provide accurate, up-to-date information about ${councilName} Council.

Please provide:
1. Council Leader (name, party, role)
2. Chief Executive (name, role)
3. Key departments with heads and their responsibilities

Format your response as a valid JSON object with this structure:
{
  "councilName": "${councilName}",
  "leader": {
    "name": "Full name",
    "role": "Leader of ${councilName} Council",
    "party": "Political party",
    "contact": "Email address"
  },
  "chiefExecutive": {
    "name": "Full name",
    "role": "Chief Executive",
    "contact": "Email address"
  },
  "keyDepartments": [
    {
      "name": "Department name",
      "head": "Person's full name and role",
      "contact": "Phone | Email",
      "responsibilities": ["Responsibility 1", "Responsibility 2"]
    }
  ]
}

Only include information you're confident is current and accurate.`;

    const content = await callGemini(prompt, 0.3, 2000);
    if (!content) return null;

    // Extract JSON from response (Gemini sometimes adds markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
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

    const content = await callGemini(prompt, 0.3, 300);
    if (!content) return null;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.warn('Failed to find department:', error);
    return null;
  }
};

/**
 * Summarize a news article using Gemini
 */
export const summarizeNews = async (
  title: string,
  content: string
): Promise<NewsSummary | null> => {
  try {
    const prompt = `Summarize this UK local council news article in a concise, easy-to-read format.

Title: ${title}
Content: ${content.substring(0, 3000)}

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

    const response = await callGemini(prompt, 0.5, 400);
    if (!response) return null;

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
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
    return await callGemini(prompt, 0.3, 200);
  } catch (error) {
    console.warn('Failed to explain service:', error);
    return null;
  }
};

/**
 * Smart categorization of issues using Gemini
 * This is the main AI feature users will interact with
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

    const content = await callGemini(prompt, 0.3, 200);
    if (!content) return null;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
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
