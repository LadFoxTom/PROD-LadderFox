# 🚀 Vercel Environment Variables - Quick Reference

## Nieuwe Stripe Price IDs voor Vercel

Kopieer en plak deze environment variables in Vercel Dashboard → Settings → Environment Variables

**Selecteer "Production" environment voor alle variabelen!**

```bash
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR=price_1SwTnNAXNBtmQqIKukubdg5h
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR=price_1SwTkjAXNBtmQqIKfzQ6sRU3
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR=price_1SwTo9AXNBtmQqIKeokbUpea
STRIPE_BASIC_YEARLY_PRICE_ID_EUR=price_1SwTosAXNBtmQqIKkOESuWml
STRIPE_BASIC_MONTHLY_PRICE_ID_USD=price_1SwTnnAXNBtmQqIKMabZ0RmJ
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD=price_1SwTlAAXNBtmQqIK9W3qQhIb
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD=price_1SwToNAXNBtmQqIKWsgVABMB
STRIPE_BASIC_YEARLY_PRICE_ID_USD=price_1SwTpAAXNBtmQqIKBVapX4Xp
```

## Stappen voor Vercel

1. Ga naar https://vercel.com/dashboard
2. Selecteer je project
3. Ga naar **Settings** → **Environment Variables**
4. Voor elke variabele hierboven:
   - Klik **"Add New"**
   - Plak de **Key** (bijv. `STRIPE_BASIC_MONTHLY_PRICE_ID_EUR`)
   - Plak de **Value** (bijv. `price_1SwTnNAXNBtmQqIKukubdg5h`)
   - Selecteer **Production** (en optioneel Preview/Development)
   - Klik **"Save"**
5. **BELANGRIJK**: Na het toevoegen, ga naar **Deployments** en klik **"Redeploy"** op de laatste deployment

## Verificatie

Na het toevoegen en redeployen:
- ✅ Test de checkout flow op je live website
- ✅ Check Stripe Dashboard → Events voor errors
- ✅ Verifieer dat trial setup fee (€3.99/$4.99) wordt getoond
- ✅ Verifieer dat subscription prijzen correct zijn
