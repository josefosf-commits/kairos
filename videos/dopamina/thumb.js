// Gera build/thumbnail.png: "antes e depois" (dia 1 cinza x dia 30 colorido)
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const dir = __dirname;
  const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(dir, 'cena.html'));
  await page.evaluate(t => { window.TL = t; window.TL.lines = []; window.THUMB = true; }, tl);
  await page.evaluate(() => document.fonts.load('700 50px Kalam'));
  for (const [t, name] of [[75.6, 'antes'], [138.9, 'depois']]) {
    await page.evaluate(x => window.render(x), t);
    await page.screenshot({ path: path.join(dir, 'build', `thumb-${name}.png`) });
  }
  const html = `<!doctype html><html><head><style>
    @font-face { font-family: Kalam; font-weight: 700; src: url("${path.join(dir, 'assets/kalam-700.woff2')}"); }
    body { margin:0; width:1920px; height:1080px; position:relative; overflow:hidden; background:#000; font-family: Kalam; font-weight:700; }
    .half { position:absolute; top:0; width:960px; height:1080px; background-size:1920px 1080px; }
    .l { left:0; background-image:url("${path.join(dir, 'build/thumb-antes.png')}"); background-position:-480px 0; filter: brightness(1.25); }
    .r { left:960px; background-image:url("${path.join(dir, 'build/thumb-depois.png')}"); background-position:-480px 0; filter: brightness(1.2) saturate(1.3); }
    .bar { position:absolute; left:952px; top:0; width:16px; height:1080px; background:#fff; }
    .t { position:absolute; color:#fff; -webkit-text-stroke: 14px #000; paint-order: stroke fill; }
  </style></head><body>
    <div class="half l"></div><div class="half r"></div><div class="bar"></div>
    <div class="t" style="left:60px; top:30px; font-size:150px; color:#4fd1ff">ANTES</div>
    <div class="t" style="left:1000px; top:50px; font-size:118px; color:#ffd27a">30 DIAS DEPOIS</div>
    <div class="t" style="left:0; width:1920px; text-align:center; top:820px; font-size:150px">SEM DOPAMINA BARATA</div>
  </body></html>`;
  fs.writeFileSync(path.join(dir, 'build', 'thumb.html'), html);
  await page.goto('file://' + path.join(dir, 'build', 'thumb.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(dir, 'build', 'thumbnail.png') });
  await browser.close();
  console.log('ok');
})();
