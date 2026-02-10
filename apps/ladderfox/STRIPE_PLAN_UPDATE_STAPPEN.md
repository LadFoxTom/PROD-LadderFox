# Stripe Plannen Update - Stap-voor-stap Gids

## 📋 Overzicht

Deze gids helpt je om alle Stripe plannen correct in te stellen en actief te maken. Je hebt de volgende prijzen nodig:

### Vereiste Prijzen (Basic Plan)

| Type | EUR | USD | Opmerking |
|------|-----|-----|-----------|
| **Trial Setup Fee** | €3.99 | $4.99 | Eenmalige betaling (one-time) |
| **Monthly** | €14.99/maand | $18.99/maand | Recurring, na 7-dagen trial |
| **Quarterly** | €35.97 per 3 maanden | $45.99 per 3 maanden | Recurring, na 7-dagen trial |
| **Yearly** | €83.88 per jaar | $107.99 per jaar | Recurring, na 7-dagen trial |

---

## 🎯 Stap 1: Stripe Dashboard Openen

1. Ga naar https://dashboard.stripe.com/
2. **BELANGRIJK**: Zorg dat je in **LIVE mode** bent (toggle rechtsboven)
3. Ga naar **Products** in het linkermenu

---

## 🎯 Stap 2: Product Controleren/Updaten

### 2.1 Bestaand Product Controleren

1. Zoek naar je "Basic Plan" product
2. Als het niet bestaat, klik op **"+ Add product"** en maak aan:
   - **Name**: `Basic Plan`
   - **Description**: `Unlimited CVs, all templates, PDF export, AI assistance`
   - Klik **"Save product"**

### 2.2 Bestaande Prices Controleren

1. Klik op je "Basic Plan" product
2. Bekijk alle bestaande prices
3. **Noteer welke prices al bestaan** en welke je moet toevoegen

---

## 🎯 Stap 3: Trial Setup Fee Prices Aanmaken

### 3.1 Trial Setup Fee - EUR (€3.99)

1. In je Basic Plan product, klik op **"Add another price"** of **"Add price"**
2. Configureer:
   - **Price description**: `7-day trial setup fee (EUR)`
   - **Pricing model**: `Standard pricing`
   - **Price**: `€3.99`
   - **Billing period**: `One time` ⚠️ **BELANGRIJK: One time, niet recurring!**
   - **Currency**: `EUR`
3. Klik **"Add price"**
4. **Kopieer de Price ID** (begint met `price_...`)
   - Dit is je `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR`

### 3.2 Trial Setup Fee - USD ($4.99)

1. Herhaal Stap 3.1, maar gebruik:
   - **Price**: `$4.99`
   - **Currency**: `USD`
   - **Price description**: `7-day trial setup fee (USD)`
2. **Kopieer de Price ID**
   - Dit is je `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD`

---

## 🎯 Stap 4: Monthly Prices Controleren/Updaten

### 4.1 Monthly Price - EUR (€14.99/maand)

1. **Check of je al een Monthly EUR price hebt**
   - Als ja: Controleer of de prijs €14.99 is
   - Als nee of verkeerde prijs: Maak een nieuwe price

2. **Nieuwe price aanmaken**:
   - Klik **"Add another price"**
   - **Price description**: `Monthly plan (EUR) - €14.99/month after 7-day trial`
   - **Pricing model**: `Standard pricing`
   - **Price**: `€14.99`
   - **Billing period**: `Monthly` (recurring)
   - **Currency**: `EUR`
   - Klik **"Add price"**
   - **Kopieer de Price ID** → `STRIPE_BASIC_MONTHLY_PRICE_ID_EUR`

3. **Oude price archiveren** (als je een nieuwe hebt gemaakt):
   - Klik op de oude price
   - Klik op **"Archive"** (niet verwijderen!)
   - Gearchiveerde prices blijven werken voor bestaande subscriptions

### 4.2 Monthly Price - USD ($18.99/maand)

1. Herhaal Stap 4.1 voor USD:
   - **Price**: `$18.99`
   - **Currency**: `USD`
   - **Price description**: `Monthly plan (USD) - $18.99/month after 7-day trial`
   - **Kopieer Price ID** → `STRIPE_BASIC_MONTHLY_PRICE_ID_USD`

---

## 🎯 Stap 5: Quarterly Prices Controleren/Updaten

### 5.1 Quarterly Price - EUR (€35.97 per 3 maanden)

1. **Check of je al een Quarterly EUR price hebt**
   - Als ja: Controleer of de prijs €35.97 is
   - Als nee of verkeerde prijs: Maak een nieuwe price

2. **Nieuwe price aanmaken**:
   - Klik **"Add another price"**
   - **Price description**: `Quarterly plan (EUR) - €35.97 per 3 months (€11.99/month) with 7-day trial`
   - **Pricing model**: `Standard pricing`
   - **Price**: `€35.97`
   - **Billing period**: `Every 3 months` (recurring)
   - **Currency**: `EUR`
   - Klik **"Add price"**
   - **Kopieer de Price ID** → `STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR`

