// JOSEPH, O CALCULISTA · CASO ESPECIAL 2: O BILHETE DE 40 MILHÕES (16:9, ~6 min, duas pausas para o palpite)
const W = 1920, H = 1080;
const NOIR = "#0b0f1a", CRIME = "#e5484d", AQUA = "#4fd1ff", OK = "#30a46c", DIM = "#8f99a3";
const JW = 791, JH = 1249;
function jo(t, x, y, h, op = 1, glow = 0) {
  const w = h * JW / JH, br = 1 + 0.006 * Math.sin(t * 2.2);
  let o = `<g opacity="${op}" transform="translate(${x} ${y + h}) scale(1 ${br}) translate(${-x} ${-(y + h)})">`;
  if (glow) o += `<ellipse cx="${x}" cy="${y + h * 0.45}" rx="${w * 0.75}" ry="${h * 0.55}" fill="${GOLD}" opacity="${0.18 * glow}"/>`;
  return o + `<image href="assets/joseph.png" x="${x - w / 2}" y="${y}" width="${w}" height="${h}"/></g>`;
}
const bg = (c = NOIR) => `<rect width="${W}" height="${H}" fill="${c}"/>`;
const vig = () => `<rect width="${W}" height="${H}" fill="url(#gVignette)"/>`;
const black = op => op > 0 ? `<rect width="${W}" height="${H}" fill="#000" opacity="${op}"/>` : "";
function pill(t, a, s, col, x, y, size = 50) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 80; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#05070c" opacity="0.92" stroke="${col}" stroke-width="5"/>${txt(esc(s), 0, 0, size, col)}</g>`; }
function stamp(t, a, s, x, y, col = CRIME, size = 90) { if (t < a) return ""; const w = s.length * size * 0.55 + 90; return `<g transform="translate(${x} ${y}) rotate(-6) scale(${pop(t, a, 0.25)})"><rect x="${-w / 2}" y="${-size * 0.75}" width="${w}" height="${size * 1.5}" rx="12" fill="#05070c" opacity="0.85" stroke="${col}" stroke-width="10"/>${txt(esc(s), 0, 0, size, col)}</g>`; }
function badge(t, a, n, x = 130, y = 170) { const p = pop(t, a); return p > 0 ? `<g transform="translate(${x} ${y}) scale(${p})"><circle r="62" fill="${GOLD}" stroke="#000" stroke-width="7"/>${txt(String(n), 0, 0, 80, "#05070c")}</g>` : ""; }
function rain(t, amt = 1, n = 120) {
  let o = `<g opacity="${amt}" stroke="#7f9cc4" stroke-width="3" stroke-linecap="round">`;
  for (let i = 0; i < n; i++) { const x = hash(i) * 2000 - 40, sp = 1300 + hash(i + 9) * 500, y = ((t * sp + hash(i + 3) * H) % (H + 200)) - 100; o += `<line x1="${x}" y1="${y}" x2="${x - 12}" y2="${y + 50}" opacity="${0.3 + 0.5 * hash(i + 7)}"/>`; }
  return o + `</g>`;
}
const FLASH = [];
const flash = t => { const f = FLASH.map(a => dip(t, a, a + 0.04, a + 0.12, a + 0.4)).reduce((m, v) => Math.max(m, v), 0); return f > 0 ? `<rect width="${W}" height="${H}" fill="#dfe8ff" opacity="${0.45 * f}"/>` : ""; };
const pad2 = n => String(n).padStart(2, "0");
function cctv(t, label, secs, inner, x = 0, y = 0, w = W, h = H) {   // CCTV frame with timestamp 03:MM:SS
  const m = 17 + Math.floor(secs / 60), s = Math.floor(secs % 60);
  const sx = w / W, sy = h / H;
  let o = `<g transform="translate(${x} ${y}) scale(${sx} ${sy})"><clipPath id="cc${label.length}${x}"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#cc${label.length}${x})">${inner}`;
  for (let i = 0; i < H; i += 6) o += `<rect y="${i}" width="${W}" height="2" fill="#000" opacity="0.18"/>`;
  o += `<rect width="${W}" height="${H}" fill="#9fd1b0" opacity="0.07"/></g>`;
  o += `<text x="60" y="90" font-family="monospace" font-size="54" font-weight="700" fill="#e8efe6">${label}</text><text x="${W - 60}" y="90" font-family="monospace" font-size="54" font-weight="700" text-anchor="end" fill="#e8efe6">03:${pad2(m)}:${pad2(s)}</text>`;
  if (Math.sin(t * 6) > 0) o += `<circle cx="80" cy="140" r="16" fill="${CRIME}"/><text x="108" y="156" font-family="monospace" font-size="44" font-weight="700" fill="${CRIME}">REC</text>`;
  return o + `<rect width="${W}" height="${H}" fill="none" stroke="#2a2f3a" stroke-width="16"/></g>`;
}

