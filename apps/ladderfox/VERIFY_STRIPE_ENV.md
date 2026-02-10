# 🔍 Stripe Environment Variables Verificatie

## Probleem: 400 Bad Request bij Checkout

Als je een 400 error krijgt bij het aanmaken van een checkout session, controleer dan het volgende:

## ✅ Checklist

### 1. Vercel Environment Variables

Ga naar Vercel Dashboard → Settings → Environment Variables en verifieer dat **alle** volgende variabelen bestaan voor **Production**:

```bash
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR
STRIPE_BASIC_YEARLY_PRICE_ID_EUR
STRIPE_BASIC_MONTHLY_PRICE_ID_USD
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD
STRIPE_BASIC_YEARLY_PRICE_ID_USD
```

### 2. Correcte Price IDs

Verifieer dat elke variabele de **juiste** Price ID bevat:

```bash
# EUR Prices
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR=price_1SwTnNAXNBtmQqIKukubdg5h
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR=price_1SwTkjAXNBtmQqIKfzQ6sRU3
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR=price_1SwTo9AXNBtmQqIKeokbUpea
STRIPE_BASIC_YEARLY_PRICE_ID_EUR=price_1SwTosAXNBtmQqIKkOESuWml

# USD Prices
STRIPE_BASIC_MONTHLY_PRICE_ID_USD=price_1SwTnnAXNBtmQqIKMabZ0RmJ
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD=price_1SwTlAAXNBtmQqIK9W3qQhIb
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD=price_1SwToNAXNBtmQqIKWsgVABMB
STRIPE_BASIC_YEARLY_PRICE_ID_USD=price_1SwTpAAXNBtmQqIKBVapX4Xp
```

### 3. Environment Selectie

**BELANGRIJK**: Zorg dat alle variabelen zijn ingesteld voor **Production** environment!

- ✅ Production (vereist)
- ⚠️ Preview (optioneel, maar aanbevolen)
- ⚠️ Development (optioneel)

### 4. Redeploy na Wijzigingen

Na het toevoegen/wijzigen van environment variables:
1. Ga naar **Deployments**
2. Klik op de laatste deployment
3. Klik **"Redeploy"**
4. Wacht tot deployment klaar is

### 5. Check Vercel Logs

Na een redeploy, check de logs voor errors:

1. Ga naar Vercel Dashboard → **Logs**
2. Of gebruik CLI: `vercel logs --follow`
3. Zoek naar `[Checkout]` of `[Stripe]` log entries
4. Check of Price IDs worden geladen

## 🐛 Debugging

### Test API Direct

Test de API direct met curl of Postman:

```bash
curl -X POST https://www.ladderfox.com/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "plan": "basic",
    "interval": "yearly",
    "currency": "EUR",
    "successUrl": "https://www.ladderfox.com/?success=true",
    "cancelUrl": "https://www.ladderfox.com/pricing?canceled=true"
  }'
```

### Check Browser Console

Open browser Developer Tools → Console en kijk naar:
- Error messages met details
- `[Checkout]` log entries
- Network tab voor de exacte request/response

### Check Vercel Function Logs

In Vercel Dashboard → Functions → `api/stripe/create-checkout`:
- Bekijk recente invocations
- Check error logs
- Verifieer environment variables worden geladen

## 🔧 Veel Voorkomende Problemen

### Probleem: "Trial pricing not configured for this currency"

**Oorzaak**: Trial setup fee Price ID ontbreekt of is incorrect

**Oplossing**:
1. Check of `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR` (of USD) bestaat in Vercel
2. Check of de Price ID correct is (begint met `price_`)
3. Check of de variabele is ingesteld voor **Production** environment
4. Redeploy na wijzigingen

### Probleem: "Price not found for the selected plan, interval, and currency"

**Oorzaak**: Price ID ontbreekt voor deze combinatie

**Oplossing**:
1. Check welke interval en currency je gebruikt
2. Verifieer dat de juiste environment variable bestaat
3. Check of de Price ID correct is gekopieerd (geen extra spaties)
4. Redeploy na wijzigingen

### Probleem: Environment variables worden niet geladen

**Oorzaak**: Variabelen niet ingesteld voor Production, of niet geredeployed

**Oplossing**:
1. Check Vercel → Settings → Environment Variables
2. Verifieer dat variabelen zijn ingesteld voor **Production**
3. Redeploy de applicatie
4. Check logs om te zien of variabelen worden geladen

## 📝 Verbeterde Error Logging

De code is nu aangepast om betere error messages te geven. Check de Vercel logs voor:

```
[Checkout] Request received: { plan, interval, currency, ... }
[Checkout] Missing price IDs: { ... details ... }
```

Deze logs helpen je precies te zien welke Price IDs ontbreken.

## ✅ Verificatie Script

Na het toevoegen van environment variables, test:

1. **Lokaal** (met `.env.local`):
   ```bash
   npm run dev
   # Test checkout flow
   ```

2. **Production**:
   - Test op live website
   - Check browser console voor errors
   - Check Vercel logs voor server errors

## 🆘 Nog Steeds Problemen?

Als het probleem blijft bestaan:

1. **Check Stripe Dashboard**:
   - Verifieer dat alle prices **Active** zijn
   - Check of Price IDs correct zijn

2. **Check Vercel Environment Variables**:
   - Verifieer dat alle 8 variabelen bestaan
   - Check dat ze zijn ingesteld voor **Production**
   - Check dat Price IDs correct zijn (geen quotes, geen spaties)

3. **Check Logs**:
   - Vercel Function Logs
   - Browser Console
   - Network Tab

4. **Test met verschillende currencies/intervals**:
   - Test EUR + yearly
   - Test USD + monthly
   - Test EUR + quarterly

---

**Laatste update**: Na implementatie nieuwe Price IDs
