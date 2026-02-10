# Test Procedure - Motivatiebrief Functionaliteit

## Doel
Verifiëren dat de applicatie correct reageert op Nederlandse verzoeken om een motivatiebrief te maken en dat deze in de Letter tab wordt getoond.

## Pre-requisites
- ✅ Applicatie draait lokaal of in test omgeving
- ✅ OpenAI API key is geconfigureerd
- ✅ Er is een CV opgeslagen of aanwezig in de sessie

## Test Cases

### Test Case 1: Basis Motivatiebrief Aanvraag (Nederlands)

**Stappen:**
1. Open de applicatie
2. Zorg dat er CV data aanwezig is (maak eerst een CV of laad bestaande)
3. Type in de chat: `Maak een motivatiebrief`
4. Druk op Enter of klik op verzend knop

**Verwacht Resultaat:**
- ✅ De applicatie switcht automatisch naar de "Letter" tab
- ✅ Er verschijnt een Nederlandse bevestigingstekst in de chat
- ✅ De Letter tab toont een gegenereerde motivatiebrief in het Nederlands
- ✅ De motivatiebrief bevat:
  - Opening/begroeting
  - Body met referenties naar CV ervaring
  - Afsluiting
  - Handtekening met naam uit CV

**Bevestigingstekst (Nederlands):**
```
Ik heb een motivatiebrief voor je opgesteld! Je kunt deze bekijken en bewerken in het Letter tabblad. Dit heb ik gemaakt:

**Opening:** [text]

**Belangrijke punten:**
- Je relevante ervaring benadrukt
- Je vaardigheden gekoppeld aan de functie
- Oprechte interesse getoond

**Afsluiting:** Professionele afsluiting met je naam

Je kunt het verder aanpassen in de Editor!
```

---

### Test Case 2: Motivatiebrief met Vacaturetekst (Zoals gemeld door gebruiker)

**Stappen:**
1. Open de applicatie met een bestaand CV
2. Kopieer een vacaturetekst (bijv. van een job posting)
3. Type in de chat: `Maak een motivatiebrief op basis van de content op mijn huidige kwaliteiten en hetgeen wat er gevraagd wordt. [plak vacaturetekst]`
4. Druk op Enter

**Verwacht Resultaat:**
- ✅ De applicatie switcht naar de "Letter" tab (NIET naar CV tab)
- ✅ GPT-4 analyseert de vacaturetekst
- ✅ De gegenereerde brief is specifiek afgestemd op:
  - De gevraagde functie
  - De bedrijfsnaam (indien vermeld)
  - De specifieke vereisten uit de vacature
- ✅ De brief is in het Nederlands
- ✅ De brief bevat concrete matches tussen CV en vacature-eisen

---

### Test Case 3: Alternatieve Nederlandse Formuleringen

Test elk van deze zinnen afzonderlijk:

**Input Varianten:**
```
✅ "Schrijf een motivatiebrief"
✅ "Maak motivatiebrief"
✅ "Genereer een sollicitatiebrief"
✅ "Help me met een motivatiebrief voor deze functie"
✅ "Opstellen motivatiebrief"
✅ "Maak een brief voor deze vacature"
```

**Verwacht voor alle varianten:**
- Letter tab wordt geactiveerd
- Nederlandse motivatiebrief wordt gegenereerd
- Nederlandse bevestiging in chat

---

### Test Case 4: Engels Cover Letter Verzoek

**Stappen:**
1. Type in de chat: `Create a cover letter`
2. Druk op Enter

**Verwacht Resultaat:**
- ✅ Switcht naar Letter tab
- ✅ Genereert ENGELSE cover letter
- ✅ Toont ENGELSE bevestigingstekst:
```
I've drafted a cover letter for you! You can view and edit it in the Letter tab...
```

---

### Test Case 5: Mixed Content (Nederlands + Functie Details)

**Stappen:**
1. Type: `Maak een motivatiebrief voor de functie Software Developer bij Google`
2. Druk op Enter

**Verwacht Resultaat:**
- ✅ Letter tab geactiveerd
- ✅ Brief in het Nederlands
- ✅ Brief vermeldt specifiek:
  - `companyName: "Google"`
  - `jobTitle: "Software Developer"`
  - Aangepaste content voor deze functie

---

### Test Case 6: CV met Vacature Combinatie

**Stappen:**
1. Zorg voor volledig CV met:
   - Naam
   - Ervaring
   - Skills
   - Educatie
