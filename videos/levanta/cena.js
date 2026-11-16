// LEVANTA. — a corrida de 10 km do Joseph (vídeo longo, 1920x1080)
const W = 1920, H = 1080, REDC = "#e5484d", FLAME = "#ff9f1c", SKY = "#7fb2e5";
const JX = 760, GY = 840;                       // Joseph's screen x and ground line in the street
const FLAME_DEFS = `<defs><linearGradient id="gFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe066"/><stop offset="60%" stop-color="#ff9f1c"/><stop offset="100%" stop-color="#ff5d2e"/></linearGradient>` +
  `<radialGradient id="gGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffb347" stop-opacity="0.9"/><stop offset="100%" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>`;
const cam2 = (cx, cy, s, inner) => `<g transform="translate(960 540) scale(${s}) translate(${-cx} ${-cy})">${inner}</g>`;
const room = (inner, dx = 0, dy = 0, s = 1) => `<g transform="translate(${960 + dx} ${540 + dy}) scale(${s}) translate(-960 -540)">${inner}</g>`;
const dark = (op, c = "#000") => op > 0 ? `<rect width="${W}" height="${H}" fill="${c}" opacity="${op}"/>` : "";
const black = () => `<rect width="${W}" height="${H}" fill="#0b0c10"/>`;

