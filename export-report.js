// export-report.js
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const REPORT_URL = process.env.REPORT_URL;         // e.g., https://lookerstudio.google.com/reporting/xxxx
const OUT_DIR    = process.env.OUT_DIR || './pdfs';
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 60000); // 60s

if (!REPORT_URL) {
  console.error('Missing REPORT_URL in env');
  process.exit(1);
}

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new', // Puppeteer v20+
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2 // High-DPI rendering (Retina quality)
    }
  });

  try {
    const page = await browser.newPage();

    // Tweak URL to hide header if possible; harmless if ignored by LS
    const url = REPORT_URL.includes('?') ? `${REPORT_URL}&rm=minimal` : `${REPORT_URL}?rm=minimal`;

    await page.goto(url, { waitUntil: 'networkidle2', timeout: TIMEOUT_MS });

    // Give charts a moment to render after network goes idle (some viz render post-fetch)
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Hide header, footer, and navigation elements to export only the map/content
    await page.addStyleTag({
      content: `
        /* Hide Looker Studio header */
        header,
        [role="banner"],
        [role="navigation"],
        .report-header,
        .lool-header,
        .navigation-bar,
        /* Hide page tabs */
        [class*="PageTab"],
        [class*="navigation"],
        /* Hide footer */
        footer,
        [role="contentinfo"],
        /* Hide any toolbars */
        [class*="toolbar"],
        [class*="Toolbar"] {
          display: none !important;
          visibility: hidden !important;
        }
        /* Ensure content fills the page */
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
      `
    });

    // Timestamped filename
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const outPath = path.join(OUT_DIR, `looker-studio-${ts}.pdf`);

    await page.pdf({
      path: outPath,
      printBackground: true,
      width: '16.5in',      // Custom width to fit full dashboard
      height: '11.7in',     // A3 landscape dimensions
      landscape: true,
      preferCSSPageSize: false,
      scale: 0.8            // Zoom out slightly to fit all content
    });

    console.log(`Saved: ${outPath}`);
  } catch (err) {
    console.error('Export failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