3. **Oude price archiveren** (als je een nieuwe hebt gemaakt)

### 5.2 Quarterly Price - USD ($45.99 per 3 maanden)

1. Herhaal Stap 5.1 voor USD:
   - **Price**: `$45.99`
   - **Currency**: `USD`
   - **Billing period**: `Every 3 months`
   - **Price description**: `Quarterly plan (USD) - $45.99 per 3 months ($15.33/month) with 7-day trial`
   - **Kopieer Price ID** → `STRIPE_BASIC_QUARTERLY_PRICE_ID_USD`

---

## 🎯 Stap 6: Yearly Prices Controleren/Updaten

### 6.1 Yearly Price - EUR (€83.88 per jaar)

1. **Check of je al een Yearly EUR price hebt**
   - Als ja: Controleer of de prijs €83.88 is
   - Als nee of verkeerde prijs: Maak een nieuwe price

2. **Nieuwe price aanmaken**:
   - Klik **"Add another price"**
   - **Price description**: `Yearly plan (EUR) - €83.88 per year (€6.99/month) with 7-day trial`
   - **Pricing model**: `Standard pricing`
   - **Price**: `€83.88`
   - **Billing period**: `Yearly` (recurring)
   - **Currency**: `EUR`
   - Klik **"Add price"**
   - **Kopieer de Price ID** → `STRIPE_BASIC_YEARLY_PRICE_ID_EUR`

3. **Oude price archiveren** (als je een nieuwe hebt gemaakt)

### 6.2 Yearly Price - USD ($107.99 per jaar)

1. Herhaal Stap 6.1 voor USD:
   - **Price**: `$107.99`
   - **Currency**: `USD`
   - **Billing period**: `Yearly`
   - **Price description**: `Yearly plan (USD) - $107.99 per year ($9.00/month) with 7-day trial`
   - **Kopieer Price ID** → `STRIPE_BASIC_YEARLY_PRICE_ID_USD`

---

## 🎯 Stap 7: Alle Prices Actief Maken

1. **Controleer status van alle prices**:
   - Ga door alle prices in je Basic Plan product
   - Zorg dat ze allemaal **"Active"** zijn (niet "Archived")
   - Als een price "Archived" is, kun je deze niet meer activeren
   - Maak in dat geval een nieuwe price aan

2. **Verifieer dat alle prices zichtbaar zijn**:
   - Alle prices moeten zichtbaar zijn in je product
   - Check dat je minimaal deze 8 prices hebt:
     - ✅ Trial Setup Fee EUR
     - ✅ Trial Setup Fee USD
     - ✅ Monthly EUR
     - ✅ Monthly USD
     - ✅ Quarterly EUR
     - ✅ Quarterly USD
     - ✅ Yearly EUR
     - ✅ Yearly USD

---

## 🎯 Stap 8: Environment Variables Updaten

### 8.1 Lokale Environment Variables (.env.local)

Update je `.env.local` bestand met alle Price IDs:

```env
# Basic Plan Prices - EUR
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR="price_xxxxx"  # €14.99/maand
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR="price_xxxxx"  # €3.99 (eenmalig)
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR="price_xxxxx"  # €35.97 per 3 maanden
STRIPE_BASIC_YEARLY_PRICE_ID_EUR="price_xxxxx"  # €83.88 per jaar

# Basic Plan Prices - USD
STRIPE_BASIC_MONTHLY_PRICE_ID_USD="price_xxxxx"  # $18.99/maand
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD="price_xxxxx"  # $4.99 (eenmalig)
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD="price_xxxxx"  # $45.99 per 3 maanden
STRIPE_BASIC_YEARLY_PRICE_ID_USD="price_xxxxx"  # $107.99 per jaar
```

**Let op**: Vervang `price_xxxxx` met je echte Price IDs!

### 8.2 Production Environment Variables (Vercel)

1. Ga naar https://vercel.com/dashboard
2. Selecteer je project
3. Ga naar **Settings** → **Environment Variables**
4. Voeg alle Price IDs toe:

```bash
# Voor elke variabele:
# 1. Klik "Add New"
# 2. Key: STRIPE_BASIC_MONTHLY_PRICE_ID_EUR
# 3. Value: price_xxxxx (plak je Price ID)
# 4. Environment: Production (en Preview/Development als je wilt)
# 5. Klik "Save"
```

**Herhaal voor alle 8 Price IDs:**
- `STRIPE_BASIC_MONTHLY_PRICE_ID_EUR`
- `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR`
- `STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR`
- `STRIPE_BASIC_YEARLY_PRICE_ID_EUR`
- `STRIPE_BASIC_MONTHLY_PRICE_ID_USD`
- `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD`
- `STRIPE_BASIC_QUARTERLY_PRICE_ID_USD`
- `STRIPE_BASIC_YEARLY_PRICE_ID_USD`

