# HireKit — Feature Gap Analysis & Implementation Plan

**For: Claude Agent Development Team**
**Date: February 2026**
**Scope: Current system audit, competitive gap analysis, market penetration strategy, and prioritized implementation plan**

---

## PART 1: Current System Audit

### What HireKit Has Today (Mapped to Market Categories)

| Category | Feature | Status | Market Comparison |
|----------|---------|--------|-------------------|
| **Core ATS** | Job CRUD (create, read, update, soft-delete) | ✅ Built | Table stakes — all competitors have this |
| | Application pipeline (6 statuses) | ✅ Built | Table stakes — solid implementation |
| | Kanban drag-and-drop board | ✅ Built | Table stakes — good with @dnd-kit |
| | Application table view with filters | ✅ Built | Table stakes |
| | Dashboard with stats & charts | ✅ Built | Above average for MVP — trend charts, funnel, top jobs |
| | Pagination (20/page) | ✅ Built | Adequate |
| **Widgets** | Embeddable CV Builder (form + AI chat modes) | ✅ Built | **Unique differentiator** — no competitor offers this |
| | Embeddable Job Listings (10 templates) | ✅ Built | **Strong** — most competitors offer 1-2 styles max |
| | Shadow DOM isolation | ✅ Built | Best practice — only Ashby does this well |
| | In-widget apply flow (jobs → CV builder modal) | ✅ Built | **Killer feature** — eliminates redirect problem |
| | JSON-LD for Google Jobs | ✅ Built | Competitive with Teamtailor, ahead of most SMB tools |
| **AI** | AI candidate scoring (GPT-4) | ✅ Built | Competitive — Manatal, Breezy have similar |
| | AI chat CV builder (SSE streaming) | ✅ Built | **Unique** — no competitor has conversational CV building |
| | AI template generator (website → CSS) | ✅ Built | **Unique** — Puppeteer + GPT-4o vision pipeline is innovative |
| | WCAG contrast validation | ✅ Built | Ahead of market |
| **Config** | Brand customization (colors, fonts, logo) | ✅ Built | Table stakes |
| | CV section toggle + min/max | ✅ Built | Good flexibility |
| | 6 CV templates + 10 job listing templates | ✅ Built | Above average template variety |
| | Widget type toggle (form/chat) | ✅ Built | Good |
| **Auth** | Email/password auth (NextAuth + JWT) | ✅ Built | Functional but basic |
| | Onboarding wizard (3 steps) | ✅ Built | Good first-run experience |
| **Infra** | Rate limiting | ✅ Built | Good |
| | CORS for widgets | ✅ Built | Required |
| | Security headers | ✅ Built | Good |
| | Stripe schema (not connected) | ⚠️ Schema only | Not functional yet |

### Honest Assessment: What's Strong

1. **Widget ecosystem is genuinely best-in-class.** The combination of embeddable CV builder + embeddable job listings + in-widget apply flow is something no competitor in the SMB ATS space offers. This is the wedge.

2. **AI template generator is a wow-moment feature.** Paste your URL → get a perfectly branded job board widget. This is a demo closer.

3. **Template variety is excellent** for the stage. 10 job listing templates and 6 CV templates gives real customization.

4. **The tech stack is modern and appropriate.** Next.js 14 App Router, Prisma, Shadow DOM widgets, SSE streaming — all solid choices.

---

## PART 2: Critical Gaps — What's Missing

This is the honest part. Compared against what every SMB ATS buyer expects in 2026, HireKit has significant gaps in four categories. These aren't nice-to-haves — they are deal-breakers that will cause prospects to bounce during evaluation.

### 🔴 TIER 1: Deal-Breakers (Will lose every competitive deal without these)

#### Gap 1: No Candidate Email Communication

**What's missing:** There is zero ability to email candidates from within HireKit. No email templates, no send functionality, no communication history, no automated notifications.

**Why it's a deal-breaker:** Email communication is the #1 most-used ATS feature after pipeline management. Every single competitor — from the cheapest (JazzHR at $39/mo) to the most expensive (Greenhouse) — has this. Recruiters need to:
- Send application received confirmations
- Send rejection emails
- Send interview invitations
- Send offer letters
- Send status update notifications
- See a communication timeline per candidate

Without this, the recruiter's workflow is: see candidate in HireKit → switch to Gmail → compose email → switch back. This breaks the value prop of "one tool for hiring."

**Market benchmark:** 100% of competitors have this. Automated emails triggered by status changes are standard. Email templates with merge fields (candidate name, job title, company name) are expected.

#### Gap 2: No Interview Scheduling

**What's missing:** There is no interview scheduling functionality. No calendar integration, no time slot management, no candidate self-scheduling, no interview tracking.

**Why it's a deal-breaker:** Interview scheduling is the second most time-consuming part of hiring after sourcing. 49% of organizations now require scheduling integration (Lever 2025 Recruiter Nation Report). Every ATS tier — even the budget ones — integrates with Google Calendar and/or Outlook, lets candidates self-schedule, and tracks interview status.

Without this, the recruiter must: manually check calendars → email candidate → wait for response → confirm → add to personal calendar. This back-and-forth alone causes 3-5 day delays per candidate on average.

**Market benchmark:** Workable, Manatal, JazzHR, Breezy, Pinpoint, Lever — all have built-in scheduling with calendar sync. Calendly/Cal.com integrations are considered minimum viable.

