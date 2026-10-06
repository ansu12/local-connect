const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://chat.deepseek.com/a/chat/s/033f956c-f26b-4c88-9608-59f4844d9771', { waitUntil: 'networkidle0' });
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('deepseek_chat.txt', text);
  await browser.close();
})();
