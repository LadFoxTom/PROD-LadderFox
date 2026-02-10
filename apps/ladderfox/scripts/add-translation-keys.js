#!/usr/bin/env node

/**
 * Script to add new translation keys to all language files
 * 
 * Usage: node scripts/add-translation-keys.js
 * 
 * Edit the NEW_KEYS object below to add new translations
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';
const LANGUAGES = ['en', 'nl', 'fr', 'es', 'de'];

// Add your new translation keys here
const NEW_KEYS = {
  // Navigation
  'nav.dashboard': {
    en: 'Dashboard',
    nl: 'Dashboard',
    fr: 'Tableau de bord',
    es: 'Panel',
    de: 'Dashboard'
  },
  'nav.my_cvs': {
    en: 'My CVs',
    nl: 'Mijn CV\'s',
    fr: 'Mes CV',
    es: 'Mis CVs',
    de: 'Meine CVs'
  },
  
  // Add more keys here...
};

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
  
  // Sort keys alphabetically
  const sorted = {};
  Object.keys(translations).sort().forEach(key => {
    sorted[key] = translations[key];
  });
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Failed to save ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('📝 Adding new translation keys...\n');

  if (Object.keys(NEW_KEYS).length === 0) {
    console.log('⚠️  No new keys to add. Edit the NEW_KEYS object in this script.');
    return;
  }

  let totalAdded = 0;

  for (const lang of LANGUAGES) {
    const translations = loadTranslations(lang);
    if (!translations) continue;

    let added = 0;

    for (const key of Object.keys(NEW_KEYS)) {
      if (!translations[key]) {
        translations[key] = NEW_KEYS[key][lang];
        added++;
      } else {
        console.log(`⚠️  Key "${key}" already exists in ${lang}.json, skipping...`);
      }
    }

    if (added > 0) {
      if (saveTranslations(lang, translations)) {
        console.log(`✅ Added ${added} keys to ${lang}.json`);
        totalAdded += added;
      }
    } else {
      console.log(`ℹ️  No new keys added to ${lang}.json`);
    }
  }

  console.log(`\n✨ Done! Added ${totalAdded} translations across all languages.`);
  console.log('\n💡 Next steps:');
  console.log('1. Review the changes in src/translations/');
  console.log('2. Use the new keys in your components with t(\'key\')');
  console.log('3. Test with different languages');
}

main();
