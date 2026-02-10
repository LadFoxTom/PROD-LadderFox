#!/usr/bin/env node

/**
 * Script to find extra keys in specific languages that don't exist in English
 * 
 * Usage: node scripts/find-extra-keys.js
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

function getAllKeys(obj) {
  return Object.keys(obj);
}

function main() {
  console.log('🔍 Finding extra keys in DE, ES, FR, and NL...\n');

  // Load base language (English)
  const baseTranslations = loadTranslations(BASE_LANGUAGE);
  if (!baseTranslations) {
    console.error('❌ Failed to load base language file.');
    process.exit(1);
  }

  const baseKeys = new Set(getAllKeys(baseTranslations));
  console.log(`📝 Base language (${BASE_LANGUAGE.toUpperCase()}): ${baseKeys.size} keys\n`);

  // Check each target language
  for (const lang of TARGET_LANGUAGES) {
    const translations = loadTranslations(lang);
    if (!translations) {
      continue;
    }

    const langKeys = getAllKeys(translations);
    const extraKeys = langKeys.filter(key => !baseKeys.has(key));

    console.log(`\n${'='.repeat(70)}`);
    console.log(`🌐 ${lang.toUpperCase()} - Extra Keys (${extraKeys.length} total)`);
    console.log('='.repeat(70));

    if (extraKeys.length === 0) {
      console.log('✅ No extra keys found.');
    } else {
      // Group keys by prefix for better readability
      const groupedKeys = {};
      extraKeys.forEach(key => {
        const prefix = key.split('.')[0];
        if (!groupedKeys[prefix]) {
          groupedKeys[prefix] = [];
        }
        groupedKeys[prefix].push(key);
      });

      // Sort prefixes
      const sortedPrefixes = Object.keys(groupedKeys).sort();

      for (const prefix of sortedPrefixes) {
        console.log(`\n📁 ${prefix}:`);
        groupedKeys[prefix].sort().forEach(key => {
          const value = translations[key];
          const preview = typeof value === 'string' 
            ? (value.length > 80 ? value.substring(0, 80) + '...' : value)
            : JSON.stringify(value);
          console.log(`   • ${key}`);
          console.log(`     "${preview}"`);
        });
      }

      // Show sample values
      console.log(`\n📊 Summary:`);
      console.log(`   Total extra keys: ${extraKeys.length}`);
      console.log(`   Prefixes affected: ${sortedPrefixes.length}`);
    }
  }

  // Check if these keys exist in other languages
  console.log(`\n\n${'='.repeat(70)}`);
  console.log('🔍 Checking if extra keys exist in other languages...');
  console.log('='.repeat(70));

  // Get all language files
  const allLanguageFiles = fs.readdirSync(TRANSLATIONS_DIR)
    .filter(file => file.endsWith('.json') && file !== 'translate_it_comprehensive.py')
    .map(file => file.replace('.json', ''))
    .filter(lang => lang !== BASE_LANGUAGE && !TARGET_LANGUAGES.includes(lang))
    .sort();

  // Collect all extra keys from target languages
  const allExtraKeys = new Set();
  for (const lang of TARGET_LANGUAGES) {
    const translations = loadTranslations(lang);
    if (!translations) continue;
    const langKeys = getAllKeys(translations);
    langKeys.forEach(key => {
      if (!baseKeys.has(key)) {
        allExtraKeys.add(key);
      }
    });
  }

  if (allExtraKeys.size === 0) {
    console.log('No extra keys found to check.');
    return;
  }

  console.log(`\nFound ${allExtraKeys.size} unique extra keys across DE, ES, FR, and NL.\n`);
  console.log('Checking other languages for these keys:\n');

  for (const lang of allLanguageFiles) {
    const translations = loadTranslations(lang);
    if (!translations) continue;

    const langKeys = new Set(getAllKeys(translations));
    const foundKeys = Array.from(allExtraKeys).filter(key => langKeys.has(key));
    const missingKeys = Array.from(allExtraKeys).filter(key => !langKeys.has(key));

    console.log(`${lang.toUpperCase()}:`);
    console.log(`  ✅ Has ${foundKeys.length} of ${allExtraKeys.size} extra keys`);
    if (missingKeys.length > 0) {
      console.log(`  ❌ Missing ${missingKeys.length} extra keys`);
    }
  }
}

main();