#### Gap 3: No Job Board Distribution / Multi-Posting

**What's missing:** Jobs exist only in HireKit. There is no ability to post jobs to external job boards (Indeed, LinkedIn, Google Jobs via XML feed, ZipRecruiter, Glassdoor, etc.). The JSON-LD on the embed widget helps with Google Jobs, but that only works if the customer has actually embedded the widget on their site.

**Why it's a deal-breaker:** The #1 reason SMBs buy an ATS is to stop manually posting to 5+ job boards separately. "Post once, publish everywhere" is arguably the primary value proposition of an ATS for small companies. Without it, HireKit is only useful for inbound applications through the customer's own website — which for most SMBs represents <30% of their candidate pipeline.

**Market benchmark:** Manatal posts to 2,500+ boards. Workable has 200+ board integrations. JazzHR has Indeed, LinkedIn, ZipRecruiter, Glassdoor. Even Recooty (free tier) has basic board posting. Greenhouse has native LinkedIn, Indeed, Monster, ZipRecruiter integration. This is table stakes.

#### Gap 4: No Team Collaboration Features

**What's missing:** There is a single user model — the person who signed up. There is no ability to:
- Invite team members with different roles
- Assign candidates to specific reviewers
- Add collaborative evaluation notes/scorecards
- @mention colleagues
- Set up hiring manager permissions (limited view vs. full admin)

The `CompanyUser` table exists with a `role` field, but there is no UI or API for inviting users, managing roles, or any multi-user workflow.

**Why it's a deal-breaker:** Hiring is a team activity. Even in a 5-person company, at least 2-3 people are involved in hiring decisions. If only one person can access HireKit, the hiring manager has to relay information manually (screenshots, forwarded emails). This eliminates 60%+ of the ATS value proposition.

**Market benchmark:** Every competitor supports team accounts. Greenhouse, Ashby, and Lever have sophisticated permission models. JazzHR and Breezy offer unlimited users. Workable charges per employee but includes multiple roles.

### 🟡 TIER 2: Competitive Disadvantages (Will lose most evaluations without these)

#### Gap 5: No Hosted Career Page

The system documentation mentions `LandingPage` model with `domain`, `customDomain`, `title` fields — but the landing page at the Vercel URL is a marketing/sales page for HireKit itself, not a hosted career page for customers. There is no `career.hirekit.com/[companySlug]` functionality visible.

**Impact:** Customers who don't want to embed widgets (or can't modify their website) have no way to create a career page. The embed code is the only distribution method.

#### Gap 6: No Candidate Activity Timeline

Individual application detail pages show CV data and status, but there's no chronological activity feed showing: when the application was received, who changed the status and when, when emails were sent, when notes were added, when AI scoring was performed.

**Impact:** With multiple team members (once Gap 4 is fixed), there's no audit trail of who did what. This is also a GDPR compliance concern for European customers.

#### Gap 7: No Email Verification / OAuth Login

Authentication is email/password only. No email verification flow, no Google/Microsoft OAuth, no password reset functionality.

**Impact:** Security concern for B2B buyers. Google/Microsoft OAuth is expected in 2026 SaaS. Password reset is a critical missing flow — users who forget their password are locked out.

#### Gap 8: No Structured Evaluation / Scorecards

The application detail page has an AI score and a notes field, but there are no structured evaluation forms. No ability to create interview scorecards, rate candidates on specific criteria, or collect standardized feedback from interviewers.

**Impact:** "Structured hiring" is the methodology that Greenhouse pioneered and the market now expects. Without scorecards, hiring decisions are based on gut feel rather than data, which is the problem ATS software is supposed to solve.

#### Gap 9: No Reporting Beyond Dashboard

The dashboard has basic charts (30-day trend, pipeline funnel, top jobs), but there are no exportable reports, no time-to-hire metrics, no source tracking, no conversion rate reports, no pipeline velocity metrics.

**Impact:** Managers and executives need to justify ATS spend. Without reports showing "we reduced time-to-hire by X days" or "Indeed produces 40% of our hires," the value is hard to prove and churn risk increases.

### 🟢 TIER 3: Nice-to-Haves (Can win without these initially, but need them for growth)

| Gap | Description | When Needed |
|-----|-------------|-------------|
| Custom pipeline stages | Fixed 6-stage pipeline; some businesses need custom stages | After first 50 customers |
| Bulk actions | No bulk reject, bulk email, bulk status change | After significant application volume |
| Candidate search / talent pool | Can't search across all candidates across jobs | After 6 months |
| Integrations (Zapier, Slack, HRIS) | No third-party integrations whatsoever | After product-market fit |
| Offer management / e-signatures | No offer letter generation or signing | After v1.5 |
| Mobile app / responsive dashboard | Dashboard is desktop-only (widgets are responsive) | After v2.0 |
| Webhooks / public API for customers | Only internal APIs exist | After first 20 enterprise-ish accounts |
| GDPR consent management for candidates | No consent tracking for candidate data | Before any EU launch |
| Multi-language dashboard | Dashboard is English only | After expanding beyond English-speaking markets |

---

## PART 3: Market Penetration Strategy

### Where HireKit Can Win

Given the current state, HireKit should NOT try to compete head-on with Greenhouse, Workable, or even Manatal as a "full ATS." That's a losing strategy — they have years of feature accumulation.

