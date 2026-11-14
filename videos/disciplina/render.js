// Usage: node render.js [stills t1,t2,...]  -> without args renders build/video.mp4 frames into ffmpeg
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const dir = __dirname;
  const tl = JSON.parse(fs.readFileSync(path.join(dir, 'timeline.json'), 'utf8'));
  fs.mkdirSync(path.join(dir, 'build'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(dir, 'cena.html'));
  await page.evaluate(t => { window.TL = t; }, tl);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => document.fonts.load('700 50px Kalam'));

  if (process.argv[2] === 'thumb') {
    // capa: Joseph sem vontade na porta, chuva lá fora
    await page.evaluate(() => {
      window.TL.lines = []; window.THUMB = true;
      document.getElementById('root').style.filter = 'brightness(1.45) contrast(1.08) saturate(1.15)';
      window.render(27.6);
      const f = document.getElementById('frame');
      // remove letterbox/counter: draw over with the thumbnail layout
      f.insertAdjacentHTML('beforeend', `
        <text class="hand" x="70" y="300" font-size="160" fill="#f4efe6" stroke="#000" stroke-width="22" paint-order="stroke">SEM</text>
        <text class="hand" x="70" y="470" font-size="160" fill="#f4efe6" stroke="#000" stroke-width="22" paint-order="stroke">VONTADE?</text>
        <text class="hand" x="1250" y="560" font-size="260" fill="#ff9f1c" stroke="#000" stroke-width="24" paint-order="stroke">VÁ.</text>`);
    });
    await page.screenshot({ path: path.join(dir, 'build', 'thumbnail.png') });
    await browser.close();
    return;
  }

  if (process.argv[2] === 'stills') {
    for (const t of process.argv[3].split(',').map(Number)) {
      await page.evaluate(x => window.render(x), t);
      await page.screenshot({ path: path.join(dir, 'build', `still-${t}.png`) });
    }
    await browser.close();
    return;
  }

  const n = Math.round(tl.duration * tl.fps);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(tl.fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(dir, 'build', 'video-mudo.mp4')],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await page.evaluate(x => window.render(x), i / tl.fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 90 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('ok');
})();
