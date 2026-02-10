/**
 * CV Data Sanitization Utility
 * 
 * Removes sensitive personal information before sending CV data to LLM APIs.
 * This protects user privacy while still allowing the LLM to work with
 * professional information (skills, experience, education, etc.)
 * 
 * SAFE TO SEND TO LLM:
 * - Professional headline/title
 * - Skills (technical, soft)
 * - Work experience (company, role, achievements) - WITHOUT personal contact info
 * - Education (degree, institution, year) - WITHOUT personal identifiers
 * - Certifications
 * - Projects
 * - Career objectives
 * - Industry sector
 * 
 * NEVER SENT TO LLM:
 * - Full name
 * - Email address
 * - Phone number
 * - Location/address
 * - Preferred name
 * - Pronouns
 * - Work authorization
 * - Availability
 * - Social media links (LinkedIn, GitHub, etc.)
 * - Photos
 */

import { CVData } from '@/types/cv';

export interface SanitizedCVData extends Omit<CVData, 'fullName' | 'contact' | 'preferredName' | 'pronouns' | 'social' | 'photos'> {
  // Professional info only - no personal identifiers
  professionalInfo?: {
    title?: string;
    headline?: string;
    objective?: string;
  };
}

/**
 * Sanitizes CV data by removing all sensitive personal information
 * before sending to LLM APIs.
 * 
 * @param cvData - The full CV data from database
 * @returns Sanitized CV data safe to send to LLM (no personal info)
 */
export function sanitizeCVDataForLLM(cvData: CVData | null | undefined): SanitizedCVData | null {
  if (!cvData) {
    return null;
  }

  try {
    // Create a deep copy to avoid mutating original
    const sanitized: any = JSON.parse(JSON.stringify(cvData));

    // Remove sensitive personal information
    delete sanitized.fullName;
    delete sanitized.preferredName;
    delete sanitized.pronouns;
    delete sanitized.social;
    delete sanitized.photos;

    // Remove entire contact object (contains email, phone, location)
    delete sanitized.contact;

    // Remove work authorization and availability (personal info)
    delete sanitized.workAuthorization;
    delete sanitized.availability;

    // Sanitize experience entries - remove location if present
    if (Array.isArray(sanitized.experience)) {
      sanitized.experience = sanitized.experience.map((exp: any) => {
        const { location, ...rest } = exp;
        return rest;
      });
    }

    // Sanitize education entries - remove any personal identifiers
    if (Array.isArray(sanitized.education)) {
      sanitized.education = sanitized.education.map((edu: any) => {
        // Keep only professional education info
        const { institution, degree, field, year, gpa, ...rest } = edu;
        return {
          institution: institution || edu.school,
          degree: degree || edu.degree,
          field: field || edu.field,
          year: year || edu.graduationYear,
          gpa: gpa,
        };
      });
    }

    // Add professional info summary (without personal identifiers)
    sanitized.professionalInfo = {
      title: sanitized.title || sanitized.professionalHeadline,
      headline: sanitized.professionalHeadline,
      objective: sanitized.careerObjective,
    };

    // Remove any remaining personal identifiers
    // Keep only professional content
    return sanitized as SanitizedCVData;
  } catch (error) {
    console.error('[CV Data Sanitizer] Error sanitizing CV data:', error);
    // Return minimal safe structure on error
    return {
      title: cvData.title || cvData.professionalHeadline,
      professionalHeadline: cvData.professionalHeadline,
      careerObjective: cvData.careerObjective,
      experience: cvData.experience?.map(exp => ({
        title: exp.title,
        company: exp.company,
        achievements: exp.achievements,
        content: exp.content,
      })),
      education: cvData.education?.map(edu => ({
        institution: (edu as any).institution || (edu as any).school,
        degree: (edu as any).degree,
        field: (edu as any).field,
        year: (edu as any).year || (edu as any).graduationYear,
      })),
      technicalSkills: cvData.technicalSkills,
      softSkills: cvData.softSkills,
      certifications: cvData.certifications,
      projects: cvData.projects,
    } as SanitizedCVData;
  }
}

/**
 * Sanitizes CV data for API requests (removes large data like photos)
 * This is different from LLM sanitization - it's for API payload size reduction
 */
export function sanitizeCVDataForAPI(cvData: CVData | null | undefined): CVData | null {
  if (!cvData) {
    return null;
  }

  try {
    const sanitized = { ...cvData };
    
    // Remove photos array (contains large base64 data)
    if (sanitized.photos) {
      delete sanitized.photos;
    }
    
    return sanitized;
  } catch (error) {
    console.error('[CV Data Sanitizer] Error sanitizing for API:', error);
    return cvData;
  }
}

/**
 * Extracts only professional information for job matching/search
 * (used when we need some CV info but want to protect privacy)
 */
export function extractProfessionalInfo(cvData: CVData | null | undefined): {
  title?: string;
  skills?: string[];
  experience?: Array<{ title: string; company?: string }>;
  location?: string; // General location only (city/region, not full address)
} {
  if (!cvData) {
    return {};
  }

  const skills: string[] = [];
  if (cvData.technicalSkills) {
    skills.push(...cvData.technicalSkills.split(',').map(s => s.trim()));
  }
  if (Array.isArray(cvData.skills)) {
    skills.push(...(cvData.skills as string[]));
  }

  return {
    title: cvData.title || cvData.professionalHeadline,
    skills,
    experience: cvData.experience?.slice(0, 3).map(e => ({
      title: e.title,
      company: e.company,
    })),
    // Only include general location (city/region), not full address
    location: cvData.contact?.location?.split(',')[0] || cvData.targetRegion,
  };
}