/*CARD*/
function card(t, a, k, x, y, opt = {}) {      // suspect card 820x200, centred at (x, y)
  const p = pop(t, a); if (p <= 0) return "";
  const S0 = PEO[k], dim = opt.dim ? 0.35 : 1, cw = 820, ch = 200;
  let o = `<g transform="translate(${x} ${y}) scale(${p})" opacity="${dim}"><rect x="${-cw / 2}" y="${-ch / 2}" width="${cw}" height="${ch}" rx="26" fill="#0d111c" stroke="${opt.hi ? GOLD : S0.col}" stroke-width="${opt.hi ? 10 : 5}"/>`;
  o += `<clipPath id="cp${k}${x}${y}"><rect x="${-cw / 2 + 16}" y="${-ch / 2 + 14}" width="172" height="172" rx="18"/></clipPath><g clip-path="url(#cp${k}${x}${y})"><rect x="${-cw / 2 + 16}" y="${-ch / 2 + 14}" width="172" height="172" fill="#1d2336"/>${bust(t, k, -cw / 2 + 102, 30, 0.32)}</g>`;
  o += `<text class="hand" x="${-cw / 2 + 215}" y="-10" font-size="58" fill="${S0.col}">${S0.name}</text><text class="hand" x="${-cw / 2 + 215}" y="60" font-size="40" fill="#cfd8e3">${esc(S0.role || "")}</text>`;
  if (S0.L) o += `<g transform="translate(${cw / 2 - 20} ${-ch / 2 + 10})"><circle r="44" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt(S0.L, 0, 0, 58, "#05070c")}</g>`;
  if (opt.stamp) o += `<g transform="translate(150 0) rotate(-8)"><rect x="-190" y="-48" width="380" height="96" rx="10" fill="#05070c" opacity="0.85" stroke="${opt.stampCol}" stroke-width="8"/>${txt(opt.stamp, 0, 0, 56, opt.stampCol)}</g>`;
  return o + `</g>`;
}
function countdown(t, g0, letters) {
  const n = Math.max(1, 5 - Math.floor((t - g0) / 1.1)), ph = ((t - g0) % 1.1) / 1.1;
  let o = black(0.6);
  o += `<g transform="translate(960 470) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="190" fill="#05070c" stroke="${GOLD}" stroke-width="12"/><circle r="190" fill="none" stroke="${CRIME}" stroke-width="12" stroke-dasharray="${1194 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 220, CREAM)}</g>`;
  return o + txt(letters, 960, 760, 96, GOLD) + txt("ESCREVE NOS COMENTÁRIOS", 960, 870, 58, CREAM);
}
function capLong(t) {
  if (window.THUMB) return "";
  let o = "";
  const LS = window.TL.lines;
  for (let li = 0; li < LS.length; li++) {
    const L = LS[li], next = LS[li + 1], until = next ? Math.min(L.end + 0.3, next.start - 0.06) : L.end + 0.3;
    if (t < L.start - 0.05 || t > until) continue;
    const cs = chunksOf(L);
    const c = cs.find(c => t >= c.a - 0.05 && t < c.b) || (t >= L.end ? cs[cs.length - 1] : cs[0]), idx = cs.indexOf(c);
    const sc = 0.85 + 0.15 * easeBack(cl((t - c.a + 0.05) / 0.16));
    o += txt(esc(c.g.toUpperCase()), 960, 1000, Math.min(74, 2200 / (c.g.length + 2)), idx % 2 ? GOLD : CREAM, 1, sc);
  }
  return o;
}