### 8.3 Redeploy na Environment Variables Update

Na het toevoegen van environment variables in Vercel:

1. Ga naar **Deployments** in Vercel
2. Klik op de laatste deployment
3. Klik **"Redeploy"** (of push een nieuwe commit)
4. Wacht tot de deployment klaar is

---

## 🎯 Stap 9: Verificatie

### 9.1 Test Checkout Flow

1. **Lokaal testen** (met test keys):
   - Start je development server: `npm run dev`
   - Ga naar `/pricing`
   - Probeer een checkout te starten
   - Gebruik test card: `4242 4242 4242 4242`

2. **Production testen**:
   - Ga naar je live website
   - Test de checkout flow
   - **Let op**: Dit gebruikt echte Stripe, maar je kunt de checkout annuleren

### 9.2 Check Stripe Dashboard

1. Ga naar **Stripe Dashboard** → **Events**
2. Check of er nieuwe events zijn na je test
3. Check of er errors zijn

### 9.3 Check Console Logs

1. In je browser: Open Developer Tools → Console
2. Probeer een checkout te starten
3. Check of er errors zijn

---

## ✅ Checklist

Gebruik deze checklist om te verifiëren dat alles correct is ingesteld:

### Stripe Dashboard
- [ ] Basic Plan product bestaat
- [ ] Trial Setup Fee EUR price aangemaakt (€3.99, one-time)
- [ ] Trial Setup Fee USD price aangemaakt ($4.99, one-time)
- [ ] Monthly EUR price aangemaakt (€14.99, recurring monthly)
- [ ] Monthly USD price aangemaakt ($18.99, recurring monthly)
- [ ] Quarterly EUR price aangemaakt (€35.97, recurring every 3 months)
- [ ] Quarterly USD price aangemaakt ($45.99, recurring every 3 months)
- [ ] Yearly EUR price aangemaakt (€83.88, recurring yearly)
- [ ] Yearly USD price aangemaakt ($107.99, recurring yearly)
- [ ] Alle prices zijn **Active** (niet Archived)
- [ ] Alle Price IDs zijn gekopieerd

### Environment Variables
- [ ] Alle 8 Price IDs zijn toegevoegd aan `.env.local`
- [ ] Alle 8 Price IDs zijn toegevoegd aan Vercel Production
- [ ] Vercel deployment is gereed na environment variables update

### Verificatie
- [ ] Checkout flow werkt lokaal (test mode)
- [ ] Checkout flow werkt in production (live mode)
- [ ] Trial setup fee wordt correct getoond (€3.99/$4.99)
- [ ] Subscription prijzen worden correct getoond
- [ ] Geen errors in browser console
- [ ] Geen errors in Stripe Dashboard Events

---

## 🚨 Troubleshooting

### Probleem: "Trial pricing not configured for this currency"

**Oorzaak**: Trial setup fee Price ID ontbreekt of is incorrect

**Oplossing**:
1. Check of `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR` (of USD) bestaat
2. Check of de Price ID correct is gekopieerd
3. Check of de price **Active** is in Stripe Dashboard

### Probleem: "Price not found for the selected plan, interval, and currency"

**Oorzaak**: Price ID ontbreekt voor deze combinatie

**Oplossing**:
1. Check of de juiste environment variable bestaat
2. Check of de Price ID correct is in Vercel
3. Redeploy na het toevoegen van environment variables

### Probleem: Price is "Archived" in Stripe

**Oorzaak**: Oude price is gearchiveerd

**Oplossing**:
1. Je kunt een gearchiveerde price niet meer activeren
2. Maak een nieuwe price aan met dezelfde prijs
3. Update de environment variable met de nieuwe Price ID
4. Redeploy

### Probleem: Verkeerde prijs wordt getoond

**Oorzaak**: Oude Price ID wordt nog gebruikt

**Oplossing**:
1. Check of je de nieuwste Price IDs hebt gebruikt
2. Clear browser cache
3. Check of environment variables correct zijn geladen
4. Redeploy

---

## 📞 Hulp Nodig?

Als je problemen hebt:

1. **Check Stripe Dashboard** → Events voor errors
2. **Check Vercel Logs** voor server errors
3. **Check Browser Console** voor client errors
4. **Verifieer alle Price IDs** zijn correct gekopieerd

---

## 🎉 Klaar!

Als alle stappen zijn doorlopen en de checklist is afgevinkt, zijn je Stripe plannen klaar voor gebruik!

**Belangrijke opmerkingen:**
- Bestaande subscriptions blijven werken met oude prices
- Nieuwe klanten krijgen automatisch de nieuwe prijzen
- Trial setup fee (€3.99/$4.99) wordt eenmalig afgeschreven
- Na 7 dagen trial wordt automatisch de gekozen interval prijs afgeschreven
