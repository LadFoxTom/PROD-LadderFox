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

// Common English words/phrases that might appear in translations
const ENGLISH_INDICATORS = [
  'the ', ' and ', ' or ', ' is ', ' are ', ' was ', ' were ', ' have ', ' has ', ' had ',
  ' will ', ' would ', ' could ', ' should ', ' can ', ' may ', ' might ',
  ' this ', ' that ', ' these ', ' those ',
  ' with ', ' from ', ' for ', ' to ', ' in ', ' on ', ' at ', ' by ',
  ' of ', ' a ', ' an ', ' as ', ' be ', ' been ', ' being ',
  ' Login ', ' Sign Up ', ' Welcome ', ' Home ', ' About ', ' Contact ',
  ' Settings ', ' Dashboard ', ' Profile ', ' Account ', ' Password ',
  ' Email ', ' Name ', ' Save ', ' Cancel ', ' Delete ', ' Edit ', ' Download ',
  ' Create ', ' Update ', ' Submit ', ' Search ', ' Filter ', ' Sort ',
  ' Yes ', ' No ', ' OK ', ' Error ', ' Success ', ' Loading ', ' Processing ',
  ' Please ', ' Thank you ', ' Sorry ', ' Help ', ' Support ', ' FAQ ',
  ' Pricing ', ' Subscription ', ' Upgrade ', ' Free ', ' Premium ', ' Pro ',
  ' CV ', ' Resume ', ' Letter ', ' Template ', ' Builder ', ' Editor ',
  ' Examples ', ' Guide ', ' Tips ', ' Best Practices ',
  ' Privacy ', ' Terms ', ' Cookie ', ' Policy ',
  ' Get Started ', ' Learn More ', ' Read More ', ' View More ',
  ' Coming Soon ', ' New ', ' Featured ', ' Popular ', ' Recent ',
  ' All Rights Reserved ', ' Copyright ', ' Version ', ' Last Updated '
];

function containsEnglishText(text) {
  if (typeof text !== 'string') return false;
  
  // Check for common English phrases
  const lowerText = ' ' + text.toLowerCase() + ' ';
  for (const indicator of ENGLISH_INDICATORS) {
    if (lowerText.includes(indicator.toLowerCase())) {
      // Additional check: if it's a short phrase that matches exactly, it's likely English
      if (text.length < 50 && text.split(' ').length < 8) {
        return true;
      }
    }
  }
  
  // Check for English sentence patterns
  // Common English patterns: "the [noun]", "is [adjective]", etc.
  const englishPatterns = [
    /\bthe\s+\w+/i,
    /\bis\s+\w+/i,
    /\bare\s+\w+/i,
    /\bwas\s+\w+/i,
    /\bwere\s+\w+/i,
    /\bhave\s+\w+/i,
    /\bhas\s+\w+/i,
    /\bhad\s+\w+/i,
    /\bwill\s+\w+/i,
    /\bwould\s+\w+/i,
    /\bcould\s+\w+/i,
    /\bshould\s+\w+/i,
    /\bcan\s+\w+/i,
    /\bmay\s+\w+/i,
    /\bmight\s+\w+/i
  ];
  
  for (const pattern of englishPatterns) {
    if (pattern.test(text) && text.length < 100) {
      return true;
    }
  }
  
  return false;
}

function main() {
  console.log('🔍 Checking for English text in translations...\n');

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
      
      // Check if translation is identical to English (likely not translated)
      if (pair.value === enValue) {
        englishTexts.push({
          key: pair.key,
          value: pair.value,
          reason: 'identical_to_english'
        });
      }
      // Check if it contains English text patterns
      else if (containsEnglishText(pair.value)) {
        // Additional check: if it's very similar to English, flag it
        const similarity = calculateSimilarity(pair.value.toLowerCase(), enValue.toLowerCase());
        if (similarity > 0.7) {
          englishTexts.push({
            key: pair.key,
            value: pair.value,
            reason: 'contains_english_patterns',
            similarity: similarity
          });
        }
      }
    }

    if (englishTexts.length > 0) {
      results.push({
        lang,
        count: englishTexts.length,
        examples: englishTexts.slice(0, 10) // First 10 examples
      });
    }
  }

  // Display results
  if (results.length === 0) {
    console.log('✅ No English text found in translations!');
    process.exit(0);
  }

  console.log('⚠️  Languages with English text found:\n');
  console.log('Language | Count | Status');
  console.log('---------|-------|--------');

  for (const result of results) {
    const status = result.count > 50 ? '🔴 Many' : result.count > 20 ? '🟡 Some' : '🟢 Few';
    console.log(`${result.lang.padEnd(8)} | ${String(result.count).padStart(5)} | ${status}`);
  }

  console.log('\n\n📋 Detailed Examples:\n');
  for (const result of results) {
    console.log(`\n${result.lang.toUpperCase()} (${result.lang}) - ${result.count} entries with English text:\n`);
    
    // Group by reason
    const identical = result.examples.filter(e => e.reason === 'identical_to_english');
    const patterns = result.examples.filter(e => e.reason === 'contains_english_patterns');
    
    if (identical.length > 0) {
      console.log(`  Identical to English (${identical.length} shown):`);
      identical.slice(0, 5).forEach(entry => {
        console.log(`    - ${entry.key}: "${entry.value}"`);
      });
      if (identical.length > 5) {
        console.log(`    ... and ${identical.length - 5} more`);
      }
    }
    
    if (patterns.length > 0) {
      console.log(`  Contains English patterns (${patterns.length} shown):`);
      patterns.slice(0, 5).forEach(entry => {
        console.log(`    - ${entry.key}: "${entry.value}"`);
      });
      if (patterns.length > 5) {
        console.log(`    ... and ${patterns.length - 5} more`);
      }
    }
  }

  console.log('\n\n📊 Summary:');
  const total = results.reduce((sum, r) => sum + r.count, 0);
  console.log(`  Total entries with English text: ${total}`);
  console.log(`  Languages affected: ${results.length}/${ALL_LANGUAGES.length}`);
  
  process.exit(1);
}

function calculateSimilarity(str1, str2) {
  // Simple similarity calculation based on common words
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  const commonWords = words1.filter(w => words2.includes(w));
  return commonWords.length / Math.max(words1.length, words2.length);
}

main();
