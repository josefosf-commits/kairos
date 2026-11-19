// JOSEPH, O CALCULISTA · CASO ESPECIAL 1: O HOMEM QUE SUMIU DO ELEVADOR (16:9, ~6 min, duas pausas para o palpite)
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
const FLASH = [0.5, 59.5, 113.6, 185.4, 219.6, 284.3];
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
// ---------- elevator ----------
function elevatorDoors(cx, cy, open, floor, inside = "") {
  const w = 520, h = 760, half = w / 2 * (1 - open);
  let o = `<g transform="translate(${cx} ${cy})"><rect x="${-w / 2 - 50}" y="${-h / 2 - 120}" width="${w + 100}" height="${h + 140}" fill="#3a3326" stroke="#000" stroke-width="8"/>`;
  o += `<rect x="-90" y="${-h / 2 - 105}" width="180" height="80" rx="8" fill="#05070c" stroke="#000" stroke-width="5"/><text x="0" y="${-h / 2 - 45}" font-family="monospace" font-size="62" font-weight="700" text-anchor="middle" fill="${CRIME}">${floor}</text>`;
  o += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#141821"/>${inside}`;
  o += `<rect x="${-w / 2}" y="${-h / 2}" width="${half}" height="${h}" fill="#9aa3b2" stroke="#000" stroke-width="6"/><rect x="${w / 2 - half}" y="${-h / 2}" width="${half}" height="${h}" fill="#9aa3b2" stroke="#000" stroke-width="6"/>`;
  if (half > 4) o += `<line x1="${-w / 2 + half - 40}" y1="${-h / 2 + 40}" x2="${-w / 2 + half - 40}" y2="${h / 2 - 40}" stroke="#c9d0db" stroke-width="6" opacity="0.5"/>`;
  return o + `</g>`;
}
function corridor(warm = 1) {
  let o = bg("#1d1a22") + `<rect y="820" width="${W}" height="260" fill="#3b1f24"/>`;
  for (let i = 0; i < 9; i++) o += `<rect x="${i * 240}" y="820" width="120" height="260" fill="#4a2730" opacity="0.6"/>`;
  for (const x of [260, 1660]) o += `<g transform="translate(${x} 300)"><path d="M -40 0 L 40 0 L 30 60 L -30 60 Z" fill="#c9a54a"/><ellipse cx="0" cy="90" rx="160" ry="120" fill="url(#gLamp)" opacity="${0.6 * warm}"/></g>`;
  return o;
}
// ---------- people (rig busts) ----------
const PEO = {
  otavio: { c: { skin: "#e0b48c", skinD: "#c49670", hood: "#4a505c", hoodD: "#363b45", hair: "#7a7a7a", style: "short" }, name: "OTÁVIO BRANDÃO", col: "#cfd8e3" },
  rui: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#2f5d7c", hoodD: "#234a63", hair: "#120c09", style: "short" }, name: "RUI", role: "técnico · porão, sozinho", col: "#6fb3ff", L: "A" },
  bianca: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#5a2d6e", hoodD: "#432152", hair: "#8a3b1c", style: "curly" }, name: "BIANCA TORRES", role: "sócia · \"vai se arrepender\"", col: "#d58cff", L: "B" },
  aurelio: { c: { skin: "#c68b5e", skinD: "#a97046", hood: "#7a1f2e", hoodD: "#5e1722", hair: "#d8d8de", style: "short" }, name: "SEU AURÉLIO", role: "recepção · na câmera", col: GOLD, L: "C" },
  lia: { c: { skin: "#a86f4a", skinD: "#8e5a3a", hood: "#2a2a30", hoodD: "#1c1c22", hair: "#1c1410", style: "curly" }, name: "LIA", role: "camareira · 7º andar", col: "#ff9f6b", L: "D" },
};
function bust(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: PEO[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.013) }, f)));
  let w = personBack(P) + personHead(P, t);
  if (k === "otavio") w += `<path d="M 925 448 Q 960 432 995 448 Q 980 462 960 454 Q 940 462 925 448 Z" fill="#7a7a7a"/><path d="M 940 520 L 960 600 L 980 520" fill="#f2f2f2" stroke="#000" stroke-width="4"/><path d="M 952 530 L 968 530 L 964 600 L 956 600 Z" fill="${CRIME}"/>`;
  if (k === "rui") w += `<path d="M 878 330 Q 960 250 1042 330 L 1062 342 L 858 342 Z" fill="#2f5d7c" stroke="#000" stroke-width="6"/>`;
  if (k === "aurelio") w += `<circle cx="928" cy="398" r="30" fill="none" stroke="#3a3326" stroke-width="5"/><circle cx="992" cy="398" r="30" fill="none" stroke="#3a3326" stroke-width="5"/><path d="M 925 520 L 960 535 L 995 520 L 995 550 L 960 535 L 925 550 Z" fill="#000"/>`;
  if (k === "lia") w += `<path d="M 895 520 Q 960 566 1025 520 L 1010 600 L 910 600 Z" fill="#f4efe6" stroke="#000" stroke-width="5"/>`;
  if (k === "bianca") w += `<circle cx="884" cy="440" r="9" fill="${GOLD}" stroke="#000" stroke-width="3"/><circle cx="1036" cy="440" r="9" fill="${GOLD}" stroke="#000" stroke-width="3"/>`;
  return cam(960, 470, s, w, y).replace("translate(540 ", `translate(${x} `);
}
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
const GRID = [["rui", 500, 400], ["bianca", 1420, 400], ["aurelio", 500, 660], ["lia", 1420, 660]];
function countdown(t, g0, letters) {
  const n = Math.max(1, 5 - Math.floor((t - g0) / 1.1)), ph = ((t - g0) % 1.1) / 1.1;
  let o = black(0.6);
  o += `<g transform="translate(960 470) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="190" fill="#05070c" stroke="${GOLD}" stroke-width="12"/><circle r="190" fill="none" stroke="${CRIME}" stroke-width="12" stroke-dasharray="${1194 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 220, CREAM)}</g>`;
  return o + txt(letters, 960, 760, 96, GOLD) + txt("ESCREVE NOS COMENTÁRIOS", 960, 870, 58, CREAM);
}
function logTable(t, a, rows, hiRow, extraCol) {
  let o = `<g transform="translate(960 560)"><rect x="-760" y="-330" width="1520" height="620" rx="12" fill="#f2ecdc" stroke="#000" stroke-width="8"/><text x="-700" y="-250" font-family="monospace" font-size="46" font-weight="700" fill="#3a3326">REGISTRO DO ELEVADOR · 24/11</text><line x1="-700" y1="-220" x2="700" y2="-220" stroke="#3a3326" stroke-width="4"/>`;
  rows.forEach((r, i) => {
    const k = seg(t, a + i * 0.6, a + i * 0.6 + 0.3); if (k <= 0) return;
    const y = -130 + i * 120, hi = i === hiRow;
    if (hi) o += `<rect x="-720" y="${y - 60}" width="1440" height="90" fill="${GOLD}" opacity="${0.35 * k}"/>`;
    o += `<text x="-700" y="${y}" font-family="monospace" font-size="52" font-weight="700" fill="${hi ? "#8a1f1f" : "#1a1a1a"}" opacity="${k}">${r[0]}  ${r[1]}</text>`;
    if (extraCol && r[2]) { const k2 = seg(t, extraCol, extraCol + 0.4); if (k2 > 0) o += `<text x="680" y="${y}" font-family="monospace" font-size="46" font-weight="700" text-anchor="end" fill="${r[3] || "#1a1a1a"}" opacity="${k2}">${r[2]}</text>`; }
  });
  return o + `</g>`;
}
function diamonds(x, y, s, t, n = 5) {
  let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
  for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * 70, dy = (i % 2) * 30; o += `<g transform="translate(${dx} ${dy})"><path d="M -26 -10 L -14 -26 L 14 -26 L 26 -10 L 0 26 Z" fill="${AQUA}" stroke="#000" stroke-width="4"/><path d="M -26 -10 L 26 -10 M -14 -26 L 0 26 M 14 -26 L 0 26" stroke="#fff" stroke-width="2" opacity="0.7"/></g>`; }
  const k = Math.abs(Math.sin(t * 4)); o += `<path d="M 80 -60 l 8 20 l 20 8 l -20 8 l -8 20 l -8 -20 l -20 -8 l 20 -8 Z" fill="#fff" opacity="${k}"/>`;
  return o + `</g>`;
}
function briefcase(x, y, s = 1, open = 0, t = 0) {
  let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-100" width="300" height="200" rx="16" fill="#3a2414" stroke="#000" stroke-width="8"/><rect x="-50" y="-140" width="100" height="50" rx="12" fill="none" stroke="#000" stroke-width="14"/><rect x="-20" y="-110" width="40" height="22" fill="${GOLD}" stroke="#000" stroke-width="4"/>`;
  if (open) o += diamonds(0, 10, 0.9, t);
  return o + `</g>`;
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

function render(t) {
  const end = window.TL.duration;
  let o = bg();
  if (t < S(3) - 0.3) {                                 // 12th floor: he walks in, doors close
    const close = seg(t, S(2) + 2.2, S(2) + 4.0), walk = seg(t, 1.0, 4.2);
    const inside = close < 0.98 ? `<g opacity="${1 - close * 0.5}">${bust(t, "otavio", 0, 120 + 20 * (1 - walk), 0.9, { look: [0, 4], smile: 0 })}${briefcase(170, 260, 0.6)}</g>` : "";
    o += cctv(t, "CAM 12º ANDAR", seg(t, 0, 12) * 12, corridor() + elevatorDoors(960, 520, 1 - close, "12", `<g transform="translate(${lerp(-600, 0, sm(walk))} 0)">${inside}</g>`));
    o += pill(t, S(2) + 4.2, "SOZINHO", GOLD, 960, 200, 60);
  } else if (t < S(5) - 0.3) {                          // lobby: indicator counts down, doors open on nothing
    const k = seg(t, S(3), S(3) + 3.0), floor = Math.max(0, Math.round(12 - 12 * k)), open = seg(t, S(4) - 0.4, S(4) + 0.8);
    const secs = 12 + 60 * seg(t, S(3), S(4) - 0.4);
    o += cctv(t, "CAM TÉRREO", secs, corridor(0.8) + elevatorDoors(960, 520, open, floor === 0 ? "T" : String(floor), `<rect x="-260" y="-380" width="520" height="760" fill="#202634"/><rect x="-260" y="300" width="520" height="80" fill="#2a3040"/>`));
    o += pill(t, S(3) + 1.0, "72 SEGUNDOS", AQUA, 960, 200, 56);
    if (open > 0.6) o += stamp(t, S(4) + 0.4, "VAZIO", 960, 560, CRIME, 140);
  } else if (t < S(6) - 0.2) {
    o += bg("#05070c");
    const g = Math.sin(t * 40) > 0.6 ? 6 : 0;
    o += txt("NINGUÉM DESAPARECE", 960 + g, 470, 130, CREAM, 1, pop(t, S(5))) + txt("...ou desaparece?", 960, 620, 64, DIM, seg(t, S(5) + 2.0, S(5) + 2.6));
  } else if (t < E(7) + 0.2) {
    o += bg("#07090f");
    o += txt("VOCÊ VAI INVESTIGAR", 960, 300, 110, CREAM, 1, pop(t, S(6)));
    [["PAUSA 1", 640], ["PAUSA 2", 1280]].forEach(([s, x], i) => { const p = pop(t, S(6) + 2.6 + i * 0.6); if (p > 0) o += `<g transform="translate(${x} 560) scale(${p})"><rect x="-230" y="-110" width="460" height="220" rx="30" fill="#0d111c" stroke="${CRIME}" stroke-width="8"/>${txt("II", 0, -30, 70, CRIME)}${txt(s, 0, 50, 60, CREAM)}</g>`; });
    o += pill(t, S(7) + 0.5, "NADA É O QUE PARECE", GOLD, 960, 800, 56);
  } else if (t < S(8) - 0.2) {                          // title card
    const k = seg(t, E(7) + 0.2, E(7) + 1.0);
    o += bg("#05070c") + `<circle cx="960" cy="540" r="460" fill="${GOLD}" opacity="${0.07 * k}"/>`;
    o += txt("JOSEPH, O CALCULISTA", 960, 380, 76, GOLD, k) + txt("O HOMEM QUE SUMIU", 960, 520, 130, CREAM, 1, pop(t, E(7) + 0.5)) + txt("DO ELEVADOR", 960, 660, 130, CREAM, 1, pop(t, E(7) + 0.9));
    o += txt("CASO ESPECIAL", 960, 790, 48, CRIME, seg(t, E(7) + 1.4, E(7) + 2.0));
  } else if (t < S(12) - 0.3) {                         // the victim
    o += bg("#0d111c") + `<rect x="0" y="0" width="760" height="${H}" fill="#151a28"/>` + bust(t, "otavio", 380, 640, 1.25, { look: [4, 4] });
    o += `<text class="hand" x="820" y="230" font-size="86" fill="${CREAM}">OTÁVIO BRANDÃO</text>`;
    o += pill(t, S(8) + 2.6, "EMPRESÁRIO", DIM, 1010, 330, 44) + pill(t, S(8) + 4.0, "QUARTO 1204", AQUA, 1400, 330, 44);
    if (t > S(9)) o += briefcase(1060, 600, 1.1, t > S(9) + 1.8 ? 1 : 0, t) + pill(t, S(9) + 3.0, "R$ 10 MILHÕES", GOLD, 1560, 600, 60);
    o += pill(t, S(10) + 1.0, "09:00 · O NEGÓCIO DA VIDA", OK, 1300, 820, 46);
    o += stamp(t, S(11) + 1.6, "03:17 · SUMIU", 1300, 820, CRIME, 70);
  } else if (t < S(14) - 0.3) {                         // hotel in the rain, locked
    o += bg("#0a0e18");
    o += `<rect x="560" y="140" width="800" height="900" fill="#1a1f2c" stroke="#000" stroke-width="8"/>`;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) o += `<rect x="${610 + c * 150}" y="${180 + r * 110}" width="90" height="70" fill="${hash(r * 5 + c) > 0.6 ? "#ffd38a" : "#0d111c"}" opacity="0.85"/>`;
    o += `<rect x="860" y="860" width="200" height="180" fill="#3a2414" stroke="#000" stroke-width="6"/><text class="hand" x="960" y="130" font-size="64" text-anchor="middle" fill="${GOLD}">HOTEL</text>`;
    const pk = pop(t, S(12) + 2.4); if (pk > 0) o += `<g transform="translate(960 950) scale(${pk})"><rect x="-50" y="-30" width="100" height="80" rx="10" fill="${GOLD}" stroke="#000" stroke-width="6"/><path d="M -30 -30 L -30 -60 Q 0 -100 30 -60 L 30 -30" fill="none" stroke="#000" stroke-width="12"/></g>`;
    o += rain(t, 1, 160);
    o += pill(t, S(12) + 4.4, "NINGUÉM SAIU", CRIME, 420, 420, 56) + pill(t, S(13) + 0.8, "O CULPADO ESTÁ LÁ DENTRO", GOLD, 960, 780, 52);
  } else if (t < S(19) - 0.3) {                         // four suspects
    o += bg("#0a0d16") + txt("4 PESSOAS ACORDADAS", 960, 160, 90, CREAM, 1, pop(t, S(14)));
    GRID.forEach(([k, x, y], i) => { const a = S(15 + i); o += card(t, a, k, x, y + 40, { hi: t >= a && t < E(15 + i) + 0.3 }); });
  } else if (t < S(20) - 0.3) {
    const enter = seg(t, S(19) + 1.8, S(19) + 3.2);
    o += bg("#0d111c") + `<rect width="${W}" height="${H}" fill="${Math.sin(t * 9) > 0 ? "#2a5bd7" : CRIME}" opacity="${0.16 * (1 - enter)}"/>`;
    o += txt("POLÍCIA: SEM PISTAS", 960, 300, 80, DIM, 1 - enter);
    o += `<rect x="760" y="0" width="400" height="${H}" fill="#ffe7b0" opacity="${0.25 * enter}"/>` + jo(t, 960, lerp(1200, 120, sm(enter)), 900, enter);
  } else if (t < S(21) - 0.3) {
    o += bg("#07090f") + `<circle cx="1300" cy="560" r="480" fill="${GOLD}" opacity="0.08"/>` + jo(t, 1320, 110, 960, 1, 1);
    o += txt("JOSEPH", 560, 400, 170, CREAM, 1, pop(t, S(20))) + txt("O CALCULISTA", 560, 540, 86, GOLD, 1, pop(t, S(20) + 0.5)) + pill(t, S(20) + 3.0, "ELE FAZ A CONTA", GOLD, 560, 700, 52);
  } else if (t < S(25) - 0.3) {                         // math: 12 x 3 = 36, 72 - 36 = 36
    o += bg("#07090f") + `<rect x="80" y="130" width="1100" height="760" rx="20" fill="#13261d" stroke="#5a4630" stroke-width="16"/>`;
    const rows = [["1 ANDAR", "= 3 s", S(21) + 1.4, GOLD], ["12 × 3 s", "= 36 s", S(22) + 1.0, GOLD], ["VIAGEM REAL", "= 72 s", S(23) + 0.4, CRIME], ["72 − 36", "= 36 s PARADO", S(23) + 2.6, CRIME]];
    rows.forEach(([a, b, at, c], i) => { const k = seg(t, at, at + 0.4); if (k > 0) o += `<text class="hand" x="140" y="${270 + i * 150}" font-size="78" fill="#e8efe6" opacity="${k}">${a} <tspan fill="${c}">${b}</tspan></text>`; });
    // shaft with the car
    o += `<rect x="1380" y="120" width="300" height="800" fill="#11151c" stroke="#3a3326" stroke-width="10"/>`;
    for (let f = 0; f <= 12; f++) { const y = 900 - f * 64; o += `<line x1="1380" y1="${y}" x2="1680" y2="${y}" stroke="#2a2f3a" stroke-width="3"/><text x="1700" y="${y + 10}" font-family="monospace" font-size="30" fill="${f === 7 ? GOLD : DIM}">${f === 0 ? "T" : f}</text>`; }
    const tt = (t - S(21)) % 6, fl = tt < 1.5 ? 12 - 5 * tt / 1.5 : tt < 3 ? 7 : tt < 5.1 ? 7 - 7 * (tt - 3) / 2.1 : 0;
    o += `<rect x="1430" y="${900 - fl * 64 - 58}" width="200" height="56" rx="6" fill="${AQUA}" stroke="#000" stroke-width="5"/>`;
    if (t > S(24)) o += pill(t, S(24) + 0.3, "PAROU NO CAMINHO", CRIME, 1530, 1000 - 60, 40);
  } else if (t < S(26) - 0.3) {
    o += bg("#07090f") + badge(t, S(25), 2) + logTable(t, S(25) + 0.6, [["03:17:00", "PORTA FECHA · 12º"], ["03:17:15", "PARADA · 7º"], ["03:18:12", "PORTA ABRE · TÉRREO"]], t > S(25) + 4.4 ? 1 : -1);
  } else if (t < S(28) - 0.2) {                         // camera wall, CAM 7 off
    o += bg("#05070c") + badge(t, S(26), 3);
    const cams = ["CAM 12", "CAM 9", "CAM 7", "CAM 3", "CAM 1", "CAM TÉRREO"];
    cams.forEach((c, i) => {
      const x = 260 + (i % 3) * 600, y = 150 + Math.floor(i / 3) * 360, off = c === "CAM 7";
      o += `<rect x="${x - 40}" y="${y}" width="520" height="320" fill="${off ? "#111" : "#1b2a24"}" stroke="#2a2f3a" stroke-width="10"/>`;
      if (off) { for (let n = 0; n < 40; n++) o += `<rect x="${x - 30 + hash(n + Math.floor(t * 12)) * 480}" y="${y + 10 + hash(n * 3 + Math.floor(t * 12)) * 290}" width="${20 + hash(n) * 60}" height="4" fill="#ddd" opacity="0.5"/>`; o += `<text x="${x + 220}" y="${y + 180}" font-family="monospace" font-size="52" font-weight="700" text-anchor="middle" fill="${CRIME}">MANUTENÇÃO</text>`; }
      else o += `<rect x="${x - 10}" y="${y + 200}" width="460" height="90" fill="#24352e"/>`;
      o += `<text x="${x - 20}" y="${y + 44}" font-family="monospace" font-size="34" fill="#e8efe6">${c}</text>`;
    });
    if (t < S(27)) o += pill(t, S(26) + 1.6, "DESLIGADA DESDE 03:00", CRIME, 960, 880, 50);
    if (t > S(27)) o += txt("QUEM SABIA?", 960, 880, 100, GOLD, 1, pop(t, S(27)));
  } else if (t < S(31) - 0.2) {                         // PAUSE 1
    o += bg("#0a0d16") + `<rect x="0" y="40" width="${W}" height="150" fill="${CRIME}" opacity="${0.15 + 0.08 * Math.sin(t * 5)}"/>`;
    o += txt("PAUSA 1 · QUEM ESPERAVA NO 7º ANDAR?", 960, 115, 72, CREAM, 1, pop(t, S(28)));
    GRID.forEach(([k, x, y], i) => { o += card(t, S(29) + 0.5 + i * 0.4, k, x, y + 40); });
    if (t > E(30) + 0.2) o += countdown(t, E(30) + 0.2, "A, B, C OU D?");
  } else if (t < S(34) - 0.3) {                         // room 707
    if (t < S(32) - 0.2) {
      const sh = Math.sin(t * 50) * 6 * (Math.sin(t * 3) > 0.3 ? 1 : 0);
      o += corridor(0.5) + `<g transform="translate(${960 + sh} 560)"><rect x="-220" y="-380" width="440" height="640" fill="#4a2f22" stroke="#000" stroke-width="10"/><rect x="-150" y="-300" width="300" height="70" rx="8" fill="${GOLD}" stroke="#000" stroke-width="5"/>${txt("707", 0, -265, 56, "#05070c")}<rect x="-260" y="-60" width="520" height="80" fill="#e8b23a" stroke="#000" stroke-width="5" transform="rotate(-8)"/>${txt("EM REFORMA", 0, -20, 54, "#05070c")}</g>`;
      o += pill(t, S(31) + 1.0, "06:00 · BATIDAS", CRIME, 400, 200, 50);
    } else {
      o += bg("#1a1612") + `<rect y="760" width="${W}" height="320" fill="#2b241c"/>`;
      o += `<rect x="760" y="520" width="400" height="40" fill="#3a2414" stroke="#000" stroke-width="5"/><rect x="780" y="560" width="30" height="300" fill="#3a2414"/><rect x="1110" y="560" width="30" height="300" fill="#3a2414"/>`;
      o += bust(t, "otavio", 960, 560, 1.05, { browSad: 1, look: [0, 8], smile: -6 });
      o += `<path d="M 790 690 Q 960 740 1130 690" stroke="#c9b28a" stroke-width="16" fill="none"/><path d="M 790 730 Q 960 780 1130 730" stroke="#c9b28a" stroke-width="16" fill="none"/>`;
      o += `<circle cx="1000" cy="${560 - 225}" r="22" fill="#c0606a" stroke="#000" stroke-width="4"/>`;
      o += pill(t, S(32) + 1.4, "VIVO", OK, 440, 300, 60) + pill(t, S(32) + 3.4, "GALO NA CABEÇA", CRIME, 1480, 300, 50);
      if (t > S(33)) o += `<g opacity="${seg(t, S(33), S(33) + 0.4)}"><rect x="1500" y="560" width="300" height="200" rx="16" fill="none" stroke="${CRIME}" stroke-width="8" stroke-dasharray="20 14"/>${txt("?", 1650, 660, 120, CRIME)}</g>` + pill(t, S(33) + 0.9, "MALETA: SUMIU", CRIME, 1650, 830, 46);
    }
  } else if (t < S(36) - 0.3) {                         // "cheiro de graxa" -> Rui
    o += bg("#0d111c");
    if (t < S(35) - 0.2) {
      o += bust(t, "otavio", 480, 640, 1.1, { browSad: 1, mouthOpen: 0.25 + 0.2 * Math.abs(Math.sin(t * 9)) });
      o += `<g transform="translate(1260 420)"><rect x="-520" y="-200" width="1040" height="400" rx="40" fill="#f4efe6" stroke="#000" stroke-width="8"/><path d="M -460 160 L -560 260 L -380 190 Z" fill="#f4efe6" stroke="#000" stroke-width="8"/>`;
      o += `<text class="hand" x="-470" y="-90" font-size="58" fill="#1a1a1a">"Fui atacado por trás..."</text><text class="hand" x="-470" y="10" font-size="58" fill="#1a1a1a">"Não vi o rosto."</text><text class="hand" x="-470" y="110" font-size="58" fill="#8a1f1f" opacity="${seg(t, S(34) + 4.6, S(34) + 5.2)}">"Cheiro forte de GRAXA."</text></g>`;
    } else {
      o += bust(t, "rui", 960, 620, 1.15, { browSad: 1, look: [0, 6] });
      for (const x of [700, 1220]) o += `<g transform="translate(${x} 900)"><ellipse rx="70" ry="50" fill="#8d5a3b" stroke="#000" stroke-width="5"/><ellipse rx="70" ry="50" fill="#1a1410" opacity="0.7"/></g>`;
      o += stamp(t, S(35) + 0.3, "GRAXA", 960, 200, "#e0a060", 96);
    }
  } else if (t < S(38) - 0.3) {                         // two keys, Rui arrested
    o += bg("#0d111c");
    if (t < S(37) - 0.2) {
      const key = (x, lab, col, a) => { const p = pop(t, a); return p > 0 ? `<g transform="translate(${x} 480) scale(${p})"><circle r="80" fill="none" stroke="${col}" stroke-width="26"/><rect x="70" y="-14" width="300" height="28" fill="${col}"/><rect x="300" y="14" width="24" height="50" fill="${col}"/><rect x="250" y="14" width="24" height="36" fill="${col}"/>${txt(lab, 140, 170, 50, col)}</g>` : ""; };
      o += txt("QUARTO 707: SÓ 2 CHAVES", 960, 170, 84, CREAM, 1, pop(t, S(36)));
      o += key(380, "MANUTENÇÃO", "#6fb3ff", S(36) + 2.6) + key(1180, "MESTRA · RECEPÇÃO", GOLD, S(36) + 4.4);
    } else {
      o += `<rect width="${W}" height="${H}" fill="${Math.sin(t * 9) > 0 ? "#2a5bd7" : CRIME}" opacity="0.18"/>` + bust(t, "rui", 960, 620, 1.1, { browSad: 1, look: [0, 8], smile: -6 });
      o += `<g transform="translate(960 930)"><circle cx="-70" r="46" fill="none" stroke="#cfd8e3" stroke-width="14"/><circle cx="70" r="46" fill="none" stroke="#cfd8e3" stroke-width="14"/><line x1="-24" x2="24" stroke="#cfd8e3" stroke-width="10"/></g>`;
      o += stamp(t, S(37) + 1.6, "CASO ENCERRADO?", 960, 170, DIM, 80);
    }
  } else if (t < S(39) - 0.3) {
    o += bg("#05070c") + jo(t, 1320, 120, 960, 1, 0.6) + txt("UMA CONTA", 600, 440, 120, CREAM, 1, pop(t, S(38) + 1.0)) + txt("NÃO FECHA", 600, 580, 120, CRIME, 1, pop(t, S(38) + 2.6));
  } else if (t < S(41) - 0.3) {                         // clue 4: bump on the forehead
    o += bg("#0d111c") + badge(t, S(39), 4);
    o += bust(t, "otavio", 960, 640, 1.35, { look: [0, 4] });
    const k = seg(t, S(40) + 2.6, S(40) + 3.4);
    o += `<circle cx="1000" cy="${640 - 290}" r="${22 + 10 * k}" fill="#c0606a" stroke="${k > 0.5 ? GOLD : "#000"}" stroke-width="${4 + 6 * k}"/>`;
    o += pill(t, S(40) + 0.4, "\"ATACADO POR TRÁS\"", DIM, 420, 420, 46);
    if (t > S(40) + 2.6) o += `<line x1="1060" y1="330" x2="1360" y2="260" stroke="${GOLD}" stroke-width="8"/>` + pill(t, S(40) + 2.8, "GALO NA TESTA", CRIME, 1540, 250, 56);
  } else if (t < S(43) - 0.3) {                         // clue 5: the ropes
    o += bg("#1a1612") + badge(t, S(41), 5);
    o += bust(t, "otavio", 760, 620, 1.0, { browSad: 1, look: [0, 8] }) + `<path d="M 600 700 Q 760 750 920 700" stroke="#c9b28a" stroke-width="16" fill="none"/><path d="M 600 740 Q 760 790 920 740" stroke="#c9b28a" stroke-width="16" fill="none"/><circle cx="760" cy="765" r="24" fill="#c9b28a" stroke="#000" stroke-width="4"/>`;
    o += `<g transform="translate(1380 560)"><circle r="230" fill="#0d111c" stroke="${GOLD}" stroke-width="8"/><path d="M -150 -40 Q 0 -120 150 -40 M -150 40 Q 0 120 150 40" stroke="#c9b28a" stroke-width="30" fill="none"/><path d="M -60 -50 C 60 -50 60 50 -60 50 C 60 50 -40 -20 40 -60" stroke="#c9b28a" stroke-width="30" fill="none"/><path d="M 40 40 Q 80 140 60 210" stroke="#c9b28a" stroke-width="24" fill="none"/></g><line x1="784" y1="765" x2="1160" y2="600" stroke="${GOLD}" stroke-width="5" stroke-dasharray="12 10"/>`;
    o += pill(t, S(42) + 0.6, "AMARRADO NA FRENTE", GOLD, 760, 260, 48);
    const tug = seg(t, S(42) + 3.0, S(42) + 4.0); if (tug > 0) o += `<g opacity="${tug}">${txt("PUXA A PONTA COM OS DENTES", 1380, 860, 46, AQUA)}</g>`;
    o += stamp(t, S(42) + 5.4, "DÁ PRA FAZER SOZINHO", 1380, 180, CRIME, 60);
  } else if (t < S(46) - 0.3) {                         // clue 6: button pressed from inside
    if (t < S(45) - 0.2) {
      o += bg("#07090f") + badge(t, S(43), 6);
      o += logTable(t, S(43) + 0.4, [["03:17:00", "PORTA FECHA · 12º", "", ""], ["03:17:15", "PARADA · 7º", "BOTÃO INTERNO", "#8a1f1f"], ["03:18:12", "PORTA ABRE · TÉRREO", "", ""]], t > S(44) ? 1 : -1, S(44) + 3.6);
      o += pill(t, S(44) + 0.4, "NÃO FOI O CORREDOR", CRIME, 960, 960, 50);
    } else {
      o += bg("#141821") + `<rect x="760" y="140" width="400" height="800" rx="20" fill="#9aa3b2" stroke="#000" stroke-width="8"/>`;
      for (let f = 12; f >= 0; f--) { const i = 12 - f, x = 880 + (i % 2) * 160, y = 220 + Math.floor(i / 2) * 100, on = f === 7; o += `<circle cx="${x}" cy="${y}" r="38" fill="${on ? GOLD : "#2a2f3a"}" stroke="#000" stroke-width="5"/>${on ? `<circle cx="${x}" cy="${y}" r="${50 + 10 * Math.sin(t * 6)}" fill="none" stroke="${GOLD}" stroke-width="5" opacity="0.6"/>` : ""}<text x="${x}" y="${y + 14}" font-family="monospace" font-size="38" font-weight="700" text-anchor="middle" fill="${on ? "#05070c" : "#e8efe6"}">${f === 0 ? "T" : f}</text>`; }
      o += txt("DENTRO: 1 PESSOA", 1550, 540, 70, CREAM, 1, pop(t, S(45) + 1.0));
    }
  } else if (t < S(49) - 0.2) {                         // PAUSE 2 with option E
    o += bg("#0a0d16") + `<rect x="0" y="40" width="${W}" height="150" fill="${CRIME}" opacity="${0.15 + 0.08 * Math.sin(t * 5)}"/>`;
    o += txt("ÚLTIMA PAUSA · MUDA O SEU PALPITE?", 960, 115, 72, CREAM, 1, pop(t, S(46)));
    GRID.forEach(([k, x, y], i) => { o += card(t, S(46) + 1.0 + i * 0.3, k, x, y - 30, { dim: t > S(47) && t < E(47) + 0.3 }); });
    const pe = pop(t, S(47) + 0.6); if (pe > 0) o += `<g transform="translate(960 850) scale(${pe})"><rect x="-410" y="-90" width="820" height="180" rx="26" fill="#0d111c" stroke="${CRIME}" stroke-width="8" stroke-dasharray="24 14"/><g transform="translate(-330 0)"><circle r="56" fill="#000" stroke="${CRIME}" stroke-width="5"/>${txt("?", 0, 0, 80, CRIME)}</g>${txt("NINGUÉM DA LISTA?", 60, 0, 60, CRIME)}<g transform="translate(390 -80)"><circle r="44" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("E", 0, 0, 58, "#05070c")}</g></g>`;
    if (t > E(48) + 0.2) o += countdown(t, E(48) + 0.2, "A, B, C, D OU E?");
  } else if (t < S(51) - 0.3) {                         // reveal: he walked out on 7
    const open = seg(t, S(49) + 0.3, S(49) + 1.3), out = seg(t, S(49) + 1.5, S(49) + 3.2);
    o += cctv(t, t < S(50) ? "7º ANDAR · RECONSTITUIÇÃO" : "CAM 7", 15, corridor(0.6) + elevatorDoors(960, 520, open, "7", "") + `<g transform="translate(${lerp(960, 1500, sm(out))} 0)">${bust(t, "otavio", 0, 700, 0.75)}${briefcase(130, 860, 0.5)}</g>`);
    o += stamp(t, S(49) + 2.4, "ELE SAIU SOZINHO", 960, 220, CRIME, 70);
    if (t > S(50)) { const k = seg(t, S(50) + 3.4, S(50) + 4.2); o += black(0.85 * k) + (k > 0.5 ? txt("CÂMERA DESLIGADA: 03:00", 960, 540, 76, CRIME, k) : ""); }
  } else if (t < S(53) - 0.3) {                         // master key + staging
    o += bg("#0d111c");
    if (t < S(52) - 0.2) {
      o += `<rect x="1100" y="200" width="620" height="520" rx="12" fill="#3a2414" stroke="#000" stroke-width="8"/>`;
      for (let i = 0; i < 12; i++) { const x = 1170 + (i % 4) * 150, y = 290 + Math.floor(i / 4) * 150, gone = i === 5 && t > S(51) + 1.6; o += `<circle cx="${x}" cy="${y - 40}" r="8" fill="#888"/>${gone ? "" : `<rect x="${x - 8}" y="${y - 40}" width="16" height="70" fill="${i === 5 ? GOLD : "#aaa"}"/><circle cx="${x}" cy="${y - 50}" r="16" fill="none" stroke="${i === 5 ? GOLD : "#aaa"}" stroke-width="6"/>`}`; }
      o += pill(t, S(51) + 2.0, "CHAVE MESTRA", GOLD, 1410, 800, 52);
      o += bust(t, "aurelio", 480, 640, 1.0, { look: [-8, 6], smile: 6 }) + `<g transform="translate(700 860)"><path d="M -50 -60 L 50 -60 L 40 40 L -40 40 Z" fill="#f4efe6" stroke="#000" stroke-width="6"/>${[0, 1].map(i => { const k = (t * 0.6 + i / 2) % 1; return `<path d="M ${-10 + i * 20} ${-70 - k * 80} q 14 -20 0 -40" stroke="#e8e2d6" stroke-width="6" fill="none" opacity="${1 - k}"/>`; }).join("")}</g>`;
      o += pill(t, S(51) + 4.0, "SERVINDO CAFÉ", DIM, 480, 200, 44);
    } else {
      const it = [["GRAXA NA ROUPA", "#e0a060", S(52) + 0.2], ["TESTA NA PAREDE", CRIME, S(52) + 2.0], ["SE AMARROU", AQUA, S(52) + 3.6]];
      it.forEach(([s, c, a], i) => { const p = pop(t, a); if (p > 0) o += `<g transform="translate(${360 + i * 600} 520) scale(${p})"><rect x="-260" y="-200" width="520" height="400" rx="30" fill="#0d111c" stroke="${c}" stroke-width="8"/>${txt(String(i + 1), 0, -70, 140, c)}${txt(s, 0, 110, 52, CREAM)}</g>`; });
      o += txt("TUDO ENCENADO", 960, 180, 96, GOLD, 1, pop(t, S(52) + 5.0));
    }
  } else if (t < S(55) - 0.3) {                         // motive board
    o += bg("#07090f") + `<rect x="160" y="120" width="1600" height="780" rx="20" fill="#13261d" stroke="#5a4630" stroke-width="16"/>`;
    const rows = [["EMPRESA", "FALIDA", S(53) + 1.2, CRIME], ["SEGURO DOS DIAMANTES", "R$ 10 MI", S(53) + 3.4, GOLD], ["SE ROUBADOS", "SEGURO PAGA", S(53) + 6.0, GOLD], ["ELE FICA COM", "SEGURO + PEDRAS", S(54) + 0.6, CRIME]];
    rows.forEach(([a, b, at, c], i) => { const k = seg(t, at, at + 0.4); if (k > 0) o += `<text class="hand" x="230" y="${260 + i * 160}" font-size="80" fill="#e8efe6" opacity="${k}">${a}: <tspan fill="${c}">${b}</tspan></text>`; });
    o += stamp(t, S(54) + 3.0, "= MENTIU", 1400, 820, CRIME, 100);
  } else if (t < S(58) - 0.3) {                         // the ice bucket
    o += bg("#0d111c") + `<ellipse cx="960" cy="560" rx="700" ry="420" fill="${AQUA}" opacity="0.05"/>`;
    const dig = seg(t, S(56) + 0.4, S(56) + 3.0), rev = seg(t, S(57), S(57) + 0.6);
    o += `<g transform="translate(960 640)"><path d="M -300 -220 L 300 -220 L 240 260 L -240 260 Z" fill="#c0c7d2" stroke="#000" stroke-width="10"/><rect x="-320" y="-250" width="640" height="50" rx="12" fill="#e2e7ee" stroke="#000" stroke-width="8"/>`;
    for (let i = 0; i < 14; i++) { const x = -230 + (i % 7) * 76, y = -260 - Math.floor(i / 7) * 60 - dig * 160 * hash(i), r = (hash(i + 4) - 0.5) * 40; o += `<rect x="${x}" y="${y}" width="66" height="60" rx="10" fill="#e9f7ff" stroke="#9fc7dd" stroke-width="4" opacity="${0.95 - 0.6 * dig}" transform="rotate(${r} ${x + 33} ${y + 30})"/>`; }
    o += `</g>` + (dig > 0.3 ? diamonds(960, 380, 1.6 + 0.8 * rev, t, 6) : "");
    o += pill(t, S(55) + 2.4, "BALDE DE GELO · 1204", AQUA, 960, 140, 50);
    if (t > S(57)) o += txt("DIAMANTES", 960, 900, 130, AQUA, 1, pop(t, S(57)));
  } else if (t < S(60) - 0.3) {                         // innocent x4, culprit = the victim
    o += bg("#0a0d16");
    if (t < S(59) - 0.2) {
      GRID.forEach(([k, x, y], i) => { o += card(t, S(58) - 0.2, k, x, y, { stamp: "INOCENTE", stampCol: OK }); });
      o += txt("O RUI FOI SOLTO", 960, 120, 72, OK, 1, pop(t, S(58)));
    } else {
      o += bust(t, "otavio", 960, 640, 1.3, { browAng: 1, look: [6, 2], smile: -4 }) + `<circle cx="1000" cy="${640 - 280}" r="28" fill="#c0606a" stroke="#000" stroke-width="4"/>`;
      o += stamp(t, S(59) + 0.6, "E · CULPADO", 960, 820, CRIME, 100);
      o += txt("O HOMEM QUE TODO MUNDO PROCURAVA", 960, 120, 64, CREAM, 1, pop(t, S(59) + 1.6));
    }
  } else if (t < S(61) - 0.3) {
    o += bg("#05070c") + `<g transform="translate(1320 1080) scale(${lerp(1, 1.08, seg(t, S(60), E(60)))}) translate(-1320 -1080)">${jo(t, 1320, 100, 1100, 1, 0.6)}</g>`;
    o += txt("OS NÚMEROS NÃO MENTEM.", 560, 420, 80, GOLD, 1, pop(t, S(60))) + txt("AS PESSOAS, SIM.", 560, 560, 92, CREAM, 1, pop(t, S(60) + 1.6));
  } else {
    o += bg("#05070c") + jo(t, 1440, 200, 860, 0.9, 0.4);
    o += `<g transform="translate(640 300) rotate(-6) scale(${pop(t, S(61), 0.25)})"><rect x="-500" y="-90" width="1000" height="180" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO ESPECIAL · RESOLVIDO", 0, 0, 72, CRIME)}</g>`;
    o += pill(t, S(61) + 1.0, "ACERTOU? COMENTA \"EU SABIA\"", GOLD, 640, 560, 52);
    o += pill(t, S(62) + 0.4, "TODA SEMANA, UM CASO NOVO", CREAM, 640, 720, 50);
    o += pill(t, S(62) + 2.6, "SEGUE PRA NÃO PERDER", OK, 640, 860, 56);
  }
  o += flash(t) + vig();
  o += capLong(t);
  o += black(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.6, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
