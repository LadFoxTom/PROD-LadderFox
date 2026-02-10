# 🌐 Translation Management Guide

## Overzicht

LadderFox gebruikt een **JSON-gebaseerd vertaalsysteem** dat het gemakkelijk maakt om nieuwe talen toe te voegen en bestaande vertalingen te updaten. Deze guide legt uit hoe je vertalingen beheert en nieuwe talen toevoegt.

---

## 📁 Bestandsstructuur

```
src/
├── translations/
│   ├── en.json          # Engels (standaard)
│   ├── nl.json          # Nederlands
│   ├── fr.json          # Frans
│   ├── es.json          # Spaans
│   └── de.json          # Duits
├── context/
│   └── LocaleContext.tsx # Taalcontext en detectie
└── components/
    └── LanguageSwitcher.tsx # Taal wissel component
```

---

## 🎯 Hoe Vertalingen Werken

### 1. Translation Keys

Alle teksten worden opgeslagen met **hierarchische keys**:

```json
{
  "auth.login": "Login",
  "auth.signup": "Sign Up",
  "auth.welcome_back": "Welcome back",
  "auth.error.fill_fields": "Please fill in all fields"
}
```

**Naming Convention:**
- Gebruik punt-notatie voor hiërarchie: `section.subsection.key`
- Gebruik underscores voor multi-word keys: `welcome_back`
- Groepeer gerelateerde keys: `auth.*`, `landing.*`, `pricing.*`

### 2. Gebruik in Components

```typescript
import { useLocale } from '@/context/LocaleContext';

export default function MyComponent() {
  const { t } = useLocale();
  
  return (
    <div>
      <h1>{t('auth.welcome_back')}</h1>
      <button>{t('auth.login')}</button>
    </div>
  );
}
```

---

## ✅ Wat WEL Vertalen

### UI Elementen
- ✅ Buttons: "Login", "Sign Up", "Download"
- ✅ Labels: "Email", "Password", "Name"
- ✅ Headings: "Welcome back", "Create your account"
- ✅ Descriptions: "Start building professional CVs"
- ✅ Error messages: "Please fill in all fields"
- ✅ Success messages: "Account created successfully"
- ✅ Placeholders: "you@example.com", "Your name"
- ✅ Navigation: "Home", "About", "Pricing"
- ✅ Form validation: "Password must be at least 8 characters"

### Content
- ✅ Marketing copy: Hero text, feature descriptions
- ✅ Help text: Tooltips, instructions
- ✅ Toast notifications: Success/error messages
- ✅ Modal content: Titles, descriptions, buttons

---

## ❌ Wat NIET Vertalen

### Technisch
- ❌ API endpoints: `/api/auth/login`
- ❌ Environment variables: `NEXT_PUBLIC_APP_URL`
- ❌ Class names: `bg-blue-500`, `text-white`
- ❌ Console logs: `console.log('User logged in')`
- ❌ Error codes: `AUTH_001`, `ERR_INVALID_TOKEN`

### Data
- ❌ User-generated content: CV data, names, addresses
- ❌ Database values: IDs, slugs, technical identifiers
- ❌ Email addresses: `support@ladderfox.com`
- ❌ URLs: `https://www.ladderfox.com`

### Brand
- ❌ Product name: "LadderFox" (blijft altijd hetzelfde)
- ❌ Feature names: Als ze branded zijn (bijv. "LadderFox AI")
- ❌ Template names: "Modern", "Professional" (kunnen optioneel vertaald)

---

## 🆕 Nieuwe Taal Toevoegen

### Stap 1: Maak Translation File

Kopieer `en.json` naar een nieuw bestand:

```bash
cp src/translations/en.json src/translations/it.json
```

### Stap 2: Vertaal Alle Keys

Open `it.json` en vertaal alle values (niet de keys!):

```json
{
  "auth.login": "Accedi",
  "auth.signup": "Registrati",
  "auth.welcome_back": "Bentornato"
}
```

### Stap 3: Update LocaleContext

Voeg de nieuwe taal toe aan `src/context/LocaleContext.tsx`:

