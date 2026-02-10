# LadderFox Technical Architecture & Migration Guide for HireKit

> Document prepared for HireKit architect team
> Date: 2026-02-10

---

## 1. Current Tech Stack

### Framework
- **Next.js 14.2.30** with **App Router** (`src/app/` directory structure)
- **React 18.0.0**
- **TypeScript 5.0.0**

### Database
- **PostgreSQL** via **Neon** (serverless)
- **Region:** `eu-west-2` (AWS London)
- **Database name:** `neondb`
- **Connection:** `ep-round-flower-abq5i4zf-pooler.eu-west-2.aws.neon.tech`
- **ORM:** Prisma 6.13.0
- **UAT database:** Supabase PostgreSQL (`db.bnxwpsyiahnrmfudsrxv.supabase.co`)

### Authentication
- **NextAuth.js 4.24.7** with Prisma adapter
- **Providers:**
  - Google OAuth (GOOGLE_CLIENT_ID/SECRET)
  - Custom email/password credentials (bcryptjs hashing)
- **Session strategy:** JWT (30-day duration)
- **Config:** `src/lib/auth.ts`

### File Storage
- **Uploadthing 6.3.0**
- Profile images (max 4MB), CV documents/PDFs (max 8MB), template previews (max 2MB)
- Authenticated uploads with NextAuth integration
- Config: `src/app/api/uploadthing/core.ts`

### Email Service
- **Primary:** Resend 6.7.0 (domain: `noreply@ladderfox.com`)
- **Fallback:** Nodemailer via Gmail SMTP (`smtp.gmail.com:587`)
- Config: `src/lib/email.ts`

### Payment Processing
- **Stripe 14.12.0** (server) + **@stripe/stripe-js 2.4.0** (client)
- API version: 2023-10-16
- **Plans:**
  - Free: Limited features, no PDF export, 10 chat prompts/day
  - Basic: €14.99/month (7-day trial with €3.99 setup fee)
  - Pro: Coming soon (€19.99/month planned)
- **Billing intervals:** Monthly, Quarterly (17% savings), Yearly (53% savings)
- **Multi-currency:** EUR and USD
- Webhook handler: `src/app/api/stripe/webhook/route.ts`
- Customer portal: `src/app/api/stripe/customer-portal/route.ts`

### AI/LLM
- **OpenAI 4.98.0** (GPT-4 Turbo, GPT-4o for vision)
- **LangChain:** `@langchain/core 1.1.0`, `@langchain/openai 1.1.3`, `@langchain/langgraph 1.0.2`
- Multi-agent system with orchestration

### State Management
- **Zustand 5.0.8** (global state)
- **Immer 10.1.1** (immutable patterns)

### Analytics & Monitoring
- Google Analytics (`G-BT59N8YB46`)
- Hotjar (user behavior tracking)
- Contentsquare (UX analytics)
- Custom analytics via `src/lib/analytics.ts`

---

## 2. Project Structure

### Top-Level Directory Layout

