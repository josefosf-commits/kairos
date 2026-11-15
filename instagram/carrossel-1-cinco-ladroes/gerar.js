// node gerar.js -> slide-1.png ... slide-8.png (1080x1350, 4:5 para o Instagram)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  await p.goto('file://' + path.join(__dirname, 'slides.html'));
  await p.evaluate(() => document.fonts.load('700 50px Kalam'));
  for (let n = 1; n <= 8; n++) {
    await p.evaluate(x => window.draw(x), n);
    await p.screenshot({ path: path.join(__dirname, `slide-${n}.png`) });
  }
  await b.close();
  console.log('ok');
})();