```typescript
// 1. Update type
type Language = 'en' | 'nl' | 'fr' | 'es' | 'de' | 'it'

// 2. Import translation file
import it from '@/translations/it.json'

// 3. Add to translations object
const translations: Record<Language, Record<string, any>> = {
  en,
  nl,
  fr,
  es,
  de,
  it  // ✅ Nieuw
}

// 4. Add to available languages
const availableLanguages = [
  { code: 'en' as Language, name: 'English' },
  { code: 'nl' as Language, name: 'Nederlands' },
  { code: 'fr' as Language, name: 'Français' },
  { code: 'es' as Language, name: 'Español' },
  { code: 'de' as Language, name: 'Deutsch' },
  { code: 'it' as Language, name: 'Italiano' }  // ✅ Nieuw
]
```

### Stap 4: Test de Nieuwe Taal

```javascript
// In browser console:
localStorage.setItem('language', 'it')
location.reload()
```

---

## 🔧 Bestaande Vertalingen Updaten

### Methode 1: Direct in JSON

Open het JSON bestand en update de value:

```json
{
  "auth.login": "Log in"  // Was: "Login"
}
```

### Methode 2: Bulk Update Script

Voor grote updates, gebruik een script:

```javascript
// scripts/update-translations.js
const fs = require('fs');

const languages = ['en', 'nl', 'fr', 'es', 'de'];
const newKeys = {
  'auth.reset_success': {
    en: 'Password reset successfully!',
    nl: 'Wachtwoord succesvol gereset!',
    fr: 'Mot de passe réinitialisé avec succès!',
    es: '¡Contraseña restablecida con éxito!',
    de: 'Passwort erfolgreich zurückgesetzt!'
  }
};

languages.forEach(lang => {
  const path = `./src/translations/${lang}.json`;
  const translations = JSON.parse(fs.readFileSync(path, 'utf8'));
  
  Object.keys(newKeys).forEach(key => {
    translations[key] = newKeys[key][lang];
  });
  
  fs.writeFileSync(path, JSON.stringify(translations, null, 2));
});
```

---

## 🔍 Ontbrekende Vertalingen Vinden

### Console Warnings

De app logt automatisch ontbrekende keys:

```
⚠️ Translation key not found: auth.new_feature
```

### Validation Script

Maak een script om ontbrekende keys te vinden:

```javascript
// scripts/validate-translations.js
const fs = require('fs');

const en = JSON.parse(fs.readFileSync('./src/translations/en.json', 'utf8'));
const nl = JSON.parse(fs.readFileSync('./src/translations/nl.json', 'utf8'));

const enKeys = Object.keys(en);
const nlKeys = Object.keys(nl);

const missing = enKeys.filter(key => !nlKeys.includes(key));
const extra = nlKeys.filter(key => !enKeys.includes(key));

console.log('Missing in NL:', missing);
console.log('Extra in NL:', extra);
```

---

## 📝 Best Practices

### 1. Consistentie

**✅ Goed:**
```json
{
  "auth.login": "Login",
  "auth.signup": "Sign Up",
  "auth.logout": "Logout"
}
```

**❌ Slecht:**
```json
{
  "auth.login": "Login",
  "signUp": "Sign Up",
  "auth_logout": "Logout"
}
```

### 2. Context in Keys

**✅ Goed:**
```json
{
  "button.save": "Save",
  "button.cancel": "Cancel",
  "message.save_success": "Saved successfully"
}
```

**❌ Slecht:**
```json
{
  "save": "Save",
  "cancel": "Cancel",
  "success": "Saved successfully"
}
```

### 3. Variabelen in Tekst

Voor dynamische waarden, gebruik placeholders:

```json
{
  "welcome.greeting": "Welcome, {name}!",
  "email.sent_to": "Email sent to {email}"
}
```

Gebruik in code:

```typescript
t('welcome.greeting').replace('{name}', user.name)
// Of met een helper functie:
t('welcome.greeting', { name: user.name })
```

### 4. Pluralisatie

Voor talen met verschillende meervoudsvormen:

```json
{
  "items.count.zero": "No items",
  "items.count.one": "1 item",
  "items.count.other": "{count} items"
}
```

### 5. Lange Teksten

Voor lange teksten, gebruik arrays of splits in delen:

```json
{
  "about.mission.paragraph1": "First paragraph...",
  "about.mission.paragraph2": "Second paragraph...",
  "about.mission.paragraph3": "Third paragraph..."
}
```

---

## 🚀 LLM Responses Vertalen

Voor AI-gegenereerde content, stuur de taal mee in de API call:

