#!/usr/bin/env node

/**
 * Script to check if extra keys in DE, ES, FR, and NL are actually used in the codebase
 * 
 * Usage: node scripts/check-key-usage.js
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';
const BASE_LANGUAGE = 'en';
const TARGET_LANGUAGES = ['de', 'es', 'fr', 'nl'];
const CODEBASE_DIRS = ['src', 'app', 'components', 'lib', 'scripts'];

function loadTranslations(lang) {
  const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function getAllKeys(obj) {
  return Object.keys(obj);
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, and other build directories
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next' && file !== 'dist') {
        getAllFiles(filePath, fileList);
      }
    } else {
      // Only check relevant file types, but exclude translation JSON files
      if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        // Exclude translation files
        if (!filePath.includes('translations') || !filePath.endsWith('.json')) {
          fileList.push(filePath);
        }
      }
    }
  });
  
  return fileList;
}

function searchInFile(filePath, key) {
  try {
    // Skip translation JSON files
    if (filePath.includes('translations') && filePath.endsWith('.json')) {
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Search for the key in various formats:
    // - t('key')
    // - t("key")
    // - t(`key`)
    // - ['key'] or ["key"] (object access)
    // More specific patterns to avoid false positives
    const escapedKey = key.replace(/\./g, '\\.');
    const patterns = [
      // t('key') or t("key") or t(`key`)
      new RegExp(`t\\(['"\`]${escapedKey}['"\`]\\)`, 'g'),
      // ['key'] or ["key"] (object access)
      new RegExp(`\\[['"\`]${escapedKey}['"\`]\\]`, 'g'),
      // .key (object property access)
      new RegExp(`\\.${escapedKey.replace(/\./g, '\\.')}`, 'g'),
    ];
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

function main() {
  console.log('🔍 Checking if extra keys are used in the codebase...\n');

  // Load base language (English)
  const baseTranslations = loadTranslations(BASE_LANGUAGE);
  if (!baseTranslations) {
    console.error('❌ Failed to load base language file.');
    process.exit(1);
  }

  const baseKeys = new Set(getAllKeys(baseTranslations));

  // Collect all extra keys from target languages
  const allExtraKeys = new Set();
  const keySources = {}; // Track which languages have each key
  
  for (const lang of TARGET_LANGUAGES) {
    const translations = loadTranslations(lang);
    if (!translations) continue;
    
    const langKeys = getAllKeys(translations);
    langKeys.forEach(key => {
      if (!baseKeys.has(key)) {
        allExtraKeys.add(key);
        if (!keySources[key]) {
          keySources[key] = [];
        }
        keySources[key].push(lang);
      }
    });
  }

  console.log(`Found ${allExtraKeys.size} unique extra keys across DE, ES, FR, and NL.\n`);
  console.log('Scanning codebase for usage...\n');

  // Get all files to search (exclude translation files)
  const allFiles = [];
  CODEBASE_DIRS.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      getAllFiles(dirPath, allFiles);
    }
  });
  
  // Also search in app directory if it exists
  const appDir = path.join(process.cwd(), 'app');
  if (fs.existsSync(appDir)) {
    getAllFiles(appDir, allFiles);
  }

  console.log(`Scanning ${allFiles.length} files...\n`);

  // Check each key
  const usedKeys = [];
  const unusedKeys = [];
  const keyUsage = {}; // Track which files use each key

  let checked = 0;
  for (const key of allExtraKeys) {
    checked++;
    if (checked % 50 === 0) {
      process.stdout.write(`\rProgress: ${checked}/${allExtraKeys.size} keys checked...`);
    }

    let found = false;
    const filesUsingKey = [];

    for (const filePath of allFiles) {
      if (searchInFile(filePath, key)) {
        found = true;
        filesUsingKey.push(filePath);
      }
    }

    if (found) {
      usedKeys.push(key);
      keyUsage[key] = filesUsingKey;
    } else {
      unusedKeys.push(key);
    }
  }

  process.stdout.write(`\rProgress: ${checked}/${allExtraKeys.size} keys checked...\n\n`);

  // Group by prefix
  const usedByPrefix = {};
  const unusedByPrefix = {};

  usedKeys.forEach(key => {
    const prefix = key.split('.')[0];
    if (!usedByPrefix[prefix]) {
      usedByPrefix[prefix] = [];
    }
    usedByPrefix[prefix].push(key);
  });

  unusedKeys.forEach(key => {
    const prefix = key.split('.')[0];
    if (!unusedByPrefix[prefix]) {
      unusedByPrefix[prefix] = [];
    }
    unusedByPrefix[prefix].push(key);
  });

  // Display results
  console.log('='.repeat(70));
  console.log('📊 USAGE SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Used keys: ${usedKeys.length}`);
  console.log(`❌ Unused keys: ${unusedKeys.length}`);
  console.log(`📈 Usage rate: ${((usedKeys.length / allExtraKeys.size) * 100).toFixed(2)}%\n`);

  if (usedKeys.length > 0) {
    console.log('\n' + '='.repeat(70));
    console.log('✅ USED KEYS (Grouped by prefix)');
    console.log('='.repeat(70));
    
    const sortedPrefixes = Object.keys(usedByPrefix).sort();
    for (const prefix of sortedPrefixes) {
      const keys = usedByPrefix[prefix].sort();
      console.log(`\n📁 ${prefix} (${keys.length} keys):`);
      keys.slice(0, 10).forEach(key => {
        const files = keyUsage[key];
        console.log(`   • ${key}`);
        if (files.length > 0) {
          console.log(`     Used in: ${files[0].replace(process.cwd() + path.sep, '')}`);
          if (files.length > 1) {
            console.log(`     (+ ${files.length - 1} more file(s))`);
          }
        }
      });
      if (keys.length > 10) {
        console.log(`   ... and ${keys.length - 10} more`);
      }
    }
  }

  if (unusedKeys.length > 0) {
    console.log('\n\n' + '='.repeat(70));
    console.log('❌ UNUSED KEYS (Grouped by prefix)');
    console.log('='.repeat(70));
    
    const sortedPrefixes = Object.keys(unusedByPrefix).sort();
    for (const prefix of sortedPrefixes) {
      const keys = unusedByPrefix[prefix].sort();
      console.log(`\n📁 ${prefix} (${keys.length} keys):`);
      keys.slice(0, 20).forEach(key => {
        const sources = keySources[key].join(', ').toUpperCase();
        console.log(`   • ${key} (in ${sources})`);
      });
      if (keys.length > 20) {
        console.log(`   ... and ${keys.length - 20} more`);
      }
    }
  }

  // Summary by prefix
  console.log('\n\n' + '='.repeat(70));
  console.log('📋 SUMMARY BY PREFIX');
  console.log('='.repeat(70));
  
  const allPrefixes = new Set([...Object.keys(usedByPrefix), ...Object.keys(unusedByPrefix)]);
  const sortedAllPrefixes = Array.from(allPrefixes).sort();
  
  for (const prefix of sortedAllPrefixes) {
    const used = usedByPrefix[prefix]?.length || 0;
    const unused = unusedByPrefix[prefix]?.length || 0;
    const total = used + unused;
    const usageRate = ((used / total) * 100).toFixed(1);
    
    console.log(`${prefix.padEnd(20)} ${used.toString().padStart(4)} used, ${unused.toString().padStart(4)} unused (${usageRate}% usage)`);
  }

  console.log('\n');
}

main();
