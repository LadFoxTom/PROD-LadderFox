#!/usr/bin/env node

/**
 * Script to find hardcoded English text in React/TypeScript files
 * 
 * Usage: node scripts/find-hardcoded-text.js
 */

const fs = require('fs');
const path = require('path');

// Directories to scan
const SCAN_DIRS = [
  'src/app',
  'src/components',
];

// File extensions to check
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

// Patterns to find hardcoded text
const PATTERNS = [
  // JSX text content: <div>Hello World</div>
  /<[^>]+>([A-Z][a-zA-Z\s,!?.'-]{10,})<\/[^>]+>/g,
  
  // String literals in JSX: placeholder="Enter your email"
  /(?:placeholder|title|alt|aria-label)=["']([A-Z][a-zA-Z\s,!?.'-]{5,})["']/g,
  
  // Toast messages: toast.success('Message here')
  /toast\.(success|error|info|warning)\(['"]([^'"]+)['"]\)/g,
  
  // Button text: <button>Click Here</button>
  /<button[^>]*>([A-Z][a-zA-Z\s]{3,})<\/button>/g,
];

// Ignore patterns (already translated or technical)
const IGNORE_PATTERNS = [
  /\{t\(/,  // Already using translation
  /console\./,  // Console logs
  /className=/,  // CSS classes
  /import /,  // Import statements
  /export /,  // Export statements
  /\/\//,  // Comments
  /\/\*/,  // Block comments
  /LadderFox/,  // Brand name
];

function shouldIgnoreLine(line) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(line));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const findings = [];

  lines.forEach((line, index) => {
    if (shouldIgnoreLine(line)) return;

    PATTERNS.forEach(pattern => {
      const matches = [...line.matchAll(pattern)];
      matches.forEach(match => {
        const text = match[1] || match[2];
        if (text && text.trim().length > 0) {
          findings.push({
            file: filePath,
            line: index + 1,
            text: text.trim(),
            context: line.trim()
          });
        }
      });
    });
  });

  return findings;
}

function scanDirectory(dir) {
  const findings = [];
  
  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!['node_modules', '.next', 'dist', 'build'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (EXTENSIONS.includes(ext)) {
          const fileFindings = scanFile(fullPath);
          findings.push(...fileFindings);
        }
      }
    }
  }
  
  walk(dir);
  return findings;
}

function main() {
  console.log('🔍 Scanning for hardcoded English text...\n');
  
  let allFindings = [];
  
  SCAN_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Scanning ${dir}...`);
      const findings = scanDirectory(dir);
      allFindings.push(...findings);
    }
  });

  if (allFindings.length === 0) {
    console.log('\n✅ No hardcoded text found! All text is properly translated.');
    return;
  }

  console.log(`\n📊 Found ${allFindings.length} potential hardcoded texts:\n`);
  
  // Group by file
  const byFile = {};
  allFindings.forEach(finding => {
    if (!byFile[finding.file]) {
      byFile[finding.file] = [];
    }
    byFile[finding.file].push(finding);
  });

  // Print results
  Object.keys(byFile).sort().forEach(file => {
    console.log(`\n📄 ${file}`);
    byFile[file].forEach(finding => {
      console.log(`  Line ${finding.line}: "${finding.text}"`);
      console.log(`    Context: ${finding.context.substring(0, 80)}...`);
    });
  });

  console.log(`\n💡 Next steps:`);
  console.log(`1. Add translation keys to src/translations/en.json`);
  console.log(`2. Translate keys to other languages (nl.json, fr.json, etc.)`);
  console.log(`3. Replace hardcoded text with t('key') in components`);
  console.log(`4. Test with: localStorage.setItem('language', 'nl'); location.reload()`);
}

main();
