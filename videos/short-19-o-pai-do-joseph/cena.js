// SHORT 19 — O PAI DO JOSEPH (trailer do vídeo longo RECOMEÇA.), reaproveita as funções de ../recomeca/cena.js
// landscape scene (1920x1080 screen space) placed into the vertical frame: (cx, cy) lands at (540, y)
const V = (inner, cx, s, y = 1000, cy = 540) => `<g transform="translate(540 ${y}) scale(${s}) translate(${-cx} ${-cy})">${inner}</g>`;
function vpill(t, a, s, col, y, size = 60, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#07080b" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }

function renderPai(t) {
  const end = window.TL.duration;
  let o = plainBg("#121726", "#07080b");
  if (t < S(2) - 0.2) {
    o += V(room(roomBg(0.15, 0.3) + couch() + dadFront(t, { look: [0, 6], lid: 0.35, smile: -2, bags: 0.6 }, 960, 1), 0, 140, 1.15), 960, 1.0, 1000);
    ["2016", "2018", "2020", "2022", "2024", "2026"].forEach((y, i) => { const a = S(1) + 3.2 + i * 0.25; if (t > a) o += `<g transform="translate(${300 + (i % 2) * 480} ${560 + Math.floor(i / 2) * 110}) rotate(${-5 + (i % 3) * 5}) scale(${pop(t, a)})"><rect x="-210" y="-40" width="420" height="80" rx="12" fill="#fff7c2" stroke="#000" stroke-width="5"/><text class="hand" x="0" y="14" font-size="38" text-anchor="middle" fill="${INK}">${y}: "na segunda..."</text></g>`; });
  } else if (t < S(4) - 0.2) {
    const res = t > S(3) - 0.2;
    o += V(office(t, { paper: true, doc: { look: [0, 12], smile: -2 }, dad: { look: [10, 2], browUp: 6, smile: -2 } }), 960, 0.8, 1150);
    if (!res && t > S(2) + 1.6) o += txt("...", 760, 640, 120, CREAM, seg(t, S(2) + 1.6, S(2) + 2.0));
    if (res) o += examCard(t, S(3) - 0.2, [["PRESSÃO", "alta ⚠", REDC, S(3)], ["GLICOSE", "no limite ⚠", REDC, S(3) + 1.4]], "EXAMES", 540, 600);
  } else if (t < S(5) - 0.2) {
    o += V(room(roomBg(0.1, 0.4) + couch() + dadFront(t, { look: [12, 2], browSad: t < S(4) + 3.5 ? 0.8 : 0, smile: t > S(4) + 5 ? 6 : -2 }, 700, 1) + jFront(t, { look: [-12, 2], smile: 8, browAng: 0.3 }, 1220), 0, 140, 1.1), 960, 0.95, 1100);
    if (t > S(4) + 2.6) o += bubble(560, 600, pop(t, S(4) + 2.6) * 0.95, ["pai, a gente", "começa junto."], INK, "right");
    o += vpill(t, S(4) + 5.0, "MAS COMEÇA PEQUENO", GOLD, 1720, 58);
  } else if (t < S(6) - 0.2) {
    const k = cl((t - S(5)) / (S(6) - S(5)));
    o += V(street(t, { night: 0.7, v: 130, people: [{ x: 760, c: DAD, pant: 0.4, smile: 2 }, { x: 1080, c: JOSEPH, off: 1.3, smile: 8 }] }), 920, 1.15, 1150);
    o += timerFace(540, 560, 150, 1 - k, "10:00", ACC);
  } else if (t < S(7) - 0.2) {
    const smile = t > S(6) + 3.4;
    o += V(office(t, { belly: 0.45, paper: true, doc: { look: [0, 12], smile: smile ? 14 : -1, happy: smile ? 1 : 0 }, dad: { look: [10, 2], browUp: 6, smile: smile ? 12 : -2 } }), 960, 0.8, 1150);
    o += vpill(t, S(6) - 0.1, "6 MESES DEPOIS", GOLD, 345, 56);
    if (smile) o += examCard(t, S(6) + 3.6, [["PRESSÃO", "controlada ✓", GREEN, S(6) + 3.8], ["GLICOSE", "normal ✓", GREEN, S(6) + 4.4]], "RESULTADO", 540, 700);
  } else if (t < S(8) - 0.2) {
    const p = pop(t, S(7));
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += `<g transform="translate(540 820) scale(${p})"><rect x="-470" y="-300" width="940" height="600" rx="30" fill="#12151c" stroke="#3a4150" stroke-width="6"/><image href="../recomeca/build/thumbnail-2.png" x="-440" y="-270" width="880" height="495"/><circle cx="0" cy="-22" r="70" fill="#e5484d" opacity="0.92"/><path d="M -22 -60 L 38 -22 L -22 16 Z" fill="#fff"/></g>`;
    o += txt("RECOMEÇA.", 540, 1250, 130, GREEN, 1, pop(t, S(7) + 0.8));
    o += vpill(t, S(7) + 1.8, "VÍDEO COMPLETO NO CANAL", GOLD, 1680, 52);
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#07080b"/>`;
    o += txt("+35?", 540, 700, 200, NAVY, 1, pop(t, S(8)));
    o += txt("ainda dá tempo.", 540, 900, 90, GOLD, 1, pop(t, S(8) + 2.0));
  }
  o += vignette();
  o += topTag("O PAI DO JOSEPH", NAVY);
  o += capShort(t);
  o += endCard(t, E(8) + 0.2, "Assista RECOMEÇA. no canal");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = renderPai;
