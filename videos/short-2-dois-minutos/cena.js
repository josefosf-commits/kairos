// SHORT 2 — A REGRA DOS 2 MINUTOS
const REDC = "#e5484d";

function mountain(k, label, op = 1) {
  if (k <= 0.01 || op <= 0) return "";
  let o = `<g opacity="${op}" transform="translate(540 1330) scale(${k}) translate(-540 -1330)">`;
  o += `<path d="M -60 1330 L 330 560 L 470 720 L 700 330 L 1140 1330 Z" fill="#2b2f3a" stroke="#000" stroke-width="10" stroke-linejoin="round"/>`;
  o += `<path d="M 700 330 L 610 485 L 660 470 L 700 520 L 745 465 L 790 488 Z" fill="#e8e2d6" stroke="#000" stroke-width="6" stroke-linejoin="round"/>`;
  o += `<path d="M 330 560 L 280 660 L 330 640 L 380 625 Z" fill="#e8e2d6" stroke="#000" stroke-width="5" stroke-linejoin="round"/>`;
  if (label) o += txt(label, 560, 900, 74, CREAM);
  return o + `</g>`;
}
function strike(s, x, y, size, k) {
  const w = s.length * size * 0.5;
  return txt(s, x, y, size, "#8f99a3") + (k > 0 ? `<line x1="${x - w / 2 - 20}" y1="${y}" x2="${x - w / 2 - 20 + (w + 40) * k}" y2="${y}" stroke="${REDC}" stroke-width="14" stroke-linecap="round"/>` : "");
}
function sneaker(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M -120 -40 L -40 -40 Q -20 -90 30 -90 L 50 -40 Q 120 -30 140 10 Q 150 40 120 40 L -130 40 Q -140 0 -120 -40 Z" fill="#eee" stroke="#000" stroke-width="8" stroke-linejoin="round"/><rect x="-132" y="22" width="270" height="18" fill="${REDC}" stroke="#000" stroke-width="5"/><path d="M -10 -60 L 40 -50 M -20 -45 L 45 -35" stroke="#000" stroke-width="6" stroke-linecap="round"/></g>`;
}
const deskScene = (t, q, sy = 1150, s = 1.3, day = 0.8) => cam(960, 560, s, roomBg(day, 0.2) + clockAt(1560, 250, 900 + t * 4) + josephFront(t, q), sy);

