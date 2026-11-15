// A QUADRILHA — Os Ladrões do Joseph (vídeo longo, 1920x1080)
const W = 1920, H = 1080, REDC = "#e5484d";
const T5 = {
  energia: { name: "LADRÃO DA ENERGIA", c: "#c6f135" },
  foco: { name: "LADRÃO DO FOCO", c: "#4fd1ff" },
  tempo: { name: "LADRÃO DO TEMPO", c: "#ffc53d" },
  autoestima: { name: "LADRÃO DA AUTOESTIMA", c: "#ff6fae" },
  sono: { name: "LADRÃO DO SONO", c: "#8b6ad8" },
};
const KEYS = ["energia", "foco", "tempo", "autoestima", "sono"];
const th = (k, x, y, s, dir, a, t, o = {}) => thief(x, y, s, dir, a, t, Object.assign({ mask: T5[k].c, loot: T5[k].c }, o));
const big = (s, x, y, size, col = CREAM, op = 1, sc = 1) => txt(s, x, y, size, col, op, sc);
function nameChip(t, a, k, x, y) {
  const p = pop(t, a); if (p <= 0) return "";
  const n = T5[k].name, w = n.length * 26 + 80;
  return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="-42" width="${w}" height="84" rx="42" fill="#12151c" stroke="${T5[k].c}" stroke-width="6"/>${txt(n, 0, 0, 46, T5[k].c)}</g>`;
}
function hud(t, time, label) {
  return `<g><rect x="50" y="40" width="${label.length * 22 + 230}" height="76" rx="38" fill="#07080b" opacity="0.85"/><text class="sans" x="80" y="92" font-size="40" font-weight="800" fill="${CREAM}">${time}</text><text class="hand" x="215" y="92" font-size="38" fill="#cfd8e3">${label}</text></g>`;
}
const orb = (x, y, r, c, op = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#fff" stroke-width="4" opacity="${op}"/>`;
// world wrapper: shift the rig room so Joseph sits at screen x
const room = (inner, dx = 0, dy = 0, s = 1) => `<g transform="translate(${960 + dx} ${540 + dy}) scale(${s}) translate(-960 -540)">${inner}</g>`;
function battery2(x, y, level, s = 1) { const col = level > 0.55 ? GREEN : level > 0.3 ? GOLD : REDC; return `<g transform="translate(${x} ${y}) scale(${s})">${battery(0, 0, level, "ENERGIA", col)}</g>`; }

// ---------- the boss: PILOTO AUTOMÁTICO ----------
function boss(x, y, s, t, o = {}) {
  const glow = 0.6 + 0.4 * Math.sin(t * 3);
  let g = `<g transform="translate(${x} ${y + Math.sin(t * 1.6) * 6}) scale(${s})">`;
  g += `<ellipse cx="0" cy="60" rx="260" ry="300" fill="#3e63dd" opacity="0.12" style="mix-blend-mode:screen"/>`;
  g += `<path d="M -150 230 C -175 40 -120 -60 0 -70 C 120 -60 175 40 150 230 Z" fill="#141a2e" stroke="#000" stroke-width="9"/>`;
  g += `<path d="M -40 -30 L 0 60 L 40 -30" fill="none" stroke="#2c3a66" stroke-width="12"/>`;
  g += `<circle cx="0" cy="-150" r="105" fill="#141a2e" stroke="#000" stroke-width="9"/>`;
  // pilot cap
  g += `<path d="M -120 -190 Q 0 -300 120 -190 L 130 -170 L -130 -170 Z" fill="#0d1120" stroke="#000" stroke-width="8"/><rect x="-140" y="-180" width="280" height="26" rx="10" fill="#0d1120" stroke="#000" stroke-width="7"/>`;
  g += `<g transform="translate(0 -232)"><path d="M -60 0 Q -30 -16 -10 0 M 60 0 Q 30 -16 10 0" stroke="${GOLD}" stroke-width="8" fill="none" stroke-linecap="round"/><circle r="12" fill="${GOLD}"/></g>`;
  // autoplay eyes ▶▶
  for (const ex of [-42, 42]) g += `<path d="M ${ex - 18} -168 L ${ex + 20} -148 L ${ex - 18} -128 Z" fill="#9fd8ff" opacity="${glow}"/><ellipse cx="${ex}" cy="-148" rx="34" ry="26" fill="#4fd1ff" opacity="${0.25 * glow}" style="mix-blend-mode:screen"/>`;
  // arm + remote
  const press = o.press || 0;
  g += `<path d="M 120 60 Q 220 ${40 - 30 * press} 250 ${-10 - 20 * press}" fill="none" stroke="#000" stroke-width="44" stroke-linecap="round"/><path d="M 120 60 Q 220 ${40 - 30 * press} 250 ${-10 - 20 * press}" fill="none" stroke="#141a2e" stroke-width="32" stroke-linecap="round"/>`;
  g += `<g transform="translate(270 ${-40 - 20 * press}) rotate(-15)"><rect x="-38" y="-90" width="76" height="170" rx="18" fill="#2a2e35" stroke="#000" stroke-width="6"/><circle cx="0" cy="-48" r="22" fill="${REDC}" stroke="#000" stroke-width="5"/>${[0, 1, 2].map(i => `<rect x="-22" y="${-10 + i * 28}" width="44" height="16" rx="6" fill="#8f99a3"/>`).join("")}</g>`;
  return g + `</g>`;
}
function door(x, y, open, locked, t, lab) {
  let o = `<g transform="translate(${x} ${y})"><rect x="-130" y="-260" width="260" height="520" fill="#07080b" stroke="#000" stroke-width="8"/>`;
  const w = 240 * (1 - open);
  o += `<rect x="-120" y="-250" width="${w}" height="500" fill="#6b4a33" stroke="#000" stroke-width="6"/>`;
  if (w > 60) o += `<circle cx="${-120 + w - 30}" cy="10" r="12" fill="${GOLD}" stroke="#000" stroke-width="4"/>`;
  if (locked > 0) o += `<g transform="translate(0 -20) scale(${easeBack(locked)})"><path d="M -34 -20 v -30 a 34 34 0 0 1 68 0 v 30" fill="none" stroke="${GOLD}" stroke-width="14"/><rect x="-52" y="-24" width="104" height="86" rx="14" fill="${GOLD}" stroke="#000" stroke-width="6"/></g>`;
  if (lab) o += txt(lab, 0, 300, 40, CREAM);
  return o + `</g>`;
}

// ---------- scenes ----------
function intro(t) {
  let o = `<rect width="${W}" height="${H}" fill="#07080b"/>`;
  if (t < S(2) - 0.1) {
    KEYS.forEach((k, i) => { const a = 0.3 + i * 0.35; o += th(k, 260 + i * 350, 560, 1.15, i % 2 ? -1 : 1, seg(t, a, a + 0.4), t + i, { look: 4 }); });
    o += big("5 LADRÕES", 960, 160, 110, GOLD, seg(t, 2.0, 2.4), pop(t, 2.0));
  } else if (t < S(3) - 0.1) {
    const k1 = seg(t, S(2) + 0.6, S(2) + 0.9), k2 = seg(t, S(2) + 2.0, S(2) + 2.3);
    o += `<g transform="translate(560 420) scale(${pop(t, S(2))})"><rect x="-170" y="-110" width="340" height="220" rx="16" fill="#2a2e35" stroke="#000" stroke-width="8"/><rect x="-150" y="-92" width="300" height="170" rx="8" fill="#5b7fa3"/><line x1="-200" y1="-150" x2="${-200 + 400 * k1}" y2="${-150 + 300 * k1}" stroke="${REDC}" stroke-width="18" stroke-linecap="round"/></g>`;
    o += `<g transform="translate(1360 420) scale(${pop(t, S(2) + 1.4)})"><rect x="-140" y="-90" width="280" height="180" rx="22" fill="#8c4a2f" stroke="#000" stroke-width="8"/><rect x="40" y="-30" width="110" height="60" rx="14" fill="#6e3a24" stroke="#000" stroke-width="6"/><line x1="-180" y1="-130" x2="${-180 + 360 * k2}" y2="${-130 + 260 * k2}" stroke="${REDC}" stroke-width="18" stroke-linecap="round"/></g>`;
    KEYS.forEach((k, i) => { const p = pop(t, S(2) + 3.4 + i * 0.25); if (p > 0) o += `<g transform="translate(${560 + i * 200} 800) scale(${p})">${orb(0, 0, 50, T5[k].c)}</g>`; });
    o += big("MUITO MAIS CARAS", 960, 950, 70, CREAM, seg(t, S(2) + 3.4, S(2) + 3.8));
  } else {
    o += `<g opacity="${seg(t, S(3) + 2.0, S(3) + 3.0)}">${boss(960, 600, 1.3, t).replace(/fill="#141a2e"/g, 'fill="#05060a"')}</g>`;
    o += big("?", 960, 380, 200, GOLD, seg(t, S(3) + 3.0, S(3) + 3.4), pop(t, S(3) + 3.0));
  }
  return o;
}
function titleScreen(t, a) {
  let o = `<rect width="${W}" height="${H}" fill="#07080b"/>`;
  KEYS.forEach((k, i) => { o += th(k, 260 + i * 350, 820, 0.6, i % 2 ? -1 : 1, 0.55 * seg(t, a, a + 0.6), t + i); });
  o += big("A QUADRILHA", 960, 430, 190, CREAM, seg(t, a + 0.3, a + 0.9), easeBack(seg(t, a + 0.3, a + 0.9)));
  o += `<text class="sans" x="960" y="560" font-size="34" font-weight="600" letter-spacing="12" text-anchor="middle" fill="#8f99a3" opacity="${seg(t, a + 1.0, a + 1.6)}">OS LADRÕES DO JOSEPH</text>`;
  return o;
}
function morning(t) {
  const snooze = [S(4) + 2.8, S(4) + 3.6, S(4) + 4.4].filter(a => t > a).length;
  let w = roomBg(0.75, 0.35) + josephFront(t, { blanket: true, face: { lid: t < S(5) ? 1 : 0.55, zzz: t < S(4) + 2.0, bags: 1, smile: -3, browSad: 0.5 } });
  let o = room(w, -260, 120, 1.1);
  const ring = t < S(4) + 4.6 ? Math.sin(t * 40) * 6 : 0;
  o += `<g transform="translate(${1350 + ring} 760)"><circle cx="-60" cy="-70" r="28" fill="${REDC}" stroke="#000" stroke-width="6"/><circle cx="60" cy="-70" r="28" fill="${REDC}" stroke="#000" stroke-width="6"/>${clockAt(0, 0, 6 * 60 + 30)}</g>`;
  for (let i = 0; i < snooze; i++) o += big("SONECA", 1620, 560 + i * 80, 46, GOLD, 1, pop(t, [S(4) + 2.8, S(4) + 3.6, S(4) + 4.4][i]));
  o += battery2(1500, 330, t < S(6) ? 0.45 : lerp(0.45, 0.12, seg(t, S(6) + 3, E(6))), 1.2);
  if (t > S(5) - 0.2) {
    const k = seg(t, S(5), S(5) + 1.2);
    o += th("energia", lerp(1900, 1180, k), 360, 1.0, -1, 1, t, { reach: inR(t, S(6), S(6) + 1.5) ? 0.8 : 0, sack: 4, grin: 1 }) + nameChip(t, S(5) + 2.2, "energia", 1180, 130);
  }
  return o + hud(t, "06:30", "manhã");
}
function study(t) {
  const steals = [S(8) + 0.2, S(9) + 0.5, S(9) + 2.5];
  const stolen = steals.filter(a => t > a + 1.4).length;
  let w = roomBg(0.85, 0.2) + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], phone: { pc: [1200, 632], held: 0, on: steals.some(a => inR(t, a - 0.2, a + 1.2)) }, face: steals.some(a => inR(t, a, a + 1.4)) ? { look: [10, 9], browUp: 6, lid: 0 } : { look: [0, 9], smile: 1, lid: blink(t, 0.1) } });
  let o = room(w, -300, 60, 1.05);
  // focus meter
  o += `<g transform="translate(1500 380)"><rect x="-150" y="-60" width="300" height="120" rx="18" fill="#12151c" stroke="${CREAM}" stroke-width="7"/><rect x="-136" y="-46" width="${272 * (1 - 0.3 * stolen)}" height="92" rx="8" fill="${T5.foco.c}"/>${txt("FOCO", 0, -100, 46, CREAM)}</g>`;
  for (const a of steals) if (inR(t, a, a + 2.2)) {
    const u = t - a, k = u < 0.6 ? sm(u / 0.6) : u < 1.4 ? 1 : 1 - sm((u - 1.4) / 0.8);
    o += th("foco", lerp(1900, 1330, k), 520, 0.95, -1, 1, t, { reach: inR(u, 0.5, 1.4) ? 0.9 : 0, sack: stolen + 1, grin: 1 });
    if (inR(u, 0.2, 1.0)) o += `<g transform="translate(980 590)"><rect x="-80" y="-36" width="160" height="72" rx="36" fill="#fff" stroke="#000" stroke-width="5"/>${txt("plim!", 0, 0, 40, "#1c1c22")}</g>`;
  }
  if (t > S(8) + 1.0 && t < S(9)) o += nameChip(t, S(8) + 1.0, "foco", 1400, 160);
  if (t > S(9) + 4.2 && t < S(10)) o += `<g transform="translate(1500 650) scale(${pop(t, S(9) + 4.2)})"><rect x="-200" y="-60" width="400" height="120" rx="60" fill="#12151c" stroke="${GOLD}" stroke-width="6"/>${txt("+20 MIN", 0, 0, 64, GOLD)}</g>`;
  if (t > S(10)) o += `<g transform="translate(1500 680) scale(${pop(t, S(10) + 0.4)})"><rect x="-210" y="-70" width="420" height="140" rx="20" fill="#f6f1e6" stroke="#000" stroke-width="6"/>${txt("pág. 1", 0, 0, 64, "#1c1c22", 1, 1)}</g>`;
  return o + hud(t, t < S(10) ? "09:00" : "11:58", "manhã");
}
function lunch(t) {
  const h = t < S(13) ? 12 + 0.3 * seg(t, S(11), S(13)) : lerp(12.3, 16, seg(t, S(13), S(13) + 1.0));
  let w = roomBg(1, 0.4) + josephFront(t, { desk: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { look: [0, 9], lid: 0.15, smile: 4 } });
  let o = room(w, -300, 60, 1.05);
  const coins = Math.floor(seg(t, S(12) + 1.6, E(12)) * 6);
  o += th("tempo", 1420, 540, 1.0, -1, seg(t, S(12) - 0.4, S(12)), t, { sack: coins, grin: 1, reach: coins % 2 ? 0.5 : 0 });
  for (let i = 0; i < 3; i++) { const a = S(12) + 2.2 + i * 1.0, k = seg(t, a, a + 0.6); if (k > 0 && k < 1) o += `<g transform="translate(${lerp(980, 1360, k)} ${lerp(560, 470, k)})"><circle r="34" fill="${GOLD}" stroke="#000" stroke-width="4"/>${txt("5'", 0, 0, 30, "#5a3d00", 1, 1)}</g>`; }
  if (t > S(12)) o += nameChip(t, S(12) + 0.6, "tempo", 1420, 160);
  o += `<g transform="translate(1660 820) scale(${t > S(13) ? 1 + 0.15 * Math.sin(t * 8) * (1 - seg(t, S(13) + 1, S(13) + 2)) : 1})"><rect x="-150" y="-60" width="300" height="120" rx="20" fill="#07080b" stroke="${t > S(13) ? REDC : CREAM}" stroke-width="6"/><text class="sans" x="0" y="22" font-size="64" font-weight="800" text-anchor="middle" fill="${t > S(13) ? REDC : CREAM}">${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}</text></g>`;
  return o + hud(t, "12:00", "almoço");
}
function nightFeed(t) {
  const steals = [S(15) + 2.0, S(15) + 3.4, S(15) + 4.8];
  const stolen = steals.filter(a => t > a + 1).length;
  let w = roomBg(0.15, 0) + josephFront(t, { blanket: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { look: [0, 9], lid: 0.3, smile: t > S(16) ? -6 : 0, browSad: t > S(15) ? 0.8 : 0, bags: 0.6 } }) + `<rect x="-600" y="-400" width="3120" height="1900" fill="#000" opacity="0.3"/>`;
  let o = room(w, -320, 100, 1.05);
  const posts = [["#58c4e6", "viagem"], ["#ff9f6b", "corpo"], ["#9b8cff", "carro"]];
  if (t < S(16) - 0.2) posts.forEach(([c, s], i) => { const p = pop(t, S(14) + 1.6 + i * 1.1); if (p > 0) o += `<g transform="translate(${1180 + i * 230} ${260 + (i % 2) * 60}) scale(${p}) rotate(${(i - 1) * 6})"><rect x="-100" y="-120" width="200" height="240" rx="16" fill="#fff" stroke="#000" stroke-width="5"/><rect x="-86" y="-104" width="172" height="150" fill="${c}"/>${txt(s, 0, 80, 30, "#5a5a66", 1, 1)}</g>`; });
  if (t > S(15) - 0.2) {
    o += th("autoestima", 1480, 640, 1.0, -1, seg(t, S(15) - 0.2, S(15) + 0.4), t, { sack: stolen, grin: 1, reach: steals.some(a => inR(t, a, a + 1)) ? 0.8 : 0 });
    o += nameChip(t, S(15) + 1.0, "autoestima", 1480, 160);
    for (const a of steals) if (inR(t, a, a + 1)) { const k = (t - a); o += `<path d="M 0 14 C -32 -10 -14 -36 0 -18 C 14 -36 32 -10 0 14 Z" transform="translate(${lerp(660, 1400, k)} ${lerp(460, 560, k)}) scale(1.6)" fill="${T5.autoestima.c}" stroke="#fff" stroke-width="3"/>`; }
  }
  if (t > S(16)) o += `<g transform="translate(1450 330) scale(${pop(t, S(16) + 1.2)})"><ellipse rx="300" ry="95" fill="#f4efe6" stroke="#000" stroke-width="7"/><text class="hand" x="0" y="16" font-size="46" text-anchor="middle" fill="#1c1c22">todo mundo tá na frente...</text></g>`;
  return o + hud(t, "21:00", "noite");
}
function lateNight(t) {
  let w = roomBg(0.05, 0) + josephFront(t, { blanket: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { look: [0, 9], lid: 0.45, bags: 1, smile: 0 } }) + `<rect x="-600" y="-400" width="3120" height="1900" fill="#000" opacity="0.4"/>`;
  let o = room(w, -320, 100, 1.05);
  if (t < S(19) - 0.1) {
    o += `<g transform="translate(1500 330)"><rect x="-170" y="-70" width="340" height="140" rx="22" fill="#07080b" stroke="${REDC}" stroke-width="7"/><text class="sans" x="0" y="30" font-size="88" font-weight="800" text-anchor="middle" fill="${REDC}">02:00</text></g>`;
    if (t > S(18) - 0.2) o += th("sono", lerp(1950, 1420, seg(t, S(18), S(18) + 1.4)), 650, 1.05, -1, 1, t, { sack: 5, grin: 1, look: -8 }) + nameChip(t, S(18) + 2.4, "sono", 1440, 160);
  } else {
    o += `<rect width="${W}" height="${H}" fill="#07080b" opacity="${0.75 * seg(t, S(19), S(19) + 0.5)}"/>`;
    const rot = (t - S(19)) * 40;
    KEYS.forEach((k, i) => { const a = (i / 5) * 360 + rot, x = 960 + Math.sin(a * D2R) * 300, y = 520 - Math.cos(a * D2R) * 300; o += th(k, x, y + 40, 0.55, 1, seg(t, S(19), S(19) + 0.5), t + i); });
    o += `<circle cx="960" cy="540" r="300" fill="none" stroke="#5a6170" stroke-width="6" stroke-dasharray="20 16" opacity="${seg(t, S(19), S(19) + 0.5)}"/>` + big("TODO DIA", 960, 560, 90, CREAM, seg(t, S(19) + 1.0, S(19) + 1.4));
  }
  return o + (t < S(19) ? hud(t, "02:00", "madrugada") : "");
}
function lair(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0a0912"/><rect y="760" width="${W}" height="320" fill="#06050b"/>`;
  o += `<ellipse cx="960" cy="800" rx="700" ry="90" fill="#3e63dd" opacity="0.08"/>`;
  // loot piles
  KEYS.forEach((k, i) => { for (let j = 0; j < 6; j++) o += orb(420 + i * 270 + (j % 3) * 30 - 30, 800 - Math.floor(j / 3) * 34, 18, T5[k].c, 0.9); });
  const reveal = seg(t, S(22) - 0.2, S(22) + 1.0);
  if (t < S(25) - 0.6) {
    if (t < S(21) - 0.1) {
      o += big("O ESCONDERIJO", 960, 150, 90, GOLD, 1, pop(t, S(20) + 0.6));
      KEYS.forEach((k, i) => { o += th(k, 300 + i * 330, 600, 0.9, i < 2 ? 1 : -1, seg(t, S(20) + 0.4 + i * 0.3, S(20) + 0.9 + i * 0.3), t + i); });
      // Joseph peeking
      o += `<g opacity="${seg(t, S(20) + 2.6, S(20) + 3.2)}">${room(josephFront(t, { face: { look: [8, 2], browUp: 10, mouthOpen: 0.3 } }), -820, 340, 0.55)}</g>`;
    } else {
      KEYS.forEach((k, i) => { o += th(k, i < 2 ? 260 + i * 220 : 1220 + (i - 2) * 220, 700, 0.75, i < 2 ? 1 : -1, 1, t + i, { look: i < 2 ? 8 : -8 }); });
      o += `<rect x="810" y="560" width="300" height="240" rx="20" fill="#1a1530" stroke="#000" stroke-width="8"/>`;   // throne
      o += `<g opacity="${t < S(22) - 0.2 ? 0.9 : 1}">${t < S(22) - 0.2 ? boss(960, 470, 1.15, t).replace(/fill="#141a2e"/g, 'fill="#05060a"').replace(/fill="#9fd8ff"/g, 'fill="#05060a"') : boss(960, 470, 1.15, t, { press: t > S(23) && t < S(24) ? Math.max(0, Math.sin(t * 5)) : 0 })}</g>`;
      if (t < S(22) - 0.2) o += big("O CHEFE", 960, 150, 100, CREAM, 1, pop(t, S(21) + 0.3));
      else if (t < S(23) - 0.1) o += `<g transform="translate(960 150) scale(${easeBack(reveal)})"><rect x="-430" y="-62" width="860" height="124" rx="62" fill="#12151c" stroke="#3e63dd" stroke-width="7"/>${txt("PILOTO AUTOMÁTICO", 0, 0, 72, "#9fd8ff")}</g>` + `<rect width="${W}" height="${H}" fill="#fff" opacity="${0.6 * (1 - seg(t, S(22) - 0.2, S(22) + 0.4))}"/>`;
      else if (t < S(24) - 0.1) {
        const acts = [[S(23) + 4.0, "ABRE O APP"], [S(23) + 6.0, "APERTA A SONECA"], [S(23) + 7.8, "\"SÓ MAIS UM\""]];
        acts.forEach(([a, s], i) => { const p = pop(t, a); if (p > 0) o += `<g transform="translate(${1500} ${260 + i * 120}) scale(${p})"><rect x="-260" y="-44" width="520" height="88" rx="44" fill="#12151c" stroke="#3e63dd" stroke-width="5"/>${txt(s, 0, 0, 46, "#9fd8ff")}</g>`; });
        o += big("ele decide por você", 960, 150, 64, CREAM, seg(t, S(23) + 0.6, S(23) + 1.0));
      } else {
        o += `<g transform="translate(-60 0)">${door(1700, 520, seg(t, S(24) + 0.6, S(24) + 1.4), 0, t, "")}</g>` + big("A PORTA ABERTA", 960, 150, 80, GOLD, 1, pop(t, S(24) + 0.4));
      }
    }
  }
  return o;
}
function plan(t) {
  let o = "";
  if (t < S(26) - 0.1) {
    o += `<rect width="${W}" height="${H}" fill="#0a0912"/>`;
    KEYS.forEach((k, i) => { o += th(k, 260 + i * 160, 620, 0.55, 1, 1 - seg(t, S(25) + 2.6, S(25) + 3.4), t + i); });
    o += big("5", 640, 300, 200, CREAM, 1 - seg(t, S(25) + 2.4, S(25) + 2.8));
    o += big("→", 960, 560, 160, GOLD, seg(t, S(25) + 2.6, S(25) + 3.0));
    o += boss(1460, 560, 0.8, t) + big("1", 1460, 180, 200, GOLD, seg(t, S(25) + 3.0, S(25) + 3.4), pop(t, S(25) + 3.0));
  } else {
    let w = roomBg(0.2, 0.3) + clockAt(1560, 250, 22 * 60) + josephFront(t, { desk: true, book: [960, 600], hR: [1040 + Math.sin(t * 8) * 6, 610], hL: [880, 610], face: { look: [0, 9], smile: 6, browAng: 0.5 } });
    o += room(w, -320, 60, 1.05);
    o += `<g transform="translate(1440 560) rotate(2) scale(${pop(t, S(26) + 0.4)})"><rect x="-300" y="-330" width="600" height="660" rx="16" fill="#f6f1e6" stroke="#000" stroke-width="7"/>${txt("PLANO DE AMANHÃ", 0, -260, 50, "#1c1c22", 1, 1)}`;
    ["celular fora do quarto", "não perturbe no estudo", "limite nos apps", "comparar só com o ontem"].forEach((s, i) => { o += `<rect x="-250" y="${-190 + i * 120}" width="44" height="44" rx="8" fill="none" stroke="#1c1c22" stroke-width="5"/><text class="hand" x="-180" y="${-155 + i * 120}" font-size="40" fill="#1c1c22" opacity="${seg(t, S(26) + 0.8 + i * 0.4, S(26) + 1.2 + i * 0.4)}">${s}</text>`; });
    o += `</g>` + hud(t, "22:00", "a noite antes");
  }
  return o;
}
function traps(t) {
  const items = [[27, ["sono", "energia"], "1", "CELULAR FORA DO QUARTO"], [28, ["foco"], "2", "MODO NÃO PERTURBE"], [29, ["tempo"], "3", "LIMITE NOS APPS"], [30, ["autoestima"], "4", "DEIXAR DE SEGUIR + COMPARAR COM O ONTEM"]];
  let cur = items.filter(it => t > S(it[0]) - 0.6).pop();
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/><rect y="820" width="${W}" height="260" fill="#090a0e"/>`;
  const [id, ks, n, title] = cur;
  const a = S(id);
  o += `<g transform="translate(960 150) scale(${pop(t, a - 0.3)})"><rect x="-${title.length * 18 + 140}" y="-60" width="${title.length * 36 + 280}" height="120" rx="60" fill="#12151c" stroke="${GREEN}" stroke-width="6"/><circle cx="-${title.length * 18 + 80}" cy="0" r="42" fill="${GREEN}"/><text class="hand" x="-${title.length * 18 + 80}" y="20" font-size="56" text-anchor="middle" fill="#07080b">${n}</text>${txt(title, 30, 0, title.length > 24 ? 46 : 58, CREAM)}</g>`;
  o += door(960, 560, 0, seg(t, a + 0.8, a + 1.2), t, "");
  ks.forEach((k, i) => {
    const u = t - a - 1.6 - i * 0.5;
    const x = u < 0 ? 1950 : u < 0.8 ? lerp(1950, 1170, sm(u / 0.8)) : u < 1.4 ? 1170 - Math.sin((u - 0.8) * 20) * 10 * (1.4 - u) : lerp(1170, 2000, sm((u - 2.2) / 1.0));
    o += th(k, x, 600 + i * 40, 0.9, -1, u > -0.1 ? 1 : 0, t + i, { shrug: u > 1.4 ? 0.7 : 0, reach: inR(u, 0.7, 1.3) ? 0.5 : 0 });
    if (inR(u, 0.8, 1.6)) o += big("TOC TOC", 1300, 300, 50, T5[k].c, 1);
  });
  // progress of traps
  items.forEach((it, i) => { const done = t > S(it[0]) + 1.2; o += `<circle cx="${1560 + i * 80}" cy="300" r="26" fill="${done ? GREEN : "#2a3140"}" stroke="#000" stroke-width="4"/>${done ? `<path d="M ${1548 + i * 80} 300 l 8 9 l 16 -18" stroke="#07080b" stroke-width="6" fill="none"/>` : ""}`; });
  return o;
}
function results(t) {
  let o = "";
  if (t < S(33) - 0.1) {
    const wk2 = t > S(32) - 0.1;
    o += `<rect width="${W}" height="${H}" fill="#0a0d16"/><rect y="820" width="${W}" height="260" fill="#07080b"/>`;
    o += door(960, 560, 0, 1, t, "");
    KEYS.forEach((k, i) => {
      if (!wk2) o += th(k, 1250 + i * 130, 600 + Math.sin(t * 6 + i) * 10, 0.6, -1, 0.95, t + i, { reach: Math.sin(t * 4 + i) > 0.6 ? 0.5 : 0 });
      else o += th(k, lerp(1250 + i * 130, 2100, seg(t, S(32) + 0.3 + i * 0.25, S(32) + 1.6 + i * 0.25)), 600, 0.6, 1, 1, t + i, { shrug: 0.6 });
    });
    o += big(wk2 ? "SEMANA 2" : "SEMANA 1", 960, 150, 90, wk2 ? GREEN : GOLD, 1, pop(t, wk2 ? S(32) : S(31)));
    if (!wk2 && Math.sin(t * 6) > 0.3) o += `<g transform="translate(960 560) rotate(${Math.sin(t * 40) * 1.2}) translate(-960 -560)"></g>` + big("toc toc", 1300, 360, 44, "#8f99a3", 0.8);
  } else if (t < S(34) - 0.1) {
    let w = roomBg(1, 0.6) + josephFront(t, { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { smile: 12, look: [0, 8], lid: blink(t, 0.04) } });
    o += room(w, -300, 60, 1.05) + `<ellipse cx="500" cy="420" rx="700" ry="520" fill="url(#gWarm)" opacity="0.25" style="mix-blend-mode:screen"/>`;
    o += big("30 DIAS DEPOIS", 1460, 180, 84, GOLD, 1, pop(t, S(33)));
    const it = [[S(33) + 1.6, "acorda antes do despertador"], [S(33) + 3.6, "termina o capítulo"], [S(33) + 5.2, "dorme às 23:00"]];
    it.forEach(([a, s], i) => { const p = pop(t, a); if (p > 0) o += `<g transform="translate(1460 ${360 + i * 140}) scale(${p})"><rect x="-300" y="-50" width="600" height="100" rx="50" fill="#12151c" stroke="${GREEN}" stroke-width="5"/><g transform="translate(-250 0) scale(0.35)">${ICON.check(GREEN)}</g>${txt(s, 30, 0, 40, CREAM)}</g>`; });
    o += battery2(1460, 860, 1, 1.0);
  } else {
    o += `<rect width="${W}" height="${H}" fill="#0a0d16"/><rect y="820" width="${W}" height="260" fill="#07080b"/>` + door(960, 560, 0, 1, t, "");
    o += `<ellipse cx="960" cy="520" rx="200" ry="300" fill="${GOLD}" opacity="${0.12 + 0.05 * Math.sin(t * 2)}" style="mix-blend-mode:screen"/>`;
    o += big("A PORTA FECHADA", 960, 150, 90, GREEN, 1, pop(t, S(34) + 2.6));
  }
  return o;
}
function finale(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/><rect y="820" width="${W}" height="260" fill="#090a0e"/>`;
  if (t < S(37) - 0.1) {
    KEYS.forEach((k, i) => {
      const x = 260 + i * 350, closed = t > S(36) + 3.4 && i === 2 ? seg(t, S(36) + 3.4, S(36) + 4.0) : 0;
      o += `<g transform="translate(${x} 560) scale(0.62) translate(${-x} -560)">${door(x, 560, 0.75 * (1 - closed), closed, t, "")}</g>`;
      o += th(k, x + 40, 560, 0.55, -1, closed > 0.5 ? 1 - seg(t, S(36) + 4.0, S(36) + 4.6) : 1, t + i, { look: -4 });
      o += txt(T5[k].name.replace("LADRÃO ", ""), x, 830, 36, T5[k].c);
    });
    o += big(t < S(36) ? "QUANTOS ENTRARAM HOJE?" : "ESCOLHE UMA PORTA. E FECHA.", 960, 150, 80, t < S(36) ? CREAM : GOLD, 1, pop(t, t < S(36) ? S(35) : S(36)));
  } else {
    o += room(josephFront(t, { armsUp: seg(t, S(37), S(37) + 0.6), face: { happy: 1, smile: 12 } }), -480, 120, 0.9);
    o += `<g transform="translate(1300 420) scale(${pop(t, S(37) + 0.6) * (1 - 0.06 * dip(t, S(37) + 1.6, S(37) + 1.7, S(37) + 1.8, S(37) + 1.95))})"><rect x="-330" y="-85" width="660" height="170" rx="85" fill="${RED}" stroke="#000" stroke-width="8"/>${txt("INSCREVA-SE", 0, 0, 90, "#fff")}</g>`;
    KEYS.forEach((k, i) => { o += th(k, 1000 + i * 150, 820, 0.45, -1, seg(t, S(37) + 2.4, S(37) + 3.0), t + i); });
    o += txt("eles voltam amanhã. o Joseph também.", 1300, 640, 48, "#cfd8e3", seg(t, S(37) + 2.4, S(37) + 3.0));
  }
  return o;
}
function captions2(t) {
  let o = "";
  if (window.THUMB) return o;
  for (const L of window.TL.lines) {
    const a = L.start - 0.1, b = L.end + 0.35;
    if (t < a || t > b) continue;
    const op = seg(t, a, a + 0.15) * (1 - seg(t, b - 0.2, b));
    let lines = [L.text];
    if (L.text.length > 62) { const mid = L.text.length / 2; let best = -1; for (let i = 0; i < L.text.length; i++) if (L.text[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i; lines = [L.text.slice(0, best), L.text.slice(best + 1)]; }
    const longest = Math.max(...lines.map(x => x.length)), fs = Math.min(54, 1780 / (longest * 0.47));
    lines.forEach((ln, i) => { o += `<text class="hand" x="960" y="${lines.length > 1 ? 985 + i * (fs + 8) - (fs + 8) * 0.5 : 1000}" font-size="${fs}" text-anchor="middle" fill="#f4efe6" stroke="#000" stroke-width="10" paint-order="stroke" opacity="${op}">${esc(ln)}</text>`; });
  }
  return o;
}

function render(t) {
  const end = window.TL.duration;
  let o = "";
  if (t < E(3) + 0.6) o += intro(t);
  else if (t < S(4) - 0.4) o += titleScreen(t, E(3) + 0.6);
  else if (t < S(7) - 0.8) o += morning(t);
  else if (t < S(11) - 0.8) o += study(t);
  else if (t < S(14) - 0.8) o += lunch(t);
  else if (t < S(17) - 0.8) o += nightFeed(t);
  else if (t < S(20) - 1.0) o += lateNight(t);
  else if (t < S(25) - 0.6) o += lair(t);
  else if (t < S(27) - 0.6) o += plan(t);
  else if (t < S(31) - 0.8) o += traps(t);
  else if (t < S(35) - 0.8) o += results(t);
  else if (t < E(37) + 1.5) o += finale(t);
  else { const a = E(37) + 1.5; o += `<rect width="${W}" height="${H}" fill="#000"/>` + txt("JOSEPH", 960, 500, 200, CREAM, seg(t, a, a + 0.6)) + txt("Melhore 1% por dia.", 960, 680, 70, GREEN, seg(t, a + 0.8, a + 1.4)); }
  o += `<rect width="${W}" height="${H}" fill="url(#gVignette)" opacity="0.7"/>`;
  for (const [x, y] of [[S(4) - 0.4, 0], [S(7) - 0.8, 0], [S(11) - 0.8, 0], [S(14) - 0.8, 0], [S(17) - 0.8, 0], [S(20) - 1.0, 0], [S(25) - 0.6, 0], [S(27) - 0.6, 0], [S(31) - 0.8, 0], [S(35) - 0.8, 0]]) o += `<rect width="${W}" height="${H}" fill="#000" opacity="${dip(t, x - 0.3, x, x, x + 0.3)}"/>`;
  o += captions2(t);
  o += `<rect width="${W}" height="${H}" fill="#000" opacity="${Math.max(1 - seg(t, 0, 0.5), seg(t, end - 0.6, end))}"/>`;
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
