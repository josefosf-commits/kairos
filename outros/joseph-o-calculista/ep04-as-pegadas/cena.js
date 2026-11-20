// JOSEPH, O CALCULISTA · CASO 4: AS PEGADAS NA AREIA (vertical, ~2:32). Joseph mais ativo: lupa, régua, caderno.
const NOIR = "#0b0f1a", CRIME = "#e5484d", AQUA = "#4fd1ff", GRASS = "#2f7a3e", MUD = "#6b4a2b", DIM = "#8f99a3";
const JW = 791, JH = 1249;
function jo(t, x, y, h, op = 1, glow = 0) {
  const w = h * JW / JH, br = 1 + 0.006 * Math.sin(t * 2.2);
  let o = `<g opacity="${op}" transform="translate(${x} ${y + h}) scale(1 ${br}) translate(${-x} ${-(y + h)})">`;
  if (glow) o += `<ellipse cx="${x}" cy="${y + h * 0.45}" rx="${w * 0.75}" ry="${h * 0.55}" fill="${GOLD}" opacity="${0.18 * glow}"/>`;
  return o + `<image href="assets/joseph.png" x="${x - w / 2}" y="${y}" width="${w}" height="${h}"/></g>`;
}
function pill(t, a, s, col, y, size = 58, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#05070c" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(esc(s), 0, 0, size, col)}</g>`; }
function badge(t, a, n, x = 170, y = 420) { const p = pop(t, a); return p > 0 ? `<g transform="translate(${x} ${y}) scale(${p})"><circle r="70" fill="${GOLD}" stroke="#000" stroke-width="7"/>${txt(String(n), 0, 0, 90, "#05070c")}</g>` : ""; }
function stamp(t, a, s, y, col = CRIME, size = 100) { if (t < a) return ""; const w = s.length * size * 0.55 + 90; return `<g transform="translate(540 ${y}) rotate(-6) scale(${pop(t, a, 0.25)})"><rect x="${-w / 2}" y="-80" width="${w}" height="160" rx="14" fill="#05070c" opacity="0.85" stroke="${col}" stroke-width="12"/>${txt(esc(s), 0, 0, size, col)}</g>`; }
const SAND = "#d9c08a", SANDD = "#bfa46c", SEA = "#1f4e79";
// ---------- Joseph moving (one art, animated) ----------
function joWalk(t, a, b, x0, x1, y, h) {           // walks in with a bob and a sway
  const k = seg(t, a, b), x = lerp(x0, x1, k), bob = k < 1 ? Math.abs(Math.sin(t * 7)) * 14 : 0, r = k < 1 ? Math.sin(t * 7) * 2 : 0;
  return `<g transform="rotate(${r} ${x} ${y + h})">${jo(t, x, y - bob, h, 1, 0.3)}</g>`;
}
function joThink(t, x, y, h) {                     // numbers orbit his head
  let o = jo(t, x, y, h, 1, 0.8);
  const N = ["110", "÷", "2,5", "44", "kg", "cm", "?"];
  N.forEach((n, i) => { const a = t * 0.8 + i / N.length * Math.PI * 2; o += txt(n, x + Math.cos(a) * h * 0.42, y + h * 0.22 + Math.sin(a) * h * 0.12, 54, i % 2 ? GOLD : CREAM, 0.5 + 0.5 * Math.sin(a)); });
  return o;
}
// POV: his hand (black sleeve, white cuff) entering from the bottom-right
function arm(hx, hy, sx = 1180, sy = 2000) {
  const ang = Math.atan2(hy - sy, hx - sx) * 180 / Math.PI;
  return `<line x1="${sx}" y1="${sy}" x2="${hx}" y2="${hy}" stroke="#111" stroke-width="150" stroke-linecap="round"/><g transform="translate(${hx} ${hy}) rotate(${ang + 90})"><rect x="-80" y="20" width="160" height="40" rx="10" fill="#f4efe6" stroke="#000" stroke-width="5"/>${[-42, -14, 14, 42].map((fx, i) => `<rect x="${fx - 15}" y="${-118 + Math.abs(i - 1.5) * 12}" width="30" height="80" rx="15" fill="#a86f4a" stroke="#000" stroke-width="5"/><path d="M ${fx - 7} ${-100 + Math.abs(i - 1.5) * 12} q 7 -6 14 0" fill="none" stroke="#8e5a3a" stroke-width="3"/>`).join("")}<rect x="-30" y="-20" width="30" height="74" rx="15" fill="#a86f4a" stroke="#000" stroke-width="5" transform="rotate(-58 -62 10)"/><ellipse cx="0" cy="-10" rx="66" ry="56" fill="#a86f4a" stroke="#000" stroke-width="6"/><path d="M -40 -50 Q 0 -62 40 -50" fill="none" stroke="#8e5a3a" stroke-width="4"/></g>`;
}
function lupa(t, cx, cy, r, scene, zoom = 1.9) {    // magnifier over a scene function: scene() draws the world
  let o = `<clipPath id="lens"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><g clip-path="url(#lens)"><g transform="translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})">${scene()}</g></g>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#bfe8ff" opacity="0.12"/><path d="M ${cx - r * 0.6} ${cy - r * 0.5} q ${r * 0.3} ${-r * 0.3} ${r * 0.7} ${-r * 0.35}" stroke="#fff" stroke-width="10" fill="none" opacity="0.5"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2a2f3a" stroke-width="26"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="8"/>`;
  const hx = cx + r * 0.75 + 120, hy = cy + r * 0.75 + 120;
  o += `<line x1="${cx + r * 0.72}" y1="${cy + r * 0.72}" x2="${hx}" y2="${hy}" stroke="#3a2414" stroke-width="44" stroke-linecap="round"/>`;
  return o + arm(hx, hy);
}
function notebook(t, a, lines, y0 = 520) {          // his hand writing the calculation
  let o = `<g transform="rotate(-3 540 1000)"><rect x="110" y="${y0 - 120}" width="860" height="1000" rx="20" fill="#f6eedc" stroke="#000" stroke-width="8"/>`;
  for (let i = 0; i < 12; i++) o += `<line x1="150" y1="${y0 - 30 + i * 80}" x2="930" y2="${y0 - 30 + i * 80}" stroke="#9fc7dd" stroke-width="3"/>`;
  o += `<line x1="220" y1="${y0 - 120}" x2="220" y2="${y0 + 880}" stroke="${CRIME}" stroke-width="3" opacity="0.6"/>`;
  let pen = null;
  lines.forEach(([s, at, dur, col], i) => {
    const k = cl((t - at) / dur); if (k <= 0) return;
    const y = y0 + 40 + i * 160, w = 700 * k;
    o += `<clipPath id="nb${i}"><rect x="240" y="${y - 90}" width="${w}" height="140"/></clipPath><text class="hand" x="250" y="${y}" font-size="84" fill="${col || "#1a2a4a"}" clip-path="url(#nb${i})">${esc(s)}</text>`;
    if (k < 1) pen = [250 + Math.min(w, s.length * 44), y - 10 + Math.sin(t * 30) * 6];
  });
  o += `</g>`;
  if (pen) o += `<g><line x1="${pen[0]}" y1="${pen[1]}" x2="${pen[0] + 110}" y2="${pen[1] + 170}" stroke="#111" stroke-width="16" stroke-linecap="round"/><path d="M ${pen[0]} ${pen[1]} l 8 18 l -14 2 Z" fill="${GOLD}"/>${arm(pen[0] + 130, pen[1] + 220)}</g>`;
  return o;
}
function boot(x, y, s, rot = 0, depth = 0.5) {     // a boot print in the sand
  const d = 0.25 + depth * 0.5;
  let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M -40 -120 Q 0 -150 40 -120 Q 58 -40 40 30 Q 0 46 -40 30 Q -58 -40 -40 -120 Z" fill="#8a6d3e" opacity="${d}"/><path d="M -34 60 Q 0 44 34 60 Q 40 110 0 124 Q -40 110 -34 60 Z" fill="#8a6d3e" opacity="${d}"/>`;
  for (let i = 0; i < 5; i++) o += `<line x1="-28" y1="${-100 + i * 28}" x2="28" y2="${-100 + i * 28}" stroke="#5a4528" stroke-width="6" opacity="${d}"/>`;
  return o + `</g>`;
}
function beach(t, prints = true) {
  let o = `<rect width="${SW}" height="${SH}" fill="${SAND}"/>`;
  for (let i = 0; i < 60; i++) o += `<circle cx="${hash(i) * 1080}" cy="${hash(i + 3) * 1920}" r="${2 + hash(i + 5) * 4}" fill="${SANDD}"/>`;
  if (prints) for (let i = 0; i < 7; i++) o += boot(i % 2 ? 600 : 470, 1800 - i * 230, 1, i % 2 ? 8 : -8, 0.4);
  return o;
}
function house(t) {
  let o = `<rect width="${SW}" height="${SH}" fill="#0d1a2e"/><rect y="1200" width="${SW}" height="720" fill="${SAND}" opacity="0.7"/><rect y="1100" width="${SW}" height="120" fill="${SEA}"/>`;
  o += `<g transform="translate(540 820)"><rect x="-340" y="-220" width="680" height="400" fill="#e8e2d6" stroke="#000" stroke-width="10"/><path d="M -380 -220 L 0 -420 L 380 -220 Z" fill="#8a3b1c" stroke="#000" stroke-width="10"/><rect x="-260" y="-130" width="180" height="140" fill="#ffd38a" stroke="#000" stroke-width="8"/><rect x="80" y="-130" width="180" height="140" fill="#3a2a20" stroke="#000" stroke-width="8"/></g>`;
  return o;
}
function safe(t, open = 1) {
  return `<g transform="translate(540 900)"><rect x="-260" y="-280" width="520" height="560" rx="20" fill="#3b4150" stroke="#000" stroke-width="10"/><rect x="-220" y="-240" width="440" height="480" rx="10" fill="#0d0f14"/><g transform="translate(-220 -240) scale(${1 - 0.85 * open} 1)"><rect width="440" height="480" rx="10" fill="#4a5162" stroke="#000" stroke-width="8"/><circle cx="220" cy="240" r="70" fill="#2a2f3a" stroke="#000" stroke-width="6"/></g></g>`;
}
const SUS = {
  ze: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#4f5d40", hoodD: "#3c4731", hair: "#120c09", style: "short" }, label: "ZÉ · CASEIRO", alibi: "110 kg · bota 44", col: "#9ad17a", L: "A" },
  fabio: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#2f5d7c", hoodD: "#234a63", hair: "#5a3a22", style: "short" }, label: "FÁBIO · GENRO", alibi: "dívidas · sofá", col: "#6fb3ff", L: "B" },
  livia: { c: { skin: "#d9a47a", skinD: "#bf8a62", hood: "#f0a6c8", hoodD: "#d987ad", hair: "#2a1a12", style: "curly" }, label: "LÍVIA, 15", alibi: "dormiu de fone", col: "#ff8fc2", L: "C" },
};
function bust(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: SUS[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.01) }, f)));
  let w = personBack(P) + personHead(P, t);
  if (k === "ze") w += `<path d="M 870 330 Q 960 230 1050 330 Z" fill="#c9a54a" stroke="#000" stroke-width="6"/><rect x="850" y="322" width="220" height="20" rx="8" fill="#c9a54a" stroke="#000" stroke-width="5"/>`;
  if (k === "livia") w += `<path d="M 872 400 Q 870 280 960 270 Q 1050 280 1048 400" fill="none" stroke="#222" stroke-width="14"/><rect x="852" y="380" width="36" height="60" rx="14" fill="#222"/><rect x="1032" y="380" width="36" height="60" rx="14" fill="#222"/>`;
  if (k === "fabio") w += `<path d="M 925 448 Q 960 436 995 448" stroke="#5a3a22" stroke-width="6" fill="none"/>`;
  return cam(960, 470, s, w, y).replace("translate(540 ", `translate(${x} `);
}
function card(t, a, k, y, letter = true, dim = 1) {
  const p = pop(t, a); if (p <= 0) return "";
  const S0 = SUS[k];
  let o = `<g opacity="${dim}" transform="translate(540 ${y}) scale(${p}) translate(-540 ${-y})"><rect x="60" y="${y - 150}" width="960" height="300" rx="30" fill="#0d111c" stroke="${S0.col}" stroke-width="6"/>` +
    `<clipPath id="cl${k}${y}"><rect x="80" y="${y - 135}" width="270" height="270" rx="20"/></clipPath><g clip-path="url(#cl${k}${y})"><rect x="80" y="${y - 135}" width="270" height="270" fill="#1d2336"/>${bust(t, k, 215, y + 20, 0.5)}</g>` +
    `<text class="hand" x="390" y="${y - 30}" font-size="60" fill="${S0.col}">${S0.label}</text><text class="hand" x="390" y="${y + 50}" font-size="46" fill="#cfd8e3">${esc(S0.alibi)}</text>`;
  if (letter) o += `<g transform="translate(960 ${y - 110})"><circle r="52" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt(S0.L, 0, 0, 70, "#05070c")}</g>`;
  return o + `</g>`;
}
function sweat(t, x, y) { let o = ""; for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; o += `<path d="M ${x + i * 60} ${y + k * 80} q 10 18 0 26 q -10 -8 0 -26 Z" fill="${AQUA}" opacity="${1 - k}"/>`; } return o; }
function bubble(t, a, s, x, y, col = "#1a1a1a") { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * 30 + 80; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="-70" width="${w}" height="140" rx="40" fill="#f4efe6" stroke="#000" stroke-width="7"/><path d="M -40 66 L -90 150 L 20 70 Z" fill="#f4efe6" stroke="#000" stroke-width="7"/>${txt(esc(s), 0, 0, 56, col)}</g>`; }
const red = (t, k = 1) => `<rect width="${SW}" height="${SH}" fill="${CRIME}" opacity="${0.08 * k + 0.04 * Math.sin(t * 3)}"/>`;
function render(t) {
  const end = window.TL.duration;
  let o = `<rect width="${SW}" height="${SH}" fill="${NOIR}"/>`;
  if (t < S(2) - 0.2) {                                  // the open safe
    if (t < 2.6) o += house(t) + pill(t, 0.5, "CASA DE PRAIA · 06:00", GOLD, 380, 50);
    else o += `<rect width="${SW}" height="${SH}" fill="#1a1d24"/>` + safe(t, seg(t, 2.6, 3.4)) + stamp(t, 3.6, "− R$ 500 MIL", 1400, CRIME, 90);
  } else if (t < S(3) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("COMENTA ANTES DO FIM:", 540, 760, 70, CREAM, 1, pop(t, S(2))) + txt("QUEM FOI?", 540, 910, 150, GOLD, 1, pop(t, S(2) + 0.8));
  } else if (t < S(4) - 0.3) {                           // the prints, found by Lívia
    o += beach(t) + pill(t, S(3) + 0.6, "PEGADAS DE BOTA", "#5a4528", 380, 56);
    if (t > S(3) + 4.6) o += `<g opacity="${seg(t, S(3) + 4.6, S(3) + 5.2)}">${bust(t, "livia", 820, 1500, 0.8, { smile: 4, look: [-8, 6] })}</g>` + pill(t, S(3) + 5.4, "QUEM ACHOU: LÍVIA", "#ff8fc2", 1180, 44, 700);
  } else if (t < S(5) - 0.3) {                           // A: Zé (made to look guilty)
    o += `<rect width="${SW}" height="${SH}" fill="#16120c"/>` + red(t) + bust(t, "ze", 540, 1050, 1.7, { browSad: 1, look: [-6, 8], smile: -4 });
    o += `<g transform="translate(900 380)"><circle r="60" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("A", 0, 0, 80, "#05070c")}</g>` + pill(t, S(4) + 0.3, "ZÉ · CASEIRO", "#9ad17a", 380, 52, 420);
    o += pill(t, S(4) + 2.4, "110 KG", GOLD, 560, 56, 300) + pill(t, S(4) + 4.4, "BOTAS 44 = SÓ DELE", CRIME, 1440, 56);
    if (t > S(4) + 7.4) o += stamp(t, S(4) + 7.6, "PRECISAVA DE DINHEIRO", 1640, CRIME, 60);
  } else if (t < S(6) - 0.3) {                           // B: Fábio
    o += `<rect width="${SW}" height="${SH}" fill="#0f141c"/>` + red(t, 0.7) + bust(t, "fabio", 540, 1050, 1.7, { browSad: 1, look: [6, 8], smile: -6 }) + (t > S(5) + 5.0 ? sweat(t, 700, 620) : "");
    o += `<g transform="translate(900 380)"><circle r="60" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("B", 0, 0, 80, "#05070c")}</g>` + pill(t, S(5) + 0.3, "FÁBIO · GENRO", "#6fb3ff", 380, 52, 420);
    o += pill(t, S(5) + 1.8, "DEVIA PRA MEIO MUNDO", CRIME, 560, 50) + pill(t, S(5) + 3.6, "SOFÁ · 5 m DO COFRE", GOLD, 1440, 54) + (t > S(5) + 5.4 ? stamp(t, S(5) + 5.6, "ACORDOU SUANDO", 1640, AQUA, 70) : "");
  } else if (t < S(7) - 0.3) {                           // C: Lívia (made to look innocent)
    o += `<rect width="${SW}" height="${SH}" fill="#1c1626"/><circle cx="540" cy="1000" r="520" fill="#ffc8e0" opacity="0.08"/>` + bust(t, "livia", 540, 1050, 1.7, { lid: 0.5, smile: 6, look: [0, 4] });
    for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; o += `<text class="hand" x="${760 + k * 80}" y="${620 - k * 200}" font-size="${50 + k * 30}" fill="#cfd8e3" opacity="${1 - k}">z</text>`; }
    o += `<g transform="translate(900 380)"><circle r="60" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("C", 0, 0, 80, "#05070c")}</g>` + pill(t, S(6) + 0.3, "LÍVIA, 15", "#ff8fc2", 380, 52, 380) + pill(t, S(6) + 2.6, "DORMIU DE FONE", DIM, 1440, 50);
  } else if (t < S(8) - 0.3) {                           // police take Zé; Joseph walks in
    const k = seg(t, S(7) + 2.4, S(7) + 3.0);
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/><rect width="${SW}" height="${SH}" fill="${Math.sin(t * 9) > 0 ? "#2a5bd7" : CRIME}" opacity="${0.16 * (1 - k)}"/>`;
    o += `<g opacity="${1 - k * 0.7}">${bust(t, "ze", 540, 1000, 1.4, { browSad: 1, look: [0, 8], smile: -6 })}</g>` + (k < 0.5 ? pill(t, S(7) + 0.3, "POLÍCIA: \"FOI O CASEIRO\"", DIM, 560, 48) : "");
    if (t > S(7) + 2.4) o += joWalk(t, S(7) + 2.4, S(7) + 4.4, -300, 540, 560, 1000);
  } else if (t < S(9) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><circle cx="540" cy="900" r="520" fill="${GOLD}" opacity="0.08"/>` + joThink(t, 540, 560, 1000);
    o += txt("JOSEPH", 540, 360, 150, CREAM, 1, pop(t, S(8))) + txt("O CALCULISTA", 540, 470, 80, GOLD, 1, pop(t, S(8) + 0.5)) + pill(t, S(8) + 3.0, "ELE FAZ A CONTA", GOLD, 1680, 54);
  } else if (t < S(11) - 0.3) {                          // clue 1: the magnifier over the sole
    const prints = () => beach(t);
    o += prints() + `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.25"/>`;
    const cx = 470 + 130 * Math.sin((t - S(9)) * 0.9), cy = 1100 - 200 * seg(t, S(9), S(9) + 4);
    o += lupa(t, cx, cy, 230, prints, 2.0) + badge(t, S(9), 1, 170, 420);
    o += pill(t, S(9) + 3.2, "MESMA SOLA DA BOTA DO ZÉ", "#9ad17a", 1700, 46);
    if (t > S(10)) o += stamp(t, S(10) + 0.2, "ZÉ?", 560, CRIME, 140);
  } else if (t < S(13) - 0.3) {                          // clue 2: the ruler, 2.5 cm vs 1 cm
    o += beach(t, false) + badge(t, S(11), 2, 170, 420);
    const night = t > S(12) - 0.2;
    o += boot(540, 1000, 2.2, -6, night ? 0.25 : 0.95);
    const depth = night ? 1 : 2.5, ry = 1000 - 40;
    o += `<g transform="translate(${lerp(1100, 800, seg(t, night ? S(12) : S(11) + 2, (night ? S(12) : S(11) + 2) + 1.2))} ${ry}) rotate(90)"><rect x="-260" y="-36" width="520" height="72" fill="#f4d35e" stroke="#000" stroke-width="5"/>${Array.from({ length: 21 }, (_, i) => `<line x1="${-250 + i * 25}" y1="-36" x2="${-250 + i * 25}" y2="${i % 2 ? -16 : 0}" stroke="#000" stroke-width="3"/>`).join("")}</g>`;
    o += arm(820, ry + 260);
    o += `<g transform="translate(540 600)">${txt(night ? "NOITE" : "ZÉ, DE MANHÃ", 0, -60, 60, night ? CRIME : "#9ad17a")}${txt(depth.toString().replace(".", ",") + " cm", 0, 50, 130, night ? CRIME : GOLD, 1, pop(t, night ? S(12) + 0.6 : S(11) + 5.0))}</g>`;
    if (night && t > S(12) + 4.4) o += stamp(t, S(12) + 4.6, "FÁBIO? MAIS MAGRO", 1560, "#6fb3ff", 70);
  } else if (t < S(14) - 0.3) {                          // clue 3: newspaper inside the boot
    o += `<rect width="${SW}" height="${SH}" fill="#1a1612"/>` + badge(t, S(13), 3, 170, 420);
    const pull = seg(t, S(13) + 1.6, S(13) + 3.2);
    o += `<g transform="translate(540 1050)"><path d="M -160 -420 L 100 -420 L 100 120 Q 260 140 280 260 L -180 260 Z" fill="#3a2414" stroke="#000" stroke-width="10"/><rect x="-170" y="-430" width="280" height="40" rx="10" fill="#2a1a10"/></g>`;
    o += `<g transform="translate(${lerp(540, 600, pull)} ${lerp(800, 560, pull)}) rotate(${-10 + 20 * pull})"><path d="M -110 -70 L 110 -60 L 100 70 L -100 80 Z" fill="#e8e2d6" stroke="#000" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<line x1="-80" y1="${-40 + i * 28}" x2="80" y2="${-36 + i * 28}" stroke="#777" stroke-width="5"/>`).join("")}</g>`;
    if (pull > 0.1) o += arm(lerp(600, 680, pull), lerp(700, 640, pull));
    o += pill(t, S(13) + 2.6, "JORNAL NA PONTA DA BOTA", GOLD, 400, 50) + pill(t, S(13) + 4.6, "PÉ MENOR", CRIME, 1560, 64, 300);
    if (t > S(13) + 7.0) o += stamp(t, S(13) + 7.2, "FÁBIO CALÇA 41", 1720, "#6fb3ff", 70);
  } else if (t < S(15) - 0.2) {                          // challenge
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("COMENTA AGORA:", 540, 380, 84, CREAM, 1, pop(t, S(14))) + txt("A, B OU C?", 540, 480, 76, GOLD, 1, pop(t, S(14) + 0.6));
    o += card(t, S(14) + 0.3, "ze", 700) + card(t, S(14) + 0.6, "fabio", 1010) + card(t, S(14) + 0.9, "livia", 1320);
    const g0 = E(14) + 0.2;
    if (t > g0) {
      const n = Math.max(1, 5 - Math.floor(t - g0)), ph = (t - g0) % 1;
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.55"/><g transform="translate(540 960) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="230" fill="#05070c" stroke="${GOLD}" stroke-width="14"/><circle r="230" fill="none" stroke="${CRIME}" stroke-width="14" stroke-dasharray="${1445 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 260, CREAM)}</g>`;
      o += txt("A, B OU C?", 540, 1560, 100, GOLD) + txt("ESCREVE NOS COMENTÁRIOS", 540, 1680, 60, CREAM);
    }
  } else if (t < S(17) - 0.3) {                          // the notebook: Joseph writes the calculation
    o += `<rect width="${SW}" height="${SH}" fill="#1a1612"/>`;
    o += notebook(t, S(15), [["2,5 cm = 110 kg", S(15) + 1.0, 2.6], ["1 cm = 44 kg", S(15) + 5.0, 2.0, CRIME], ["FÁBIO 85 kg", S(16) + 0.2, 1.6], ["→ quase 2 cm  ✗", S(16) + 2.6, 1.8, CRIME], ["44 kg + pé pequeno", S(17) - 0.6, 0.5, GOLD]]);
  } else if (t < S(18) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#1a1612"/>` + notebook(t, S(15), [["2,5 cm = 110 kg", 0, 0.01], ["1 cm = 44 kg", 0, 0.01, CRIME], ["FÁBIO 85 kg", 0, 0.01], ["→ quase 2 cm  ✗", 0, 0.01, CRIME], ["44 kg + pé pequeno", S(17), 2.4, GOLD]]);
  } else if (t < S(19) - 0.3) {                          // who found the prints?
    o += beach(t) + `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.5"/>` + `<g opacity="0.9">${bust(t, "livia", 820, 1500, 0.8, { smile: 4, look: [-8, 6] })}</g>`;
    o += txt("QUEM ACHOU AS PEGADAS?", 540, 520, 76, CREAM, 1, pop(t, S(18))) + txt("QUEM APONTOU PRO ZÉ?", 540, 650, 70, GOLD, 1, pop(t, S(18) + 2.6));
  } else if (t < S(21) - 0.3) {                          // reveal
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "livia", 540, 1000, 1.6, { browSad: t > S(20) ? 1 : 0, look: [0, 8], smile: t > S(20) ? -6 : 0 });
    o += stamp(t, S(19) + 0.3, "C · LÍVIA", 420, CRIME, 110);
    if (t > S(20)) {
      const k = seg(t, S(20) + 0.6, S(20) + 2.0);
      o += `<g transform="translate(830 1460) rotate(-20)"><path d="M -60 -260 Q -120 -200 -90 -100 Q -150 0 -90 120 L 90 120 Q 150 0 90 -100 Q 120 -200 60 -260 Z" fill="#2a1a10" stroke="#000" stroke-width="8"/></g>`;
      o += `<g opacity="${k}" transform="translate(830 ${lerp(1460, 1220, sm(k))})">${[0, 1, 2].map(i => `<rect x="${-90 + i * 30}" y="${-40 - i * 20}" width="160" height="80" rx="6" fill="#5fa86a" stroke="#000" stroke-width="5"/>`).join("")}</g>`;
      o += pill(t, S(20) + 1.6, "NA CAPA DO VIOLÃO", "#5be08a", 1640, 50);
      if (t > S(20) + 4.2) o += `<g transform="translate(250 1450) scale(${pop(t, S(20) + 4.2)})"><rect x="-90" y="-50" width="180" height="100" rx="14" fill="#05070c" stroke="${CRIME}" stroke-width="6"/><rect x="-74" y="-34" width="18" height="68" fill="${CRIME}"/><rect x="90" y="-18" width="14" height="36" fill="${CRIME}"/>${txt("22:00", 0, 90, 46, CRIME)}</g>`;
    }
  } else if (t < S(22) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "livia", 540, 1000, 1.6, { browSad: 1, look: [0, 10], smile: -6 });
    o += pill(t, S(21) + 0.4, "DÍVIDA ESCONDIDA", DIM, 420, 56) + pill(t, S(21) + 3.0, "A CULPA IA PRO ZÉ", CRIME, 1640, 56);
  } else if (t < S(23) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/><g transform="translate(540 1400) scale(${lerp(1.0, 1.15, seg(t, S(22), E(22)))}) translate(-540 -1400)">${jo(t, 540, 560, 1500, 1, 0.6)}</g>`;
    o += txt("OS NÚMEROS NÃO MENTEM.", 540, 400, 70, GOLD, 1, pop(t, S(22))) + txt("AS PESSOAS, SIM.", 540, 500, 70, CREAM, 1, pop(t, S(22) + 1.8));
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + jo(t, 540, 760, 900, 0.9, 0.4);
    o += `<g transform="translate(540 520) rotate(-6) scale(${pop(t, S(23), 0.25)})"><rect x="-400" y="-90" width="800" height="180" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO 4 · RESOLVIDO", 0, 0, 84, CRIME)}</g>`;
    o += pill(t, S(23) + 1.6, "DESCONFIOU DA LÍVIA? \"EU SABIA\"", GOLD, 720, 42) + pill(t, S(23) + 4.6, "CASO 5: EM BREVE", GOLD, 1620, 60);
  }
  o += vignette();
  if (!window.THUMB) o += `<g><rect x="70" y="140" width="940" height="120" rx="30" fill="#05070c" opacity="0.9" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="540" y="222" font-size="58" text-anchor="middle" fill="${CREAM}">JOSEPH, O CALCULISTA · CASO 4</text></g>`;
  o += capShort(t, 1800);
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
