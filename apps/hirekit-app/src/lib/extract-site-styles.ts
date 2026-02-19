import { browserPool } from './browser-pool';

interface ExtractedStyles {
  /** Computed colors from key page elements, keyed by element role */
  computedColors: Record<string, { background: string; color: string; borderColor?: string }>;
  /** Base64-encoded JPEG screenshot of the viewport */
  screenshotBase64: string;
  /** Font families from computed styles (full CSS font-family strings) */
  fontFamilies: string[];
  /** Actually loaded/rendered font names from document.fonts API */
  loadedFonts: string[];
  /** CSS custom properties from :root */
  cssVariables: Record<string, string>;
  /** All unique non-white/black/transparent colors found */
  uniqueColors: string[];
  /** Button/CTA styles */
  ctaStyles: { background: string; color: string; borderRadius: string }[];
}

function rgbToHex(rgb: string): string {
  // Handle "rgba(r, g, b, a)" and "rgb(r, g, b)"
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

export async function extractSiteStyles(url: string): Promise<ExtractedStyles> {
  const page = await browserPool.getPage();

  try {
    await page.setViewport({ width: 1440, height: 900 });

    // Block heavy resources we don't need (but allow fonts for document.fonts API)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['media', 'websocket'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 15000,
    });

    // Wait for fonts to load and any late CSS animations / transitions
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));

    // Dismiss cookie consent banners / overlays
    await page.evaluate(() => {
      // Common cookie consent button selectors
      const acceptSelectors = [
        // Generic patterns
        'button[id*="accept"]', 'button[id*="Accept"]',
        'button[id*="agree"]', 'button[id*="Agree"]',
        'button[id*="consent"]', 'button[id*="Consent"]',
        'a[id*="accept"]', 'a[id*="Accept"]',
        // Class patterns
        'button[class*="accept"]', 'button[class*="Accept"]',
        'button[class*="agree"]', 'button[class*="consent"]',
        '.cookie-accept', '.cookie-consent-accept',
        '.cc-accept', '.cc-allow', '.cc-dismiss',
        // OneTrust (used by many corporate sites including Eurofins)
        '#onetrust-accept-btn-handler',
        '.onetrust-close-btn-handler',
        '#accept-recommended-btn-handler',
        // Cookiebot
        '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
        '#CybotCookiebotDialogBodyButtonAccept',
        // Common CMP frameworks
        '.cmp-accept', '.cmp-accept-all',
        '[data-testid="cookie-accept"]',
        '[data-action="accept"]',
        // Text-based matching
        'button',
      ];

      for (const sel of acceptSelectors) {
        const elements = document.querySelectorAll(sel);
        for (const el of elements) {
          const text = el.textContent?.toLowerCase().trim() || '';
          if (sel === 'button' && !/(accept|agree|allow|ok|got it|i understand|consent)/i.test(text)) {
            continue; // Only click generic buttons if they have accept-like text
          }
          if (el instanceof HTMLElement && el.offsetParent !== null) {
            el.click();
            return; // Click first matching visible button and stop
          }
        }
      }

      // Fallback: remove common overlay/modal elements
      const overlaySelectors = [
        '#onetrust-consent-sdk', '#onetrust-banner-sdk',
        '#CybotCookiebotDialog', '#CybotCookiebotDialogBodyUnderlay',
        '.cookie-banner', '.cookie-consent', '.cookie-modal',
        '.cc-window', '.cc-banner',
        '[class*="cookie-overlay"]', '[class*="consent-overlay"]',
        '[class*="gdpr"]', '[class*="privacy-banner"]',
      ];
      for (const sel of overlaySelectors) {
        document.querySelectorAll(sel).forEach(el => el.remove());
      }
    });

    // Wait for overlays to close/animate away
    await new Promise(r => setTimeout(r, 1000));

    // Scroll down and back up to trigger any lazy-loaded hero content
    await page.evaluate(() => {
      window.scrollTo(0, 600);
    });
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await new Promise(r => setTimeout(r, 500));

    // Extract computed styles from the rendered page
    const extracted = await page.evaluate(() => {
      const results: Record<string, { background: string; color: string; borderColor?: string }> = {};
      const fontFamilies = new Set<string>();
      const cssVars: Record<string, string> = {};
      const allColors = new Set<string>();
      const ctaStyles: { background: string; color: string; borderRadius: string }[] = [];

      function getStyles(el: Element) {
        return window.getComputedStyle(el);
      }

      function isVisible(el: Element): boolean {
        const style = getStyles(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      }

      function isNeutralOrTransparent(color: string): boolean {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return true;
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return false;
        const [, r, g, b] = match.map(Number);
        // Pure white, near-white, pure black, near-black
        if (r > 240 && g > 240 && b > 240) return true;
        if (r < 15 && g < 15 && b < 15) return true;
        return false;
      }

      function addColor(color: string) {
        if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') {
          allColors.add(color);
        }
      }

      // Body
      const body = document.body;
      const bodyStyle = getStyles(body);
      results['body'] = {
        background: bodyStyle.backgroundColor,
        color: bodyStyle.color,
      };
      fontFamilies.add(bodyStyle.fontFamily);
      addColor(bodyStyle.backgroundColor);
      addColor(bodyStyle.color);

      // Header / Nav
      const headerSelectors = ['header', 'nav', '[role="banner"]', '.header', '.navbar', '.nav', '#header', '#navbar'];
      for (const sel of headerSelectors) {
        const el = document.querySelector(sel);
        if (el && isVisible(el)) {
          const s = getStyles(el);
          results[`header(${sel})`] = { background: s.backgroundColor, color: s.color };
          addColor(s.backgroundColor);
          addColor(s.color);
          break;
        }
      }

      // Hero / large sections
      const sections = document.querySelectorAll('section, [class*="hero"], [class*="banner"], [class*="jumbotron"], .et_pb_section');
      let heroCount = 0;
      sections.forEach((el) => {
        if (heroCount >= 3 || !isVisible(el)) return;
        const s = getStyles(el);
        const bg = s.backgroundColor;
        if (!isNeutralOrTransparent(bg)) {
          results[`section-${heroCount}`] = { background: bg, color: s.color };
          addColor(bg);
          addColor(s.color);
          heroCount++;
        }
      });

      // Also check div-based sections (common in page builders like Divi)
      const divSections = document.querySelectorAll('div[class*="section"], div[class*="row"], div[class*="container"]');
      let divCount = 0;
      divSections.forEach((el) => {
        if (divCount >= 3 || !isVisible(el)) return;
        const s = getStyles(el);
        const bg = s.backgroundColor;
        if (!isNeutralOrTransparent(bg)) {
          results[`div-section-${divCount}`] = { background: bg, color: s.color };
          addColor(bg);
          addColor(s.color);
          divCount++;
        }
      });

      // Buttons / CTAs
      const btnSelectors = [
        'a[class*="btn"]', 'a[class*="button"]', 'a[class*="cta"]',
        'button[class*="btn"]', 'button[class*="button"]',
        '.et_pb_button', '.wp-block-button__link',
        'a.btn', 'button.btn',
      ];
      const seenBtnColors = new Set<string>();
      for (const sel of btnSelectors) {
        document.querySelectorAll(sel).forEach((el) => {
          if (!isVisible(el)) return;
          const s = getStyles(el);
          const bg = s.backgroundColor;
          if (!isNeutralOrTransparent(bg) && !seenBtnColors.has(bg)) {
            seenBtnColors.add(bg);
            ctaStyles.push({
              background: bg,
              color: s.color,
              borderRadius: s.borderRadius,
            });
            addColor(bg);
            addColor(s.color);
          }
        });
      }

      // Links — sample first 20
      const links = document.querySelectorAll('a');
      const linkColors = new Set<string>();
      let linkCount = 0;
      links.forEach((el) => {
        if (linkCount >= 20 || !isVisible(el)) return;
        const s = getStyles(el);
        if (!isNeutralOrTransparent(s.color)) {
          linkColors.add(s.color);
          addColor(s.color);
        }
        linkCount++;
      });
      if (linkColors.size > 0) {
        results['links'] = {
          background: 'transparent',
          color: [...linkColors][0], // Most common link color
        };
      }

      // Cards
      const cardSelectors = ['.card', '[class*="card"]', '[class*="post"]', '.et_pb_module'];
      for (const sel of cardSelectors) {
        const el = document.querySelector(sel);
        if (el && isVisible(el)) {
          const s = getStyles(el);
          results['card'] = {
            background: s.backgroundColor,
            color: s.color,
            borderColor: s.borderColor,
          };
          addColor(s.backgroundColor);
          addColor(s.borderColor);
          break;
        }
      }

      // Footer
      const footer = document.querySelector('footer') || document.querySelector('[class*="footer"]');
      if (footer && isVisible(footer)) {
        const s = getStyles(footer);
        results['footer'] = { background: s.backgroundColor, color: s.color };
        addColor(s.backgroundColor);
        addColor(s.color);
      }

      // CSS custom properties from :root
      const rootStyle = getStyles(document.documentElement);
      const colorProps = [
        '--primary', '--secondary', '--accent', '--brand',
        '--bg', '--background', '--text', '--color',
        '--main', '--highlight', '--link',
      ];
      // Try common variable naming patterns
      for (const prefix of ['', '-wp', '-theme', '-site', '-divi']) {
        for (const prop of colorProps) {
          const val = rootStyle.getPropertyValue(`${prefix}${prop}`).trim();
          if (val) {
            cssVars[`${prefix}${prop}`] = val;
            addColor(val);
          }
        }
      }

      // Heading styles
      const h1 = document.querySelector('h1');
      if (h1 && isVisible(h1)) {
        const s = getStyles(h1);
        results['h1'] = { background: 'transparent', color: s.color };
        fontFamilies.add(s.fontFamily);
        addColor(s.color);
      }

      // Also check h2, h3, p, nav for font diversity
      for (const tag of ['h2', 'h3', 'p', 'nav', 'a', 'span']) {
        const el = document.querySelector(tag);
        if (el && isVisible(el)) {
          fontFamilies.add(getStyles(el).fontFamily);
        }
      }

      // Check actually loaded/rendered fonts via document.fonts API
      const loadedFonts: string[] = [];
      try {
        document.fonts.forEach((font) => {
          // Include loaded fonts, skip icon fonts
          const name = font.family.replace(/['"]/g, '');
          const isIconFont = /icon|awesome|etmodule|material|symbol|glyph|icomoon/i.test(name);
          if (!isIconFont) {
            loadedFonts.push(name);
          }
        });
      } catch {
        // Older browsers may not support this
      }

      // Fallback: extract @font-face family names from stylesheets
      const fontFaceFamilies: string[] = [];
      try {
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule instanceof CSSFontFaceRule) {
                const family = rule.style.getPropertyValue('font-family').replace(/['"]/g, '').trim();
                if (family && !/icon|awesome|etmodule|material|symbol|glyph|icomoon/i.test(family)) {
                  fontFaceFamilies.push(family);
                }
              }
            }
          } catch {
            // CORS: can't read cross-origin stylesheets
          }
        }
      } catch {
        // Stylesheet access not available
      }

      // Merge all font sources, deduplicated
      const allLoadedFonts = [...new Set([...loadedFonts, ...fontFaceFamilies])];

      return {
        computedColors: results,
        fontFamilies: [...fontFamilies],
        loadedFonts: allLoadedFonts,
        cssVariables: cssVars,
        uniqueColors: [...allColors],
        ctaStyles,
      };
    });

    // Take screenshot — higher quality for better AI analysis
    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 80,
      fullPage: false,
    });
    const screenshotBase64 = Buffer.from(screenshotBuffer).toString('base64');

    // Convert all RGB values to hex for consistency
    const hexComputedColors: Record<string, { background: string; color: string; borderColor?: string }> = {};
    for (const [key, val] of Object.entries(extracted.computedColors)) {
      hexComputedColors[key] = {
        background: rgbToHex(val.background),
        color: rgbToHex(val.color),
        ...(val.borderColor ? { borderColor: rgbToHex(val.borderColor) } : {}),
      };
    }

    const hexUniqueColors = extracted.uniqueColors.map(rgbToHex).filter((c, i, arr) => arr.indexOf(c) === i);
    const hexCtaStyles = extracted.ctaStyles.map(s => ({
      background: rgbToHex(s.background),
      color: rgbToHex(s.color),
      borderRadius: s.borderRadius,
    }));

    console.log('\n=== Puppeteer Style Extraction ===');
    console.log(`URL: ${url}`);
    console.log(`Computed colors:`, JSON.stringify(hexComputedColors, null, 2));
    console.log(`Font families (computed):`, extracted.fontFamilies);
    console.log(`Loaded fonts (document.fonts):`, extracted.loadedFonts);
    console.log(`CSS variables:`, extracted.cssVariables);
    console.log(`Unique colors (${hexUniqueColors.length}):`, hexUniqueColors.slice(0, 30).join(', '));
    console.log(`CTA styles:`, hexCtaStyles);
    console.log(`Screenshot size: ${Math.round(screenshotBase64.length / 1024)}KB`);

    return {
      computedColors: hexComputedColors,
      screenshotBase64,
      fontFamilies: extracted.fontFamilies,
      loadedFonts: extracted.loadedFonts,
      cssVariables: extracted.cssVariables,
      uniqueColors: hexUniqueColors,
      ctaStyles: hexCtaStyles,
    };
  } finally {
    await browserPool.releasePage(page);
  }
}
