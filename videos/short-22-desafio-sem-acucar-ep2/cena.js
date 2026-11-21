// SHORT 22 — DESAFIO 30 DIAS · T2 (SEM AÇÚCAR) · EP 2 (dias 3 a 15) — base: short-21
const REDC = "#e5484d", CANDY = "#ff6fae", ENE = "#4fd1ff", HUM = "#30a46c", CHOC = "#5a3420";
function stats(t) {
  const von = kf(t, [[0, 0.95], [S(1) + 4.5, 0.85], [S(4), 0.6], [S(6), 0.5], [S(7), 0.62], [S(8), 0.45], [S(9), 0.35]]);
  const ene = kf(t, [[0, 0.3], [S(4), 0.55], [S(5), 0.8], [S(9), 0.85]]);
  const hum = kf(t, [[0, 0.35], [S(2), 0.55], [S(3), 0.7], [S(5), 0.8], [S(9), 0.85]]);
  return { von, ene, hum };
}
function dayOf(t) { return t < S(4) - 0.3 ? 3 : t < S(6) - 0.3 ? 7 : t < S(9) - 0.3 ? 10 : 14; }
function hud(t) {
  const d = dayOf(t), st = stats(t), flash = [S(4) - 0.3, S(6) - 0.3, S(9) - 0.3].some(a => inR(t, a, a + 0.5));
  let o = `<g transform="translate(60 300)"><rect width="960" height="190" rx="30" fill="#07080b" opacity="0.88" stroke="${flash ? GOLD : "#2a3140"}" stroke-width="5"/>`;
  o += `<text class="hand" x="40" y="80" font-size="44" fill="#8f99a3">DIA</text><text class="hand" x="40" y="160" font-size="96" fill="${CREAM}">${d}<tspan font-size="44" fill="#8f99a3">/30</tspan></text>`;
  [["VONTADE", st.von, CANDY], ["ENERGIA", st.ene, ENE], ["HUMOR", st.hum, HUM]].forEach(([lab, v, c], i) => {
    const y = 40 + i * 50;
    o += `<text class="hand" x="290" y="${y + 22}" font-size="32" fill="${c}">${lab}</text><rect x="480" y="${y}" width="440" height="30" rx="15" fill="#1a1f29"/><rect x="480" y="${y}" width="${440 * cl(v)}" height="30" rx="15" fill="${c}"/>`;
  });
  o += `</g>`;
  for (let i = 0; i < 30; i++) { const done = i < d - 1; o += `<rect x="${60 + i * 32}" y="510" width="26" height="26" rx="6" fill="${done ? GOLD : i === d - 1 ? "#3a4150" : "#1a1f29"}" stroke="#000" stroke-width="2"/>`; }
  return o;
}
function room(t, inner, day = 0.8, warm = 0.2, sy = 1240, s = 1.2) { return cam(960, 560, s, roomBg(day, warm) + inner, sy); }
function banner(t, a, s, col) { const p = pop(t, a); return p > 0 && t < a + 2.2 ? `<g transform="translate(540 760) scale(${p})" opacity="${1 - seg(t, a + 1.8, a + 2.2)}"><rect x="-260" y="-80" width="520" height="160" rx="30" fill="#07080b" stroke="${col}" stroke-width="8"/>${txt(s, 0, 0, 100, col)}</g>` : ""; }
function pill(t, a, s, col, y, size = 60, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#07080b" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }
function bubble(x, y, s, lines, col = INK, tail = "left") {
  if (s <= 0) return "";
  const w = Math.max(...lines.map(l => l.length)) * 27 + 80, h = lines.length * 64 + 40;
  let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="34" fill="#fff" stroke="#000" stroke-width="7"/>`;
  const tx = tail === "left" ? -w / 2 + 70 : w / 2 - 70, dir = tail === "left" ? -1 : 1;
  o += `<path d="M ${tx - 30} ${h / 2 - 4} L ${tx + dir * 40} ${h / 2 + 60} L ${tx + 30} ${h / 2 - 4} Z" fill="#fff" stroke="#000" stroke-width="7" stroke-linejoin="round"/><rect x="${tx - 34}" y="${h / 2 - 14}" width="68" height="14" fill="#fff"/>`;
  lines.forEach((l, i) => { o += `<text class="hand" x="0" y="${-h / 2 + 66 + i * 64}" font-size="52" text-anchor="middle" fill="${col}">${l}</text>`; });
  return o + `</g>`;
}
// --- props (screen space, centred) ---
const cookie = () => `<rect x="-90" y="-55" width="180" height="110" rx="14" fill="#2d6cdf" stroke="#000" stroke-width="6"/><circle cx="-35" cy="0" r="30" fill="${CHOC}" stroke="#f6f1e6" stroke-width="8"/><circle cx="35" cy="0" r="30" fill="${CHOC}" stroke="#f6f1e6" stroke-width="8"/>`;
const cocoa = () => `<rect x="-55" y="-80" width="110" height="160" rx="12" fill="#e8b23a" stroke="#000" stroke-width="6"/><rect x="-55" y="-80" width="110" height="34" rx="12" fill="#c43b2f" stroke="#000" stroke-width="6"/><circle cx="0" cy="18" r="30" fill="${CHOC}"/>`;
const cereal = (s = 1) => `<g transform="scale(${s})"><rect x="-80" y="-115" width="160" height="230" rx="8" fill="#ff8a3d" stroke="#000" stroke-width="6"/><text class="hand" x="0" y="-55" font-size="40" text-anchor="middle" fill="#fff">CEREAL</text><circle cx="-20" cy="20" r="18" fill="#ffd27a" stroke="#000" stroke-width="4"/><circle cx="22" cy="40" r="18" fill="#ffd27a" stroke="#000" stroke-width="4"/><circle cx="0" cy="75" r="18" fill="#ffd27a" stroke="#000" stroke-width="4"/></g>`;
const choco = () => `<rect x="-95" y="-45" width="190" height="90" rx="10" fill="${CHOC}" stroke="#000" stroke-width="6"/><path d="M -95 -45 L 10 -45 L -20 45 L -95 45 Z" fill="#c43b2f" stroke="#000" stroke-width="6"/><line x1="40" y1="-45" x2="40" y2="45" stroke="#3a2010" stroke-width="5"/>`;
const apple = (r = 48) => `<circle r="${r}" fill="#e5484d" stroke="#000" stroke-width="6"/><path d="M 0 ${-r} q 4 -22 16 -28" stroke="#5a3d1a" stroke-width="7" fill="none"/><ellipse cx="22" cy="${-r - 14}" rx="18" ry="9" fill="${HUM}" stroke="#000" stroke-width="4"/>`;
const soda = () => `<rect x="-50" y="-90" width="100" height="180" rx="16" fill="#c4161c" stroke="#000" stroke-width="6"/><path d="M -50 -10 Q 0 30 50 -10" stroke="#fff" stroke-width="10" fill="none"/>`;
const cake = (t) => { let o = `<ellipse cx="0" cy="70" rx="260" ry="40" fill="#e6e1d6" stroke="#000" stroke-width="6"/><rect x="-200" y="-70" width="400" height="130" rx="20" fill="${CHOC}" stroke="#000" stroke-width="7"/><path d="M -200 -40 Q -150 -10 -100 -40 Q -50 -10 0 -40 Q 50 -10 100 -40 Q 150 -10 200 -40" stroke="#8a5a3a" stroke-width="12" fill="none"/>`; for (const x of [-80, 0, 80]) o += `<rect x="${x - 9}" y="-130" width="18" height="60" fill="${CANDY}" stroke="#000" stroke-width="4"/><ellipse cx="${x}" cy="${-145 + Math.sin(t * 9 + x) * 3}" rx="10" ry="16" fill="${GOLD}"/>`; return o; };
const briga = (x, y) => `<g transform="translate(${x} ${y})"><circle r="26" fill="#3a2010" stroke="#000" stroke-width="5"/><circle cx="-8" cy="-8" r="4" fill="${CANDY}"/><circle cx="8" cy="-4" r="4" fill="${GOLD}"/><circle cx="0" cy="8" r="4" fill="${ENE}"/></g>`;
const plate = (s = 1) => `<g transform="scale(${s})"><ellipse rx="190" ry="60" fill="#f6f1e6" stroke="#000" stroke-width="7"/><path d="M -70 10 L 70 10 L 70 -50 L -70 -10 Z" fill="${CHOC}" stroke="#000" stroke-width="6"/><path d="M -70 -10 L 70 -50" stroke="#8a5a3a" stroke-width="10"/></g>`;
function friendF(t, f, x) { const P = Object.assign({ x, c: FRIEND }, face(Object.assign({ lid: blink(t, 0.06, 1.1) }, f))); return personBack(P) + personHead(P, t); }
function josephF(t, f, x) { const P = Object.assign({ x, c: JOSEPH }, face(Object.assign({ lid: blink(t, 0.06) }, f))); return personBack(P) + personHead(P, t); }

const MOM = { skin: "#b07a52", skinD: "#946243", hood: "#a8466b", hoodD: "#83334f", hair: "#1f1410", style: "curly" };
const PAL = { skin: "#7a4b2e", skinD: "#633c24", hood: "#3e63dd", hoodD: "#2f4ca8", hair: "#111", style: "short" };
function momF(t, f, x) { const P = Object.assign({ x, c: MOM }, face(Object.assign({ lid: blink(t, 0.06, 2.1) }, f))); let o = personBack(P) + personHead(P, t); for (const ex of [884, 1036]) o += `<circle cx="${ex + x - 960}" cy="${432 + P.bob}" r="9" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>`; return o; }
const juice = () => `<rect x="-90" y="-150" width="180" height="300" rx="10" fill="#ffb347" stroke="#000" stroke-width="7"/><path d="M -90 -150 L 0 -200 L 90 -150 Z" fill="#ffd27a" stroke="#000" stroke-width="7" stroke-linejoin="round"/><rect x="30" y="-230" width="14" height="70" fill="#fff" stroke="#000" stroke-width="4"/><circle cx="0" cy="-30" r="50" fill="#ff7a1c" stroke="#000" stroke-width="5"/><text class="hand" x="0" y="80" font-size="44" text-anchor="middle" fill="#3a1a00">NATURAL</text><text class="hand" x="0" y="126" font-size="30" text-anchor="middle" fill="#3a1a00">100%*</text>`;
const water = () => `<path d="M -80 -130 L 80 -130 L 62 130 L -62 130 Z" fill="#cfe9ff" fill-opacity="0.55" stroke="#000" stroke-width="7"/><path d="M -72 -60 L 72 -60 L 62 130 L -62 130 Z" fill="#7fc8ff" opacity="0.5"/><g transform="translate(40 -110)"><circle r="44" fill="#d7f27a" stroke="#000" stroke-width="6"/><circle r="30" fill="#f3ffc0" stroke="#9bc43a" stroke-width="4"/></g>`;

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(3) - 0.2) {
    const laugh = t > S(2) - 0.1 && t < S(2) + 1.6;
    o += room(t, josephF(t, { look: [8, 4], smile: t > S(1) + 4.2 ? 6 : -1, browAng: 0.5 }, 740) + friendF(t, { look: [-12, 2], smile: 12, happy: laugh ? 1 : 0, mouthOpen: laugh ? 0.5 : 0 }, 1180), 0.9, 0.6, 1220, 1.0);
    o += `<g transform="translate(540 1270) scale(0.95)">${cake(t)}</g>`;
    if (t < S(2) - 0.1) o += bubble(330, 680, pop(t, S(1) + 4.3) * 1.15, ["hoje não, valeu.", "tô num desafio."], INK, "right");
    else o += bubble(760, 690, pop(t, S(2) + 1.6) * 1.3, ["que desafio?"], INK, "left");
    o += banner(t, 0.1, "DIA 3", CANDY);
  } else if (t < S(4) - 0.3) {
    o += room(t, josephF(t, { look: [0, 2], smile: 12 }, 560) + friendF(t, { look: [0, 2], smile: 10 }, 960) + josephF(t, { look: [0, 2], smile: 10 }, 1360).replace(/#a86f4a/g, PAL.skin).replace(/#8e5a3a/g, PAL.skinD).replace(/#4f5d40/g, PAL.hood).replace(/#3c4731/g, PAL.hoodD), 0.9, 0.5, 1240, 0.85);
    o += pill(t, S(3) + 0.6, "3 NO DESAFIO", GOLD, 720, 70);
  } else if (t < S(5) - 0.1) {
    const taste = t > S(4) + 2.6;
    o += room(t, josephFront(t, { hR: taste ? [1010, 520] : [1080, 620], hL: [860, 650], face: { look: [0, 4], happy: taste ? 1 : 0, smile: taste ? 14 : 4, browUp: taste ? 8 : 0 } }) + (taste ? `<g transform="translate(1010 500)">${apple(44)}</g>` : ""), 0.95, 0.5);
    if (!taste) o += `<g transform="translate(540 800) scale(${pop(t, S(4) + 0.6) * 1.8})">${apple()}</g>`;
    for (let i = 0; i < 5; i++) { const a = i * 72 * D2R + t; o += `<text class="hand" x="${540 + Math.cos(a) * 200}" y="${800 + Math.sin(a) * 130}" font-size="60" text-anchor="middle" fill="${GOLD}" opacity="${seg(t, S(4) + 2.4, S(4) + 2.8)}">✦</text>`; }
    o += pill(t, S(4) + 3.6, "A LÍNGUA ACORDOU", HUM, 1340, 56);
    o += banner(t, S(4) - 0.3, "DIA 7", CANDY);
  } else if (t < S(6) - 0.3) {
    o += room(t, clockAt(1560, 250, 15 * 60) + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 10], smile: 8, browAng: 0.5 } }), 0.9, 0.4);
    o += pill(t, S(5) - 0.1, "15:00", ENE, 680, 80, 300);
    o += pill(t, S(5) + 1.8, "SONO DAS 15H: SUMIU ✓", HUM, 1340, 54);
  } else if (t < S(7) - 0.2) {
    o += room(t, josephFront(t, { hR: [1080, 600], hL: [860, 650], face: { look: [14, 4], smile: 6 } }), 0.9, 0.4);
    o += `<g transform="translate(760 840) rotate(6) scale(${pop(t, S(6) + 1.2) * 1.15})">${juice()}</g>`;
    o += banner(t, S(6) - 0.3, "DIA 10", CANDY);
  } else if (t < S(8) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += `<g transform="translate(540 950) scale(${pop(t, S(7) - 0.1)})"><rect x="-400" y="-300" width="800" height="600" rx="16" fill="#f6f1e6" stroke="#000" stroke-width="8"/><text class="hand" x="0" y="-210" font-size="58" text-anchor="middle" fill="#1c1c22">INGREDIENTES:</text>`;
    ["suco de laranja", "AÇÚCAR", "aroma natural"].forEach((s, i) => { o += `<text class="hand" x="-330" y="${-100 + i * 110}" font-size="68" fill="${i === 1 ? REDC : "#3a3a44"}">${i + 1}. ${s}</text>`; });
    const c = seg(t, S(7) + 1.0, S(7) + 1.7);
    if (c > 0) o += `<ellipse cx="-150" cy="-12" rx="230" ry="70" fill="none" stroke="${REDC}" stroke-width="10" stroke-dasharray="1500" stroke-dashoffset="${1500 * (1 - c)}" transform="rotate(-4 -150 -12)"/>`;
    o += `</g>` + pill(t, S(7) + 3.0, "O AÇÚCAR SE ESCONDE", REDC, 1340, 56);
  } else if (t < S(9) - 0.3) {
    o += room(t, josephFront(t, { hR: [1080, 600], hL: [860, 650], face: { look: [-10, 4], smile: 10, browAng: 0.3 } }), 0.95, 0.5);
    o += `<g transform="translate(320 860) scale(${pop(t, S(8) + 0.2) * 1.2})">${water()}</g>`;
    o += pill(t, S(8) + 2.0, "+1 X ✓", GOLD, 1340, 64);
  } else if (t < S(10) - 0.2) {
    const dark = seg(t, S(9) + 3.4, S(9) + 4.2);
    if (dark < 1) o += `<g opacity="${1 - dark}">` + room(t, josephF(t, { look: [10, 2], smile: 12 }, 760) + momF(t, { look: [-10, 2], smile: 12 }, 1170), 0.95, 0.6, 1220, 1.0) + pill(t, S(9) + 1.0, "A MÃE ENTROU! ✓", "#d1588a", 720, 60) + `</g>`;
    if (dark > 0) {
      o += `<rect width="${SW}" height="${SH}" fill="#05060a" opacity="${dark}"/>`;
      const g = 0.6 + 0.4 * Math.sin(t * 5);
      o += `<g opacity="${dark}"><rect x="320" y="980" width="440" height="300" rx="18" fill="#1a1c22" stroke="#3a3f4a" stroke-width="8"/><rect x="360" y="1030" width="360" height="190" rx="10" fill="#ff9f1c" opacity="${0.55 * g}"/><ellipse cx="540" cy="1130" rx="360" ry="200" fill="#ff9f1c" opacity="${0.18 * g}" style="mix-blend-mode:screen"/>`;
      o += `<g transform="translate(860 900)" style="filter: brightness(0.15)"><g transform="translate(-960 -500) scale(1)">${momF(t, { look: [-14, 6] }, 960)}</g></g></g>`;
      o += txt("DIA 15", 540, 720, 120, "#d1588a", 1, pop(t, S(9) + 4.0));
    }
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    const g = 0.6 + 0.4 * Math.sin(t * 5);
    o += `<rect x="320" y="980" width="440" height="300" rx="18" fill="#1a1c22" stroke="#3a3f4a" stroke-width="8"/><rect x="360" y="1030" width="360" height="190" rx="10" fill="#ff9f1c" opacity="${0.55 * g}"/>`;
    o += txt("?", 540, 820, 200, CREAM, seg(t, S(10), S(10) + 0.4));
    o += pill(t, S(10) + 0.4, "EP 3 AMANHÃ", GOLD, 640, 60);
    o += pill(t, S(10) + 2.4, "COMENTA O SEU DIA 👇", CANDY, 1360, 54);
  }
  o += hud(t);
  o += vignette();
  o += topTag("DESAFIO 30 DIAS · T2 EP 2", CANDY);
  o += capShort(t);
  o += endCard(t, E(10) + 0.2, "Segue: o EP 3 sai amanhã");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
