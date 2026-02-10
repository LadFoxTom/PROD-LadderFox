# Image Processing Feature voor Agent System

## Overzicht

De agent kan nu afbeeldingen lezen en interpreteren. Dit maakt het mogelijk om:
- CV's/resumes uit afbeeldingen te extraheren
- Job postings uit screenshots te analyseren
- Documenten uit afbeeldingen te verwerken
- Visuele informatie te interpreteren voor CV-analyse en job matching

## Technische Implementatie

### 1. Message Interface Uitbreiding

De `Message` interface in `src/lib/state/agent-state.ts` ondersteunt nu zowel tekst als afbeeldingen:

```typescript
export interface Message {
  role: "user" | "assistant" | "system";
  content: string | Array<string | ImageContent>;
  timestamp?: Date;
}
```

### 2. API Endpoints

#### `/api/agents/chat`

Accepteert nu een optionele `images` array in de request body:

```typescript
{
  message: string,           // Optioneel als images aanwezig zijn
  images?: string[],         // Array van image URLs (base64 data URLs of externe URLs)
  sessionId?: string,
  cvId?: string
}
```

**Voorbeeld request:**
```json
{
  "message": "Analyzeer deze CV",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "https://example.com/cv-image.jpg"
  ]
}
```

#### `/api/cv-chat-agent`

Ook uitgebreid met image support:

```typescript
{
  message: string,
  images?: string[],
  cvData: CVData,
  conversationHistory: Array<{ role: string; content: string }>,
  language?: string
}
```

### 3. Vision Model Support

Het systeem gebruikt automatisch een vision-capable model (gpt-4o) wanneer afbeeldingen aanwezig zijn:

- **Met afbeeldingen**: `gpt-4o` (configureerbaar via `OPENAI_VISION_MODEL`)
- **Zonder afbeeldingen**: `gpt-4-turbo-preview` (configureerbaar via `OPENAI_MODEL`)

### 4. Orchestrator Agent

De orchestrator detecteert automatisch afbeeldingen en:
- Gebruikt vision-capable model wanneer nodig
- Analyseert afbeeldingen voor intent classification
- Routeert naar geschikte agents met image context

### 5. Helper Utilities

Nieuwe utility functies in `src/lib/utils/image-processing.ts`:
- `hasImages()` - Check of content afbeeldingen bevat
- `extractText()` - Haal tekst uit message content
- `extractImages()` - Haal afbeeldingen uit message content
- `buildMessageContent()` - Bouw message content met tekst en afbeeldingen
- `isValidImageUrl()` - Valideer image URL format

## Gebruik

### Frontend Implementatie

Om afbeeldingen te sturen naar de agent:

```typescript
// Upload image en converteer naar base64
const file = event.target.files[0];
const reader = new FileReader();
reader.onload = async (e) => {
  const base64Image = e.target?.result as string;
  
  // Stuur naar agent
  const response = await fetch('/api/agents/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "Analyzeer deze CV",
      images: [base64Image],
      sessionId: currentSessionId
    })
  });
};
```

### Ondersteunde Image Formats

- **Base64 Data URLs**: `data:image/jpeg;base64,...`
- **Externe URLs**: `https://example.com/image.jpg`
- **Formats**: JPEG, PNG, GIF, WebP

### Use Cases

1. **CV Extractie uit Afbeelding**
   ```
   User: "Upload CV screenshot"
   Images: [cv-screenshot.jpg]
   → Agent extraheert CV informatie uit de afbeelding
   ```

2. **Job Posting Analyse**
   ```
   User: "Wat vind je van deze vacature?"
   Images: [job-posting-screenshot.png]
   → Agent analyseert de vacature en geeft feedback
   ```

3. **Document Verwerking**
   ```
   User: "Help me met deze sollicitatiebrief"
   Images: [cover-letter-image.jpg]
   → Agent analyseert en geeft suggesties
   ```

## Environment Variables

Optioneel configureerbaar in `.env`:

```env
OPENAI_VISION_MODEL=gpt-4o          # Vision-capable model (default: gpt-4o)
OPENAI_MODEL=gpt-4-turbo-preview     # Standaard model (default: gpt-4-turbo-preview)
```

## Beperkingen

1. **Image Size**: Base64 images kunnen groot zijn. Overweeg externe URLs voor grote bestanden.
2. **API Costs**: Vision models zijn duurder dan tekst-only models.
3. **Processing Time**: Image analyse duurt langer dan tekst-only requests.

## Toekomstige Verbeteringen

- [ ] Image compression voor base64 uploads
- [ ] Batch image processing
- [ ] Image caching mechanisme
- [ ] OCR verbeteringen voor document extractie
- [ ] Multi-page document support

## Troubleshooting

**Probleem**: Images worden niet herkend
- **Oplossing**: Controleer of image URL format correct is (data URL of HTTP(S) URL)

**Probleem**: Vision model wordt niet gebruikt
- **Oplossing**: Controleer `OPENAI_VISION_MODEL` environment variable

**Probleem**: API timeout bij grote images
- **Oplossing**: Compress images vooraf of gebruik externe URLs in plaats van base64
