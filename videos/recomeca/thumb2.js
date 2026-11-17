// usage: node thumb2.js <video dir> <out.png>
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const dir = process.argv[2], out = process.argv[3];
  const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(dir, 'cena.html'));
  await p.evaluate(t => { window.TL = t; window.THUMB = true; }, tl);
  await p.evaluate(() => document.fonts.load('700 50px Kalam'));
  await p.evaluate(() => {
    const t = 190.5;
    let o = `<defs><clipPath id="cL"><polygon points="0,0 1010,0 910,1080 0,1080"/></clipPath><clipPath id="cR"><polygon points="1010,0 1920,0 1920,1080 910,1080"/></clipPath>
      <radialGradient id="gSun" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffe9a8"/><stop offset="100%" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>`;
    // LEFT: before
    let L = `<rect width="1920" height="1080" fill="#2a0f14"/>` + room(dadFront(t, { lid: 0.5, browSad: 1, smile: -6, bags: 1, look: [0, 8] }, 960, 1), -500, 330, 1.7);
    L += `<rect width="1920" height="1080" fill="#e5484d" opacity="0.18" style="mix-blend-mode:multiply"/>`;
    o += `<g clip-path="url(#cL)">${L}</g>`;
    // RIGHT: after
    let R = `<g transform="translate(500 70)">${street(t, { sunset: 1, v: 420, zoom: 1.22, people: [{ x: 960, c: DAD, smile: 16, ang: 0.4 }] })}</g>`;
    R += `<circle cx="1860" cy="90" r="170" fill="url(#gSun)" opacity="0.7"/>`;
    o += `<g clip-path="url(#cR)">${R}</g>`;
    o += `<line x1="1010" y1="0" x2="910" y2="1080" stroke="#fff" stroke-width="18"/><line x1="1010" y1="0" x2="910" y2="1080" stroke="#000" stroke-width="5"/>`;
    // labels
    const lab = (x, y, s, fill, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-190" y="-62" width="380" height="124" rx="20" fill="${fill}" stroke="#000" stroke-width="9"/><text class="hand" x="0" y="34" font-size="96" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="8" paint-order="stroke">${s}</text></g>`;
    o += lab(250, 960, "ANTES", "#e5484d", -4) + lab(1660, 960, "DEPOIS", "#30a46c", 4);
    o += `<g transform="translate(420 340) rotate(-6)"><rect x="-260" y="-56" width="520" height="112" rx="16" fill="#07080b" stroke="#e5484d" stroke-width="7"/><text class="sans" x="0" y="20" font-size="54" font-weight="800" text-anchor="middle" fill="#e5484d">PRESSÃO ALTA ⚠</text></g>`;
    o += `<g transform="translate(1215 470) rotate(-5)"><text class="hand" x="0" y="0" font-size="130" text-anchor="middle" fill="#ffc53d" stroke="#000" stroke-width="20" paint-order="stroke">−12 KG</text></g>`;
    // headline
    o += `<text class="hand" x="960" y="170" font-size="210" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="30" paint-order="stroke" stroke-linejoin="round">AOS 43.</text>`;
    // arrow
    o += `<g transform="translate(960 560)"><path d="M -130 0 L 90 0 M 40 -60 L 110 0 L 40 60" fill="none" stroke="#000" stroke-width="54" stroke-linecap="round" stroke-linejoin="round"/><path d="M -130 0 L 90 0 M 40 -60 L 110 0 L 40 60" fill="none" stroke="#ffc53d" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    document.getElementById('root').style.filter = 'saturate(1.25) contrast(1.06)';
    document.getElementById('frame').innerHTML = o;
  });
  await p.screenshot({ path: out });
  await b.close();
})();
