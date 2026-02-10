/**
 * Replace all randomuser.me photo URLs in exampleCVs.ts
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exampleCVs.ts');

let content = fs.readFileSync(filePath, 'utf8');

// Find all photoUrl entries with randomuser.me and their corresponding fullName
const photoUrlRegex = /photoUrl:\s*'https:\/\/randomuser\.me\/api\/portraits\/([^']+)'/g;
const fullNameRegex = /fullName:\s*'([^']+)'/g;

// Extract all fullNames and their positions
const fullNames = [];
let match;
while ((match = fullNameRegex.exec(content)) !== null) {
  fullNames.push({
    name: match[1],
    index: match.index
  });
}

// Replace all randomuser.me URLs
let photoMatch;
let replacements = 0;
const newContent = content.replace(photoUrlRegex, (match, urlPart, offset) => {
  // Find the closest fullName before this photoUrl
  let closestFullName = null;
  let closestDistance = Infinity;
  
  for (const fullName of fullNames) {
    if (fullName.index < offset && (offset - fullName.index) < closestDistance) {
      closestDistance = offset - fullName.index;
      closestFullName = fullName.name;
    }
  }
  
  if (closestFullName) {
    replacements++;
    const name = encodeURIComponent(closestFullName.split(' ')[0]);
    return `photoUrl: getPlaceholderPhoto('${closestFullName}')`;
  }
  
  return match; // Keep original if no fullName found
});

if (replacements > 0) {
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ Replaced ${replacements} randomuser.me URLs with placeholder photos`);
} else {
  console.log('⚠️  No randomuser.me URLs found to replace');
}