```
cv-ai-builder/
├── prisma/
│   ├── schema.prisma          # Complete database schema
│   └── migrations/            # Database migrations
├── public/
│   └── templates/             # Template preview images
├── scripts/
│   ├── deploy-uat.sh          # UAT deployment (Linux/Mac)
│   └── deploy-uat.bat         # UAT deployment (Windows)
├── src/
│   ├── app/                   # Next.js App Router pages & API routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page / main CV builder
│   │   ├── globals.css        # Global styles (19,801 bytes)
│   │   ├── api/               # 70+ API routes
│   │   ├── dashboard/         # CV & letter management
│   │   ├── cv-preview/        # CV preview
│   │   ├── print-cv/          # Print-optimized view
│   │   ├── print-cv-server/   # Server-side print rendering
│   │   ├── upload-cv/         # PDF upload interface
│   │   ├── examples/          # Example CVs/letters by profession
│   │   ├── auth/              # Login, signup, password reset
│   │   ├── settings/          # User settings
│   │   ├── subscription/      # Billing management
│   │   ├── pricing/           # Pricing page
│   │   ├── applications/      # Job application tracker
│   │   ├── templates/         # Template gallery
│   │   ├── adminx/            # Admin panel
│   │   └── [info pages]       # privacy, terms, contact, faq, about
│   ├── components/            # 107+ React components
│   │   ├── chat/              # Chat interface components
│   │   ├── pdf/               # PDF generation & viewing
│   │   ├── flow/              # Flow editor (ReactFlow)
│   │   ├── flow-designer/     # Admin flow designer
│   │   ├── ui/                # Custom UI components
│   │   ├── smart-mapping/     # AI field mapping
│   │   ├── landing/           # Landing page sections
│   │   ├── nodes/             # Flow node components
│   │   ├── panels/            # UI panels
│   │   ├── providers/         # Context providers
│   │   ├── examples/          # Example page components
│   │   └── [70+ root-level components]
│   ├── types/
│   │   ├── cv.ts              # CV data types (1,209 lines)
│   │   ├── letter.ts          # Cover letter types
│   │   ├── flow.ts            # Flow system types
│   │   ├── questions.ts       # Question types
│   │   └── [other type defs]
│   ├── lib/
│   │   ├── agents/            # AI agent implementations
│   │   ├── services/          # Business logic services
│   │   ├── pdf/               # PDF utilities
│   │   ├── workflows/         # Business workflows
│   │   ├── utils/             # Utility functions
│   │   ├── state/schemas.ts   # Zod validation schemas
│   │   ├── smart-cv-mapper.ts # CV mapping logic (1,323 lines)
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Database service layer
│   │   ├── stripe.ts          # Stripe integration
│   │   ├── subscription.ts    # Subscription management
│   │   ├── email.ts           # Email service
│   │   ├── analytics.ts       # Analytics
│   │   ├── validation.ts      # Data validation
│   │   ├── cv-analysis.ts     # CV analysis logic
│   │   └── [20+ utility files]
│   ├── stores/                # Zustand state stores
│   │   ├── enhancedFlowStore.ts
│   │   └── flowStore.ts
│   ├── data/                  # Static data & configurations
│   │   ├── professions.ts     # Profession data (644 KB)
│   │   ├── advancedCVFlow.ts  # Advanced question flow (33 KB)
│   │   ├── basicCVFlow.ts     # Basic question flow (19 KB)
│   │   ├── exampleCVs.ts      # Example CV data
│   │   ├── sampleCVData.ts    # Sample CV data
│   │   ├── letterQuestions.ts  # Letter question sets
│   │   └── letterTemplates.ts # Letter templates
│   ├── context/               # React Contexts (Auth, Locale)
│   ├── hooks/                 # Custom React hooks
│   ├── translations/          # i18n translations (20 languages)
│   ├── styles/                # Additional styles
│   └── middleware.ts          # Security & routing middleware
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
├── vercel.json                # Vercel deployment config
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

### CV Components Location

All in `src/components/`:
| Component | Lines | Purpose |
|-----------|-------|---------|
| `CVEditor.tsx` | 938 | Main CV editing interface |
| `CVPreview.tsx` | 1,322 | Client-side CV preview |
| `CVPreviewServer.tsx` | 31,791 | Server-side CV rendering |
| `CVAnalysis.tsx` | - | CV scoring & analysis |
| `CVTextEditorModal.tsx` | - | Section text editing modal |
| `CVUploadModal.tsx` | - | PDF upload & import |
| `CVPhotoUploader.tsx` | - | Photo upload & positioning |
| `CVSelectionModal.tsx` | - | CV selector modal |
| `CVPdfDocument.tsx` | - | PDF document renderer |
| `CVOptimizationSuggestions.tsx` | - | AI optimization suggestions |
| `EnhancedCVChatInterface.tsx` | - | Chat-based CV building |
| `PaginatedCVPreview.tsx` | - | Multi-page preview |
| `LayoutControls.tsx` | - | Layout customization |
| `ATSChecker.tsx` | 38,344 | ATS compatibility checker |

### Component Library & Styling
- **No shadcn/ui** - Custom components throughout
- **Icons:** React Icons 5.5.0 (primary), Lucide React 0.542.0, Heroicons 2.2.0
- **Animations:** Framer Motion 10.18.0
- **Rich Text:** React Quill 2.0.0
- **Drag & Drop:** React DnD 16.0.1, @dnd-kit/core 6.3.1
- **Toasts:** react-hot-toast 2.5.2
- **Flow Editor:** ReactFlow 11.11.4
- **Tailwind CSS 3.0.0** with custom config:
  - `@tailwindcss/forms` plugin
  - `@tailwindcss/nesting` plugin
  - Brand colors: Light (#8ECAE6), Blue (#219EBC), Dark (#023047), Yellow (#FFB703), Orange (#FB8500)
  - CSS variable-based theme system (`--bg-primary`, `--text-primary`, `--border-subtle`, etc.)
  - 20+ font families pre-configured

---

## 3. Prisma Schema (Key Models)

```prisma
// === USERS & AUTH ===
model User {
  id              String           @id @default(cuid())
  email           String           @unique
  name            String?
  image           String?
  password        String?          // bcryptjs hashed
  questionCount   Int              @default(0)  // lifetime questions asked
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  cvs             CV[]
  letters         Letter[]
  jobApplications JobApplication[]
  jobMatches      JobMatch[]
  cvAnalyses      CVAnalysis[]
  agentConversations AgentConversation[]
  subscription    Subscription?
  accounts        Account[]
  sessions        Session[]
}

