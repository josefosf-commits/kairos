// SHORT 21 — DESAFIO 30 DIAS · TEMPORADA 2 (SEM AÇÚCAR) · EP 1 (dias 1 a 3) — termina em cliffhanger
const REDC = "#e5484d", CANDY = "#ff6fae", ENE = "#4fd1ff", HUM = "#30a46c", CHOC = "#5a3420";
function stats(t) {
  const von = kf(t, [[0, 0.35], [S(2), 0.5], [S(4), 0.55], [S(4) + 1.5, 0.95], [S(5) + 2.5, 0.7], [S(6), 0.75], [S(6) + 3.6, 0.95], [S(7), 0.8], [S(7) + 2, 0.98]]);
  const ene = kf(t, [[0, 0.6], [S(4), 0.45], [S(6), 0.25], [S(7), 0.3]]);
  const hum = kf(t, [[0, 0.6], [S(5) + 3, 0.55], [S(6), 0.2], [S(7), 0.3]]);
  return { von, ene, hum };
}
function dayOf(t) { return t < S(6) - 0.3 ? 1 : t < S(7) - 0.3 ? 2 : 3; }
function hud(t) {
  const d = dayOf(t), st = stats(t), flash = [S(6) - 0.3, S(7) - 0.3].some(a => inR(t, a, a + 0.5));
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

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(2) - 0.1) {
    o += room(t, clockAt(1560, 250, 22 * 60 + 30) + josephFront(t, { desk: true, hR: [1040 + Math.sin(t * 8) * 6, 610], hL: [880, 610], face: { look: [0, 9], smile: 4, browAng: 0.6 } }), 0.2, 0.3);
    o += `<g transform="translate(540 760) rotate(-3) scale(${pop(t, 0.1)})"><rect x="-400" y="-110" width="800" height="220" rx="14" fill="#f6f1e6" stroke="#000" stroke-width="7"/>${txt("30 DIAS SEM AÇÚCAR", 0, -38, 66, "#1c1c22", 1, 1)}<text class="hand" x="0" y="50" font-size="48" text-anchor="middle" fill="#8a6d3b">começa hoje</text></g>`;
    o += pill(t, S(1) + 2.0, "TEMPORADA 2", GOLD, 1340, 60);
  } else if (t < S(3) - 0.1) {
    o += room(t, josephFront(t, { face: { look: [0, -14], browUp: 8, smile: 0 } }), 0.95, 0.5);
    const op = seg(t, S(2) + 1.0, S(2) + 1.6);
    o += `<g transform="translate(540 790)"><rect x="-420" y="-200" width="840" height="400" rx="12" fill="#8a5a3a" stroke="#000" stroke-width="8"/><rect x="-395" y="-178" width="790" height="356" fill="#3a2516"/><line x1="-395" y1="20" x2="395" y2="20" stroke="#8a5a3a" stroke-width="12"/>`;
    o += `<rect x="-420" y="-200" width="${420 * (1 - op) + 18}" height="400" fill="#a8744d" stroke="#000" stroke-width="8"/><rect x="${420 - 420 * (1 - op) - 18}" y="-200" width="${420 * (1 - op) + 18}" height="400" fill="#a8744d" stroke="#000" stroke-width="8"/>`;
    [[cookie, -250, -75, S(2) + 2.2], [cocoa, 0, -95, S(2) + 3.2], [() => cereal(0.75), 250, -90, S(2) + 4.2]].forEach(([fn, x, y, a]) => { const p = pop(t, a); if (p > 0) o += `<g transform="translate(${x} ${y}) scale(${p})">${fn()}</g>`; });
    o += `</g>`;
    o += pill(t, S(2) + 5.2, "TUDO DOCE", CANDY, 1060, 70);
  } else if (t < S(4) - 0.1) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += `<g transform="translate(540 960) scale(${pop(t, S(3) - 0.1)})"><rect x="-400" y="-330" width="800" height="660" rx="16" fill="#f6f1e6" stroke="#000" stroke-width="8"/><text class="hand" x="0" y="-240" font-size="58" text-anchor="middle" fill="#1c1c22">INGREDIENTES:</text>`;
    ["farinha de milho", "AÇÚCAR", "xarope de glicose", "sal, aroma..."].forEach((s, i) => { o += `<text class="hand" x="-330" y="${-130 + i * 100}" font-size="62" fill="${i === 1 ? REDC : "#3a3a44"}">${i + 1}. ${s}</text>`; });
    const c = seg(t, S(3) + 2.2, S(3) + 2.9);
    if (c > 0) o += `<ellipse cx="-160" cy="-50" rx="230" ry="70" fill="none" stroke="${REDC}" stroke-width="10" stroke-dasharray="1500" stroke-dashoffset="${1500 * (1 - c)}" transform="rotate(-4 -160 -50)"/>`;
    o += `</g>` + pill(t, S(3) + 2.9, "2º INGREDIENTE", REDC, 1350, 60);
  } else if (t < S(5) - 0.1) {
    o += room(t, clockAt(1560, 250, 15 * 60) + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [14, -6], smile: -2, browUp: 6 } }), 0.85, 0.4);
    const g = 0.7 + 0.3 * Math.sin(t * 6);
    o += `<g transform="translate(820 820) rotate(-10) scale(${pop(t, S(4) + 1.4) * 1.1})"><ellipse rx="170" ry="110" fill="${CANDY}" opacity="${0.3 * g}" style="mix-blend-mode:screen"/>${choco()}</g>`;
    o += pill(t, S(4) - 0.1, "15:00", CANDY, 680, 80, 300);
  } else if (t < S(6) - 0.3) {
    const sw = seg(t, S(5) + 0.4, S(5) + 1.4), eat = t > S(5) + 2.4;
    o += room(t, josephFront(t, { hR: eat ? [1010, 520] : [1080, 620], hL: [860, 650], face: { look: [eat ? 0 : 12, 4], smile: t > S(5) + 3.8 ? 6 : -2, browSad: t < S(5) + 3.8 ? 0.4 : 0 } }) + (eat ? `<g transform="translate(1010 500)">${apple(44)}</g>` : ""), 0.9, 0.4);
    if (!eat) {
      o += `<g transform="translate(330 800) scale(${1 - sw * 0.3})" opacity="${1 - sw * 0.5}">${choco()}<path d="M -110 -70 L 110 70 M 110 -70 L -110 70" stroke="${REDC}" stroke-width="16" stroke-linecap="round" opacity="${sw}"/></g>`;
      o += `<g transform="translate(760 800) scale(${pop(t, S(5) + 0.8) * 1.3})">${apple()}</g>`;
      if (sw > 0) o += txt("→", 545, 800, 110, GOLD, sw);
    }
    o += pill(t, S(5) + 3.8, "NÃO É IGUAL. MAS PASSA.", HUM, 1340, 54);
  } else if (t < S(7) - 0.3) {
    const fr = seg(t, S(6) + 3.2, S(6) + 3.9);
    o += room(t, josephFront(t, { hR: [1050, 470], hL: [860, 650], face: { look: [fr > 0 ? 14 : 0, 4], smile: -7, browAng: 0.9, lid: 0.35 } }), 0.75, 0.15);
    for (let i = 0; i < 3; i++) o += `<path d="M ${380 + i * 30} ${800 - i * 25} l 20 -14 l 10 18 l 20 -14" stroke="${REDC}" stroke-width="8" fill="none" stroke-linecap="round" opacity="${0.5 + 0.5 * Math.sin(t * 8 + i)}"/>`;
    o += pill(t, S(6) + 1.0, "DOR DE CABEÇA", REDC, 680, 50, 310) + pill(t, S(6) + 2.0, "MAU HUMOR", "#8f99a3", 680, 50, 780);
    if (fr > 0) {
      const g = 0.6 + 0.4 * Math.sin(t * 7);
      o += `<g transform="translate(${lerp(1300, 850, fr)} 1060)"><rect x="-170" y="-330" width="340" height="560" rx="20" fill="#dfe6ee" stroke="#000" stroke-width="8"/><rect x="-150" y="-310" width="300" height="520" fill="#f2f6fa"/><line x1="-150" y1="-60" x2="150" y2="-60" stroke="#b8c2cc" stroke-width="6"/><ellipse cx="0" cy="-160" rx="120" ry="140" fill="${REDC}" opacity="${0.35 * g}" style="mix-blend-mode:multiply"/><g transform="translate(0 -160) rotate(${Math.sin(t * 12) * 4})">${soda()}</g></g>`;
    }
  } else {
    const sc9 = t > S(9) - 0.1, sc10 = t > S(10) - 0.1;
    if (!sc9) {
      let w = josephF(t, { look: [8, 10], smile: -2, browUp: 4 }, 740) + friendF(t, { look: [-12, 2], smile: 10, happy: t > S(8) - 0.1 ? 1 : 0 }, 1180);
      o += room(t, w, 0.9, 0.6, 1220, 1.0);
      o += `<g transform="translate(540 1270) scale(${pop(t, S(7) + 1.0) * 0.95})">${cake(t)}</g>`;
      [[200, 1330], [270, 1350], [810, 1330], [880, 1350], [845, 1300]].forEach(([x, y], i) => { if (t > S(7) + 3.0 + i * 0.12) o += briga(x, y); });
      if (t < S(8) - 0.1) o += pill(t, S(7) + 0.2, "PARABÉNS! 🎉", GOLD, 680, 54);
      if (t > S(8) - 0.1) o += bubble(700, 690, pop(t, S(8) - 0.1) * 1.2, ["é só um pedaço...", "ninguém vai saber"], INK, "right");
      o += banner(t, S(7) - 0.3, "DIA 3", CANDY);
    } else if (!sc10) {
      const z = seg(t, S(9), S(10) - 0.3);
      o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
      o += cam(960, 470, 1.6 + z * 0.4, roomBg(0.6, 0.4) + josephF(t, { look: [0, 18], smile: -1, browAng: 0.5, lid: 0.25 }, 960), 1050);
      o += `<g transform="translate(540 1330)">${plate(1.3 + z * 0.2)}</g>`;
    } else {
      const k = seg(t, S(10) - 0.1, S(10) + 0.6);
      o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
      o += `<g opacity="${k}" transform="translate(540 1000)"><ellipse rx="300" ry="80" fill="${GOLD}" opacity="0.15"/>${plate(1.2)}</g>`;
      o += txt("?", 540, 820, 200, CREAM, seg(t, S(10) + 0.6, S(10) + 1.0));
      o += pill(t, S(10) + 1.0, "EP 2 AMANHÃ", GOLD, 1180, 60);
      o += pill(t, S(10) + 2.6, "TOPA? SEU DIA 1 É HOJE", CANDY, 1340, 54);
    }
  }
  o += hud(t);
  o += vignette();
  o += topTag("DESAFIO 30 DIAS · T2 EP 1", CANDY);
  o += capShort(t);
  o += endCard(t, E(10) + 0.2, "Segue: o EP 2 sai amanhã");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