```typescript
const response = await fetch('/api/cv-chat-agent/stream', {
  method: 'POST',
  body: JSON.stringify({
    message: userMessage,
    language: language,  // 'nl', 'en', etc.
  })
});
```

In de API route:

```typescript
const languageMap: Record<string, string> = {
  en: 'English',
  nl: 'Dutch',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
};

const prompt = `You MUST respond in ${languageMap[language] || 'English'}.
All your responses, including explanations and generated content, should be in this language.

${userMessage}`;
```

---

## 🐛 Troubleshooting

### Probleem: Vertaling wordt niet getoond

**Oplossing:**
1. Check of de key bestaat in het JSON bestand
2. Check console voor warnings
3. Verify dat `useLocale()` wordt gebruikt
4. Clear browser cache en localStorage

### Probleem: Verkeerde taal wordt gedetecteerd

**Oplossing:**
```javascript
// Check browser language
console.log(navigator.language)

// Force specific language
localStorage.setItem('language', 'nl')
location.reload()
```

### Probleem: Nieuwe keys werken niet

**Oplossing:**
1. Restart development server
2. Check JSON syntax (geen trailing commas!)
3. Verify import in `LocaleContext.tsx`

---

## 📊 Translation Coverage

Houd bij welke delen van de app vertaald zijn:

| Sectie | EN | NL | FR | ES | DE |
|--------|----|----|----|----|-----|
| Auth Pages | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Landing Page | ✅ | ✅ | ❌ | ❌ | ❌ |
| CV Builder | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pricing | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ Volledig vertaald
- ⚠️ Gedeeltelijk vertaald
- ❌ Nog niet vertaald

---

## 🎓 Voorbeelden

### Voorbeeld 1: Auth Page

```typescript
// src/app/auth/login/page.tsx
import { useLocale } from '@/context/LocaleContext';

export default function LoginPage() {
  const { t } = useLocale();
  
  return (
    <div>
      <h1>{t('auth.welcome_back')}</h1>
      <p>{t('auth.sign_in_subtitle')}</p>
      
      <form>
        <label>{t('auth.email')}</label>
        <input placeholder={t('auth.placeholder.email')} />
        
        <label>{t('auth.password')}</label>
        <input placeholder={t('auth.placeholder.password')} />
        
        <button>{t('auth.sign_in')}</button>
      </form>
      
      <Link href="/auth/forgot-password">
        {t('auth.forgot_password')}
      </Link>
    </div>
  );
}
```

### Voorbeeld 2: Toast Messages

```typescript
import { toast } from 'react-hot-toast';
import { useLocale } from '@/context/LocaleContext';

export default function MyComponent() {
  const { t } = useLocale();
  
  const handleSave = async () => {
    try {
      await saveData();
      toast.success(t('messages.save_success'));
    } catch (error) {
      toast.error(t('messages.save_error'));
    }
  };
}
```

### Voorbeeld 3: Dynamische Content

```typescript
const { t } = useLocale();

// Met placeholder
const message = t('email.sent_to').replace('{email}', userEmail);

// Met meerdere placeholders
const greeting = t('welcome.full_greeting')
  .replace('{name}', userName)
  .replace('{time}', currentTime);
```

---

## 📚 Resources

- **i18n Best Practices**: https://www.i18next.com/principles/best-practices
- **React Internationalization**: https://react.i18next.com/
- **Translation Tools**: 
  - DeepL: https://www.deepl.com/translator
  - Google Translate: https://translate.google.com/
  - Lokalise: https://lokalise.com/ (voor teams)

---

## 🤝 Bijdragen

Wil je helpen met vertalingen?

1. Fork de repository
2. Voeg/update vertalingen in `src/translations/`
3. Test lokaal met `localStorage.setItem('language', 'xx')`
4. Maak een Pull Request

**Vertaal Checklist:**
- [ ] Alle keys uit `en.json` zijn vertaald
- [ ] Geen hardcoded teksten in components
- [ ] Placeholders zijn behouden (`{name}`, `{email}`)
- [ ] Toon is consistent (formeel/informeel)
- [ ] Getest in browser

---

## 📞 Contact

Voor vragen over vertalingen:
- Email: info@ladderfox.com
- GitHub Issues: [github.com/ladderfox/issues](https://github.com/ladderfox/issues)

---

**Laatste update:** Januari 2026
**Versie:** 1.0