Instead, HireKit should lead with its genuine differentiators and use them to open the door, then gradually fill ATS gaps to retain customers.

### The Wedge: "Embedded Recruitment Infrastructure"

**Positioning:** HireKit is NOT "another ATS." It's **embeddable recruitment infrastructure** — the hiring tools that live on YOUR website.

**Target buyers who have a specific problem:**
1. **Companies building or redesigning their career page** — they Google "embed job listings on website" or "career page builder." HireKit's embed-first approach is exactly what they're looking for.
2. **Companies frustrated with ugly ATS application pages** — they hate that Greenhouse/Lever redirects candidates to `boards.greenhouse.io`. HireKit keeps everything on their domain.
3. **Recruitment agencies building career pages for clients** — white-label embeddable widgets are perfect for agencies managing multiple client brands.
4. **Tech companies with custom career sites** — they want API-first tools, not drag-and-drop builders. HireKit's widget approach fits their stack.

### Why This Wedge Works

- **Smaller market, less competition.** "Embeddable job board widget" has fewer players than "ATS." The competition is Elfsight (basic widget, no ATS), SubPage (limited), or raw Greenhouse API (complex).
- **The CV builder is a trojan horse.** No one else has it. A company embeds the CV builder → they need somewhere to manage applications → they're already in HireKit's ATS → they stay.
- **It's a bottom-up sale.** A developer or marketing person discovers HireKit, pastes the embed code, and it works. No need to convince the entire HR department to switch ATS tools.
- **Expansion path is natural.** Start with embeds → "Hey, this ATS dashboard is actually useful" → add team members → become the primary hiring tool.

### Target ICP (Ideal Customer Profile)

| Attribute | Description |
|-----------|-------------|
| **Company size** | 5-100 employees |
| **Hiring volume** | 2-20 open roles at any time |
| **Current tools** | Spreadsheets + email, or frustrated with current ATS |
| **Technical ability** | Has someone who can paste embed code (developer, marketer, or agency) |
| **Industry** | Tech, SaaS, agencies, e-commerce, professional services |
| **Geography** | Start with English-speaking markets (US, UK, NL, DACH), expand to EU |
| **Pain point** | "Our career page is ugly / we redirect candidates to a crappy ATS page / we want structured applications" |

### SEO & Content Strategy (Primary Acquisition Channel)

| Content Type | Target Keywords | Volume Estimate |
|-------------|----------------|-----------------|
| **Embed-focused pages** | "embed job listings on website," "job board widget," "career page embed code" | Medium volume, low competition |
| **Comparison pages** | "Greenhouse alternative," "Workable alternative for small business," "ATS that embeds on your website" | Medium volume, medium competition |
| **How-to guides** | "how to add jobs to Squarespace," "career page for WordPress," "embed hiring widget Webflow" | High volume, low competition |
| **Template pages** | "free career page templates," "job listing page design" | High volume, medium competition |
| **Problem-solution** | "candidates abandon application redirect," "ATS ruins candidate experience" | Low volume, very low competition |

---

## PART 4: Prioritized Implementation Plan

### Execution Order Rationale

The plan is ordered by **"what unblocks the most revenue/retention."** The first batch fixes deal-breakers that will cause immediate churn during trials. The second batch builds competitive features. The third batch adds growth/retention features.

---

### BATCH 1: "Make It a Real ATS" — Fix Deal-Breakers

These must all be completed before any serious go-to-market effort. A prospect who signs up today and doesn't find email, scheduling, or team features will churn within 48 hours.

---

#### 1.1 Candidate Email System

**What to build:** In-app email composition, templates, automated triggers, and per-candidate communication history.

**Database changes:**

```prisma
model EmailTemplate {
  id          String   @id @default(uuid())
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id])
  name        String                          // "Application Received", "Interview Invite", etc.
  subject     String                          // Subject line with merge fields
  body        String   @db.Text              // HTML body with merge fields
  trigger     String?                         // null = manual, "status:screening", "status:rejected", etc.
  isDefault   Boolean  @default(false)        // System-provided default templates
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model EmailLog {
  id            String      @id @default(uuid())
  companyId     String
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id])
  templateId    String?                       // null if freeform
  to            String                        // recipient email
  subject       String
  body          String      @db.Text
  status        String      @default("sent")  // sent, delivered, bounced, failed
  sentAt        DateTime    @default(now())
  sentBy        String?                       // userId of sender (null if automated)
}
```

**Merge fields to support:**
`{{candidate_name}}`, `{{candidate_email}}`, `{{job_title}}`, `{{company_name}}`, `{{application_status}}`, `{{dashboard_link}}`, `{{interview_date}}`, `{{interview_time}}`, `{{interview_link}}`

**Default templates to seed (create on company registration):**

| Template Name | Trigger | Purpose |
|---------------|---------|---------|
| Application Received | `status:new` (auto) | Confirms receipt of application |
| Moved to Screening | `status:screening` (auto, optional) | Lets candidate know they're being reviewed |
| Interview Invitation | Manual or `status:interviewing` | Includes scheduling link |
| Offer Extended | `status:offered` | Congratulations + next steps |
| Application Rejected | `status:rejected` | Professional rejection with optional feedback |
| Custom | Manual | Freeform email |

