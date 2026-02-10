# HIREKIT + LADDERFOX MONOREPO MIGRATION & IMPLEMENTATION GUIDE

**Version:** 1.1 (Revised)
**Date:** February 10, 2026
**Prepared for:** HireKit Development Team  
**Document Type:** Complete Technical Architecture & Migration Guide

---

## TABLE OF CONTENTS

1. [EXECUTIVE SUMMARY & ARCHITECTURE OVERVIEW](#part-1-executive-summary--architecture-overview)
2. [MONOREPO STRUCTURE & SETUP](#part-2-monorepo-structure--setup)
3. [DATABASE ARCHITECTURE (NEON)](#part-3-database-architecture-neon)
4. [SHARED PACKAGES EXTRACTION](#part-4-shared-packages-extraction)
5. [STEP-BY-STEP MIGRATION GUIDE](#part-5-step-by-step-migration-guide)
6. [HIREKIT IMPLEMENTATION GUIDE](#part-6-hirekit-implementation-guide)
7. [DEPLOYMENT CONFIGURATION](#part-7-deployment-configuration)
8. [TESTING & VERIFICATION](#part-8-testing--verification)
9. [TROUBLESHOOTING GUIDE](#part-9-troubleshooting-guide)
10. [POST-MIGRATION CHECKLIST](#part-10-post-migration-checklist)
11. [APPENDICES](#appendix-a-quick-reference-commands)

---

# PART 1: EXECUTIVE SUMMARY & ARCHITECTURE OVERVIEW

## 1.1 Project Goals

Migrate existing LadderFox (B2C CV builder) into a monorepo structure while building HireKit (B2B embedded CV builder for companies). Both products will share core CV building components but maintain completely separate databases, deployments, and business logic.

## 1.2 Key Architectural Decisions

**DECISION 1: MONOREPO STRUCTURE**
- Tool: Turborepo (simpler than Nx for our use case)
- Package manager: PNPM (**NOTE:** LadderFox currently uses npm, not PNPM. Migration to PNPM is an additional required step — see Phase 0 in section 1.6)
- Justification: Code reuse for CV builder components, unified tooling, atomic deploys

**DECISION 2: SEPARATE DATABASES**
- LadderFox: Keep existing Neon database (neondb)
- HireKit: New Neon database (hirekit_db) in same project
- Justification: Clean data separation, no risk to existing users, independent scaling

**DECISION 3: NO CROSS-PRODUCT COMMUNICATION**
- LadderFox and HireKit operate independently
- Share code via packages, NOT via APIs
- Justification: Loose coupling, easier maintenance, no runtime dependencies

**DECISION 4: INDEPENDENT DEPLOYMENTS**
- Each app deploys separately to Vercel
- Independent domains and environment variables
- Justification: Independent release cycles, isolated failures

## 1.3 What Gets Shared vs. What Stays Separate

**SHARED (via packages) — from Day 1:**
- CVData TypeScript types and validation schemas (`@repo/types`)
- UI components: buttons, inputs, modals (`@repo/ui`)
- Tailwind configuration (`@repo/tailwind-config`)
- TypeScript and ESLint configuration
- NEW CV builder for HireKit (`@repo/cv-builder` — purpose-built, not extracted)

**SHARED — later (Phase 6+, after HireKit is functional):**
- CV template rendering logic (gradually ported from LadderFox)
- PDF generation utilities
- Email templates (basic structure)

**SEPARATE (app-specific):**
- Database schemas (completely different models)
- API routes (different business logic)
- Authentication flows (different user types)
- Subscription systems (B2C vs B2B pricing)
- Landing pages and marketing content
- Business logic and workflows
- LadderFox's existing CV components (CVEditor, CVPreview, CVPreviewServer, ATSChecker — these stay in LadderFox, too deeply coupled to extract initially)

## 1.4 Technology Stack Comparison

**LADDERFOX (B2C - Existing):**
- Next.js 14.2.30 App Router
- Neon PostgreSQL (neondb)
- NextAuth.js (Google OAuth + email/password)
- Stripe (B2C pricing: €14.99/month)
- OpenAI + LangChain (multi-agent CV assistance)
- Uploadthing (CV photos, PDFs)
- Puppeteer (server-side PDF generation)

**HIREKIT (B2B - New):**
- Next.js 14.2.30 App Router (same)
- Neon PostgreSQL (new database: hirekit_db)
- NextAuth.js (email/password only initially)
- Stripe (B2B pricing: €79-299/month)
- Widget system (Vite-built embeddable component)
- Company branding system (logo, colors, templates)
- Application management (track incoming CVs)

**SHARED PACKAGES:**
- @repo/cv-builder (NEW simplified CV components for HireKit — NOT extracted from LadderFox initially)
- @repo/ui (shared UI components)
- @repo/types (CVData interfaces)
- @repo/database-ladderfox (thin wrapper re-exporting Prisma client from apps/ladderfox)
- @repo/database-hirekit (Prisma schema + client)
- @repo/typescript-config
- @repo/eslint-config
- @repo/tailwind-config

## 1.5 Final Repository Structure
```
recruitment-suite/
│
├── apps/
│   ├── ladderfox/              # Existing B2C app (migrated)
│   ├── hirekit/                # New B2B marketing site
│   ├── hirekit-app/            # New B2B dashboard
│   └── widget/                 # New embeddable widget
│
├── packages/
│   ├── cv-builder/             # Core CV components (extracted)
│   ├── ui/                     # Shared UI components
│   ├── types/                  # Shared TypeScript types
│   ├── database-ladderfox/     # Thin wrapper (Prisma stays in apps/ladderfox/)
│   ├── database-hirekit/       # HireKit Prisma
│   ├── typescript-config/      # Shared TS configs
│   ├── eslint-config/          # Shared ESLint
│   └── tailwind-config/        # Shared Tailwind
│
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

## 1.6 Migration Timeline Estimate

**Phase 0: Preparation & Package Manager Migration (1-2 days)**
- Migrate LadderFox from npm to PNPM (`package-lock.json` → `pnpm-lock.yaml`)
- Verify all existing features still work under PNPM
- Update Vercel install command for PNPM
- Create full backup of production database
- Document all environment variables
- **Gate:** LadderFox works identically under PNPM before proceeding

**Phase 1: Monorepo Setup (3-5 days)**
- Create monorepo structure with Turborepo
- Move LadderFox into `apps/ladderfox/` (keep Prisma schema in place)
- Setup shared config packages (TypeScript, ESLint, Tailwind)
- Create `@repo/types` package with CVData interface
- Preserve LadderFox's `next.config.js` webpack customizations (critical for PDF generation)
- Test all LadderFox features locally
- **Gate:** `pnpm dev --filter=ladderfox` works with zero regressions

**Phase 2: Database Setup (1-2 days)**
- Create HireKit database in Neon (`hirekit_db`)
- Setup `@repo/database-hirekit` package with schema
- Create thin `@repo/database-ladderfox` wrapper (re-exports from existing Prisma setup)
- Run HireKit initial migrations
- **Gate:** Both databases accessible, LadderFox queries unchanged

**Phase 3: Deploy LadderFox from Monorepo (2-3 days)**
- Update Vercel project settings (root directory, build command)
- Deploy to production with rollback plan ready
- Monitor for 24-48 hours for error rate changes
- Verify all critical paths: auth, CV creation, PDF generation, Stripe webhooks, email
- **Gate:** 48 hours of stable production with no error spike

**Phase 4: HireKit Skeleton (3-4 days)**
- Create HireKit marketing site (`apps/hirekit`)
- Create HireKit dashboard app (`apps/hirekit-app`)
- Setup NextAuth for HireKit (separate credentials)
- Implement Company model and basic CRUD
- Setup HireKit middleware (rate limiting, security headers)
- **Gate:** Signup → login → empty dashboard works

**Phase 5: HireKit Core Features (3-4 weeks)**
- Onboarding wizard (branding, template selection, install method)
- Settings pages (company, branding, CV template config)
- Build NEW simplified CV builder for HireKit (not extracted from LadderFox)
- Application management dashboard
- Widget development (Vite + bundled React)
- Stripe integration for B2B plans
- Email notifications (application received, etc.)

**Phase 6: CV Component Refinement (2-3 weeks, can overlap with Phase 5)**
- Gradually port relevant LadderFox CV rendering logic to `@repo/cv-builder`
- Adapt templates for B2B context (company branding, configurable sections)
- PDF generation for HireKit (may reuse Puppeteer approach)
- Decouple shared code from LadderFox-specific dependencies

**Total estimated time: 6-8 weeks**

> **Why longer than a naive estimate?** LadderFox's CV components (CVPreviewServer.tsx alone is 31,791 lines) are deeply coupled to LadderFox-specific stores, flows, and business logic. Extracting them is effectively a partial rewrite. Building fresh for HireKit and gradually porting is faster and safer than attempting to extract from a running production app.

---

# PART 2: MONOREPO STRUCTURE & SETUP

## 2.1 Prerequisites Checklist

Before starting migration:
- [ ] Node.js 18+ installed (check: `node --version`)
- [ ] PNPM installed globally (`npm install -g pnpm`)
- [ ] Git repository with clean working directory
- [ ] Access to Neon database
- [ ] Access to Vercel account
- [ ] Full backup of current LadderFox database
- [ ] All environment variables documented
- [ ] Testing credentials for OAuth providers

**IMPORTANT — Package Manager Migration (Phase 0):**

LadderFox currently uses **npm** (not PNPM). Before creating the monorepo, you must migrate LadderFox to PNPM:

```bash
# From the current LadderFox directory (cv-ai-builder)
# 1. Delete existing npm artifacts
rm -rf node_modules
rm package-lock.json

# 2. Install with PNPM
pnpm install

# 3. Verify everything works
pnpm dev
# Test login, CV creation, PDF generation, etc.

# 4. Commit the new lockfile
git add pnpm-lock.yaml
git commit -m "Migrate from npm to PNPM"
```

Also update `scripts/deploy-uat.sh` and `scripts/deploy-uat.bat` to use `pnpm` instead of `npm`. Update the Vercel project install command to `pnpm install` at this stage, and verify a production deploy works before proceeding.

## 2.2 Create Monorepo Foundation

**STEP 1: Create new directory and initialize**
```bash
# Create monorepo directory
mkdir recruitment-suite
cd recruitment-suite

# Initialize package.json
pnpm init

# Set package manager (important for Vercel)
echo '{"packageManager":"pnpm@8.15.0"}' > package.json
```

**STEP 2: Create workspace configuration**

Create file: `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**STEP 3: Initialize Turborepo**
```bash
# Install Turborepo as dev dependency
pnpm add -Dw turbo
```

Create file: `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    },
    "db:generate": {
      "cache": false
    },
    "db:push": {
      "cache": false
    }
  }
}
```

**STEP 4: Update root package.json**

Edit `package.json`:
```json
{
  "name": "recruitment-suite",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push"
  },
  "devDependencies": {
    "turbo": "^1.13.0",
    "typescript": "^5.4.5"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

**STEP 5: Create directory structure**
```bash
mkdir -p apps packages
mkdir -p packages/cv-builder/src
mkdir -p packages/ui/src
mkdir -p packages/types/src
mkdir -p packages/database-ladderfox
mkdir -p packages/database-hirekit
mkdir -p packages/typescript-config
mkdir -p packages/eslint-config
mkdir -p packages/tailwind-config
```

**STEP 6: Create .gitignore**

Create file: `.gitignore`
```
# Dependencies
node_modules
.pnpm-store

# Build outputs
.next
dist
build
.turbo

# Environment
.env
.env.local
.env.*.local

# Database
*.db
packages/*/generated

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode
.idea
*.swp
*.swo

# Misc
.vercel
```

## 2.3 Move LadderFox into Monorepo

**STEP 1: Copy LadderFox to apps directory**

Assuming current LadderFox is at `../cv-ai-builder`:
```bash
# Copy entire LadderFox directory
cp -r ../cv-ai-builder apps/ladderfox

# Remove old node_modules and build artifacts
cd apps/ladderfox
rm -rf node_modules .next .turbo
cd ../..
```

**STEP 2: Update LadderFox package.json**

Edit `apps/ladderfox/package.json`:

Change name to: `"ladderfox"`

Update scripts section:
```json
{
  "name": "ladderfox",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

Add **minimal** workspace dependencies — only shared configs, NOT runtime packages:
```json
{
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@repo/tailwind-config": "workspace:*"
  }
}
```

> **IMPORTANT — Independence principle:** LadderFox does NOT depend on `@repo/cv-builder`, `@repo/ui`, `@repo/types`, or `@repo/database-ladderfox` as runtime dependencies. This is intentional:
> - LadderFox keeps its own types (`src/types/cv.ts`), its own components, its own DB imports
> - Changes to shared packages for HireKit cannot break LadderFox's build
> - LadderFox only shares dev-time configs (TypeScript, ESLint, Tailwind base)
> - This can be revisited later once shared packages are stable and tested
>
> Only the devDependency configs are shared because a breaking change in a TS config or ESLint rule is easy to spot and fix, unlike a broken type export that silently causes runtime issues.

Keep all existing dependencies from LadderFox.

**STEP 3: Keep Prisma schema in place (DO NOT MOVE)**

> **CRITICAL:** Do NOT move `apps/ladderfox/prisma/` to a packages directory. The existing Prisma schema has production migration history and tightly coupled imports throughout the codebase. Moving it risks breaking the migration chain and requires updating every `@prisma/client` import simultaneously.

Keep Prisma where it is:
```
apps/ladderfox/
├── prisma/
│   ├── schema.prisma        # Keep here, unchanged
│   └── migrations/           # Keep here, production history intact
├── src/
│   └── lib/db.ts            # Keep existing imports unchanged
└── ...
```

The `@repo/database-ladderfox` package will be a thin re-export wrapper (see section 3.3), NOT the actual schema location.

**STEP 4: Preserve next.config.js webpack customizations**

> **CRITICAL:** LadderFox's `next.config.js` contains essential webpack customizations that must be preserved during migration:
> - `self → globalThis` polyfill for `@react-pdf/renderer` packages (PDF generation breaks without this)
> - Server-side split chunks disabled to prevent `vendors.js` issues
> - Client-side chunk optimization (vendor/PDF/React splits)
> - `string-replace-loader` for package patching
> - `NODE_OPTIONS=--max-old-space-size=4096` for builds
>
> Verify these survive the migration by testing PDF generation locally before deploying.

**STEP 5: Update imports in LadderFox (will do incrementally)**

We'll update import paths after creating shared packages. For now, LadderFox keeps its existing structure — including all `@prisma/client` imports and `DATABASE_URL` environment variable references.

## 2.4 Create Shared Configuration Packages

**PACKAGE 1: TypeScript Config**

Create file: `packages/typescript-config/package.json`
```json
{
  "name": "@repo/typescript-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js"
}
```

Create file: `packages/typescript-config/base.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "incremental": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules"]
}
```

Create file: `packages/typescript-config/nextjs.json`
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**PACKAGE 2: ESLint Config**

Create file: `packages/eslint-config/package.json`
```json
{
  "name": "@repo/eslint-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "dependencies": {
    "eslint-config-next": "14.1.0",
    "eslint-config-prettier": "^9.1.0"
  }
}
```

Create file: `packages/eslint-config/next.js`
```javascript
module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/no-unescaped-entities': 'off',
  },
};
```

**PACKAGE 3: Tailwind Config**

Create file: `packages/tailwind-config/package.json`
```json
{
  "name": "@repo/tailwind-config",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "dependencies": {
    "@tailwindcss/forms": "^0.5.0",
    "tailwindcss": "^3.4.0"
  }
}
```

Create file: `packages/tailwind-config/index.js`
```javascript
const colors = require('tailwindcss/colors');

module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'brand-light': '#8ECAE6',
        'brand-blue': '#219EBC',
        'brand-dark': '#023047',
        'brand-yellow': '#FFB703',
        'brand-orange': '#FB8500',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

**PACKAGE 4: Types Package**

Create file: `packages/types/package.json`
```json
{
  "name": "@repo/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "^5.4.5"
  }
}
```

We'll populate `types/src` with CV types extracted from LadderFox later.

## 2.5 Install All Dependencies
```bash
# From monorepo root
pnpm install

# This will:
# - Install all dependencies for all packages
# - Link workspace dependencies
# - Create pnpm-lock.yaml
```

If you encounter errors, they're expected since packages reference each other but aren't fully set up yet.

---

# PART 3: DATABASE ARCHITECTURE (NEON)

## 3.1 Neon Database Strategy

**CURRENT STATE:**
- LadderFox uses existing Neon database: `neondb`
- Connection: `ep-round-flower-abq5i4zf-pooler.eu-west-2.aws.neon.tech`

**NEW SETUP:**
- Keep LadderFox on existing database (no migration needed)
- Create new database in same Neon project: `hirekit_db`
- Both databases in eu-west-2 region for low latency

## 3.2 Create HireKit Database

**STEP 1:** Login to Neon console (neon.tech)

**STEP 2:** Navigate to existing project

**STEP 3:** Create new database
- Click "Databases" in sidebar
- Click "New Database"
- Name: `hirekit_db`
- Owner: Same as existing (usually `neondb_owner`)
- Click "Create"

**STEP 4:** Copy connection string

You'll get a connection string like:
```
postgresql://[user]:[password]@ep-round-flower-abq5i4zf-pooler.eu-west-2.aws.neon.tech/hirekit_db?sslmode=require
```

Save this for later.

## 3.3 Setup LadderFox Database Package (Thin Wrapper)

> **Approach:** We do NOT move the Prisma schema out of `apps/ladderfox/`. Instead, we create a thin wrapper package that re-exports the existing Prisma client. This preserves all migration history, avoids import path changes across the codebase, and keeps `DATABASE_URL` unchanged.

**STEP 1:** Do NOT modify LadderFox's Prisma schema

The existing schema stays exactly where it is:
- `apps/ladderfox/prisma/schema.prisma` — unchanged
- `apps/ladderfox/prisma/migrations/` — unchanged
- `DATABASE_URL` env var — unchanged (NOT renamed)

**STEP 2:** Create thin database wrapper package

Create file: `packages/database-ladderfox/package.json`
```json
{
  "name": "@repo/database-ladderfox",
  "version": "1.0.0",
  "main": "./src/client.ts",
  "types": "./src/client.ts",
  "scripts": {
    "db:generate": "echo 'Run from apps/ladderfox instead'",
    "db:studio": "echo 'Run from apps/ladderfox instead'"
  },
  "dependencies": {
    "@prisma/client": "^6.13.0"
  },
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}
```

**STEP 3:** Create re-export wrapper

Create file: `packages/database-ladderfox/src/client.ts`
```typescript
// This is a thin re-export wrapper.
// The actual Prisma schema and generated client live in apps/ladderfox/prisma/.
// LadderFox itself continues to import from '@prisma/client' directly.
// This package exists so that OTHER packages (like @repo/cv-builder)
// can reference LadderFox types if needed in the future.

import { PrismaClient } from '@prisma/client';

export { PrismaClient };
export * from '@prisma/client';
```

**STEP 4:** Verify LadderFox still works

```bash
cd apps/ladderfox
pnpm dev
```

LadderFox continues to use its existing `src/lib/db.ts` and `@prisma/client` imports — no changes required. The `DATABASE_URL` environment variable stays the same everywhere (local, UAT, production).

> **Future consideration:** Once the monorepo is stable and HireKit is running, you can optionally refactor to move the Prisma schema into the package. But this is a risk-free starting point.

## 3.4 Setup HireKit Database Package

**STEP 1:** Create Prisma schema

Create file: `packages/database-hirekit/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("HIREKIT_DATABASE_URL")
}

// COMPANIES & USERS
model Company {
  id           String         @id @default(cuid())
  name         String
  slug         String         @unique
  ownerId      String
  owner        User           @relation("CompanyOwner", fields: [ownerId], references: [id])
  users        CompanyUser[]
  applications Application[]
  jobs         Job[]
  branding     Branding?
  cvTemplate   CVTemplate?
  landingPage  LandingPage?
  subscription Subscription?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
  
  @@index([slug])
  @@index([ownerId])
}

model User {
  id             String        @id @default(cuid())
  email          String        @unique
  name           String
  passwordHash   String
  emailVerified  DateTime?
  ownedCompanies Company[]     @relation("CompanyOwner")
  companies      CompanyUser[]
  accounts       Account[]
  sessions       Session[]
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

model CompanyUser {
  id        String   @id @default(cuid())
  companyId String
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      String   @default("member")
  createdAt DateTime @default(now())
  
  @@unique([companyId, userId])
}

// APPLICATIONS (incoming CVs)
model Application {
  id        String   @id @default(cuid())
  companyId String
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  jobId     String?
  job       Job?     @relation(fields: [jobId], references: [id], onDelete: SetNull)
  cvData    Json
  email     String
  name      String?
  phone     String?
  status    String   @default("new")
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([companyId])
  @@index([jobId])
  @@index([createdAt])
}

// JOBS
model Job {
  id           String        @id @default(cuid())
  companyId    String
  company      Company       @relation(fields: [companyId], references: [id], onDelete: Cascade)
  title        String
  description  String?
  location     String?
  type         String?
  active       Boolean       @default(true)
  applications Application[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  
  @@index([companyId])
  @@index([active])
}

// BRANDING
model Branding {
  id              String   @id @default(cuid())
  companyId       String   @unique
  company         Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  logoUrl         String?
  primaryColor    String   @default("#4F46E5")
  secondaryColor  String   @default("#F8FAFC")
  fontFamily      String   @default("Inter")
  showCompanyName Boolean  @default(true)
  tagline         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// CV TEMPLATE CONFIG
model CVTemplate {
  id           String   @id @default(cuid())
  companyId    String   @unique
  company      Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  templateType String   @default("classic")
  sections     Json
  pdfConfig    Json?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// LANDING PAGE CONFIG
model LandingPage {
  id                   String   @id @default(cuid())
  companyId            String   @unique
  company              Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  domain               String   @unique
  customDomain         String?  @unique
  customDomainVerified Boolean  @default(false)
  title                String
  subtitle             String?
  introText            String?
  headerPosition       String   @default("top")
  successMessage       String
  redirectUrl          String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

// SUBSCRIPTION
model Subscription {
  id                 String    @id @default(cuid())
  companyId          String    @unique
  company            Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  plan               String
  status             String
  stripeCustomerId   String?   @unique
  stripeSubscriptionId String? @unique
  stripePriceId      String?
  currentPeriodStart DateTime?
  currentPeriodEnd   DateTime?
  cancelAtPeriodEnd  Boolean   @default(false)
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}

// NEXTAUTH TABLES
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

**STEP 2:** Create package.json

Create file: `packages/database-hirekit/package.json`
```json
{
  "name": "@repo/database-hirekit",
  "version": "1.0.0",
  "main": "./src/client.ts",
  "types": "./src/client.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.13.0"
  },
  "devDependencies": {
    "prisma": "^6.13.0",
    "typescript": "^5.4.5"
  }
}
```

**STEP 3:** Create database client

Create file: `packages/database-hirekit/src/client.ts`
```typescript
import { PrismaClient } from '../generated/client';

declare global {
  var prismaHireKit: PrismaClient | undefined;
}

export const db = globalThis.prismaHireKit || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaHireKit = db;
}

export * from '../generated/client';
```

**STEP 4:** Create .env file

Create file: `packages/database-hirekit/.env`
```
HIREKIT_DATABASE_URL="postgresql://[connection-string-from-step-3.2]"
```

**STEP 5:** Initialize database
```bash
cd packages/database-hirekit
pnpm db:push
pnpm db:generate
cd ../..
```

This creates tables in `hirekit_db` and generates the Prisma client.

## 3.5 LadderFox Database — No Changes Required

> **Key principle:** Do NOT rename `DATABASE_URL`, do NOT change Prisma imports, do NOT modify `src/lib/db.ts`. LadderFox's database setup stays exactly as it is today. This eliminates the single highest-risk failure point in the entire migration.

**What stays the same:**
- `DATABASE_URL` environment variable name — unchanged everywhere (local, UAT, Vercel production)
- `apps/ladderfox/prisma/schema.prisma` — uses `env("DATABASE_URL")` as before
- `apps/ladderfox/src/lib/db.ts` — keeps existing `@prisma/client` imports
- All API routes — keep existing database imports
- All service files — keep existing database imports

**What's new:**
- HireKit uses `HIREKIT_DATABASE_URL` for its separate database
- The `@repo/database-ladderfox` package exists as a thin wrapper for future cross-package type sharing
- The `@repo/database-hirekit` package is a full Prisma setup (see section 3.4)

**Verify LadderFox works:**
```bash
cd apps/ladderfox
pnpm dev
```

Visit http://localhost:3000 and verify:
- App loads without errors
- Database queries work
- Authentication works
- Existing CVs are accessible
- PDF generation works (this tests the webpack config preservation)

---

# PART 4: SHARED PACKAGES EXTRACTION

## 4.1 CV Builder Strategy: Build New, Don't Extract

> **CRITICAL DECISION:** Do NOT attempt to extract LadderFox's existing CV components into a shared package. Here's why:
>
> - `CVPreviewServer.tsx` is **31,791 lines** with deep dependencies on LadderFox-specific template logic
> - `ATSChecker.tsx` is **38,344 lines** tightly coupled to LadderFox's AI agent system
> - `CVEditor.tsx` depends on Zustand stores (`flowStore`, `enhancedFlowStore`), React Quill, DnD Kit, and LadderFox-specific question flows
> - `CVPreview.tsx` imports from `@/lib/`, `@/types/`, `@/data/` and contains LadderFox-specific subscription checks
>
> **Strategy:** Build a NEW, clean CV builder for HireKit in `@repo/cv-builder`. Keep LadderFox's components untouched. Over time, gradually port rendering logic from LadderFox into the shared package — but only after HireKit is functional.

**STEP 1:** Create CV Builder package structure
```bash
mkdir -p packages/cv-builder/src/components
mkdir -p packages/cv-builder/src/hooks
mkdir -p packages/cv-builder/src/utils
```

**STEP 2:** Create package.json

Create file: `packages/cv-builder/package.json`
```json
{
  "name": "@repo/cv-builder",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.8",
    "@repo/types": "workspace:*",
    "@repo/ui": "workspace:*"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^18.3.1",
    "typescript": "^5.4.5",
    "eslint": "^8.0.0"
  }
}
```

**STEP 3:** Types live in @repo/types (NOT duplicated here)

The CVData interface and CVBuilderProps are defined in `packages/types/src/index.ts` (see section 2.4). The cv-builder package imports from `@repo/types`.

**STEP 4:** Create CV Builder component (HireKit-specific, built from scratch)

This is a REAL, functional component — not a placeholder. It's purpose-built for the B2B use case (company-branded, configurable sections, no LadderFox business logic).

Create file: `packages/cv-builder/src/components/CVBuilder.tsx`
```typescript
'use client';

import { useState, useCallback } from 'react';
import type { CVBuilderProps, CVData } from '@repo/types';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ReviewStep } from './steps/ReviewStep';

type Step = 'personal' | 'experience' | 'education' | 'skills' | 'review';

export function CVBuilder({
  branding,
  sections,
  onComplete,
  onChange,
  onError,
  initialData = {},
  context,
  showProgress = true,
}: CVBuilderProps) {
  const [data, setData] = useState<Partial<CVData>>(initialData);
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build step list from enabled sections
  const steps: Step[] = [
    'personal',
    ...(sections?.experience?.enabled !== false ? ['experience' as Step] : []),
    ...(sections?.education?.enabled !== false ? ['education' as Step] : []),
    ...(sections?.skills?.enabled !== false ? ['skills' as Step] : []),
    'review',
  ];

  const currentIndex = steps.indexOf(currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  const updateData = useCallback((updates: Partial<CVData>) => {
    setData(prev => {
      const next = { ...prev, ...updates };
      onChange?.(next);
      return next;
    });
  }, [onChange]);

  const handleNext = () => {
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(data as CVData);
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Submission failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryColor = branding?.primaryColor || '#4F46E5';

  return (
    <div
      className="cv-builder max-w-2xl mx-auto"
      style={{ '--cv-primary': primaryColor } as React.CSSProperties}
    >
      {/* Company branding header */}
      {branding?.logo && (
        <div className="flex items-center gap-3 mb-8 pb-4 border-b">
          <img src={branding.logo} alt={branding.companyName || ''} className="h-10" />
          {branding.showCompanyName !== false && branding.companyName && (
            <span className="text-lg font-semibold">{branding.companyName}</span>
          )}
        </div>
      )}

      {/* Progress bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentIndex + 1} of {steps.length}</span>
            <span className="capitalize">{currentStep.replace('_', ' ')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / steps.length) * 100}%`,
                backgroundColor: primaryColor,
              }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="bg-white rounded-lg border p-6">
        {currentStep === 'personal' && (
          <PersonalInfoStep
            data={data}
            onChange={updateData}
            photoEnabled={sections?.photo?.enabled}
          />
        )}
        {currentStep === 'experience' && (
          <ExperienceStep data={data} onChange={updateData} />
        )}
        {currentStep === 'education' && (
          <EducationStep data={data} onChange={updateData} />
        )}
        {currentStep === 'skills' && (
          <SkillsStep
            data={data}
            onChange={updateData}
            format={sections?.skills?.format}
          />
        )}
        {currentStep === 'review' && (
          <ReviewStep data={data} branding={branding} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={isFirst}
          className="px-5 py-2 text-gray-600 hover:text-gray-900 disabled:invisible"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="px-6 py-2 text-white rounded-md disabled:opacity-50"
          style={{ backgroundColor: primaryColor }}
        >
          {isSubmitting ? 'Submitting...' : isLast ? 'Submit Application' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
```

**STEP 5:** Create step components

Each step is a focused form component. These are built fresh — clean, simple, no LadderFox dependencies.

Create file: `packages/cv-builder/src/components/steps/PersonalInfoStep.tsx`
```typescript
'use client';

import type { CVData } from '@repo/types';

interface Props {
  data: Partial<CVData>;
  onChange: (updates: Partial<CVData>) => void;
  photoEnabled?: boolean;
}

export function PersonalInfoStep({ data, onChange, photoEnabled }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => onChange({ fullName: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={data.contact?.email || ''}
            onChange={(e) => onChange({
              contact: { ...data.contact, email: e.target.value }
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={data.contact?.phone || ''}
            onChange={(e) => onChange({
              contact: { ...data.contact, phone: e.target.value }
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={data.contact?.location || ''}
            onChange={(e) => onChange({
              contact: { ...data.contact, location: e.target.value }
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Senior Software Engineer"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
        <textarea
          value={data.summary || ''}
          onChange={(e) => onChange({ summary: e.target.value })}
          rows={4}
          placeholder="Brief professional summary..."
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
    </div>
  );
}
```

Create similar step components for `ExperienceStep.tsx`, `EducationStep.tsx`, `SkillsStep.tsx`, and `ReviewStep.tsx`. Each follows the same pattern — a focused form that updates the shared `CVData` object via `onChange`.

**STEP 6:** Create package index

Create file: `packages/cv-builder/src/index.ts`
```typescript
export { CVBuilder } from './components/CVBuilder';
```

**STEP 7:** Create TypeScript config

Create file: `packages/cv-builder/tsconfig.json`
```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

**What LadderFox keeps:**
LadderFox continues to use its own CV components (`CVEditor.tsx`, `CVPreview.tsx`, `CVPreviewServer.tsx`, etc.) unchanged. These are NOT extracted into the shared package. LadderFox does NOT depend on `@repo/cv-builder`.

**Future porting roadmap (Phase 6):**
Once HireKit's CV builder is functional, gradually port rendering logic:
1. Start with simple template rendering (how a CV looks as HTML/PDF)
2. Port the template system (Modern, Classic, etc.) into shared utilities
3. Eventually, LadderFox can optionally adopt the shared renderer too
4. This is a multi-sprint effort, not a migration prerequisite

## 4.2 Extract Shared UI Components

**STEP 1:** Create UI package structure
```bash
mkdir -p packages/ui/src
```

**STEP 2:** Create package.json

Create file: `packages/ui/package.json`
```json
{
  "name": "@repo/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@types/react": "^18.3.1",
    "typescript": "^5.4.5"
  }
}
```

**STEP 3:** Create basic button component

Create file: `packages/ui/src/button.tsx`
```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

**STEP 4:** Create utility function

Create file: `packages/ui/src/utils.ts`
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**STEP 5:** Create package index

Create file: `packages/ui/src/index.ts`
```typescript
export { Button } from './button';
export { cn } from './utils';
```

**STEP 6:** Create TypeScript config

Create file: `packages/ui/tsconfig.json`
```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**NOTE:** We start with minimal UI components. More can be extracted from LadderFox later.

## 4.3 Update LadderFox Tailwind Config

**STEP 1:** Update `apps/ladderfox/tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/tailwind-config';

const config: Config = {
  ...sharedConfig,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/cv-builder/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...(sharedConfig.theme?.extend || {}),
      // Add LadderFox-specific theme extensions
    },
  },
};

export default config;
```

## 4.4 Update LadderFox TypeScript Config

**STEP 1:** Update `apps/ladderfox/tsconfig.json`
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 4.5 Install All Dependencies
```bash
# From monorepo root
pnpm install
```

This will install dependencies for all packages and link them together.

---

# PART 5: STEP-BY-STEP MIGRATION GUIDE

## 5.1 Pre-Migration Checklist

Before proceeding:
- [ ] Phase 0 complete (PNPM migration verified working)
- [ ] All packages created (sections 2-4)
- [ ] `pnpm install` completed successfully
- [ ] HireKit database package generated (`packages/database-hirekit/pnpm db:generate`)
- [ ] LadderFox `.env.local` unchanged (still uses `DATABASE_URL`)
- [ ] LadderFox `next.config.js` webpack customizations preserved
- [ ] Git repository initialized in monorepo root
- [ ] Backup of current LadderFox database completed
- [ ] Old LadderFox repository preserved (rollback fallback)

## 5.2 Test LadderFox Locally

**STEP 1:** Start development server
```bash
cd apps/ladderfox
pnpm dev
```

**STEP 2:** Verify functionality

Open http://localhost:3000 and test:
- [ ] Homepage loads
- [ ] Can login with existing account
- [ ] Can view existing CVs
- [ ] Database queries work
- [ ] No import errors in console

**STEP 3:** Fix any import errors

Common issues:
- Prisma imports: Update to use `@repo/database-ladderfox`
- Type imports: May need path updates

**STEP 4:** Run build test
```bash
pnpm build
```

Should complete without errors.

## 5.3 Deploy LadderFox from Monorepo

**CRITICAL:** We're deploying the migrated LadderFox BEFORE building HireKit to ensure no disruption to existing users.

**STEP 0: Prepare rollback plan BEFORE deploying**

> Before touching Vercel production settings, ensure you have a working rollback:

1. **Do NOT delete the old LadderFox repository** — keep it as-is until the monorepo deploy is stable for at least 1 week
2. **Screenshot current Vercel settings** (build command, root directory, env vars)
3. **Record current Git commit hash** of the last working deploy:
   ```bash
   # In the OLD repo
   git log -1 --format="%H" # Save this hash
   ```
4. **Verify the old repo can still deploy independently** — do a test deploy to a preview URL:
   ```bash
   # In the OLD repo
   vercel
   ```

**Rollback procedure (if monorepo deploy breaks production):**
1. In Vercel dashboard → LadderFox project → Settings → General
2. Change Root Directory back to empty (or `.`)
3. Change Build Command back to `prisma generate && next build`
4. Redeploy from the old repository's main branch
5. Production restored in ~3 minutes

**STEP 1:** Commit monorepo to Git
```bash
git init
git add .
git commit -m "Initial monorepo setup with LadderFox migration"
git remote add origin [your-repo-url]
git push -u origin main
```

**STEP 2:** Update Vercel project settings

Login to Vercel dashboard:
- Navigate to existing LadderFox project
- Go to Settings → General
- Update settings:

**Root Directory:** `apps/ladderfox`
**Build Command:** `cd ../.. && pnpm install && pnpm turbo run build --filter=ladderfox`
**Install Command:** `pnpm install`
**Output Directory:** `.next`

**STEP 3:** Environment variables — NO CHANGES

> **Do NOT rename `DATABASE_URL`.** All existing environment variables stay exactly the same. This is the safest approach.

Verify these already exist (no changes needed):
- `DATABASE_URL` — unchanged
- `NEXTAUTH_SECRET` — unchanged
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — unchanged
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — unchanged
- All other variables — unchanged

**Verify this already exists (add if missing):**
- `NODE_OPTIONS=--max-old-space-size=4096` (may already be set from existing config)

**STEP 4:** Deploy to a PREVIEW first

> **Do NOT push directly to production.** Deploy a preview build first to catch issues.

```bash
# Deploy preview (NOT production)
cd apps/ladderfox
vercel

# This creates a preview URL like: https://ladderfox-xxxxx.vercel.app
# Test this URL thoroughly before promoting to production
```

Test on the preview URL:
- [ ] Homepage loads
- [ ] Login works (test with a real account)
- [ ] Existing CVs load
- [ ] Create a new CV (tests database writes)
- [ ] PDF generation works (tests webpack config preservation)
- [ ] Template switching works
- [ ] Stripe checkout page loads (don't complete a purchase)
- [ ] File upload works (profile photo)

**STEP 5:** Promote to production

Only after preview testing passes:
```bash
# Option A: Promote the preview
vercel --prod

# Option B: Push to main (if auto-deploy is configured)
git push origin main
```

**STEP 6:** Monitor for 48 hours

Watch for:
- Error rates in Vercel dashboard (compare to previous 48 hours)
- Function invocation failures
- Database connection timeouts
- User reports
- Stripe webhook delivery failures (check Stripe dashboard → Webhooks → Recent events)

**If error rate increases by >5%, execute rollback immediately (see Step 0).**

## 5.4 Post-Migration Validation

Once LadderFox is stable from monorepo (48 hours minimum):

- [ ] All features working
- [ ] No increase in error rates (compare Vercel analytics to previous week)
- [ ] Database performance normal (check Neon dashboard query metrics)
- [ ] Authentication working (Google OAuth + email/password)
- [ ] File uploads working (Uploadthing profile photos)
- [ ] PDF generation working (**critical** — validates webpack config preservation)
- [ ] Stripe webhooks working (check Stripe dashboard event delivery)
- [ ] Email sending working (test password reset flow)
- [ ] Multi-language pages loading correctly
- [ ] Admin panel (`/adminx/`) accessible and functional
- [ ] Old LadderFox repository can still deploy independently (rollback verified)

---

# PART 6: HIREKIT IMPLEMENTATION GUIDE

## 6.1 Create HireKit Apps

Now that LadderFox is stable in the monorepo, we build HireKit.

**APP 1: HireKit Marketing Site**
```bash
cd apps
pnpm create next-app hirekit --typescript --tailwind --app --src-dir --import-alias "@/*"
```

When prompted:
- Would you like to use App Router? **Yes**
- Would you like to customize the default import alias? **No**
- Use Turbopack? **No**

Update `apps/hirekit/package.json`:
```json
{
  "name": "hirekit",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.30",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@repo/ui": "workspace:*",
    "framer-motion": "^10.18.0",
    "lucide-react": "^0.542.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@repo/tailwind-config": "workspace:*",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**APP 2: HireKit Dashboard**
```bash
pnpm create next-app hirekit-app --typescript --tailwind --app --src-dir --import-alias "@/*"
```

Update `apps/hirekit-app/package.json`:
```json
{
  "name": "hirekit-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "prisma generate --schema=../../packages/database-hirekit/prisma/schema.prisma && next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.30",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@repo/cv-builder": "workspace:*",
    "@repo/ui": "workspace:*",
    "@repo/database-hirekit": "workspace:*",
    "next-auth": "^4.24.7",
    "@next-auth/prisma-adapter": "^1.0.7",
    "bcryptjs": "^3.0.2",
    "zod": "^3.23.8",
    "react-hook-form": "^7.51.0",
    "react-hot-toast": "^2.5.2",
    "uploadthing": "^6.3.0",
    "stripe": "^14.12.0",
    "@stripe/stripe-js": "^2.4.0"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@repo/eslint-config": "workspace:*",
    "@repo/tailwind-config": "workspace:*",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@types/bcryptjs": "^2.4.6",
    "typescript": "^5.4.5",
    "tailwindcss": "^3.4.0"
  }
}
```

**APP 3: Widget**
```bash
mkdir apps/widget
cd apps/widget
pnpm init
```

Create `apps/widget/package.json`:
```json
{
  "name": "widget",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@repo/cv-builder": "workspace:*"
  },
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "@vitejs/plugin-react": "^4.2.1",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.4.5",
    "vite": "^5.2.0",
    "vite-plugin-css-injected-by-js": "^3.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "terser": "^5.30.0"
  }
}
```

Install dependencies:
```bash
cd ../../..
pnpm install
```

## 6.2 Setup HireKit Authentication

Create file: `apps/hirekit-app/src/lib/auth.ts`
```typescript
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@repo/database-hirekit';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
```

Create file: `apps/hirekit-app/src/app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

## 6.3 Build HireKit Onboarding Wizard

Create file: `apps/hirekit-app/src/app/onboarding/page.tsx`
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    logo: null as File | null,
    primaryColor: '#4F46E5',
    template: 'classic',
    sections: {
      personalInfo: { enabled: true, required: true },
      experience: { enabled: true, min: 1 },
      education: { enabled: true, min: 1 },
      skills: { enabled: true },
      photo: { enabled: false }
    },
    installMethod: 'hosted'
  });

  const handleComplete = async () => {
    // Save configuration to database
    const response = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-300'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className="w-24 h-1 bg-gray-300 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-lg shadow p-8">
          {step === 1 && <BrandingStep formData={formData} setFormData={setFormData} />}
          {step === 2 && <TemplateStep formData={formData} setFormData={setFormData} />}
          {step === 3 && <InstallStep formData={formData} setFormData={setFormData} />}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Launch HireKit 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandingStep({ formData, setFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Step 1: Branding</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Upload Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
            className="block w-full text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand Color</label>
          <input
            type="color"
            value={formData.primaryColor}
            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
            className="w-full h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Preview</label>
          <div className="border rounded-lg p-4" style={{ borderColor: formData.primaryColor }}>
            <h3 style={{ color: formData.primaryColor }}>Sample CV Builder</h3>
            <button
              style={{ backgroundColor: formData.primaryColor }}
              className="mt-2 px-4 py-2 text-white rounded"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateStep({ formData, setFormData }) {
  const templates = ['modern', 'classic', 'minimal', 'executive'];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Step 2: CV Template</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {templates.map((template) => (
          <div
            key={template}
            onClick={() => setFormData({ ...formData, template })}
            className={`border-2 rounded-lg p-4 cursor-pointer ${
              formData.template === template ? 'border-indigo-600' : 'border-gray-200'
            }`}
          >
            <div className="aspect-[3/4] bg-gray-100 rounded mb-2" />
            <p className="text-center font-medium capitalize">{template}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.sections.experience.enabled}
            onChange={(e) => setFormData({
              ...formData,
              sections: {
                ...formData.sections,
                experience: { ...formData.sections.experience, enabled: e.target.checked }
              }
            })}
            className="mr-2"
          />
          Work Experience
        </label>
        {/* Add more section toggles */}
      </div>
    </div>
  );
}

function InstallStep({ formData, setFormData }) {
  const methods = [
    { id: 'hosted', name: 'Hosted Page', desc: 'yourcompany.hirekit.io - Ready now' },
    { id: 'widget', name: 'Widget Embed', desc: 'Add to your website with code snippet' },
    { id: 'custom', name: 'Custom Domain', desc: 'cv.yourcompany.com - DNS setup required' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Step 3: Installation Method</h2>
      
      <div className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => setFormData({ ...formData, installMethod: method.id })}
            className={`border-2 rounded-lg p-4 cursor-pointer ${
              formData.installMethod === method.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={formData.installMethod === method.id}
                onChange={() => {}}
                className="mt-1 mr-3"
              />
              <div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

Create API route: `apps/hirekit-app/src/app/api/onboarding/complete/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@repo/database-hirekit';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();

  // Create company
  const company = await db.company.create({
    data: {
      name: data.companyName || 'My Company',
      slug: generateSlug(data.companyName || 'my-company'),
      ownerId: session.user.id,
      branding: {
        create: {
          primaryColor: data.primaryColor,
          logoUrl: data.logoUrl,
        }
      },
      cvTemplate: {
        create: {
          templateType: data.template,
          sections: data.sections,
        }
      },
      landingPage: {
        create: {
          domain: `${generateSlug(data.companyName)}.hirekit.io`,
          title: `Apply at ${data.companyName}`,
          subtitle: 'Create your CV in 5 minutes',
          successMessage: 'Thank you! We received your application.',
        }
      }
    }
  });

  return NextResponse.json({ success: true, companyId: company.id });
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
```

## 6.4 Build Widget

> **Key decisions for the widget:**
> 1. **Bundle React** — most customer sites won't have React. The widget must be self-contained.
> 2. **Inject styles into Shadow DOM** — Tailwind classes don't penetrate Shadow DOM boundaries. We must inject a compiled CSS stylesheet.
> 3. **CORS** — The HireKit API must allow cross-origin requests from any customer domain.
> 4. **CSP** — Customer sites may have strict Content Security Policies. Document requirements.

Create file: `apps/widget/vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(), // Injects CSS into JS bundle for Shadow DOM
  ],
  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'HireKitWidget',
      fileName: (format) => `hirekit-widget.${format}.js`,
      formats: ['iife'], // Single file, no module imports needed
    },
    // DO NOT externalize React — bundle it so customers don't need it
    rollupOptions: {
      output: {
        // Single file output
        inlineDynamicImports: true,
      },
    },
    // Target reasonable browser support
    target: 'es2020',
    // Keep bundle size reasonable
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },
  },
  // Tailwind CSS for widget styles (compiled into bundle)
  css: {
    postcss: {
      plugins: [
        require('tailwindcss')({
          content: ['./src/**/*.{ts,tsx}', '../../packages/cv-builder/src/**/*.{ts,tsx}'],
        }),
        require('autoprefixer'),
      ],
    },
  },
});
```

> **Bundle size note:** Bundling React + ReactDOM adds ~45KB gzipped. This is acceptable for a widget. The alternative (expecting customers to provide React) would severely limit adoption.

Create file: `apps/widget/src/main.tsx`
```typescript
import { createRoot } from 'react-dom/client';
import { CVBuilder } from '@repo/cv-builder';
import './widget.css'; // Tailwind styles compiled into bundle

interface WidgetConfig {
  companyId: string;
  jobId?: string;
  containerId?: string; // Allow custom container ID
}

class HireKitWidget {
  private root: ReturnType<typeof createRoot> | null = null;

  async init(config: WidgetConfig) {
    const containerId = config.containerId || 'hirekit-widget';
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`HireKit: Container #${containerId} not found`);
      return;
    }

    // Fetch company config from HireKit API
    const apiUrl = (window as any).__HIREKIT_API_URL__ || 'https://app.hirekit.io/api';
    let companyConfig;
    try {
      const res = await fetch(`${apiUrl}/v1/widget/config/${config.companyId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      companyConfig = await res.json();
    } catch (err) {
      console.error('HireKit: Failed to load company config', err);
      container.innerHTML = '<p style="color:red">Failed to load application form. Please try again later.</p>';
      return;
    }

    // Create Shadow DOM for style isolation
    const shadow = container.attachShadow({ mode: 'open' });

    // Inject compiled Tailwind styles into Shadow DOM
    const styleSheet = new CSSStyleSheet();
    const styles = document.querySelector('style[data-hirekit]');
    if (styles) {
      styleSheet.replaceSync(styles.textContent || '');
      shadow.adoptedStyleSheets = [styleSheet];
    }

    const mountPoint = document.createElement('div');
    mountPoint.id = 'hirekit-root';
    shadow.appendChild(mountPoint);

    // Render CV Builder
    this.root = createRoot(mountPoint);
    this.root.render(
      <CVBuilder
        context="widget"
        branding={companyConfig.branding}
        sections={companyConfig.sections}
        initialData={{}}
        onComplete={async (cvData) => {
          try {
            const res = await fetch(`${apiUrl}/v1/applications`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Company-ID': config.companyId,
              },
              body: JSON.stringify({ cvData, jobId: config.jobId }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            // Show success message from company config
            const successMsg = companyConfig.landingPage?.successMessage
              || 'Thank you! Your application has been submitted.';
            mountPoint.innerHTML = `
              <div style="text-align:center;padding:2rem;">
                <p style="font-size:1.25rem;color:#059669;">${successMsg}</p>
              </div>
            `;
          } catch (err) {
            console.error('HireKit: Submission failed', err);
            // Don't lose the user's data — show error but keep form
            alert('Submission failed. Please try again.');
          }
        }}
        onError={(err) => {
          console.error('HireKit: CV Builder error', err);
        }}
      />
    );
  }

  destroy() {
    this.root?.unmount();
    this.root = null;
  }
}

// Expose to window
if (typeof window !== 'undefined') {
  (window as any).HireKit = new HireKitWidget();
}
```

Create file: `apps/widget/src/widget.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Widget-specific overrides */
#hirekit-root {
  font-family: system-ui, -apple-system, sans-serif;
  color: #1a1a1a;
  line-height: 1.5;
}
```

Create file: `apps/widget/index.html` (for development)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HireKit Widget Test</title>
</head>
<body>
  <h1>Widget Test Page (simulating a customer's website)</h1>
  <p>The widget below is isolated via Shadow DOM.</p>

  <div id="hirekit-widget"></div>

  <script type="module" src="/src/main.tsx"></script>
  <script>
    window.addEventListener('load', () => {
      window.HireKit.init({
        companyId: 'test-company-123'
      });
    });
  </script>
</body>
</html>
```

### Widget CORS Configuration

The HireKit API must allow cross-origin requests from any customer domain. Add this to `apps/hirekit-app/src/middleware.ts`:

```typescript
// CORS for widget API endpoints
if (request.nextUrl.pathname.startsWith('/api/v1/')) {
  const origin = request.headers.get('origin') || '*';

  // Widget endpoints are public (authenticated via X-Company-ID)
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Company-ID');
  response.headers.set('Access-Control-Max-Age', '86400');

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}
```

### Widget CSP Documentation for Customers

Customers with strict Content Security Policies need to add:
```
script-src 'self' https://widget.hirekit.io;
connect-src 'self' https://app.hirekit.io;
style-src 'self' 'unsafe-inline';
```

Document this on the widget installation page.

## 6.5 Setup HireKit Middleware

> LadderFox has a comprehensive middleware (`src/middleware.ts`) with rate limiting, bot detection, security headers, CSP, CORS, and XSS/SQL injection prevention. HireKit needs similar protection, but with different rules.

Create file: `apps/hirekit-app/src/middleware.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- Security Headers ---
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // --- CORS for Widget API endpoints ---
  if (pathname.startsWith('/api/v1/')) {
    const origin = request.headers.get('origin') || '*';
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Company-ID');
    response.headers.set('Access-Control-Max-Age', '86400');

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
  }

  // --- Rate Limiting ---
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const limit = pathname.startsWith('/api/auth/') ? 30 : 200; // per minute
  const entry = rateLimit.get(ip);

  if (entry && now < entry.resetTime) {
    if (entry.count >= limit) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    entry.count++;
  } else {
    rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
  }

  // --- Auth Protection (dashboard routes) ---
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/settings') || pathname.startsWith('/onboarding')) {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
```

> **Differences from LadderFox middleware:**
> - CORS enabled for `/api/v1/*` (widget endpoints)
> - No bot detection needed (widget endpoints are public)
> - Simpler rate limits (no AI endpoint throttling)
> - Auth protection on `/dashboard`, `/settings`, `/onboarding`

## 6.6 Create Environment Files

`apps/hirekit-app/.env.local`:
```
HIREKIT_DATABASE_URL="postgresql://[connection-string]"
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="[generate-random-secret]"

# Later add:
# STRIPE_SECRET_KEY=
# UPLOADTHING_SECRET=
# RESEND_API_KEY=
```

`apps/widget/.env`:
```
VITE_API_URL="http://localhost:3002/api"
```

---

# PART 7: DEPLOYMENT CONFIGURATION

## 7.1 Deploy HireKit Marketing Site

Create new Vercel project:
```bash
cd apps/hirekit
vercel
```

**Settings:**
- Project name: `hirekit`
- Framework: Next.js
- Root directory: `apps/hirekit`
- Build command: `cd ../.. && pnpm install && pnpm turbo run build --filter=hirekit`
- Install command: `pnpm install`
- Output directory: `.next`
- Domain: `hirekit.io`

No environment variables needed (static marketing site).

## 7.2 Deploy HireKit Dashboard
```bash
cd apps/hirekit-app
vercel
```

**Settings:**
- Project name: `hirekit-app`
- Framework: Next.js
- Root directory: `apps/hirekit-app`
- Build command: `cd ../.. && pnpm install && pnpm turbo run build --filter=hirekit-app`
- Install command: `pnpm install`
- Output directory: `.next`
- Domain: `app.hirekit.io`

**Environment variables:**
- `HIREKIT_DATABASE_URL` (from Neon)
- `NEXTAUTH_URL=https://app.hirekit.io`
- `NEXTAUTH_SECRET` (generate with: `openssl rand -base64 32`)
- `NODE_OPTIONS=--max-old-space-size=4096`

## 7.3 Deploy Widget
```bash
cd apps/widget
vercel
```

**Settings:**
- Project name: `hirekit-widget`
- Framework: Vite
- Root directory: `apps/widget`
- Build command: `cd ../.. && pnpm install && pnpm turbo run build --filter=widget`
- Install command: `pnpm install`
- Output directory: `dist`
- Domain: `widget.hirekit.io`

**Environment variables:**
- `VITE_API_URL=https://app.hirekit.io/api`

## 7.4 Vercel Monorepo Configuration

Each Vercel project needs these settings to work with monorepo:

1. Framework Preset: Next.js (or Vite for widget)
2. Root Directory: `apps/[app-name]`
3. Build Command: `cd ../.. && pnpm install && pnpm turbo run build --filter=[app-name]`
4. Install Command: `pnpm install`
5. Node Version: 18.x

## 7.5 Domain Configuration

Purchase domains:
- `hirekit.io` → Point to HireKit marketing Vercel project
- `app.hirekit.io` → CNAME to HireKit dashboard Vercel project
- `widget.hirekit.io` → CNAME to Widget Vercel project

In domain registrar DNS:
```
hirekit.io        A      76.76.21.21 (Vercel)
*.hirekit.io      CNAME  cname.vercel-dns.com
```

In Vercel project settings, add domains and verify.

## 7.6 Vercel Ignored Build Step (Prevent Unnecessary Deploys)

> **Problem:** In a monorepo, every push to `main` triggers a build for ALL Vercel projects connected to the repo. A HireKit-only change would redeploy LadderFox unnecessarily (and vice versa). This wastes build minutes and creates unnecessary risk.

**Solution:** Configure Vercel's "Ignored Build Step" for each project to only build when relevant files change.

**For LadderFox project** (Vercel → Settings → Git → Ignored Build Step):
```bash
git diff --quiet HEAD^ HEAD -- apps/ladderfox/ packages/typescript-config/ packages/eslint-config/ packages/tailwind-config/
```

**For HireKit marketing** (same setting):
```bash
git diff --quiet HEAD^ HEAD -- apps/hirekit/ packages/ui/ packages/typescript-config/ packages/eslint-config/ packages/tailwind-config/
```

**For HireKit dashboard** (same setting):
```bash
git diff --quiet HEAD^ HEAD -- apps/hirekit-app/ packages/cv-builder/ packages/ui/ packages/types/ packages/database-hirekit/ packages/typescript-config/ packages/eslint-config/ packages/tailwind-config/
```

**For Widget** (same setting):
```bash
git diff --quiet HEAD^ HEAD -- apps/widget/ packages/cv-builder/ packages/types/
```

This means:
- A change to `apps/ladderfox/src/components/CVEditor.tsx` → only LadderFox redeploys
- A change to `apps/hirekit-app/src/app/dashboard/page.tsx` → only HireKit dashboard redeploys
- A change to `packages/cv-builder/src/` → HireKit dashboard + Widget redeploy, LadderFox untouched
- A change to `packages/tailwind-config/` → all apps redeploy (shared config change)

---

# PART 8: TESTING & VERIFICATION

## 8.1 Local Testing Checklist

**LadderFox (apps/ladderfox):**
- [ ] `pnpm dev` runs on port 3000
- [ ] Homepage loads
- [ ] Login works
- [ ] Create CV works
- [ ] View existing CVs works
- [ ] PDF generation works
- [ ] Database queries work
- [ ] All API routes respond correctly

**HireKit Marketing (apps/hirekit):**
- [ ] `pnpm dev` runs on port 3001
- [ ] Homepage loads
- [ ] All sections render
- [ ] Links work
- [ ] Responsive design works

**HireKit Dashboard (apps/hirekit-app):**
- [ ] `pnpm dev` runs on port 3002
- [ ] Signup works
- [ ] Login works
- [ ] Onboarding wizard completes
- [ ] Dashboard loads
- [ ] Settings save correctly
- [ ] Database writes work

**Widget (apps/widget):**
- [ ] `pnpm dev` runs on port 5173
- [ ] Widget loads in test page
- [ ] CV builder renders
- [ ] Form submission works
- [ ] API calls succeed

## 8.2 Production Testing Checklist

After each deployment:

**LadderFox Production:**
- [ ] https://www.ladderfox.com loads
- [ ] SSL certificate valid
- [ ] Login/signup works
- [ ] Existing users can access accounts
- [ ] CV creation works
- [ ] PDF download works
- [ ] Stripe checkout works
- [ ] Email sending works
- [ ] No error spike in logs

**HireKit Production:**
- [ ] https://hirekit.io loads
- [ ] https://app.hirekit.io loads
- [ ] https://widget.hirekit.io serves files
- [ ] Signup flow works
- [ ] Onboarding completes
- [ ] Company dashboard loads
- [ ] Widget embed works on test page
- [ ] CV submissions save to database

## 8.3 Integration Testing

Test cross-app functionality:

**Widget → Dashboard:**
1. Embed widget on test page
2. Submit CV via widget
3. Verify CV appears in dashboard applications list
4. Check email notification sent

**Widget → Database:**
1. Submit CV via widget
2. Query database directly
3. Verify application record created
4. Verify cvData JSON structure correct

## 8.4 Performance Testing

Monitor after deployment:

**Metrics to track:**
- Build time (should be < 5 min)
- Cold start time for API routes
- Database query performance
- PDF generation time
- Widget load time
- Lighthouse scores

**Tools:**
- Vercel Analytics (built-in)
- Vercel Speed Insights
- Browser DevTools Network tab
- Neon database metrics

## 8.5 Error Monitoring

Setup error tracking:

**Option 1: Vercel Logs**
- Built-in, view in Vercel dashboard
- Real-time error stream
- Function logs

**Option 2: Sentry (recommended)**
```bash
pnpm add @sentry/nextjs
```

Initialize in each app.

---

# PART 9: TROUBLESHOOTING GUIDE

## 9.1 Common Migration Issues

**ISSUE:** "Cannot find module '@repo/cv-builder'"

**SOLUTION:**
```bash
# Reinstall dependencies
pnpm install

# Check workspace link
ls -la node_modules/@repo/cv-builder

# If broken, clean and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

**ISSUE:** "Prisma client not found"

**SOLUTION:**
```bash
# Generate Prisma clients
cd packages/database-ladderfox
pnpm db:generate

cd ../database-hirekit
pnpm db:generate
```

**ISSUE:** "Build fails with out of memory"

**SOLUTION:**
```bash
# Increase Node memory
export NODE_OPTIONS=--max-old-space-size=4096

# Or in Vercel, add environment variable:
NODE_OPTIONS=--max-old-space-size=4096
```

**ISSUE:** "Module not found in production but works locally"

**SOLUTION:**
Check Vercel build command includes:
```bash
cd ../.. && pnpm install && pnpm turbo run build --filter=[app-name]
```

The `cd ../..` is critical to run from monorepo root.

## 9.2 Database Issues

**ISSUE:** "Connection timeout to Neon"

**SOLUTION:**
1. Check connection string correct
2. Verify SSL mode: `?sslmode=require`
3. Check Neon dashboard for database status
4. Verify IP allowlist (if configured)

**ISSUE:** "Prisma schema out of sync"

**SOLUTION:**
```bash
# For LadderFox (schema stays in apps/ladderfox/prisma/):
cd apps/ladderfox
npx prisma db push

# For HireKit:
cd packages/database-hirekit
pnpm db:push --force-reset  # DEV ONLY

# Or create migration
pnpm db:migrate
```

**ISSUE:** "DATABASE_URL not found"

**SOLUTION:**
LadderFox uses `DATABASE_URL` (unchanged from before migration).
HireKit uses `HIREKIT_DATABASE_URL`.
Do NOT confuse these. Check the correct `.env.local` file in the correct app directory.

```bash
# LadderFox: apps/ladderfox/.env.local
DATABASE_URL="postgresql://..."

# HireKit: packages/database-hirekit/.env
HIREKIT_DATABASE_URL="postgresql://..."
```

## 9.2.1 Webpack / Build Issues

**ISSUE:** "PDF generation broken after migration"

**SOLUTION:**
LadderFox's `next.config.js` has critical webpack customizations for `@react-pdf/renderer`. Verify these survive the migration:

1. Check `apps/ladderfox/next.config.js` still contains the `self → globalThis` string replacement rule
2. Check `serverComponentsExternalPackages` includes `puppeteer` and `@react-pdf/renderer`
3. Check `NODE_OPTIONS=--max-old-space-size=4096` is set in Vercel env vars
4. Test PDF generation locally before deploying

**ISSUE:** "@react-pdf/renderer throws 'self is not defined'"

**SOLUTION:**
The webpack `string-replace-loader` rule was lost. Ensure `next.config.js` has:
```javascript
{
  test: /\.js$/,
  include: /node_modules\/@react-pdf/,
  use: [{
    loader: 'string-replace-loader',
    options: {
      search: 'self',
      replace: 'globalThis',
      flags: 'g'
    }
  }]
}
```

## 9.3 Vercel Deployment Issues

**ISSUE:** "Build succeeds but app doesn't load"

**Check:**
1. Environment variables set correctly
2. Domain DNS configured
3. Build output directory correct (`.next` for Next.js, `dist` for Vite)
4. Check Function logs in Vercel dashboard

**ISSUE:** "API routes return 404"

**SOLUTION:**
Verify Next.js API routes are in correct location:
- App Router: `app/api/*/route.ts`
- Not: `pages/api/*.ts` (Pages Router)

**ISSUE:** "Serverless Function timeout"

**SOLUTION:**
1. Check function duration in Vercel dashboard
2. If >10s, optimize query or increase timeout (Pro plan)
3. For slow operations (PDF), use queue system

## 9.4 Widget Issues

**ISSUE:** "Widget doesn't load on customer site"

**Check:**
1. Script URL correct: `https://widget.hirekit.io/hirekit-widget.es.js`
2. CORS configured correctly
3. CSP headers allow widget domain
4. Browser console for errors

**ISSUE:** "Widget loads but CV builder broken"

**SOLUTION:**
1. Check API URL in widget config
2. Verify company config API returns correct data
3. Check browser console for errors
4. Test in isolation on `widget.hirekit.io`

## 9.5 Getting Help

If stuck:

1. Check Turborepo docs: https://turbo.build/repo/docs
2. Check Vercel monorepo guide: https://vercel.com/docs/monorepos
3. Check Prisma docs: https://www.prisma.io/docs
4. Search GitHub issues for similar problems

---

# PART 10: POST-MIGRATION CHECKLIST

## 10.1 Immediate Post-Migration (Day 1-2)

- [ ] LadderFox deployed successfully from monorepo
- [ ] No error spikes in production (compare to previous 48h baseline)
- [ ] Database connections stable (`DATABASE_URL` unchanged)
- [ ] Authentication working (test Google OAuth + email/password)
- [ ] Critical paths tested: login, CV creation, PDF generation, Stripe checkout
- [ ] Webpack customizations preserved (PDF generation works = confirmed)
- [ ] Monitoring enabled (Vercel Analytics, error tracking)
- [ ] Backup of production database created
- [ ] Old LadderFox repo preserved as rollback fallback
- [ ] Document any issues encountered

## 10.2 Week 1-2 Tasks

- [ ] Monitor LadderFox error rates daily
- [ ] Check database performance metrics
- [ ] Verify all LadderFox features working across full test matrix
- [ ] Confirm Stripe webhooks still delivering (check Stripe dashboard)
- [ ] Confirm email delivery working (password reset flow)
- [ ] Begin HireKit skeleton (Phase 4)
- [ ] Setup CI/CD for automated tests (optional but recommended)
- [ ] Review and update documentation

## 10.3 Week 3-6 Goals

- [ ] HireKit signup/login complete
- [ ] HireKit onboarding wizard complete
- [ ] HireKit company dashboard + settings pages complete
- [ ] CV builder (`@repo/cv-builder`) functional with all step forms
- [ ] Widget builds and loads on test pages
- [ ] Widget CORS and CSP tested on real customer-like sites
- [ ] Stripe integration for HireKit B2B plans
- [ ] Email notifications (application received)
- [ ] First internal testing / dogfooding

## 10.4 Week 6-8 Goals

- [ ] Widget fully functional and deployed to CDN
- [ ] Landing page system (`company-slug.hirekit.io`) working
- [ ] CV template rendering ported from LadderFox (basic templates)
- [ ] PDF generation for HireKit applications
- [ ] First beta customers onboarded
- [ ] Performance optimizations applied
- [ ] Test coverage for all new code

## 10.5 Ongoing Maintenance

**Regular tasks:**
- Update dependencies monthly
- Review Vercel usage and costs
- Monitor database size and performance
- Backup databases weekly
- Review error logs weekly
- Update documentation as features change

## 10.6 Future Enhancements

Consider adding:
- CI/CD pipeline (GitHub Actions)
- E2E tests (Playwright)
- Component library (Storybook)
- API documentation (Swagger)
- Performance monitoring (Sentry)
- Feature flags (LaunchDarkly)
- A/B testing framework

---

# APPENDIX A: Quick Reference Commands

**Development:**
```bash
# Start all apps
pnpm dev

# Start specific app
pnpm dev --filter=ladderfox

# Build all
pnpm build

# Build specific
pnpm build --filter=hirekit-app

# Generate Prisma clients
pnpm db:generate

# Run migrations
cd packages/database-hirekit && pnpm db:migrate
```

**Database:**
```bash
# LadderFox DB (Prisma stays in apps/ladderfox/)
cd apps/ladderfox
npx prisma studio    # Open Prisma Studio
npx prisma db push   # Push schema changes
npx prisma migrate dev # Create migration

# HireKit DB
cd packages/database-hirekit
pnpm db:studio
pnpm db:push
pnpm db:migrate
```

**Deployment:**
```bash
# Deploy all (via git push)
git push origin main

# Deploy specific app
cd apps/hirekit-app
vercel --prod
```

**Cleanup:**
```bash
# Clean all
pnpm clean

# Remove all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Remove all .next
find . -name ".next" -type d -prune -exec rm -rf '{}' +

# Fresh install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

# APPENDIX B: Environment Variables Reference

**LadderFox (.env.local):**
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://www.ladderfox.com
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OPENAI_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
RESEND_API_KEY=...
```

**HireKit Dashboard (.env.local):**
```
HIREKIT_DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://app.hirekit.io
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
RESEND_API_KEY=...
WIDGET_URL=https://widget.hirekit.io
```

**Widget (.env):**
```
VITE_API_URL=https://app.hirekit.io/api
```

---

# APPENDIX C: File Structure Reference

Complete monorepo tree (key files only):
```
recruitment-suite/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── .gitignore
├── apps/
│   ├── ladderfox/
│   │   ├── prisma/                # Stays here — NOT moved to packages/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   ├── next.config.js         # Critical webpack config preserved
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── .env.local             # DATABASE_URL unchanged
│   ├── hirekit/
│   │   ├── src/
│   │   ├── package.json
│   │   └── .env.local
│   ├── hirekit-app/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/
│   │   │   │   ├── onboarding/
│   │   │   │   └── dashboard/
│   │   │   ├── lib/
│   │   │   │   └── auth.ts
│   │   │   └── middleware.ts      # HireKit-specific middleware (CORS, rate limits)
│   │   ├── package.json
│   │   └── .env.local             # HIREKIT_DATABASE_URL
│   └── widget/
│       ├── src/
│       │   ├── main.tsx
│       │   └── widget.css         # Tailwind styles compiled into bundle
│       ├── package.json
│       ├── vite.config.ts         # Bundles React (not external)
│       └── index.html
└── packages/
    ├── cv-builder/
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── CVBuilder.tsx   # NEW component, not extracted from LadderFox
    │   │   │   └── steps/          # PersonalInfo, Experience, Education, Skills, Review
    │   │   ├── hooks/
    │   │   ├── utils/
    │   │   └── index.ts
    │   ├── package.json
    │   └── tsconfig.json
    ├── ui/
    │   ├── src/
    │   │   ├── button.tsx
    │   │   ├── utils.ts
    │   │   └── index.ts
    │   └── package.json
    ├── types/
    │   ├── src/
    │   │   └── index.ts
    │   └── package.json
    ├── database-ladderfox/
    │   ├── src/
    │   │   └── client.ts          # Thin re-export (schema stays in apps/ladderfox/)
    │   └── package.json
    ├── database-hirekit/
    │   ├── prisma/
    │   │   └── schema.prisma
    │   ├── src/
    │   │   └── client.ts
    │   ├── generated/
    │   ├── package.json
    │   └── .env
    ├── typescript-config/
    │   ├── base.json
    │   ├── nextjs.json
    │   └── package.json
    ├── eslint-config/
    │   ├── next.js
    │   └── package.json
    └── tailwind-config/
        ├── index.js
        └── package.json
```

---

# END OF DOCUMENT

This comprehensive guide should provide everything needed for a developer to:
1. Understand the architecture
2. Perform the migration
3. Build HireKit features
4. Deploy successfully
5. Troubleshoot issues

**Estimated total development time: 6-8 weeks**

Questions or issues? Refer to specific sections or appendices above.