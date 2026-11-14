// SHORT 10 — OS LADRÕES DO JOSEPH #4: O LADRÃO DA ENERGIA (70 s, para TikTok > 1 min)
const REDC = "#e5484d", VOLT = "#c6f135", PURPLE = THIEF_PURPLE;
const bolt = (x, y, s, op = 1) => `<path d="M 6 -34 L -18 4 L -2 4 L -10 34 L 18 -6 L 2 -6 Z" transform="translate(${x} ${y}) scale(${s})" fill="${VOLT}" stroke="#000" stroke-width="4" stroke-linejoin="round" opacity="${op}"/>`;
const BAT = [830, 690];
function bat(level) {
  const col = level > 0.55 ? GREEN : level > 0.3 ? GOLD : REDC;
  return `<g transform="translate(${BAT[0]} ${BAT[1]}) scale(0.95)">${battery(0, 0, level, "ENERGIA", col)}</g>`;
}
function desk(t, q, day = 0.6) {
  return cam(960, 560, 1.3, roomBg(day, 0.2) + clockAt(1560, 250, q.mins || 900) + josephFront(t, Object.assign({ desk: true, hR: [1040, 630], hL: [880, 630] }, q)), 1150);
}
function bedNight(t, q) {
  let w = roomBg(0.1, 0) + josephFront(t, Object.assign({ blanket: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true } }, q)) + `<rect x="-600" y="-400" width="3120" height="1900" fill="#000" opacity="0.35"/>`;
  return cam(960, 560, 1.3, w, 1150);
}
function cardRow(t, a, y, label, icon, col) {
  const p = pop(t, a); if (p <= 0) return "";
  return `<g transform="translate(540 ${y}) scale(${p})"><rect x="-460" y="-82" width="920" height="164" rx="40" fill="#12151c" stroke="${col}" stroke-width="6"/><g transform="translate(-370 0) scale(0.75)">${icon}</g>${txt(label, 70, 0, label.length > 18 ? 48 : 58, CREAM)}</g>`;
}
const glass = `<path d="M -40 -60 L 40 -60 L 30 60 L -30 60 Z" fill="#cfe8f5" stroke="#000" stroke-width="7"/><path d="M -36 -20 L 36 -20 L 30 60 L -30 60 Z" fill="${ACC}" opacity="0.8"/>`;
const apple = `<circle cx="-18" cy="10" r="46" fill="${REDC}" stroke="#000" stroke-width="6"/><circle cx="18" cy="10" r="46" fill="${REDC}" stroke="#000" stroke-width="6"/><path d="M 0 -30 Q 6 -60 20 -66" stroke="#5a3d2a" stroke-width="8" fill="none"/><path d="M 4 -46 Q 34 -70 50 -44 Q 24 -36 4 -46 Z" fill="${GREEN}"/>`;
const shoe = `<g transform="scale(0.6)"><path d="M -120 -40 L -40 -40 Q -20 -90 30 -90 L 50 -40 Q 120 -30 140 10 Q 150 40 120 40 L -130 40 Q -140 0 -120 -40 Z" fill="#eee" stroke="#000" stroke-width="10"/><rect x="-132" y="22" width="270" height="18" fill="${REDC}"/></g>`;
const donut = `<circle r="62" fill="#e9a86b" stroke="#000" stroke-width="7"/><circle r="54" fill="#ff8fc2"/><circle r="20" fill="#12151c" stroke="#000" stroke-width="6"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${Math.cos(i) * 36 - 6}" y="${Math.sin(i * 2) * 36 - 3}" width="14" height="6" rx="3" fill="${["#fff", VOLT, ACC][i % 3]}" transform="rotate(${i * 50} ${Math.cos(i) * 36} ${Math.sin(i * 2) * 36})"/>`).join("")}`;

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0f140b", "#07080b");
  const steal = (a, base) => { // returns thief state for a grab starting at a
    const u = t - a, k = u < 0.7 ? sm(u / 0.7) : u < 1.5 ? 1 : 1 - sm((u - 1.5) / 0.7);
    return { u, k, reach: inR(u, 0.6, 1.5) ? Math.sin(cl((u - 0.6) / 0.9) * Math.PI) : 0 };
  };
  if (t < S(4) - 0.1) {
    const morning = t > S(2) - 0.1 && t < S(3) - 0.1;
    const level = t < S(2) ? lerp(1, 0.6, seg(t, 1.6, 3.0)) : t < S(3) ? lerp(0.6, 0.3, seg(t, S(2) + 2.5, E(2))) : 0.3;
    if (morning) {
      o += desk(t, { mins: lerp(7 * 60, 15 * 60, seg(t, S(2) + 1.8, E(2))), face: { lid: 0.55 + 0.1 * Math.sin(t * 2), bags: 1, smile: -4, browSad: 0.6, look: [0, 4], mouthOpen: inR(t, S(2) + 0.2, S(2) + 1.2) ? 0.9 : 0 }, hR: [1060, 520], hL: [880, 630] }, 0.9);
      o += `<g transform="translate(700 1000)"><rect x="-40" y="-50" width="80" height="90" rx="10" fill="#fff" stroke="#000" stroke-width="6"/><path d="M 40 -30 q 30 0 30 25 q 0 25 -30 25" fill="none" stroke="#000" stroke-width="6"/><path d="M -20 -70 q 10 -20 0 -40 M 10 -70 q 10 -20 0 -40" stroke="#cfd8e3" stroke-width="5" fill="none" opacity="${0.5 + 0.5 * Math.sin(t * 3)}"/></g>`;
      o += txt(lerp(7, 15, seg(t, S(2) + 1.8, E(2))) < 10 ? "07:00" : "15:00", 300, 420, 90, CREAM, 1, 1);
      o += bat(level);
    } else {
      o += desk(t, { face: { lid: 0.45, bags: 0.8, smile: -3, browSad: 0.5, look: [0, 8] } }, 0.35);
      o += bat(level);
      const a = 1.4, s = steal(a);
      const tx = lerp(170, BAT[0] - 230, s.k), ty = lerp(760, BAT[1] - 50, s.k);
      if (inR(s.u, 0.9, 1.4)) o += bolt(lerp(BAT[0], tx + 60, (s.u - 0.9) / 0.5), lerp(BAT[1], ty - 40, (s.u - 0.9) / 0.5), 1.4);
      o += thief(t < a + 2.2 ? tx : 170, t < a + 2.2 ? ty : 760, 0.8, 1, seg(t, 0.05, 0.6), t, { reach: s.reach, sack: t > a + 1.5 ? 1 : 0, loot: VOLT, grin: 1 });
      if (t < S(2) - 0.1) o += txt("ELE LEVA", 540, 380, 110, CREAM, 1, pop(t, 0.2)) + txt("SUA ENERGIA", 540, 510, 110, VOLT, 1, pop(t, 2.6));
      else {
        o += `<g transform="translate(540 420) rotate(-6) scale(${pop(t, S(3))})"><rect x="-260" y="-70" width="520" height="140" rx="16" fill="none" stroke="#8f99a3" stroke-width="10"/>${txt("PREGUIÇA?", 0, 0, 90, "#8f99a3")}</g>`;
        if (t > S(3) + 1.6) o += `<line x1="300" y1="360" x2="${lerp(300, 780, seg(t, S(3) + 1.6, S(3) + 1.9))}" y2="480" stroke="${REDC}" stroke-width="16" stroke-linecap="round"/>` + txt("É ELE.", 540, 600, 100, VOLT, 1, pop(t, S(3) + 2.2));
      }
    }
  } else if (t < S(5) - 0.1) {
    // trick 1: phone until late, sleep hours into the sack
    o += bedNight(t, { face: { lid: 0.35, bags: 0.8, look: [0, 9], smile: 0 } });
    o += txt("TRUQUE 1", 540, 330, 70, VOLT, 1, pop(t, S(4))) + txt("CELULAR ATÉ TARDE", 540, 430, 76, CREAM, 1, pop(t, S(4) + 0.4));
    o += `<g transform="translate(830 560)"><rect x="-130" y="-55" width="260" height="110" rx="20" fill="#07080b" stroke="${REDC}" stroke-width="6"/><text class="sans" x="0" y="25" font-size="72" font-weight="800" text-anchor="middle" fill="${REDC}">${t < S(4) + 3.2 ? "00:40" : "01:40"}</text></g>`;
    const k = seg(t, S(4) + 3.4, E(4));
    o += thief(220, 760, 0.9, 1, 1, t, { sack: Math.round(3 * k), loot: "#7c8cff", reach: k > 0 && k < 1 ? 0.6 : 0 });
    for (let i = 0; i < 3; i++) { const q = seg(t, S(4) + 3.4 + i * 0.9, S(4) + 4.1 + i * 0.9); if (q > 0 && q < 1) o += `<g transform="translate(${lerp(560, 260, q)} ${lerp(1000, 760, q)})">${ICON.moon("#7c8cff").replace('d="M 20 -60', 'transform="scale(0.45)" d="M 20 -60')}</g>`; }
  } else if (t < S(6) - 0.1) {
    // trick 2: sugar spike and crash
    o += txt("TRUQUE 2", 540, 330, 70, VOLT, 1, pop(t, S(5))) + txt("O AÇÚCAR", 540, 430, 90, CREAM, 1, pop(t, S(5) + 0.4));
    o += `<g transform="translate(220 640) scale(${pop(t, S(5) + 0.8)})">${donut}</g>`;
    const x0 = 140, x1 = 960, yb = 1100, ytop = 620, k = seg(t, S(5) + 2.0, E(5));
    let d = "";
    for (let i = 0; i <= 120 * k; i++) {
      const u = i / 120, v = u < 0.25 ? 0.45 : u < 0.4 ? lerp(0.45, 1, sm((u - 0.25) / 0.15)) : u < 0.6 ? lerp(1, 0.15, sm((u - 0.4) / 0.2)) : 0.15 + 0.05 * Math.sin(u * 20);
      d += `${i ? "L" : "M"} ${lerp(x0, x1, u)} ${lerp(yb, ytop, v)} `;
    }
    o += `<line x1="${x0}" y1="${lerp(yb, ytop, 0.45)}" x2="${x1}" y2="${lerp(yb, ytop, 0.45)}" stroke="#5a6170" stroke-width="4" stroke-dasharray="14 10"/>`;
    if (d) o += `<path d="${d}" fill="none" stroke="#000" stroke-width="18" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${VOLT}" stroke-width="9" stroke-linejoin="round"/>`;
    o += txt("PICO", 520, 580, 64, VOLT, seg(t, S(5) + 2.6, S(5) + 2.9)) + txt("QUEDA", 760, 1180, 70, REDC, seg(t, E(5) - 0.8, E(5) - 0.5));
  } else if (t < S(8) - 0.1) {
    // trick 3: sitting still; then movement makes energy
    const moving = t > S(7) - 0.1;
    if (!moving) {
      o += desk(t, { face: { lid: 0.5, bags: 0.6, smile: -2, look: [0, 8] }, laptop: true, mins: 600 + (t - S(6)) * 60 }, 0.6);
      o += txt("TRUQUE 3", 540, 330, 70, VOLT, 1, pop(t, S(6))) + txt("FICAR PARADO", 540, 430, 90, CREAM, 1, pop(t, S(6) + 0.4));
      o += bat(lerp(0.5, 0.15, seg(t, S(6) + 1.5, E(6))));
      o += thief(200, 760, 0.9, 1, 1, t, { sack: 4, loot: VOLT, grin: 1 });
    } else {
      const R = { x: 960, dir: 1, groundY: 840, gait: 0.8, phase: t * 8, lean: 4, look: [6, 0], lid: 0.05, browUp: 0, browAng: 0, browSad: 0, pant: 0, smile: 8 };
      o += cam(960, 580, 1.25, streetBg(t * 260) + sidePerson(R, t), 1130);
      o += txt("MOVIMENTO", 540, 400, 110, VOLT, 1, pop(t, S(7) + 1.4)) + txt("GERA ENERGIA", 540, 520, 96, CREAM, 1, pop(t, S(7) + 2.0));
      for (let i = 0; i < 4; i++) { const k = ((t - S(7)) * 0.8 + i / 4) % 1; o += bolt(560 + Math.sin(i * 2) * 120, 1000 - k * 300, 1.3, Math.sin(k * Math.PI)); }
    }
  } else if (t < S(11) - 0.1) {
    o += txt(t < S(9) - 0.1 ? "PRA PEGAR O LADRÃO:" : "O PLANO", 540, 330, 80, CREAM, 1, pop(t, S(8)));
    if (t < S(9) - 0.1) o += `<g transform="translate(540 760) rotate(-8) scale(${pop(t, S(8) + 1.4)})"><path d="M -240 -100 L 160 -100 L 260 0 L 160 100 L -240 100 Z" fill="${VOLT}" stroke="#000" stroke-width="8"/><circle cx="170" cy="0" r="20" fill="#12151c"/><text class="hand" x="-40" y="40" font-size="120" text-anchor="middle" fill="#12151c">R$ 0</text></g>` + txt("nada caro", 540, 1000, 70, "#cfd8e3", seg(t, S(8) + 2.0, S(8) + 2.4));
    else {
      o += cardRow(t, S(9), 520, "MESMO HORÁRIO DE DORMIR", ICON.moon("#7c8cff"), "#7c8cff");
      o += cardRow(t, S(9) + 2.4, 710, "ÁGUA AO ACORDAR", glass, ACC);
      o += cardRow(t, S(10), 900, "FRUTA NO LUGAR DO DOCE", apple, REDC);
      o += cardRow(t, S(10) + 2.6, 1090, "10 MIN DE CAMINHADA", shoe, GREEN);
    }
  } else if (t < S(12) - 0.1) {
    const k = seg(t, S(11) + 1.2, S(11) + 3.0);
    o += desk(t, { face: { smile: 12, look: [0, 4], lid: blink(t, 0.04), browUp: 4 }, armsUp: seg(t, S(11) + 2.6, S(11) + 3.2), mins: 8 * 60 }, 1);
    o += bat(lerp(0.25, 1, k));
    o += txt("1 SEMANA DEPOIS", 540, 330, 80, VOLT, 1, pop(t, S(11)));
    const d = ["S", "T", "Q", "Q", "S", "S", "D"];
    d.forEach((l, i) => { const p = pop(t, S(11) + 0.2 + i * 0.15); if (p > 0) o += `<g transform="translate(${130 + i * 137} 1360) scale(${p})"><rect x="-55" y="-55" width="110" height="110" rx="18" fill="#12151c" stroke="${GREEN}" stroke-width="5"/>${txt(l, 0, -18, 36, "#cfd8e3")}<g transform="translate(0 22) scale(0.4)">${ICON.check(GREEN)}</g></g>`; });
    o += thief(lerp(220, -200, seg(t, S(11) + 2.4, E(11))), 820, 0.9, -1, 1, t, { sack: 0, shrug: 0.7, loot: VOLT });
  } else {
    o += txt("4 LADRÕES", 540, 330, 90, CREAM, 1, pop(t, S(12)));
    [["FOCO", ACC], ["TEMPO", GOLD], ["AUTOESTIMA", "#ff6fae"], ["ENERGIA", VOLT]].forEach(([s, c], i) => { const p = pop(t, S(12) + 0.4 + i * 0.25); if (p > 0) o += `<g transform="translate(${170 + i * 247} 640) scale(${p})">${thief(0, 0, 0.7, i % 2 ? -1 : 1, 1, t + i, { look: 4 })}${txt("✓", 0, 120, 60, GREEN)}</g>` + txt(s, 170 + i * 247, 800, 38, c, p); });
    o += txt("QUAL É O 5º?", 540, 1000, 110, VOLT, 1, pop(t, S(12) + 1.8));
    o += txt("comenta aqui 👇", 540, 1150, 64, CREAM, seg(t, S(12) + 2.4, S(12) + 2.8));
  }
  o += vignette();
  o += topTag("OS LADRÕES DO JOSEPH #4", PURPLE);
  o += capShort(t);
  o += endCard(t, E(12) + 0.3, "Segue pra ver o próximo ladrão");
  o += blackout(Math.max(1 - seg(t, 0, 0.2), seg(t, end - 0.3, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