**Email sending service:** Use **Resend** (already in the ecosystem from prior analysis). Free tier: 3,000 emails/month, $20/month for 50K. SDK: `npm install resend`.

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: `${companyName} via HireKit <hiring@notifications.hirekit.com>`,
  to: candidateEmail,
  subject: processedSubject,
  html: processedBody,
  replyTo: recruiterEmail  // replies go to the actual recruiter
});
```

**Key implementation note:** Set up a domain `notifications.hirekit.com` with Resend for sending. Use `replyTo` header pointing to the recruiter's actual email. This means HireKit sends on behalf of the company, but replies go directly to the recruiter. This avoids the complexity of a full inbox/reply system (build that later).

**UI components needed:**

1. **Email compose modal** — accessible from application detail page. Has: To (pre-filled), Subject, rich text body (use Tiptap, already likely in the project for job descriptions), template selector dropdown, merge field insert button, send button.

2. **Template manager** — in Settings, new tab "Email Templates." List of templates, edit in-place, toggle auto-trigger on/off per template.

3. **Communication timeline** — on application detail page, below the existing sections. Chronological feed showing: emails sent (with expand to see body), status changes (with who changed it), notes added, AI scores generated. This feeds into Gap 6 (Activity Timeline) simultaneously.

**API endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/email-templates` | List company templates |
| POST | `/api/v1/email-templates` | Create template |
| PATCH | `/api/v1/email-templates/[id]` | Update template |
| DELETE | `/api/v1/email-templates/[id]` | Delete template |
| POST | `/api/v1/applications/[id]/email` | Send email to candidate |
| GET | `/api/v1/applications/[id]/activity` | Get activity timeline (emails, status changes, notes) |
| POST | `/api/v1/applications/batch-email` | Bulk email (send same template to multiple candidates) |

**Automation logic:** When application status changes (via PATCH or Kanban drag), check if an email template exists with a matching trigger. If yes and trigger is enabled, send automatically and log it. Run this as a post-status-change hook, not blocking the status update response.

---

#### 1.2 Team & Collaboration System

**What to build:** Multi-user access with roles, team invitations, and collaborative features on candidates.

**Database changes:**

```prisma
// Extend existing CompanyUser model
model CompanyUser {
  id        String   @id @default(uuid())
  companyId String
  userId    String
  role      String   @default("member")  // "owner", "admin", "hiring_manager", "viewer"
  company   Company  @relation(fields: [companyId], references: [id])
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  
  @@unique([companyId, userId])
}

model Invitation {
  id        String   @id @default(uuid())
  companyId String
  email     String
  role      String   @default("member")
  token     String   @unique @default(uuid())
  expiresAt DateTime
  accepted  Boolean  @default(false)
  invitedBy String                        // userId
  createdAt DateTime @default(now())
}

// Add to Application model
model Application {
  // ... existing fields
  assignedTo String?                      // userId of assigned reviewer
}

// Add evaluation model
model Evaluation {
  id            String      @id @default(uuid())
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id])
  userId        String                    // who submitted this evaluation
  user          User        @relation(fields: [userId], references: [id])
  rating        Int                       // 1-5 overall
  recommendation String                  // "strong_yes", "yes", "neutral", "no", "strong_no"
  notes         String?     @db.Text
  scores        Json?                     // { "skills": 4, "communication": 3, "culture_fit": 5 }
  createdAt     DateTime    @default(now())
  
  @@unique([applicationId, userId])       // one evaluation per person per application
}
```

**Role permissions:**

| Permission | Owner | Admin | Hiring Manager | Viewer |
|------------|-------|-------|----------------|--------|
| Manage company settings | ✅ | ✅ | ❌ | ❌ |
| Manage team members | ✅ | ✅ | ❌ | ❌ |
| Create/edit jobs | ✅ | ✅ | ✅ | ❌ |
| View all applications | ✅ | ✅ | ✅ (assigned jobs only) | ✅ (assigned jobs only) |
| Change application status | ✅ | ✅ | ✅ | ❌ |
| Send emails to candidates | ✅ | ✅ | ✅ | ❌ |
| Submit evaluations | ✅ | ✅ | ✅ | ✅ |
| View reports | ✅ | ✅ | ✅ | ✅ |
| Manage billing | ✅ | ❌ | ❌ | ❌ |

**Invitation flow:**
1. Admin enters email + selects role in Settings > Team tab
2. System creates `Invitation` record with token, sends email via Resend
3. Invitee clicks link → lands on `/invite/[token]` page
4. If invitee has account → accept invitation, create `CompanyUser` record
5. If invitee is new → signup form (name + password), then auto-accept invitation

**UI components:**

1. **Team management tab** in Settings — list of team members (name, email, role, joined date). Invite button. Role change dropdown. Remove button.

2. **Candidate assignment** — on application detail page, dropdown to assign a team member as reviewer. On Kanban cards, show assignee avatar.

3. **Evaluation panel** — on application detail page, below AI Score. Each team member can submit their own evaluation (1-5 rating, recommendation, notes). Shows all evaluations from team members with average rating.

