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
