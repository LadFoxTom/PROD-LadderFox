/**
 * Enhance CV Content Script
 * 
 * This script reads the exampleCVs.ts file and enhances all CVs with:
 * - More detailed achievements with quantifiable results
 * - Additional skills and certifications
 * - Better descriptions
 * - More experience entries where needed
 * 
 * Note: This is a helper script to guide manual updates
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/exampleCVs.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Count CVs
const cvMatches = content.match(/'(\w+)':\s*{/g);
console.log(`Found ${cvMatches?.length || 0} CVs to enhance`);

// List all profession IDs
const professionIds = [
  'nurse', 'software-developer', 'teacher', 'accountant', 'marketing-manager',
  'graphic-designer', 'management-assistant', 'engineer', 'account-manager', 'chef',
  'lawyer', 'data-scientist', 'doctor', 'pharmacist', 'it-support',
  'professor', 'school-counselor', 'financial-analyst', 'photographer', 'copywriter',
  'mechanical-engineer', 'civil-engineer', 'account-manager-2', 'store-manager',
  'office-manager', 'executive-assistant', 'hotel-manager', 'restaurant-manager',
  'paralegal', 'legal-assistant'
];

console.log('\nCVs to enhance:');
professionIds.forEach((id, idx) => {
  console.log(`${idx + 1}. ${id}`);
});

console.log('\n⚠️  Manual enhancement required:');
console.log('1. Add quantifiable achievements (numbers, percentages, metrics)');
console.log('2. Expand skills lists with sector-specific keywords');
console.log('3. Add more detailed experience descriptions');
console.log('4. Include relevant certifications');
console.log('5. Enhance summaries with key achievements');
console.log('6. Ensure all CVs stay within 1 page limit');