function render(t) {
  const end = window.TL.duration;
  let o = plainBg();
  if (t < S(2) - 0.1) {
    o += deskScene(t, { desk: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { lid: 0.35, look: [0, 9], smile: 0 } }, 1150, 1.3, 0.6);
    const st = pop(t, 0.5);
    o += `<g transform="translate(540 560) rotate(-8) scale(${st})" opacity="${cl(st)}"><rect x="-380" y="-90" width="760" height="180" rx="20" fill="none" stroke="${REDC}" stroke-width="14"/>${txt("PREGUIÇOSO?", 0, 0, 110, REDC)}</g>`;
    if (t > 2.0) o += `<g transform="translate(540 560)">${[[-1, 1], [1, 1]].map(([a]) => `<line x1="${-300 * a * seg(t, 2.0, 2.3)}" y1="${-150 * seg(t, 2.0, 2.3)}" x2="${300 * a * seg(t, 2.0, 2.3)}" y2="${150 * seg(t, 2.0, 2.3)}" stroke="#fff" stroke-width="22" stroke-linecap="round"/>`).join("")}</g>`;
    o += txt("NÃO.", 540, 800, 120, CREAM, seg(t, 2.4, 2.6), pop(t, 2.4));
  } else if (t < S(4) - 0.1) {
    // the mountain
    const k = lerp(0.25, 1, seg(t, S(2), S(2) + 2.0));
    o += `<rect width="${SW}" height="${SH}" fill="#11141b"/>` + mountain(k, "ESTUDAR 2 HORAS");
    const fleeing = t > S(3) + 1.4;
    const q = fleeing ? { ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { look: [0, 9], lid: 0.2, smile: 2 } } : { hR: [1060, 680], hL: [860, 680], face: { look: [0, -12], browSad: 1, browUp: 6, smile: -6, mouthW: 12, lid: blink(t, 0) } };
    o += `<rect x="0" y="1330" width="${SW}" height="600" fill="#0b0d12"/>` + cam(960, 520, 0.75, josephFront(t, q), 1250);
    if (fleeing) o += txt("FUGA!", 820, 1090, 80, ACC, 1, pop(t, S(3) + 1.4));
  } else if (t < S(5) - 0.1) {
    o += txt("REGRA DOS", 540, 520, 110, CREAM, 1, pop(t, S(4) + 1.0));
    o += txt("2 MINUTOS", 540, 680, 150, GREEN, 1, pop(t, S(4) + 1.6));
    o += `<g transform="translate(540 1020) scale(${pop(t, S(4) + 1.9)})">${timerFace(0, 0, 170, 1, "2:00", GREEN)}</g>`;
  } else if (t < S(7) - 0.1) {
    const shoe = t > S(6) - 0.1, a = shoe ? S(6) : S(5);
    o += strike(shoe ? "TREINAR" : "ESTUDAR 2 HORAS", 540, 420, shoe ? 100 : 84, seg(t, a + 0.4, a + 1.0));
    o += txt(shoe ? "CALÇAR O TÊNIS" : "ABRIR O CADERNO", 540, 570, 96, GREEN, 1, pop(t, a + 1.6));
    if (shoe) o += sneaker(540, 960, 2.2 * pop(t, S(6) + 1.6)) + `<g transform="translate(820 820) scale(${pop(t, S(6) + 2.2)})">${ICON.check(GREEN)}</g>`;
    else {
      o += deskScene(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { smile: 6, look: [0, 8], lid: blink(t, 0.05) } }, 1250, 1.1, 0.9);
      o += mountain(lerp(1, 0.12, seg(t, S(5), S(5) + 1.2)) * (1 - seg(t, S(5) + 1.2, S(5) + 1.5)), "");
    }
  } else if (t < S(8) - 0.1) {
    const k = seg(t, S(7) + 0.3, E(7));
    o += txt("QUALQUER UM", 540, 470, 100, CREAM, 1, pop(t, S(7) + 1.2));
    o += txt("CONSEGUE", 540, 600, 100, GREEN, 1, pop(t, S(7) + 1.5));
    o += timerFace(540, 1000, 220, 1 - k, mmss(120 * (1 - k)), GREEN);
  } else if (t < S(9) - 0.1) {
    o += txt("O SEGREDO", 540, 440, 100, GOLD, 1, pop(t, S(8) + 0.3));
    const bars = [["COMEÇAR", 1.0, REDC, S(8) + 1.4], ["5 MIN", 0.45, GOLD, S(8) + 2.6], ["20 MIN", 0.22, GREEN, S(8) + 2.9], ["1 HORA", 0.15, GREEN, S(8) + 3.2]];
    bars.forEach(([lab, h, c, a], i) => {
      const k = seg(t, a, a + 0.4), x = 200 + i * 230, hh = 560 * h * k;
      o += `<rect x="${x - 80}" y="${1240 - hh}" width="160" height="${hh}" rx="14" fill="${c}" stroke="#000" stroke-width="6"/>` + txt(lab, x, 1300, 44, CREAM, k);
    });
    o += txt("dificuldade", 540, 600, 54, "#cfd8e3", seg(t, S(8) + 1.4, S(8) + 1.7));
  } else if (t < S(10) - 0.1) {
    o += deskScene(t, { desk: true, book: [960, 600], hR: [1040 + Math.sin(t * 7) * 6, 610], hL: [880, 610], face: { smile: 8, look: [0, 9], lid: blink(t, 0.05), browAng: 0.3 } }, 1150, 1.3, 1);
    const mins = lerp(2, 47.2, Math.pow(seg(t, S(9) + 0.3, E(9) + 0.4), 1.5));
    o += timerFace(540, 600, 150, (mins % 60) / 60, mmss(mins * 60), GREEN);
    o += txt("+45 MIN", 820, 430, 70, GOLD, 1, pop(t, E(9) - 0.4));
  } else {
    const k2 = t > S(10) + 2.9;
    if (!k2) {
      o += deskScene(t, { desk: true, face: { lid: 0.6, zzz: true, smile: 0 } }, 1150, 1.3, 0.5);
      o += `<rect width="${SW}" height="${SH}" fill="#0b1a2b" opacity="0.55"/>`;
      o += txt("JOSEPH DE AMANHÃ", 540, 470, 86, ACC, 1, pop(t, S(10)));
      o += `<g transform="translate(540 640) scale(${pop(t, S(10) + 1.4)})">${ICON.cross(REDC)}</g>`;
    } else {
      o += `<rect width="${SW}" height="${SH}" fill="#07080b"/>`;
      o += txt("2 MINUTOS.", 540, 560, 140, CREAM, 1, pop(t, S(10) + 2.9));
      o += txt("AGORA.", 540, 740, 180, REDC, 1, pop(t, S(10) + 3.9));
      o += timerFace(540, 1060, 170, seg(t, S(10) + 4.2, end) * 0.05, mmss(Math.max(0, t - S(10) - 4.2)), GREEN);
    }
  }
  o += vignette();
  o += topTag("REGRA DOS 2 MINUTOS", GREEN);
  o += capShort(t);
  o += endCard(t, E(10) + 0.9, "Segue pra vencer a procrastinação");
  o += blackout(Math.max(1 - seg(t, 0, 0.3), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