**API endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/team` | List team members |
| POST | `/api/v1/team/invite` | Send invitation |
| DELETE | `/api/v1/team/[userId]` | Remove team member |
| PATCH | `/api/v1/team/[userId]` | Change role |
| POST | `/api/v1/invite/[token]/accept` | Accept invitation |
| POST | `/api/v1/applications/[id]/evaluate` | Submit evaluation |
| GET | `/api/v1/applications/[id]/evaluations` | Get all evaluations |
| PATCH | `/api/v1/applications/[id]/assign` | Assign reviewer |

**Middleware change:** All protected API routes must now check `companyId` from the user's `CompanyUser` record (not just `userId`). Add a `requireRole()` middleware that checks minimum role level.

---

#### 1.3 Interview Scheduling (Build Minimal + Integrate)

**What to build:** A lightweight scheduling system that integrates with Google Calendar and enables candidate self-scheduling.

**Strategy:** Don't build a full calendar system. Integrate with **Cal.com** (open source, self-hostable, generous free tier) OR build a minimal native solution with Google Calendar API. 

**Recommended approach: Native with Google Calendar API.** Reason: Cal.com adds external dependency and its own UX that doesn't feel native. A focused native implementation is achievable and feels more professional.

**Database changes:**

```prisma
model Interview {
  id              String      @id @default(uuid())
  companyId       String
  applicationId   String
  application     Application @relation(fields: [applicationId], references: [id])
  scheduledBy     String                          // userId
  interviewers    String[]                        // array of userIds
  candidateEmail  String
  title           String                          // "Phone Screen with Sarah"
  startTime       DateTime
  endTime         DateTime
  timezone        String     @default("UTC")
  location        String?                         // "Google Meet", "Office Room 3", URL
  meetingLink     String?                         // auto-generated Google Meet link
  notes           String?
  status          String     @default("scheduled") // scheduled, confirmed, completed, cancelled, no_show
  calendarEventId String?                         // Google Calendar event ID
  feedback        Json?                           // post-interview feedback
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

model CalendarConnection {
  id           String   @id @default(uuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  provider     String                          // "google", "outlook"
  accessToken  String   @db.Text
  refreshToken String   @db.Text
  expiresAt    DateTime
  calendarId   String?                         // specific calendar to use
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model SchedulingLink {
  id              String   @id @default(uuid())
  companyId       String
  applicationId   String?                      // if linked to specific application
  token           String   @unique @default(uuid())
  interviewerIds  String[]
  duration        Int      @default(30)        // minutes
  title           String
  location        String?
  availableFrom   DateTime
  availableTo     DateTime
  bookedAt        DateTime?
  expiresAt       DateTime
  createdAt       DateTime @default(now())
}
```

**Google Calendar integration:**
- Use `googleapis` npm package
- OAuth2 flow: Settings > Integrations > "Connect Google Calendar" button
- Scopes needed: `calendar.events`, `calendar.readonly`
- When creating interview: create Google Calendar event with candidate as attendee → auto-generates Google Meet link
- Read interviewer availability from their Google Calendar free/busy data

**Candidate self-scheduling flow:**
1. Recruiter clicks "Schedule Interview" on application detail page
2. Selects: interviewer(s), duration (15/30/45/60 min), date range, location type
3. System generates a `SchedulingLink` with unique token
4. Email is sent to candidate with link: `https://schedule.hirekit.com/[token]`
5. Candidate sees available time slots (computed from interviewer Google Calendar free/busy)
6. Candidate picks a slot → Interview record created → Google Calendar event created → confirmation emails sent to both parties

**If no Google Calendar connected (fallback):**
- Recruiter manually picks date/time
- System sends email to candidate with proposed time
- No availability checking

**UI components:**

1. **Interview section** on application detail page — shows scheduled interviews (date, time, interviewers, status). "Schedule Interview" button.

2. **Schedule Interview modal** — select interviewers, duration, date range, location. Preview available slots. Send to candidate.

3. **Candidate scheduling page** (`/schedule/[token]`) — public page. Shows available time slots in candidate's timezone. Candidate selects → confirms.

4. **Calendar connection** in Settings > Integrations tab — "Connect Google Calendar" OAuth button. Shows connected state.

5. **Upcoming interviews** widget on Dashboard — list of next 5 interviews with quick access.

**API endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/interviews` | Create interview / send scheduling link |
| GET | `/api/v1/interviews` | List interviews (filters: upcoming, past, by application) |
| PATCH | `/api/v1/interviews/[id]` | Update interview (reschedule, cancel, add feedback) |
| GET | `/api/v1/schedule/[token]` | Public: get available time slots |
| POST | `/api/v1/schedule/[token]/book` | Public: candidate books a time slot |
| GET | `/api/v1/calendar/connect` | Initiate Google OAuth flow |
| GET | `/api/v1/calendar/callback` | Google OAuth callback |
| GET | `/api/v1/calendar/availability` | Get free/busy for interviewers |

---

#### 1.4 Basic Job Board Distribution

**What to build:** Ability to post jobs to major job boards from within HireKit. Start with the free/XML-feed boards, add paid boards later.

**Phase 1 — Free distribution (build now):**

| Channel | Integration Method | Cost | Priority |
|---------|--------------------|------|----------|
| **Google Jobs** | JSON-LD structured data on career page + sitemap | Free | Already partially done via widget |
| **Indeed** | Indeed XML feed (`/api/v1/public/feed/indeed/[companyId]`) | Free (organic) | High |
| **LinkedIn** | Job wrapping / manual posting link (no free API for job posting) | Free (organic) | Medium |
| **Jooble** | XML feed | Free | Medium |
| **Glassdoor / Indeed** | Shared feed via Indeed (same company) | Free | Included with Indeed |

**Indeed XML Feed specification:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<source>
  <publisher>HireKit</publisher>
  <publisherurl>https://hirekit.com</publisherurl>
  <lastBuildDate>Wed, 18 Feb 2026 12:00:00 GMT</lastBuildDate>
  <job>
    <title>Software Engineer</title>
    <date>Wed, 18 Feb 2026 00:00:00 GMT</date>
    <referencenumber>job-uuid</referencenumber>
    <url>https://career.hirekit.com/company-slug/software-engineer</url>
    <company>Acme Corp</company>
    <city>Amsterdam</city>
    <state></state>
    <country>NL</country>
    <description><![CDATA[Full job description HTML]]></description>
    <salary>€50,000-€70,000</salary>
    <jobtype>fulltime</jobtype>
  </job>
</source>
```

**API endpoint:** `GET /api/v1/public/feed/indeed/[companyId]` — returns XML feed of all active jobs. Customer submits this URL to Indeed's employer dashboard to register the feed.

**Implementation:** Create feed generator endpoints. Add "Job Distribution" section in job creation/edit form with toggle for each board. In Settings, add "Job Boards" tab where customer enters their Indeed employer account info (for feed submission instructions).

**Phase 2 — Paid/API boards (build later, post product-market fit):**
- Indeed Sponsored Jobs API
- LinkedIn Job Posting API (requires partnership)
- ZipRecruiter API
- Build via aggregator like Broadbean or Joveo (abstracts 100+ boards)

---

#### 1.5 Auth Improvements

**What to build:** Password reset flow, Google OAuth, email verification.

**Password reset:**
1. "Forgot password?" link on login page → enter email
2. System generates reset token, stores in DB with 1-hour expiry
3. Email sent via Resend with link: `/auth/reset-password/[token]`
4. User enters new password → token consumed

```prisma
model PasswordResetToken {
  id        String   @id @default(uuid())
  email     String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

**Google OAuth:**
- Add Google provider to NextAuth.js configuration
- `npm install next-auth @auth/google-provider` (or update existing NextAuth config)
- On first Google OAuth login: check if user exists by email → if yes, link account; if no, create user + show onboarding
- Requires Google Cloud Console project with OAuth consent screen

```typescript
// NextAuth config addition
import GoogleProvider from "next-auth/providers/google";

providers: [
  CredentialsProvider({ /* existing */ }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
]
```

**Email verification:**
- On signup, send verification email with token link
- `emailVerified` field already exists in User model
- Until verified: show banner "Please verify your email" but don't block access
- Resend verification option in settings

---

### BATCH 2: "Compete on Features" — Competitive Parity

These features bring HireKit to par with mid-tier competitors. Build after Batch 1 is stable and you have initial users providing feedback.

---

#### 2.1 Hosted Career Page

**What to build:** As detailed in the previous career page analysis. A standalone career page at `career.hirekit.com/[companySlug]` with custom domain support.

**Implementation summary:**
- New Next.js route group or separate app on Cloudflare Pages
- SSR pages with company branding, job listings, job detail, apply flow
- 3-5 career page templates (selectable in Settings)
- Custom domain via CNAME verification + auto-SSL
- SEO: sitemap.xml, robots.txt, OG tags, JSON-LD per job
- Built-in analytics (page views, job clicks, applications)

**Database:** Uses existing `LandingPage` model — extend with template selection and additional content fields:

```prisma
model LandingPage {
  // ... existing fields
  template       String   @default("modern")    // modern, corporate, minimal, creative, tech
  heroImage      String?
  aboutSection   String?  @db.Text
  benefitsList   Json?                           // ["Remote work", "Health insurance", ...]
  socialLinks    Json?                           // { linkedin: "", twitter: "", ... }
  gaTrackingId   String?
  pixelCode      String?  @db.Text
}
```

**The key integration:** Career page "Apply" button opens the CV Builder widget — same widget that works on the embed. Zero additional code for the application flow.

---

#### 2.2 Structured Evaluations / Scorecards

**What to build:** Customizable evaluation forms that team members fill out after interacting with candidates.

**Database:** Already defined in section 1.2 (`Evaluation` model). Additionally:

```prisma
model Scorecard {
  id        String   @id @default(uuid())
  companyId String
  company   Company  @relation(fields: [companyId], references: [id])
  name      String                          // "Engineering Interview", "Culture Fit Screen"
  criteria  Json                            // [{ name: "Technical Skills", weight: 3 }, ...]
  jobIds    String[]                        // linked to specific jobs, empty = all jobs
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**UI:** In Settings > Scorecards, create evaluation templates with weighted criteria. On application detail page, "Evaluate" button opens the matching scorecard as a form. Each team member fills it independently. Summary view shows all evaluations side-by-side with aggregate scores.

---

#### 2.3 Activity Timeline

**What to build:** Chronological event log per application showing all activity.

```prisma
model ActivityLog {
  id            String      @id @default(uuid())
  companyId     String
  applicationId String
  application   Application @relation(fields: [applicationId], references: [id])
  type          String                        // "status_change", "email_sent", "note_added", "evaluation", "interview_scheduled", "ai_scored", "assigned"
  data          Json                          // type-specific payload
  performedBy   String?                       // userId (null for system/automated actions)
  createdAt     DateTime    @default(now())
}
```

**Implementation:** Add `ActivityLog.create()` calls wherever application state changes: status updates, emails, evaluations, interview creation, AI scoring, assignments, note edits. Display as a timeline component on the application detail page.

---

#### 2.4 Enhanced Reporting

**What to build:** A `/reports` page with configurable hiring reports.

**Reports to implement:**

| Report | What It Shows | Chart Type |
|--------|--------------|------------|
| Time to Hire | Average days from application → hired, by job and period | Line chart |
| Pipeline Conversion | Conversion rate between each stage | Funnel |
| Source Analysis | Where applications come from (widget, career page, Indeed feed, direct) | Pie/bar chart |
| Job Performance | Applications per job, conversion per job, time-to-fill per job | Table + bars |
| Team Activity | Evaluations submitted, emails sent, status changes by team member | Bar chart |
| Hiring Velocity | Applications received per week/month, trending | Line chart |

**Source tracking:** Add `source` field to `Application` model. Set automatically based on referrer: `embed-widget`, `career-page`, `indeed`, `linkedin`, `direct`, `api`. The widget and career page should pass a source parameter.

```prisma
model Application {
  // ... existing fields
  source String? // "embed-widget", "career-page", "indeed", "linkedin", "api", "manual"
}
```

**Tech:** Use Recharts (likely already in the project for dashboard charts). Server-side aggregation queries using Prisma's `groupBy` and `aggregate`. Date range selector. Export to CSV.

---

#### 2.5 GDPR Compliance Module

**Essential for EU market (your primary geography).**

```prisma
model CandidateConsent {
  id            String   @id @default(uuid())
  applicationId String
  email         String
  consentType   String                      // "data_processing", "talent_pool", "marketing"
  consentGiven  Boolean
  consentText   String   @db.Text           // exact text they consented to
  ipAddress     String?
  givenAt       DateTime @default(now())
  revokedAt     DateTime?
}

model DataDeletionRequest {
  id          String   @id @default(uuid())
  companyId   String
  email       String
  status      String   @default("pending") // pending, completed
  requestedAt DateTime @default(now())
  completedAt DateTime?
}
```

**Features:**
- Consent checkbox on CV Builder widget application form (configurable text in Settings)
- Data retention policy: auto-flag applications older than configurable period (default 12 months)
- Right to deletion: candidate can request deletion (email link in all candidate-facing emails)
- Data export: "Export all data for candidate" feature for DSAR compliance
- Cookie consent / privacy policy link on career pages
- GDPR toggle in Settings that enables all consent features

---

### BATCH 3: "Grow and Retain" — Differentiation & Expansion

Build these as customer feedback demands and you approach product-market fit.

---

#### 3.1 AI Job Description Generator

**Quick win.** Customer creates a new job → clicks "Generate with AI" → enters job title + a few bullet points → GPT-4 generates a full job description with requirements, benefits, and company-appropriate tone.

```typescript
// API: POST /api/v1/jobs/generate-description
// Input: { title, bullets, tone, companyContext }
// Output: { description: "Full HTML job description" }
```

**Use the same LangChain setup already in place.** System prompt includes company info from Branding model. ~50 lines of code.

---

#### 3.2 Bulk Actions

- Bulk status change (select multiple candidates → change status)
- Bulk email (select multiple → send template)
- Bulk reject (select → reject all → send rejection emails)

**UI:** Checkbox column in applications table. Floating action bar appears when >0 selected. Actions: Change Status, Send Email, Reject All.

---

#### 3.3 Candidate Search / Talent Pool

- Global search across all candidates (not just per-job)
- "Talent Pool" tab: candidates who applied but weren't hired, searchable by skills/experience
- When new job is created, AI suggests matching candidates from talent pool

---

#### 3.4 Zapier / Webhook Integration

- Outbound webhooks: configurable URL called on events (new application, status change, new hire)
- Zapier integration via webhook triggers
- This unlocks: HireKit → Slack notifications, HireKit → Google Sheets logging, HireKit → BambooHR sync, etc.

---

#### 3.5 Custom Pipeline Stages

- Replace fixed 6 stages with configurable pipeline per company (or per job)
- Default stages seeded on company creation
- Drag-to-reorder stages
- Custom stage colors and names

---

## PART 5: Technical Architecture Notes for the Agent Team

### General Principles

1. **Server Components by default.** The existing pattern of async server components for pages with client components only for interactive pieces is correct. Continue this.

2. **API route pattern.** Continue the `api/v1/` prefix pattern. Add middleware for role-based access control that wraps route handlers.

3. **Prisma patterns.** Continue using `upsert` for config models. For new models, use `create` with proper error handling. Add Prisma middleware for automatic `updatedAt` timestamps.

4. **Email service.** Use Resend throughout. Single `lib/email.ts` module that exports `sendEmail()`, `sendTemplatedEmail()`, and `sendBulkEmail()`. Handle merge field replacement in a shared utility.

5. **Activity logging.** Create a `lib/activity.ts` module with `logActivity(companyId, applicationId, type, data, userId?)`. Call this from every mutation that affects application state. This is the foundation for the timeline AND for future reporting.

6. **Feature flags.** Consider adding a simple feature flag system (even just a JSON field on Company) to gate features by plan. This enables the Starter/Growth/Business tier gating.

### File/Folder Structure for New Features

```
app/
├── (dashboard)/
│   ├── applications/
│   │   └── [id]/
│   │       ├── page.tsx              // existing — extend with timeline, evaluations
│   │       ├── email-modal.tsx       // new: email compose
│   │       └── evaluation-form.tsx   // new: scorecard evaluation
│   ├── reports/
│   │   └── page.tsx                  // new: reports page
│   ├── settings/
│   │   ├── page.tsx                  // existing — add Team, Email Templates, Integrations tabs
│   │   └── team/                     // new: team management components
│   └── schedule/                     // new: interview scheduling views
├── auth/
│   ├── reset-password/
│   │   └── [token]/page.tsx         // new: password reset
│   └── ...
├── invite/
│   └── [token]/page.tsx             // new: team invitation acceptance
├── schedule/
│   └── [token]/page.tsx             // new: public candidate self-scheduling
├── career/
│   └── [companySlug]/               // new: hosted career pages
│       ├── page.tsx
│       └── [jobSlug]/page.tsx
└── api/
    └── v1/
        ├── email-templates/         // new
        ├── interviews/              // new
        ├── team/                    // new
        ├── calendar/                // new
        ├── schedule/                // new (public)
        ├── reports/                 // new
        └── public/
            └── feed/
                └── indeed/[companyId]/ // new: XML feed
```

### Third-Party Services Summary

| Service | Purpose | Package | Cost |
|---------|---------|---------|------|
| **Resend** | Email sending | `resend` | Free (3K/mo) → $20/mo |
| **Google APIs** | Calendar, OAuth | `googleapis`, `next-auth` | Free |
| **Cloudflare** | Career page hosting, CDN, custom domains | Cloudflare Pages | Free |
| **Let's Encrypt** | SSL for custom domains | Auto via Cloudflare | Free |
| **OpenAI** | AI scoring, chat, templates (existing) | `openai`, `langchain` | Usage-based |

### Environment Variables to Add

```env
# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_DOMAIN=notifications.hirekit.com

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Google Calendar API (uses same OAuth, additional scopes)
GOOGLE_CALENDAR_SCOPES=https://www.googleapis.com/auth/calendar.events,https://www.googleapis.com/auth/calendar.readonly
```

---

## PART 6: Execution Priority Summary

| Order | Feature | Batch | Effort | Impact |
|-------|---------|-------|--------|--------|
| **1** | Candidate Email System | 1 | Medium | 🔴 Deal-breaker fix |
| **2** | Team & Collaboration | 1 | Medium-Large | 🔴 Deal-breaker fix |
| **3** | Auth improvements (password reset, Google OAuth) | 1 | Small | 🔴 Deal-breaker fix |
| **4** | Interview Scheduling | 1 | Medium | 🔴 Deal-breaker fix |
| **5** | Activity Timeline | 2 | Small | 🟡 Enables collaboration |
| **6** | Job Board Distribution (Indeed XML feed) | 1 | Small | 🔴 Major value gap |
| **7** | AI Job Description Generator | 3 | Small | 🟢 Quick win, impressive demo |
| **8** | GDPR Compliance Module | 2 | Medium | 🟡 Required for EU launch |
| **9** | Hosted Career Page | 2 | Medium | 🟡 Competitive parity |
| **10** | Structured Evaluations | 2 | Small-Medium | 🟡 Collaboration enabler |
| **11** | Enhanced Reporting | 2 | Medium | 🟡 Retention feature |
| **12** | Bulk Actions | 3 | Small | 🟢 Power user feature |
| **13** | Candidate Search / Talent Pool | 3 | Medium | 🟢 Growth feature |
| **14** | Zapier / Webhooks | 3 | Small-Medium | 🟢 Integration ecosystem |
| **15** | Custom Pipeline Stages | 3 | Medium | 🟢 Flexibility |

---

## PART 7: Landing Page Feedback

The current landing page at `hirekit-nine.vercel.app` needs adjustment to match the product's actual positioning:

**Current messaging problem:** The page leads with "Stop sorting CVs. Start hiring faster." and the primary pitch is around the CV Builder widget. This undersells the product. It positions HireKit as a single-purpose tool (CV builder) rather than a hiring platform.

**Recommended repositioning:**

- **Headline:** "Your career page. Your hiring pipeline. One embed." or "Hire directly from your website — no redirects, no clunky ATS pages."
- **Sub-headline:** "Embed a beautiful job board and CV builder on your site. Manage candidates with AI-powered screening. Start in 5 minutes."
- **Feature hierarchy:** Lead with the embed + ATS combo, not just the CV builder. Show the job listing widget prominently. Demonstrate the candidate experience: see job → apply → CV built → submitted — all on one page.
- **Social proof urgency:** "Early access — full platform, $0/month" is good. Add "currently used by X companies" once you have any users.
- **CTA clarity:** "Embed on your site in 5 minutes" is more actionable than "Start free trial"

The "PDF Chaos / Inbox Overflow / Bad UX" problem section is effective and should stay. The pipeline/Kanban demo is good. The feature cards are comprehensive but should reorder to lead with embeddable job board + CV builder as the hero differentiator, with ATS features as supporting.

---

*This plan is designed to be handed to a Claude agent development team for execution. Each section contains the database schema, API specifications, UI components, and third-party service details needed to implement without further architecture decisions. The execution order is sequenced so each batch builds on the previous one and no feature depends on something that hasn't been built yet.*
