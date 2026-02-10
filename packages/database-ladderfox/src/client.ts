// Thin re-export wrapper.
// The actual Prisma schema and generated client live in apps/ladderfox/prisma/.
// LadderFox itself continues to import from '@prisma/client' directly.
// This package exists so that OTHER packages can reference LadderFox types if needed.

import { PrismaClient } from '@prisma/client';

export { PrismaClient };
export * from '@prisma/client';
