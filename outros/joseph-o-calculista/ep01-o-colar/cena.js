// JOSEPH, O CALCULISTA · CASO 1: O COLAR E A CHUVA (short vertical de teste, série original de investigação)
const NOIR = "#0b0f1a", CRIME = "#e5484d", AQUA = "#4fd1ff", MUD = "#6b4a2b";
const JW = 791, JH = 1249;                                   // assets/joseph.png
// the detective (user's art): x = centre, y = top, h = height; gentle breathing
function jo(t, x, y, h, op = 1, glow = 0) {
  const w = h * JW / JH, br = 1 + 0.006 * Math.sin(t * 2.2);
  let o = `<g opacity="${op}" transform="translate(${x} ${y + h}) scale(1 ${br}) translate(${-x} ${-(y + h)})">`;
  if (glow) o += `<ellipse cx="${x}" cy="${y + h * 0.45}" rx="${w * 0.75}" ry="${h * 0.55}" fill="${GOLD}" opacity="${0.18 * glow}"/>`;
  o += `<image href="assets/joseph.png" x="${x - w / 2}" y="${y}" width="${w}" height="${h}"/>`;
  return o + `</g>`;
}
function pill(t, a, s, col, y, size = 58, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#05070c" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }
function rain(t, amt = 1, n = 90) {
  let o = `<g opacity="${amt}" stroke="#7f9cc4" stroke-width="3" stroke-linecap="round">`;
  for (let i = 0; i < n; i++) { const x = hash(i) * 1200 - 60, sp = 1400 + hash(i + 9) * 500, y = ((t * sp + hash(i + 3) * SH) % (SH + 200)) - 100; o += `<line x1="${x}" y1="${y}" x2="${x - 12}" y2="${y + 50}" opacity="${0.3 + 0.5 * hash(i + 7)}"/>`; }
  return o + `</g>`;
}
const flash = t => { const f = [0.6, 3.1, 16.0, 36.0].map(a => dip(t, a, a + 0.04, a + 0.12, a + 0.4)).reduce((m, v) => Math.max(m, v), 0); return f > 0 ? `<rect width="${SW}" height="${SH}" fill="#dfe8ff" opacity="${0.55 * f}"/>` : ""; };
function badge(t, a, n, x = 170, y = 520) { const p = pop(t, a); return p > 0 ? `<g transform="translate(${x} ${y}) scale(${p})"><circle r="70" fill="${GOLD}" stroke="#000" stroke-width="7"/>${txt(String(n), 0, 0, 90, "#05070c")}</g>` : ""; }
function study(t, dim = 0.55) {
  let o = `<rect width="${SW}" height="${SH}" fill="#151a2a"/><rect y="1350" width="${SW}" height="570" fill="#2a1d1a"/>`;
  for (let i = 0; i < 6; i++) o += `<rect x="${i * 190}" y="300" width="14" height="1050" fill="#1d2336"/>`;
  o += `<rect x="640" y="380" width="340" height="460" rx="8" fill="#0a1020" stroke="#3a3326" stroke-width="18"/><g clip-path="url(#winC)">${rain(t, 0.9, 30)}</g><clipPath id="winC"><rect x="640" y="380" width="340" height="460"/></clipPath>`;
  return o + `<rect width="${SW}" height="${SH}" fill="#000" opacity="${dim * 0.4}"/>`;
}
function safe(t, open = 1) {
  let o = `<g transform="translate(330 900)"><rect x="-230" y="-260" width="460" height="520" rx="20" fill="#3b4150" stroke="#000" stroke-width="10"/><rect x="-190" y="-220" width="380" height="440" rx="10" fill="#0d0f14"/>`;
  o += `<rect x="-90" y="20" width="180" height="90" rx="14" fill="#5b1f2e" stroke="#000" stroke-width="6"/><ellipse cx="0" cy="40" rx="50" ry="22" fill="#3d1420"/>`;
  o += `<g transform="translate(-190 -220) scale(${1 - 0.85 * open} 1)"><rect width="380" height="440" rx="10" fill="#4a5162" stroke="#000" stroke-width="8"/><circle cx="190" cy="220" r="60" fill="#2a2f3a" stroke="#000" stroke-width="6"/></g></g>`;
  return o;
}
function necklace(x, y, s, t) {
  let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
  for (let i = 0; i <= 14; i++) { const a = Math.PI * (0.1 + 0.8 * i / 14); o += `<circle cx="${Math.cos(a) * 120}" cy="${Math.sin(a) * 90 - 90}" r="11" fill="#f2f6ff" stroke="#000" stroke-width="3"/>`; }
  o += `<path d="M 0 10 L 34 -20 L 0 -54 L -34 -20 Z" fill="${AQUA}" stroke="#000" stroke-width="5"/><path d="M -10 -30 L 0 -42 L 10 -30" stroke="#fff" stroke-width="4" fill="none"/>`;
  const k = Math.abs(Math.sin(t * 5)); o += `<path d="M 60 -70 l 6 16 l 16 6 l -16 6 l -6 16 l -6 -16 l -16 -6 l 16 -6 Z" fill="#fff" opacity="${k}"/>`;
  return o + `</g>`;
}
// suspects (rig front busts)
const SUS = {
  mordomo: { c: { skin: "#e0b48c", skinD: "#c49670", hood: "#1c1c22", hoodD: "#121217", hair: "#9a9a9a", style: "short" }, label: "MORDOMO", alibi: "na cozinha", col: "#cfd8e3" },
  sobrinha: { c: { skin: "#c68b5e", skinD: "#a97046", hood: "#8b2f5e", hoodD: "#6a2347", hair: "#2a1a12", style: "curly" }, label: "SOBRINHA", alibi: "no quarto", col: "#ff8fc2" },
  socio: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#24375a", hoodD: "#1a2944", hair: "#5a3a22", style: "short" }, label: "SÓCIO", alibi: "chegou 22:00 · não saiu", col: GOLD },
};
function bust(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: SUS[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.01) }, f)));
  let w = personBack(P) + personHead(P, t);
  if (k === "mordomo") w += `<path d="M 930 520 L 960 535 L 990 520 L 990 550 L 960 535 L 930 550 Z" fill="#000"/>`;
  if (k === "socio") w += `<path d="M 925 448 Q 960 432 995 448 Q 980 462 960 454 Q 940 462 925 448 Z" fill="#5a3a22"/><path d="M 940 520 L 960 600 L 980 520" fill="#f2f2f2" stroke="#000" stroke-width="4"/>`;
  return cam(960, 470, s, w, y).replace("translate(540 ", `translate(${x} `);
}
function suspectCard(t, a, k, y) {
  const p = pop(t, a); if (p <= 0) return "";
  const S0 = SUS[k];
  return `<g transform="translate(540 ${y}) scale(${p}) translate(-540 ${-y})"><rect x="60" y="${y - 150}" width="960" height="300" rx="30" fill="#0d111c" stroke="${S0.col}" stroke-width="6"/>` +
    `<clipPath id="cl${k}"><rect x="80" y="${y - 135}" width="270" height="270" rx="20"/></clipPath><g clip-path="url(#cl${k})"><rect x="80" y="${y - 135}" width="270" height="270" fill="#1d2336"/>${bust(t, k, 215, y + 20, 0.5)}</g>` +
    `<text class="hand" x="390" y="${y - 30}" font-size="70" fill="${S0.col}">${S0.label}</text><text class="hand" x="390" y="${y + 50}" font-size="${S0.alibi.length > 14 ? 42 : 52}" fill="#cfd8e3">${S0.alibi}</text></g>`;
}
function shoe(x, y, wet, t) {
  let o = `<g transform="translate(${x} ${y})"><path d="M -110 -30 L -20 -30 Q 0 -70 50 -70 L 70 -30 Q 120 -20 130 10 Q 136 34 110 34 L -120 34 Q -130 0 -110 -30 Z" fill="#5a3a24" stroke="#000" stroke-width="6"/><path d="M -80 -20 Q 0 -30 40 -50" stroke="#a87650" stroke-width="6" fill="none"/><rect x="-124" y="22" width="258" height="14" rx="6" fill="#2a1a10"/>`;
  if (wet) { o += `<path d="M -90 34 Q 0 70 120 34" fill="${MUD}" opacity="0.8"/>`; for (let i = 0; i < 4; i++) { const k = (t * 0.9 + i / 4) % 1; o += `<ellipse cx="${-60 + i * 50}" cy="${40 + k * 70}" rx="8" ry="12" fill="${AQUA}" opacity="${1 - k}"/>`; } }
  return o + `</g>`;
}

