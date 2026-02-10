# 🔧 Subscription Update Fix - Debug & Manual Update

## Probleem

Na betaling wordt de subscription niet automatisch geüpdatet in de database. Dit kan komen door:
1. Webhook wordt niet ontvangen
2. Webhook events worden niet correct verwerkt
3. User wordt niet gevonden via customer ID

## ✅ Wat is gefixt

1. **Betere logging** toegevoegd aan webhook handler
2. **`checkout.session.completed` handler** toegevoegd
3. **Fallback** om user te vinden via customer metadata
4. **Billing cycle** wordt nu correct bepaald
5. **Customer ID** wordt nu ook opgeslagen bij update

## 🔍 Debug Stappen

### 1. Check Stripe Dashboard - Webhook Events

1. Ga naar https://dashboard.stripe.com/
2. Zorg dat je in **LIVE mode** bent
3. Ga naar **Developers** → **Webhooks**
4. Klik op je webhook endpoint
5. Bekijk **Recent events**:
   - Zoek naar `checkout.session.completed`
   - Zoek naar `customer.subscription.created`
   - Zoek naar `customer.subscription.updated`

### 2. Check Vercel Logs

1. Ga naar Vercel Dashboard → **Logs**
2. Filter op `[Webhook]` of `[Stripe]`
3. Zoek naar errors of warnings
4. Check of events worden ontvangen

### 3. Check Database

Controleer of de subscription record bestaat en correct is:

```sql
-- Vind user
SELECT id, email, name FROM "User" WHERE email = 'tom@ladderfox.com';

-- Check subscription
SELECT * FROM "Subscription" WHERE "userId" = '<user-id>';
```

### 4. Check Stripe Customer

In Stripe Dashboard:
1. Ga naar **Customers**
2. Zoek naar `tom@ladderfox.com`
3. Check de **Subscriptions** tab
4. Noteer de **Customer ID** en **Subscription ID**

## 🛠️ Handmatige Fix voor tom@ladderfox.com

### Optie 1: Via Stripe Dashboard (Aanbevolen)

1. **Vind de Customer ID**:
   - Ga naar Stripe Dashboard → Customers
   - Zoek naar `tom@ladderfox.com`
   - Kopieer de Customer ID (begint met `cus_`)

2. **Vind de Subscription ID**:
   - Klik op de customer
   - Ga naar **Subscriptions** tab
   - Kopieer de Subscription ID (begint met `sub_`)

3. **Trigger webhook handmatig**:
   - Ga naar Stripe Dashboard → Developers → Events
   - Zoek naar `customer.subscription.created` of `customer.subscription.updated`
   - Klik op het event
   - Klik op **"Send test webhook"** of **"Replay event"**

### Optie 2: Via Database Direct (Geavanceerd)

Als je directe database toegang hebt:

```sql
-- 1. Vind user
SELECT id, email FROM "User" WHERE email = 'tom@ladderfox.com';

-- 2. Update subscription handmatig (vervang <user-id>, <customer-id>, <subscription-id>)
UPDATE "Subscription"
SET 
  "stripeCustomerId" = '<customer-id>',
  "stripeSubscriptionId" = '<subscription-id>',
  "plan" = 'basic',
  "status" = 'trialing', -- of 'active' als trial voorbij is
  "billingCycle" = 'yearly', -- of 'monthly', 'quarterly'
  "currentPeriodStart" = NOW(),
  "currentPeriodEnd" = NOW() + INTERVAL '1 year', -- pas aan naar juiste periode
  "updatedAt" = NOW()
WHERE "userId" = '<user-id>';
```

### Optie 3: Via API Script (Aanbevolen voor Developers)

Maak een script om de subscription te updaten:

```typescript
// scripts/fix-subscription.ts
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

async function fixSubscription(email: string) {
  // 1. Find user
  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true }
  })

  if (!user) {
    console.error('User not found:', email)
    return
  }

  console.log('Found user:', user.id, user.email)

  // 2. Find customer in Stripe
  const customers = await stripe.customers.list({
    email: email,
    limit: 1
  })

  if (customers.data.length === 0) {
    console.error('Customer not found in Stripe')
    return
  }

  const customer = customers.data[0]
  console.log('Found customer:', customer.id)

  // 3. Find subscription
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
    limit: 1
  })

  if (subscriptions.data.length === 0) {
    console.error('Subscription not found in Stripe')
    return
  }

  const subscription = subscriptions.data[0]
  console.log('Found subscription:', subscription.id)

  // 4. Update database
  const priceId = subscription.items.data[0]?.price.id
  const isInTrial = subscription.trial_end && subscription.trial_end > Math.floor(Date.now() / 1000)
  const status = isInTrial ? 'trialing' : subscription.status

  // Determine plan and billing cycle
  let plan = 'basic'
  let billingCycle = 'monthly'
  
  // Check price IDs (gebruik je eigen Price IDs)
  const basicYearlyPriceId = process.env.STRIPE_BASIC_YEARLY_PRICE_ID_EUR
  if (priceId === basicYearlyPriceId) {
    plan = 'basic'
    billingCycle = 'yearly'
  }

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan: plan,
      status: status,
      billingCycle: billingCycle,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    create: {
      userId: user.id,
      stripeCustomerId: customer.id,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      plan: plan,
      status: status,
      billingCycle: billingCycle,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    }
  })

  console.log('Subscription updated successfully!')
}

// Run
fixSubscription('tom@ladderfox.com')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
```

## ✅ Verificatie

Na de fix:

1. **Check database**:
   ```sql
   SELECT * FROM "Subscription" WHERE "userId" = '<user-id>';
   ```

2. **Check in app**:
   - Login als tom@ladderfox.com
   - Ga naar subscription pagina
   - Verifieer dat plan = 'basic' en status = 'trialing' of 'active'

3. **Test features**:
   - Probeer PDF export (moet werken voor basic plan)
   - Check of AI features beschikbaar zijn

## 🔄 Toekomstige Preventie

De verbeterde webhook handler zou dit probleem moeten voorkomen:

1. **`checkout.session.completed`** wordt nu afgehandeld
2. **Betere logging** helpt met debugging
3. **Fallback** om user te vinden via metadata
4. **Customer ID** wordt altijd opgeslagen

## 📝 Webhook Events Checklist

Zorg dat deze events zijn ingesteld in Stripe Dashboard:

- ✅ `checkout.session.completed` (nieuw toegevoegd)
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

---

**Laatste update**: Na webhook handler verbeteringen
