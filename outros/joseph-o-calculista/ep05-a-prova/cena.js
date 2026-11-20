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

const SUS = {
  caio: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#e5484d", hoodD: "#b3363a", hair: "#3a2414", style: "curly" }, label: "CAIO · BAGUNCEIRO", alibi: "respostas no celular", col: CRIME, L: "A" },
  lauro: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#5a6270", hoodD: "#454b57", hair: "#bfbfc8", style: "short" }, label: "SEU LAURO", alibi: "faxineiro · tem a chave", col: "#cfd8e3", L: "B" },
  marina: { c: { skin: "#a86f4a", skinD: "#8e5a3a", hood: "#f4efe6", hoodD: "#d9d4c7", hair: "#1c1410", style: "curly" }, label: "MARINA · NOTA 10", alibi: "chegou cedo pra ajudar", col: "#5be08a", L: "C" },
};
function bust(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: SUS[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.01) }, f)));
  let w = personBack(P) + personHead(P, t);
  if (k === "caio") w += `<path d="M 880 330 Q 960 260 1040 330 L 1040 345 L 880 345 Z" fill="#222" stroke="#000" stroke-width="5"/><rect x="1020" y="330" width="70" height="18" rx="6" fill="#222"/>`;
  if (k === "lauro") w += `<path d="M 878 330 Q 960 260 1042 330 L 1062 342 L 858 342 Z" fill="#5a6270" stroke="#000" stroke-width="6"/>`;
  if (k === "marina") w += `<circle cx="928" cy="398" r="30" fill="none" stroke="#3a3326" stroke-width="5"/><circle cx="992" cy="398" r="30" fill="none" stroke="#3a3326" stroke-width="5"/><rect x="1000" y="560" width="70" height="40" rx="6" fill="${GOLD}" stroke="#000" stroke-width="4"/><text x="1035" y="590" font-family="monospace" font-size="26" font-weight="700" text-anchor="middle" fill="#05070c">10</text>`;
  return cam(960, 470, s, w, y).replace("translate(540 ", `translate(${x} `);
}
function phoneChat(t, a) {     // the class group with the leaked photo
  let o = `<g transform="translate(540 980)"><rect x="-330" y="-640" width="660" height="1280" rx="60" fill="#111" stroke="#000" stroke-width="10"/><rect x="-300" y="-590" width="600" height="1180" rx="30" fill="#0b141a"/><rect x="-300" y="-590" width="600" height="110" rx="30" fill="#1f2c33"/><text x="-260" y="-520" font-family="sans-serif" font-size="40" font-weight="700" fill="#e9edef">3º B · TURMA</text>`;
  const p = pop(t, a);
  if (p > 0) o += `<g transform="translate(-20 -60) scale(${p})">${photo(t, 0, 0, 1)}</g><rect x="-280" y="330" width="420" height="80" rx="20" fill="#005c4b"/><text x="-260" y="382" font-family="sans-serif" font-size="34" fill="#e9edef">respostas 👀</text><text x="120" y="400" font-family="monospace" font-size="26" fill="#8696a0">07:40</text>`;
  return o + `</g>`;
}
function photo(t, x, y, s) {   // the leaked photo: exam answers + the wall clock at 7:12
  let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-250" y="-300" width="500" height="560" fill="#2a2420"/><rect x="-200" y="-150" width="340" height="380" fill="#f6eedc" stroke="#000" stroke-width="5" transform="rotate(-6)"/>`;
  ["1) B", "2) D", "3) A", "4) C", "5) B"].forEach((s2, i) => { o += `<text x="-170" y="${-90 + i * 60}" font-family="monospace" font-size="38" font-weight="700" fill="#1a2a4a" transform="rotate(-6)">${s2}</text>`; });
  o += `<g transform="translate(170 -220)"><circle r="56" fill="#f4efe6" stroke="#000" stroke-width="6"/><line x1="0" y1="0" x2="${Math.sin(Math.PI / 180 * 216) * 30}" y2="${-Math.cos(Math.PI / 180 * 216) * 30}" stroke="#000" stroke-width="8" stroke-linecap="round"/><line x1="0" y1="0" x2="${Math.sin(Math.PI / 180 * 72) * 44}" y2="${-Math.cos(Math.PI / 180 * 72) * 44}" stroke="#000" stroke-width="5" stroke-linecap="round"/><circle r="6" fill="#000"/></g>`;
  return o + `</g>`;
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
  if (t < S(2) - 0.15) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + phoneChat(t, 1.2) + stamp(t, 4.0, "VAZOU!", 380, CRIME, 110);
  } else if (t < S(3) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("COMENTA ANTES DO FIM:", 540, 760, 70, CREAM, 1, pop(t, S(2))) + txt("QUEM VAZOU?", 540, 910, 140, GOLD, 1, pop(t, S(2) + 0.6));
  } else if (t < S(6) - 0.2) {                            // suspects (Caio and Lauro look guilty, Marina looks perfect)
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("3 SUSPEITOS", 540, 370, 100, CREAM);
    o += card(t, S(3), "caio", 620) + card(t, S(4), "lauro", 940) + card(t, S(5), "marina", 1260);
    if (t > S(3) + 1.6 && t < S(4)) o += `<rect width="${SW}" height="${SH}" fill="${CRIME}" opacity="0.08"/>` + pill(t, S(3) + 1.8, "PEGO COM AS RESPOSTAS", CRIME, 1500, 48);
    if (t > S(4) + 1.6 && t < S(5)) o += pill(t, S(4) + 1.8, "SÓ ELE TEM A CHAVE", CRIME, 1500, 52);
    if (t > S(5) + 1.0) o += pill(t, S(5) + 1.2, "A ALUNA PERFEITA", "#5be08a", 1500, 52);
  } else if (t < S(8) - 0.2) {                            // Joseph's magnifier on the photo
    const ph = () => `<rect width="${SW}" height="${SH}" fill="#1a1612"/>` + photo(t, 540, 960, 1.7);
    o += ph();
    const k = seg(t, S(6) + 0.6, S(7) + 0.4), cx = lerp(420, 830, k), cy = lerp(1100, 590, k);
    o += lupa(t, cx, cy, 200, ph, 2.2);
    if (t > S(7) + 1.0) o += stamp(t, S(7) + 1.2, "07:12", 380, GOLD, 120);
  } else if (t < S(10) - 0.2) {                           // notebook + challenge countdown
    o += `<rect width="${SW}" height="${SH}" fill="#1a1612"/>` + notebook(t, S(8), [["FOTO: 07:12", S(8), 1.0, GOLD], ["CAIO: 07:30 ✗", S(8) + 1.2, 1.8, CRIME], ["LAURO: 07:20 ✗", S(8) + 3.4, 1.8, CRIME], ["NA SALA: ?", S(9), 0.8]]);
    const g0 = E(9) + 0.15;
    if (t > g0) {
      const n = Math.max(1, 3 - Math.floor((t - g0) / 0.9)), ph = ((t - g0) % 0.9) / 0.9;
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.55"/><g transform="translate(540 900) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="220" fill="#05070c" stroke="${GOLD}" stroke-width="14"/><circle r="220" fill="none" stroke="${CRIME}" stroke-width="14" stroke-dasharray="${1382 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 250, CREAM)}</g>` + txt("COMENTA AGORA!", 540, 1300, 80, CREAM);
    }
  } else if (t < S(11) - 0.2) {                           // reveal
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "marina", 540, 1000, 1.6, { browSad: 1, look: [0, 8], smile: -6 }) + stamp(t, S(10) + 0.3, "C · MARINA", 420, CRIME, 110);
    if (t > S(10) + 3.4) o += `<g transform="translate(830 1500) scale(${pop(t, S(10) + 3.4)})"><rect x="-90" y="-150" width="180" height="300" rx="26" fill="#111" stroke="#000" stroke-width="6"/><rect x="-74" y="-128" width="148" height="250" rx="10" fill="#0b141a"/>${txt("ENVIOU", 0, -40, 34, "#5be08a")}${txt("07:13", 0, 20, 44, GOLD)}</g>`;
    if (t > S(10) + 3.4) o += pill(t, S(10) + 3.6, "CAIO SÓ RECEBEU", DIM, 1500, 46, 360);
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + jo(t, 540, 760, 900, 0.9, 0.5);
    o += txt("OS NÚMEROS NÃO MENTEM.", 540, 380, 70, GOLD, 1, pop(t, S(11))) + txt("AS PESSOAS, SIM.", 540, 480, 70, CREAM, 1, pop(t, S(11) + 1.6));
    o += `<g transform="translate(540 640) rotate(-6) scale(${pop(t, S(11) + 3.0, 0.25)})"><rect x="-400" y="-80" width="800" height="160" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO 5 · RESOLVIDO", 0, 0, 80, CRIME)}</g>`;
  }
  o += vignette();
  if (!window.THUMB) o += `<g><rect x="70" y="140" width="940" height="120" rx="30" fill="#05070c" opacity="0.9" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="540" y="222" font-size="58" text-anchor="middle" fill="${CREAM}">JOSEPH, O CALCULISTA · CASO 5</text></g>`;
  o += capShort(t, 1800);
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
