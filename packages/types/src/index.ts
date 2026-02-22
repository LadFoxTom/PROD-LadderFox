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

  // Screening question answers (for job applications)
  screeningAnswers?: ScreeningAnswer[]

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
// Job Listing Widget Template System
// ============================================================================

export interface JobListingTemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'bold' | 'editorial';
  fontFamily: string;
  googleFontsUrl?: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  textSecondary: string;
  textMuted: string;
  borderColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderRadius: string;
  cardStyle: 'bordered' | 'shadow' | 'accent-left' | 'flat';
  layout: 'cards' | 'list' | 'table' | 'compact';
}

export const JOB_LISTING_TEMPLATES: JobListingTemplateConfig[] = [
  {
    id: 'simple',
    name: 'Simple',
    description: 'Clean and minimal with color-coded department badges',
    category: 'minimal',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    bgColor: '#FAFAF8',
    surfaceColor: '#FFFFFF',
    textColor: '#1F2937',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    borderColor: '#E5E7EB',
    accentColor: '#4F46E5',
    badgeBg: '#EEF2FF',
    badgeText: '#4F46E5',
    borderRadius: '12px',
    cardStyle: 'shadow',
    layout: 'cards',
  },
  {
    id: 'swiss',
    name: 'Swiss',
    description: 'Brutalist editorial style with monospace typography',
    category: 'bold',
    fontFamily: "'Space Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
    bgColor: '#E3DCCF',
    surfaceColor: '#E3DCCF',
    textColor: '#0A0A0A',
    textSecondary: '#3A3A3A',
    textMuted: '#6A6A6A',
    borderColor: '#0A0A0A',
    accentColor: '#FF2A00',
    badgeBg: '#0A0A0A',
    badgeText: '#E3DCCF',
    borderRadius: '0px',
    cardStyle: 'bordered',
    layout: 'list',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Hacker-inspired dark theme with green-on-black aesthetic',
    category: 'bold',
    fontFamily: "'JetBrains Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
    bgColor: '#0A0A0A',
    surfaceColor: '#111111',
    textColor: '#00FF41',
    textSecondary: '#00CC33',
    textMuted: '#338033',
    borderColor: '#1A3A1A',
    accentColor: '#00FF41',
    badgeBg: '#0D1F0D',
    badgeText: '#00FF41',
    borderRadius: '0px',
    cardStyle: 'bordered',
    layout: 'list',
  },
  {
    id: 'saas-gradient',
    name: 'SaaS Gradient',
    description: 'Warm gradient background with large rounded cards',
    category: 'minimal',
    fontFamily: "'Outfit', sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
    bgColor: '#FDF6F0',
    surfaceColor: '#FFFFFF',
    textColor: '#2A2A2A',
    textSecondary: '#6B6B6B',
    textMuted: '#A89B95',
    borderColor: '#F0E6DE',
    accentColor: '#F29D68',
    badgeBg: '#FEF3E2',
    badgeText: '#D4782A',
    borderRadius: '20px',
    cardStyle: 'accent-left',
    layout: 'cards',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Newspaper-inspired design with serif headings and red rules',
    category: 'editorial',
    fontFamily: "'Bodoni Moda', serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;700&family=Inter:wght@400;500;600&display=swap',
    bgColor: '#F5F5F0',
    surfaceColor: '#F5F5F0',
    textColor: '#050505',
    textSecondary: '#3A3A3A',
    textMuted: '#7A7A7A',
    borderColor: '#050505',
    accentColor: '#D93025',
    badgeBg: '#050505',
    badgeText: '#F5F5F0',
    borderRadius: '0px',
    cardStyle: 'flat',
    layout: 'list',
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    description: 'Dark glassmorphism with purple gradient and glass effects',
    category: 'bold',
    fontFamily: "'Outfit', sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
    bgColor: '#0A0E1A',
    surfaceColor: 'rgba(255,255,255,0.06)',
    textColor: '#E5E5E5',
    textSecondary: '#A0A0B0',
    textMuted: '#6A6A7A',
    borderColor: 'rgba(255,255,255,0.1)',
    accentColor: '#8B5CF6',
    badgeBg: 'rgba(139,92,246,0.15)',
    badgeText: '#C4B5FD',
    borderRadius: '16px',
    cardStyle: 'bordered',
    layout: 'cards',
  },
  {
    id: 'compact-table',
    name: 'Compact Table',
    description: 'Bold orange brutalist table with monospace typography',
    category: 'bold',
    fontFamily: "'JetBrains Mono', monospace",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
    bgColor: '#FF4F2A',
    surfaceColor: '#FFFFFF',
    textColor: '#000000',
    textSecondary: '#333333',
    textMuted: '#666666',
    borderColor: '#000000',
    accentColor: '#FF4F2A',
    badgeBg: '#000000',
    badgeText: '#FFFFFF',
    borderRadius: '0px',
    cardStyle: 'bordered',
    layout: 'table',
  },
  {
    id: 'department',
    name: 'Department',
    description: 'Grouped by department with color-coded sections',
    category: 'minimal',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    bgColor: '#FAFAF8',
    surfaceColor: '#FFFFFF',
    textColor: '#2D2D2D',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    borderColor: '#E5E5E5',
    accentColor: '#4A7A45',
    badgeBg: '#E8F0E4',
    badgeText: '#4A7A45',
    borderRadius: '12px',
    cardStyle: 'bordered',
    layout: 'list',
  },
  {
    id: 'two-panel',
    name: 'Two Panel',
    description: 'Browser-chrome inspired split view with gold accents',
    category: 'editorial',
    fontFamily: "'DM Sans', sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
    bgColor: '#1C2122',
    surfaceColor: '#24292A',
    textColor: '#E5E5E5',
    textSecondary: '#8A9294',
    textMuted: '#5A6466',
    borderColor: '#C6A666',
    accentColor: '#C6A666',
    badgeBg: 'rgba(198,166,102,0.15)',
    badgeText: '#C6A666',
    borderRadius: '8px',
    cardStyle: 'bordered',
    layout: 'list',
  },
  {
    id: 'vibrant-bento',
    name: 'Vibrant Bento',
    description: 'Colorful bento-grid cards with playful department colors',
    category: 'bold',
    fontFamily: "'DM Sans', sans-serif",
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
    bgColor: '#F8F7F4',
    surfaceColor: '#FFFFFF',
    textColor: '#1A1A1A',
    textSecondary: '#555555',
    textMuted: '#999999',
    borderColor: '#E8E6E1',
    accentColor: '#FF6B35',
    badgeBg: '#FFF0E8',
    badgeText: '#FF6B35',
    borderRadius: '16px',
    cardStyle: 'shadow',
    layout: 'cards',
  },
];

// ============================================================================
// CV Builder Props - Configuration interface for the CV builder component
// ============================================================================

// ============================================================================
// Screening Questions
// ============================================================================

export interface ScreeningQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'boolean';
  label: string;
  required: boolean;
  options?: string[];
}

export interface ScreeningAnswer {
  questionId: string;
  answer: string | boolean;
}

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
  screeningQuestions?: ScreeningQuestion[];
  onComplete: (data: CVData) => void | Promise<void>
  onChange?: (data: Partial<CVData>) => void
  onError?: (error: Error) => void
  initialData?: Partial<CVData>
  context: 'b2c' | 'b2b' | 'widget'
  autoSave?: boolean
  showProgress?: boolean
}
