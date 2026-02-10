# 🔧 Stripe Troubleshooting Guide

## Error: "Failed to create checkout session" (500)

Deze error betekent dat de Stripe checkout sessie niet aangemaakt kan worden. Dit komt meestal door ontbrekende of incorrecte environment variables.

---

## 📋 Vereiste Environment Variables

### 1. Stripe API Keys

```bash
STRIPE_SECRET_KEY=sk_live_...        # Je Stripe secret key (LIVE mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Je publishable key (LIVE mode)
```

### 2. Price IDs (Basic Plan)

De app ondersteunt meerdere betaalintervallen en currencies:

```bash
# Basic Plan - Monthly
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR=price_...
STRIPE_BASIC_MONTHLY_PRICE_ID_USD=price_...

# Basic Plan - Quarterly  
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR=price_...
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD=price_...

# Basic Plan - Yearly
STRIPE_BASIC_YEARLY_PRICE_ID_EUR=price_...
STRIPE_BASIC_YEARLY_PRICE_ID_USD=price_...
```

### 3. Price IDs (Pro Plan - Optional)

Als je de Pro plan enabled hebt:

```bash
# Pro Plan - Monthly
STRIPE_PRO_MONTHLY_PRICE_ID_EUR=price_...
STRIPE_PRO_MONTHLY_PRICE_ID_USD=price_...

# Pro Plan - Yearly
STRIPE_PRO_YEARLY_PRICE_ID_EUR=price_...
STRIPE_PRO_YEARLY_PRICE_ID_USD=price_...
```

---

## 🔍 Diagnose Stappen

### Stap 1: Check Vercel Environment Variables

```bash
# Login bij Vercel
vercel login

# Selecteer project
vercel link

# List environment variables
vercel env ls
```

Controleer of de volgende variabelen bestaan voor **Production**:
- ✅ `STRIPE_SECRET_KEY`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_BASIC_YEARLY_PRICE_ID_EUR` (minimaal deze!)

### Stap 2: Check Stripe Dashboard

1. Ga naar https://dashboard.stripe.com/
2. Zorg dat je in **LIVE mode** bent (toggle rechtsboven)
3. Ga naar **Products** → Bekijk je producten
4. Controleer dat je **Price IDs** hebt aangemaakt

### Stap 3: Check Console Logs

De API route logt errors. Check Vercel logs:

```bash
# Realtime logs
vercel logs --follow

# Of via Vercel dashboard:
# https://vercel.com/[your-username]/ladderfox-prod/logs
```

---

## 🛠️ Oplossingen

### Oplossing 1: Voeg Stripe Keys Toe (Eenvoudigst)

Als je alleen de Basic Yearly plan wilt ondersteunen (eenvoudigste setup):

```bash
# Voeg toe aan Vercel
vercel env add STRIPE_SECRET_KEY
# Plak: sk_live_... [Enter]
# Environment: Production [Enter]

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Plak: pk_live_... [Enter]
# Environment: Production [Enter]

vercel env add STRIPE_BASIC_YEARLY_PRICE_ID_EUR
# Plak: price_... [Enter]
# Environment: Production [Enter]
```

**Let op:** Na het toevoegen van env vars moet je redeployen:
```bash
vercel --prod
```

### Oplossing 2: Maak Price IDs in Stripe

Als je nog geen prices hebt aangemaakt in Stripe:

#### A. Via Stripe Dashboard

1. Ga naar https://dashboard.stripe.com/products
2. Klik **"+ Add product"**
3. Vul in:
   - **Name**: `LadderFox Basic Plan`
   - **Description**: `Full access to CV builder with AI`
   - **Pricing**: Recurring
   - **Amount**: `€39.99`
   - **Billing period**: Yearly
   - **Currency**: EUR
4. Klik **"Save product"**
5. Kopieer de **Price ID** (begint met `price_...`)
6. Herhaal voor USD en andere intervallen

#### B. Via Stripe CLI (Sneller)

```bash
# Installeer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Maak product
stripe products create \
  --name="LadderFox Basic Plan" \
  --description="Full access with AI assistance"

