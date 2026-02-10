import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StripeService, STRIPE_PLANS } from '@/lib/stripe'

// Force dynamic rendering since this route uses Stripe API and authentication
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { plan, interval = 'yearly', currency = 'EUR', successUrl, cancelUrl } = await request.json()
    
    console.log('[Checkout] Request received:', {
      plan,
      interval,
      currency,
      hasSuccessUrl: !!successUrl,
      hasCancelUrl: !!cancelUrl
    })
    
    if (!plan || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields', details: { plan: !!plan, successUrl: !!successUrl, cancelUrl: !!cancelUrl } },
        { status: 400 }
      )
    }

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]
    if (!planConfig) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // Get the correct price ID based on plan, interval, and currency
    let priceId: string | undefined

    if (plan === 'free') {
      return NextResponse.json(
        { error: 'Free plan does not require checkout' },
        { status: 400 }
      )
    }

    if (plan === 'basic') {
      const basicPlan = planConfig as typeof STRIPE_PLANS.basic
      
      // All intervals (monthly, quarterly, yearly) support 7-day trial with setup fee
      const useTrial = true
      
      // Get the price ID for the selected interval
      let intervalPrices
      if (interval === 'monthly') {
        intervalPrices = basicPlan.stripePriceIds.monthly
      } else if (interval === 'quarterly') {
        intervalPrices = basicPlan.stripePriceIds.quarterly
      } else if (interval === 'yearly') {
        intervalPrices = basicPlan.stripePriceIds.yearly
      } else {
        return NextResponse.json(
          { error: 'Invalid billing interval' },
          { status: 400 }
        )
      }
      
      priceId = intervalPrices[currency as keyof typeof intervalPrices]
      
      // Get trial setup fee price
      const trialPrices = basicPlan.stripePriceIds.trial
      const trialSetupFeePriceId = trialPrices?.[currency as keyof typeof trialPrices]
      
      // Enhanced error logging
      if (!priceId || !trialSetupFeePriceId) {
        console.error('[Checkout] Missing price IDs:', {
          plan,
          interval,
          currency,
          priceId: priceId || 'MISSING',
          trialSetupFeePriceId: trialSetupFeePriceId || 'MISSING',
          availablePrices: {
            monthly: {
              EUR: basicPlan.stripePriceIds.monthly.EUR || 'MISSING',
              USD: basicPlan.stripePriceIds.monthly.USD || 'MISSING'
            },
            quarterly: {
              EUR: basicPlan.stripePriceIds.quarterly.EUR || 'MISSING',
              USD: basicPlan.stripePriceIds.quarterly.USD || 'MISSING'
            },
            yearly: {
              EUR: basicPlan.stripePriceIds.yearly.EUR || 'MISSING',
              USD: basicPlan.stripePriceIds.yearly.USD || 'MISSING'
            },
            trial: {
              EUR: basicPlan.stripePriceIds.trial.EUR || 'MISSING',
              USD: basicPlan.stripePriceIds.trial.USD || 'MISSING'
            }
          }
        })
        
        return NextResponse.json(
          { 
            error: 'Trial pricing not configured for this currency',
            details: {
              interval,
              currency,
              missingPriceId: !priceId,
              missingTrialPriceId: !trialSetupFeePriceId
            }
          },
          { status: 400 }
        )
      }
      
      // Create checkout with trial for all intervals
      const checkoutSession = await StripeService.createCheckoutSession(
        session.user.id,
        priceId,
        successUrl,
        cancelUrl,
        {
          isTrial: true,
          trialSetupFeePriceId: trialSetupFeePriceId,
          currency: currency
        }
      )
      
      return NextResponse.json({ 
        sessionId: checkoutSession.id,
        url: checkoutSession.url 
      })
    } else if (plan === 'pro') {
      // Pro plan is coming soon, but handle for future
      const proPlan = planConfig as typeof STRIPE_PLANS.pro
      const intervalPrices = proPlan.stripePriceIds[interval as keyof typeof proPlan.stripePriceIds]
      if (!intervalPrices) {
        return NextResponse.json(
          { error: 'Invalid billing interval' },
          { status: 400 }
        )
      }
      priceId = intervalPrices[currency as keyof typeof intervalPrices]
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price not found for the selected plan, interval, and currency' },
        { status: 400 }
      )
    }

    const checkoutSession = await StripeService.createCheckoutSession(
      session.user.id,
      priceId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 