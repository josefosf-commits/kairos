// SHORT 18 — OS LADRÕES DO JOSEPH · TEMPORADA 2 · EP 1: O LADRÃO DO DEPOIS
const REDC = "#e5484d", LATE = "#ff9f1c";
const desk = (t, f = {}, extra = "") => cam(960, 560, 1.3, roomBg(0.4, 0.2) + josephFront(t, Object.assign({ desk: true, hR: [1040, 630], hL: [880, 630] }, f)) + extra, 1150);
function pill(t, a, s, col, y, size = 60, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#07080b" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }
function note(x, y, word, col, rot = -4, sc = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><rect x="-170" y="-90" width="340" height="180" rx="10" fill="#fff7a8" stroke="#000" stroke-width="7"/><text class="hand" x="0" y="26" font-size="76" text-anchor="middle" fill="${col}">${word}</text></g>`;
}
function taskCard(t, a, x, y, label, stamp, sa) {
  const p = pop(t, a); if (p <= 0) return "";
  let o = `<g transform="translate(${x} ${y}) scale(${p})"><rect x="-430" y="-70" width="860" height="140" rx="24" fill="#12151c" stroke="#3a4150" stroke-width="5"/><text class="hand" x="-395" y="16" font-size="46" fill="${CREAM}">${label}</text>`;
  const s = pop(t, sa, 0.25);
  if (s > 0) o += `<g transform="translate(320 0) rotate(-8) scale(${0.8 * s})"><rect x="-150" y="-50" width="300" height="100" rx="10" fill="none" stroke="${LATE}" stroke-width="9"/><text class="hand" x="0" y="20" font-size="60" text-anchor="middle" fill="${LATE}">${stamp}</text></g>`;
  return o + `</g>`;
}
function box(x, y, w, h, rot = 0) { return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="#c89b5a" stroke="#000" stroke-width="6"/><text class="hand" x="0" y="14" font-size="40" text-anchor="middle" fill="#5a3d1a">DEPOIS</text></g>`; }
const PILE = [[540, 1360, 380, 110, 0], [520, 1250, 340, 110, -3], [560, 1140, 360, 110, 4], [530, 1030, 300, 110, -2], [550, 920, 320, 110, 5], [540, 810, 280, 110, -6]];

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#14100b", "#07080b");
  if (t < S(2) - 0.2) {
    const tx = lerp(1250, 830, seg(t, S(1) + 1.0, S(1) + 3.2));
    o += desk(t, { face: { look: [0, 9], smile: 2, lid: blink(t, 0.06) } });
    o += thief(tx, 880, 0.9, -1, seg(t, S(1) + 1.0, S(1) + 1.6), t, { mask: LATE, grin: 1, look: -4 });
    o += pill(t, 0.2, "TEMPORADA 2", LATE, 640, 70);
  } else if (t < S(3) - 0.2) {
    const sw = seg(t, S(2) + 1.6, S(2) + 2.4);
    o += desk(t, { face: { look: [0, 9], smile: 2 } });
    o += sw < 0.5 ? note(540, 700, "AGORA", GREEN, -4, 1 - sw * 2 * 0.2) : note(540, 700, "DEPOIS", LATE, 4, 0.8 + (sw - 0.5) * 0.4);
    o += thief(860, 900, 0.85, -1, 1, t, { mask: LATE, grin: 1, reach: dip(t, S(2) + 1.2, S(2) + 1.7, S(2) + 2.3, S(2) + 2.8) });
  } else if (t < S(4) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += taskCard(t, S(3), 540, 720, "ESTUDAR PRA PROVA", "DEPOIS", S(3) + 1.3);
    o += taskCard(t, S(3) + 2.0, 540, 900, "RESPONDER O PROFESSOR", "DEPOIS", S(3) + 3.4);
    o += taskCard(t, S(3) + 4.2, 540, 1080, "TREINAR", "AMANHÃ", S(3) + 5.6);
    o += thief(880, 1290, 0.75, -1, 1, t, { mask: LATE, grin: 1 });
  } else if (t < S(5) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    const n = Math.min(PILE.length, Math.floor(seg(t, S(4) - 0.1, E(4)) * PILE.length + 0.999));
    for (let i = 0; i < n; i++) { const [x, y, w, h, r] = PILE[i]; o += box(x, y - (1 - pop(t, S(4) - 0.1 + i * 0.5)) * 60, w, h, r); }
    o += thief(170, 1240, 0.75, 1, 1, t, { mask: LATE, grin: 1, shrug: 0.3 });
    o += pill(t, S(4) + 2.0, "VIROU UMA PILHA", LATE, 640, 64);
  } else if (t < S(6) - 0.2) {
    const fall = seg(t, S(5) + 2.0, S(5) + 3.0);
    o += desk(t, { face: { look: [0, -10], browUp: 10, mouthOpen: 0.5 * fall, smile: -6 } });
    PILE.forEach(([x, y, w, h, r], i) => { o += box(x + (i - 2.5) * 30 * fall, lerp(y - 700, 1150 + (i % 3) * 60, fall), w * 0.8, h * 0.8, r * 4 * fall); });
    o += pill(t, S(5) - 0.1, "SEXTA · DIA DA PROVA", REDC, 640, 60);
  } else if (t < S(7) - 0.2) {
    o += desk(t, { face: { look: [10, 2], browAng: 0.9, smile: 0 } });
    o += thief(860, 900, 0.85, -1, 1, t, { mask: LATE, look: -6 });
    o += txt("A FRAQUEZA DELE:", 540, 640, 70, CREAM, 1, pop(t, S(6) + 2.6)) + txt("ELE ODEIA COMEÇOS", 540, 1640, 70, GREEN, 1, pop(t, S(6) + 3.4));
  } else if (t < S(8) - 0.2) {
    const k = cl((t - S(7)) / (S(8) - S(7)));
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += txt("REGRA DOS", 540, 520, 90, CREAM, 1, pop(t, S(7))) + txt("5 MINUTOS", 540, 650, 130, GREEN, 1, pop(t, S(7) + 0.4));
    o += timerFace(540, 1020, 200, 1 - k, mmss(300 * (1 - k)), GREEN);
    o += pill(t, S(7) + 3.0, "SÓ COMEÇAR", GOLD, 1350, 64);
  } else if (t < S(9) - 0.2) {
    const leave = seg(t, S(8) + 3.6, S(8) + 6.0);
    o += desk(t, { face: { look: [0, 9], smile: 10, browAng: 0.3 } });
    o += pill(t, S(8), "5 MIN → 20 MIN", GOLD, 620, 64) + pill(t, S(8) + 2.0, "TAREFA FEITA ✓", GREEN, 780, 64);
    o += thief(lerp(860, 1300, leave), 900, 0.85, 1, 1 - leave * 0.6, t, { mask: LATE, shrug: 0.8 });
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += `<g opacity="${seg(t, S(9) + 1.0, S(9) + 2.0)}"><ellipse cx="540" cy="960" rx="260" ry="320" fill="#3e63dd" opacity="0.25"/><g style="filter: brightness(0.25)">${thief(540, 960, 1.4, 1, 1, t, { mask: "#3e63dd" })}</g></g>`;
    o += txt("AMANHÃ:", 540, 600, 90, CREAM, 1, pop(t, S(9))) + txt("O LADRÃO DA CORAGEM", 540, 1290, 76, "#5b8cff", 1, pop(t, S(9) + 2.2));
  }
  o += vignette();
  o += topTag("OS LADRÕES · T2 EP 1", LATE);
  o += capShort(t);
  o += endCard(t, E(9) + 0.2, "Segue: o próximo ladrão sai amanhã");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
