// ============================================================================
// @repo/types - Shared CV data types
// ============================================================================

export interface CVSection {
  title: string
  content: string[]
  listStyle?: 'bullet' | 'number' | 'arrow'
}

export interface SocialLinks {
  linkedin?: string
  github?: string
  website?: string
  twitter?: string
  instagram?: string
  [key: string]: string | undefined
}

export interface CVData {
  // Career Stage & Industry
  careerStage?: 'student' | 'recent_graduate' | 'career_changer' | 'experienced'
  industrySector?: string
  targetRegion?: string

  // Enhanced Personal Information
  fullName?: string
  preferredName?: string
  pronouns?: string
  professionalHeadline?: string
  careerObjective?: string
  title?: string

  // Enhanced Contact Information
  contact?: {
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    website?: string
  }

  // Legal & Availability
  workAuthorization?: string
  availability?: string

  social?: SocialLinks
  summary?: string

  // Education Level
  highestEducation?: string

  // Professional Information
  experienceYears?: string
  topStrengths?: string

  // Work Experience Details
  currentCompany?: string
  currentRoleStartDate?: string
  currentRoleDescription?: string
  currentAchievements?: string
  previousExperience?: string

  // Skills
  technicalSkills?: string
  softSkills?: string

  // Education Details
  educationLevel?: string
  degreeField?: string
  university?: string
  graduationYear?: string
  gpa?: string

  // Additional Information
  certifications?: string | Array<{
    title: string
    institution?: string
    year?: string
    content?: string[]
  }>
  projects?: string | Array<{
    title: string
    organization?: string
    startDate?: string
    endDate?: string
    content?: string[]
  }>
  interests?: string

  // Enhanced Experience Structure (with backward compatibility)
  experience?: Array<{
    company?: string
    title: string
    type?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance'
    location?: string
    current?: boolean
    dates?: string
    achievements?: string[]
    content?: string[] // Legacy support
  }>

  // Enhanced Education Structure (with backward compatibility)
  education?: Array<{
    institution?: string
    degree?: string
    field?: string
    dates?: string
    achievements?: string[]
    content?: string[] // Legacy support
  }>

  // Enhanced Skills Structure (with backward compatibility)
  skills?: {
    technical?: string[]
    soft?: string[]
    tools?: string[]
    industry?: string[]
  } | string[] // Legacy support

  languages?: string[]
  hobbies?: string[]

  // Additional Sections
  volunteerWork?: CVSection[]
  awardsRecognition?: CVSection[]
  professionalMemberships?: string[]
  publicationsResearch?: CVSection[]
  references?: string

  photoUrl?: string
  photos?: string[] // Array of photo URLs for this CV
  template?: string
  layout?: {
    photoPosition?: 'left' | 'right' | 'center' | 'none'
    photoShape?: 'circle' | 'square' | 'rounded'
    photoPositionX?: number // 0-100, CSS object-position percentage
    photoPositionY?: number // 0-100, CSS object-position percentage
    photoSize?: number // Size in pixels (40-120 range)
    photoBorderColor?: string // Hex color for border
    photoBorderWidth?: number // Border width in pixels (0-8 range)
    showIcons?: boolean
    accentColor?: string
    sectionOrder?: string[]
    sectionIcons?: {
      [sectionId: string]: string
    }
    fontFamily?: string
    sectionTitles?: {
      [sectionId: string]: string
    }
    // Enhanced contact display options
    contactDisplay?: 'inline' | 'stacked' | 'centered' | 'justified' | 'separated'
    contactAlignment?: 'left' | 'center' | 'right' | 'justify'
    contactSpacing?: 'tight' | 'normal' | 'spread'
    contactSeparator?: 'none' | 'dot' | 'pipe' | 'bullet' | 'dash'
    contactIcons?: boolean
    // Enhanced social links options
    socialLinksDisplay?: 'icons' | 'text' | 'icons-text' | 'buttons' | 'minimal'
    socialLinksPosition?: 'inline' | 'below' | 'separate' | 'header-right'
    socialLinksAlignment?: 'left' | 'center' | 'right' | 'justify'
    socialLinksSpacing?: 'tight' | 'normal' | 'spread'
    socialLinksStyle?: 'default' | 'rounded' | 'outlined' | 'minimal'
    socialLinksIcons?: boolean
    socialLinksColor?: 'primary' | 'secondary' | 'accent' | 'custom'
    // Header layout options
    headerLayout?: 'standard' | 'compact' | 'spacious' | 'minimal'
    headerAlignment?: 'left' | 'center' | 'right'
    headerSpacing?: 'tight' | 'normal' | 'spread'
    // General layout
    sidebarPosition?: 'none' | 'left' | 'right'
    hiddenSections?: string[]
  }

