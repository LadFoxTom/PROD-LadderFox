# Favicon Setup Guide for LadderFox

## ✅ Current Status

**SVG favicon is already set up and working!** The LF logo favicon should now appear in your browser tab.

## 🎨 Generated Files

I've created the following files based on your LF logo:

- ✅ `public/favicon.svg` - SVG favicon (works in modern browsers)
- ✅ `public/icon.svg` - High-res SVG for generating other formats
- ✅ `public/generate-favicons.html` - Browser-based generator tool

## 📦 Generate PNG/ICO Files

### Option 1: Use the HTML Generator (Easiest - No Installation)

1. Open `public/generate-favicons.html` in your browser
2. Click the download buttons for each size
3. Save the files to the `public` directory

### Option 2: Use Node.js Script

1. Install sharp: `npm install sharp`
2. Run: `node scripts/generate-favicons.js`
3. Files will be generated in the `public` directory

### Option 3: Online Converter

1. Go to https://realfavicongenerator.net/
2. Upload `public/icon.svg`
3. Download all generated files
4. Place them in the `public` directory

## 📁 Required Files (for full compatibility)

Place these files in the `public` directory:

1. **favicon.ico** - Main favicon (16x16, 32x32, 48x48 sizes)
2. **icon-192.png** - 192x192 pixels PNG (for Android)
3. **icon-512.png** - 512x512 pixels PNG (for PWA)
4. **apple-icon.png** - 180x180 pixels PNG (for iOS)

## 🎯 Current Logo Design

The favicon matches your LF logo:
- **Gradient**: Blue (#3b82f6) to Purple (#9333ea)
- **Text**: White "LF" letters
- **Shape**: Rounded square (rounded-lg style)

## 🧪 Test

1. The SVG favicon should work immediately
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the browser tab - you should see the LF logo

## 📝 Notes

- SVG favicons work in Chrome, Firefox, Safari, and Edge
- PNG/ICO files provide better compatibility with older browsers
- The HTML generator creates PNG files - convert to ICO using https://convertio.co/png-ico/ if needed
