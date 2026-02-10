# 🔥 Hotjar Setup Guide

## Overzicht

Hotjar is geïmplementeerd om gebruikersgedrag te volgen op de homepage en chat interface. Het werkt perfect met single-page applications (SPAs) zoals jouw Next.js app, zelfs wanneer de chat splitscreen dezelfde URL heeft als de landing page.

## Hoe het werkt

### ✅ Ja, het werkt met dezelfde URL!

Net zoals bij ChatGPT werkt Hotjar prima wanneer:
- De landing page en chat interface dezelfde URL delen (`/`)
- De interface dynamisch verandert zonder page reload
- Je een SPA (Single Page Application) gebruikt

**Waarom?** Hotjar volgt DOM-veranderingen in real-time, niet alleen URL-wijzigingen. Het script blijft actief en detecteert wanneer de interface verandert.

## Implementatie

### 1. Hotjar Component

Het Hotjar script wordt geladen via `src/components/Hotjar.tsx`:
- Laadt alleen in de browser (client-side)
- Controleert of het al geladen is (voorkomt dubbele laad)
- Ondersteunt state tracking voor SPA navigatie

### 2. State Tracking

De homepage (`src/app/page.tsx`) trackt automatisch state changes:
- **Landing page**: `/` (wanneer `isConversationActive === false`)
- **Chat interface**: `/chat-interface` (wanneer `isConversationActive === true`)

Dit zorgt ervoor dat je in Hotjar onderscheid kunt maken tussen:
- Gebruikers die alleen de landing page bekijken
- Gebruikers die de chat interface gebruiken

### 3. Layout Integration

Hotjar wordt geladen in `src/app/layout.tsx`:
- Werkt op alle pagina's
- Alleen actief in productie (of wanneer expliciet enabled)
- Gebruikt environment variable voor Site ID

## Setup

### Stap 1: Hotjar Account

1. Ga naar [Hotjar](https://www.hotjar.com/)
2. Maak een account of log in
3. Maak een nieuwe site voor je project
4. Kopieer je **Site ID** (een nummer, bijv. `1234567`)

### Stap 2: Environment Variables

Voeg toe aan je `.env` bestand:

```env
# Hotjar Site ID (vervang met jouw Site ID)
NEXT_PUBLIC_HOTJAR_SITE_ID="1234567"

# Optioneel: Enable in development (standaard alleen productie)
NEXT_PUBLIC_HOTJAR_ENABLED="false"
```

### Stap 3: Vercel Deployment

Voeg dezelfde variabelen toe in **Vercel Dashboard**:
1. Ga naar je project → **Settings** → **Environment Variables**
2. Voeg toe:
   ```
   NEXT_PUBLIC_HOTJAR_SITE_ID=1234567
   ```
3. Zet voor **Production** environment

### Stap 4: Verificatie

Na deployment:
1. Ga naar je website
2. Open browser DevTools → **Network** tab
3. Zoek naar requests naar `hotjar.com`
4. In Hotjar dashboard zou je binnen enkele minuten sessies moeten zien

## Features

### State Tracking

Hotjar trackt automatisch wanneer gebruikers:
- De landing page bekijken (`/`)
- De chat interface openen (`/chat-interface`)

Dit zie je terug in Hotjar als verschillende "pagina's" in je sessies.

### User Identification (Optioneel)

Je kunt gebruikers identificeren in Hotjar:

```typescript
import { hotjarIdentify } from '@/components/Hotjar';

// Bij login of wanneer je user info hebt
hotjarIdentify(userId, {
  email: user.email,
  plan: subscription.plan,
  // ... andere attributen
});
```

## Privacy & GDPR

Hotjar is GDPR-compliant, maar:
- ✅ Zorg dat je privacy policy Hotjar vermeldt
- ✅ Overweeg een cookie banner (Hotjar gebruikt cookies)
- ✅ Gebruikers kunnen opt-out via Hotjar's opt-out link

## Troubleshooting

### Hotjar laadt niet

1. **Check environment variable**:
   ```bash
   echo $NEXT_PUBLIC_HOTJAR_SITE_ID
   ```

2. **Check browser console** voor errors

3. **Verify in Network tab** dat `hotjar.com` requests worden gemaakt

4. **Development mode**: Zet `NEXT_PUBLIC_HOTJAR_ENABLED="true"` om te testen

### State changes worden niet getrackt

- Zorg dat `hotjarStateChange` wordt aangeroepen wanneer `isConversationActive` verandert
- Check browser console voor Hotjar errors
- Wacht enkele seconden - state changes kunnen vertraging hebben

## Best Practices

1. **Test eerst in development** met `NEXT_PUBLIC_HOTJAR_ENABLED="true"`
2. **Monitor performance** - Hotjar heeft minimale impact, maar check het
3. **Respect privacy** - gebruik geen persoonlijke data in tracking
4. **Review regelmatig** - bekijk sessies om UX te verbeteren

## Support

- [Hotjar Documentation](https://help.hotjar.com/)
- [Hotjar API Reference](https://help.hotjar.com/hc/en-us/articles/115011639927-Using-the-Hotjar-Tracking-Code)

---

**Klaar!** 🎉 Hotjar is nu geïmplementeerd en werkt op zowel de landing page als de chat interface, zelfs met dezelfde URL.
