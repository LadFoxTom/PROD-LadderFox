#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';

// All languages from LocaleContext (excluding English)
const ALL_LANGUAGES = ['nl', 'fr', 'es', 'de', 'it', 'pl', 'ro', 'hu', 'el', 'cs', 'pt', 'sv', 'bg', 'da', 'fi', 'sk', 'no', 'hr', 'sr'];

function getAllKeyValuePairs(obj, prefix = '') {
  let pairs = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      pairs.push(...getAllKeyValuePairs(obj[key], fullKey));
    } else {
      pairs.push({ key: fullKey, value: obj[key] });
    }
  }
  
  return pairs;
}

function loadTranslations(lang) {
  const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${lang}:`, error.message);
    return null;
  }
}

// Keys/values that should remain in English (URLs, placeholders, brand names, etc.)
const SHOULD_STAY_ENGLISH = [
  // URLs
  /^https?:\/\//,
  // Placeholders
  /^[•·\*\.]{3,}$/,
  /^you@example\.com$/,
  // Common abbreviations that are often kept in English
  /^(FAQ|CV|PDF|AI|ATS|API|URL|GDPR|CCPA|LGPD)$/i,
  // Brand names
  /^(LadderFox|Stripe|Google|OpenAI|LinkedIn|GitHub)$/i,
  // Email addresses
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Version numbers
  /^v?\d+\.\d+/,
  // Dates in English format
  /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s+\d{4}$/,
];

// Short values that are often kept in English (navigation items, etc.)
const SHORT_ENGLISH_TERMS = [
  'Home', 'Tools', 'Dashboard', 'Tests', 'FAQ', 'CV', 'PDF', 'AI', 'Email', 'Name',
  'Password', 'Login', 'Sign Up', 'Download', 'Save', 'Cancel', 'Delete', 'Edit',
  'Settings', 'Profile', 'Account', 'About', 'Contact', 'Privacy', 'Terms'
];

function shouldIgnore(value) {
  if (typeof value !== 'string') return true;
  
  // Check if it matches patterns that should stay in English
  for (const pattern of SHOULD_STAY_ENGLISH) {
    if (pattern.test(value)) {
      return true;
    }
  }
  
  // Check if it's a very short value that might be a technical term
  if (value.length < 15 && SHORT_ENGLISH_TERMS.includes(value)) {
    return true;
  }
  
  // Check if it's mostly symbols/numbers
  if (value.replace(/[^a-zA-Z]/g, '').length < 3) {
    return true;
  }
  
  return false;
}

function main() {
  console.log('🔍 Checking for untranslated English text in translations...\n');
  console.log('(Excluding URLs, placeholders, brand names, and common technical terms)\n');

  // Load English as reference
  const enData = loadTranslations('en');
  if (!enData) {
    console.error('❌ Could not load English translation file');
    process.exit(1);
  }

  const enPairs = getAllKeyValuePairs(enData);
  const enMap = new Map(enPairs.map(p => [p.key, p.value]));

  const results = [];

  // Check each language
  for (const lang of ALL_LANGUAGES) {
    const langData = loadTranslations(lang);
    if (!langData) {
      continue;
    }

    const langPairs = getAllKeyValuePairs(langData);
    const englishTexts = [];

    for (const pair of langPairs) {
      const enValue = enMap.get(pair.key);
      
      // Skip if key doesn't exist in English
      if (!enValue) continue;
      
      // Skip if it should stay in English
      if (shouldIgnore(pair.value) || shouldIgnore(enValue)) {
        continue;
      }
      
      // Check if translation is identical to English (likely not translated)
      if (pair.value === enValue) {
        // Additional check: if it's a meaningful sentence/phrase (not just a word)
        if (pair.value.length > 10 && pair.value.split(' ').length > 2) {
          englishTexts.push({
            key: pair.key,
            value: pair.value,
            reason: 'identical_to_english'
          });
        }
      }
    }

    if (englishTexts.length > 0) {
      results.push({
        lang,
        count: englishTexts.length,
        examples: englishTexts.slice(0, 15) // First 15 examples
      });
    }
  }

  // Display results
  if (results.length === 0) {
    console.log('✅ No untranslated English text found!');
    process.exit(0);
  }

  console.log('⚠️  Languages with untranslated English text:\n');
  console.log('Language | Count | Status');
  console.log('---------|-------|--------');

  for (const result of results) {
    const status = result.count > 100 ? '🔴 Many' : result.count > 50 ? '🟡 Some' : '🟢 Few';
    console.log(`${result.lang.padEnd(8)} | ${String(result.count).padStart(5)} | ${status}`);
  }

  console.log('\n\n📋 Detailed Examples:\n');
  for (const result of results) {
    console.log(`\n${result.lang.toUpperCase()} (${result.lang}) - ${result.count} untranslated entries:\n`);
    
    result.examples.forEach((entry, idx) => {
      console.log(`  ${idx + 1}. ${entry.key}`);
      console.log(`     "${entry.value}"`);
    });
    
    if (result.count > result.examples.length) {
      console.log(`\n     ... and ${result.count - result.examples.length} more`);
    }
  }

  console.log('\n\n📊 Summary:');
  const total = results.reduce((sum, r) => sum + r.count, 0);
  console.log(`  Total untranslated entries: ${total}`);
  console.log(`  Languages needing translation: ${results.length}/${ALL_LANGUAGES.length}`);
  
  // Sort by count
  const sorted = results.sort((a, b) => b.count - a.count);
  console.log('\n  Priority order (most to least):');
  sorted.forEach((r, idx) => {
    console.log(`    ${idx + 1}. ${r.lang} (${r.count} entries)`);
  });
  
  process.exit(1);
}

main();
