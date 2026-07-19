const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function main() {
  const siteDir = path.resolve(__dirname, '..', '_site');
  const sourcePath = path.join(siteDir, 'cv-print.html');
  const outDir = path.join(siteDir, 'assets');
  const outPath = path.join(outDir, 'cv.pdf');

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`${sourcePath} not found. Run "jekyll build" before this script.`);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${sourcePath}`, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    });
  } finally {
    await browser.close();
  }

  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
