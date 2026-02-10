# Update DATABASE_URL in .env

## Current (Wrong) Connection String
```
postgresql://neondb_owner:npg_lUk15EuLnxoS@ep-autumn-bird-aga01zg5-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## New (Correct) Connection String
```
postgresql://neondb_owner:YOUR_PASSWORD@ep-round-flower-abq5i4zf-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Steps to Update

1. **Open `.env` file** in your editor
2. **Find the line** starting with `DATABASE_URL=`
3. **Replace it** with your correct connection string from Neon Dashboard
4. **Save the file**
5. **Run migration**: `npx prisma db push`

## Or Use This Command (if you provide the full connection string)

I can update it for you if you provide the complete connection string with the actual password.

