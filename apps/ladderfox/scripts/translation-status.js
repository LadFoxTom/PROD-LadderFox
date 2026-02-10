#!/usr/bin/env node

/**
 * Script to calculate translation status and percentage of untranslated content per language
 * 
 * Usage: node scripts/translation-status.js
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';
const BASE_LANGUAGE = 'en';

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
  // For flat JSON objects with dot notation keys, just get the keys
  return Object.keys(obj);
}

function main() {
  console.log('📊 Calculating translation status...\n');

  // Load base language (English)
  const baseTranslations = loadTranslations(BASE_LANGUAGE);
  if (!baseTranslations) {
    console.error('❌ Failed to load base language file.');
    process.exit(1);
  }

  const baseKeys = getAllKeys(baseTranslations);
  const totalKeys = baseKeys.length;

  console.log(`📝 Base language (${BASE_LANGUAGE.toUpperCase()}): ${totalKeys} total keys\n`);

  // Get all language files
  const languageFiles = fs.readdirSync(TRANSLATIONS_DIR)
    .filter(file => file.endsWith('.json') && file !== 'translate_it_comprehensive.py')
    .map(file => file.replace('.json', ''))
    .filter(lang => lang !== BASE_LANGUAGE)
    .sort();

  const results = [];

  // Check each language
  for (const lang of languageFiles) {
    const translations = loadTranslations(lang);
    if (!translations) {
      continue;
    }

    const langKeys = getAllKeys(translations);
    
    // Count how many base keys are translated (exist and are not empty)
    let translatedCount = 0;
    const missingKeys = [];
    
    for (const baseKey of baseKeys) {
      if (translations.hasOwnProperty(baseKey)) {
        const value = translations[baseKey];
        if (value !== undefined && value !== null && value !== '') {
          translatedCount++;
        } else {
          missingKeys.push(baseKey);
        }
      } else {
        missingKeys.push(baseKey);
      }
    }

    // Count extra keys (keys in language file that don't exist in base)
    const extraKeys = langKeys.filter(key => !baseKeys.includes(key));

    const missingCount = totalKeys - translatedCount;
    const translatedPercentage = ((translatedCount / totalKeys) * 100).toFixed(2);
    const untranslatedPercentage = ((missingCount / totalKeys) * 100).toFixed(2);

    results.push({
      language: lang,
      translated: translatedCount,
      missing: missingCount,
      extra: extraKeys.length,
      total: totalKeys,
      translatedPercentage: parseFloat(translatedPercentage),
      untranslatedPercentage: parseFloat(untranslatedPercentage)
    });
  }

  // Sort by untranslated percentage (highest first)
  results.sort((a, b) => b.untranslatedPercentage - a.untranslatedPercentage);

  // Display results
  console.log('🌐 Translation Status by Language:\n');
  console.log('Language'.padEnd(12) + 'Translated'.padEnd(12) + 'Missing'.padEnd(12) + 'Extra'.padEnd(10) + 'Untranslated %');
  console.log('-'.repeat(70));

  for (const result of results) {
    const langName = result.language.toUpperCase().padEnd(12);
    const translated = result.translated.toString().padEnd(12);
    const missing = result.missing.toString().padEnd(12);
    const extra = result.extra.toString().padEnd(10);
    const percentage = `${result.untranslatedPercentage}%`;
    
    console.log(`${langName}${translated}${missing}${extra}${percentage}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📈 Summary:\n');

  const fullyTranslated = results.filter(r => r.untranslatedPercentage === 0);
  const partiallyTranslated = results.filter(r => r.untranslatedPercentage > 0 && r.untranslatedPercentage < 50);
  const mostlyUntranslated = results.filter(r => r.untranslatedPercentage >= 50);

  console.log(`✅ Fully translated (0%): ${fullyTranslated.length} languages`);
  if (fullyTranslated.length > 0) {
    console.log(`   ${fullyTranslated.map(r => r.language.toUpperCase()).join(', ')}`);
  }

  console.log(`\n⚠️  Partially translated (1-49%): ${partiallyTranslated.length} languages`);
  if (partiallyTranslated.length > 0) {
    partiallyTranslated.forEach(r => {
      console.log(`   ${r.language.toUpperCase()}: ${r.untranslatedPercentage}% untranslated`);
    });
  }

  console.log(`\n❌ Mostly untranslated (50%+): ${mostlyUntranslated.length} languages`);
  if (mostlyUntranslated.length > 0) {
    mostlyUntranslated.forEach(r => {
      console.log(`   ${r.language.toUpperCase()}: ${r.untranslatedPercentage}% untranslated`);
    });
  }

  console.log('\n');
}

main();