  // Onboarding and metadata
  goal?: string
  experienceLevel?: string
  onboardingCompleted?: boolean
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface TemplateStyles {
  fontFamily: string
  primaryColor: string
  secondaryColor: string
  spacing: string
  borderStyle?: string
  headerStyle?: 'centered' | 'left-aligned' | 'modern' | 'minimalist' | 'creative'
  sectionStyle?: 'boxed' | 'underlined' | 'minimal' | 'card' | 'gradient'
  accentColor?: string
  backgroundColor?: string
  iconSet?: 'minimal' | 'solid' | 'outline' | 'none'
}

export interface CVTemplate {
  id: string
  name: string
  description: string
  preview: string
  styles: TemplateStyles
}

export interface ColorPalette {
  id: string
  name: string
  category: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
}

export interface FontFamily {
  id: string
  name: string
  category: string
  fontFamily: string
  googleFonts?: string
  description: string
}

// ============================================================================
// HireKit Widget Template System
// ============================================================================

export interface WidgetTemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'ats' | 'styled';
  atsScore: number;
  bestFor: string[];
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  lightText: string;
  fontFamily: string;
  layoutType: 'single-column' | 'sidebar';
  sidebarBg: string;
  sidebarText: string;
  headerStyle: 'centered' | 'left-aligned' | 'modern' | 'minimal';
  sectionStyle: 'underlined' | 'boxed' | 'minimal';
}

export const WIDGET_TEMPLATES: WidgetTemplateConfig[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Clean single-column layout, maximum ATS compatibility',
    category: 'ats',
    atsScore: 100,
    bestFor: ['All Industries', 'Corporate', 'Government'],
    primaryColor: '#1e40af',
    secondaryColor: '#64748b',
    textColor: '#1f2937',
    lightText: '#6b7280',
    fontFamily: 'Inter, system-ui, sans-serif',
    layoutType: 'single-column',
    sidebarBg: '#ffffff',
    sidebarText: '#1f2937',
    headerStyle: 'centered',
    sectionStyle: 'underlined',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary sidebar layout with clean lines',
    category: 'styled',
    atsScore: 85,
    bestFor: ['Tech', 'Startups', 'Creative'],
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    textColor: '#1f2937',
    lightText: '#6b7280',
    fontFamily: 'Inter, system-ui, sans-serif',
    layoutType: 'sidebar',
    sidebarBg: '#1e3a5f',
    sidebarText: '#ffffff',
    headerStyle: 'modern',
    sectionStyle: 'underlined',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate sidebar layout with polished styling',
    category: 'styled',
    atsScore: 88,
    bestFor: ['Corporate', 'Consulting', 'Business'],
    primaryColor: '#0369a1',
    secondaryColor: '#64748b',
    textColor: '#1e293b',
    lightText: '#64748b',
    fontFamily: 'Inter, system-ui, sans-serif',
    layoutType: 'sidebar',
    sidebarBg: '#0c4a6e',
    sidebarText: '#ffffff',
    headerStyle: 'modern',
    sectionStyle: 'underlined',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated dark sidebar for senior professionals',
    category: 'styled',
    atsScore: 85,
    bestFor: ['Senior Roles', 'Management', 'Finance'],
    primaryColor: '#18181b',
    secondaryColor: '#52525b',
    textColor: '#18181b',
    lightText: '#52525b',
    fontFamily: 'Georgia, serif',
    layoutType: 'sidebar',
    sidebarBg: '#1f2937',
    sidebarText: '#ffffff',
    headerStyle: 'modern',
    sectionStyle: 'underlined',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Light and airy, content-focused design',
    category: 'ats',
    atsScore: 95,
    bestFor: ['All Industries', 'Traditional', 'Corporate'],
    primaryColor: '#374151',
    secondaryColor: '#6b7280',
    textColor: '#1f2937',
    lightText: '#6b7280',
    fontFamily: 'system-ui, sans-serif',
    layoutType: 'single-column',
    sidebarBg: '#f3f4f6',
    sidebarText: '#1f2937',
    headerStyle: 'minimal',
    sectionStyle: 'minimal',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold purple sidebar for design and marketing roles',
    category: 'styled',
    atsScore: 80,
    bestFor: ['Design', 'Marketing', 'Media'],
    primaryColor: '#7c3aed',
    secondaryColor: '#a855f7',
    textColor: '#1f2937',
    lightText: '#6b7280',
    fontFamily: 'system-ui, sans-serif',
    layoutType: 'sidebar',
    sidebarBg: '#4c1d95',
    sidebarText: '#ffffff',
    headerStyle: 'modern',
    sectionStyle: 'boxed',
  },
];

// ============================================================================
// CV Builder Props - Configuration interface for the CV builder component
// ============================================================================

export interface CVBuilderProps {
  branding?: {
    primaryColor?: string
    secondaryColor?: string
    logo?: string
    companyName?: string
    fontFamily?: string
    showCompanyName?: boolean
  }
  sections?: {
    personalInfo?: { enabled: boolean; required?: boolean }
    experience?: { enabled: boolean; min?: number; max?: number }
    education?: { enabled: boolean; min?: number; max?: number }
    skills?: { enabled: boolean; format?: 'tags' | 'text' | 'rating' }
    photo?: { enabled: boolean; required?: boolean }
    languages?: { enabled: boolean }
    coverLetter?: { enabled: boolean; required?: boolean }
  }
  onComplete: (data: CVData) => void | Promise<void>
  onChange?: (data: Partial<CVData>) => void
  onError?: (error: Error) => void
  initialData?: Partial<CVData>
  context: 'b2c' | 'b2b' | 'widget'
  autoSave?: boolean
  showProgress?: boolean
}
