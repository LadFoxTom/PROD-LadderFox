# 🔒 Fix "Not Secure" Warning for ladderfox.com

## Problem
`ladderfox.com` shows "Not secure" while `www.ladderfox.com` works correctly.

## Solution Steps

### Step 1: Verify Domain in Vercel

1. Go to your Vercel project: https://vercel.com/toms-projects-6d758fc9/ladderfox-prod/settings/domains
2. Check if **both** domains are added:
   - ✅ `ladderfox.com`
   - ✅ `www.ladderfox.com`

### Step 2: Check DNS Records in Namecheap

1. Go to Namecheap → Domain List → `ladderfox.com` → **Advanced DNS**
2. Verify you have these records:

**For ladderfox.com (root domain):**
- **Type**: A Record
- **Host**: `@`
- **Value**: `76.76.21.21` (Vercel's IP)
- **TTL**: Automatic

**For www.ladderfox.com:**
- **Type**: CNAME Record
- **Host**: `www`
- **Value**: `cname.vercel-dns.com.`
- **TTL**: Automatic

### Step 3: Force SSL Certificate Provisioning

1. In Vercel → **Settings** → **Domains**
2. Find `ladderfox.com` in the list
3. Click the **three dots** (⋯) next to it
4. Select **"Remove"** (don't worry, we'll add it back)
5. Wait 30 seconds
6. Click **"Add Domain"** again
7. Enter: `ladderfox.com`
8. Vercel will automatically provision a new SSL certificate

### Step 4: Wait for SSL Certificate

- SSL certificates usually provision within **5-15 minutes**
- You can check status in Vercel → Domains
- Look for a green checkmark ✅ next to the domain

### Step 5: Verify DNS Propagation

Use these tools to check if DNS is correct:
- https://dnschecker.org/#A/ladderfox.com
- https://www.whatsmydns.net/#A/ladderfox.com

All servers should show: `76.76.21.21`

### Step 6: Test HTTPS

After SSL is provisioned:
1. Visit: `https://ladderfox.com`
2. You should see a **lock icon** 🔒 in the browser
3. No "Not secure" warning

## Alternative: Redirect Non-WWW to WWW

If you prefer to always use `www.ladderfox.com`:

1. In Vercel → **Settings** → **Domains**
2. Find `ladderfox.com`
3. Click the **three dots** (⋯)
4. Select **"Configure"**
5. Enable **"Redirect to www"**

This will automatically redirect `ladderfox.com` → `www.ladderfox.com`

## Troubleshooting

### SSL Certificate Not Provisioning

**Common causes:**
1. DNS not pointing to Vercel correctly
2. Domain verification failed
3. Certificate provisioning in progress (wait longer)

**Solutions:**
- Double-check DNS records match Vercel's instructions exactly
- Remove and re-add the domain in Vercel
- Wait up to 24 hours for full propagation

### Still Seeing "Not Secure"

1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Try incognito/private mode**
3. **Check for mixed content**: Ensure all resources load over HTTPS
4. **Verify certificate**: Click the lock icon → Certificate → Check validity

### DNS Propagation Issues

If DNS isn't propagating:
- Wait up to 24-48 hours (usually much faster)
- Check with multiple DNS checker tools
- Verify TTL settings (lower TTL = faster updates)

## Quick Checklist

- [ ] Both `ladderfox.com` and `www.ladderfox.com` added in Vercel
- [ ] DNS A record for `@` points to `76.76.21.21`
- [ ] DNS CNAME for `www` points to `cname.vercel-dns.com.`
- [ ] SSL certificate shows as "Valid" in Vercel
- [ ] Tested `https://ladderfox.com` in browser
- [ ] No "Not secure" warning appears

## Need Help?

If issues persist:
1. Check Vercel deployment logs
2. Verify domain ownership in Vercel
3. Contact Vercel support if SSL won't provision
