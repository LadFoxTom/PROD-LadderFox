# HireKit — Complete Functionality Documentation

> Last updated: 2026-02-18

HireKit is a B2B SaaS recruitment platform built as a Next.js 14 (App Router) monorepo. It provides companies with an embeddable CV builder widget and job listing widget for their career pages, plus a full recruitment dashboard to manage jobs and applications.

---

## Table of Contents

1. [Authentication & Onboarding](#1-authentication--onboarding)
2. [Dashboard](#2-dashboard)
3. [Jobs Management](#3-jobs-management)
4. [Applications Management](#4-applications-management)
5. [Settings / Configuration](#5-settings--configuration)
6. [Embed Code Page](#6-embed-code-page)
7. [Widget System](#7-widget-system)
8. [AI Features](#8-ai-features)
9. [API Reference](#9-api-reference)
10. [Database Schema](#10-database-schema)
11. [Shared Packages](#11-shared-packages)
12. [Architecture & Technical Details](#12-architecture--technical-details)

---

## 1. Authentication & Onboarding

### Authentication
- **Provider:** NextAuth.js with CredentialsProvider (email/password)
- **Strategy:** JWT-based sessions (30-day max age)
- **Password hashing:** bcryptjs with 12 salt rounds
- **Registration:** Creates User + Company in a single database transaction; auto-generates company slug from company name

### Login Page (`/auth/login`)
- Email and password fields
- Link to sign up

### Signup Page (`/auth/signup`)
- Name, email, password, company name fields
- On success: creates User, Company, and CompanyUser records

### Onboarding (`/onboarding`)
3-step wizard for new users:

| Step | Content |
|------|---------|
| 1. Branding | Brand color picker |
| 2. CV Template | Choose from 4 templates (modern, classic, minimal, executive) |
| 3. Installation | Choose: Hosted Page, Widget Embed, or Custom Domain |

On completion: creates Branding, CVTemplate, and LandingPage records via `POST /api/onboarding/complete`.

### Route Protection
- Middleware protects `/dashboard`, `/applications`, `/settings`, `/onboarding` — redirects to `/auth/login` if no JWT token
- Rate limiting: 30 req/min for auth routes, 200 req/min for other API routes
- Security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, HSTS

---

## 2. Dashboard

The main dashboard (`/dashboard`) is a **server component** providing a recruitment overview.

### Stat Cards (4)
| Metric | Description |
|--------|-------------|
| Total Applications | Total count of all applications |
| New / Unreviewed | Applications with status `new` |
| Active Jobs | Count of active job listings |
| Hired | Applications with status `hired` |

### Charts Panel (client component)
- **Applications Trend** — 30-day bar chart showing daily application volume
- **Pipeline Funnel** — Horizontal bars for each status stage (new → screening → interviewing → offered → hired → rejected)
- **Top Jobs** — Bar chart of top 5 active jobs by application count

### Install Widget Panel
- Pre-filled embed code snippet with company ID for the CV builder widget

### Quick Actions
- Create New Job → `/jobs/new`
- Pipeline Board → `/applications?view=kanban`
- View All Applications → `/applications`

### Recent Applications
- Table showing last 5 applications (name, email, status badge, date)

---

## 3. Jobs Management

### Jobs List (`/jobs`)
- **Tab navigation:** Active / Inactive (with counts)
- **Table columns:** Title, Department, Location, Type, Applications count, Created date
- **Stats bar:** Active count, Inactive count

### Create Job (`/jobs/new`)
Shared `JobForm` component with fields:

| Field | Type | Required |
|-------|------|----------|
| Title | Text | Yes |
| Description | Textarea | No |
| Department | Text | No |
| Location | Text | No |
| Employment Type | Select (full-time, part-time, contract, internship, freelance) | No |
| Salary Currency | Select (EUR, USD, GBP, CHF) | No |
| Salary Min | Number | No |
| Salary Max | Number | No |

### Job Detail (`/jobs/[id]`)
- Displays: title, active/inactive status badge, department, location, type, salary range
- Full job description
- **Recent applications table** (up to 20) linked to this job
- **Side panel:** overview stats (application count, status, created date, updated date, job ID)
- **Actions:** Toggle Active/Inactive button, Edit button → `/jobs/[id]/edit`

### Edit Job (`/jobs/[id]/edit`)
- Same `JobForm` pre-filled with existing data

### Deletion
- Soft-delete: `DELETE /api/v1/jobs/[id]` sets `active: false` (job is preserved in database)

---

## 4. Applications Management

### Applications List (`/applications`)
- **Two views:** Table view and Kanban board (toggle via query param `?view=kanban`)

#### Table View
- **Status filter pills:** All, New, Screening, Interviewing, Offered, Hired, Rejected
- **Job filter dropdown** (active jobs)
- **Columns:** Applicant name, Email, Job title, AI Score, Status badge, Date
- **AI Score badges:** Green (≥80%), Amber (≥60%), Red (<60%)
- **Pagination:** 20 per page

#### Kanban Board
- Implemented with **@dnd-kit/core** and **@dnd-kit/sortable**
- **6 columns:** New, Screening, Interviewing, Offered, Hired, Rejected
- **Drag-and-drop** cards between columns → calls `PATCH /api/v1/applications/batch-status`
- Auto-reverts on API failure
- Cards show: applicant name, email, job title, AI score badge, date

### Application Detail (`/applications/[id]`)

**Left panel — CV Data:**
- Header: avatar (initial circle), name, professional title, email, phone, location
- Professional Summary section
- Work Experience (timeline layout: company, dates, achievement bullets)
- Education (degree, institution, dates)
- Skills (tag display, merges technical/soft/tools/industry skills)

**Right panel — Actions & Info:**
- **Status Updater:** 6 status buttons (visual radio-style selection, calls PATCH API)
- **AI Score Card:** Overall score (circular indicator), breakdown bars (Skills Match, Experience Relevance, Education Fit), summary text, "Score with AI" button
- Details: applied date, job link, application ID
- Notes section (if present)

---

## 5. Settings / Configuration

Accessible at both `/settings` and `/configuration`. Three-tab interface:

### Tab 1: General

**Company Profile:**
- Company Name (read-only display)
- Company Slug (read-only, shown as `{slug}.hirekit.io`)
- Company ID with copy-to-clipboard button

**Logo & Identity:**
- Logo upload (drag-and-drop zone, accepts PNG/JPG/SVG, reads as base64)
- Show Company Name toggle
- Tagline text field

**Colors & Typography:**
- Primary Color (color picker + hex input)
- Secondary Color (color picker + hex input)
- Font Family select: Inter, Roboto, Open Sans, Lato, Poppins, System Default

### Tab 2: Job Listings

**AI Template Generator:**
- Website URL input + Layout preference dropdown (Grid / List)
- "Retrieve Styling" button triggers the two-agent AI pipeline
- Loading states: "Analyzing website..." → "Generating template..."
- Result display: template name, color swatches (bg, surface, text, border, accent, badge), font info
- "Use This Template" button saves the generated CSS as active custom template

**Job Listing Template Selector:**
- Visual grid of 10+ templates with mini-preview thumbnails
- AI-generated custom template card (when one exists) with delete option
- Each card shows: preview image, name, description, category badge, layout badge
- Templates: Simple, Swiss, Terminal, SaaS Gradient, Editorial, Glassdoor, Compact Table, Department, Two Panel, Vibrant Bento, + Custom (AI-generated)

**Widget Features:**
- Search Bar toggle
- Filter Dropdowns toggle (auto-hidden when ≤3 jobs)

### Tab 3: CV Builder

**Sub-tab: Sections**
- Toggle on/off per CV section: Personal Information, Work Experience, Education, Skills, Languages, Certifications, Projects, Hobbies & Interests
- Min/Max entries config for: Experience, Education, Certifications, Projects

**Sub-tab: Styling**

*Widget Type selector:*
- Step-by-Step Form (5-step guided wizard)
- AI Chat Builder (conversational interface + live CV preview)

*CV Template selector (6 options):*

| Template | ATS Score | Style |
|----------|-----------|-------|
| Classic | 100% | Single-column, traditional |
| Modern | 85% | Sidebar layout, tech startups |
| Professional | 88% | Corporate sidebar |
| Executive | 85% | Dark sidebar, serif font |
| Minimal | 95% | Clean single-column |
| Creative | 80% | Purple sidebar, bold design |

*After Submission:*
- Success Message textarea
- Redirect URL input (optional)

*Live Preview panel:*
- Real-time widget preview reflecting current branding and type selection

---

## 6. Embed Code Page

Two-tab interface at `/embed`:

### CV Builder Tab
- Ready-to-copy embed code snippet (IIFE pattern)
- Auto-detects API URL from script `src` attribute
- Variant: embed with specific Job ID (links application to a job posting)
- Local testing instructions (`window.__HIREKIT_API_URL__` override)

### Job Listings Tab
- Embed code for `hirekit-jobs.iife.js`
- Link to Configuration page for template/feature customization

---

## 7. Widget System

### CV Builder Widget (`hirekit-widget.iife.js`)
- **Embedding:** `<div id="hirekit-widget"></div>` + `<script>` tag
- **Initialization:** `HireKit.init({ companyId, jobId? })`
- **Config fetch:** `GET /api/v1/widget/config/[companyId]`
- **Two modes:**
  - **Form mode:** 5-step guided wizard (personal info → contact → experience → education → skills)
  - **Chat mode:** AI conversational builder with live CV preview (SSE streaming)
- **Submission:** `POST /api/v1/applications` with `X-Company-ID` header
- **Isolation:** Shadow DOM prevents style conflicts with host page

### Jobs Widget (`hirekit-jobs.iife.js`)
- **Embedding:** `<div id="hirekit-jobs"></div>` + `<script>` tag
- **Initialization:** `HireKitJobs.init({ companyId })`
- **Data fetch:** `GET /api/v1/public/jobs/[companyId]`
- **Implementation:** ES6 class with Shadow DOM (mode: open, CSSStyleSheet adoptedStyleSheets)
- **State management:** Internal `WidgetState` object (no external library)

**Features:**
- **Views:** Job list/grid → Job detail (with back navigation)
- **Filters:** Search (title/description), department dropdown, location dropdown, type dropdown
- **Auto-hide:** Filters hidden when ≤3 jobs
- **Templates:** 10 built-in + custom AI-generated
- **Apply flow:** "Apply" button → overlay modal → lazily loads CV builder widget inside modal
- **SEO:** JSON-LD structured data injection for job postings
- **Theming:** Company primary color applied as `--hk-primary` CSS custom property

**Built-in Templates (10):**

| ID | Name | Font | Default Layout |
|----|------|------|----------------|
| `simple` | Simple | Plus Jakarta Sans | Cards/Grid |
| `swiss` | Swiss | Space Mono | List |
| `terminal` | Terminal | JetBrains Mono | List |
| `saas-gradient` | SaaS Gradient | Outfit | Cards |
| `editorial` | Editorial | Bodoni Moda | List |
| `glassdoor` | Glassdoor | Outfit | Cards |
| `compact-table` | Compact Table | JetBrains Mono | Table |
| `department` | Department | Plus Jakarta Sans | List |
| `two-panel` | Two Panel | DM Sans | List |
| `vibrant-bento` | Vibrant Bento | DM Sans | Cards |

**Template CSS Variables (all customizable):**
`--hk-bg`, `--hk-surface`, `--hk-text`, `--hk-text-secondary`, `--hk-text-muted`, `--hk-border`, `--hk-primary`, `--hk-primary-hover`, `--hk-badge-bg`, `--hk-badge-text`, `--hk-radius`, `--hk-radius-sm`, `--hk-shadow`, `--hk-shadow-lg`, `--hk-font`

---

## 8. AI Features

### 8.1 AI Candidate Scoring
- **Endpoint:** `POST /api/v1/applications/[id]/score`
- **Model:** GPT-4-turbo-preview (configurable via `OPENAI_MODEL` env var)
- **Input:** CV data JSON + job description
- **Output:**
  - 4 scores (0–100): Skills Match, Experience Relevance, Education Fit, Overall Score
  - 2–3 sentence summary
- **Storage:** `aiScore` (integer) and `aiScoreData` (JSON) saved to Application record
- **UI:** Circular overall score indicator + breakdown bar charts in `AiScoreCard` component
- **Score colors:** Green ≥80, Amber ≥60, Red <60

### 8.2 AI Chat CV Builder
- **Endpoint:** `POST /api/v1/cv-chat`
- **Model:** GPT-4-turbo-preview with temperature 0.7
- **Protocol:** Server-Sent Events (SSE) for word-by-word streaming
- **Features:**
  - Conversation history support (last 10 messages)
  - Multi-language support (language code parameter)
  - Returns: `response` (text) + `cvUpdates` (structured CV data changes)
  - SSE event types: `cv_update`, `token`, `done`, `error`
- **Flow:** Guides user through: name/title → contact → summary → experience → education → skills

### 8.3 AI Template Generator
- **Endpoint:** `POST /api/ai/generate-template`
- **Architecture:** Two-agent LangChain pipeline

**Agent 1 — Style Analyzer (GPT-4o with vision):**
1. Renders target URL with Puppeteer at 1440×900
2. Handles cookie consent banners (OneTrust, Cookiebot, generic CMP, text-based detection)
3. Extracts computed styles from DOM elements:
   - Body, header/nav, hero sections, div-based sections (Divi/page builders)
   - Buttons/CTAs, links, cards, footer, headings
   - CSS custom properties from `:root`
   - Fonts via `document.fonts` API + `@font-face` rule scanning
4. Takes JPEG screenshot (quality 80)
5. Sends structured color data + screenshot to GPT-4o
6. Separates chromatic (brand) colors from neutrals for clearer AI input
7. Returns design tokens

**Contrast Validation Layer:**
- WCAG contrast ratio checks:
  - bg ↔ surface: minimum 1.3:1
  - text on surface: minimum 4.5:1 (WCAG AA)
  - secondary text: minimum 3:1
  - muted text: minimum 2:1
  - badge text on badge bg: minimum 3:1
- Validates accent color is chromatic (≥15% saturation, not gray/black/white)
- Validates badge bg contrasts with surface
- Auto-corrects any failing colors

**Agent 2 — Template Generator (GPT-4o-mini):**
- Takes validated design tokens + layout preference
- Generates CSS custom properties in `:host(.hk-tpl-custom)` scope (Shadow DOM compatible)
- Optional component overrides (`.hk-card`, `.hk-btn`, `.hk-header`, etc.)
- Returns: CSS string, Google Fonts URL, layout type

**Browser Pool (`browser-pool.ts`):**
- Singleton Puppeteer browser pool
- Max 2 concurrent pages, auto-retires after 50 requests
- Graceful shutdown on SIGINT/SIGTERM

---

## 9. API Reference

### Authentication
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | None | Register user + create company |
| GET/POST | `/api/auth/[...nextauth]` | None | NextAuth.js handler |

### Settings
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/settings` | Required | Fetch all company configuration |
| PUT | `/api/settings` | Required | Save all company configuration (upsert) |

### Jobs
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/jobs` | Required | List jobs (filter: `active`, `search`) |
| POST | `/api/v1/jobs` | Required | Create new job |
| GET | `/api/v1/jobs/[id]` | Required | Get single job |
| PATCH | `/api/v1/jobs/[id]` | Required | Update job fields |
| DELETE | `/api/v1/jobs/[id]` | Required | Soft-delete (sets `active: false`) |

### Applications
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/applications` | None* | Submit application from widget (`X-Company-ID` header) |
| GET | `/api/v1/applications` | Required | List applications (paginated, status filter) |
| GET | `/api/v1/applications/[id]` | Required | Get single application |
| PATCH | `/api/v1/applications/[id]` | Required | Update status or notes |
| PATCH | `/api/v1/applications/batch-status` | Required | Kanban drag-and-drop batch status update |
| POST | `/api/v1/applications/[id]/score` | Required | AI-score candidate |

### Public Widget APIs (no auth)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/public/jobs/[companyId]` | Jobs widget: active jobs + branding + listing config |
| GET | `/api/v1/widget/config/[companyId]` | CV builder widget: branding + sections + widget type + template |

### Analytics
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/analytics` | Required | 30-day trend, pipeline distribution, top 5 jobs |

### AI
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/ai/generate-template` | Required | Two-agent website analysis → CSS template generation |
| POST | `/api/v1/cv-chat` | Required | SSE streaming AI chat for CV builder |

### Utility
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/onboarding/complete` | Required | Save initial branding, CV template, landing page |
| POST | `/api/v1/widget/set-type` | Dev only | Toggle widget type (form/chat) |

---

## 10. Database Schema

### Core Models

**User**
- `id` (UUID), `email` (unique), `name`, `passwordHash`, `emailVerified`
- Relations: owned companies, company memberships, NextAuth accounts/sessions

**Company**
- `id` (UUID), `name`, `slug` (unique), `ownerId`
- Has one: Branding, CVTemplate, LandingPage, JobListingConfig, Subscription
- Has many: Applications, Jobs, CompanyUsers

**CompanyUser** (junction table)
- `companyId`, `userId`, `role` (default: "member")

**Job**
- `id`, `companyId`, `title`, `description?`, `location?`, `type?`, `department?`
- `salaryMin?`, `salaryMax?`, `salaryCurrency?` (default: EUR)
- `active` (default: true)
- Employment types: full-time, part-time, contract, internship, freelance

**Application**
- `id`, `companyId`, `jobId?`, `cvData` (JSON), `email`, `name?`, `phone?`
- `status` (default: "new"): new → screening → interviewing → offered → hired / rejected
- `notes?`, `aiScore?` (Int), `aiScoreData?` (JSON)

**Branding**
- `companyId` (unique), `logoUrl?`, `primaryColor` (#4F46E5), `secondaryColor` (#F8FAFC)
- `fontFamily` (Inter), `showCompanyName` (true), `tagline?`

**CVTemplate**
- `companyId` (unique), `templateType` (classic), `sections` (JSON), `pdfConfig?` (JSON)
- Sections: per-section `{ enabled: bool, min?: number, max?: number }`

**JobListingConfig**
- `companyId` (unique), `templateId` (simple), `showFilters`, `showSearch`
- `customTemplateCSS?` (Text), `customTemplateName?`, `customFontUrl?`
- `customLayout?`, `customSourceUrl?`, `customDesignTokens?` (JSON)

**LandingPage**
- `companyId` (unique), `domain` (unique), `customDomain?`, `customDomainVerified`
- `title`, `subtitle?`, `introText?`, `headerPosition` (top)
- `successMessage`, `redirectUrl?`, `widgetType` (form | chat)

**Subscription**
- `companyId` (unique), `plan`, `status`
- Stripe: `stripeCustomerId?`, `stripeSubscriptionId?`, `stripePriceId?`
- `currentPeriodStart?`, `currentPeriodEnd?`, `cancelAtPeriodEnd`

**NextAuth Tables:** Account, Session, VerificationToken

---

## 11. Shared Packages

### `@repo/types` (`packages/types/`)
- `CVData` — Comprehensive CV data structure (personal info, contact, experience, education, skills, languages, hobbies, certifications, projects, social links, layout preferences)
- `CVSection`, `SocialLinks`, `Message`, `TemplateStyles`, `CVTemplate`, `ColorPalette`, `FontFamily`
- `CVBuilderProps` — Widget embedding interface (branding, sections config, callbacks)
- `WidgetTemplateConfig` + `WIDGET_TEMPLATES` — 6 CV template definitions with ATS scores
- `JobListingTemplateConfig` + `JOB_LISTING_TEMPLATES` — 10 job listing template definitions

### `@repo/database-hirekit` (`packages/database-hirekit/`)
- Prisma client configured for PostgreSQL (`HIREKIT_DATABASE_URL` env var)
- Exports `db` Prisma client instance

---

## 12. Architecture & Technical Details

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (CredentialsProvider + JWT) |
| AI | LangChain + OpenAI (GPT-4o, GPT-4o-mini, GPT-4-turbo-preview) |
| Browser Automation | Puppeteer (headless Chrome) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Styling | Tailwind CSS |
| Icons | Phosphor Icons v2 (CDN) |
| Widget Build | Vite (IIFE bundle) |
| Password Hashing | bcryptjs (12 rounds) |
| Payments (schema only) | Stripe |
| Monorepo | Turborepo + pnpm workspaces |

### Key Architectural Patterns

1. **Shadow DOM isolation** — Both widgets use Shadow DOM so styles don't bleed into or from the host page
2. **Public vs authenticated APIs** — Widget endpoints need no auth (use `X-Company-ID` header or URL param); dashboard APIs require JWT session
3. **Soft-delete for jobs** — `DELETE` sets `active: false`, preserving data and application references
4. **JSON CV data** — Entire CV stored as flexible JSON blob in `Application.cvData`, enabling schema-free evolution
5. **SSE streaming** — AI chat uses Server-Sent Events for word-by-word streaming with `cv_update` events
6. **WCAG contrast validation** — AI template generator auto-corrects accessibility violations before applying CSS
7. **Server Components by default** — Dashboard pages are async server components; only interactive pieces are client components
8. **Upsert pattern** — All config models use Prisma `upsert` for seamless first-time creation
9. **Environment-aware caching** — Widget and API responses use `no-cache` in development, production caching in production

### CORS Configuration
- Widget static files (`/widget/*`): `Access-Control-Allow-Origin: *`
- API v1 routes (`/api/v1/*`): `Access-Control-Allow-Origin: *`, methods: GET/POST/OPTIONS, headers: Content-Type/X-Company-ID

### Navigation Structure (Sidebar)
1. Dashboard (`/dashboard`) — Overview & stats
2. Jobs (`/jobs`) — Job management
3. Applications (`/applications`) — Application pipeline
4. Configuration (`/configuration`) — All settings
5. Embed Code (`/embed`) — Widget installation
