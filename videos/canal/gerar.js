// node gerar.js -> logo-A.png, logo-B.png (800x800), capa.png (2560x1440), previews
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const shot = async (what, w, h, file, guide) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + path.join(__dirname, 'arte.html'));
    await p.evaluate(() => document.fonts.load('700 50px Kalam'));
    await p.evaluate(([a, w, h, g]) => { window.GUIDE = g; window.draw(a, w, h); }, [what, w, h, guide]);
    await p.screenshot({ path: path.join(__dirname, file) });
    await p.close();
  };
  await shot('A', 800, 800, 'logo-A.png');
  await shot('B', 800, 800, 'logo-B.png');
  await shot('banner', 2560, 1440, 'capa.png');
  await shot('banner', 2560, 1440, 'build/capa-guias.png', true);
  await b.close();
})();