// === CV ===
model CV {
  id              String           @id @default(cuid())
  userId          String
  title           String
  template        String?
  content         Json             // Full CVData as JSON
  tags            String?
  category        String?
  keywords        String?
  isPublic        Boolean          @default(false)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobApplications JobApplication[]
  jobMatches      JobMatch[]
  analyses        CVAnalysis[]
}

// === COVER LETTERS ===
model Letter {
  id              String           @id @default(cuid())
  userId          String
  title           String
  content         Json             // Letter data as JSON
  type            String           // 'cover', 'reference', etc.
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  jobApplications JobApplication[]
}

// === SUBSCRIPTION ===
model Subscription {
  id                    String   @id @default(cuid())
  userId                String   @unique
  plan                  String   @default("free")  // free, basic, pro, team
  status                String   @default("active") // active, canceled, past_due, trialing
  stripeCustomerId      String?
  stripeSubscriptionId  String?
  stripePriceId         String?
  billingCycle          String?  // monthly, quarterly, yearly
  features              Json?    // feature flags per plan
  usageQuotas           Json?    // usage limits
  billingHistory        Json?
  currentPeriodStart    DateTime?
  currentPeriodEnd      DateTime?
  cancelAtPeriodEnd     Boolean  @default(false)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// === JOB TRACKING ===
model JobApplication {
  id           String   @id @default(cuid())
  userId       String
  cvId         String?
  letterId     String?
  jobTitle     String
  company      String
  jobUrl       String?
  description  String?
  location     String?
  salary       String?
  status       String   @default("saved") // saved, applied, interviewing, offered, rejected, withdrawn
  followUpDate DateTime?
  notes        String?
  responseTime Int?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  cv           CV?      @relation(fields: [cvId], references: [id])
  letter       Letter?  @relation(fields: [letterId], references: [id])
}

model JobMatch {
  id              String   @id @default(cuid())
  userId          String
  cvId            String?
  jobTitle        String
  company         String
  matchScore      Int      // 0-100
  matchReason     String?
  keywordMatches  Json?
  source          String?
  sourceJobId     String?
  viewed          Boolean  @default(false)
  saved           Boolean  @default(false)
  applied         Boolean  @default(false)
  dismissed       Boolean  @default(false)
  createdAt       DateTime @default(now())
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  cv              CV?      @relation(fields: [cvId], references: [id])
}

// === CV ANALYSIS ===
model CVAnalysis {
  id            String   @id @default(cuid())
  userId        String
  cvId          String
  overallScore  Int      // 0-100
  atsScore      Int      // 0-100
  contentScore  Int      // 0-100
  strengths     Json     // string[]
  weaknesses    Json     // string[]
  suggestions   Json     // string[]
  analysisData  Json?    // detailed breakdown
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  cv            CV       @relation(fields: [cvId], references: [id], onDelete: Cascade)
}

// === AI AGENT CONVERSATIONS ===
model AgentConversation {
  id         String   @id @default(cuid())
  userId     String
  sessionId  String   @unique
  messages   Json     // conversation messages
  context    Json?    // conversation context
  agentType  String   // which agent type
  status     String   @default("active") // active, completed, error
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// === ADMIN: FLOWS ===
model Flow {
  id            String   @id @default(cuid())
  name          String
  description   String?
  type          String?
  data          Json     // nodes, edges (ReactFlow format)
  mappingConfig Json?    // smart mapping configuration
  isActive      Boolean  @default(true)
  isDefault     Boolean  @default(false)
  isLive        Boolean  @default(false)
  targetUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// === ADMIN: QUESTION CONFIGURATION ===
model QuestionConfiguration {
  id                    String   @id @default(cuid())
  name                  String
  description           String?
  type                  String?
  questions             Json     // array of question objects
  flowConfig            Json?    // branching logic
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  versions              QuestionConfigVersion[]
  abTests               ABTest[]
  conditionalQuestions  ConditionalQuestion[]
  dependencies          QuestionDependency[]
  analytics             QuestionAnalytics[]
}

// === ADMIN: A/B TESTING ===
model ABTest {
  id              String   @id @default(cuid())
  configId        String
  name            String
  variants        Json
  trafficSplit    Json
  status          String   @default("draft")
  startDate       DateTime?
  endDate         DateTime?
  createdAt       DateTime @default(now())
  config          QuestionConfiguration @relation(...)
  participants    ABTestParticipant[]
}

// === AUDIT ===
model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String
  entity     String
  entityId   String?
  changes    Json?
  metadata   Json?
  createdAt  DateTime @default(now())
}
```

---

## 4. CV Data Object Structure

### TypeScript Interface (`src/types/cv.ts`)

```typescript
interface CVData {
  // Career & Industry
  careerStage?: 'student' | 'recent_graduate' | 'career_changer' | 'experienced'
  industrySector?: string
  targetRegion?: string

  // Personal Information
  fullName?: string
  preferredName?: string
  pronouns?: string
  professionalHeadline?: string
  careerObjective?: string
  title?: string
  photoUrl?: string
  photos?: string[]

  // Contact Information
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

  // Social Links
  social?: {
    linkedin?: string
    github?: string
    website?: string
    twitter?: string
    instagram?: string
    [key: string]: string | undefined
  }

  // Professional Summary
  summary?: string

  // Experience
  experience?: Array<{
    company?: string
    title: string
    type?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance'
    location?: string
    current?: boolean
    dates?: string
    achievements?: string[]
    content?: string[]  // Legacy support
  }>

  // Education
  education?: Array<{
    institution?: string
    degree?: string
    field?: string
    dates?: string
    achievements?: string[]
    content?: string[]
  }>

  // Skills (supports both formats)
  skills?: {
    technical?: string[]
    soft?: string[]
    tools?: string[]
    industry?: string[]
  } | string[]

  // Additional Sections
  languages?: string[]
  hobbies?: string[]
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
  volunteerWork?: CVSection[]
  awardsRecognition?: CVSection[]
  professionalMemberships?: string[]
  publicationsResearch?: CVSection[]
  references?: string

  // Education Details (onboarding)
  highestEducation?: string
  educationLevel?: string
  degreeField?: string
  university?: string
  graduationYear?: string
  gpa?: string

  // Experience Metrics (onboarding)
  experienceYears?: string
  topStrengths?: string
  currentCompany?: string
  currentRoleStartDate?: string
  currentRoleDescription?: string
  currentAchievements?: string
  previousExperience?: string
  technicalSkills?: string
  softSkills?: string

  // Layout Configuration
  layout?: {
    photoPosition?: 'left' | 'right' | 'center' | 'none'
    photoShape?: 'circle' | 'square' | 'rounded'
    photoPositionX?: number  // 0-100
    photoPositionY?: number  // 0-100
    photoSize?: number
    photoBorderColor?: string
    photoBorderWidth?: number
    showIcons?: boolean
    accentColor?: string
    sectionOrder?: string[]
    sectionIcons?: { [sectionId: string]: string }
    fontFamily?: string
    sectionTitles?: Record<string, string>
    contactDisplay?: 'inline' | 'stacked' | 'centered' | 'justified' | 'separated'
    contactAlignment?: string
    contactSpacing?: string
    contactSeparator?: string
    contactIcons?: boolean
    socialLinksDisplay?: 'icons' | 'text' | 'icons-text' | 'buttons' | 'minimal'
    socialLinksPosition?: string
    socialLinksAlignment?: string
    socialLinksSpacing?: string
    socialLinksStyle?: string
    socialLinksIcons?: boolean
    socialLinksColor?: string
    headerLayout?: 'standard' | 'compact' | 'spacious' | 'minimal'
    headerAlignment?: string
    headerSpacing?: string
    sidebarPosition?: 'none' | 'left' | 'right'
    hiddenSections?: string[]
  }

  // Metadata
  template?: string
  goal?: string
  experienceLevel?: string
  onboardingCompleted?: boolean
}
```

### Sample CV Data Object (`src/data/sampleCVData.ts`)

```json
{
  "template": "modern",
  "fullName": "Alex Morgan",
  "title": "Senior Software Engineer",
  "summary": "Experienced software engineer with over 8 years of expertise...",
  "photoUrl": "https://randomuser.me/api/portraits/women/44.jpg",
  "contact": {
    "email": "alex.morgan@example.com",
    "phone": "(555) 123-4567",
    "location": "San Francisco, CA"
  },
  "social": {
    "linkedin": "https://linkedin.com/in/alexmorgan",
    "github": "https://github.com/alexmorgan",
    "website": "https://alexmorgan.dev"
  },
  "layout": {
    "photoPosition": "left",
    "showIcons": true,
    "accentColor": "#3b82f6",
    "sectionOrder": ["summary", "experience", "skills", "education",
                     "certifications", "projects", "languages", "hobbies"]
  },
  "experience": [
    {
      "title": "Senior Software Engineer at TechCorp (2020-Present)",
      "content": [
        "Led a team of 5 engineers to deliver a payment processing system",
        "Architected microservices infrastructure reducing costs by 35%",
        "Reduced API response time by 60% through caching and indexing",
        "Mentored 3 junior developers promoted within 12 months"
      ]
    }
  ],
  "education": [
    {
      "degree": "Master of Computer Science - Stanford University (2015-2017)",
      "content": [
        "GPA: 3.9/4.0",
        "Specialization in AI and Machine Learning",
        "Dean's List for Academic Excellence"
      ]
    }
  ],
  "skills": ["JavaScript", "TypeScript", "React", "Node.js", "Express",
             "GraphQL", "MongoDB", "PostgreSQL", "Docker", "Kubernetes"]
}
```

### CV Templates Available (25+)

Modern, Classic, Creative, Executive, Minimal, Tech, Healthcare, Sales, Admin, Non-Profit, Finance, Legal, Education, Marketing, Design, Engineering, Consulting, Freelance, Graduate, Executive Modern, Creative Minimal, Corporate Bold, Startup

### Color Palettes Available (25+)

Professional (Navy Blue, Charcoal, Forest Green, Burgundy), Creative (Purple Gradient, Teal Modern, Coral Vibrant), Technology (Cyber Green, Electric Blue, Dark Mode), Finance/Legal, Healthcare/Education, Minimalist

### Font Families Available (20+)

Professional: Inter, Roboto, Montserrat, Open Sans | Traditional: Georgia, Times New Roman, Merriweather, Playfair Display | Creative: Poppins, DM Sans, Nunito | Tech: JetBrains Mono, Source Code Pro, Fira Code | Academic: Crimson Text, Lora, Source Serif Pro

---

## 5. Current Deployment

### Hosting
- **Vercel** (serverless)
- Project ID: `prj_rrm5B15yJgpsBQVw6E9uWousUuKn`
- Org ID: `team_7KGwgEMzVMaI5rFWyoXwO6XH`

### Domains
- **Production:** `https://www.ladderfox.com`
- **UAT/Staging:** `https://uat.ladderfox.com`

### Build Configuration
- Build command: `prisma generate && next build`
- Memory: 4GB (`NODE_OPTIONS=--max-old-space-size=4096`) to prevent OOM
- API function timeout: 30 seconds
- CSS optimization disabled (causes OOM on Vercel)

### Next.js Config Highlights (`next.config.js`)
- Transpile packages: `react-quill`
- Optimize imports: `react-icons`, `lucide-react`, `framer-motion`
- External server packages: `puppeteer`, `@react-pdf/renderer`
- Image optimization: WebP + AVIF formats
- Webpack: @react-pdf `self → globalThis` polyfill, custom chunk splitting (vendor/PDF/React)
- Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, HSTS, Referrer-Policy
- Redirect: `/cv-builder` → `/builder` (permanent)

### Middleware (`src/middleware.ts`)
- **Rate limiting per IP:**
  - Default: 500 req/min
  - Auth endpoints: 30 req/min
  - AI endpoints: 50 req/min
  - Upload endpoints: 50 req/min
- **Security:** CSP, XSS detection, SQL injection prevention, directory traversal prevention, 10MB payload limit
- **Bot handling:** Whitelisted search engines (Google, Bing, etc.), blocks scrapers/crawlers
- **CORS:** Configured for `NEXT_PUBLIC_APP_URL`

### Environment Variables (names only)

**Core:**
`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NODE_ENV`, `NEXT_PUBLIC_APP_URL`

**Database:**
`DATABASE_URL`

**Auth:**
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

**AI:**
`OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_VISION_MODEL`

**Stripe (12 variables):**
`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`,
`STRIPE_BASIC_MONTHLY_PRICE_ID_EUR`, `STRIPE_BASIC_MONTHLY_PRICE_ID_USD`,
`STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR`, `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD`,
`STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR`, `STRIPE_BASIC_QUARTERLY_PRICE_ID_USD`,
`STRIPE_BASIC_YEARLY_PRICE_ID_EUR`, `STRIPE_BASIC_YEARLY_PRICE_ID_USD`,
`STRIPE_PRO_MONTHLY_PRICE_ID_EUR`, `STRIPE_PRO_MONTHLY_PRICE_ID_USD`,
`STRIPE_PRO_YEARLY_PRICE_ID_EUR`, `STRIPE_PRO_YEARLY_PRICE_ID_USD`

**File Upload:**
`UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`

**Email:**
`EMAIL_SERVER_HOST`, `EMAIL_SERVER_PORT`, `EMAIL_SERVER_USER`, `EMAIL_FROM`, `RESEND_API_KEY`

**Job Board:**
`ADZUNA_APP_ID`, `ADZUNA_API_KEY`

**Analytics:**
`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ENABLED`,
`NEXT_PUBLIC_HOTJAR_SITE_ID`, `NEXT_PUBLIC_HOTJAR_ENABLED`,
`NEXT_PUBLIC_CONTENTSQUARE_SCRIPT_URL`, `NEXT_PUBLIC_CONTENTSQUARE_ENABLED`

**Supabase (optional/UAT):**
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`

### CI/CD
- No GitHub Actions or CI pipelines
- Manual deployment via Vercel CLI
- Deployment scripts: `scripts/deploy-uat.sh` / `scripts/deploy-uat.bat`
- Separate database management scripts for production and UAT

---

## 6. Current Features

### CV Builder
- **Question-based flow system** (basic and advanced flows)
- **Chat-based CV building** with AI assistance (EnhancedCVChatInterface)
- **Direct editing** of all CV sections (CVEditor)
- **Drag-and-drop section reordering** (SectionManager, DraggableSection)
- **PDF upload & parsing** - Extract data from existing CV PDFs
- **25+ CV templates** with customizable colors, fonts, layouts
- **Photo upload & positioning** (circle/square/rounded, drag to position)
- **Real-time preview** (CVPreview, PaginatedCVPreview)
- **Layout customization** (sidebar position, section ordering, contact display styles, social link styles, header layouts)

### PDF Generation & Export
- **Puppeteer-based PDF** (server-side, queued with priority system)
- **@react-pdf/renderer** (client-side React-based PDF)
- **DOCX export** (Word document generation)
- Rate limiting and subscription-gated access

### Cover Letter Builder
- AI-powered generation from CV data
- 4 templates (Professional, Modern, Executive, Creative)
- Chat-based building interface
- Quality analysis and suggestions
- PDF export

### AI Features
- **CV Analysis & Scoring** (ATS score, content score, overall score 0-100)
- **AI Writing Assistance** (rephrasing, suggestions, optimization)
- **ATS Compatibility Checker** (38,344 lines, comprehensive)
- **Multi-Agent System** (LangChain + LangGraph):
  - Orchestrator Agent (intent classification & routing)
  - CV Evaluator Agent
  - Job Matcher Agent
  - ATS Assessor Agent
  - Application Tracker Agent
  - Cover Letter Enhancement Agent
- **Smart CV Mapping** (AI-powered field extraction from PDFs)
- **Audio Transcription** (OpenAI Whisper)

### Job Application Tracking
- Track applications with statuses: saved, applied, interviewing, offered, rejected, withdrawn
- Link CVs and cover letters to applications
- Follow-up date reminders
- Notes per application

### Job Matching
- Adzuna API integration for job search
- AI-powered job-to-CV matching with score (0-100)
- Keyword matching analysis
- Job description parsing

### User Accounts
- Email/password registration with bcrypt hashing
- Google OAuth login
- Password reset via email tokens
- Profile management
- Settings page

### Subscription System
- **Free tier:** Preview-only, 3 basic templates, watermarks, 10 chat prompts/day
- **Basic tier:** Full PDF/DOCX export, 20+ templates, unlimited AI, cover letters, auto-save
- Stripe checkout, customer portal, webhook handling
- Multi-currency (EUR/USD), multi-interval (monthly/quarterly/yearly)
- Feature flags per subscription level

### Admin Panel (`/adminx/`)
- Dashboard with quick stats
- Visual Flow Designer (ReactFlow-based drag-and-drop)
- Question Configuration management with versioning
- A/B Testing framework
- Smart Mapping configuration
- Analytics dashboard (7d, 30d, 90d views)
- Excel export for analytics
- Audit logging

### Multi-Language Support
- **20 languages:** EN, NL, FR, ES, DE, IT, PL, RO, HU, EL, CS, PT, SV, BG, DA, FI, SK, NO, HR, SR
- Localized URL segments (e.g., `/voorbeeld/cv` for Dutch, `/ejemplos/cv` for Spanish)
- Profession translations across all 20 languages

### Example Pages & SEO
- Profession-specific CV examples (100+ professions)
- Multi-language example pages
- SEO-optimized meta tags
- Sector-profession filtering

### Other Features
- Dark/Light theme toggle
- Responsive design (mobile-optimized)
- Consent management & GDPR compliance
- Data compliance page
- Privacy policy, Terms of service, FAQ
- Accessible modals (ARIA)

---

## 7. API Routes (70+ Total)

### Authentication (6)
`/api/auth/[...nextauth]`, `/api/auth/signup`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/test-email`

### CV Management (5)
`/api/cv` (GET/POST/PUT), `/api/cv/[id]`, `/api/cv-analysis`, `/api/cv-optimize`, `/api/cv-to-text`

### AI & Chat (8)
`/api/ai-analysis`, `/api/ai-rephrase`, `/api/ai-suggestions`, `/api/cv-chat-agent`, `/api/cv-chat-agent/stream`, `/api/chat`, `/api/cover-letter/generate`

### Agent System (6)
`/api/agents/chat`, `/api/agents/analyze-cv`, `/api/agents/ats-assessment`, `/api/agents/match-jobs`, `/api/agents/applications`, `/api/agents/analytics`

### Cover Letters (6)
`/api/letter` (GET/POST), `/api/letter/[id]`, `/api/letter-generate`, `/api/letter-download`, `/api/letter-edit`, `/api/letter-analysis`

### Document Processing (6)
`/api/pdf-extract`, `/api/extract-document`, `/api/transcribe-audio`, `/api/download`, `/api/generate-pdf`, `/api/generate-clean-pdf`, `/api/export/docx`

### Job Management (3)
`/api/job-applications`, `/api/job-postings`, `/api/job-parser`

### Subscription & Billing (3)
`/api/stripe/create-checkout`, `/api/stripe/customer-portal`, `/api/stripe/webhook`

### Admin (6)
`/api/admin/analytics`, `/api/admin/analytics/realtime`, `/api/admin/analytics/export-excel`, `/api/admin/question-configs`, `/api/admin/question-configs/[id]`, `/api/admin/ab-tests`

### Flows & Config (6)
`/api/flows`, `/api/flows/basic-cv`, `/api/flows/advanced-cv`, `/api/flows/by-target`, `/api/flows/diagnose`, `/api/smart-mapping`

### User & Misc (8)
`/api/user`, `/api/user/subscription`, `/api/user/question-count`, `/api/uploadthing/*`, `/api/image-proxy`, `/api/question-library`, `/api/questions/active`, `/api/application-documents`

---

## 8. Complete Package.json Dependencies

### Dependencies (66)
```
@auth/core: ^0.34.2             @dnd-kit/core: ^6.3.1
@dnd-kit/sortable: ^10.0.0      @dnd-kit/utilities: ^3.2.2
@heroicons/react: ^2.2.0        @langchain/core: ^1.1.0
@langchain/langgraph: ^1.0.2    @langchain/openai: ^1.1.3
@next-auth/prisma-adapter: ^1.0.7  @prisma/client: ^6.13.0
@react-pdf/renderer: ^4.3.1     @reactflow/background: ^11.3.14
@reactflow/controls: ^11.2.14   @reactflow/minimap: ^11.7.14
@reactflow/node-resizer: ^2.2.14  @stripe/stripe-js: ^2.4.0
@supabase/supabase-js: ^2.50.2  @types/bcryptjs: ^2.4.6
@types/file-saver: ^2.0.7       @types/node: ^20.0.0
@types/nodemailer: ^7.0.4       @types/react: ^18.0.0
@types/react-dom: ^18.0.0       autoprefixer: ^10.0.0
bcryptjs: ^3.0.2                critters: ^0.0.23
docx: ^9.5.1                    file-saver: ^2.0.5
formidable: ^3.5.4              framer-motion: ^10.18.0
immer: ^10.1.1                  jspdf: ^3.0.1
lodash: ^4.17.21                lucide-react: ^0.542.0
next: ^14.2.30                  next-auth: ^4.24.7
next-connect: ^1.0.0            node-fetch: ^3.3.2
nodemailer: ^6.10.1             null-loader: ^4.0.1
openai: ^4.98.0                 pdf-parse: ^1.1.4
postcss: ^8.0.0                 puppeteer: ^24.8.2
react: ^18.0.0                  react-dnd: ^16.0.1
react-dnd-html5-backend: ^16.0.1  react-dom: ^18.0.0
react-dropzone: ^14.3.8         react-hot-toast: ^2.5.2
react-icons: ^5.5.0             react-pdf: ^10.3.0
react-quill: ^2.0.0             reactflow: ^11.11.4
resend: ^6.7.0                  sqlite3: ^5.1.7
string-replace-loader: ^3.2.0   stripe: ^14.12.0
tailwindcss: ^3.0.0             typescript: ^5.0.0
uploadthing: ^6.3.0             use-debounce: ^10.0.6
xlsx: ^0.18.5                   zod: ^3.23.8
zustand: ^5.0.8
```

### Dev Dependencies (14)
```
@tailwindcss/forms: ^0.5.0
@tailwindcss/nesting: ^0.0.0-insiders.565cd3e
@testing-library/react: ^16.3.0
@testing-library/user-event: ^14.6.1
@types/formidable: ^3.4.5
@types/lodash: ^4.17.16
@types/pdf-parse: ^1.1.5
@typescript-eslint/eslint-plugin: ^6.21.0
cross-env: ^7.0.3
eslint: ^8.0.0
eslint-config-next: 14.1.0
prisma: ^6.13.0
sharp: ^0.34.5
to-ico: ^1.1.5
```

---

## 9. Key Code Examples

### CV Creation API (`src/app/api/cv/route.ts`)
```typescript
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await request.json()
  if (!body.content || typeof body.content !== 'object') {
    return NextResponse.json({ error: 'Invalid CV data' }, { status: 400 })
  }

  const chatHistory = body.chatHistory ? {
    messages: body.chatHistory.messages || [],
    questionIndex: body.chatHistory.questionIndex || 0,
    accountDataPreference: body.chatHistory.accountDataPreference || null
  } : undefined

  const cv = await CVService.createCV(
    session.user.id,
    body.title || 'My CV',
    body.content,
    body.template || 'modern',
    chatHistory
  )

  return NextResponse.json({ cv, message: 'CV saved successfully' })
}
```

### CVService Database Layer (`src/lib/db.ts`)
```typescript
export class CVService {
  static async createCV(userId, title, content, template, chatHistory?) {
    const prisma = getPrisma()
    const cv = await prisma.cV.create({
      data: {
        title,
        content: JSON.stringify(content),  // CVData stored as JSON string
        template,
        userId,
      },
    })
    return cv
  }

  static async getCV(cvId, userId) {
    const prisma = getPrisma()
    const cv = await prisma.cV.findFirst({ where: { id: cvId, userId } })
    if (cv && cv.content) {
      return { ...cv, content: JSON.parse(cv.content as string) }
    }
    return cv
  }

  static async getUserCVs(userId) {
    const prisma = getPrisma()
    const cvs = await prisma.cV.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })
    return cvs.map(cv => ({
      ...cv,
      content: cv.content ? JSON.parse(cv.content as string) : {}
    }))
  }
}
```

### PDF Generation (`src/app/api/generate-pdf/route.ts`)
```typescript
export async function POST(request: NextRequest) {
  // 1. Rate limiting per IP
  const rateLimitResult = await rateLimiter.check(ip, 'pdf_generation')

  // 2. Subscription check (PDF is premium feature)
  const subscription = await SubscriptionService.getUserSubscription(userId)
  if (!subscription.features.pdf_export) {
    return NextResponse.json({ error: 'Premium feature', requiresUpgrade: true }, { status: 403 })
  }

  // 3. Queue PDF generation job
  const { cvData, fileName, priority = 'normal' } = await request.json()
  const jobId = await pdfQueue.addJob(cvData, fileName, { priority, userId, maxRetries: 3 })

  // 4. High priority: wait for result. Normal: return job ID for polling
  if (priority === 'high') {
    const result = await pdfQueue.waitForResult(jobId, 30000)
    return new NextResponse(new Uint8Array(result.buffer), {
      headers: { 'Content-Type': 'application/pdf' }
    })
  }
  return NextResponse.json({ jobId, message: 'PDF generation queued' })
}
```

PDF generation uses Puppeteer to navigate to `/print-cv?data={encoded}`, waits for fonts/styles, then calls `page.pdf()` with A4 format settings. A browser pool manages concurrent Puppeteer instances (max 3 concurrent).

### Subscription Feature Access (`src/lib/subscription.ts`)
```typescript
export class SubscriptionService {
  private static readonly PLAN_FEATURES = {
    free: {
      pdf_export: false, ai_requests: 3, templates: 'basic',
      job_tracking: false, analytics: false, priority_support: false,
      api_access: false, team_collaboration: false,
    },
    basic: {
      pdf_export: true, ai_requests: 100, templates: 'all',
      job_tracking: true, analytics: false, priority_support: false,
      api_access: false, team_collaboration: false,
    },
    pro: {
      pdf_export: true, ai_requests: 1000, templates: 'all',
      job_tracking: true, analytics: true, priority_support: true,
      api_access: true, team_collaboration: false,
    },
  }
}
```

---

## 10. Architecture Summary for HireKit Planning

### Key Patterns
1. **Data flow:** CVData TypeScript interface → JSON serialization → Prisma `Json` field → JSON parse on read
2. **API pattern:** NextAuth session check → Zod validation → Service layer → Prisma DB → JSON response
3. **PDF generation:** Queued job system with Puppeteer browser pooling (3 concurrent max)
4. **AI integration:** OpenAI SDK with LangChain orchestration for multi-agent system
5. **Subscription gating:** Feature flags per plan, checked at API level before premium operations

### What Could Be Shared (Monorepo Strategy)
- Authentication system (NextAuth config, Prisma adapter)
- Stripe subscription infrastructure
- Email service (Resend integration)
- File upload (Uploadthing)
- Middleware (security, rate limiting, CORS)
- UI theme system (Tailwind config, CSS variables)
- Admin panel framework
- Analytics infrastructure

### What Would Be HireKit-Specific
- Data models (job postings, candidates, applications vs CVs)
- Business logic and workflows
- Templates and UI components specific to recruitment
- API routes for HireKit features
- Landing pages and marketing content
