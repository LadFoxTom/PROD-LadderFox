import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { extractSiteStyles } from '@/lib/extract-site-styles';

const STYLE_ANALYZER_PROMPT = `You are a web design analyzer. You receive computed styles from a fully-rendered webpage (via headless browser) AND a screenshot. Extract visual design tokens for a job listing widget that matches the site's brand.

## How to Analyze

1. **SCREENSHOT is your PRIMARY source** — look at it carefully to identify:
   - The overall color scheme (light or dark background?)
   - The brand/accent color (colored buttons, links, logos, highlighted elements)
   - The typography and general feel

2. **Computed style data supplements** the screenshot — use it for exact hex values when available

3. **If the screenshot shows a cookie consent banner or overlay**, look PAST it at the page content behind/around it

## Color Selection Rules

- **bgColor**: The dominant page background. Most corporate/professional sites use LIGHT backgrounds (#f5f5f5, #ffffff, #f8f9fa). Only use dark if the site is clearly dark-themed.
- **surfaceColor**: Card backgrounds. For light themes → #ffffff. For dark themes → noticeably lighter than bgColor.
- **accentColor**: The primary BRAND color — look for colored buttons, nav highlights, logos, links. Must NOT be black, white, or gray. Every brand has a color — find it.
- **textColor**: Primary text. Dark on light backgrounds (#1a1a1a to #333333), light on dark backgrounds.
- **textSecondary/textMuted**: Progressively lighter/more muted versions of textColor.
- **badgeBg**: A very light tint of the accent color (e.g., if accent is #0078D4, badge could be #e6f2ff).
- **borderColor**: Subtle, visible border. For light themes: #e0e0e0 range. For dark themes: lighter than surface.

## Contrast Requirements
- surfaceColor must be visibly different from bgColor (min 1.3:1 contrast ratio)
- textColor must be readable on surfaceColor (min 4.5:1 for WCAG AA)
- badgeText must be readable on badgeBg

## Font Instructions
- Use "Actually loaded fonts" list as PRIMARY source (from document.fonts API)
- Ignore icon fonts (FontAwesome, ETmodules, Material Icons, etc.)
- Format: "'Font Name', Arial, sans-serif"
- googleFontsName: exact Google Fonts name or null

Return ONLY valid JSON:
{
  "fontFamily": "CSS font-family stack from actual loaded fonts",
  "googleFontsName": "Google Fonts name or null",
  "bgColor": "#hex - page background",
  "surfaceColor": "#hex - card background, contrasts with bgColor",
  "textColor": "#hex - primary text, readable on surfaceColor",
  "textSecondary": "#hex - secondary text",
  "textMuted": "#hex - muted text",
  "borderColor": "#hex - subtle border",
  "accentColor": "#hex - brand color, NOT gray/black/white",
  "accentColorHover": "#hex - darker/lighter accent variant",
  "badgeBg": "#hex - light tint of accent",
  "badgeText": "#hex - readable on badgeBg",
  "borderRadius": "e.g. 12px",
  "borderRadiusSm": "e.g. 6px",
  "cardStyle": "bordered | shadow | accent-left | flat",
  "shadowStyle": "CSS box-shadow or none",
  "shadowLgStyle": "larger shadow or none"
}`;