// ---------- bakery world ----------
function cam2(t, label, clock, inner) {
  let o = `<g><clipPath id="c2"><rect width="${W}" height="${H}"/></clipPath><g clip-path="url(#c2)">${inner}`;
  for (let i = 0; i < H; i += 6) o += `<rect y="${i}" width="${W}" height="2" fill="#000" opacity="0.18"/>`;
  o += `<rect width="${W}" height="${H}" fill="#9fd1b0" opacity="0.07"/></g>`;
  o += `<text x="60" y="90" font-family="monospace" font-size="54" font-weight="700" fill="#e8efe6">${label}</text><text x="${W - 60}" y="90" font-family="monospace" font-size="54" font-weight="700" text-anchor="end" fill="#e8efe6">${clock}</text>`;
  if (Math.sin(t * 6) > 0) o += `<circle cx="80" cy="140" r="16" fill="${CRIME}"/><text x="108" y="156" font-family="monospace" font-size="44" font-weight="700" fill="${CRIME}">REC</text>`;
  return o + `<rect width="${W}" height="${H}" fill="none" stroke="#2a2f3a" stroke-width="16"/></g>`;
}
function bakery(t, warm = 1) {
  let o = bg("#2a1f1a") + `<rect y="0" width="${W}" height="620" fill="#3a2a20"/>`;
  for (let i = 0; i < 12; i++) o += `<rect x="${i * 160}" y="0" width="80" height="620" fill="#43311f" opacity="0.5"/>`;
  o += `<rect x="80" y="160" width="560" height="300" fill="#5a3a24" stroke="#000" stroke-width="8"/>`;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) o += `<ellipse cx="${150 + c * 85}" cy="${250 + r * 110}" rx="36" ry="22" fill="#d79a4e" stroke="#000" stroke-width="4"/>`;
  o += `<rect x="1300" y="130" width="420" height="260" rx="14" fill="#111" stroke="#000" stroke-width="10"/><rect x="1320" y="150" width="380" height="220" fill="#1d3a6e"/>`;
  o += `<rect y="620" width="${W}" height="460" fill="#1f1712"/><rect x="0" y="640" width="${W}" height="180" fill="#6b4530" stroke="#000" stroke-width="8"/>`;
  o += `<g transform="translate(980 600)"><rect x="-130" y="-80" width="260" height="120" rx="12" fill="#3a3f4a" stroke="#000" stroke-width="7"/><rect x="-100" y="-62" width="140" height="44" fill="#9fe0a8"/><rect x="-150" y="40" width="300" height="60" fill="#2a2f3a" stroke="#000" stroke-width="6"/></g>`;
  o += `<ellipse cx="960" cy="200" rx="600" ry="260" fill="url(#gWarm)" opacity="${0.25 * warm}"/>`;
  return o;
}
function tvNumbers(t, a) { const nums = ["07", "13", "22", "38", "41", "56"]; let o = ""; nums.forEach((n, i) => { const p = pop(t, a + i * 0.35); if (p > 0) o += `<g transform="translate(${1365 + i * 58} 260) scale(${p})"><circle r="25" fill="#f4efe6" stroke="#000" stroke-width="4"/><text y="10" font-family="monospace" font-size="28" font-weight="700" text-anchor="middle" fill="#1a1a1a">${n}</text></g>`; }); return o; }
function ticket(x, y, s, nums, col = "#f6eedc", rot = 0) {
  let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-200" y="-110" width="400" height="220" rx="10" fill="${col}" stroke="#000" stroke-width="6"/><rect x="-200" y="-110" width="400" height="50" fill="${OK}"/><text x="0" y="-74" font-family="monospace" font-size="30" font-weight="700" text-anchor="middle" fill="#fff">LOTERIA</text>`;
  nums.forEach((n, i) => { o += `<g transform="translate(${-150 + i * 60} 20)"><circle r="24" fill="#fff" stroke="#000" stroke-width="3"/><text y="9" font-family="monospace" font-size="26" font-weight="700" text-anchor="middle" fill="#1a1a1a">${n}</text></g>`; });
  return o + `</g>`;
}
const WIN = ["07", "13", "22", "38", "41", "56"], LOSE = ["02", "15", "29", "33", "47", "60"];
const PEO = {
  antonio: { c: { skin: "#e8bf9a", skinD: "#cc9f7a", hood: "#f4efe6", hoodD: "#d9d4c7", hair: "#9a9a9a", style: "short" }, name: "SEU ANTÔNIO", col: CREAM },
  kleber: { c: { skin: "#d9a47a", skinD: "#bf8a62", hood: "#3d5a80", hoodD: "#2c4460", hair: "#2a1a12", style: "short" }, name: "KLÉBER", role: "sobrinho · deve a agiota", col: "#6fb3ff", L: "A" },
  rosa: { c: { skin: "#a86f4a", skinD: "#8e5a3a", hood: "#c2416b", hoodD: "#9a3355", hair: "#1c1410", style: "curly" }, name: "ROSA", role: "balconista · demitida", col: "#ff8fc2", L: "B" },
  moacir: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#6b4530", hoodD: "#523422", hair: "#bfbfc8", style: "short" }, name: "SEU MOACIR", role: "padaria rival", col: "#e0a060", L: "C" },
  tiago: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#d64545", hoodD: "#a83535", hair: "#120c09", style: "curly" }, name: "TIAGO", role: "entregador · 19 anos", col: "#ff9f6b", L: "D" },
  ramos: { c: { skin: "#c68b5e", skinD: "#a97046", hood: "#3a4a3a", hoodD: "#2a362a", hair: "#2a1a12", style: "short" }, name: "DELEGADO RAMOS", col: GOLD },
};
function bust(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: PEO[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.013) }, f)));
  let w = personBack(P) + personHead(P, t);
  if (k === "antonio" || k === "moacir") w += `<path d="M 890 330 Q 880 250 930 260 Q 960 220 990 260 Q 1040 250 1030 330 Z" fill="#fff" stroke="#000" stroke-width="5"/>`;
  if (k === "moacir") w += `<path d="M 925 448 Q 960 432 995 448 Q 980 462 960 454 Q 940 462 925 448 Z" fill="#bfbfc8"/>`;
  if (k === "rosa") w += `<path d="M 895 520 Q 960 566 1025 520 L 1010 610 L 910 610 Z" fill="#f4efe6" stroke="#000" stroke-width="5"/>`;
  if (k === "kleber") w += `<path d="M 880 330 Q 960 260 1040 330 L 1040 345 L 880 345 Z" fill="#222" stroke="#000" stroke-width="5"/><rect x="1020" y="330" width="70" height="18" rx="6" fill="#222"/>`;
  if (k === "tiago") w += `<rect x="1010" y="560" width="80" height="50" rx="8" fill="#ffc53d" stroke="#000" stroke-width="4"/>`;
  if (k === "ramos") w += `<path d="M 925 448 Q 960 432 995 448 Q 980 462 960 454 Q 940 462 925 448 Z" fill="#2a1a12"/><path d="M 870 330 Q 960 240 1050 330 L 1070 345 L 850 345 Z" fill="#26324a" stroke="#000" stroke-width="6"/><rect x="935" y="285" width="50" height="30" fill="${GOLD}" stroke="#000" stroke-width="4"/><path d="M 1030 580 l 10 -22 l 10 22 l 22 2 l -16 14 l 6 22 l -22 -12 l -22 12 l 6 -22 l -16 -14 Z" fill="${GOLD}" stroke="#000" stroke-width="3"/>`;
  return cam(960, 470, s, w, y).replace("translate(540 ", `translate(${x} `);
}
const GRID = [["kleber", 500, 400], ["rosa", 1420, 400], ["moacir", 500, 660], ["tiago", 1420, 660]];
function timeRow(t, a, hhmm, s, y, col = CREAM) { const p = pop(t, a); return p > 0 ? `<g transform="translate(960 ${y}) scale(${p})"><rect x="-720" y="-60" width="1440" height="120" rx="20" fill="#0d111c" stroke="${col}" stroke-width="5"/><text x="-680" y="22" font-family="monospace" font-size="62" font-weight="700" fill="${GOLD}">${hhmm}</text>${txt(esc(s), 160, 0, 54, col)}</g>` : ""; }
function counter(t) { return bakery(t, 0.6); }

