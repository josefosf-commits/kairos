// Biblioteca dos SHORTS (1080x1920): câmera sobre o mundo 1920x1080 do rig, legendas em blocos,
// faixa de título, cartão final e o Joseph completo (mesa, celular, cama).
const SW = 1080, SH = 1920;
const BG = "#0d0f14", GREEN = "#30a46c", GOLD = "#ffc53d", CREAM = "#f4efe6";

// world (rig coordinates) -> vertical frame: world point (cx, cy) lands on screen (540, sy)
const cam = (cx, cy, s, inner, sy = 860) => `<g transform="translate(540 ${sy}) scale(${s}) translate(${-cx} ${-cy})">${inner}</g>`;
// clip a horizontal band of the screen
function band(id, y0, h, inner) {
  return `<clipPath id="${id}"><rect x="0" y="${y0}" width="${SW}" height="${h}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
}
const easeBack = k => { k = cl(k); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const pop = (t, a, d = 0.35) => t < a ? 0 : easeBack((t - a) / d);
// outlined hand-lettering, centred at (x, y), scaled around its own centre
function txt(s, x, y, size, col = CREAM, op = 1, sc = 1, extra = "") {
  if (op <= 0.001 || sc <= 0.001) return "";
  return `<g transform="translate(${x} ${y}) scale(${sc})" opacity="${op}"><text class="hand" x="0" y="${size * 0.33}" font-size="${size}" text-anchor="middle" fill="${col}" stroke="#000" stroke-width="${Math.max(8, size * 0.14)}" paint-order="stroke" stroke-linejoin="round" ${extra}>${s}</text></g>`;
}
function plainBg(c1 = "#151a24", c2 = BG) {
  return `<defs><linearGradient id="gPlain" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="${SW}" height="${SH}" fill="url(#gPlain)"/>`;
}
function topTag(title, accent) {
  if (window.THUMB) return "";
  return `<g><rect x="70" y="150" width="940" height="128" rx="34" fill="#07080b" opacity="0.88" stroke="${accent}" stroke-width="6"/>` +
    `<text class="hand" x="540" y="236" font-size="${title.length > 20 ? 58 : 72}" text-anchor="middle" fill="${CREAM}">${title}</text></g>`;
}
const vignette = () => `<rect width="${SW}" height="${SH}" fill="url(#gVignette)"/>`;
const blackout = op => op > 0 ? `<rect width="${SW}" height="${SH}" fill="#000" opacity="${op}"/>` : "";

// ---------- captions: each line is split into short chunks, timed by character count ----------
const _chunkCache = new Map();
function chunksOf(L) {
  if (_chunkCache.has(L.id)) return _chunkCache.get(L.id);
  const words = L.text.split(/\s+/), groups = [];
  let cur = [];
  for (const w of words) {
    const cand = [...cur, w].join(" ");
    if (cur.length && (cand.length > 17 || /[.,:?!]$/.test(cur[cur.length - 1]) && cur.join(" ").length > 6)) { groups.push(cur.join(" ")); cur = [w]; }
    else cur.push(w);
  }
  if (cur.length) groups.push(cur.join(" "));
  const tot = groups.reduce((s, g) => s + g.length + 3, 0), span = L.end - L.start;
  let acc = 0;
  const out = groups.map(g => { const a = L.start + span * acc / tot; acc += g.length + 3; return { g, a, b: L.start + span * acc / tot }; });
  _chunkCache.set(L.id, out);
  return out;
}
function capShort(t, y = 1480, hi = GOLD) {
  if (window.THUMB) return "";
  let o = "";
  const LS = window.TL.lines;
  for (let li = 0; li < LS.length; li++) {
    const L = LS[li], next = LS[li + 1];
    const until = next ? Math.min(L.end + 0.3, next.start - 0.06) : L.end + 0.3;
    if (L.nocap || t < L.start - 0.05 || t > until) continue;
    const cs = chunksOf(L);
    let c = cs.find(c => t >= c.a - 0.05 && t < c.b) || (t >= L.end ? cs[cs.length - 1] : cs[0]);
    const idx = cs.indexOf(c);
    const sc = 0.82 + 0.18 * easeBack(cl((t - c.a + 0.05) / 0.16));
    const fs = Math.min(100, 1900 / (c.g.length * 1.0 + 2));
    const col = idx % 2 ? hi : CREAM;
    o += txt(esc(c.g.toUpperCase()), 540, y, fs, col, 1, sc);
  }
  return o;
}

// ---------- end card ----------
function endCard(t, a, sub = "Segue pra mais um por cento por dia") {
  if (t < a || window.THUMB) return "";
  const k = seg(t, a, a + 0.5);
  let o = `<g opacity="${k}"><rect width="${SW}" height="${SH}" fill="#07080b" opacity="0.88"/>`;
  const P = Object.assign({ x: 960, c: JOSEPH }, face({ smile: 10, lid: blink(t, 0.05), look: [0, 4] }));
  o += `<clipPath id="avClip"><circle cx="540" cy="760" r="230"/></clipPath><circle cx="540" cy="760" r="236" fill="${GREEN}"/>`;
  o += `<g clip-path="url(#avClip)"><rect x="300" y="520" width="480" height="480" fill="#2a3140"/>${cam(960, 470, 1.15, personBack(P) + personHead(P, t), 790)}</g>`;
  o += txt("JOSEPH", 540, 1110, 120, CREAM, seg(t, a + 0.2, a + 0.6));
  o += txt(sub, 540, 1215, sub.length > 26 ? 46 : 56, "#cfd8e3", seg(t, a + 0.4, a + 0.8));
  const b = seg(t, a + 0.7, a + 1.1), puls = 1 + 0.05 * Math.sin((t - a) * 6) * b;
  o += `<g opacity="${b}" transform="translate(540 1380) scale(${puls})"><rect x="-250" y="-62" width="500" height="124" rx="62" fill="${RED}" stroke="#000" stroke-width="6"/><text class="hand" x="0" y="20" font-size="58" text-anchor="middle" fill="#fff">INSCREVA-SE</text></g>`;
  return o + `</g>`;
}

// ---------- full Joseph from the front (world coordinates, x = 960) ----------
// q: {face, hR, hL, phone:{pc, held, mode, on, gray}, book, desk, laptop, blanket, armsUp, plant}
function josephFront(t, q = {}) {
  const P = Object.assign({ x: 960, c: JOSEPH }, face(q.face || {}));
  const ph = q.phone;
  let o = personBack(P);
  if (q.armsUp) o += armsBehindHead(P, q.armsUp);
  o += personHead(P, t);
  if (q.blanket) o += `<path d="M 480 1500 L 480 660 Q 960 600 1440 660 L 1440 1500 Z" fill="#3d5a80" stroke="${INK}" stroke-width="7"/><path d="M 600 700 Q 960 650 1320 700" fill="none" stroke="#2c4462" stroke-width="6"/>`;
  if (q.desk) o += deskFront(q.laptop) + (q.plant ? plant() : "");
  if (ph && ph.held < 0.5) o += phoneBody(ph.pc, ph.held, t) + (ph.on ? `<ellipse cx="${ph.pc[0]}" cy="${ph.pc[1] - 20}" rx="90" ry="50" fill="url(#gPhone)" opacity="0.6"/>` : "");
  if (q.hR) o += armF([1060, 565], q.hR, JOSEPH.hood);
  if (q.hL) o += armF([860, 565], q.hL, JOSEPH.hood);
  if (q.book) o += book(q.book, 190, 150);
  if (ph && ph.held >= 0.5) {
    o += phoneBody(ph.pc, ph.held, t);
    if (ph.on) o += phoneScreen(ph.pc, ph.mode || "feed", t, ph.gray) + phoneGlowFace(960, ph.held, ph.gray ? 0.4 : 1);
  }
  if (q.hR) o += handC(q.hR, JOSEPH.skin);
  if (q.hL) o += handC(q.hL, JOSEPH.skin);
  return o;
}
const HOLD = { hR: [1000, 560], hL: [920, 560], pc: [960, 556] };

// simple icons (centred at 0,0)
const ICON = {
  book: c => `<rect x="-70" y="-50" width="140" height="100" rx="8" fill="${c}" stroke="#000" stroke-width="6"/><line x1="0" y1="-50" x2="0" y2="50" stroke="#000" stroke-width="6"/>`,
  phone: c => `<rect x="-38" y="-66" width="76" height="132" rx="14" fill="#14161a" stroke="${c}" stroke-width="7"/><circle cx="0" cy="48" r="6" fill="${c}"/>`,
  moon: c => `<path d="M 20 -60 A 62 62 0 1 0 60 30 A 48 48 0 1 1 20 -60 Z" fill="${c}" stroke="#000" stroke-width="6"/>`,
  sun: c => { let o = `<circle r="40" fill="${c}" stroke="#000" stroke-width="6"/>`; for (let i = 0; i < 8; i++) { const a = i * 45 * D2R; o += `<line x1="${Math.cos(a) * 54}" y1="${Math.sin(a) * 54}" x2="${Math.cos(a) * 74}" y2="${Math.sin(a) * 74}" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`; } return o; },
  check: c => `<circle r="60" fill="${c}" stroke="#000" stroke-width="6"/><path d="M -28 2 L -8 24 L 30 -22" fill="none" stroke="#07080b" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`,
  cross: c => `<circle r="60" fill="${c}" stroke="#000" stroke-width="6"/><path d="M -24 -24 L 24 24 M 24 -24 L -24 24" stroke="#07080b" stroke-width="14" stroke-linecap="round"/>`,
};
function battery(x, y, level, label, col) {
  const w = 300, h = 120;
  let o = `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="18" fill="#12151c" stroke="${CREAM}" stroke-width="8"/><rect x="${w / 2 + 4}" y="-26" width="20" height="52" rx="6" fill="${CREAM}"/>`;
  o += `<rect x="${-w / 2 + 14}" y="${-h / 2 + 14}" width="${Math.max(0, (w - 28) * level)}" height="${h - 28}" rx="8" fill="${col}"/>`;
  o += txt(label, 0, -h / 2 - 40, 46, CREAM);
  return o + `</g>`;
}
// timer clock face with progress ring; secs shown as M:SS
function timerFace(x, y, r, frac, label, col) {
  const a = frac * 2 * Math.PI, large = frac > 0.5 ? 1 : 0;
  const ex = Math.sin(a) * r, ey = -Math.cos(a) * r;
  let o = `<g transform="translate(${x} ${y})"><circle r="${r + 18}" fill="#12151c" stroke="#000" stroke-width="8"/><circle r="${r}" fill="none" stroke="#2a3140" stroke-width="22"/>`;
  if (frac > 0.001) o += frac >= 0.999 ? `<circle r="${r}" fill="none" stroke="${col}" stroke-width="22"/>` : `<path d="M 0 ${-r} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}" fill="none" stroke="${col}" stroke-width="22" stroke-linecap="round"/>`;
  o += `<text class="sans" x="0" y="${r * 0.2}" font-size="${r * 0.62}" font-weight="800" text-anchor="middle" fill="${CREAM}">${label}</text>`;
  return o + `</g>`;
}
const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
// falling rain over the whole frame
function rainV(t, amt, n = 70) {
  if (amt <= 0) return "";
  let o = `<g opacity="${amt}" stroke="#9fb6d0" stroke-width="4" stroke-linecap="round">`;
  for (let i = 0; i < n; i++) {
    const x = hash(i) * (SW + 200) - 100, sp = 1500 + hash(i + 9) * 600, y = ((t * sp + hash(i + 3) * SH) % (SH + 200)) - 100;
    o += `<line x1="${x}" y1="${y}" x2="${x - 14}" y2="${y + 60}" opacity="${0.4 + 0.5 * hash(i + 7)}"/>`;
  }
  return o + `</g>`;
}
