# Subscription-Based Feature Gating Guide

## Overview

The application now supports subscription-based feature gating, allowing you to show/hide sections and features based on user subscription plans.

## Schema Updates

### ✅ Added User ↔ Subscription Relation
- `User` model now has `subscription Subscription?` relation
- `Subscription` model now has `user User` relation with cascade delete

### ✅ Added Subscription Fields
- `plan`: 'free' | 'basic' | 'pro' | 'team'
- `status`: 'active' | 'canceled' | 'past_due' | 'trialing'
- `billingCycle`: 'monthly' | 'quarterly' | 'yearly'
- `currentPeriodStart`: DateTime
- `currentPeriodEnd`: DateTime
- `cancelAtPeriodEnd`: Boolean
- `features`: JSON (feature access configuration)
- `usageQuotas`: JSON (usage tracking)

## Usage Examples

### 1. Using the `SubscriptionGate` Component

Wrap any section you want to gate:

```tsx
import { SubscriptionGate } from '@/components/SubscriptionGate';

// Gate by feature
<SubscriptionGate feature="pdf_export">
  <PDFExportButton />
</SubscriptionGate>

// Gate by minimum plan
<SubscriptionGate minPlan="pro">
  <AdvancedAnalytics />
</SubscriptionGate>

// Gate by quota
<SubscriptionGate quotaType="ai_requests">
  <AIChatInterface />
</SubscriptionGate>

// Custom upgrade message
<SubscriptionGate 
  feature="job_tracking"
  upgradeMessage="Upgrade to Basic plan to track your job applications!"
>
  <JobTrackingDashboard />
</SubscriptionGate>

// Hide instead of showing upgrade prompt
<SubscriptionGate 
  feature="analytics"
  showUpgradePrompt={false}
>
  <AnalyticsDashboard />
</SubscriptionGate>

// Custom fallback
<SubscriptionGate 
  feature="api_access"
  fallback={<UpgradeBanner />}
>
  <APIAccessPanel />
</SubscriptionGate>
```

### 2. Using the `useSubscription` Hook

For more control:

```tsx
import { useSubscription } from '@/hooks/useSubscription';

function MyComponent() {
  const { 
    subscription, 
    loading, 
    hasFeature, 
    hasQuota, 
    isPlan, 
    isAtLeastPlan,
    isActive 
  } = useSubscription();

  if (loading) return <Loading />;

  // Check specific feature
  if (hasFeature('pdf_export')) {
    return <PDFExportButton />;
  }

  // Check plan level
  if (isAtLeastPlan('pro')) {
    return <ProFeatures />;
  }

  // Check quota
  if (hasQuota('ai_requests')) {
    return <AIChatInterface />;
  }

  return <UpgradePrompt />;
}
```

### 3. Server-Side Checks

In API routes or server components:

```tsx
import { SubscriptionService } from '@/lib/subscription';

// In API route
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscription = await SubscriptionService.getUserSubscription(session.user.id);
  
  if (!subscription.features.pdf_export) {
    return NextResponse.json(
      { error: 'Feature not available in your plan' },
      { status: 403 }
    );
  }

  // Continue with feature...
}
```

## Available Features

### Feature Flags
- `pdf_export`: Boolean - Can export PDFs
- `ai_requests`: Number - Number of AI requests allowed
- `templates`: 'basic' | 'all' | 'premium' - Template access level
- `job_tracking`: Boolean - Job application tracking
- `analytics`: Boolean - Advanced analytics
- `priority_support`: Boolean - Priority customer support
- `api_access`: Boolean - API access
- `team_collaboration`: Boolean - Team features

### Quota Types
- `ai_requests`: { used: number; limit: number }
- `exports`: { used: number; limit: number }
- `storage`: { used: number; limit: number } (in MB)
- `api_calls`: { used: number; limit: number }

## Plan Features

### Free Plan
- `pdf_export`: false
- `ai_requests`: 3
- `templates`: 'basic'
- `job_tracking`: false
- `analytics`: false
- `priority_support`: false
- `api_access`: false
- `team_collaboration`: false

### Basic Plan
- `pdf_export`: true
- `ai_requests`: 100
- `templates`: 'all'
- `job_tracking`: true
- `analytics`: false
- `priority_support`: false
- `api_access`: false
- `team_collaboration`: false

### Pro Plan
- `pdf_export`: true
- `ai_requests`: 1000
- `templates`: 'all'
- `job_tracking`: true
- `analytics`: true
- `priority_support`: true
- `api_access`: true
- `team_collaboration`: false

### Team Plan
- `pdf_export`: true
- `ai_requests`: 5000
- `templates`: 'all'
- `job_tracking`: true
- `analytics`: true
- `priority_support`: true
- `api_access`: true
- `team_collaboration`: true

## Migration

When deploying to production:

1. **Run database migration**:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate deploy
   ```

2. **Update existing subscriptions** (if any):
   ```typescript
   // Set default values for existing subscriptions
   await prisma.subscription.updateMany({
     where: {
       plan: null,
     },
     data: {
       plan: 'free',
       status: 'active',
       billingCycle: 'monthly',
     },
   });
   ```

## Examples in Codebase

### Example 1: Gate PDF Export
```tsx
<SubscriptionGate feature="pdf_export">
  <button onClick={handleDownloadPDF}>
    Download PDF
  </button>
</SubscriptionGate>
```

### Example 2: Gate AI Features
```tsx
<SubscriptionGate 
  quotaType="ai_requests"
  upgradeMessage="You've used all your AI requests. Upgrade for more!"
>
  <AIChatInterface />
</SubscriptionGate>
```

### Example 3: Gate Pro Features
```tsx
<SubscriptionGate minPlan="pro">
  <AdvancedAnalytics />
  <APIAccess />
  <PrioritySupport />
</SubscriptionGate>
```

### Example 4: Conditional Rendering
```tsx
function Dashboard() {
  const { hasFeature, isAtLeastPlan } = useSubscription();

  return (
    <div>
      <BasicFeatures />
      
      {hasFeature('job_tracking') && (
        <JobTrackingSection />
      )}
      
      {isAtLeastPlan('pro') && (
        <ProAnalyticsSection />
      )}
    </div>
  );
}
```

## Best Practices

1. **Always provide fallback**: Use `fallback` prop or `showUpgradePrompt` for better UX
2. **Check on server**: For critical features, also check on server-side
3. **Cache subscription data**: The hook caches subscription data client-side
4. **Handle loading states**: Always show loading state while fetching subscription
5. **Graceful degradation**: Show free features even when premium is locked

## Testing

Test with different subscription plans:

```typescript
// Mock subscription in tests
const mockSubscription = {
  plan: 'free',
  status: 'active',
  features: { pdf_export: false },
  // ...
};
```

---

**Ready to use!** Wrap any section with `<SubscriptionGate>` to control access based on subscription! 🚀

