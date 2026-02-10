/**
 * Generate favicon files from SVG
 * 
 * This script requires sharp to be installed:
 * npm install sharp
 * 
 * Run with: node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Error: sharp package is required.');
  console.log('📦 Install it with: npm install sharp');
  console.log('\n💡 Alternative: Use the HTML generator at public/generate-favicons.html');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');
const svgPath = path.join(publicDir, 'icon.svg');

if (!fs.existsSync(svgPath)) {
  console.error('❌ Error: icon.svg not found in public directory');
  process.exit(1);
}

const sizes = [
  { size: 16, name: 'favicon-16.ico' },
  { size: 32, name: 'favicon-32.ico' },
  { size: 48, name: 'favicon-48.ico' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-icon.png' },
];

async function generateFavicons() {
  console.log('🎨 Generating favicon files from SVG...\n');
  
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const { size, name } of sizes) {
    try {
      const outputPath = path.join(publicDir, name);
      
      if (name.endsWith('.ico')) {
        // For ICO, generate PNG first then convert (simplified - just use PNG)
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(outputPath.replace('.ico', '.png'));
        console.log(`✅ Generated ${name.replace('.ico', '.png')} (${size}x${size})`);
      } else {
        await sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toFile(outputPath);
        console.log(`✅ Generated ${name} (${size}x${size})`);
      }
    } catch (error) {
      console.error(`❌ Error generating ${name}:`, error.message);
    }
  }
  
  console.log('\n✨ Done! Favicon files generated in public/ directory');
  console.log('\n📝 Note: For .ico files, you may need to use an online converter:');
  console.log('   https://convertio.co/png-ico/');
  console.log('   Convert the generated PNG files to ICO format.');
}

generateFavicons().catch(console.error);
