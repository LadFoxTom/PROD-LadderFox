/**
 * Setup Admin User Script
 * 
 * Creates or updates the admin@admin.com user with password "admin"
 * and gives them unlimited access to all features.
 * 
 * Run with: node scripts/setup-admin-user.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Unlimited features for admin
const ADMIN_FEATURES = {
  pdf_export: true,
  ai_requests: 999999, // Effectively unlimited
  templates: 'all',
  job_tracking: true,
  analytics: true,
  priority_support: true,
  api_access: true,
  team_collaboration: true,
};

// Unlimited quotas for admin
const ADMIN_QUOTAS = {
  ai_requests: { used: 0, limit: 999999 },
  exports: { used: 0, limit: 999999 },
  storage: { used: 0, limit: 999999 }, // 999GB effectively unlimited
  api_calls: { used: 0, limit: 999999 },
};

async function setupAdminUser() {
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin';
  
  console.log('🔧 Setting up admin user...\n');
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    console.log('✅ Password hashed');
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: { subscription: true }
    });
    
    if (user) {
      console.log(`✅ Found existing user: ${user.email} (ID: ${user.id})`);
      
      // Update password if needed
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          name: 'Admin User',
        }
      });
      console.log('✅ Password updated');
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin User',
          emailVerified: new Date(),
        }
      });
      console.log(`✅ Created new user: ${user.email} (ID: ${user.id})`);
    }
    
    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId: user.id }
    });
    
    const subscriptionData = {
      plan: 'team', // Highest tier
      status: 'active',
      billingCycle: 'yearly',
      features: ADMIN_FEATURES,
      usageQuotas: ADMIN_QUOTAS,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000), // 100 years from now
      cancelAtPeriodEnd: false,
    };
    
    if (existingSubscription) {
      // Update existing subscription
      await prisma.subscription.update({
        where: { userId: user.id },
        data: subscriptionData
      });
      console.log('✅ Subscription updated to unlimited team plan');
    } else {
      // Create new subscription
      await prisma.subscription.create({
        data: {
          userId: user.id,
          ...subscriptionData
        }
      });
      console.log('✅ Created unlimited team subscription');
    }
    
    // Verify the setup
    const finalUser = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: { subscription: true }
    });
    
    console.log('\n📋 Admin User Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:          ${finalUser.email}`);
    console.log(`Password:       admin`);
    console.log(`Name:           ${finalUser.name}`);
    console.log(`User ID:        ${finalUser.id}`);
    console.log(`Plan:           ${finalUser.subscription?.plan || 'N/A'}`);
    console.log(`Status:         ${finalUser.subscription?.status || 'N/A'}`);
    console.log(`Billing Cycle:  ${finalUser.subscription?.billingCycle || 'N/A'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n✅ Features enabled:');
    if (finalUser.subscription?.features) {
      const features = finalUser.subscription.features;
      Object.entries(features).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value}`);
      });
    }
    
    console.log('\n✅ Quotas:');
    if (finalUser.subscription?.usageQuotas) {
      const quotas = finalUser.subscription.usageQuotas;
      Object.entries(quotas).forEach(([key, value]) => {
        if (typeof value === 'object' && value.limit !== undefined) {
          console.log(`   - ${key}: ${value.used}/${value.limit}`);
        }
      });
    }
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('   You can now login with:');
    console.log('   Email:    admin@admin.com');
    console.log('   Password: admin');
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminUser()
  .catch((error) => {
    console.error('Failed to setup admin user:', error);
    process.exit(1);
  });