function render(t) {
  const end = window.TL.duration;
  let o = `<rect width="${SW}" height="${SH}" fill="${NOIR}"/>`;
  if (t < S(2) - 0.2) {
    o += study(t) + safe(t, seg(t, 0.4, 1.4));
    o += pill(t, S(1) + 1.2, "COFRE ABERTO", CRIME, 560, 60) + pill(t, S(1) + 3.2, "COLAR: R$ 2 MILHÕES", GOLD, 1300, 56);
    o += rain(t, 0.25);
  } else if (t < S(4) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
    o += txt("3 SUSPEITOS", 540, 370, 100, CREAM, 1, pop(t, S(2)));
    o += suspectCard(t, S(3), "mordomo", 610) + suspectCard(t, S(3) + 1.9, "sobrinha", 925) + suspectCard(t, S(3) + 3.6, "socio", 1240);
    if (t < S(3)) o += txt("todos com álibi", 540, 480, 56, "#8f99a3", seg(t, S(2) + 1.2, S(2) + 1.6));
  } else if (t < S(5) - 0.3) {
    const enter = seg(t, S(4) + 2.0, S(4) + 3.4);
    o += study(t, 0.8);
    o += `<rect x="330" y="300" width="420" height="1060" fill="#ffe7b0" opacity="${0.35 * enter}"/>`;
    o += jo(t, 540, lerp(1700, 470, sm(enter)), 900, enter, 0);
    if (t < S(4) + 2.0) o += pill(t, S(4), "POLÍCIA: \"FOI O MORDOMO?\"", "#8f99a3", 640, 52);
  } else if (t < S(6) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><circle cx="540" cy="900" r="520" fill="${GOLD}" opacity="0.08"/>`;
    o += jo(t, 540, 520, 1000, 1, 1);
    o += txt("JOSEPH", 540, 360, 150, CREAM, 1, pop(t, S(5))) + txt("O CALCULISTA", 540, 470, 80, GOLD, 1, pop(t, S(5) + 0.5));
    o += pill(t, S(5) + 3.2, "ELE FAZ A CONTA", GOLD, 1680, 54);
  } else if (t < S(7) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#121726"/><rect y="1100" width="${SW}" height="820" fill="#3a2a22"/>`;
    o += `<g transform="translate(540 980)"><ellipse cx="0" cy="110" rx="220" ry="40" fill="#e8e2d6" stroke="#000" stroke-width="6"/><path d="M -140 -60 L 140 -60 L 110 100 L -110 100 Z" fill="#f6f1e6" stroke="#000" stroke-width="8"/><path d="M 140 -20 q 70 0 70 50 q 0 50 -70 50" fill="none" stroke="#000" stroke-width="10"/><ellipse cx="0" cy="-58" rx="136" ry="18" fill="#8a5a2b"/></g>`;
    for (let i = 0; i < 3; i++) { const k = ((t * 0.6 + i / 3) % 1); o += `<path d="M ${490 + i * 50} ${880 - k * 260} q 20 -30 0 -60 q -20 -30 0 -60" fill="none" stroke="#e8e2d6" stroke-width="8" stroke-linecap="round" opacity="${0.6 * (1 - k)}"/>`; }
    o += badge(t, S(6), 1) + pill(t, S(6) + 1.6, "CHÁ AINDA MORNO", GOLD, 520, 56, 640) + pill(t, S(6) + 3.6, "ALGUÉM ESTEVE AQUI < 20 MIN", AQUA, 1360, 48);
  } else if (t < S(8) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a1020"/>` + rain(t, 1, 140);
    o += `<rect x="190" y="560" width="700" height="760" rx="12" fill="none" stroke="#3a3326" stroke-width="30"/><line x1="540" y1="560" x2="540" y2="1320" stroke="#3a3326" stroke-width="20"/><line x1="190" y1="940" x2="890" y2="940" stroke="#3a3326" stroke-width="20"/>`;
    o += badge(t, S(7), 2) + `<g transform="translate(540 1680)">${pill(t, S(7) + 1.2, "CHUVA: 22:15", AQUA, 0, 76, 0)}</g>`;
  } else if (t < S(9) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#5a2a2a"/>`;
    for (let i = 0; i < 12; i++) o += `<rect x="0" y="${300 + i * 140}" width="${SW}" height="8" fill="#4a2222"/>`;
    const k = seg(t, S(8) + 1.2, S(8) + 2.4);
    const sole = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M -50 -150 Q 0 -190 50 -150 Q 70 -60 45 10 Q 0 30 -45 10 Q -70 -60 -50 -150 Z" fill="${MUD}" stroke="#3a2614" stroke-width="5"/><path d="M -40 60 Q 0 40 40 60 Q 50 120 0 140 Q -50 120 -40 60 Z" fill="${MUD}" stroke="#3a2614" stroke-width="5"/>${[0, 1, 2, 3].map(i => `<line x1="-30" y1="${-120 + i * 35}" x2="30" y2="${-120 + i * 35}" stroke="#3a2614" stroke-width="5"/>`).join("")}</g>`;
    o += `<g opacity="${k}">${sole(420, 1060, -14) + sole(680, 820, -8)}</g>`;
    o += badge(t, S(8), 3) + pill(t, S(8) + 2.6, "LAMA FRESCA", "#e0a060", 1680, 60);
  } else if (t < S(11) - 0.3) {
    const look = t > S(10) - 0.2;
    o += `<rect width="${SW}" height="${SH}" fill="#151a2a"/><rect y="1180" width="${SW}" height="740" fill="#2a1d1a"/>`;
    const lab = [["MORDOMO", S(10), "SECO", "#8f99a3"], ["SOBRINHA", S(10) + 1.6, "SECA", "#8f99a3"], ["SÓCIO", S(10) + 3.4, "MOLHADO", CRIME]];
    lab.forEach(([n, a, st, c], i) => {
      const y = 600 + i * 300;
      o += `<g transform="translate(300 ${y}) scale(1.5) translate(-300 ${-y})">${shoe(300, y, i === 2 && t > a, t)}</g>` + txt(n, 780, y - 30, 60, CREAM, 1, pop(t, S(9) + i * 0.3));
      if (look && t > a) o += txt(st, 760, y + 50, i === 2 ? 72 : 56, c, 1, pop(t, a));
    });
  } else if (t < S(12) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><rect x="60" y="380" width="960" height="900" rx="20" fill="#13261d" stroke="#5a4630" stroke-width="16"/>`;
    const rows = [["CHEGOU", "22:00", S(11) + 0.5], ["NÃO SAIU DA SALA", "", S(11) + 1.6], ["CHUVA", "22:15", S(11) + 4.2], ["SAPATO", "MOLHADO", S(11) + 5.2]];
    rows.forEach(([a, b, at], i) => { const k = seg(t, at, at + 0.4); if (k > 0) o += `<text class="hand" x="120" y="${490 + i * 140}" font-size="64" fill="#e8efe6" opacity="${k}">${a} <tspan fill="${i % 2 ? CRIME : GOLD}">${b}</tspan></text>`; });
    const ln = seg(t, S(11) + 5.8, S(11) + 6.4);
    if (ln > 0) o += `<line x1="120" y1="1050" x2="${lerp(120, 960, ln)}" y2="1050" stroke="#e8efe6" stroke-width="8"/>`;
    if (t > S(11) + 6.4) o += `<g transform="translate(540 1170) rotate(-6) scale(${pop(t, S(11) + 6.4, 0.25)})"><rect x="-330" y="-80" width="660" height="160" rx="14" fill="none" stroke="${CRIME}" stroke-width="12"/>${txt("= MENTIU", 0, 0, 110, CRIME)}</g>`;
      } else if (t < S(13) - 0.3) {
    const pull = seg(t, S(12) + 2.4, S(12) + 3.6);
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "socio", 540, 1000, 1.8, { look: [0, 10], browSad: 1, smile: -6 });
    o += `<path d="M 700 790 q 14 26 0 44 q -14 -18 0 -44 Z" fill="${AQUA}" opacity="0.9"/>`;
    o += necklace(540, lerp(1700, 1300, sm(pull)), 1.5, t);
    if (pull > 0.6) o += pill(t, S(12) + 3.4, "O COLAR", AQUA, 400, 70);
  } else if (t < S(14) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>`;
    o += `<g transform="translate(540 1400) scale(${lerp(1.0, 1.15, seg(t, S(13), E(13)))}) translate(-540 -1400)">${jo(t, 540, 560, 1500, 1, 0.6)}</g>`;
    o += txt("OS NÚMEROS NÃO MENTEM.", 540, 400, 70, GOLD, 1, pop(t, S(13))) + txt("AS PESSOAS, SIM.", 540, 500, 70, CREAM, 1, pop(t, S(13) + 1.8));
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + jo(t, 540, 760, 900, 0.9, 0.4);
    o += `<g transform="translate(540 560) rotate(-6) scale(${pop(t, S(14), 0.25)})"><rect x="-400" y="-90" width="800" height="180" rx="16" fill="none" stroke="${CRIME}" stroke-width="12"/>${txt("CASO 1 · RESOLVIDO", 0, 0, 84, CRIME)}</g>`;
    o += pill(t, S(14) + 2.4, "CASO 2: EM BREVE", GOLD, 1700, 60);
  }
  o += flash(t);
  o += vignette();
  if (!window.THUMB) o += `<g><rect x="70" y="140" width="940" height="120" rx="30" fill="#05070c" opacity="0.9" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="540" y="222" font-size="58" text-anchor="middle" fill="${CREAM}">JOSEPH, O CALCULISTA · CASO 1</text></g>`;
  o += capShort(t);
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
