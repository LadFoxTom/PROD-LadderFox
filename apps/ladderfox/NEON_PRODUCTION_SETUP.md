# Neon.tech Production Database Setup Guide

## Step-by-Step: Create Production Database

### Step 1: Create Neon.tech Project

1. **Go to Neon.tech**: https://neon.tech
2. **Sign in** (or create account)
3. **Click "Create Project"**
4. **Project Settings**:
   - **Project Name**: `ladderfox-production`
   - **Region**: Choose closest to your users (e.g., `us-east-1`, `eu-west-1`)
   - **PostgreSQL Version**: `15` or `16` (recommended)
   - **Compute Size**: Start with `Free` or `Launch` tier
5. **Click "Create Project"**

### Step 2: Get Connection String

1. **In Neon Dashboard**, go to your project
2. **Click "Connection Details"** or look for connection string
3. **Copy the connection string**:
   ```
   postgresql://username:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### Step 3: Enable Connection Pooling (CRITICAL for Vercel)

1. **In Neon Dashboard**, go to your project
2. **Click "Connection Pooling"** or "PgBouncer"
3. **Enable Connection Pooling**
4. **Copy the pooled connection string**:
   ```
   postgresql://username:password@ep-xxxx-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
   ```
5. **Important**: Use the **pooled connection string** for Vercel production

### Step 4: Run Migrations

**Option A: Using Prisma (Recommended)**

```bash
# Set the production database URL
$env:DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true"

# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Or run migrations (if you want to track migration history)
npx prisma migrate deploy
```

**Option B: Using Prisma Migrate (For Migration History)**

```bash
# Set the production database URL
$env:DATABASE_URL="postgresql://username:password@ep-xxxx-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true"

# Deploy all migrations
npx prisma migrate deploy
```

### Step 5: Verify Database Setup

```bash
# Open Prisma Studio to verify tables
$env:DATABASE_URL="your-production-db-url"
npx prisma studio
```

**Check for these tables**:
- ✅ User
- ✅ Account
- ✅ Session
- ✅ VerificationToken
- ✅ CV
- ✅ Letter
- ✅ Subscription
- ✅ QuestionConfiguration
- ✅ QuestionConfigVersion
- ✅ Flow
- ✅ ABTest
- ✅ ABTestParticipant
- ✅ ConditionalQuestion
- ✅ QuestionDependency
- ✅ QuestionAnalytics
- ✅ PerformanceMetric
- ✅ AuditLog
- ✅ JobApplication
- ✅ JobMatch
- ✅ CVAnalysis
- ✅ AgentConversation

### Step 6: Seed Initial Data (Optional)

If you want to copy data from UAT:

**Option A: Export from UAT, Import to Production**

```bash
# Export from UAT database
$env:DATABASE_URL="your-uat-db-url"
npx prisma db execute --stdin < export-uat.sql

# Import to Production
$env:DATABASE_URL="your-production-db-url"
npx prisma db execute --stdin < export-uat.sql
```

**Option B: Use Prisma Studio**
- Open both UAT and Production in Prisma Studio
- Manually copy essential data (admin users, default configurations, etc.)

**Option C: Create Default Configurations**

```bash
# Run seed script if you have one
$env:DATABASE_URL="your-production-db-url"
npm run db:seed
```

### Step 7: Add to Vercel Environment Variables

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Add**:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxxx-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
   ```
3. **Set environment**: Select **Production** only
4. **Save**

### Step 8: Test Connection from Vercel

After deploying to Vercel:
1. Check build logs for database connection
2. Test a database query in your app
3. Verify no connection errors

---

## 🔒 Security Best Practices

### 1. Connection String Security
- ✅ **Never commit** connection strings to Git
- ✅ Use **environment variables** only
- ✅ Use **pooled connection string** for serverless (Vercel)

### 2. Database Access
- ✅ Use **read-only credentials** for analytics (if needed)
- ✅ Limit **IP access** if possible (Neon.tech allows all by default for serverless)
- ✅ Enable **SSL** (already in connection string with `?sslmode=require`)

### 3. Backup Strategy
- ✅ Neon.tech provides **automatic backups** (check your plan)
- ✅ Consider **manual exports** before major changes
- ✅ Test **restore process** periodically

---

## 📊 Database Size Considerations

### Free Tier Limits (Neon.tech)
- **Storage**: 0.5 GB
- **Compute**: Shared
- **Connections**: Limited

### Production Recommendations
- **Storage**: Monitor usage, upgrade if needed
- **Compute**: Consider paid tier for better performance
- **Connections**: Use connection pooling (PgBouncer) - **CRITICAL**

---

## 🔧 Troubleshooting

### Issue: Connection Timeout
**Solution**: 
- Ensure using **pooled connection string** (`-pooler` in URL)
- Check Neon.tech project is active
- Verify connection string is correct

### Issue: Migration Fails
**Solution**:
- Check PostgreSQL version compatibility (14+)
- Verify connection string has proper permissions
- Check for existing tables (might need to drop first if migrating from different schema)

### Issue: "Too many connections"
**Solution**:
- **Use connection pooling** (PgBouncer)
- Check for connection leaks in code
- Consider upgrading Neon.tech plan

### Issue: SSL Connection Error
**Solution**:
- Ensure `?sslmode=require` is in connection string
- Check Neon.tech SSL settings

---

## ✅ Production Checklist

- [ ] Neon.tech project created
- [ ] Connection string obtained
- [ ] Connection pooling enabled
- [ ] Pooled connection string copied
- [ ] Migrations run successfully
- [ ] All tables created (verify with Prisma Studio)
- [ ] Initial data seeded (if needed)
- [ ] Connection string added to Vercel
- [ ] Connection tested from Vercel
- [ ] Backup strategy confirmed

---

## 📝 Connection String Format

### Standard Connection (for local development)
```
postgresql://username:password@ep-xxxx-xxxx.region.aws.neon.tech/dbname?sslmode=require
```

### Pooled Connection (for Vercel/production)
```
postgresql://username:password@ep-xxxx-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
```

**Important**: Always use the **pooled connection string** for Vercel deployments!

---

## 🚀 Next Steps

After database setup:
1. ✅ Add `DATABASE_URL` to Vercel environment variables
2. ✅ Deploy to Vercel
3. ✅ Test database operations
4. ✅ Monitor connection usage
5. ✅ Set up database backups

---

**Ready to create your production database?** Follow the steps above! 🎯

