# Motivatiebrief Functionaliteit Fix

## Probleem
De applicatie herkende het Nederlandse keyword "motivatiebrief" niet correct. Wanneer gebruikers vroegen om een motivatiebrief te maken, bleef de applicatie op de CV tab in plaats van naar de Letter tab te switchen.

## Oplossing

### 1. Backend API Updates (`src/app/api/cv-chat-agent/stream/route.ts`)

#### Verbeterde Cover Letter Detectie
Toegevoegde Nederlandse keywords in `isCoverLetterRequest()`:
- `motivatiebrief`
- `sollicitatiebrief`
- `maak een motivatiebrief`
- `schrijf een motivatiebrief`
- `maak motivatiebrief`
- `schrijf motivatiebrief`
- `creëer motivatiebrief`
- `genereer motivatiebrief`
- `opstellen motivatiebrief`
- `brief schrijven`
- `brief voor`
- `brief maken`

#### Nederlandse Respons
De API detecteert nu automatisch of de gebruiker Nederlands gebruikt en geeft dan:
- Nederlandse bevestigingstekst
- Nederlandse instructies
- Verwijzing naar het Letter tabblad in het Nederlands

#### Nederlandse Letter Generatie
De `generateCoverLetter()` functie:
- Detecteert de taal van het verzoek
- Gebruikt Nederlandse prompts voor GPT-4 bij Nederlandse verzoeken
- Genereert de gehele motivatiebrief in het Nederlands
- Bevat Nederlandse fallback teksten bij errors

### 2. Frontend Updates (`src/app/page.tsx`)

#### Verbeterde Artifact Type Detectie
De `detectArtifactType()` functie:
- Controleert nu **EERST** op letter keywords (hogere prioriteit)
- Ondersteunt dezelfde Nederlandse keywords als de backend
- Switcht automatisch naar de Letter tab bij detectie

#### Prioriteit Volgorde
Nieuwe volgorde voor artifact type detectie:
1. **Letter keywords** (hoogste prioriteit) ← NIEUW
2. CV keywords
3. Job keywords

Dit voorkomt dat "cv" in de gebruikersinput de motivatiebrief detectie overschrijft.

## Ondersteunde Nederlandse Uitdrukkingen

De volgende Nederlandse zinnen worden nu correct herkend:

✅ "Maak een motivatiebrief"
✅ "Schrijf een motivatiebrief"
✅ "Maak motivatiebrief op basis van mijn CV"
✅ "Genereer een sollicitatiebrief"
✅ "Help me met een motivatiebrief"
✅ "Schrijf brief voor deze vacature"
✅ "Maak een brief op basis van..."
✅ "Opstellen motivatiebrief"

## Hoe het Werkt

1. **Gebruiker vraagt om motivatiebrief** (Nederlands of Engels)
2. **Frontend detecteert** letter intent en switcht naar Letter tab
3. **Backend API detecteert** cover letter verzoek
4. **GPT-4 genereert** brief in de juiste taal (Nederlands of Engels)
5. **API retourneert**:
   - `artifactType: 'letter'` → zorgt dat frontend op Letter tab blijft
   - `letterUpdates: {...}` → bevat de gegenereerde brief
   - `response: "..."` → bevestigingstekst in de juiste taal
6. **Frontend toont** de motivatiebrief in het Letter tabblad

## Testing

### Test Scenarios

#### Scenario 1: Basis Nederlands Verzoek
```
Input: "Maak een motivatiebrief"
Expected: 
- Switcht naar Letter tab
- Genereert Nederlandse motivatiebrief
- Toont Nederlandse bevestiging
```

#### Scenario 2: Nederlands met Vacaturetekst
```
Input: "Maak een motivatiebrief op basis van de content op mijn huidige kwaliteiten en hetgeen wat er gevraagd wordt. [vacaturetekst]"
Expected:
- Switcht naar Letter tab
- Analyseert vacaturetekst
- Koppelt CV aan vacature-eisen
- Genereert gepersonaliseerde brief in het Nederlands
```

#### Scenario 3: Engels Verzoek
```
Input: "Create a cover letter"
Expected:
- Switches to Letter tab
- Generates English cover letter
- Shows English confirmation
```

## Technische Details

### API Response Format
```json
{
  "response": "Ik heb een motivatiebrief voor je opgesteld!...",
  "cvUpdates": {},
  "letterUpdates": {
    "opening": "Geachte heer/mevrouw,",
    "body": "Nederlandse brief tekst...",
    "closing": "Met vriendelijke groet,",
    "signature": "Naam van CV",
    "recipientName": "...",
    "companyName": "...",
    "jobTitle": "..."
  },
  "artifactType": "letter"
}
```

### Frontend State Changes
```javascript
// Detecteert motivatiebrief verzoek
const detectedType = detectArtifactType(userText);
if (detectedType === 'letter') {
  setArtifactType('letter'); // Switcht naar Letter tab
}

// Na API response
if (result.artifactType === 'letter' && result.letterUpdates) {
  setLetterData(prev => ({ ...prev, ...result.letterUpdates }));
  setArtifactType('letter'); // Blijft op Letter tab
}
```

## Wijzigingen Overzicht

### Bestanden Gewijzigd
1. `src/app/api/cv-chat-agent/stream/route.ts`
   - `isCoverLetterRequest()` functie uitgebreid met Nederlandse keywords
   - `generateCoverLetter()` functie met taaldetectie en Nederlandse prompts
   - Cover letter response handling met Nederlandse teksten
   - Fallback letters in het Nederlands

2. `src/app/page.tsx`
   - `detectArtifactType()` functie met Nederlandse keywords
   - Prioriteit volgorde aangepast (letter eerst)
   - Bestaande artifact switching logica blijft ongewijzigd

### Geen Breaking Changes
- Bestaande Engels functionaliteit blijft volledig werken
- Backward compatible met alle bestaande features
- Geen database wijzigingen vereist

## Volgende Stappen

Voor verdere verbetering:
1. ✅ Test met echte gebruikers
2. Overweeg toevoegen van meer Nederlandse synoniemen indien nodig
3. Mogelijk uitbreiden naar andere talen (Frans, Duits, etc.)
4. Analytics toevoegen om te tracken welke zoektermen gebruikt worden

## Status
✅ Geïmplementeerd en klaar voor testing
