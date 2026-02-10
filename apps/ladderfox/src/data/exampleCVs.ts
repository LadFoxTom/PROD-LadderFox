import { CVData } from '@/types/cv'
import { generatePlaceholderPhoto } from '@/lib/image-utils'

// Helper function to generate CORS-friendly placeholder photos
function getPlaceholderPhoto(fullName: string): string {
  return generatePlaceholderPhoto(fullName);
}

// Generate example CV data for each profession
// Each profession gets a unique fictional person with photo
// NOTE: All example CVs have been removed as they did not meet quality standards
export function getExampleCV(professionId: string, language: string = 'nl'): CVData {
  // All example CVs have been removed - return empty CV structure
  const examples: Record<string, CVData> = {}

  // Return empty CV structure since all examples have been removed
  return {
      template: 'modern',
    fullName: '',
    title: '',
    summary: '',
    photoUrl: '',
      contact: {
      email: '',
      phone: '',
      location: ''
    },
    experience: [],
    education: [],
      skills: {
      technical: [],
      soft: []
    },
    certifications: [],
    languages: [],
    hobbies: []
  }
}
