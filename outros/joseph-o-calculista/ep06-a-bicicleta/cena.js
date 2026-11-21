// JOSEPH, O CALCULISTA · CASO 6: A BICICLETA (vertical, 1:12)
// JOSEPH, O CALCULISTA · CASO 5: A PROVA VAZADA (vertical, 0:59).
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


function bustG(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: SUS[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.01) }, f)));
  return cam(960, 470, s, personBack(P) + personHead(P, t) + (SUS[k].extra || ""), y).replace("translate(540 ", `translate(${x} `);
}
function bust(t, k, x, y, s, f) { return bustG(t, k, x, y, s, f); }
function countdown3(t, g0) {
  const n = Math.max(1, 3 - Math.floor((t - g0) / 0.95)), ph = ((t - g0) % 0.95) / 0.95;
  return `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.55"/><g transform="translate(540 900) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="220" fill="#05070c" stroke="${GOLD}" stroke-width="14"/><circle r="220" fill="none" stroke="${CRIME}" stroke-width="14" stroke-dasharray="${1382 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 250, CREAM)}</g>` + txt("COMENTA AGORA!", 540, 1300, 80, CREAM);
}
function receipt(x, y, s, lines, rot = -4) {
  let o = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M -170 -260 L 170 -260 L 170 240 l -28 20 l -28 -20 l -28 20 l -28 -20 l -28 20 l -28 -20 l -28 20 l -28 -20 l -28 20 l -28 -20 l -28 20 L -170 240 Z" fill="#f6f3ea" stroke="#000" stroke-width="5"/>`;
  lines.forEach(([s2, c], i) => { o += `<text x="-140" y="${-190 + i * 64}" font-family="monospace" font-size="38" font-weight="700" fill="${c || "#1a1a1a"}">${s2}</text>`; });
  return o + `</g>`;
}
function render(t) {
  const end = window.TL.duration;
  let o = `<rect width="${SW}" height="${SH}" fill="${NOIR}"/>`;
  if (t < S(2) - 0.15) o += CFG.intro(t);
  else if (t < S(3) - 0.2) o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("COMENTA ANTES DO FIM:", 540, 760, 70, CREAM, 1, pop(t, S(2))) + txt(CFG.q, 540, 910, 130, GOLD, 1, pop(t, S(2) + 0.6));
  else if (t < S(6) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("3 SUSPEITOS", 540, 370, 100, CREAM);
    const K = Object.keys(SUS);
    o += card(t, S(3), K[0], 620) + card(t, S(4), K[1], 940) + card(t, S(5), K[2], 1260);
    CFG.pills.forEach(([s2, col], i) => { if (t > S(3 + i) + 1.4 && (i === 2 || t < S(4 + i))) o += (i < 2 ? `<rect width="${SW}" height="${SH}" fill="${CRIME}" opacity="0.07"/>` : "") + pill(t, S(3 + i) + 1.6, s2, col, 1500, 50); });
  } else if (t < S(7) - 0.2) o += CFG.c6(t);
  else if (t < S(8) - 0.2) o += CFG.c7(t);
  else if (t < S(9)) o += CFG.c8(t);
  else if (t < S(10) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("COMENTA AGORA:", 540, 380, 84, CREAM, 1, pop(t, S(9))) + txt("A, B OU C?", 540, 480, 76, GOLD, 1, pop(t, S(9) + 0.4));
    const K = Object.keys(SUS);
    o += card(t, S(9) + 0.2, K[0], 700) + card(t, S(9) + 0.4, K[1], 1010) + card(t, S(9) + 0.6, K[2], 1320);
    if (t > E(9) + 0.15) o += countdown3(t, E(9) + 0.15);
  } else if (t < S(11) - 0.2) o += `<rect width="${SW}" height="${SH}" fill="#1a1612"/>` + notebook(t, S(10), CFG.nb);
  else if (t < S(12) - 0.2) o += CFG.reveal(t);
  else {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + jo(t, 540, 760, 900, 0.9, 0.5);
    o += txt("OS NÚMEROS NÃO MENTEM.", 540, 380, 70, GOLD, 1, pop(t, S(12))) + txt("AS PESSOAS, SIM.", 540, 480, 70, CREAM, 1, pop(t, S(12) + 1.6));
    o += `<g transform="translate(540 640) rotate(-6) scale(${pop(t, S(12) + 3.0, 0.25)})"><rect x="-400" y="-80" width="800" height="160" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO " + CFG.n + " · RESOLVIDO", 0, 0, 80, CRIME)}</g>`;
  }
  o += vignette();
  if (!window.THUMB) o += `<g><rect x="70" y="140" width="940" height="120" rx="30" fill="#05070c" opacity="0.9" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="540" y="222" font-size="58" text-anchor="middle" fill="${CREAM}">JOSEPH, O CALCULISTA · CASO ${CFG.n}</text></g>`;
  o += capShort(t, 1800);
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;

// ===== CASO 6: A BICICLETA =====
const SUS = {
  duda: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#e5484d", hoodD: "#b3363a", hair: "#3a2414", style: "short" }, label: "DUDA · O RIVAL", alibi: "\"essa bike vai ser minha\"", col: CRIME, L: "A" },
  valter: { c: { skin: "#c68b5e", skinD: "#a97046", hood: "#26324a", hoodD: "#1b2436", hair: "#bfbfc8", style: "short" }, label: "SEU VÁLTER", alibi: "porteiro · sozinho", col: "#cfd8e3", L: "B", extra: `<path d="M 878 330 Q 960 260 1042 330 L 1062 342 L 858 342 Z" fill="#26324a" stroke="#000" stroke-width="6"/>` },
  pedro: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#3d9a5a", hoodD: "#2f7a46", hair: "#120c09", style: "curly" }, label: "PEDRO · AMIGO", alibi: "ajudou a procurar", col: "#5be08a", L: "C" },
};
function bike(x, y, s, col = "#2f80ed") { return `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-150" cy="60" r="90" fill="none" stroke="#111" stroke-width="16"/><circle cx="150" cy="60" r="90" fill="none" stroke="#111" stroke-width="16"/><path d="M -150 60 L -40 -60 L 90 -60 L 150 60 M -40 -60 L 10 60 L 90 -60 M -150 60 L 10 60" fill="none" stroke="${col}" stroke-width="16" stroke-linejoin="round"/><path d="M 90 -60 L 110 -110 L 150 -110" stroke="#111" stroke-width="12" fill="none"/><rect x="-70" y="-90" width="70" height="20" rx="8" fill="#111"/></g>`; }
function lock(x, y, s, digits) { return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -60 -40 L -60 -110 Q 0 -180 60 -110 L 60 -40" fill="none" stroke="#9aa3b2" stroke-width="22"/><rect x="-110" y="-50" width="220" height="200" rx="20" fill="#3b4150" stroke="#000" stroke-width="8"/>${digits.split("").map((d, i) => `<rect x="${-90 + i * 46}" y="30" width="38" height="60" rx="6" fill="#f4efe6" stroke="#000" stroke-width="4"/><text x="${-71 + i * 46}" y="74" font-family="monospace" font-size="40" font-weight="700" text-anchor="middle" fill="#1a1a1a">${d}</text>`).join("")}</g>`; }
const CFG = {
  n: 6, q: "QUEM LEVOU?",
  pills: [["\"VAI SER MINHA\"", CRIME], ["SÓ ELE NO PORTÃO", CRIME], ["O MELHOR AMIGO", "#5be08a"]],
  intro: t => { let o = `<rect width="${SW}" height="${SH}" fill="#1b2230"/><rect y="1300" width="${SW}" height="620" fill="#2a2f3a"/>`; for (let i = 0; i < 4; i++) o += `<rect x="${160 + i * 220}" y="1060" width="16" height="260" fill="#9aa3b2"/>`; o += t < 2.5 ? bike(540, 1180, 1.2) : stamp(t, 2.6, "SUMIU", 1100, CRIME, 140); return o + pill(t, 0.5, "SAÍDA DA ESCOLA", GOLD, 420, 52); },
  c6: t => { const sc = () => `<rect width="${SW}" height="${SH}" fill="#1a1612"/>` + lock(540, 900, 2.2, "1207"); const k = seg(t, S(6), S(6) + 3), cx = lerp(380, 560, k), cy = lerp(1200, 820, k); return sc() + lupa(t, cx, cy, 200, sc, 1.8) + (t > S(6) + 3.4 ? stamp(t, S(6) + 3.6, "NÃO FOI CORTADO", 420, GOLD, 70) : ""); },
  c7: t => `<rect width="${SW}" height="${SH}" fill="#1a1612"/>` + lock(540, 820, 2.2, "1207") + stamp(t, S(7) + 1.6, "12/07 = ANIVERSÁRIO DO LÉO", 1420, GOLD, 52),
  c8: t => { const sc = () => `<rect width="${SW}" height="${SH}" fill="#2a2420"/>` + receipt(540, 900, 1.5, [["BIBLIOTECA"], ["DEVOLUÇÃO"], ["LIVRO: 0457"], ["ALUNO: PEDRO"], ["HORA: 14:52", CRIME]]); const k = seg(t, S(8) + 2.6, S(8) + 5), cx = lerp(400, 480, k), cy = lerp(700, 1080, k); return sc() + pill(t, S(8) + 0.4, "PEDRO: \"ATÉ 15:30\"", DIM, 400, 48) + lupa(t, cx, cy, 190, sc, 1.8); },
  nb: [["DUDA: senha? ✗", S(10) + 0.2, 1.4, CRIME], ["VÁLTER: niver? ✗", S(10) + 2.2, 1.4, CRIME], ["SABIA + 14:52", S(10) + 4.4, 1.4, GOLD]],
  reveal: t => { let o = `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "pedro", 540, 960, 1.5, { browSad: 1, look: [0, 8], smile: -6 }) + stamp(t, S(11) + 0.2, "C · PEDRO", 420, CRIME, 110); if (t > S(11) + 2.6) o += `<g opacity="${seg(t, S(11) + 2.6, S(11) + 3.2)}">${bike(540, 1480, 0.9, "#e0a060")}</g>` + pill(t, S(11) + 3.0, "PINTADA · GARAGEM DA AVÓ", GOLD, 1700, 46); return o; },
};
