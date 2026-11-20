// capa alternativa (motivacional): node thumb2.js  -> build/thumbnail-2.png
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const dir = __dirname, out = path.join(dir, 'build', 'thumbnail-2.png');
  const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(dir, 'cena.html'));
  await p.evaluate(t => { window.TL = t; window.THUMB = true; }, tl);
  await p.evaluate(() => document.fonts.load('700 50px Kalam'));
  await p.evaluate(() => {
    const t = 1.0;
    let o = `<defs><radialGradient id="gBurst" cx="68%" cy="45%" r="70%"><stop offset="0%" stop-color="#ffd36b"/><stop offset="35%" stop-color="#ff9f1c"/><stop offset="100%" stop-color="#3a1206"/></radialGradient></defs>`;
    o += `<rect width="1920" height="1080" fill="url(#gBurst)"/>`;
    // sun rays
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, a2 = a + Math.PI / 48; o += `<polygon points="1300,480 ${1300 + Math.cos(a) * 2200},${480 + Math.sin(a) * 2200} ${1300 + Math.cos(a2) * 2200},${480 + Math.sin(a2) * 2200}" fill="#fff4c2" opacity="0.18"/>`; }
    // confetti
    for (let i = 0; i < 40; i++) { const r = Math.sin(i * 12.9898) * 43758.5453, h = r - Math.floor(r), r2 = Math.sin(i * 78.233) * 12345.678, h2 = r2 - Math.floor(r2); o += `<rect x="${900 + h * 1000}" y="${h2 * 1000}" width="18" height="34" rx="4" fill="${["#30a46c", "#4fd1ff", "#ff6fae", "#fff"][i % 4]}" transform="rotate(${h * 180} ${900 + h * 1000} ${h2 * 1000})" opacity="0.9"/>`; }
    // Joseph celebrating (new athletic rig)
    const arm = (sh, e, h) => { const d = `M ${sh[0]} ${sh[1]} L ${e[0]} ${e[1]} L ${h[0]} ${h[1]}`; return `<path d="${d}" fill="none" stroke="#0e0f12" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${JOSEPH.hood}" stroke-width="37" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${h[0]}" cy="${h[1]}" r="27" fill="${JOSEPH.skin}" stroke="#0e0f12" stroke-width="6"/>`; };
    const P = Object.assign({ x: 960, c: JOSEPH }, face({ happy: 1, smile: 16, browUp: 6, mouthOpen: 0.55 }));
    const jw = arm([860, 565], [740, 440], [700, 250]) + arm([1060, 565], [1180, 440], [1220, 250]) + personBack(P) + personHead(P, t);
    o += room(jw, 400, 360, 1.45);
    // exam paper bottom-left
    o += examPaper(470, 860, 0.62, -10, "8,5", GREEN, t, 0, { marks: [1, 1, 1, 1, 0, 1, 1] });
    // headline: 2 (crossed) -> 8,5
    o += `<g transform="translate(250 290) rotate(-4)"><text class="hand" x="0" y="0" font-size="300" text-anchor="middle" fill="#e5484d" stroke="#000" stroke-width="26" paint-order="stroke">2</text><line x1="-110" y1="-150" x2="110" y2="20" stroke="#000" stroke-width="40" stroke-linecap="round"/><line x1="-110" y1="-150" x2="110" y2="20" stroke="#fff" stroke-width="18" stroke-linecap="round"/></g>`;
    o += `<g transform="translate(470 200)"><path d="M -40 0 L 110 0 M 60 -60 L 130 0 L 60 60" fill="none" stroke="#000" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/><path d="M -40 0 L 110 0 M 60 -60 L 130 0 L 60 60" fill="none" stroke="#fff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    o += `<g transform="translate(830 300) rotate(-4)"><text class="hand" x="0" y="0" font-size="340" text-anchor="middle" fill="#30a46c" stroke="#000" stroke-width="30" paint-order="stroke" stroke-linejoin="round">8,5</text></g>`;
    // tag
    o += `<g transform="translate(560 520) rotate(-3)"><rect x="-300" y="-72" width="600" height="144" rx="24" fill="#ffc53d" stroke="#000" stroke-width="10"/><text class="hand" x="0" y="36" font-size="104" text-anchor="middle" fill="#0e0f12">EM 30 DIAS</text></g>`;
    document.getElementById('root').style.filter = 'saturate(1.2) contrast(1.06)';
    document.getElementById('frame').innerHTML = o;
  });
  await p.screenshot({ path: out });
  await b.close();
  console.log('ok', out);
})();
