# 🔐 Google OAuth / NextAuth Production Setup

## Overview

You need to add your production domain (`www.ladderfox.com`) to Google Cloud Console OAuth credentials so users can sign in with Google on production.

---

## 📋 Step-by-Step Guide

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the same one used for UAT)
3. Navigate to **APIs & Services** → **Credentials**

### Step 2: Edit OAuth 2.0 Client

1. Find your **OAuth 2.0 Client ID** (the one used for UAT)
2. Click **Edit** (pencil icon)

### Step 3: Add Production Authorized Domains

In the **Authorized JavaScript origins** section, add:
```
https://www.ladderfox.com
https://ladderfox.com
```

**Note**: You can keep the UAT domain:
```
https://uat.ladderfox.com  (keep this)
```

### Step 4: Add Production Redirect URIs

In the **Authorized redirect URIs** section, add:
```
https://www.ladderfox.com/api/auth/callback/google
https://ladderfox.com/api/auth/callback/google
```

**Note**: You can keep the UAT redirect URI:
```
https://uat.ladderfox.com/api/auth/callback/google  (keep this)
```

### Step 5: Save Changes

Click **Save** at the bottom of the page.

---

## 🔑 Environment Variables

### For Production (Vercel)

You'll need to add these to Vercel environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=https://www.ladderfox.com
NEXTAUTH_SECRET=<generate-new-secret-for-production>

# Google OAuth (same credentials as UAT, but production domain added)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### Generate New NEXTAUTH_SECRET

**Important**: Generate a new `NEXTAUTH_SECRET` for production (different from UAT):

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

---

## ✅ Verification Checklist

- [ ] Production domain added to **Authorized JavaScript origins**
- [ ] Production redirect URI added to **Authorized redirect URIs**
- [ ] UAT domain/redirect URI still present (for testing)
- [ ] New `NEXTAUTH_SECRET` generated for production
- [ ] `NEXTAUTH_URL` set to `https://www.ladderfox.com` in Vercel
- [ ] `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` added to Vercel

---

## 🔍 Current Configuration

Your NextAuth setup in `src/lib/auth.ts` uses:
- `GOOGLE_CLIENT_ID` from environment variable
- `GOOGLE_CLIENT_SECRET` from environment variable
- `NEXTAUTH_SECRET` from environment variable
- `NEXTAUTH_URL` for callback URLs (automatically used by NextAuth)

**No code changes needed!** Just update Google Cloud Console and environment variables.

---

## 🚨 Important Notes

### Same OAuth Credentials for UAT and Production

**You can use the same Google OAuth Client ID and Secret for both UAT and production** - just add both domains to the authorized origins and redirect URIs.

### Why This Works

- Google OAuth allows multiple authorized domains/redirect URIs
- NextAuth automatically uses the correct redirect URI based on `NEXTAUTH_URL`
- Same credentials work for both environments

### Security

- Keep `NEXTAUTH_SECRET` different between UAT and production
- Never commit secrets to Git
- Use Vercel environment variables for production

---

## 🧪 Testing

After deployment:

1. **Test Google Sign-In**:
   - Go to `https://www.ladderfox.com`
   - Click "Sign in with Google"
   - Should redirect to Google OAuth consent screen
   - After approval, should redirect back to production site

2. **Verify Session**:
   - Check that user session is created
   - Verify user data in database

---

## 📝 Quick Reference

### Google Cloud Console URLs:
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent

### NextAuth Documentation:
- https://next-auth.js.org/configuration/providers/oauth
- https://next-auth.js.org/configuration/options

---

## 🆘 Troubleshooting

### Error: "redirect_uri_mismatch"
- **Cause**: Production redirect URI not added to Google OAuth credentials
- **Fix**: Add `https://www.ladderfox.com/api/auth/callback/google` to authorized redirect URIs

### Error: "invalid_client"
- **Cause**: Wrong `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET`
- **Fix**: Verify credentials in Vercel environment variables match Google Cloud Console

### Error: "NEXTAUTH_URL mismatch"
- **Cause**: `NEXTAUTH_URL` in Vercel doesn't match actual domain
- **Fix**: Set `NEXTAUTH_URL=https://www.ladderfox.com` in Vercel

---

**Once you've added the production domain to Google Cloud Console, you're ready to deploy!** 🚀

