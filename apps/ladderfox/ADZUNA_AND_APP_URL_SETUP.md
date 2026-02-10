# 📋 Adzuna API & NEXT_PUBLIC_APP_URL Setup

## 🔍 What Are These?

### Adzuna API
- **Purpose**: Third-party job search API service
- **Used for**: Job search functionality in your CV chat agent
- **API Keys**: `ADZUNA_APP_ID` and `ADZUNA_API_KEY`

### NEXT_PUBLIC_APP_URL
- **Purpose**: Your application's public URL (used for CORS and redirects)
- **Used in**: Middleware for CORS configuration
- **Current value**: `http://localhost:3000` (development)

---

## ✅ Adzuna API Keys

### Can You Use the Same Keys for Production?

**Yes!** ✅ You can use the same Adzuna API keys for both UAT and production.

**Why?**
- Adzuna API keys are **not environment-specific**
- They're just API credentials that authenticate your requests
- Same keys work for both development and production
- No need to create separate keys

### What to Do

1. **Keep your existing Adzuna keys** from `.env`
2. **Add them to Vercel** environment variables:
   ```env
   ADZUNA_APP_ID=<your-app-id>
   ADZUNA_API_KEY=<your-api-key>
   ```
3. **That's it!** Same keys work everywhere

### Where to Get Adzuna Keys

If you need to get or verify your keys:
- Go to: https://developer.adzuna.com/
- Sign in to your account
- View your API credentials

---

## 🌐 NEXT_PUBLIC_APP_URL

### What It Is

`NEXT_PUBLIC_APP_URL` is your application's public URL. It's used for:
- **CORS configuration** (in middleware)
- **Redirect URLs** (if needed)
- **Public-facing URLs** in your app

### Current Value

In your `.env`:
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

This is for **local development**.

### Production Value

For production, set it to:
```env
NEXT_PUBLIC_APP_URL="https://www.ladderfox.com"
```

### What to Do

1. **Update in Vercel** environment variables:
   ```env
   NEXT_PUBLIC_APP_URL=https://www.ladderfox.com
   ```
2. **Keep local value** in `.env` for development:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Why NEXT_PUBLIC_?

The `NEXT_PUBLIC_` prefix means this variable is:
- ✅ Exposed to the browser (client-side)
- ✅ Available in both server and client code
- ⚠️ **Public** - don't put secrets here!

---

## 📋 Summary

### Adzuna API Keys
- ✅ **Use same keys** for UAT and production
- ✅ **No changes needed** - just add to Vercel
- ✅ **Environment variables**:
  ```env
  ADZUNA_APP_ID=<your-app-id>
  ADZUNA_API_KEY=<your-api-key>
  ```

### NEXT_PUBLIC_APP_URL
- ✅ **Update for production**: `https://www.ladderfox.com`
- ✅ **Keep local value**: `http://localhost:3000` (for development)
- ✅ **Add to Vercel**:
  ```env
  NEXT_PUBLIC_APP_URL=https://www.ladderfox.com
  ```

---

## 🚀 Vercel Environment Variables

Add these to Vercel:

```env
# Adzuna (same as UAT)
ADZUNA_APP_ID=<your-app-id>
ADZUNA_API_KEY=<your-api-key>

# App URL (production)
NEXT_PUBLIC_APP_URL=https://www.ladderfox.com
```

**Set for Production environment only** (or both Production and Preview if you want).

---

## ✅ Checklist

- [ ] Adzuna API keys: Same as UAT ✅
- [ ] NEXT_PUBLIC_APP_URL: Update to `https://www.ladderfox.com`
- [ ] Add both to Vercel environment variables
- [ ] Set for Production environment

---

**You're all set!** 🎯

