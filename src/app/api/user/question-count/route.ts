import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Question limits
const GUEST_QUESTION_LIMIT = 2; // Without login: start prompt + 1 extra
const FREE_ACCOUNT_QUESTION_LIMIT = 5; // After login: total 5 (2 guest + 3 free)

/**
 * GET /api/user/question-count
 * Get current question count for user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // For guests (not logged in), return 0 (we'll track in localStorage on client)
    if (!session?.user?.id) {
      return NextResponse.json({
        count: 0,
        limit: GUEST_QUESTION_LIMIT,
        remaining: GUEST_QUESTION_LIMIT,
        isGuest: true
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { questionCount: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check subscription to determine limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    // Treat 'trialing' as active (trial users have full access)
    const isPaid = subscription && subscription.plan !== 'free' && (subscription.status === 'active' || subscription.status === 'trialing');
    const limit = isPaid ? Infinity : FREE_ACCOUNT_QUESTION_LIMIT;
    const remaining = isPaid ? Infinity : Math.max(0, limit - user.questionCount);

    return NextResponse.json({
      count: user.questionCount,
      limit,
      remaining,
      isGuest: false,
      isPaid
    });
  } catch (error) {
    console.error('Failed to fetch question count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question count' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/question-count
 * Increment question count and check if limit is reached
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // For guests, we don't increment in database (tracked in localStorage)
    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        count: 0,
        limit: GUEST_QUESTION_LIMIT,
        remaining: GUEST_QUESTION_LIMIT,
        isGuest: true,
        limitReached: false
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { questionCount: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check subscription to determine limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id }
    });

    // Treat 'trialing' as active (trial users have full access)
    const isPaid = subscription && subscription.plan !== 'free' && (subscription.status === 'active' || subscription.status === 'trialing');
    const limit = isPaid ? Infinity : FREE_ACCOUNT_QUESTION_LIMIT;
    const currentCount = user.questionCount;
    const newCount = currentCount + 1;
    const limitReached = !isPaid && newCount >= limit;

    // Only increment if limit not reached (or if paid)
    if (!limitReached || isPaid) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { questionCount: newCount }
      });
    }

    return NextResponse.json({
      success: true,
      count: limitReached ? currentCount : newCount,
      limit,
      remaining: isPaid ? Infinity : Math.max(0, limit - (limitReached ? currentCount : newCount)),
      isGuest: false,
      isPaid,
      limitReached
    });
  } catch (error) {
    console.error('Failed to increment question count:', error);
    return NextResponse.json(
      { error: 'Failed to increment question count' },
      { status: 500 }
    );
  }
}