# Maak prices (vervang prod_... met je product ID)
stripe prices create \
  --product=prod_... \
  --currency=eur \
  --unit-amount=3999 \
  --recurring[interval]=year

# Kopieer de price ID en voeg toe aan Vercel
```

### Oplossing 3: Update Code voor Simplified Pricing

Als je niet alle intervallen/currencies wilt ondersteunen, kan ik de code vereenvoudigen:

**Quick Fix: Alleen Yearly EUR**

Dit ondersteunt alleen:
- Basic Plan
- Yearly billing
- EUR currency

Laat me weten als je dit wilt - ik kan de code aanpassen in ~5 minuten.

---

## ✅ Verificatie

### Test de Integratie

1. **Via Browser Console**:
```javascript
fetch('/api/stripe/create-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plan: 'basic',
    interval: 'yearly',
    currency: 'EUR',
    successUrl: window.location.origin + '/success',
    cancelUrl: window.location.origin + '/pricing'
  })
}).then(r => r.json()).then(console.log)
```

**Verwacht resultaat**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Error resultaat**:
```json
{
  "error": "Price not found for the selected plan, interval, and currency"
}
```

2. **Via Stripe Dashboard**:
   - Ga naar **Events**
   - Check of er nieuwe events zijn
   - Check of er errors zijn

---

## 🚨 Veel Voorkomende Fouten

### Error: "Unauthorized" (401)
**Oorzaak**: Niet ingelogd
**Oplossing**: Login eerst via `/auth/login`

### Error: "Invalid plan" (400)
**Oorzaak**: Ongeldige plan naam
**Oplossing**: Gebruik `basic` of `pro`

### Error: "Price not found" (400)
**Oorzaak**: Price ID niet geconfigureerd voor deze combinatie
**Oplossing**: 
- Check of `STRIPE_BASIC_YEARLY_PRICE_ID_EUR` bestaat in Vercel
- Of selecteer een andere currency/interval

### Error: "Failed to create checkout session" (500)
**Oorzaak**: STRIPE_SECRET_KEY ontbreekt of is incorrect
**Oplossing**:
1. Check of `STRIPE_SECRET_KEY` in Vercel staat
2. Check of het begint met `sk_live_` (niet `sk_test_`)
3. Check of de key nog geldig is in Stripe Dashboard

---

## 📞 Snelle Check Lijst

Voordat je contact opneemt, check:

- [ ] `STRIPE_SECRET_KEY` is toegevoegd aan Vercel Production
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is toegevoegd aan Vercel Production
- [ ] Minimaal 1 price ID is toegevoegd (bijv. `STRIPE_BASIC_YEARLY_PRICE_ID_EUR`)
- [ ] Je bent ingelogd op de website
- [ ] Je gebruikt LIVE keys (niet TEST keys)
- [ ] Je hebt geredeployed na het toevoegen van env vars
- [ ] Stripe Dashboard is in LIVE mode (niet TEST mode)

---

## 🎯 Aanbevolen Eerste Setup

Voor de snelste setup, begin met:

```bash
# Minimale configuratie voor productie
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_BASIC_YEARLY_PRICE_ID_EUR=price_...
```

Dit ondersteunt:
- ✅ Basic Plan
- ✅ Yearly billing
- ✅ EUR currency
- ✅ Productie-klaar

Andere opties kunnen later toegevoegd worden.

---

## 📚 Nuttige Links

- **Stripe Dashboard**: https://dashboard.stripe.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Stripe API Keys**: https://dashboard.stripe.com/apikeys
- **Stripe Products**: https://dashboard.stripe.com/products
- **Stripe CLI**: https://stripe.com/docs/stripe-cli
- **Vercel Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

**Laatste update:** Januari 2026
