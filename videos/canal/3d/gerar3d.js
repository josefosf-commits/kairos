// node gerar3d.js -> logo-3d.png (800x800), capa-3d.png (2560x1440), build/capa-3d-guias.png
const { chromium } = require('playwright');
const path = require('path');
const ov = require('./overlays.js');
(async () => {
  const b = await chromium.launch();
  const shot = async (mode, w, h, file, guide) => {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto('file://' + path.join(__dirname, 'arte3d.html'));
    await p.evaluate(() => Promise.all([document.fonts.load('50px Anton'), document.fonts.load('700 50px Kalam')]));
    await p.evaluate(([m, w, h, html]) => {
      const f = document.getElementById('frame'); f.style.width = w + 'px'; f.style.height = h + 'px';
      window.draw(m); document.getElementById('ov').innerHTML = html;
    }, [mode, w, h, ov[mode] + (guide ? ov.guide : '')]);
    await p.screenshot({ path: path.join(__dirname, file) });
    await p.close();
  };
  await shot('logo', 800, 800, 'logo-3d.png');
  await shot('banner', 2560, 1440, 'capa-3d.png');
  await shot('banner', 2560, 1440, 'build/capa-3d-guias.png', true);
  await b.close();
})();
