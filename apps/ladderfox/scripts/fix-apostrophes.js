/**
 * Fix Apostrophes Script
 * 
 * Fixes unescaped apostrophes in single-quoted strings
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exampleCVs.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing apostrophes in strings...\n');

let changesMade = 0;

// Find all single-quoted strings and fix apostrophes
// Pattern: '...'s...' -> '...\'s...'
content = content.replace(/'([^']*)'s([^']*)'/g, (match, before, after) => {
  // Only fix if it's not already escaped
  if (!match.includes("\\'")) {
    changesMade++;
    return `'${before}\\'s${after}'`;
  }
  return match;
});

// Also fix other common apostrophe patterns
content = content.replace(/'([^']*)'([^']*)'/g, (match, before, after) => {
  // Skip if it's already escaped or if it's a valid pattern
  if (match.includes("\\'") || match.startsWith("'") && match.endsWith("'")) {
    return match;
  }
  // Fix unescaped apostrophes in the middle
  const fixed = match.replace(/([^\\])'([^']*')/g, "$1\\'$2");
  if (fixed !== match) {
    changesMade++;
    return fixed;
  }
  return match;
});

console.log(`✅ Fixed ${changesMade} apostrophe issues\n`);

if (changesMade > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`💾 Saved fixed file to ${filePath}`);
} else {
  console.log('⚠️  No changes made.');
}

console.log('\n✨ Fix complete!');
