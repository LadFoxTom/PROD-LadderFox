# ✅ Nieuwe Stripe Price IDs - Geïmplementeerd

## 📋 Overzicht

Deze document bevat alle nieuwe Stripe Price IDs die zijn geïmplementeerd in de applicatie.

**Datum**: Januari 2026
**Status**: ✅ Actief

---

## 🎯 Nieuwe Price IDs

### Trial Setup Fees (One-time)

| Currency | Price ID | Prijs | Type |
|----------|----------|-------|------|
| **EUR** | `price_1SwTkjAXNBtmQqIKfzQ6sRU3` | €3.99 | One-time |
| **USD** | `price_1SwTlAAXNBtmQqIK9W3qQhIb` | $4.99 | One-time |

### Monthly Plans (Recurring)

| Currency | Price ID | Prijs | Type |
|----------|----------|-------|------|
| **EUR** | `price_1SwTnNAXNBtmQqIKukubdg5h` | €14.99/maand | Recurring Monthly |
| **USD** | `price_1SwTnnAXNBtmQqIKMabZ0RmJ` | $18.99/maand | Recurring Monthly |

### Quarterly Plans (Recurring)

| Currency | Price ID | Prijs | Type |
|----------|----------|-------|------|
| **EUR** | `price_1SwTo9AXNBtmQqIKeokbUpea` | €35.97 per 3 maanden | Recurring Every 3 Months |
| **USD** | `price_1SwToNAXNBtmQqIKWsgVABMB` | $45.99 per 3 maanden | Recurring Every 3 Months |

### Yearly Plans (Recurring)

| Currency | Price ID | Prijs | Type |
|----------|----------|-------|------|
| **EUR** | `price_1SwTosAXNBtmQqIKkOESuWml` | €83.88 per jaar | Recurring Yearly |
| **USD** | `price_1SwTpAAXNBtmQqIKBVapX4Xp` | $107.99 per jaar | Recurring Yearly |

---

## 🔧 Environment Variables

### Lokale Setup (.env.local)

```env
# Basic Plan Prices - EUR
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR="price_1SwTnNAXNBtmQqIKukubdg5h"
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR="price_1SwTkjAXNBtmQqIKfzQ6sRU3"
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR="price_1SwTo9AXNBtmQqIKeokbUpea"
STRIPE_BASIC_YEARLY_PRICE_ID_EUR="price_1SwTosAXNBtmQqIKkOESuWml"

# Basic Plan Prices - USD
STRIPE_BASIC_MONTHLY_PRICE_ID_USD="price_1SwTnnAXNBtmQqIKMabZ0RmJ"
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD="price_1SwTlAAXNBtmQqIK9W3qQhIb"
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD="price_1SwToNAXNBtmQqIKWsgVABMB"
STRIPE_BASIC_YEARLY_PRICE_ID_USD="price_1SwTpAAXNBtmQqIKBVapX4Xp"
```

### Vercel Production Setup

Voeg deze environment variables toe in Vercel Dashboard:

1. Ga naar **Settings** → **Environment Variables**
2. Voeg elke variabele toe voor **Production** environment:

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

---

## ✅ Implementatie Status

### Code Updates
- ✅ `env.example` geüpdatet met nieuwe Price IDs
- ✅ Code gebruikt automatisch environment variables (geen code wijzigingen nodig)
- ✅ Alle Price IDs zijn correct geformatteerd

### Verificatie Checklist
- [ ] Environment variables toegevoegd aan `.env.local` (lokaal)
- [ ] Environment variables toegevoegd aan Vercel Production
- [ ] Vercel deployment uitgevoerd na environment variables update
- [ ] Test checkout flow met test card: `4242 4242 4242 4242`
- [ ] Verifieer dat trial setup fee correct wordt getoond
- [ ] Verifieer dat subscription prijzen correct worden getoond
- [ ] Check Stripe Dashboard Events voor errors

---

## 🧪 Testen

### Test Checkout Flow

1. **Lokaal testen** (met test keys):
   ```bash
   npm run dev
   ```
   - Ga naar `/pricing`
   - Start checkout met test card: `4242 4242 4242 4242`
   - Verifieer dat trial setup fee (€3.99/$4.99) wordt getoond
   - Verifieer dat subscription prijs correct is

2. **Production testen**:
   - Test op live website
   - **Let op**: Dit gebruikt echte Stripe, maar je kunt checkout annuleren

### Verwachte Gedrag

- **Trial Setup Fee**: €3.99 (EUR) of $4.99 (USD) - eenmalige betaling
- **Na 7 dagen trial**: Automatische afschrijving van gekozen interval:
  - Monthly: €14.99/$18.99 per maand
  - Quarterly: €35.97/$45.99 per 3 maanden
  - Yearly: €83.88/$107.99 per jaar

---

## 📝 Notities

- Alle Price IDs zijn **LIVE** mode (niet test mode)
- Trial setup fee is een **one-time payment** (niet recurring)
- Alle subscription prices zijn **recurring**
- Code gebruikt automatisch de juiste Price ID op basis van:
  - Plan (basic)
  - Interval (monthly, quarterly, yearly)
  - Currency (EUR, USD)

---

## 🔗 Gerelateerde Documenten

- `STRIPE_PLAN_UPDATE_STAPPEN.md` - Stap-voor-stap gids voor Stripe setup
- `STRIPE_SETUP.md` - Algemene Stripe setup documentatie
- `STRIPE_PRICING_UPDATE_GUIDE.md` - Pricing update gids
- `env.example` - Environment variables voorbeeld

---

**Laatste update**: Januari 2026
**Status**: ✅ Actief en geïmplementeerd
