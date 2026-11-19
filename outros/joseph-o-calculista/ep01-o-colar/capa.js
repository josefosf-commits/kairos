// Gera build/capa-serie.png: capa vertical com cara de pôster de série (nome da série, clima noir, contas no fundo, selo do caso)
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const dir = __dirname;
  const nums = [];
  const seq = ['22:00', '22:15', '+15 min', '≠', '20 min', '2.000.000', 'x', '∴', '3', '1 + 1', '?', '= MENTIU', '07', '√', '0,79', '%'];
  for (let i = 0; i < 46; i++) { const r = Math.sin(i * 12.9898) * 43758.5453, h = r - Math.floor(r), r2 = Math.sin(i * 78.233) * 12345.678, h2 = r2 - Math.floor(r2);
    nums.push(`<div class="n" style="left:${Math.round(h * 1000)}px;top:${Math.round(h2 * 1820)}px;font-size:${28 + Math.round(h * 40)}px;transform:rotate(${Math.round((h2 - 0.5) * 30)}deg)">${seq[i % seq.length]}</div>`); }
  const html = `<!doctype html><html><head><style>
  body{margin:0;width:1080px;height:1920px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 42%, #1f2a44 0%, #0b0f1a 55%, #04060b 100%);font-family:'DejaVu Serif',serif;}
  .n{position:absolute;color:#c9a84a;opacity:.13;font-family:'DejaVu Sans Mono',monospace;white-space:nowrap}
  .rain{position:absolute;inset:0;background:repeating-linear-gradient(105deg,rgba(150,180,220,.07) 0 2px,transparent 2px 46px)}
  .rim{position:absolute;left:140px;top:430px;width:800px;height:1100px;border-radius:50%;background:radial-gradient(ellipse, rgba(255,197,61,.28), rgba(255,197,61,0) 62%)}
  .jo{position:absolute;left:190px;top:470px;width:700px;filter:drop-shadow(0 0 22px rgba(255,197,61,.35)) contrast(1.06) saturate(1.1)}
  .fade{position:absolute;left:0;right:0;bottom:0;height:640px;background:linear-gradient(transparent, #04060b 58%)}
  .t1{position:absolute;left:0;right:0;top:1420px;text-align:center;color:#f4efe6;font-weight:bold;font-size:150px;letter-spacing:22px;text-shadow:0 6px 0 #000,0 0 30px rgba(0,0,0,.8)}
  .line{position:absolute;left:200px;right:200px;top:1610px;height:4px;background:linear-gradient(90deg,transparent,#c9a84a,transparent)}
  .t2{position:absolute;left:0;right:0;top:1630px;text-align:center;color:#c9a84a;font-size:70px;letter-spacing:16px;font-weight:bold}
  .tag{position:absolute;left:0;right:0;top:1750px;text-align:center;color:#cfd8e3;font-style:italic;font-size:40px;letter-spacing:3px}
  .ep{position:absolute;left:60px;top:90px;color:#04060b;background:#c9a84a;font-family:'DejaVu Sans',sans-serif;font-weight:bold;font-size:38px;letter-spacing:6px;padding:14px 26px;border-radius:6px}
  .case{position:absolute;right:60px;top:84px;color:#e5484d;border:5px solid #e5484d;font-family:'DejaVu Sans Mono',monospace;font-weight:bold;font-size:40px;padding:10px 22px;transform:rotate(6deg);letter-spacing:3px}
  .q{position:absolute;left:0;right:0;top:250px;text-align:center;color:#f4efe6;font-size:62px;font-weight:bold;letter-spacing:2px;text-shadow:0 4px 0 #000}
  .q b{color:#c9a84a}
  </style></head><body>
  ${nums.join('')}<div class="rain"></div><div class="rim"></div>
  <img class="jo" src="${path.join(dir, 'assets/joseph.png')}">
  <div class="fade"></div>
  <div class="ep">SÉRIE · EP. 1</div><div class="case">CASO Nº 1</div>
  <div class="q">Quem roubou o colar<br><b>de 2 milhões?</b></div>
  <div class="t1">JOSEPH</div><div class="line"></div><div class="t2">O CALCULISTA</div>
  <div class="tag">"Os números não mentem. As pessoas, sim."</div>
  </body></html>`;
  fs.mkdirSync(path.join(dir, 'build'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'build', 'capa-serie.html'), html);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(dir, 'build', 'capa-serie.html')); await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(dir, 'build', 'capa-serie.png') }); await b.close(); console.log('ok');
})();