const TEMPLATE_GENERATOR_PROMPT = `You are a CSS template generator for an embeddable job listing widget.

The widget has this structure:
- Background container uses --hk-bg
- Job CARDS sit on top of the background and use --hk-surface for their background
- Cards contain title (--hk-text), meta badges (--hk-badge-bg/text), salary, date (--hk-text-muted), and an Apply button (--hk-primary)
- A header bar shows company name and job count
- Filter inputs (search, dropdowns) use --hk-surface background

Given design tokens, generate CSS custom properties following this exact pattern:

:host(.hk-tpl-custom) {
  --hk-bg: <bgColor>;
  --hk-surface: <surfaceColor>;
  --hk-text: <textColor>;
  --hk-text-secondary: <textSecondary>;
  --hk-text-muted: <textMuted>;
  --hk-border: <borderColor>;
  --hk-primary: <accentColor>;
  --hk-primary-hover: <accentColorHover>;
  --hk-badge-bg: <badgeBg>;
  --hk-badge-text: <badgeText>;
  --hk-radius: <borderRadius>;
  --hk-radius-sm: <borderRadiusSm>;
  --hk-shadow: <shadowStyle>;
  --hk-shadow-lg: <shadowLgStyle>;
  --hk-font: <fontFamily>;
}

You may also add targeted component overrides using these selectors ONLY:
- :host(.hk-tpl-custom) .hk-card { }
- :host(.hk-tpl-custom) .hk-card-title { }
- :host(.hk-tpl-custom) .hk-badge { }
- :host(.hk-tpl-custom) .hk-btn { }
- :host(.hk-tpl-custom) .hk-header { }
- :host(.hk-tpl-custom) .hk-header-title { }

Keep overrides minimal — prefer CSS variables over direct styles.
IMPORTANT: The values MUST come directly from the provided design tokens. Do NOT invent new colors.

Return ONLY a valid JSON object:
{
  "name": "Matched to <domain>",
  "css": "<the full CSS string>",
  "fontUrl": "Google Fonts URL or null",
  "layout": "cards or list"
}`;

// --- Contrast validation utilities ---
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('');
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function isDark(hex: string): boolean {
  return luminance(hex) < 0.2;
}

/** Check if a color is chromatic (not gray/black/white) */
function isChromatic(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  return saturation > 0.15; // needs at least 15% saturation to count as "colorful"
}

