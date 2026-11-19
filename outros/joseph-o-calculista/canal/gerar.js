// node gerar.js -> perfil.png (800x800), banner.png (2560x1440), build/banner-guias.png (área segura)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const shot = async (mode, w, h, file, guide) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + path.join(__dirname, 'arte.html'));
    await p.evaluate(([m, g]) => window.draw(m, g), [mode, !!guide]);
    await p.waitForTimeout(300);
    await p.screenshot({ path: path.join(__dirname, file) });
    await p.close();
  };
  await shot('perfil', 800, 800, 'perfil.png');
  await shot('banner', 2560, 1440, 'banner.png');
  await shot('banner', 2560, 1440, 'build/banner-guias.png', true);
  await b.close();
})();