function render(t) {
  const end = window.TL.duration;
  let o = bg();
  if (t < S(4) - 0.3) {                                 // the win
    o += bakery(t) + tvNumbers(t, 1.2);
    o += bust(t, "antonio", 520, 900, 1.5, { smile: t > S(2) ? 16 : 6, mouthOpen: t > S(3) ? 0.8 : 0, browUp: t > S(2) ? 8 : 0 });
    if (t > S(2)) o += stamp(t, S(2) + 2.2, "R$ 40 MILHÕES", 1300, 520, GOLD, 90);
    if (t > S(3)) { o += txt("GANHEI!!!", 960, 160, 150, GOLD, 1, pop(t, S(3))); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; o += `<line x1="${520 + Math.cos(a) * 260}" y1="${600 + Math.sin(a) * 260}" x2="${520 + Math.cos(a) * 340}" y2="${600 + Math.sin(a) * 340}" stroke="${GOLD}" stroke-width="10" opacity="${0.6 + 0.4 * Math.sin(t * 10)}"/>`; } }
  } else if (t < S(6) - 0.2) {
    o += bakery(t, 0.3) + black(0.4) + `<g transform="translate(980 600)"><rect x="-150" y="40" width="300" height="60" fill="#2a2f3a" stroke="${CRIME}" stroke-width="8"/></g>`;
    o += stamp(t, S(4) + 1.0, "SUMIU", 960, 360, CRIME, 140);
    if (t > S(5)) o += pill(t, S(5), "PORTA TRANCADA · NINGUÉM SAIU", GOLD, 960, 820, 54);
  } else if (t < E(7) + 0.2) {
    o += bg("#07090f") + txt("VOCÊ VAI INVESTIGAR", 960, 300, 110, CREAM, 1, pop(t, S(6)));
    [["PAUSA 1", 640], ["PAUSA 2", 1280]].forEach(([s, x], i) => { const p = pop(t, S(6) + 2.6 + i * 0.6); if (p > 0) o += `<g transform="translate(${x} 560) scale(${p})"><rect x="-230" y="-110" width="460" height="220" rx="30" fill="#0d111c" stroke="${CRIME}" stroke-width="8"/>${txt("II", 0, -30, 70, CRIME)}${txt(s, 0, 50, 60, CREAM)}</g>`; });
    o += pill(t, S(7) + 0.5, "TODO MUNDO PARECE CULPADO", CRIME, 960, 800, 56);
  } else if (t < S(8) - 0.2) {
    const k = seg(t, E(7) + 0.2, E(7) + 1.0);
    o += bg("#05070c") + `<circle cx="960" cy="540" r="460" fill="${GOLD}" opacity="${0.07 * k}"/>` + txt("JOSEPH, O CALCULISTA", 960, 360, 76, GOLD, k);
    o += txt("O BILHETE DE", 960, 510, 120, CREAM, 1, pop(t, E(7) + 0.5)) + txt("40 MILHÕES", 960, 660, 150, GOLD, 1, pop(t, E(7) + 0.9)) + txt("CASO ESPECIAL 2", 960, 800, 48, CRIME, seg(t, E(7) + 1.4, E(7) + 2.0));
  } else if (t < S(11) - 0.3) {                         // timeline (delegado framed as helper)
    o += bg("#0a0d16") + txt("A NOITE DO BILHETE", 960, 130, 80, CREAM);
    o += timeRow(t, S(8) + 0.2, "20:02", "bilhete na gaveta · porta trancada", 300, GOLD) + timeRow(t, S(9) + 0.3, "20:10", "liga pra polícia", 460, AQUA) + timeRow(t, S(10) + 0.3, "20:13", "delegado Ramos chega", 620, OK);
    if (t > S(10) + 2.0) o += `<g opacity="${seg(t, S(10) + 2.0, S(10) + 2.6)}">${bust(t, "ramos", 1660, 960, 0.55, { smile: 6 })}</g>` + pill(t, S(10) + 3.4, "\"ESTAVA PASSANDO\"", DIM, 1660, 770, 34);
  } else if (t < S(12) - 0.3) {                         // 20:16 the drawer (planted: his back to the camera)
    o += cam2(t, "CAM CAIXA", "20:16:04", bakery(t, 0.5) + `<g transform="translate(980 640)">${bust(t, "ramos", 0, 30, 0.95, { look: [0, -20], lid: 1 }).replace(/<g transform="translate\(([-\d.]+) /, '<g transform="translate($1 ')}</g>`);
    o += `<rect x="760" y="380" width="440" height="460" fill="#26324a" opacity="0.92" rx="40"/>`;   // his back covers the till
    o += stamp(t, S(11) + 3.4, "VAZIA", 960, 220, CRIME, 110);
  } else if (t < S(17) - 0.3) {                         // four suspects
    o += bg("#0a0d16") + txt("4 PESSOAS NA PADARIA", 960, 160, 90, CREAM, 1, pop(t, S(12)));
    GRID.forEach(([k, x, y], i) => { const a = S(13 + i); o += card(t, a, k, x, y + 40, { hi: t >= a && t < E(13 + i) + 0.3 }); });
    if (t > S(13) + 3.5 && t < E(13)) o += stamp(t, S(13) + 3.5, "\"QUANTO VALE, TIO?\"", 960, 870, CRIME, 56);
    if (t > S(14) + 3.6 && t < E(14)) o += stamp(t, S(14) + 3.6, "\"AINDA VAI ME PAGAR\"", 960, 870, CRIME, 56);
    if (t > S(15) + 3.6 && t < E(15)) o += stamp(t, S(15) + 3.6, "1ª VEZ EM 20 ANOS", 960, 870, CRIME, 56);
  } else if (t < S(18) - 0.3) {                         // the delegado as hero
    o += bg("#141a26") + `<circle cx="960" cy="620" r="520" fill="${GOLD}" opacity="${0.12 + 0.03 * Math.sin(t * 3)}"/>` + bust(t, "ramos", 960, 700, 1.35, { smile: 8, look: [0, 4] });
    o += pill(t, S(17) + 1.6, "20 ANOS DE POLÍCIA", GOLD, 420, 300, 50) + pill(t, S(17) + 3.0, "MEDALHA DE HONRA", GOLD, 1500, 300, 50);
    o += pill(t, S(17) + 5.0, "\"NINGUÉM SAI DAQUI\"", OK, 960, 860, 56);
  } else if (t < S(19) - 0.3) {
    const enter = seg(t, S(18) + 1.8, S(18) + 3.2);
    o += bg("#0d111c") + `<rect x="760" y="0" width="400" height="${H}" fill="#ffe7b0" opacity="${0.25 * enter}"/>` + jo(t, 960, lerp(1200, 120, sm(enter)), 900, enter);
  } else if (t < S(20) - 0.3) {
    o += bg("#07090f") + `<circle cx="1300" cy="560" r="480" fill="${GOLD}" opacity="0.08"/>` + jo(t, 1320, 110, 960, 1, 1);
    o += txt("JOSEPH", 560, 400, 170, CREAM, 1, pop(t, S(19))) + txt("O CALCULISTA", 560, 540, 86, GOLD, 1, pop(t, S(19) + 0.5)) + pill(t, S(19) + 3.0, "ELE FAZ A CONTA", GOLD, 560, 700, 52);
  } else if (t < S(26) - 0.3) {                         // clue 1: counter camera (misdirection)
    const who = t < S(21) ? null : t < S(22) ? ["kleber", "20:08:31", 900] : t < S(23) ? ["rosa", "20:11:12", 1120] : t < S(24) ? ["moacir", "20:13:40", 760] : t < S(25) ? ["tiago", "20:14:55", 1650] : null;
    o += cam2(t, "CAM CAIXA", who ? who[1] : "20:08:00", bakery(t, 0.5) + (who ? bust(t, who[0], who[2], 640, 0.75, { look: who[0] === "tiago" ? [0, 14] : [-6, 10] }) : ""));
    o += badge(t, S(20), 1, 130, 230);
    if (who && who[0] !== "tiago") o += `<circle cx="980" cy="660" r="${120 + 10 * Math.sin(t * 6)}" fill="none" stroke="${CRIME}" stroke-width="10"/>`;
    if (who && who[0] === "tiago") o += pill(t, S(24) + 0.6, "NO CANTO · CELULAR", DIM, 1650, 900, 40);
    if (t > S(25)) { o += black(0.55); [["A", "kleber"], ["B", "rosa"], ["C", "moacir"]].forEach(([L], i) => { o += `<g transform="translate(${660 + i * 300} 540) scale(${pop(t, S(25) + i * 0.3)})"><circle r="100" fill="#05070c" stroke="${CRIME}" stroke-width="10"/>${txt(L, 0, 0, 120, CRIME)}</g>`; }); o += txt("3 PERTO DA GAVETA", 960, 280, 90, CREAM, 1, pop(t, S(25))); }
  } else if (t < S(27) - 0.2) {                         // PAUSE 1
    o += bg("#0a0d16") + `<rect x="0" y="40" width="${W}" height="150" fill="${CRIME}" opacity="${0.15 + 0.08 * Math.sin(t * 5)}"/>` + txt("PAUSA 1 · QUEM PEGOU O BILHETE?", 960, 115, 72, CREAM, 1, pop(t, S(26)));
    GRID.forEach(([k, x, y], i) => { o += card(t, S(26) + 0.4 + i * 0.4, k, x, y + 40); });
    if (t > E(26) + 0.2) o += countdown(t, E(26) + 0.2, "A, B, C OU D?");
  } else if (t < S(34) - 0.3) {                         // pockets, Kléber's ticket, the comparison
    o += bg("#1a1612") + `<rect y="700" width="${W}" height="380" fill="#3a2414"/>`;
    if (t < S(30) - 0.2) {
      const items = [["CHAVES", 300], ["CARTEIRA", 650], ["CELULAR", 1000], ["MOEDAS", 1350]];
      items.forEach(([s, x], i) => { const p = pop(t, S(27) + 0.5 + i * 0.4); if (p > 0) o += `<g transform="translate(${x} 820) scale(${p})"><rect x="-120" y="-50" width="240" height="100" rx="16" fill="#0d111c" stroke="${DIM}" stroke-width="5"/>${txt(s, 0, 0, 40, DIM)}</g>`; });
      if (t > S(28)) o += ticket(960, 420, 1.1, LOSE, "#f6eedc", -4) + stamp(t, S(28) + 2.0, "NO BOLSO DO KLÉBER", 960, 160, CRIME, 64);
      if (t > S(29)) o += `<rect width="${W}" height="${H}" fill="${Math.sin(t * 9) > 0 ? "#2a5bd7" : CRIME}" opacity="0.14"/><g transform="translate(1620 560)"><circle cx="-70" r="50" fill="none" stroke="#cfd8e3" stroke-width="16"/><circle cx="70" r="50" fill="none" stroke="#cfd8e3" stroke-width="16"/><line x1="-20" x2="20" stroke="#cfd8e3" stroke-width="12"/></g>`;
    } else if (t < S(33) - 0.2) {
      o += ticket(520, 420, 1.2, WIN, "#fff6c8") + txt("O PREMIADO", 520, 220, 56, GOLD) + ticket(1400, 420, 1.2, LOSE) + txt("O DO KLÉBER", 1400, 220, 56, DIM);
      if (t > S(31)) o += stamp(t, S(31) + 0.6, "0 DE 6", 960, 760, OK, 120);
      if (t > S(32)) o += pill(t, S(32) + 0.3, "DELEGADO: \"DESCULPA, RAPAZ\"", DIM, 960, 920, 46);
    } else {
      o += bg("#0a0d16") + txt("ONDE ESTÁ O BILHETE?", 960, 520, 120, GOLD, 1, pop(t, S(33)));
    }
  } else if (t < S(39) - 0.3) {                         // clue 2: the register log
    o += bg("#07090f") + badge(t, S(34), 2);
    o += `<g transform="translate(960 560)"><rect x="-700" y="-330" width="1400" height="640" rx="12" fill="#f2ecdc" stroke="#000" stroke-width="8"/><text x="-640" y="-250" font-family="monospace" font-size="46" font-weight="700" fill="#3a3326">CAIXA · ABERTURAS DA GAVETA</text><line x1="-640" y1="-220" x2="640" y2="-220" stroke="#3a3326" stroke-width="4"/>`;
    const rows = [["20:02", "PLIM · SEU ANTÔNIO", S(36) + 0.4], ["20:16", "PLIM · DELEGADO", S(36) + 3.4]];
    rows.forEach(([h, s, a], i) => { const k = seg(t, a, a + 0.3); if (k > 0) o += `<text x="-640" y="${-110 + i * 260}" font-family="monospace" font-size="60" font-weight="700" fill="#1a1a1a" opacity="${k}">${h}  ${s}</text>`; });
    if (t > S(37)) o += `<g opacity="${seg(t, S(37), S(37) + 0.4)}"><rect x="-660" y="-30" width="1320" height="100" fill="${OK}" opacity="0.25"/><text x="0" y="36" font-family="monospace" font-size="50" font-weight="700" text-anchor="middle" fill="#1d5a32">nenhuma abertura entre as duas</text></g>`;
    o += `</g>`;
    o += pill(t, S(35) + 0.3, "SÓ 2 VEZES", GOLD, 1640, 170, 56);
    if (t > S(38)) o += stamp(t, S(38) + 0.6, "20:16 · AINDA ESTAVA LÁ", 820, 170, CRIME, 60);
  } else if (t < S(42) - 0.3) {                         // clue 3: 15 km in 3 minutes, cold hood
    o += bg("#0d111c") + badge(t, S(39), 3);
    if (t < S(41) - 0.2) {
      o += `<line x1="300" y1="560" x2="1620" y2="560" stroke="${DIM}" stroke-width="10" stroke-dasharray="30 20"/><g transform="translate(300 560)"><rect x="-90" y="-90" width="180" height="180" rx="16" fill="#26324a" stroke="#000" stroke-width="6"/>${txt("DELEGACIA", 0, 140, 40, CREAM)}</g><g transform="translate(1620 560)"><rect x="-90" y="-90" width="180" height="180" rx="16" fill="#6b4530" stroke="#000" stroke-width="6"/>${txt("PADARIA", 0, 140, 40, CREAM)}</g>`;
      o += txt("15 km", 960, 500, 90, GOLD, 1, pop(t, S(39) + 1.6));
      if (t > S(40)) o += `<rect x="460" y="700" width="1000" height="200" rx="20" fill="#13261d" stroke="#5a4630" stroke-width="10"/><text class="hand" x="960" y="830" font-size="80" text-anchor="middle" fill="#e8efe6">15 km ÷ 3 min = <tspan fill="${CRIME}">300 km/h</tspan></text>`;
    } else {
      o += `<g transform="translate(960 640)"><path d="M -520 120 L -460 -40 Q -300 -140 0 -150 Q 300 -140 460 -40 L 520 120 Z" fill="#3a4a3a" stroke="#000" stroke-width="10"/><rect x="-540" y="110" width="1080" height="90" rx="20" fill="#2a362a" stroke="#000" stroke-width="8"/></g>`;
      o += `<g transform="translate(1500 380)"><rect x="-30" y="-180" width="60" height="300" rx="30" fill="#f4efe6" stroke="#000" stroke-width="6"/><circle cy="150" r="56" fill="${AQUA}" stroke="#000" stroke-width="6"/><rect x="-16" y="40" width="32" height="110" fill="${AQUA}"/></g>`;
      o += stamp(t, S(41) + 0.8, "CAPÔ FRIO", 760, 260, AQUA, 100) + pill(t, S(41) + 3.0, "PARADO ALI HÁ MUITO TEMPO", GOLD, 960, 960, 50);
    }
  } else if (t < S(44) - 0.3) {                         // clue 4: who searches the searcher?
    o += bg("#0d111c") + badge(t, S(42), 4);
    GRID.forEach(([k, x, y], i) => { o += card(t, S(42) + 0.3 + i * 0.25, k, x, y + 20, { stamp: "REVISTADO", stampCol: DIM }); });
    if (t > S(43)) o += black(0.7) + txt("E QUEM REVISTA OS OUTROS...", 960, 420, 84, CREAM, 1, pop(t, S(43))) + txt("NINGUÉM REVISTA.", 960, 600, 120, CRIME, 1, pop(t, S(43) + 1.4));
  } else if (t < S(47) - 0.2) {                         // PAUSE 2 with E
    o += bg("#0a0d16") + `<rect x="0" y="40" width="${W}" height="150" fill="${CRIME}" opacity="${0.15 + 0.08 * Math.sin(t * 5)}"/>` + txt("ÚLTIMA PAUSA · MUDA O SEU PALPITE?", 960, 115, 72, CREAM, 1, pop(t, S(44)));
    GRID.forEach(([k, x, y], i) => { o += card(t, S(44) + 0.6 + i * 0.3, k, x, y - 30, { dim: t > S(45) && t < E(45) + 0.3 }); });
    const pe = pop(t, S(45) + 0.6); if (pe > 0) o += `<g transform="translate(960 850) scale(${pe})"><rect x="-410" y="-90" width="820" height="180" rx="26" fill="#0d111c" stroke="${CRIME}" stroke-width="8" stroke-dasharray="24 14"/><g transform="translate(-330 0)"><circle r="56" fill="#000" stroke="${CRIME}" stroke-width="5"/>${txt("?", 0, 0, 80, CRIME)}</g>${txt("FORA DA LISTA?", 60, 0, 60, CRIME)}<g transform="translate(390 -80)"><circle r="44" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("E", 0, 0, 58, "#05070c")}</g></g>`;
    if (t > E(46) + 0.2) o += countdown(t, E(46) + 0.2, "A, B, C, D OU E?");
  } else if (t < S(49) - 0.3) {                         // reveal: the bar across the street
    o += bg("#0a0e18") + `<rect y="760" width="${W}" height="320" fill="#1a1d24"/><rect x="0" y="740" width="${W}" height="20" fill="#d9d4c7" opacity="0.4"/>`;
    o += `<rect x="1100" y="200" width="700" height="560" fill="#2a1f1a" stroke="#000" stroke-width="8"/><rect x="1160" y="280" width="580" height="300" fill="#ffd38a" opacity="0.8"/>${txt("PADARIA", 1450, 240, 50, GOLD)}`;
    o += `<rect x="120" y="200" width="600" height="560" fill="#2a2a34" stroke="#000" stroke-width="8"/><rect x="180" y="280" width="480" height="300" fill="#ffb366" opacity="0.6"/>${txt("BAR", 420, 240, 50, CREAM)}` + bust(t, "ramos", 420, 760, 0.85, { look: [10, 0] });
    if (t > S(48)) o += `<line x1="720" y1="860" x2="1100" y2="860" stroke="${GOLD}" stroke-width="8"/>` + txt("30 METROS", 910, 930, 64, GOLD, 1, pop(t, S(48) + 1.6));
    if (t < S(48)) o += txt("GANHEI!!!", 1450, 650, 90, GOLD, 0.6 + 0.4 * Math.sin(t * 8));
    o += stamp(t, S(47) + 0.8, "E · O DELEGADO", 960, 110, CRIME, 70);
  } else if (t < S(51) - 0.3) {                         // 20:16 replay: the palm
    o += cam2(t, "CAM CAIXA · REPLAY", "20:16:04", bakery(t, 0.5));
    o += `<rect x="760" y="380" width="440" height="460" fill="#26324a" opacity="${t < S(50) ? 0.92 : 0.35}" rx="40"/>`;
    if (t > S(50)) o += `<g transform="translate(1000 640) scale(${pop(t, S(50))})"><ellipse rx="150" ry="90" fill="#c68b5e" stroke="#000" stroke-width="6"/>${ticket(0, -10, 0.5, WIN, "#fff6c8", 8)}</g><circle cx="1000" cy="640" r="200" fill="none" stroke="${GOLD}" stroke-width="10"/>`;
    o += pill(t, S(49) + 1.0, "DE COSTAS PRA CÂMERA", CRIME, 960, 860, 52);
  } else if (t < S(52) - 0.3) {
    o += bg("#0d111c") + bust(t, "ramos", 960, 680, 1.2, { browAng: 1, look: [8, 4], smile: 4 });
    GRID.forEach(([k], i) => { o += `<g transform="translate(${260 + i * 466} 880)">${pill(t, S(51) + 0.3 + i * 0.4, "REVISTADO", DIM, 0, 0, 40)}</g>`; });
    o += stamp(t, S(51) + 2.0, "ELE, NÃO", 960, 180, CRIME, 90);
  } else if (t < S(54) - 0.3) {                         // the badge wallet
    const open = seg(t, S(52) + 1.0, S(52) + 2.4), slide = seg(t, S(53) + 1.2, S(53) + 2.6);
    o += bg("#0d111c") + `<g transform="translate(960 560)"><rect x="-460" y="-280" width="920" height="560" rx="30" fill="#3a2414" stroke="#000" stroke-width="10"/><rect x="${-460 + 460 * (1 - open)}" y="-280" width="${460 * open}" height="560" fill="#4a2f22" stroke="#000" stroke-width="6"/><path d="M -230 -100 l 40 -90 l 40 90 l 100 10 l -75 65 l 22 100 l -87 -52 l -87 52 l 22 -100 l -75 -65 Z" fill="${GOLD}" stroke="#000" stroke-width="6" opacity="${1 - open * 0.0}"/>`;
    if (open > 0.5) o += `<rect x="80" y="-200" width="300" height="380" fill="#e8e2d6" stroke="#000" stroke-width="6"/>${bust(t, "ramos", 230, 120, 0.45, {})}`;
    o += `</g>`;
    if (slide > 0) o += ticket(1190, lerp(560, 300, sm(slide)), 0.9, WIN, "#fff6c8", -8) + stamp(t, S(53) + 2.4, "R$ 40 MILHÕES", 1560, 880, GOLD, 64);
    o += pill(t, S(52) + 0.6, "A CARTEIRA DO DISTINTIVO", GOLD, 960, 140, 52);
  } else if (t < S(56) - 0.3) {
    o += bg("#0a0d16");
    if (t < S(55) - 0.2) { GRID.forEach(([k, x, y]) => { o += card(t, S(54) - 0.2, k, x, y, { stamp: "INOCENTE", stampCol: OK }); }); o += txt("O KLÉBER FOI SOLTO", 960, 120, 72, OK, 1, pop(t, S(54))); }
    else { o += bust(t, "ramos", 960, 640, 1.3, { browSad: 1, look: [0, 10], smile: -6 }) + stamp(t, S(55) + 0.2, "E · CULPADO", 960, 820, CRIME, 100) + txt("QUEM PROCURAVA O CULPADO", 960, 120, 70, CREAM, 1, pop(t, S(55) + 1.0)); }
  } else if (t < S(57) - 0.3) {
    o += bg("#05070c") + `<g transform="translate(1320 1080) scale(${lerp(1, 1.08, seg(t, S(56), E(56)))}) translate(-1320 -1080)">${jo(t, 1320, 100, 1100, 1, 0.6)}</g>`;
    o += txt("OS NÚMEROS NÃO MENTEM.", 560, 420, 80, GOLD, 1, pop(t, S(56))) + txt("AS PESSOAS, SIM.", 560, 560, 92, CREAM, 1, pop(t, S(56) + 1.6));
  } else {
    o += bg("#05070c") + jo(t, 1440, 200, 860, 0.9, 0.4);
    o += `<g transform="translate(640 300) rotate(-6) scale(${pop(t, S(57), 0.25)})"><rect x="-500" y="-90" width="1000" height="180" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO ESPECIAL 2 · RESOLVIDO", 0, 0, 66, CRIME)}</g>`;
    o += pill(t, S(57) + 1.0, "ACERTOU? COMENTA \"EU SABIA\"", GOLD, 640, 560, 52) + pill(t, S(58) + 0.4, "TODA SEMANA, UM CASO NOVO", CREAM, 640, 720, 50) + pill(t, S(58) + 2.6, "SEGUE PRA NÃO PERDER", OK, 640, 860, 56);
  }
  o += vig() + capLong(t);
  o += black(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.6, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
