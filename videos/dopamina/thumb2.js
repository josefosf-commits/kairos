// Gera build/thumbnail-2.png: close no rosto iluminado pelo celular + "7 HORAS POR DIA" + cartão de tempo de uso
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const bg = path.join(dir, 'build/thumb-antes.png');
  const bars = [0.35, 0.5, 0.42, 0.8, 0.95, 0.7, 1.0].map((h, i) => `<div style="position:absolute;bottom:0;left:${18 + i * 58}px;width:40px;height:${h * 150}px;background:${h > 0.75 ? '#e5484d' : '#4fd1ff'};border-radius:8px 8px 0 0"></div>`).join('');
  const html = `<!doctype html><html><head><style>
    @font-face { font-family: Kalam; font-weight: 700; src: url("${path.join(dir, 'assets/kalam-700.woff2')}"); }
    body { margin:0; width:1920px; height:1080px; position:relative; overflow:hidden; background:#05070c; font-family: Kalam; font-weight:700; }
    .face { position:absolute; left:0; top:0; width:1920px; height:1080px; background-image:url("${bg}"); background-size:3456px 1944px; background-position:-1060px -230px; filter: brightness(1.45) contrast(1.15) saturate(1.3); }
    .shade { position:absolute; left:0; top:0; width:1920px; height:1080px; background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 42%, rgba(5,7,12,0.92) 60%, rgba(5,7,12,0.97) 100%); }
    .glow { position:absolute; left:120px; top:180px; width:900px; height:900px; border-radius:50%; background: radial-gradient(circle, rgba(79,209,255,0.35), rgba(79,209,255,0) 65%); mix-blend-mode: screen; }
    .t { position:absolute; white-space:nowrap; -webkit-text-stroke: 18px #000; paint-order: stroke fill; line-height:1; }
    .card { position:absolute; left:1260px; top:560px; width:470px; height:330px; background:#14161a; border:6px solid #000; border-radius:34px; box-shadow: 0 0 0 6px #e5484d; transform: rotate(4deg); font-family: Inter, Arial, sans-serif; color:#fff; }
  </style></head><body>
    <div class="face"></div><div class="glow"></div><div class="shade"></div>
    <div class="t" style="left:1000px; top:40px; font-size:205px; color:#e5484d">7 HORAS</div>
    <div class="t" style="left:1110px; top:275px; font-size:140px; color:#fff">POR DIA</div>
    <div class="card">
      <div style="position:absolute;left:30px;top:22px;font-size:30px;font-weight:700;color:#9aa3ad">Tempo de uso · hoje</div>
      <div style="position:absolute;left:30px;top:62px;font-size:72px;font-weight:900;color:#e5484d">7h 12min</div>
      <div style="position:absolute;left:20px;top:150px;width:430px;height:150px">${bars}</div>
    </div>
  </body></html>`;
  fs.writeFileSync(path.join(dir, 'build', 'thumb2.html'), html);
  await page.goto('file://' + path.join(dir, 'build', 'thumb2.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(dir, 'build', 'thumbnail-2.png') });
  await browser.close();
  console.log('ok');
})();
