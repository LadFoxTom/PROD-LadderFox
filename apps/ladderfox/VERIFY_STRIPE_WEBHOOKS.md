# 🔍 How to Verify Stripe Webhooks are in Live Mode

## 📋 From Your Screenshot

I can see you have **two webhook destinations**:

1. **"adventurous-breeze-thin"** → `https://uat.ladderfox.com/` (UAT environment)
2. **"adventurous-breeze-snapshot"** → `https://www.ladderfox.com` (Production)

Both show "Active" status, but you need to verify they're in **Live mode** (not Test mode).

---

## ✅ How to Check if Webhooks are in Live Mode

### Method 1: Check the Stripe Dashboard Mode (Easiest)

1. **Look at the top-right corner** of your Stripe Dashboard
2. **Check the toggle/indicator**:
   - 🔴 **"Test mode"** = Webhooks are in test mode
   - 🟢 **"Live mode"** = Webhooks are in live mode
3. **If you see "Test mode"**, click the toggle to switch to **"Live mode"**

### Method 2: Check the URL

- **Test mode**: URL contains `/test/` or shows "Test mode" in the header
- **Live mode**: URL contains `/live/` or shows "Live mode" in the header

### Method 3: Check Webhook Details

1. **Click on the webhook** (the one pointing to `https://www.ladderfox.com`)
2. **Look at the webhook details page**
3. **Check the "Signing secret"**:
   - If it starts with `whsec_test_` → Test mode
   - If it starts with `whsec_live_` → Live mode (or just `whsec_` for live)

---

## 🎯 For Production Setup

### Production Webhook (ladderfox.com)

**You need to verify this webhook is in Live mode:**

1. **Switch to Live mode** in Stripe Dashboard (top-right toggle)
2. **Click on** "adventurous-breeze-snapshot" webhook
3. **Verify**:
   - ✅ URL: `https://www.ladderfox.com/api/stripe/webhook` (should include `/api/stripe/webhook`)
   - ✅ Status: Active
   - ✅ Signing secret: Should match your `STRIPE_WEBHOOK_SECRET` in `.env`
   - ✅ Events: Should include:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

### UAT Webhook (uat.ladderfox.com)

**This can stay in Test mode** (for testing purposes).

---

## ⚠️ Important: Webhook Endpoint Path

**Check if your production webhook URL includes the full path:**

- ❌ Wrong: `https://www.ladderfox.com`
- ✅ Correct: `https://www.ladderfox.com/api/stripe/webhook`

If the webhook URL doesn't include `/api/stripe/webhook`, you need to update it!

---

## 🔧 How to Update Webhook (if needed)

1. **Click on the webhook** "adventurous-breeze-snapshot"
2. **Click the "..." menu** (three dots on the right)
3. **Select "Edit"** or "Update endpoint"
4. **Update the URL** to: `https://www.ladderfox.com/api/stripe/webhook`
5. **Save**

---

## ✅ Verification Checklist

- [ ] Stripe Dashboard is in **Live mode** (not Test mode)
- [ ] Production webhook URL is: `https://www.ladderfox.com/api/stripe/webhook`
- [ ] Webhook status is **Active**
- [ ] Signing secret matches `STRIPE_WEBHOOK_SECRET` in `.env`
- [ ] Required events are selected (subscription.created, subscription.updated, etc.)
- [ ] Error rate is 0% (or low)

---

## 🚨 Common Issues

### Issue 1: Webhook in Test Mode
**Solution**: Switch Stripe Dashboard to Live mode, then check webhook again.

### Issue 2: Wrong URL Path
**Solution**: Update webhook URL to include `/api/stripe/webhook`.

### Issue 3: Signing Secret Mismatch
**Solution**: Copy the signing secret from Stripe and update `STRIPE_WEBHOOK_SECRET` in `.env`.

---

## 📝 Quick Check

**To quickly verify if you're in Live mode:**

1. Look at the **top-right corner** of Stripe Dashboard
2. If you see **"Test mode"** → Click to switch to **"Live mode"**
3. Once in Live mode, your webhooks will be in Live mode too

**The webhook pointing to `https://www.ladderfox.com` should be in Live mode for production!**

