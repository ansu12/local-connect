const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

(async () => {
  const url = process.env.TEST_URL || 'http://localhost:3000';
  console.log(`Starting accessibility tests for ${url}...`);
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    const results = await new AxePuppeteer(page).analyze();
    
    if (results.violations.length > 0) {
      console.error(`Found ${results.violations.length} accessibility violations:`);
      results.violations.forEach(v => {
        console.error(`- [${v.impact}] ${v.id}: ${v.description}`);
        v.nodes.forEach(n => console.error(`  Node: ${n.html}`));
      });
      process.exit(1);
    } else {
      console.log('✅ No accessibility violations found! WCAG AA standards passed.');
    }
  } catch (error) {
    console.error(`Error running tests: ${error}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
