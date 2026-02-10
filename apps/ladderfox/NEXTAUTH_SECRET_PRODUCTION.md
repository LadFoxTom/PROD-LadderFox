# 🔐 NEXTAUTH_SECRET for Production

## ✅ Generated Secret

Your production `NEXTAUTH_SECRET`:

```
d9WUT+YPaF55Pm3ohBxggXfdfW1LonmJKg5EqXlrqAs=
```

---

## 📋 How to Use

### 1. Add to Vercel Environment Variables

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Click **Add New**
3. Add:
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: `d9WUT+YPaF55Pm3ohBxggXfdfW1LonmJKg5EqXlrqAs=`
   - **Environment**: Select **Production** only
4. Click **Save**

### 2. Important Notes

- ✅ **Keep this secret secure** - never commit to Git
- ✅ **Different from UAT** - UAT should have a different secret
- ✅ **Production only** - don't use this for development/UAT
- ✅ **Don't share** - keep it private

---

## 🔄 Generate Another Secret (if needed)

If you need to generate another secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or use an online generator:
- https://generate-secret.vercel.app/32

---

## ✅ Verification

After adding to Vercel:
- ✅ `NEXTAUTH_URL=https://www.ladderfox.com` (also in Vercel)
- ✅ `NEXTAUTH_SECRET=d9WUT+YPaF55Pm3ohBxggXfdfW1LonmJKg5EqXlrqAs=` (in Vercel)
- ✅ Deploy to production
- ✅ Test Google OAuth sign-in

---

**Your NEXTAUTH_SECRET is ready for production!** 🔐