// ---------- the Motivação flame ----------
function drawFlame(F, t) {
  if (!F || F.size <= 0.01) return "";
  const s = F.size, flick = Math.sin(t * 17) * 6 + Math.sin(t * 29) * 3 + (F.sputter ? Math.sin(t * 41) * 10 : 0);
  let o = `<g transform="translate(${F.x} ${F.y}) scale(${s})">`;
  o += `<ellipse cx="0" cy="0" rx="150" ry="150" fill="url(#gGlow)" opacity="${0.55 * F.bright}" style="mix-blend-mode:screen"/>`;
  if (F.cheer) {
    const w = Math.sin(t * 14) * 18;
    for (const sg of [-1, 1]) o += `<path d="M ${36 * sg} 10 Q ${66 * sg} ${-20 + w * sg} ${70 * sg} ${-50 + w * sg}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M ${36 * sg} 10 Q ${66 * sg} ${-20 + w * sg} ${70 * sg} ${-50 + w * sg}" fill="none" stroke="${FLAME}" stroke-width="7" stroke-linecap="round"/>`;
  }
  const tip = -95 + flick;
  o += `<path d="M ${flick * 0.6} ${tip} C 30 -50 50 -10 48 22 A 48 48 0 0 1 -48 22 C -50 -10 -28 -50 ${flick * 0.6} ${tip} Z" fill="url(#gFlame)" stroke="${INK}" stroke-width="6" opacity="${cl(F.bright)}"/>`;
  o += `<path d="M ${flick * 0.3} ${tip + 50} C 16 -20 24 0 22 22 A 22 22 0 0 1 -22 22 C -24 0 -12 -20 ${flick * 0.3} ${tip + 50} Z" fill="#fff3b0" opacity="${0.8 * cl(F.bright)}"/>`;
  const ey = 8;
  if (F.mood === "happy") {
    o += `<path d="M -22 ${ey} q 8 -10 16 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M 6 ${ey} q 8 -10 16 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    o += `<path d="M -16 ${ey + 14} Q 0 ${ey + 36} 16 ${ey + 14} Z" fill="#7a1f12" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  } else {
    o += `<circle cx="-13" cy="${ey}" r="5" fill="${INK}"/><circle cx="13" cy="${ey}" r="5" fill="${INK}"/>`;
    o += `<path d="M -10 ${ey + 24} Q 0 ${ey + 18} 10 ${ey + 24}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return o + `</g>`;
}

// ---------- rain (landscape) ----------
function rainL(t, amt, n = 110) {
  if (amt <= 0) return "";
  let o = `<g opacity="${amt}" stroke="#9fb6d0" stroke-width="3.5" stroke-linecap="round">`;
  for (let i = 0; i < n; i++) {
    const x = hash(i) * (W + 300) - 100, sp = 1500 + hash(i + 9) * 600, y = ((t * sp + hash(i + 3) * H) % (H + 200)) - 100;
    o += `<line x1="${x}" y1="${y}" x2="${x - 16}" y2="${y + 56}" opacity="${0.4 + 0.5 * hash(i + 7)}"/>`;
  }
  return o + `</g>`;
}
const rainTint = r => r > 0 ? `<rect x="-600" y="-400" width="3120" height="1900" fill="#1c2738" opacity="${0.6 * r}"/>` : "";

// ---------- Joseph's running: speed table (world px/s) integrated once ----------
let RUN = null;
function speedTable() {
  return [[0, 0], [S(3) - 0.2, 0], [S(3) + 0.3, 520], [S(3) + 2.4, 480], [S(3) + 3.4, 0],
    [S(6) - 0.9, 0], [S(6) - 0.4, 560], [S(7) + 0.6, 560], [S(7) + 2.6, 220], [S(7) + 3.6, 0],
    [S(12) + 3.0, 0], [S(12) + 3.3, 200], [S(13) - 0.4, 200], [S(13) - 0.3, 0],
    [S(15) - 0.8, 0], [S(15) - 0.6, 260], [S(16) - 0.4, 260], [S(16), 430], [S(17) - 0.4, 430], [S(17), 600], [S(18) - 0.4, 600], [S(18) - 0.3, 0],
    [S(21) - 0.2, 0], [S(21) + 0.6, 600], [S(22) + 2.2, 600], [S(22) + 3.4, 230], [S(23) - 1.2, 200], [S(23) - 0.4, 0],
    [S(29) - 0.2, 0], [S(30), 110], [S(30) + 1.4, 220], [S(30) + 2.7, 560], [S(32) - 0.6, 560], [S(32) + 0.4, 300], [S(33) - 1.0, 300], [S(33) + 0.8, 0], [999, 0]];
}
function runAt(t) {
  if (!RUN) {
    const tb = speedTable(), dt = 1 / 60, n = Math.ceil((window.TL.duration + 2) / dt);
    RUN = { d: new Float64Array(n + 1), p: new Float64Array(n + 1), dt };
    for (let i = 1; i <= n; i++) {
      const v = kf((i - 1) * dt, tb);
      RUN.d[i] = RUN.d[i - 1] + v * dt;
      RUN.p[i] = RUN.p[i - 1] + (v > 1 ? v / 250 : 0) * 2 * Math.PI * dt;
    }
    RUN.tb = tb;
  }
  const i = cl(Math.floor(t / RUN.dt), 0, RUN.d.length - 1);
  const v = kf(t, RUN.tb);
  return { dist: RUN.d[i], phase: RUN.p[i], v, gait: cl(v / 300) };
}
// world objects pinned to the road: at time ta the object sits at screen x = xa
const pinned = (t, ta, xa) => xa - (runAt(t).dist - runAt(ta).dist);

// ---------- poses ----------
const STAND = { knee: [0, 115], foot: [0, 230], footAng: 0 };
const KNEEL1 = { knee: [95, 45], foot: [-15, 58], footAng: -75 };
const KNEEL2 = { knee: [80, 50], foot: [-30, 58], footAng: -75 };
const ONEKNEE = { knee: [90, 110], foot: [92, 228], footAng: 0 };
const lerpLeg = (a, b, k) => ({ knee: lerp2(a.knee, b.knee, k), foot: lerp2(a.foot, b.foot, k), footAng: lerp(a.footAng, b.footAng, k) });
// k: 0 = standing, 1 = on the ground (hands down); passes through one knee on the way
function downLegs(k) {
  if (k <= 0) return null;
  if (k < 0.5) { const u = k / 0.5; return [lerpLeg(STAND, ONEKNEE, u), lerpLeg(STAND, KNEEL2, u)]; }
  const u = (k - 0.5) / 0.5; return [lerpLeg(ONEKNEE, KNEEL1, u), KNEEL2];
}
function joseph(t, over = {}) {
  const R = runAt(t);
  return Object.assign({ x: JX, dir: 1, groundY: GY, gait: R.gait, phase: R.phase, lean: R.v > 300 ? 9 : 3, look: [6, 0], lid: blink(t, 0.08), browUp: 0, browAng: 0, browSad: 0, pant: 0, smile: 4 }, over);
}
// apply the fall/rise amount k (0 standing … 1 down)
function fallen(P, k, t) {
  if (k <= 0) return P;
  return Object.assign(P, { legs: downLegs(k), gait: 0, lean: lerp(P.lean, 52, k), arm: k > 0.5 ? [lerp(0, 66, (k - 0.5) * 2), lerp(12, 66, (k - 0.5) * 2)] : null, look: [3, 9], smile: -4, pant: k > 0.6 ? 0.5 : P.pant });
}

// ---------- the other runners ----------
const RUNNERS = [
  { c: { skin: "#e0b48c", skinD: "#c49670", hood: "#3e63dd", hoodD: "#2c4aa8", hair: "#3a2414" }, bib: "118", x0: 1300, lane: 0 },
  { c: { skin: "#7a4a2c", skinD: "#633a20", hood: "#e5484d", hoodD: "#b13438", hair: "#120c08" }, bib: "305", x0: 1750, lane: 1 },
  { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#ffc53d", hoodD: "#cc9a20", hair: "#8a5a2b" }, bib: "076", x0: 260, lane: 0 },
  { c: { skin: "#c68b5e", skinD: "#a97046", hood: "#8b6ad8", hoodD: "#6a4fb0", hair: "#1b120c" }, bib: "512", x0: -2300, lane: 1 },
  { c: { skin: "#e0b48c", skinD: "#c49670", hood: "#30a46c", hoodD: "#23804f", hair: "#1b120c" }, bib: "233", x0: -3100, lane: 0 },
  { c: { skin: "#8e5a3a", skinD: "#744628", hood: "#ff6fae", hoodD: "#cc4f88", hair: "#120c08" }, bib: "461", x0: -3900, lane: 1 },
  { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#4fd1ff", hoodD: "#2fa3cc", hair: "#2a1a12" }, bib: "098", x0: -4800, lane: 0 },
];
const RACE_V = 600;
function runner(t, i, lane, scale) {
  const r = RUNNERS[i];
  if (r.lane !== lane) return "";
  const go = S(21) - 0.2;
  const rel = t < go ? 0 : RACE_V * Math.min(t - go, 0.8) * 0.5 + RACE_V * Math.max(0, t - go - 0.8);   // their own distance
  const x = r.x0 + rel - (runAt(t).dist - runAt(go).dist);
  if (x < -300 || x > 2300) return "";
  const v = t < go ? 0 : RACE_V;
  const P = { x, dir: 1, groundY: lane ? 800 : 880, gait: cl(v / 300), phase: (t - go) * 2 * Math.PI * v / 250 + i * 1.3, lean: v ? 9 : 3, look: [6, 0], lid: blink(t, 0.08, i), browUp: 0, browAng: 0.3, browSad: 0, pant: 0, smile: 3, c: r.c, bib: r.bib, pants: "#2c2c34", pantsD: "#202027" };
  const gy = P.groundY;
  return `<g transform="translate(${x} ${gy}) scale(${scale}) translate(${-x} ${-gy})">${sidePerson(P, t)}</g>`;
}

// ---------- road scenery ----------
function kmSign(x, label, col = GOLD) {
  return `<g transform="translate(${x} 0)"><rect x="-8" y="560" width="16" height="230" fill="#4a4f5a" stroke="${INK}" stroke-width="4"/><rect x="-90" y="470" width="180" height="110" rx="12" fill="${col}" stroke="${INK}" stroke-width="7"/><text class="sans" x="0" y="545" font-size="56" font-weight="800" text-anchor="middle" fill="${INK}">${label}</text></g>`;
}
function startArch(x, label, col, clock) {
  let o = `<g transform="translate(${x} 0)"><rect x="-430" y="120" width="40" height="740" fill="#2a2f3a" stroke="${INK}" stroke-width="6"/><rect x="390" y="120" width="40" height="740" fill="#2a2f3a" stroke="${INK}" stroke-width="6"/>`;
  o += `<rect x="-450" y="62" width="900" height="120" rx="14" fill="${col}" stroke="${INK}" stroke-width="8"/><text class="hand" x="${clock ? -100 : 0}" y="147" font-size="84" text-anchor="middle" fill="${INK}">${label}</text>`;
  if (clock) o += `<rect x="220" y="84" width="210" height="76" rx="10" fill="#07080b" stroke="${INK}" stroke-width="5"/><text class="sans" x="325" y="136" font-size="40" font-weight="800" text-anchor="middle" fill="${REDC}">${clock}</text>`;
  return o + `</g>`;
}
function checkerLine(x) { let o = ""; for (let i = 0; i < 8; i++) o += `<rect x="${x - 20 + (i % 2) * 20}" y="${840 + i * 30}" width="20" height="30" fill="${i % 2 ? "#fff" : INK}"/>`; return o; }
// a road scene: q = {rain, sunrise, dim, P, flame, extra(t), front(t)}
function road(t, q = {}) {
  const R = runAt(t);
  let w = streetBg(R.dist);
  if (q.sunrise) w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#ff8a3d" opacity="${0.16 * q.sunrise}" style="mix-blend-mode:screen"/>`;
  w += rainTint(q.rain || 0);
  if (q.back) w += q.back(t);
  w += sidePerson(q.P || joseph(t), t);
  if (q.flame) w += drawFlame(q.flame, t);
  if (q.front) w += q.front(t);
  let o = cam2(q.cx || 960, q.cy || 560, q.zoom || 1, w);
  o += rainL(t, q.rain || 0);
  o += dark(q.dim || 0);
  return o;
}

// ---------- HUD / labels ----------
function chip(t, a, label, col = CREAM, x = 960, y = 150, size = 64) {
  const p = pop(t, a); if (p <= 0) return "";
  const w = label.length * size * 0.52 + 90;
  return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.8}" width="${w}" height="${size * 1.6}" rx="${size * 0.8}" fill="#07080b" opacity="0.88" stroke="${col}" stroke-width="5"/>${txt(label, 0, 0, size, col)}</g>`;
}
function hudKm(t, label, sub, col = GOLD) {
  return `<g transform="translate(70 70)"><rect width="${Math.max(label.length * 34 + 60, (sub || "").length * 19 + 60, 320)}" height="${sub ? 150 : 100}" rx="24" fill="#07080b" opacity="0.85" stroke="${col}" stroke-width="5"/><text class="sans" x="30" y="70" font-size="54" font-weight="800" fill="${col}">${label}</text>${sub ? `<text class="hand" x="30" y="125" font-size="38" fill="#cfd8e3">${sub}</text>` : ""}</g>`;
}
function progressBar(t, a, frac, label) {
  const k = seg(t, a, a + 0.4); if (k <= 0) return "";
  const f = frac * seg(t, a + 0.4, a + 1.4);
  return `<g opacity="${k}" transform="translate(360 250)"><rect x="-20" y="-80" width="1240" height="200" rx="30" fill="#07080b" opacity="0.85"/><rect x="20" y="20" width="1160" height="56" rx="28" fill="#2a2f3a" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="20" y="20" width="${Math.max(56, 1160 * f)}" height="56" rx="28" fill="${REDC}"/>${txt(label, 600, -24, 60, CREAM)}</g>`;
}
function thought(x, y, s, k) {
  if (k <= 0) return "";
  return `<g opacity="${k}" transform="translate(${x} ${y})"><circle cx="-150" cy="150" r="16" fill="#f4efe6" stroke="${INK}" stroke-width="5"/><circle cx="-110" cy="105" r="26" fill="#f4efe6" stroke="${INK}" stroke-width="5"/>` +
    `<rect x="-90" y="-80" width="${s.length * 25 + 80}" height="130" rx="65" fill="#f4efe6" stroke="${INK}" stroke-width="6"/><text class="hand" x="${-90 + (s.length * 25 + 80) / 2}" y="2" font-size="46" text-anchor="middle" fill="${INK}">${s}</text></g>`;
}

// ---------- calendar: cols x rows, nX days marked (the last one animates), chain links between Xs ----------
function calendar(x, y, cell, cols, rows, nX, t, o = {}) {
  const w = cols * cell, h = rows * cell;
  let g = `<g transform="translate(${x} ${y})"><rect x="-24" y="-90" width="${w + 48}" height="${h + 114}" rx="20" fill="#f6f1e6" stroke="${INK}" stroke-width="7"/>`;
  g += `<rect x="-24" y="-90" width="${w + 48}" height="70" rx="20" fill="${REDC}" stroke="${INK}" stroke-width="7"/><text class="hand" x="${w / 2}" y="-38" font-size="44" text-anchor="middle" fill="#fff">${o.title || "90 DIAS"}</text>`;
  const n = cols * rows, full = Math.floor(nX), frac = nX - full;
  for (let i = 0; i < n; i++) {
    const cx = (i % cols) * cell, cy = Math.floor(i / cols) * cell;
    g += `<rect x="${cx + 3}" y="${cy + 3}" width="${cell - 6}" height="${cell - 6}" rx="6" fill="${o.bad && o.bad.includes(i) ? "#dfe6ee" : "#fff"}" stroke="#c9c2b4" stroke-width="2"/>`;
    if (cell >= 60) g += `<text class="sans" x="${cx + 10}" y="${cy + 24}" font-size="16" fill="#8a8478">${i + 1}</text>`;
    if (o.bad && o.bad.includes(i) && cell >= 50) g += `<g transform="translate(${cx + cell - 18} ${cy + 20}) scale(0.5)"><ellipse cx="0" cy="0" rx="22" ry="12" fill="#9fb6d0"/><line x1="-8" y1="12" x2="-12" y2="24" stroke="#5a7fa8" stroke-width="4"/><line x1="6" y1="12" x2="2" y2="24" stroke="#5a7fa8" stroke-width="4"/></g>`;
    let k = i < full ? 1 : i === full ? frac : 0;
    if (o.miss && o.miss.includes(i)) { if (k > 0) g += `<circle cx="${cx + cell / 2}" cy="${cy + cell / 2}" r="${cell * 0.3}" fill="none" stroke="#8a8478" stroke-width="4" stroke-dasharray="6 6"/>`; continue; }
    if (k > 0) {
      const m = cell * 0.22, a1 = cl(k * 2), a2 = cl(k * 2 - 1);
      const X0 = cx + m, Y0 = cy + m, X1 = cx + cell - m, Y1 = cy + cell - m;
      g += `<line x1="${X0}" y1="${Y0}" x2="${lerp(X0, X1, a1)}" y2="${lerp(Y0, Y1, a1)}" stroke="${o.col || REDC}" stroke-width="${cell * 0.12}" stroke-linecap="round"/>`;
      if (a2 > 0) g += `<line x1="${X1}" y1="${Y0}" x2="${lerp(X1, X0, a2)}" y2="${lerp(Y0, Y1, a2)}" stroke="${o.col || REDC}" stroke-width="${cell * 0.12}" stroke-linecap="round"/>`;
    }
  }
  if (o.chain) for (let i = 0; i + 1 < full; i++) {
    if ((i + 1) % cols === 0) continue;
    const cx = (i % cols) * cell + cell, cy = Math.floor(i / cols) * cell + cell / 2;
    g += `<ellipse cx="${cx}" cy="${cy}" rx="${cell * 0.16}" ry="${cell * 0.09}" fill="none" stroke="${GOLD}" stroke-width="${cell * 0.05}" opacity="${o.chain}"/>`;
  }
  return g + `</g>`;
}

// ---------- rule icons ----------
const ICON_R = {
  down: c => `<rect x="-90" y="-80" width="70" height="160" rx="8" fill="#5a606b" stroke="#000" stroke-width="6"/><rect x="20" y="40" width="70" height="40" rx="8" fill="${c}" stroke="#000" stroke-width="6"/><path d="M -20 -30 Q 30 -40 50 20" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M 34 10 L 52 28 L 66 4" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
  two: c => `<g transform="translate(-60 0) scale(0.75)">${ICON.cross("#8f99a3")}</g><g transform="translate(60 0) scale(0.75)">${ICON.cross(c)}</g><line x1="-120" y1="80" x2="120" y2="80" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`,
  chain: c => { let o = ""; for (let i = 0; i < 3; i++) o += `<ellipse cx="${-80 + i * 80}" cy="0" rx="52" ry="30" fill="none" stroke="#000" stroke-width="22"/><ellipse cx="${-80 + i * 80}" cy="0" rx="52" ry="30" fill="none" stroke="${c}" stroke-width="12"/>`; return o; },
};

// ---------- scenes ----------
function sIntro(t) {
  let o = black();
  o += drawFlame({ x: 960, y: 560, size: 2.6 * pop(t, 0.3, 0.5), bright: 1, mood: "happy", cheer: true }, t);
  o += txt("MOTIVAÇÃO", 960, 220, 130, FLAME, 1, pop(t, 0.9));
  return o;
}
function poster(x, y, s, t, a) {
  const p = pop(t, a); if (p <= 0) return "";
  let o = `<g transform="translate(${x} ${y}) scale(${s * p}) rotate(-3)"><rect x="-150" y="-200" width="300" height="400" rx="10" fill="#f6f1e6" stroke="${INK}" stroke-width="7"/>`;
  o += `<rect x="-150" y="-200" width="300" height="110" fill="${REDC}" stroke="${INK}" stroke-width="7"/><text class="hand" x="0" y="-125" font-size="54" text-anchor="middle" fill="#fff">CORRIDA</text>`;
  o += `<text class="sans" x="0" y="20" font-size="110" font-weight="800" text-anchor="middle" fill="${INK}">10K</text><text class="hand" x="0" y="100" font-size="40" text-anchor="middle" fill="#5a606b">inscrição ✓</text>`;
  o += `<circle cx="0" cy="-205" r="12" fill="${REDC}" stroke="${INK}" stroke-width="4"/></g>`;
  return o;
}
function sSignup(t) {
  const a = S(2) - 0.3;
  let w = roomBg(0.75, 0.15) + poster(1380, 300, 1, t, S(2) + 2.0);
  w += josephFront(t, { hR: HOLD.hR, hL: HOLD.hL, phone: { pc: HOLD.pc, held: 1, on: true, mode: "notif" }, face: { smile: 12, browUp: 8, look: [0, 10], lid: blink(t, 0.06) } });
  let o = room(w, -60, 300, 1.45);
  o += txt("FALTAM", 330, 190, 64, CREAM, 1, pop(t, S(2) + 4.0)) + txt("90 DIAS", 330, 290, 110, GOLD, 1, pop(t, S(2) + 4.4));
  return o;
}
function sFirstRun(t) {
  const stop = t > S(3) + 3.0;
  const sad = t > S(5) - 0.3;
  const P = joseph(t, stop ? { pant: sad ? 0 : 0.8, lean: sad ? 14 : 22, look: sad ? [3, 10] : [5, 6], browSad: sad ? 1 : 0.4, smile: sad ? -6 : 0, arm: [20, 30] } : { pant: t > S(3) + 1.6 ? 0.5 : 0 });
  let o = road(t, { P, dim: 0.25 * seg(t, S(5) - 0.3, S(5) + 0.5), sunrise: 0.4 });
  if (t > S(3) + 2.8 && t < S(4)) o += txt("SEM AR.", 1350, 300, 110, REDC, 1, pop(t, S(3) + 2.9));
  if (t > S(4) - 0.2 && t < S(5) - 0.2) o += progressBar(t, S(4) - 0.2, 0.05, "500 m de 10.000 m");
  if (t > S(5) - 0.2) o += thought(1100, 260, "talvez não seja pra mim...", seg(t, S(5) - 0.1, S(5) + 0.4));
  return o;
}
function sTitle(t, a) {
  let o = black();
  o += titleCard(t, a, "LEVANTA.", GREEN, 220);
  return o;
}
function sWeek1(t) {
  const leave = seg(t, S(7) + 0.4, S(7) + 2.6);
  const F = { x: lerp(JX + 260, 1900, leave) + Math.sin(t * 3) * 14, y: lerp(380, -150, leave) + Math.sin(t * 5) * 12, size: 0.9, bright: 1, mood: leave > 0.05 ? "bye" : "happy", cheer: true };
  const P = joseph(t, { smile: t < S(7) + 1.0 ? 10 : 0, look: leave > 0.05 ? [6, -8] : [6, 0], browSad: seg(t, S(7) + 1.2, S(7) + 2.0) * 0.8 });
  let o = road(t, { P, flame: t < S(7) + 3.0 ? F : null, sunrise: 1 });
  // earbuds
  o += chip(t, S(6) - 0.2, "SEMANA 1", GREEN, 1500, 150);
  if (inR(t, S(6) + 4.2, S(7) - 0.2)) {
    const a = S(6) + 4.2;
    o += dark(0.9 * dip(t, a, a + 0.05, a + 0.1, a + 0.35), "#fff");
    o += `<g transform="translate(1450 520) rotate(6) scale(${pop(t, a + 0.2)})"><rect x="-150" y="-190" width="300" height="380" rx="12" fill="#14161a" stroke="${INK}" stroke-width="8"/><rect x="-130" y="-160" width="260" height="300" rx="6" fill="#ffd79a"/><circle cx="0" cy="-20" r="60" fill="${JOSEPH.skin}" stroke="${INK}" stroke-width="5"/><path d="M -60 -40 C -60 -100 60 -100 60 -40 C 30 -60 -30 -60 -60 -40 Z" fill="${JOSEPH.hair}"/><path d="M -25 10 Q 0 30 25 10" fill="none" stroke="${INK}" stroke-width="5"/><text class="hand" x="0" y="120" font-size="40" text-anchor="middle" fill="${INK}">#foco</text></g>`;
  }
  if (t > S(7) - 0.1) o += txt("MOTIVAÇÃO É VISITA.", 1420, 420, 84, FLAME, 1, pop(t, S(7)));
  if (t > S(7) + 2.0) o += txt("E VISITA VAI EMBORA.", 1420, 530, 64, CREAM, 1, pop(t, S(7) + 2.0));
  return o;
}
function sBadWeeks(t) {
  const a = S(8), b2 = a + 2.4, b3 = a + 4.9;
  let o;
  if (t < b2) {
    o = room(roomBg(0.35, 0) + josephFront(t, { face: { look: [-10, -2], browSad: 1, smile: -4, lid: blink(t, 0.15) } }), 200, 300, 1.45);
    o += `<clipPath id="win"><rect x="${(260 - 960) * 1.45 + 1160}" y="${(200 - 540) * 1.45 + 840}" width="${360 * 1.45}" height="${360 * 1.45}"/></clipPath><g clip-path="url(#win)">${rainL(t, 1, 160)}</g>`;
    o += chip(t, a - 0.3, "SEMANA 2: CHUVA", ACC, 1350, 150);
  } else if (t < b3) {
    o = room(roomBg(0.5, 0) + clockAt(1560, 260, 5 * 60 + 40) + josephFront(t, { face: { look: [0, 8], lid: 0.55, bags: 1, smile: -2, mouthOpen: dip(t, b2 + 0.6, b2 + 1.0, b2 + 1.6, b2 + 2.0) } }), 0, 300, 1.45);
    o += chip(t, b2 - 0.1, "SEMANA 3: DORMIU MAL", "#8b6ad8", 960, 150);
  } else {
    o = room(roomBg(0.2, 0) + josephFront(t, { blanket: true, hR: HOLD.hR, hL: HOLD.hL, phone: { pc: HOLD.pc, held: 1, on: true, mode: "feed" }, face: { look: [0, 12], lid: 0.35, smile: -2 } }), 0, 300, 1.45);
    o += chip(t, b3 - 0.1, "SEMANA 4: SEM VONTADE", "#8f99a3", 960, 150);
  }
  return o;
}
function sWrongMath(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += `<rect x="180" y="130" width="1100" height="640" rx="18" fill="#22352b" stroke="#6b4a2f" stroke-width="22"/>`;
  const ch = (s, x, y, size, a, col = "#e8efe6") => { const k = seg(t, a, a + 0.6); return k > 0 ? `<text class="hand" x="${x}" y="${y}" font-size="${size}" fill="${col}" opacity="${k}">${s}</text>` : ""; };
  o += ch("A CONTA ERRADA", 260, 250, 64, S(9) - 0.2, GOLD);
  o += ch("não dá pra fazer TUDO", 260, 420, 84, S(9) + 2.6);
  o += ch("= não faço NADA", 260, 560, 84, S(9) + 4.2);
  const x = seg(t, S(10) + 0.9, S(10) + 1.5);
  if (x > 0) o += `<path d="M 250 330 L ${lerp(250, 1200, x)} ${lerp(330, 640, x)}" stroke="${REDC}" stroke-width="22" stroke-linecap="round"/>`;
  o += room(josephFront(t, { face: { look: [-14, -4], browSad: t < S(10) + 0.9 ? 0.8 : 0, browAng: t > S(10) + 0.9 ? 0.6 : 0, smile: t > S(10) + 0.9 ? 2 : -4, lid: blink(t, 0.1) } }), 640, 140, 0.95);
  if (t > S(10) - 0.2) o += txt("QUASE...", 1500, 180, 90, REDC, 1, pop(t, S(10)));
  return o;
}
function sThreeRules(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += `<g transform="translate(960 560) rotate(-2) scale(${pop(t, S(11) - 0.4)})"><rect x="-420" y="-330" width="840" height="660" rx="20" fill="#f6f1e6" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 12; i++) o += `<line x1="-380" y1="${-200 + i * 48}" x2="380" y2="${-200 + i * 48}" stroke="#c6d4e6" stroke-width="3"/>`;
  o += `<text class="hand" x="0" y="-230" font-size="76" text-anchor="middle" fill="${REDC}">3 REGRAS</text>`;
  for (let i = 0; i < 3; i++) { const k = seg(t, S(11) + 0.6 + i * 0.4, S(11) + 0.9 + i * 0.4); o += `<g opacity="${k}"><circle cx="-300" cy="${-100 + i * 150}" r="40" fill="${[GOLD, ACC, GREEN][i]}" stroke="${INK}" stroke-width="5"/><text class="hand" x="-300" y="${-84 + i * 150}" font-size="54" text-anchor="middle" fill="${INK}">${i + 1}</text><line x1="-230" y1="${-90 + i * 150}" x2="330" y2="${-90 + i * 150}" stroke="#8a8478" stroke-width="6" stroke-dasharray="14 12"/></g>`; }
  return o + `</g>`;
}
function sRule1(t) {
  const a = S(12) - 0.3, demo = S(12) + 3.2, end = S(13) - 0.3;
  let o = road(t, { P: joseph(t, { pant: 0.3, smile: 4, browAng: 0.4 }), rain: 1 });
  if (t > demo) {
    o += `<g transform="translate(1450 330)"><rect x="-300" y="-150" width="600" height="300" rx="26" fill="#07080b" opacity="0.88"/>${txt("5 KM", -140, -60, 80, "#8f99a3")}<line x1="-230" y1="-60" x2="-50" y2="-60" stroke="${REDC}" stroke-width="12" opacity="${seg(t, demo + 0.6, demo + 1.0)}"/>${txt("1 KM ✓", 0, 70, 110, GOLD, 1, pop(t, demo + 1.4))}</g>`;
  }
  o += techCard(t, a, demo, end, 1, "DIMINUI. NÃO PULA.", "dia ruim = versão menor do treino", ICON_R.down(GOLD), GOLD);
  return o;
}
function weekStrip(x, y, marks, t, a, labelCol) {
  const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  let o = `<g transform="translate(${x} ${y})">`;
  marks.forEach((m, i) => {
    const p = pop(t, a + i * 0.18); if (p <= 0) return;
    const hl = labelCol && m === 0 ? labelCol : null;
    o += `<g transform="translate(${i * 150} 0) scale(${p})"><rect x="-62" y="-90" width="124" height="180" rx="16" fill="#12151c" stroke="${hl || "#3a4150"}" stroke-width="${hl ? 7 : 4}"/><text class="hand" x="0" y="-48" font-size="34" text-anchor="middle" fill="#cfd8e3">${days[i]}</text><g transform="translate(0 30) scale(0.6)">${m ? ICON.check(GREEN) : ICON.cross(hl || "#8f99a3")}</g></g>`;
  });
  return o + `</g>`;
}
function sRule2(t) {
  const a = S(13) - 0.3, demo = S(13) + 3.2, end = S(14) - 0.3;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    o += weekStrip(510, 330, [1, 1, 0, 1, 1, 1, 1], t, demo, null);
    o += txt("1 DIA = ACIDENTE", 960, 490, 64, GREEN, 1, pop(t, demo + 1.2));
    o += weekStrip(510, 700, [1, 1, 0, 0, 1, 1, 1], t, demo + 2.4, REDC);
    o += txt("2 SEGUIDOS = HÁBITO NOVO", 960, 860, 64, REDC, 1, pop(t, demo + 3.2));
  }
  o += techCard(t, a, demo, end, 2, "NUNCA 2 DIAS SEGUIDOS", "um dia é acidente. dois é hábito.", ICON_R.two(ACC), ACC);
  return o;
}
function sRule3(t) {
  const a = S(14) - 0.3, demo = S(14) + 2.0, end = S(15) - 0.6;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    const n = lerp(0, 14, seg(t, demo + 0.3, end - 0.4));
    o += calendar(560, 330, 115, 7, 3, n, t, { title: "NÃO QUEBRA A CORRENTE", chain: seg(t, S(14) + 3.3, S(14) + 3.9) });
  }
  o += techCard(t, a, demo, end, 3, "MARCA UM X. TODO DIA.", "e não quebra a corrente", ICON_R.chain(GREEN), GREEN);
  return o;
}
function sMontage(t) {
  const d40 = S(16) - 0.4, d60 = S(17) - 0.4;
  const rain = t > d40 && t < d60 ? 1 : 0;
  const P = joseph(t, { pant: t < d40 ? 0.6 : 0, smile: t > d60 ? 10 : 4, browAng: t > d40 ? 0.5 : 0 });
  let o = road(t, { P, rain, sunrise: t > d60 ? 1 : 0.3 });
  const [lab, sub, a] = t < d40 ? ["DIA 20", "2 km · devagar", S(15) - 0.4] : t < d60 ? ["DIA 40", "5 km · chuva", d40] : ["DIA 60", "só ia.", d60];
  o += `<g transform="translate(0 0) scale(${pop(t, a)})" transform-origin="200 140">${hudKm(t, lab, sub, t < d40 ? GOLD : t < d60 ? ACC : GREEN)}</g>`;
  const nX = t < d40 ? 20 : t < d60 ? 40 : 60;
  o += `<g transform="translate(1440 120) scale(0.42)">${calendar(0, 0, 70, 10, 9, nX - 1 + seg(t, a + 0.3, a + 1.0), t, {})}</g>`;
  return o;
}
function sBadDays(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  const bad = [3, 9, 15, 22, 27, 38, 44, 51, 63, 70, 77, 84];
  o += calendar(150, 180, 80, 10, 9, lerp(60, 89, seg(t, S(18) - 0.3, E(18))), t, { bad });
  o += txt("DIAS RUINS", 1450, 380, 84, "#9fb6d0", 1, pop(t, S(18) + 0.2)) + txt("continuaram ☁", 1450, 470, 60, CREAM, seg(t, S(18) + 0.5, S(18) + 0.9));
  o += txt("QUEM DECIDE?", 1450, 650, 84, GOLD, 1, pop(t, S(18) + 2.2)) + txt("ELE.", 1450, 760, 120, GREEN, 1, pop(t, S(18) + 3.0));
  return o;
}
function sDiscipline(t) {
  let o = black();
  o += txt("DISCIPLINA", 960, 330, 150, GREEN, 1, pop(t, S(19)));
  o += txt("decisão difícil", 620, 600, 80, "#8f99a3", seg(t, S(19) + 1.6, S(19) + 2.0));
  o += `<path d="M 900 600 L ${lerp(900, 1040, seg(t, S(19) + 2.4, S(19) + 2.9))} 600" stroke="${GOLD}" stroke-width="12" stroke-linecap="round"/>`;
  if (t > S(19) + 2.9) o += `<path d="M 1020 575 L 1048 600 L 1020 625" fill="none" stroke="${GOLD}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
  o += txt("AUTOMÁTICO", 1360, 600, 90, CREAM, 1, pop(t, S(19) + 3.0));
  return o;
}
function sDay90(t) {
  let o = black();
  const beat = 1 + 0.06 * Math.max(0, Math.sin(t * 7.5)) ** 8;
  o += txt("DIA 90", 960, 500, 220, GOLD, seg(t, S(20) - 2.6, S(20) - 2.0), beat);
  o += txt("dia da prova", 960, 660, 70, CREAM, seg(t, S(20) - 1.6, S(20) - 1.2));
  return o;
}
// the race: start line → km 5 → km 7 (rain, cramp) → fall → others pass → the voice
function raceState(t) {
  const rain = seg(t, S(22) + 0.9, S(22) + 2.0) * (1 - 0.7 * seg(t, S(31), S(32) + 1.0));
  const fall = seg(t, S(23) - 0.9, S(23) - 0.2) * (1 - seg(t, S(29) - 3.4, S(29) + 0.3));
  return { rain, fall };
}
function sRace(t, q = {}) {
  const { rain, fall } = raceState(t);
  const cramp = inR(t, S(22) + 2.2, S(23) - 0.2) ? 1 : 0;
  const det = t > S(28) + 1.5;
  let P = joseph(t, { bib: "090", pant: t > S(22) + 2.0 ? 0.6 : 0, smile: t < S(22) ? 6 : -2, browSad: cramp ? 1 : 0, lid: blink(t, cramp ? 0.3 : 0.08) });
  P = fallen(P, fall, t);
  if (det && fall > 0) Object.assign(P, { look: [8, -2], browAng: 1, browSad: 0, smile: -2 });
  if (t > S(29) && t < S(33) + 2) Object.assign(P, { browAng: 0.8, smile: t > S(33) - 1.6 ? 12 : 0, pant: 0.6 });
  const R = runAt(t);
  const back = tt => {
    let o = "";
    if (t < S(21) + 2.5) { const g = S(21) - 0.2, c = Math.ceil(g - t); o += startArch(pinned(t, g, 1100), t < g && c <= 3 ? String(c) : t < g + 1.0 && t >= g ? "VAI!" : "LARGADA", t >= g && t < g + 1.0 ? GREEN : GOLD); }
    o += kmSign(pinned(t, S(22) - 0.1, 1350), "KM 7");
    o += kmSign(pinned(t, S(31) + 0.2, 1100), "KM 8") + kmSign(pinned(t, S(31) + 1.8, 1100), "KM 9");
    const fx = pinned(t, S(33) - 1.6, JX + 40);
    if (fx < 2600) o += startArch(fx, "CHEGADA", GREEN, t > S(32) - 1 ? "1:14:32" : null);
    for (let i = 0; i < RUNNERS.length; i++) o += runner(tt, i, 1, 0.82);
    return o;
  };
  const front = tt => {
    let o = "";
    const fx = pinned(t, S(33) - 1.6, JX + 40);
    if (fx < 2600) o += checkerLine(fx);
    for (let i = 0; i < RUNNERS.length; i++) o += runner(tt, i, 0, 1.06);
    if (cramp) { const kx = JX + 30, ky = GY - 130; o += `<circle cx="${kx}" cy="${ky}" r="${40 + 12 * Math.sin(tt * 12)}" fill="${REDC}" opacity="0.45" style="mix-blend-mode:screen"/>`; }
    if (fall > 0.3 && rain > 0) for (let i = 0; i < 4; i++) { const k = ((tt * 0.9 + i / 4) % 1); o += `<ellipse cx="${JX + 120 + i * 50}" cy="${GY + 6}" rx="${10 + k * 50}" ry="${3 + k * 10}" fill="none" stroke="#9fb6d0" stroke-width="3" opacity="${(1 - k) * 0.7}"/>`; }
    return o;
  };
  let o = road(t, Object.assign({ P, rain, back, front }, q));
  return o;
}
function sRaceHud(t) {
  let o = "";
  if (t < S(21) - 0.2) {
    o += chip(t, S(20), "DIA 90 · A PROVA", GOLD, 340, 150, 52);
  }
  if (t > S(21) && t < S(22) - 0.1) { const km = 1 + Math.floor(4.99 * seg(t, S(21) + 0.4, E(21))); o += hudKm(t, `KM ${km}`, km === 5 ? "perfeito" : "ritmo bom", GREEN); }
  if (t > S(22) - 0.1 && t < S(23) + 2) o += hudKm(t, "KM 7", t > S(22) + 2.2 ? "a perna travou" : "começou a chover", REDC);
  return o;
}
function sVoice(t) {
  const k = seg(t, S(25) - 0.4, S(25) + 0.4) * (1 - seg(t, E(25) + 1.0, E(25) + 1.8));
  let o = sRace(t);
  o += dark(0.55 * k, "#12060a");
  const words = [["DESISTE.", S(25) + 1.0, 560, 330, 120], ["NINGUÉM VAI LEMBRAR.", S(25) + 2.2, 1300, 260, 70], ["VOCÊ JÁ FEZ MUITO.", S(25) + 3.6, 1250, 470, 70]];
  for (const [s, a, x, y, size] of words) {
    const op = seg(t, a, a + 0.5) * (1 - seg(t, E(25) + 0.8, E(25) + 1.6));
    if (op > 0) o += `<g transform="translate(${x + Math.sin(t * 7 + a) * 4} ${y})">${txt(s, 0, 0, size, "#b13438", op * (0.75 + 0.25 * Math.sin(t * 9 + a)))}</g>`;
  }
  return o;
}
function sCloseUp(t) {
  // zoom on the kneeling Joseph, puddle below
  const z = kf(t, [[S(26) - 0.5, 1.6], [E(26), 2.1]]);
  let o = sRace(t, { zoom: z, cx: JX + 120, cy: GY - 150 });
  return o;
}
function memoryPanel(t, a, b, inner, label) {
  const k = seg(t, a, a + 0.25) * (1 - seg(t, b - 0.25, b)); if (k <= 0) return "";
  const s = 0.62 + 0.03 * seg(t, a, b);
  return `<g opacity="${k}"><g transform="translate(960 520) scale(${s}) translate(-960 -540)"><rect x="-20" y="-20" width="1960" height="1120" fill="#f6f1e6"/><clipPath id="mem${Math.round(a * 10)}"><rect width="1920" height="1080"/></clipPath><g clip-path="url(#mem${Math.round(a * 10)})">${inner}<rect width="1920" height="1080" fill="#c89b5a" opacity="0.35" style="mix-blend-mode:multiply"/></g></g>${txt(label, 960, 110, 64, CREAM)}</g>`;
}
function sMemories(t) {
  let o = black();
  const a = S(27), b1 = a + 1.8, b2 = a + 3.7, b3 = E(27) + 0.6;
  const fakeRun = (tt, rain, hud) => { const P = { x: 820, dir: 1, groundY: GY, gait: 0.7, phase: tt * 9, lean: 7, look: [6, 0], lid: 0.08, browUp: 0, browAng: 0.5, browSad: 0, pant: 0.3, smile: 2 }; return cam2(960, 560, 1, streetBg(tt * 200) + rainTint(rain) + sidePerson(P, tt)) + rainL(tt, rain) + hud; };
  o += memoryPanel(t, a - 0.2, b1, fakeRun(t, 1, ""), "as manhãs de chuva");
  o += memoryPanel(t, b1, b2, fakeRun(t, 0, hudKm(t, "1 KM ✓", "dia ruim")), "os dias de 1 km só");
  o += memoryPanel(t, b2, b3, `<rect width="1920" height="1080" fill="#151a24"/>` + calendar(560, 190, 80, 10, 9, 90, t, {}), "os 90 X no calendário");
  return o;
}
function sResolve(t) {
  let o = sRace(t, { zoom: 2.0, cx: JX + 120, cy: GY - 170 });
  if (t > S(28) + 2.4) o += txt("NÃO NO KM 7.", 960, 200, 120, GOLD, 1, pop(t, S(28) + 2.5));
  return o;
}
function sRise(t) {
  const z = kf(t, [[S(29) - 3.8, 1.5], [S(29) + 0.5, 1.15], [S(30) + 1.0, 1]]);
  let o = sRace(t, { zoom: z, cx: lerp(JX + 120, 960, seg(t, S(29) - 3.8, S(30) + 1.0)), cy: lerp(GY - 170, 560, seg(t, S(29) - 3.8, S(30) + 1.0)) });
  if (inR(t, S(29) - 0.1, S(30) + 0.8)) o += txt("LEVANTOU.", 1420, 300, 150, GREEN, 1 - seg(t, S(30) + 0.3, S(30) + 0.8), pop(t, S(29)));
  if (t > S(30) - 0.2 && t < S(31) - 0.2) {
    const steps = [["ANDANDO", S(30)], ["DEVAGAR", S(30) + 1.3], ["CORRENDO", S(30) + 2.6]];
    steps.forEach(([s, a], i) => { if (t > a) o += txt(s, 1450, 200 + i * 100, 70, i === 2 ? GREEN : CREAM, 1, pop(t, a)); });
  }
  if (t > S(31) && t < S(32) - 0.1) o += hudKm(t, t < S(31) + 1.5 ? "KM 8" : "KM 9", "mancando. mas indo.", GOLD);
  if (t > S(33) + 1.4 && t < S(34) - 0.4) o += txt("CHEGOU.", 1450, 260, 150, GREEN, 1, pop(t, S(33) + 1.4));
  if (t > S(33) - 0.2 && t < S(34) - 0.4) o += chip(t, S(33) + 0.2, "entre os últimos", "#cfd8e3", 1500, 420, 50);
  return o;
}
function medal(t) {
  return `<path d="M 905 520 L 960 640 L 1015 520" fill="none" stroke="${REDC}" stroke-width="16"/><path d="M 905 520 L 960 640 L 1015 520" fill="none" stroke="#000" stroke-width="3" opacity="0.4"/>` +
    `<circle cx="960" cy="660" r="44" fill="${GOLD}" stroke="${INK}" stroke-width="7"/><text class="sans" x="960" y="676" font-size="36" font-weight="800" text-anchor="middle" fill="${INK}">10K</text>`;
}
function sFinish(t) {
  let w = streetBg(runAt(t).dist) + rainTint(0.3);
  w += startArch(960, "CHEGADA", GREEN, "1:14:32");
  let o = cam2(960, 560, 1, w) + dark(0.35);
  const P = josephFront(t, { armsUp: seg(t, S(34) + 2.0, S(34) + 2.6), face: { happy: t > S(34) + 1.8 ? 1 : 0, smile: 14, look: [0, 4], browSad: 0.3 } });
  o += room(P + medal(t), 0, 170, 1.15);
  for (let i = 0; i < 26; i++) { const k = ((t * 0.7 + hash(i)) % 1); o += `<ellipse cx="${840 + hash(i + 3) * 240}" cy="${330 + k * 300}" rx="4" ry="9" fill="#bfe3ff" opacity="${0.7 * (1 - k)}"/>`; }
  o += rainL(t, 0.35);
  return o;
}
function sQuotes(t) {
  let o = black();
  o += quotes(t, [["Ninguém lembra quem chegou primeiro.", S(35) - 0.2, S(36) - 0.3, "#cfd8e3", 76, 540]]);
  o += txt("Mas ele nunca esqueceu:", 960, 380, 70, "#cfd8e3", seg(t, S(36), S(36) + 0.4));
  o += txt("QUANDO CAIU,", 960, 560, 130, CREAM, 1, pop(t, S(36) + 2.4));
  o += txt("LEVANTOU.", 960, 730, 170, GREEN, 1, pop(t, S(36) + 3.4));
  return o;
}
function sYourKm7(t) {
  let w = `<rect x="-600" y="-400" width="3120" height="1900" fill="#0f141d"/><rect x="-600" y="780" width="3120" height="500" fill="#1b1d22"/>`;
  for (let i = -2; i < 8; i++) w += `<rect x="${i * 320 - (t * 60) % 320}" y="950" width="150" height="10" fill="#d9d4c7" opacity="0.25"/>`;
  w += `<g transform="translate(960 420) scale(1.6) translate(-960 -560)">${kmSign(960, "KM 7", GOLD)}</g>`;
  let o = cam2(960, 540, 1, w) + rainL(t, 0.8);
  o += txt("E O SEU?", 960, 190, 110, CREAM, 1, pop(t, S(37) + 0.6));
  o += txt("um dia em que você cai", 960, 900, 64, "#cfd8e3", seg(t, S(37) + 2.6, S(37) + 3.0));
  return o;
}
function sRecap(t) {
  let o = black();
  o += recapCards(t, S(38) - 0.4, S(39) - 0.6, "NESSE DIA, LEMBRA:", [
    [S(38) + 1.8, "DIMINUI", "mas não pula", ICON_R.down(GOLD), GOLD],
    [S(38) + 3.9, "2 DIAS", "nunca falha seguido", ICON_R.two(ACC), ACC],
    [S(38) + 5.5, "CORRENTE", "não quebra", ICON_R.chain(GREEN), GREEN]]);
  return o;
}
function sLevanta(t) {
  let o = black();
  const P = joseph(t, { x: 960, groundY: 900, gait: 0, lean: 4, look: [8, -2], browAng: 1, smile: -2 });
  fallen(P, 1 - seg(t, S(39) - 0.5, S(39) + 0.4), t);
  o += `<g opacity="0.9">${sidePerson(P, t)}</g>`;
  o += txt("E LEVANTA.", 960, 230, 200, GREEN, 1, pop(t, S(39)));
  return o;
}
function sCTA(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/><rect y="820" width="${W}" height="260" fill="#090a0e"/>`;
  o += room(josephFront(t, { armsUp: seg(t, S(40), S(40) + 0.6), face: { happy: 1, smile: 12 } }) + medal(t), -480, 120, 0.9);
  o += `<g transform="translate(1300 360) scale(${pop(t, S(40) + 0.4) * (1 - 0.06 * dip(t, S(40) + 1.6, S(40) + 1.7, S(40) + 1.8, S(40) + 1.95))})"><rect x="-330" y="-85" width="660" height="170" rx="85" fill="${RED}" stroke="#000" stroke-width="8"/>${txt("INSCREVA-SE", 0, 0, 90, "#fff")}</g>`;
  const k = pop(t, S(40) + 2.4);
  if (k > 0) o += `<g transform="translate(1300 640) scale(${k})"><rect x="-380" y="-90" width="760" height="180" rx="30" fill="#f6f1e6" stroke="${INK}" stroke-width="7"/><path d="M -300 90 L -330 150 L -240 90 Z" fill="#f6f1e6" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><rect x="-296" y="84" width="60" height="12" fill="#f6f1e6"/><text class="hand" x="0" y="-12" font-size="50" text-anchor="middle" fill="${INK}">Qual é o seu KM 7?</text><text class="hand" x="0" y="52" font-size="40" text-anchor="middle" fill="#5a606b">comenta aqui</text></g>`;
  return o;
}
function sEndScreen(t, a) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>`;
  const k = seg(t, a, a + 0.6);
  o += `<g opacity="${k}">`;
  const P = Object.assign({ x: 960, c: JOSEPH }, face({ smile: 10, lid: blink(t, 0.05), look: [6, 4] }));
  o += `<clipPath id="avL"><circle cx="420" cy="430" r="190"/></clipPath><circle cx="420" cy="430" r="198" fill="${GREEN}"/><g clip-path="url(#avL)"><rect x="200" y="220" width="440" height="440" fill="#2a3140"/>${room(personBack(P) + personHead(P, t), -540, -10, 0.95)}</g>`;
  o += txt("JOSEPH", 420, 720, 110, CREAM) + txt("Melhore 1% por dia.", 420, 820, 54, GREEN);
  o += `<rect x="900" y="250" width="860" height="484" rx="24" fill="#12151c" stroke="#3a4150" stroke-width="5" stroke-dasharray="18 14"/>`;
  o += txt("ASSISTA A SEGUIR", 1330, 180, 60, GOLD);
  o += `</g>`;
  return o;
}

// ---------- captions (two lines when long) ----------
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

// ---------- the cut list ----------
function cuts() {
  return [
    [S(2) - 0.3, sIntro], [S(3) - 0.4, sSignup], [E(5) + 0.5, sFirstRun], [S(6) - 0.6, t => sTitle(t, E(5) + 0.5)],
    [S(8) - 0.5, sWeek1], [S(9) - 0.5, sBadWeeks], [S(11) - 0.5, sWrongMath], [S(12) - 0.3, sThreeRules],
    [S(13) - 0.3, sRule1], [S(14) - 0.3, sRule2], [S(15) - 0.6, sRule3], [S(18) - 0.4, sMontage], [S(19) - 0.4, sBadDays],
    [S(20) - 2.8, sDiscipline], [S(20) - 0.2, sDay90], [S(25) - 0.5, t => sRace(t) + sRaceHud(t)], [S(26) - 0.5, sVoice],
    [S(27) - 0.2, sCloseUp], [S(28) - 0.3, sMemories], [S(29) - 3.8, sResolve], [S(34) - 0.4, sRise], [S(35) - 0.6, sFinish],
    [S(37) - 0.6, sQuotes], [S(38) - 0.4, sYourKm7], [S(39) - 0.6, sRecap], [S(40) - 0.6, sLevanta], [E(40) + 1.2, sCTA], [1e9, t => sEndScreen(t, E(40) + 1.2)],
  ];
}
let CUTS = null;
function render(t) {
  const end = window.TL.duration;
  CUTS = CUTS || cuts();
  let o = FLAME_DEFS;
  for (const [until, fn] of CUTS) if (t < until) { o += fn(t); break; }
  o += `<rect width="${W}" height="${H}" fill="url(#gVignette)" opacity="0.6"/>`;
  for (const [x] of CUTS.slice(0, -1)) o += `<rect width="${W}" height="${H}" fill="#000" opacity="${dip(t, x - 0.25, x, x, x + 0.25)}"/>`;
  o += captions2(t);
  o += `<rect width="${W}" height="${H}" fill="#000" opacity="${Math.max(1 - seg(t, 0, 0.5), seg(t, end - 0.6, end))}"/>`;
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
