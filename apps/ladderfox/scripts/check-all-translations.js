#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';

// All languages from LocaleContext
const ALL_LANGUAGES = ['en', 'nl', 'fr', 'es', 'de', 'it', 'pl', 'ro', 'hu', 'el', 'cs', 'pt', 'sv', 'bg', 'da', 'fi', 'sk', 'no', 'hr', 'sr'];

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

function main() {
  console.log('🔍 Checking all translation files...\n');

  // Load English as reference
  const enData = loadTranslations('en');
  if (!enData) {
    console.error('❌ Could not load English translation file');
    process.exit(1);
  }

  const enKeys = getAllKeys(enData).sort();
  console.log(`📊 English (en) has ${enKeys.length} translation keys\n`);

  const results = [];

  // Check each language
  for (const lang of ALL_LANGUAGES) {
    if (lang === 'en') {
      results.push({ lang, status: 'complete', keys: enKeys.length, missing: 0, extra: 0, empty: 0 });
      continue;
    }

    const langData = loadTranslations(lang);
    if (!langData) {
      results.push({ lang, status: 'missing_file', keys: 0, missing: enKeys.length, extra: 0, empty: 0 });
      continue;
    }

    const langKeys = getAllKeys(langData).sort();
    const missing = enKeys.filter(key => !langKeys.includes(key));
    const extra = langKeys.filter(key => !enKeys.includes(key));
    
    // Check for empty values
    const empty = [];
    function checkEmpty(obj, prefix = '') {
      for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          checkEmpty(obj[key], fullKey);
        } else if (typeof obj[key] === 'string' && obj[key].trim() === '') {
          empty.push(fullKey);
        }
      }
    }
    checkEmpty(langData);

    const isComplete = missing.length === 0 && extra.length === 0 && empty.length === 0;
    results.push({
      lang,
      status: isComplete ? 'complete' : 'incomplete',
      keys: langKeys.length,
      missing: missing.length,
      extra: extra.length,
      empty: empty.length,
      missingKeys: missing.slice(0, 5), // First 5 missing keys
      emptyKeys: empty.slice(0, 5) // First 5 empty keys
    });
  }

  // Display results
  console.log('Language Status Summary:\n');
  console.log('Status | Language | Keys    | Missing | Extra | Empty');
  console.log('-------|----------|---------|---------|-------|------');

  const incomplete = [];
  const missingFiles = [];

  for (const result of results) {
    let statusIcon = '✅';
    if (result.status === 'missing_file') {
      statusIcon = '❌';
      missingFiles.push(result);
    } else if (result.status === 'incomplete') {
      statusIcon = '⚠️';
      incomplete.push(result);
    }

    console.log(
      `${statusIcon.padEnd(6)} | ${result.lang.padEnd(8)} | ${String(result.keys).padStart(7)} | ${String(result.missing).padStart(7)} | ${String(result.extra).padStart(5)} | ${String(result.empty).padStart(5)}`
    );
  }

  // Detailed information for incomplete languages
  if (incomplete.length > 0) {
    console.log('\n\n⚠️  Languages needing translation work:\n');
    for (const result of incomplete) {
      console.log(`\n${result.lang.toUpperCase()} (${result.lang}):`);
      console.log(`  - Has ${result.keys}/${enKeys.length} keys`);
      if (result.missing > 0) {
        console.log(`  - Missing ${result.missing} keys`);
        if (result.missingKeys.length > 0) {
          console.log(`    Examples: ${result.missingKeys.join(', ')}`);
        }
      }
      if (result.extra > 0) {
        console.log(`  - Has ${result.extra} extra keys (not in English)`);
      }
      if (result.empty > 0) {
        console.log(`  - Has ${result.empty} empty values`);
        if (result.emptyKeys.length > 0) {
          console.log(`    Examples: ${result.emptyKeys.join(', ')}`);
        }
      }
    }
  }

  if (missingFiles.length > 0) {
    console.log('\n\n❌ Missing translation files:\n');
    for (const result of missingFiles) {
      console.log(`  - ${result.lang}.json`);
    }
  }

  // Summary
  const complete = results.filter(r => r.status === 'complete').length;
  const total = results.length;

  console.log('\n\n📊 Summary:');
  console.log(`  ✅ Complete: ${complete}/${total} languages`);
  console.log(`  ⚠️  Incomplete: ${incomplete.length}/${total} languages`);
  console.log(`  ❌ Missing files: ${missingFiles.length}/${total} languages`);

  if (incomplete.length === 0 && missingFiles.length === 0) {
    console.log('\n✅ All translation files are complete!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some languages need translation work.');
    process.exit(1);
  }
}

main();
