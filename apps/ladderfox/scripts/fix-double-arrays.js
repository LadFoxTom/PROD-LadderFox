/**
 * Fix Double Arrays Script
 * 
 * Fixes double array syntax errors: [[ -> [
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exampleCVs.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Fixing double array syntax errors...\n');

let changesMade = 0;

// Fix double arrays: achievements: [[ -> achievements: [
content = content.replace(/achievements:\s*\[\[/g, (match) => {
  changesMade++;
  return match.replace('[[', '[');
});

// Fix closing double arrays: ]] -> ]
content = content.replace(/\]\](\s*)(\n\s*)(})/g, (match, p1, p2, p3) => {
  return ']' + p1 + p2 + p3;
});

// Fix malformed strings with escaped quotes
content = content.replace(/'([^']*)\\'([^']*)/g, (match) => {
  // Fix escaped quotes in strings
  return match.replace("\\'", "'");
});

// Remove empty string entries: ', -> (remove line)
content = content.replace(/^\s*',\s*$/gm, '');

// Remove lines with just commas
content = content.replace(/^\s*,\s*$/gm, '');

console.log(`✅ Fixed ${changesMade} double array syntax errors\n`);

if (changesMade > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`💾 Saved fixed file to ${filePath}`);
} else {
  console.log('⚠️  No changes made.');
}

console.log('\n✨ Fix complete!');
