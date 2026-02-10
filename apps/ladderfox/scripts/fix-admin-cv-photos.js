/**
 * Fix Admin CV Photos
 * 
 * This script:
 * 1. Checks how many CVs the admin has
 * 2. Replaces randomuser.me photo URLs with a CORS-friendly alternative
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Generate a data URI placeholder photo (CORS-friendly, no external requests)
function getPlaceholderPhoto(fullName) {
  const name = fullName ? fullName.split(' ')[0] : 'User';
  const initial = name.charAt(0).toUpperCase();
  const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  
  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initial}</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function fixAdminCVPhotos() {
  const adminEmail = 'admin@admin.com';
  
  console.log('🔧 Fixing admin CV photos...\n');
  
  try {
    // Find admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (!adminUser) {
      console.error('❌ Admin user not found!');
      return;
    }
    
    console.log(`✅ Found admin user: ${adminUser.email} (ID: ${adminUser.id})\n`);
    
    // Get all CVs
    const cvs = await prisma.cV.findMany({
      where: { userId: adminUser.id }
    });
    
    console.log(`📋 Found ${cvs.length} CVs\n`);
    
    let updatedCount = 0;
    
    for (const cv of cvs) {
      try {
        // Parse the content
        const content = typeof cv.content === 'string' 
          ? JSON.parse(cv.content) 
          : cv.content;
        
        // Check if it has an external photo URL (randomuser.me, ui-avatars.com, etc.)
        if (content.photoUrl && (content.photoUrl.includes('randomuser.me') || content.photoUrl.includes('ui-avatars.com') || content.photoUrl.startsWith('http'))) {
          // Replace with placeholder
          const newPhotoUrl = getPlaceholderPhoto(content.fullName);
          content.photoUrl = newPhotoUrl;
          
          // Update the CV
          await prisma.cV.update({
            where: { id: cv.id },
            data: {
              content: JSON.stringify(content)
            }
          });
          
          console.log(`   ✅ Updated: ${cv.title} (${content.fullName})`);
          updatedCount++;
        }
      } catch (error) {
        console.log(`   ⚠️  Failed to update ${cv.title}: ${error.message}`);
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Successfully updated: ${updatedCount} CVs`);
    console.log(`📊 Total CVs: ${cvs.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixAdminCVPhotos()
  .catch((error) => {
    console.error('Failed to fix CV photos:', error);
    process.exit(1);
  });
