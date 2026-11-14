// SHORT 1 — 1% POR DIA
const REDC = "#e5484d";
const fmt = (v, d) => v.toFixed(d).replace(".", ",");

// equation block: base^365 = value (value rolls from 1 to target)
function equation(t, a, roll0, roll1, base, target, dec, col) {
  let o = "";
  o += txt(base, 400, 660, 190, CREAM, seg(t, a, a + 0.2), pop(t, a));
  o += txt("365", 640, 560, 100, col, seg(t, a + 1.2, a + 1.4), pop(t, a + 1.2));
  const k = seg(t, roll0, roll1), v = lerp(1, target, Math.pow(k, target > 1 ? 3 : 0.35));
  o += txt("=", 540, 840, 120, CREAM, seg(t, roll0 - 0.3, roll0));
  o += txt(fmt(v, dec), 540, 1010, 240, col, seg(t, roll0 - 0.3, roll0), 1 + 0.08 * Math.max(0, 1 - Math.abs(t - roll1) * 3));
  // curve
  const x0 = 140, x1 = 940, yb = 1330, yt = 1160;
  const n = Math.round(60 * seg(t, roll0, roll1));
  if (n > 1) {
    let d = "";
    for (let i = 0; i <= n; i++) {
      const day = (i / 60) * 365, val = Math.pow(target > 1 ? 1.01 : 0.99, day);
      const yy = target > 1 ? yb - (val - 1) / 36.8 * (yb - yt) * 1.0 : yt + (1 - val) * (yb - yt);
      d += `${i ? "L" : "M"} ${lerp(x0, x1, i / 60)} ${yy} `;
    }
    o += `<path d="${d}" fill="none" stroke="#000" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return o;
}

function josephAt(t, sy, s, q, dark) {
  return cam(960, 560, s, roomBg(dark ? 0.2 : 0.9, dark ? 0 : 0.4) + clockAt(1560, 250, dark ? 60 + t * 3 : 420 + t * 3) + josephFront(t, q) + (dark ? `<rect x="-600" y="-400" width="3120" height="1900" fill="#000" opacity="0.4"/>` : ""), sy);
}

function render(t) {
  const end = window.TL.duration;
  let o = plainBg();
  if (t < S(2) - 0.1) {
    // hook: Joseph at the desk, a tiny "1%" above him
    const q = { desk: true, laptop: false, face: { look: [0, -8], lid: blink(t, 0.05), smile: t > 2.6 ? -2 : 3, browUp: t > 2.6 ? 8 : 0 }, hR: [1040, 610], hL: [880, 610], book: [960, 600] };
    o += josephAt(t, 1120, 1.3, q);
    const sc = lerp(1.4, 0.45, seg(t, 2.2, 3.2)) * pop(t, 0.3);
    o += txt("1%", 540, 520, 280, GREEN, 1, sc);
    o += txt("parece nada...", 540, 700, 80, CREAM, seg(t, 2.6, 2.9));
  } else if (t < S(5) - 0.1) {
    o += txt("FAZ A CONTA", 540, 420, 90, GOLD, seg(t, S(2), S(2) + 0.2), pop(t, S(2)) * (1 - seg(t, S(3) - 0.2, S(3))));
    if (t < S(4) - 0.1) o += equation(t, S(3) - 0.1, S(3) + 3.0, E(3) - 0.4, "1,01", 37.8, 1, GREEN);
    else {
      const q = { armsUp: 1, face: { happy: 1, smile: 12, look: [0, 4] } };
      o += josephAt(t, 1180, 1.25, q);
      o += txt("37×", 540, 470, 300, GREEN, 1, pop(t, S(4)));
      o += txt("MELHOR EM 1 ANO", 540, 680, 84, CREAM, seg(t, S(4) + 1.0, S(4) + 1.3), pop(t, S(4) + 1.0));
    }
  } else if (t < S(7) - 0.1) {
    o += txt("1% PIOR", 540, 420, 110, REDC, 1, pop(t, S(5)) * (1 - seg(t, S(6) - 0.2, S(6))));
    if (t < S(6) - 0.1) {
      const q = { desk: true, face: { lid: 0.4, bags: 0.7, look: [0, 9], smile: -2 }, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true } };
      o += josephAt(t, 1150, 1.3, q, true);
      o += txt("todo dia", 540, 590, 80, CREAM, seg(t, S(5) + 1.6, S(5) + 1.9));
    } else o += equation(t, S(6) - 0.1, S(6) + 3.2, E(6) - 0.4, "0,99", 0.03, 2, REDC);
  } else if (t < S(8) - 0.1) {
    // what is left of you: Joseph fades and shrinks
    const k = seg(t, S(7), E(7));
    o += `<g opacity="${lerp(1, 0.12, k)}" style="filter:saturate(${1 - k})" transform="translate(540 980) scale(${lerp(1, 0.55, k)}) translate(-540 -980)">${josephAt(t, 1100, 1.3, { face: { lid: 0.5, browSad: 1, smile: -6, bags: 1 } }, true)}</g>`;
    o += txt("0,03", 540, 520, 200, REDC, 1, pop(t, S(7)));
  } else if (t < S(9) - 0.1) {
    o += txt("A DIFERENÇA?", 540, 480, 100, GOLD, 1, pop(t, S(8)));
    const ch = chunksOf(window.TL.lines.find(l => l.id === 8));
    const items = [[ICON.book(GREEN), "2 PÁGINAS DE LIVRO"], [ICON.phone(ACC), "−5 MIN DE CELULAR"], [ICON.moon(GOLD), "DORMIR MAIS CEDO"]];
    const starts = [S(8) + 1.6, S(8) + 3.3, S(8) + 5.2];
    items.forEach(([ic, label], i) => {
      const p = pop(t, starts[i]);
      if (p <= 0) return;
      o += `<g transform="translate(540 ${720 + i * 230}) scale(${p})"><rect x="-430" y="-85" width="860" height="170" rx="40" fill="#12151c" stroke="${GREEN}" stroke-width="6"/><g transform="translate(-330 0) scale(0.95)">${ic}</g>${txt(label, 80, 0, 58)}</g>`;
    });
  } else {
    // split: +1% on top, -1% at the bottom; day 1 then day 365
    const d365 = t > S(9) + 2.9;
    const flash = dip(t, S(9) + 2.6, S(9) + 2.9, S(9) + 2.9, S(9) + 3.3);
    const top = d365 ? { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { smile: 12, lid: blink(t, 0.05), look: [0, 6] } } : { desk: true, face: { lid: blink(t, 0.08) } };
    const bot = d365 ? { desk: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { lid: 0.45, bags: 1, browSad: 0.8, smile: -6, look: [0, 9] } } : { desk: true, face: { lid: blink(t, 0.08, 1.3) } };
    o += band("bTop", 290, 800, josephAt(t, 750, 1.05, top, false));
    o += band("bBot", 1110, 810, josephAt(t, 1570, 1.05, bot, d365));
    o += `<rect x="0" y="1088" width="${SW}" height="24" fill="#07080b"/>`;
    o += txt("+1%", 160, 360, 96, GREEN) + txt("−1%", 160, 1180, 96, REDC);
    if (t < S(10) - 0.1) o += txt(d365 ? "DIA 365" : "DIA 1", 640, 370, 104, GOLD, 1, d365 ? pop(t, S(9) + 2.9) : pop(t, S(9)));
    o += blackout(0) + `<rect width="${SW}" height="${SH}" fill="#fff" opacity="${flash * 0.8}"/>`;
    if (t > S(10) - 0.1) o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="${0.35 * seg(t, S(10), S(10) + 0.4)}"/>` + txt("QUAL DOS DOIS", 540, 1020, 100, CREAM, 1, pop(t, S(10))) + txt("VOCÊ FOI HOJE?", 540, 1160, 100, GOLD, 1, pop(t, S(10) + 0.5));
  }
  o += vignette();
  o += topTag("1% POR DIA", GREEN);
  o += capShort(t, t > S(9) - 0.1 ? 1100 : 1480);
  o += endCard(t, E(10) + 0.6);
  o += blackout(Math.max(1 - seg(t, 0, 0.3), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