/** Ensure design tokens have proper contrast for readability */
function validateAndFixContrast(tokens: Record<string, string>): Record<string, string> {
  const fixed = { ...tokens };

  // Ensure bgColor and surfaceColor have enough contrast
  if (fixed.bgColor && fixed.surfaceColor) {
    const bgSurfaceContrast = contrastRatio(fixed.bgColor, fixed.surfaceColor);
    if (bgSurfaceContrast < 1.3) {
      // Not enough difference — fix it
      if (isDark(fixed.bgColor)) {
        // Dark theme: lighten surface significantly
        fixed.surfaceColor = lighten(fixed.bgColor, 0.15);
      } else {
        // Light theme: make surface white
        fixed.surfaceColor = '#ffffff';
      }
      console.log(`[Contrast Fix] bgColor↔surfaceColor was ${bgSurfaceContrast.toFixed(2)}, fixed surfaceColor to ${fixed.surfaceColor}`);
    }
  }

  // Ensure textColor is readable on surfaceColor (min 4.5:1)
  if (fixed.textColor && fixed.surfaceColor) {
    const textContrast = contrastRatio(fixed.textColor, fixed.surfaceColor);
    if (textContrast < 4.5) {
      fixed.textColor = isDark(fixed.surfaceColor) ? '#f1f5f9' : '#1e293b';
      console.log(`[Contrast Fix] textColor on surfaceColor was ${textContrast.toFixed(2)}, fixed textColor to ${fixed.textColor}`);
    }
  }

  // Ensure textSecondary is readable on surfaceColor (min 3:1)
  if (fixed.textSecondary && fixed.surfaceColor) {
    const secContrast = contrastRatio(fixed.textSecondary, fixed.surfaceColor);
    if (secContrast < 3) {
      fixed.textSecondary = isDark(fixed.surfaceColor) ? '#94a3b8' : '#64748b';
      console.log(`[Contrast Fix] textSecondary on surfaceColor was ${secContrast.toFixed(2)}, fixed to ${fixed.textSecondary}`);
    }
  }

  // Ensure textMuted is somewhat readable (min 2:1)
  if (fixed.textMuted && fixed.surfaceColor) {
    const mutedContrast = contrastRatio(fixed.textMuted, fixed.surfaceColor);
    if (mutedContrast < 2) {
      fixed.textMuted = isDark(fixed.surfaceColor) ? '#64748b' : '#94a3b8';
      console.log(`[Contrast Fix] textMuted on surfaceColor was ${mutedContrast.toFixed(2)}, fixed to ${fixed.textMuted}`);
    }
  }

  // Ensure borderColor is visible against surfaceColor
  if (fixed.borderColor && fixed.surfaceColor) {
    const borderContrast = contrastRatio(fixed.borderColor, fixed.surfaceColor);
    if (borderContrast < 1.3) {
      fixed.borderColor = isDark(fixed.surfaceColor) ? lighten(fixed.surfaceColor, 0.15) : darken(fixed.surfaceColor, 0.15);
      console.log(`[Contrast Fix] borderColor was ${borderContrast.toFixed(2)}, fixed to ${fixed.borderColor}`);
    }
  }

  // Ensure badgeText is readable on badgeBg (min 3:1)
  if (fixed.badgeText && fixed.badgeBg) {
    const badgeContrast = contrastRatio(fixed.badgeText, fixed.badgeBg);
    if (badgeContrast < 3) {
      fixed.badgeText = isDark(fixed.badgeBg) ? lighten(fixed.badgeBg, 0.6) : darken(fixed.badgeBg, 0.6);
      console.log(`[Contrast Fix] badgeText on badgeBg was ${badgeContrast.toFixed(2)}, fixed to ${fixed.badgeText}`);
    }
  }

  // Ensure accentColor is actually chromatic (not gray/black/white)
  if (fixed.accentColor && !isChromatic(fixed.accentColor)) {
    console.log(`[Contrast Fix] accentColor ${fixed.accentColor} is not chromatic — falling back to brand blue`);
    fixed.accentColor = '#4F46E5';
    fixed.accentColorHover = '#4338CA';
    fixed.badgeBg = '#EEF2FF';
    fixed.badgeText = '#4F46E5';
  }

  // Ensure badgeBg is a light tint, not the same as surface or bg
  if (fixed.badgeBg && fixed.surfaceColor) {
    const badgeSurfaceContrast = contrastRatio(fixed.badgeBg, fixed.surfaceColor);
    if (badgeSurfaceContrast < 1.1 && fixed.accentColor) {
      // Badge blends with surface — make it a tint of accent
      if (isDark(fixed.surfaceColor)) {
        fixed.badgeBg = darken(fixed.accentColor, 0.7);
      } else {
        fixed.badgeBg = lighten(fixed.accentColor, 0.85);
      }
      console.log(`[Contrast Fix] badgeBg was too similar to surfaceColor, tinted to ${fixed.badgeBg}`);
    }
  }

  return fixed;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { url, layout } = body;

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    // Step 1: Render page with Puppeteer and extract computed styles + screenshot
    console.log(`\n=== AI Template Generator — Puppeteer Mode ===`);
    console.log(`URL: ${url}`);

    const siteStyles = await extractSiteStyles(url);

    // Step 2: Agent 1 — Style Analyzer (with vision — use gpt-4o for better visual analysis)
    const llm = new ChatOpenAI({
      modelName: 'gpt-4o',
      temperature: 0.1,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Build structured computed style summary
    const colorSummary = Object.entries(siteStyles.computedColors)
      .map(([role, styles]) => {
        let line = `${role}: bg=${styles.background}, text=${styles.color}`;
        if (styles.borderColor) line += `, border=${styles.borderColor}`;
        return line;
      })
      .join('\n');

    const ctaSummary = siteStyles.ctaStyles.length > 0
      ? `\n\nCTA/Button styles:\n${siteStyles.ctaStyles.map((s, i) => `  Button ${i + 1}: bg=${s.background}, text=${s.color}, radius=${s.borderRadius}`).join('\n')}`
      : '';

    const varsSummary = Object.keys(siteStyles.cssVariables).length > 0
      ? `\n\nCSS Custom Properties:\n${Object.entries(siteStyles.cssVariables).map(([k, v]) => `  ${k}: ${v}`).join('\n')}`
      : '';

    // Extract clean primary font names from computed font-family strings
    const extractPrimaryFont = (ff: string): string => {
      // "Open Sans", Arial, sans-serif → Open Sans
      const first = ff.split(',')[0]?.trim().replace(/['"]/g, '');
      return first || ff;
    };
    const primaryFonts = [...new Set(siteStyles.fontFamilies.map(extractPrimaryFont))].filter(
      f => !['serif', 'sans-serif', 'monospace', 'cursive', 'system-ui', 'ui-sans-serif'].includes(f.toLowerCase())
    );

    const loadedFontsInfo = siteStyles.loadedFonts.length > 0
      ? `\n\nActually loaded fonts on this page (from document.fonts + @font-face — these are the REAL fonts rendered by the browser): ${siteStyles.loadedFonts.join(', ')}`
      : '';

    const primaryFontInfo = primaryFonts.length > 0
      ? `\n\nPrimary font names extracted from computed styles: ${primaryFonts.join(', ')}`
      : '';

    // Separate chromatic colors from neutrals to help the AI find brand colors
    const chromaticColors = siteStyles.uniqueColors.filter(c => {
      try { return isChromatic(c); } catch { return false; }
    });
    const neutralColors = siteStyles.uniqueColors.filter(c => {
      try { return !isChromatic(c); } catch { return true; }
    });

    const colorBreakdown = chromaticColors.length > 0
      ? `\n\nBRAND/ACCENT colors found (chromatic, non-gray): ${chromaticColors.slice(0, 20).join(', ')}\nNeutral colors found (grays/blacks/whites): ${neutralColors.slice(0, 15).join(', ')}`
      : `\n\nAll unique colors found: ${siteStyles.uniqueColors.slice(0, 40).join(', ')}`;

    const textInput = `## Computed Styles from Rendered Page\n${colorSummary}${ctaSummary}\n\nRaw font-family values from CSS: ${siteStyles.fontFamilies.join(' | ')}${primaryFontInfo}${loadedFontsInfo}${varsSummary}${colorBreakdown}`;

    // Send both text and screenshot to GPT-4o (vision)
    const analyzerResult = await llm.invoke([
      new SystemMessage(STYLE_ANALYZER_PROMPT),
      new HumanMessage({
        content: [
          { type: 'text', text: textInput },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${siteStyles.screenshotBase64}`,
              detail: 'high',
            },
          },
        ],
      }),
    ]);

    let designTokens: Record<string, string>;
    try {
      const content = typeof analyzerResult.content === 'string'
        ? analyzerResult.content
        : JSON.stringify(analyzerResult.content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      designTokens = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: 'Failed to analyze website styling' }, { status: 500 });
    }

    console.log('\n=== Design Tokens (Raw from AI) ===');
    console.log(JSON.stringify(designTokens, null, 2));

    // Validate and fix contrast issues
    designTokens = validateAndFixContrast(designTokens);

    console.log('\n=== Design Tokens (After Contrast Fix) ===');
    console.log(JSON.stringify(designTokens, null, 2));

    // Step 3: Agent 2 — Template Generator
    const generatorLlm = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.3,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const layoutPref = layout === 'list' ? 'list' : 'cards';
    const generatorInput = `## Design Tokens\n\`\`\`json\n${JSON.stringify(designTokens, null, 2)}\n\`\`\`\n\n## Layout Preference: ${layoutPref}\n## Website Domain: ${parsedUrl.hostname}`;

    const generatorResult = await generatorLlm.invoke([
      new SystemMessage(TEMPLATE_GENERATOR_PROMPT),
      new HumanMessage(generatorInput),
    ]);

    let templateData: { name: string; css: string; fontUrl: string | null; layout: string };
    try {
      const content = typeof generatorResult.content === 'string'
        ? generatorResult.content
        : JSON.stringify(generatorResult.content);
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found');
      templateData = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
    }

    // Always use the user's layout choice, not the AI's
    return NextResponse.json({
      name: templateData.name,
      css: templateData.css,
      fontUrl: templateData.fontUrl,
      layout: layoutPref,
      designTokens,
      sourceUrl: url,
      _debug: {
        computedColors: siteStyles.computedColors,
        ctaStyles: siteStyles.ctaStyles,
        uniqueColors: siteStyles.uniqueColors.slice(0, 30),
        fontFamilies: siteStyles.fontFamilies,
        loadedFonts: siteStyles.loadedFonts,
      },
    });
  } catch (err: any) {
    if (err?.name === 'TimeoutError' || err?.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Website took too long to render' }, { status: 408 });
    }
    console.error('AI template generation error:', err);
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
  }
}
