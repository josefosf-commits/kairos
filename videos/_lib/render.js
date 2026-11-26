// Gravação dos quadros. Uso (dentro da pasta do curta):
//   node ../_lib/render.js                 -> build/video-mudo.mp4
//   node ../_lib/render.js stills 5,12,30  -> build/still-<t>.png
//   node ../_lib/render.js thumb           -> build/thumbnail.png (usa thumb.json: {t, overlay, filter})
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
(async () => {
  const dir = process.cwd();
  const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
  fs.mkdirSync(path.join(dir, 'build'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: tl.w || 1920, height: tl.h || 1080 }, deviceScaleFactor: process.argv[2] === 'thumb' ? Number(process.env.THUMB_SCALE || 1) : 1 });
  await page.goto('file://' + path.join(dir, 'cena.html'));
  await page.evaluate(t => { window.TL = t; }, tl);
  await page.evaluate(() => document.fonts.load('700 50px Kalam'));
  const mode = process.argv[2];
  if (mode === 'thumb') {
    const th = JSON.parse(fs.readFileSync(path.join(dir, 'thumb.json'), 'utf8'));
    await page.evaluate(th => {
      window.THUMB = true;
      if (th.filter) document.getElementById('root').style.filter = th.filter;
      window.render(th.t);
      document.getElementById('frame').insertAdjacentHTML('beforeend', th.overlay);
    }, th);
    await page.screenshot({ path: path.join(dir, 'build', 'thumbnail.png') });
  } else if (mode === 'stills') {
    for (const t of process.argv[3].split(',').map(Number)) {
      await page.evaluate(x => window.render(x), t);
      await page.screenshot({ path: path.join(dir, 'build', `still-${t}.png`) });
    }
  } else {
    const n = Math.round(tl.duration * tl.fps);
    // PART=k/N renderiza só um pedaço (para rodar vários em paralelo) -> build/video-part-k.mp4
    const [pk, pn] = (process.env.PART || '0/1').split('/').map(Number);
    const i0 = Math.floor(n * pk / pn), i1 = Math.floor(n * (pk + 1) / pn);
    const outName = pn > 1 ? `video-part-${pk}.mp4` : 'video-mudo.mp4';
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(tl.fps), '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(dir, 'build', outName)], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = i0; i < i1; i++) {
      await page.evaluate(x => window.render(x), i / tl.fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 900 === 0) console.log(`frame ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
  }
  await browser.close();
  console.log('ok');
})();
