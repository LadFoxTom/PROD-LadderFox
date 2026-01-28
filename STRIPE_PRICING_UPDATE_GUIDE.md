# Stripe Pricing Update Guide

## Nieuwe Prijsstructuur

De prijsstructuur is aangepast naar:
- **7 dagen trial**: €3.99 (eenmalige betaling) - **geldt voor alle intervals**
- **Maandelijks**: €14.99/maand (na trial)
- **Kwartaal**: €35.97 per 3 maanden (€11.99/maand, 20% korting) - **met 7-dagen trial**
- **Jaar**: €83.88 per jaar (€6.99/maand, 53% korting) - **met 7-dagen trial**

## Stap-voor-stap Instructies voor Stripe Dashboard

### Stap 1: Maak Nieuwe Trial Setup Fee Price (EUR)

1. Ga naar **Stripe Dashboard** → **Products** → **Basic Plan**
2. Klik op **"Add another price"** of **"Add price"**
3. Configureer de nieuwe price:
   - **Price description**: "7-day trial setup fee (EUR)"
   - **Pricing model**: Standard pricing
   - **Price**: €3.99
   - **Billing period**: One time
   - **Currency**: EUR
4. Klik op **"Add price"**
5. **Kopieer de Price ID** (begint met `price_`) - dit is je nieuwe `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR`

### Stap 2: Maak Nieuwe Trial Setup Fee Price (USD)

1. Herhaal Stap 1, maar gebruik:
   - **Price**: $4.99
   - **Currency**: USD
   - **Price description**: "7-day trial setup fee (USD)"
2. **Kopieer de Price ID** - dit is je nieuwe `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD`

### Stap 3: Update Maandelijkse Price (EUR)

1. Ga naar je bestaande **Monthly EUR price** in het Basic Plan product
2. Klik op de price om deze te bewerken
3. **BELANGRIJK**: Je kunt de prijs van een bestaande price NIET wijzigen in Stripe
4. Je hebt twee opties:

   **Optie A: Maak een nieuwe price en archiveer de oude (AANBEVOLEN)**
   - Maak een nieuwe price: €14.99/maand (recurring, EUR)
   - Archiveer de oude price (niet verwijderen, anders verlies je historische data)
   - Kopieer de nieuwe Price ID
   - Update `STRIPE_BASIC_MONTHLY_PRICE_ID_EUR` in je `.env` bestand

   **Optie B: Gebruik de bestaande price (alleen als deze al €14.99 is)**
   - Als je bestaande price al €14.99 is, hoef je niets te doen
   - Gebruik de bestaande Price ID

### Stap 4: Update Maandelijkse Price (USD)

1. Herhaal Stap 3 voor USD:
   - Nieuwe price: $18.99/maand (recurring, USD)
   - Update `STRIPE_BASIC_MONTHLY_PRICE_ID_USD` in je `.env` bestand

### Stap 5: Update Kwartaal Price (EUR)

1. Ga naar je bestaande **Quarterly EUR price**
2. Maak een nieuwe price:
   - **Price**: €35.97
   - **Billing period**: Every 3 months (recurring)
   - **Currency**: EUR
   - **Price description**: "Quarterly plan (EUR) - €11.99/month with 7-day trial"
3. Archiveer de oude quarterly price
4. Kopieer de nieuwe Price ID
5. Update `STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR` in je `.env` bestand
6. **BELANGRIJK**: Deze price wordt gebruikt met een 7-day trial period in de checkout

### Stap 6: Update Kwartaal Price (USD)

1. Herhaal Stap 5 voor USD:
   - **Price**: $45.99
   - **Billing period**: Every 3 months (recurring)
   - **Currency**: USD
   - **Price description**: "Quarterly plan (USD) - $15.33/month with 7-day trial"
2. Update `STRIPE_BASIC_QUARTERLY_PRICE_ID_USD` in je `.env` bestand
3. **BELANGRIJK**: Deze price wordt gebruikt met een 7-day trial period in de checkout

### Stap 7: Update Jaarlijkse Price (EUR)

1. Ga naar je bestaande **Yearly EUR price**
2. Maak een nieuwe price:
   - **Price**: €83.88
   - **Billing period**: Every year (recurring)
   - **Currency**: EUR
   - **Price description**: "Yearly plan (EUR) - €6.99/month with 7-day trial"
3. Archiveer de oude yearly price
4. Kopieer de nieuwe Price ID
5. Update `STRIPE_BASIC_YEARLY_PRICE_ID_EUR` in je `.env` bestand
6. **BELANGRIJK**: Deze price wordt gebruikt met een 7-day trial period in de checkout

### Stap 8: Update Jaarlijkse Price (USD)

1. Herhaal Stap 7 voor USD:
   - **Price**: $107.99
   - **Billing period**: Every year (recurring)
   - **Currency**: USD
   - **Price description**: "Yearly plan (USD) - $9.00/month with 7-day trial"
