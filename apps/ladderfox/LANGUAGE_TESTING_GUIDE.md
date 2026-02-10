# 🌐 Language Testing Guide

## How to Test Language Detection

### Method 1: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Look for logs starting with `[LocaleContext]` and `[HomePage]`
4. You should see:
   - Browser language detected
   - Language being set
   - Current language value

### Method 2: Use Debug Component (Development Only)

In development mode, a debug panel appears in the bottom-right corner showing:
- Current Language
- Browser Language
- LocalStorage value
- Test translation

### Method 3: Clear LocalStorage and Test

If you've visited before, your language preference might be saved:

1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `https://www.ladderfox.com`
4. Delete the `language` key
5. Refresh the page
6. The browser language should be detected automatically

### Method 4: Manually Test Language

1. Open browser console (F12)
2. Run this command:
   ```javascript
   localStorage.setItem('language', 'nl')
   ```
3. Refresh the page
4. You should see Dutch translations

### Method 5: Change Browser Language

1. **Chrome/Edge:**
   - Settings → Languages
   - Add "Dutch (Nederlands)" and move it to the top
   - Restart browser

2. **Firefox:**
   - Settings → General → Language
   - Add "Dutch" and move it to the top
   - Restart browser

3. Clear localStorage (see Method 3)
4. Visit the site - should detect Dutch automatically

## Expected Behavior

### First Visit (No localStorage)
- Browser language detected: `nl-NL` → Sets to `nl`
- Interface shows in Dutch
- LLM responds in Dutch

### Subsequent Visits
- Uses saved language from localStorage
- If you want to test detection again, clear localStorage first

## Debugging Checklist

- [ ] Check browser console for `[LocaleContext]` logs
- [ ] Verify `navigator.language` value in console
- [ ] Check localStorage for saved language
- [ ] Verify translations are loaded (check Network tab for JSON files)
- [ ] Test with different browser languages
- [ ] Check if debug component appears (development only)

## Common Issues

### Issue: Always shows English
**Solution:** 
- Check if localStorage has `language: 'en'` saved
- Clear it and refresh
- Check browser language settings

### Issue: Browser language not detected
**Solution:**
- Verify browser language is one of: `en`, `nl`, `fr`, `es`, `de`
- Check console logs for detection errors
- Try manually setting: `localStorage.setItem('language', 'nl')`

### Issue: Translations not showing
**Solution:**
- Check browser console for translation key warnings
- Verify translation files are loaded (Network tab)
- Check if `isHydrated` is `true` in debug component

## Quick Test Commands

Open browser console and run:

```javascript
// Check current language
console.log('Current language:', localStorage.getItem('language'))
console.log('Browser language:', navigator.language)

// Force Dutch
localStorage.setItem('language', 'nl')
location.reload()

// Force English
localStorage.setItem('language', 'en')
location.reload()

// Clear and detect
localStorage.removeItem('language')
location.reload()
```
