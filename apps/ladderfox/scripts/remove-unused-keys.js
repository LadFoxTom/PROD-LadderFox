#!/usr/bin/env node

/**
 * Script to remove unused extra keys from DE, ES, FR, and NL translation files
 * 
 * Usage: node scripts/remove-unused-keys.js
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';
const BASE_LANGUAGE = 'en';
const TARGET_LANGUAGES = ['de', 'es', 'fr', 'nl'];

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

function saveTranslations(lang, translations) {
  const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  
  try {
    // Write with proper formatting (2 spaces indentation)
    const content = JSON.stringify(translations, null, 2) + '\n';
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to save ${filePath}:`, error.message);
    return false;
  }
}

function getAllKeys(obj) {
  return Object.keys(obj);
}

function main() {
  console.log('🧹 Removing unused extra keys from DE, ES, FR, and NL...\n');

  // Load base language (English)
  const baseTranslations = loadTranslations(BASE_LANGUAGE);
  if (!baseTranslations) {
    console.error('❌ Failed to load base language file.');
    process.exit(1);
  }

  const baseKeys = new Set(getAllKeys(baseTranslations));
  console.log(`📝 Base language (${BASE_LANGUAGE.toUpperCase()}): ${baseKeys.size} keys\n`);

  let totalRemoved = 0;

  // Process each target language
  for (const lang of TARGET_LANGUAGES) {
    const translations = loadTranslations(lang);
    if (!translations) {
      continue;
    }

    const originalKeys = getAllKeys(translations);
    const originalCount = originalKeys.length;

    // Identify keys to remove (keys that don't exist in base language)
    const keysToRemove = originalKeys.filter(key => !baseKeys.has(key));

    if (keysToRemove.length === 0) {
      console.log(`✅ ${lang.toUpperCase()}: No extra keys to remove`);
      continue;
    }

    // Remove the keys
    for (const key of keysToRemove) {
      delete translations[key];
    }

    // Save the cleaned translations
    if (saveTranslations(lang, translations)) {
      const newCount = getAllKeys(translations).length;
      const removed = originalCount - newCount;
      totalRemoved += removed;
      
      console.log(`✅ ${lang.toUpperCase()}: Removed ${removed} unused keys`);
      console.log(`   Before: ${originalCount} keys, After: ${newCount} keys`);
    } else {
      console.log(`❌ ${lang.toUpperCase()}: Failed to save cleaned translations`);
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 Summary: Removed ${totalRemoved} unused keys total`);
  console.log('='.repeat(70));
  console.log('\n✅ Cleanup complete! All translation files have been updated.\n');
}

main();
