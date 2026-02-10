#!/usr/bin/env node

/**
 * Script to validate translation files
 * 
 * Checks:
 * - All languages have the same keys
 * - No missing translations
 * - No extra keys
 * - Valid JSON syntax
 * 
 * Usage: node scripts/validate-translations.js
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';
const LANGUAGES = ['en', 'nl', 'fr', 'es', 'de'];

function loadTranslations(lang) {
  const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Translation file not found: ${filePath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Invalid JSON in ${filePath}:`, error.message);
    return null;
  }
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

function main() {
  console.log('🔍 Validating translation files...\n');

  // Load all translations
  const translations = {};
  let hasErrors = false;

  for (const lang of LANGUAGES) {
    translations[lang] = loadTranslations(lang);
    if (!translations[lang]) {
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.log('\n❌ Validation failed due to loading errors.');
    process.exit(1);
  }

  // Get all keys from English (reference)
  const enKeys = Object.keys(translations.en).sort();
  console.log(`📊 English has ${enKeys.length} translation keys\n`);

  // Check each language
  for (const lang of LANGUAGES) {
    if (lang === 'en') continue;

    const langKeys = Object.keys(translations[lang]).sort();
    const missing = enKeys.filter(key => !langKeys.includes(key));
    const extra = langKeys.filter(key => !enKeys.includes(key));

    console.log(`🌐 ${lang.toUpperCase()}:`);
    
    if (missing.length === 0 && extra.length === 0) {
      console.log(`  ✅ Perfect! All ${langKeys.length} keys match English`);
    } else {
      if (missing.length > 0) {
        console.log(`  ⚠️  Missing ${missing.length} keys:`);
        missing.slice(0, 10).forEach(key => {
          console.log(`     - ${key}`);
        });
        if (missing.length > 10) {
          console.log(`     ... and ${missing.length - 10} more`);
        }
      }
      
      if (extra.length > 0) {
        console.log(`  ⚠️  Extra ${extra.length} keys (not in English):`);
        extra.slice(0, 10).forEach(key => {
          console.log(`     - ${key}`);
        });
        if (extra.length > 10) {
          console.log(`     ... and ${extra.length - 10} more`);
        }
      }
      
      hasErrors = true;
    }
    
    console.log('');
  }

  // Check for empty values
  console.log('🔍 Checking for empty values...\n');
  
  for (const lang of LANGUAGES) {
    const emptyKeys = [];
    
    for (const key of Object.keys(translations[lang])) {
      const value = translations[lang][key];
      if (typeof value === 'string' && value.trim() === '') {
        emptyKeys.push(key);
      }
    }
    
    if (emptyKeys.length > 0) {
      console.log(`⚠️  ${lang.toUpperCase()} has ${emptyKeys.length} empty values:`);
      emptyKeys.forEach(key => {
        console.log(`   - ${key}`);
      });
      console.log('');
      hasErrors = true;
    }
  }

  // Summary
  if (hasErrors) {
    console.log('\n❌ Validation failed. Please fix the issues above.');
    process.exit(1);
  } else {
    console.log('\n✅ All translation files are valid and complete!');
  }
}

main();