2. Plak vacaturetekst met concrete eisen
3. Vraag: `Maak een motivatiebrief die mijn ervaring koppelt aan deze vacature: [vacature]`

**Verwacht Resultaat:**
- ✅ Specifieke matches tussen CV ervaring en vacature-eisen
- ✅ Concrete voorbeelden uit CV
- ✅ Relevante skills genoemd
- ✅ Afstemming op bedrijfscultuur (indien vermeld)

---

## Edge Cases

### Edge Case 1: Zonder CV Data
**Input:** "Maak een motivatiebrief"
**Verwacht:** 
- Fallback letter met generieke content
- Of melding dat CV data nodig is

### Edge Case 2: Zeer Lange Vacaturetekst
**Input:** Motivatiebrief verzoek + 2000+ woorden vacaturetekst
**Verwacht:** 
- Geen timeouts
- Brief samengevat op 300-400 woorden
- Focus op belangrijkste match-punten

### Edge Case 3: API Error
**Verwacht:**
- Fallback naar template letter in correcte taal
- Error handling zonder crash
- Gebruiker kan opnieuw proberen

---

## Verificatie Checklist

Na elke test, verifieer:

### Frontend
- [ ] Letter tab is zichtbaar en actief
- [ ] Letter tab heeft focus (visuele indicator)
- [ ] LetterPreview component toont content
- [ ] Geen console errors in browser DevTools

### API Response
- [ ] `artifactType: 'letter'` aanwezig in response
- [ ] `letterUpdates` object bevat alle velden:
  - [ ] `opening`
  - [ ] `body`
  - [ ] `closing`
  - [ ] `signature`
- [ ] Response taal matcht input taal

### Content Kwaliteit
- [ ] Brief is grammaticaal correct
- [ ] Brief refereert aan concrete CV ervaring
- [ ] Brief is professioneel van toon
- [ ] Brief volgt standaard motivatiebrief structuur
- [ ] Geen placeholders zoals "INSERT NAME HERE"

---

## Debug Tips

### Als Letter tab niet switcht:
1. Open browser DevTools
2. Check console voor errors
3. Kijk in Network tab naar API response:
   - Zoek `/api/cv-chat-agent/stream`
   - Bekijk response body
   - Verifieer `artifactType` waarde

### Als content op CV tab blijft:
1. Check of `isCoverLetterRequest()` functie de input herkent
2. Voeg console.log toe in detectie functie:
```javascript
console.log('[Cover Letter Detection]', {
  message,
  keywords: letterKeywords.filter(kw => lowerMessage.includes(kw)),
  detected: isCoverLetterRequest(message)
});
```

### Als brief in verkeerde taal:
1. Check taaldetectie in `generateCoverLetter()`
2. Verifieer `isDutch` boolean
3. Test met expliciete keywords zoals "motivatiebrief"

---

## Success Criteria

De test is geslaagd als:
- ✅ 6/6 test cases slagen
- ✅ 3/3 edge cases worden correct afgehandeld
- ✅ Alle verificatie checklist items zijn OK
- ✅ Geen console errors of warnings
- ✅ Gebruikerservaring is smooth en intuïtief

---

## Rapportage Template

```
Test Datum: [datum]
Tester: [naam]
Omgeving: [local/uat/prod]

Test Results:
- Test Case 1: ✅ / ❌
- Test Case 2: ✅ / ❌
- Test Case 3: ✅ / ❌
- Test Case 4: ✅ / ❌
- Test Case 5: ✅ / ❌
- Test Case 6: ✅ / ❌

Edge Cases:
- Edge Case 1: ✅ / ❌
- Edge Case 2: ✅ / ❌
- Edge Case 3: ✅ / ❌

Opmerkingen:
[vrije tekst]

Issues Gevonden:
[lijst van bugs/problemen]

Overall Status: PASS / FAIL
```

---

## Volgende Stappen Bij Problemen

Als tests falen:
1. ✅ Check of laatste code changes zijn deployed
2. ✅ Verifieer environment variables (OPENAI_API_KEY)
3. ✅ Bekijk server logs voor errors
4. ✅ Test met simpelste case eerst (Test Case 1)
5. ✅ Bouw op naar complexere cases
6. ✅ Rapporteer issues met screenshots en console logs

---

## Contact

Bij vragen of problemen:
- Check `MOTIVATIEBRIEF_FIX.md` voor technische details
- Bekijk API logs in `/api/cv-chat-agent/stream`
- Review frontend state in React DevTools