2. Update `STRIPE_BASIC_YEARLY_PRICE_ID_USD` in je `.env` bestand
3. **BELANGRIJK**: Deze price wordt gebruikt met een 7-day trial period in de checkout

## Environment Variables Update

Update je `.env.local` of productie environment variables met de nieuwe Price IDs:

```env
# Basic Plan Prices - EUR
STRIPE_BASIC_MONTHLY_PRICE_ID_EUR="price_xxxxx"  # €14.99/maand
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR="price_xxxxx"  # €3.99 (eenmalig)
STRIPE_BASIC_QUARTERLY_PRICE_ID_EUR="price_xxxxx"  # €37.00 per 3 maanden
STRIPE_BASIC_YEARLY_PRICE_ID_EUR="price_xxxxx"  # €149.00 per jaar

# Basic Plan Prices - USD
STRIPE_BASIC_MONTHLY_PRICE_ID_USD="price_xxxxx"  # $18.99/maand
STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_USD="price_xxxxx"  # $4.99 (eenmalig)
STRIPE_BASIC_QUARTERLY_PRICE_ID_USD="price_xxxxx"  # $46.99 per 3 maanden
STRIPE_BASIC_YEARLY_PRICE_ID_USD="price_xxxxx"  # $189.99 per jaar
```

## Belangrijke Opmerkingen

### Bestaande Abonnementen
- **Bestaande klanten** blijven op hun huidige prijs totdat ze upgraden/downgraden
- Stripe wijzigt automatisch de prijs wanneer een abonnement wordt gewijzigd
- Nieuwe klanten krijgen automatisch de nieuwe prijzen

### Trial Setup Fee
- De trial setup fee (€3.99) is een **eenmalige betaling** (one-time payment)
- Dit wordt gecombineerd met de subscription price in de checkout voor **alle intervals** (monthly, quarterly, yearly)
- De subscription heeft een 7-day trial period, waarna automatisch de gekozen interval prijs wordt afgeschreven:
  - Monthly: €14.99/maand
  - Quarterly: €35.97 per 3 maanden (€11.99/maand)
  - Yearly: €83.88 per jaar (€6.99/maand)

### Testen
1. Test de nieuwe trial flow met een test card: `4242 4242 4242 4242`
2. Verifieer voor **elke interval** (monthly, quarterly, yearly) dat:
   - De trial setup fee correct wordt afgeschreven (€3.99)
   - De subscription een 7-day trial heeft
   - Na de trial automatisch de juiste prijs wordt afgeschreven:
     - Monthly: €14.99/maand
     - Quarterly: €35.97 per 3 maanden
     - Yearly: €83.88 per jaar
3. Test alle billing intervals (monthly, quarterly, yearly)
4. Test beide currencies (EUR en USD)

### Archiveren vs Verwijderen
- **Archiveer** oude prices, verwijder ze NIET
- Gearchiveerde prices blijven beschikbaar voor historische data
- Nieuwe subscriptions kunnen geen gearchiveerde prices gebruiken
- Bestaande subscriptions blijven werken met gearchiveerde prices

## Checklist

- [ ] Trial setup fee price EUR aangemaakt
- [ ] Trial setup fee price USD aangemaakt
- [ ] Maandelijkse price EUR geüpdatet (nieuwe price of bestaande gebruikt)
- [ ] Maandelijkse price USD geüpdatet
- [ ] Kwartaal price EUR geüpdatet
- [ ] Kwartaal price USD geüpdatet
- [ ] Jaarlijkse price EUR geüpdatet
- [ ] Jaarlijkse price USD geüpdatet
- [ ] Oude prices gearchiveerd (niet verwijderd)
- [ ] Environment variables geüpdatet
- [ ] Test checkout flow met trial
- [ ] Test checkout flow met quarterly
- [ ] Test checkout flow met yearly
- [ ] Verifieer webhook events worden correct ontvangen

## Troubleshooting

### Price ID niet gevonden
- Controleer of de Price ID correct is gekopieerd (begint met `price_`)
- Verifieer dat de price niet gearchiveerd is voor nieuwe subscriptions
- Controleer of de currency overeenkomt (EUR vs USD)

### Trial wordt niet toegepast
- Controleer of `STRIPE_BASIC_TRIAL_SETUP_FEE_PRICE_ID_EUR/USD` correct is ingesteld
- Verifieer de checkout session configuratie in `src/lib/stripe.ts`
- Controleer webhook events voor trial_start en trial_end

### Verkeerde prijs wordt getoond
- Clear browser cache
- Controleer of environment variables correct zijn geladen
- Verifieer dat de code de juiste price IDs gebruikt

## Support

Voor vragen over Stripe pricing:
- [Stripe Pricing Documentation](https://stripe.com/docs/billing/prices-guide)
- [Stripe Support](https://support.stripe.com)
