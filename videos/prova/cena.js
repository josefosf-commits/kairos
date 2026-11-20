// PROVA. — vídeo longo (16:9): de 2 a 8,5 em matemática em 30 dias. Helpers copiados de ../levanta/cena.js
const W = 1920, H = 1080, REDC = "#e5484d", BLUEP = "#5b8cff";
const cam2 = (cx, cy, s, inner) => `<g transform="translate(960 540) scale(${s}) translate(${-cx} ${-cy})">${inner}</g>`;
const room = (inner, dx = 0, dy = 0, s = 1) => `<g transform="translate(${960 + dx} ${540 + dy}) scale(${s}) translate(-960 -540)">${inner}</g>`;
const dark = (op, c = "#000") => op > 0 ? `<rect width="${W}" height="${H}" fill="${c}" opacity="${op}"/>` : "";
const black = () => `<rect width="${W}" height="${H}" fill="#0b0c10"/>`;
function chip(t, a, label, col = CREAM, x = 960, y = 150, size = 64) {
  const p = pop(t, a); if (p <= 0) return "";
  const w = label.length * size * 0.52 + 90;
  return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.8}" width="${w}" height="${size * 1.6}" rx="${size * 0.8}" fill="#07080b" opacity="0.88" stroke="${col}" stroke-width="5"/>${txt(label, 0, 0, size, col)}</g>`;
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

// ---------- props ----------
// exam sheet (centred at x,y): grade shown in a circle at top-right
function examPaper(x, y, s, rot, grade, gcol, t, ga, o = {}) {
  let g = `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-260" y="-340" width="520" height="680" rx="10" fill="#fbf8f1" stroke="${INK}" stroke-width="7"/>`;
  g += `<text class="hand" x="-220" y="-270" font-size="44" fill="${INK}">MATEMÁTICA</text><line x1="-220" y1="-250" x2="60" y2="-250" stroke="${INK}" stroke-width="4"/>`;
  g += `<text class="hand" x="-220" y="-205" font-size="30" fill="#5a606b">Nome: Joseph</text>`;
  const marks = o.marks || [0, 0, 1, 0, 0, 0, 0];
  for (let i = 0; i < 7; i++) {
    const yy = -140 + i * 66;
    g += `<text class="hand" x="-220" y="${yy}" font-size="32" fill="${INK}">${i + 1})</text><line x1="-170" y1="${yy}" x2="${100 - (i % 3) * 40}" y2="${yy}" stroke="#9aa3ad" stroke-width="5" stroke-linecap="round"/>`;
    const m = marks[i];
    if (m === 1) g += `<path d="M 140 ${yy - 14} l 14 16 l 28 -32" fill="none" stroke="${GREEN}" stroke-width="8" stroke-linecap="round"/>`;
    else if (m === 0) g += `<path d="M 140 ${yy - 28} l 30 30 M 170 ${yy - 28} l -30 30" stroke="${REDC}" stroke-width="8" stroke-linecap="round"/>`;
  }
  const p = pop(t, ga, 0.3);
  if (p > 0) g += `<g transform="translate(160 -260) scale(${p}) rotate(-8)"><circle r="96" fill="none" stroke="${gcol}" stroke-width="10"/><text class="hand" x="0" y="40" font-size="${grade.length > 2 ? 84 : 130}" text-anchor="middle" fill="${gcol}">${grade}</text></g>`;
  return g + `</g>`;
}
function board(x, y, w, h, lines, col = "#f4efe6", size = 64) {
  let g = `<g transform="translate(${x} ${y})"><rect x="${-w / 2 - 22}" y="${-h / 2 - 22}" width="${w + 44}" height="${h + 44}" rx="12" fill="#7a5532" stroke="${INK}" stroke-width="7"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#2f4a3a"/>`;
  lines.forEach((l, i) => { g += `<text class="hand" x="0" y="${-((lines.length - 1) * size * 1.1) / 2 + i * size * 1.1 + size * 0.35}" font-size="${size}" text-anchor="middle" fill="${col}">${l}</text>`; });
  return g + `</g>`;
}
// "caderno de erros": rows = [[text, mark]] mark: 0 ✗, 1 ✓, null none
function errBook(x, y, s, rows, t, a, title = "CADERNO DE ERROS") {
  const p = pop(t, a); if (p <= 0) return "";
  let g = `<g transform="translate(${x} ${y}) scale(${s * p}) rotate(-2)"><rect x="-300" y="-330" width="600" height="660" rx="16" fill="#f6f1e6" stroke="${INK}" stroke-width="8"/><rect x="-300" y="-330" width="600" height="90" rx="16" fill="${REDC}" stroke="${INK}" stroke-width="8"/>`;
  g += `<text class="hand" x="0" y="-270" font-size="46" text-anchor="middle" fill="#fff">${title}</text>`;
  for (let i = 0; i < 9; i++) g += `<line x1="-260" y1="${-180 + i * 58}" x2="260" y2="${-180 + i * 58}" stroke="#c6d4e6" stroke-width="3"/>`;
  rows.forEach(([txt0, m, ra], i) => {
    if (ra !== undefined && t < ra) return;
    const yy = -192 + i * 58;
    g += `<text class="hand" x="-250" y="${yy}" font-size="36" fill="#3a3a44">${txt0}</text>`;
    if (m === 0) g += `<path d="M 200 ${yy - 30} l 26 26 M 226 ${yy - 30} l -26 26" stroke="${REDC}" stroke-width="7" stroke-linecap="round"/>`;
    if (m === 1) g += `<path d="M 198 ${yy - 14} l 12 14 l 26 -30" fill="none" stroke="${GREEN}" stroke-width="8" stroke-linecap="round"/>`;
  });
  return g + `</g>`;
}
function phoneN(x, y, s, t, n) {
  let g = `<g transform="translate(${x + Math.sin(t * 40) * 3 * (Math.floor(t * 1.2) % 2)} ${y}) scale(${s})"><rect x="-80" y="-140" width="160" height="280" rx="22" fill="#14161a" stroke="${INK}" stroke-width="7"/><rect x="-66" y="-118" width="132" height="236" rx="10" fill="#0f2a36"/>`;
  for (let i = 0; i < n; i++) g += `<rect x="-58" y="${-108 + i * 46}" width="116" height="38" rx="8" fill="${["#4fd1ff", "#ff6fae", "#30a46c", GOLD, "#a78bfa"][i % 5]}" opacity="0.9"/>`;
  return g + `</g>`;
}
function bubbleL(x, y, s, lines, col = INK, tail = "left") {
  if (s <= 0) return "";
  const w = Math.max(...lines.map(l => l.length)) * 25 + 80, h = lines.length * 60 + 40;
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="34" fill="#fff" stroke="#000" stroke-width="7"/>`;
  const tx = tail === "left" ? -w / 2 + 70 : w / 2 - 70, dir = tail === "left" ? -1 : 1;
  g += `<path d="M ${tx - 30} ${h / 2 - 4} L ${tx + dir * 40} ${h / 2 + 60} L ${tx + 30} ${h / 2 - 4} Z" fill="#fff" stroke="#000" stroke-width="7" stroke-linejoin="round"/><rect x="${tx - 34}" y="${h / 2 - 14}" width="68" height="14" fill="#fff"/>`;
  lines.forEach((l, i) => { g += `<text class="hand" x="0" y="${-h / 2 + 62 + i * 60}" font-size="48" text-anchor="middle" fill="${col}">${l}</text>`; });
  return g + `</g>`;
}
const lamp = (k = 1) => `<ellipse cx="1260" cy="560" rx="420" ry="320" fill="url(#gLamp)" opacity="${0.5 * k}" style="mix-blend-mode:screen"/><path d="M 1260 640 L 1260 470 L 1180 420" fill="none" stroke="${INK}" stroke-width="12"/><path d="M 1130 400 L 1230 380 L 1210 450 Z" fill="#3a4150" stroke="${INK}" stroke-width="6"/>`;
function personF(t, c, f, x) { const P = Object.assign({ x, c }, face(Object.assign({ lid: blink(t, 0.06, x * 0.001) }, f))); return personBack(P) + personHead(P, t); }
function walkScene(t, q = {}) {
  let w = streetBg(t * 200);
  w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#1b1f2e" opacity="0.35"/>`;
  w += sidePerson({ x: 960, dir: 1, groundY: 840, gait: 0.45, phase: t * 5.2, lean: 6, look: [6, 6], lid: blink(t, 0.1), browUp: 0, browAng: 0, browSad: q.sad || 0.7, pant: 0, smile: -4 }, t);
  return cam2(960, 600, 1.05, w);
}
const ICON_P = {
  timer: c => `<circle r="80" fill="#12151c" stroke="${c}" stroke-width="12"/><path d="M 0 0 L 0 -55 M 0 0 L 40 20" stroke="${c}" stroke-width="10" stroke-linecap="round"/><rect x="-18" y="-110" width="36" height="22" rx="6" fill="${c}"/>`,
  book: c => `<rect x="-90" y="-70" width="180" height="140" rx="10" fill="#f6f1e6" stroke="#000" stroke-width="6"/><path d="M -60 -20 l 30 30 M -30 -20 l -30 30" stroke="${REDC}" stroke-width="8" stroke-linecap="round"/><path d="M 10 -6 l 14 16 l 30 -32" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`,
  pen: c => `<rect x="-100" y="-80" width="200" height="160" rx="10" fill="#f6f1e6" stroke="#000" stroke-width="6"/><path d="M -70 -30 L 40 -30 M -70 10 L 20 10 M -70 50 L 0 50" stroke="#9aa3ad" stroke-width="7" stroke-linecap="round"/><path d="M 60 60 L 110 -40" stroke="${c}" stroke-width="16" stroke-linecap="round"/>`,
};

// ---------- scenes ----------
function sGrade(t) {
  let o = `<rect width="${W}" height="${H}" fill="#121520"/>`;
  const shock = t > S(2) - 0.2;
  o += room(roomBg(0.35, 0.1) + josephFront(t, { face: { look: [-14, 6], browUp: shock ? 10 : 2, mouthOpen: shock ? 0.4 : 0, smile: -4, lid: blink(t, 0.05) } }), 380, 120, 0.95);
  o += examPaper(640, 500, 0.95 * pop(t, 0.2, 0.5), -5, "2", REDC, t, S(1) - 0.1);
  if (t > S(2)) o += chip(t, S(2) + 2.4, "DE 10", REDC, 640, 960 - 70, 56);
  return o;
}
function sClass(t) {
  let w = roomBg(0.7, 0.2) + board(960, 220, 760, 230, ["RECUPERAÇÃO", "EM 30 DIAS"], "#f4efe6", 70);
  w += josephFront(t, { desk: true, hR: [1040, 630], hL: [880, 630], face: { look: [0, -10], browSad: 0.6, smile: -4 } });
  let o = room(w, 0, 90, 1.0);
  o += chip(t, S(3) + 3.2, "30 DIAS", GOLD, 1580, 150, 64);
  return o;
}
function sWalk(t) {
  let o = walkScene(t);
  o += thought(1250, 150, "nota < 6 = repete de ano", seg(t, S(4) + 1.8, S(4) + 2.4));
  return o;
}
function sDoubt(t) {
  let o = room(roomBg(0.1, 0) + josephFront(t, { face: { look: [0, 16], browSad: 1, smile: -6, lid: 0.35 } }), 0, 140, 1.15) + dark(0.35);
  o += thought(1150, 250, "eu não nasci pra matemática", seg(t, S(5) + 0.3, S(5) + 0.8));
  return o;
}
function sTitle(t) {
  let o = black();
  o += titleCard(t, E(5) + 0.6, "PROVA.", GOLD, 240);
  return o;
}
function sOld(t) {
  let w = roomBg(0.05, 0.3) + lamp() + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 12], smile: 2, lid: 0.25 } });
  let o = room(w, 0, 90, 1.0);
  o += chip(t, S(6) - 0.2, "VÉSPERA · 23:00", "#8f99a3", 330, 150, 52);
  ["1ª VEZ", "2ª VEZ", "3ª VEZ"].forEach((s, i) => { o += chip(t, S(6) + 3.4 + i * 0.6, s, CREAM, 1560, 140 + i * 110, 46); });
  o += thought(1140, 330, "entendi!", seg(t, S(6) + 6.0, S(6) + 6.5));
  return o;
}
function sReadVs(t) {
  let o = `<rect width="${W}" height="${H}" fill="#101318"/>`;
  o += txt("LER", 520, 360, 150, CREAM, 1, pop(t, S(7) - 0.2)) + txt("NÃO É", 930, 360, 110, REDC, 1, pop(t, S(7) + 0.5)) + txt("APRENDER", 1400, 360, 150, GREEN, 1, pop(t, S(7) + 0.9));
  o += chip(t, S(7) + 2.0, "ler = SENSAÇÃO de que sabe", "#cfd8e3", 960, 600, 54);
  o += chip(t, S(7) + 4.0, "a prova mostra a verdade", REDC, 960, 760, 54);
  return o;
}
function sPhone(t) {
  const n = Math.min(5, 1 + Math.floor(Math.max(0, t - S(8) - 1.2) / 0.9));
  let w = roomBg(0.05, 0.3) + lamp() + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [14, 8], smile: 0, lid: 0.15 } });
  let o = room(w, 0, 90, 1.0);
  o += phoneN(1300, 600, 0.85, t, n) + `<ellipse cx="1300" cy="600" rx="200" ry="180" fill="url(#gPhone)" opacity="${0.35 + 0.15 * Math.sin(t * 8)}" style="mix-blend-mode:screen"/>`;
  const b = seg(t, S(8) + 4.6, S(8) + 5.4);
  if (b > 0) {
    o += `<g opacity="${b}"><rect x="160" y="100" width="1600" height="270" rx="30" fill="#07080b" opacity="0.88"/>`;
    o += txt("1 HORA DE ESTUDO", 560, 175, 50, "#8f99a3") + `<rect x="1000" y="150" width="680" height="50" rx="25" fill="#3a4150"/>`;
    const k = seg(t, S(8) + 6.0, S(8) + 7.2);
    o += txt("DE VERDADE:", 560, 295, 50, REDC) + `<rect x="1000" y="270" width="${lerp(680, 170, k)}" height="50" rx="25" fill="${REDC}"/>`;
    if (k > 0.9) o += txt("15 MIN", 1290, 297, 46, REDC);
    o += `</g>`;
  }
  return o;
}
function sThree(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += `<g transform="translate(960 520) rotate(-2) scale(${pop(t, S(9) - 0.3)})"><rect x="-420" y="-330" width="840" height="660" rx="20" fill="#f6f1e6" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 12; i++) o += `<line x1="-380" y1="${-200 + i * 48}" x2="380" y2="${-200 + i * 48}" stroke="#c6d4e6" stroke-width="3"/>`;
  o += `<text class="hand" x="0" y="-230" font-size="76" text-anchor="middle" fill="${REDC}">3 REGRAS · 30 DIAS</text>`;
  for (let i = 0; i < 3; i++) { const k = seg(t, S(9) + 2.2 + i * 0.4, S(9) + 2.5 + i * 0.4); o += `<g opacity="${k}"><circle cx="-300" cy="${-100 + i * 150}" r="40" fill="${[GOLD, ACC, GREEN][i]}" stroke="${INK}" stroke-width="5"/><text class="hand" x="-300" y="${-84 + i * 150}" font-size="54" text-anchor="middle" fill="${INK}">${i + 1}</text><line x1="-230" y1="${-90 + i * 150}" x2="330" y2="${-90 + i * 150}" stroke="#8a8478" stroke-width="6" stroke-dasharray="14 12"/></g>`; }
  return o + `</g>`;
}
function sRule1(t) {
  const a = S(10) - 0.3, demo = S(10) + 3.0, end = S(12) - 0.3;
  let o;
  if (t < S(11) - 0.3) {
    const k = seg(t, demo, S(11) - 0.4);
    o = room(roomBg(0.75, 0.25) + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 12], smile: 3, browAng: 0.4 } }), -300, 90, 1.0);
    o += timerFace(1450, 470, 170, 1 - k, mmss(1500 * (1 - k)), GOLD);
    o += `<g transform="translate(1450 800)"><rect x="-210" y="-60" width="420" height="120" rx="20" fill="#07080b" opacity="0.85"/>${txt("📱 → outro cômodo", 0, 4, 44, CREAM)}</g>`;
  } else {
    o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
    o += txt("25 min × 30 dias", 960, 330, 110, CREAM, 1, pop(t, S(11) + 2.0));
    o += txt("= 12,5 HORAS", 960, 520, 160, GOLD, 1, pop(t, S(11) + 4.0));
    o += txt("de estudo de verdade", 960, 680, 60, "#cfd8e3", seg(t, S(11) + 5.0, S(11) + 5.4));
  }
  o += techCard(t, a, demo, end, 1, "25 MIN. CELULAR LONGE.", "todo dia, sem exceção", ICON_P.timer(GOLD), GOLD);
  return o;
}
function sRule2(t) {
  const a = S(12) - 0.3, demo = S(12) + 3.4, end = S(13) - 0.3;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    o += `<g transform="translate(560 520) rotate(-4) scale(${pop(t, demo)})"><rect x="-220" y="-160" width="440" height="320" rx="14" fill="#8c4a2f" stroke="${INK}" stroke-width="8"/><text class="hand" x="0" y="20" font-size="56" text-anchor="middle" fill="#f6f1e6">FECHADO</text></g>`;
    o += `<g transform="translate(1300 500) rotate(3) scale(${pop(t, demo + 0.8)})"><rect x="-300" y="-230" width="600" height="460" rx="12" fill="#fbf8f1" stroke="${INK}" stroke-width="7"/><text class="hand" x="-250" y="-140" font-size="52" fill="${INK}">2x + 6 = 14</text><text class="hand" x="-250" y="-50" font-size="52" fill="${INK}">2x = 20 ?</text>`;
    if (t > S(12) + 4.6) o += `<path d="M 120 -90 l 50 50 M 170 -90 l -50 50" stroke="${REDC}" stroke-width="12" stroke-linecap="round"/><text class="hand" x="-250" y="80" font-size="44" fill="${REDC}">→ o sinal ao passar!</text>`;
    o += `</g>`;
    o += chip(t, S(12) + 6.0, "O ERRO MOSTRA O QUE FALTA", GREEN, 960, 870 - 30, 50);
  }
  o += techCard(t, a, demo, end, 2, "FECHA O CADERNO E TENTA", "sozinho. errar faz parte.", ICON_P.pen(ACC), ACC);
  return o;
}
function sRule3(t) {
  const a = S(13) - 0.3, demo = S(13) + 3.0, end = S(14) - 0.8;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    o += errBook(700, 480, 0.95, [["2x + 6 = 14", 0], ["frações", 0], ["(-3)²", 0], ["regra de três", 0]], t, demo);
    o += chip(t, S(13) + 4.6, "TODA SEXTA: REFAZ SÓ ESSES", GREEN, 1400, 470, 50);
  }
  o += techCard(t, a, demo, end, 3, "CADERNO DE ERROS", "e toda sexta, refaz", ICON_P.book(GREEN), GREEN);
  return o;
}
function sWeek1(t) {
  let o = room(roomBg(0.6, 0.2) + josephFront(t, { desk: true, hR: [1040 + Math.sin(t * 10) * 5, 620], hL: [880, 620], face: { look: [10, 8], smile: -5, browAng: 0.7 } }), -330, 90, 1.0);
  const rows = [["equação 1", 0], ["equação 2", 0], ["frações 3", 0], ["potência 1", 0], ["equação 4", 0], ["frações 5", 0], ["regra 3", 0], ["equação 6", 0]].map((r, i) => [r[0], r[1], S(14) + 1.0 + i * 0.45]);
  o += errBook(1400, 480, 0.95, rows, t, S(14) - 0.4);
  o += chip(t, S(14) - 0.6, "SEMANA 1", REDC, 330, 130, 60);
  return o;
}
function sStuck(t) {
  let w = roomBg(0.5, 0.1) + board(960, 220, 760, 230, ["x² − 5x + 6 = 0"], "#f4efe6", 80);
  w += josephFront(t, { face: { look: [0, -14], browAng: 1, smile: -7, lid: 0.15 } });
  let o = room(w, 0, 130, 1.05);
  for (let i = 0; i < 3; i++) o += txt("?", 1250 + i * 70, 470 - (i % 2) * 50, 100, REDC, seg(t, S(15) + 2.4 + i * 0.3, S(15) + 2.7 + i * 0.3));
  o += chip(t, S(15) - 0.2, "QUARTA-FEIRA", "#8f99a3", 330, 130, 52);
  return o;
}
function sOne(t) {
  const k = seg(t, S(16), E(16) + 0.6);
  let o = room(roomBg(0.6, 0.2) + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 12], smile: 1, browAng: 0.5 } }), -300, 90, 1.0);
  o += timerFace(1450, 430, 150, 1 - k * 0.3, mmss(1500 * (1 - k * 0.3)), GOLD);
  o += chip(t, S(16) + 4.2, "1 EXERCÍCIO ✓", GREEN, 1450, 720, 60);
  return o;
}
function sWeek2(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += chip(t, S(17) - 0.5, "SEMANA 2", GOLD, 960, 120, 60);
  const k = seg(t, S(17) + 2.6, S(17) + 4.6), k2 = seg(t, S(17) + 4.6, S(17) + 6.6);
  const bar = (x, h, col, lab) => `<rect x="${x - 110}" y="${780 - h}" width="220" height="${h}" rx="14" fill="${col}" stroke="${INK}" stroke-width="6"/>${txt(lab, x, 840, 44, CREAM)}`;
  if (t > S(17)) {
    o += `<line x1="380" y1="780" x2="1540" y2="780" stroke="#3a4150" stroke-width="6"/>`;
    o += bar(660, lerp(480, 70, k), REDC, "ERROS BOBOS") + bar(1260, lerp(120, 380, k2), ACC, "ERROS DIFÍCEIS");
  }
  if (t > S(18) - 0.4) o = `<rect width="${W}" height="${H}" fill="#101318"/>` + txt("ERRAR DIFERENTE", 960, 380, 130, ACC, 1, pop(t, S(18) + 2.4)) + txt("=", 960, 520, 110, CREAM, 1, pop(t, S(18) + 3.6)) + txt("ESTAR APRENDENDO", 960, 680, 130, GREEN, 1, pop(t, S(18) + 4.4));
  return o;
}
function sWeek3(t) {
  let o;
  if (t < S(20) - 0.3) {
    let w = roomBg(0.75, 0.3) + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [14, 2], smile: 6, browAng: 0.3 } });
    w += personF(t, FRIEND, { look: [-14, 2], smile: 10 }, 1520);
    o = room(w, -200, 120, 0.95);
    o += chip(t, S(19) - 0.5, "SEMANA 3", GREEN, 330, 120, 60);
    o += bubbleL(1450, 260, pop(t, S(19) + 1.2), ["bora jogar?"], INK, "right");
    o += bubbleL(620, 250, pop(t, S(19) + 3.6), ["depois dos meus", "25 minutos, eu vou"], INK, "right");
  } else {
    let w = roomBg(0.3, 0.6) + personF(t, JOSEPH, { look: [0, -4], smile: 12, happy: 1 }, 760) + personF(t, FRIEND, { look: [0, -4], smile: 12, happy: 1 }, 1160);
    w += `<ellipse cx="960" cy="300" rx="700" ry="360" fill="url(#gPhone)" opacity="${0.35 + 0.1 * Math.sin(t * 6)}" style="mix-blend-mode:screen"/>`;
    o = room(w, 0, 140, 1.0);
    o += chip(t, S(20) + 1.6, "ESTUDOU ✓", GOLD, 640, 150, 54) + chip(t, S(20) + 2.6, "JOGOU ✓", ACC, 1280, 150, 54);
    o += chip(t, S(20) + 3.0, "SEM CULPA", GREEN, 960, 280, 60);
  }
  return o;
}
function sWeek4(t) {
  let o;
  if (t < S(22) - 0.3) {
    o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
    const rows = [["2x + 6 = 14", 1], ["frações", 1], ["(-3)²", 1], ["regra de três", 1], ["x² − 5x + 6", 1], ["potência", 0], ["equação 6", 1]].map((r, i) => [r[0], r[1], S(21) + 2.0 + i * 0.4]);
    o += errBook(960, 470, 1.05, rows, t, S(21) - 0.6, "SEXTA: REFAZER");
    o += chip(t, S(21) - 0.8, "SEMANA 4", GOLD, 330, 120, 60);
  } else {
    let w = roomBg(0.75, 0.25) + board(960, 150, 760, 200, ["x² − 5x + 6 = 0", "x = 2  ou  x = 3"], "#f4efe6", 60);
    w += personF(t, JOSEPH, { look: [12, -4], smile: 10, mouthOpen: 0.25 * (Math.sin(t * 9) > 0 ? 1 : 0) }, 700) + personF(t, FRIEND, { look: [-10, -6], smile: 8, browUp: 6 }, 1220);
    o = room(w, 0, 140, 1.0);
  }
  return o;
}
function sDay30(t) {
  let o = black();
  o += calendar(630, 230, 110, 6, 5, lerp(22, 30, seg(t, S(23) - 0.6, S(23) + 1.0)), t, { title: "30 DIAS", col: GREEN });
  o += txt("DIA DA PROVA", 960, 900 - 40, 90, GOLD, 1, pop(t, S(23) + 1.2));
  return o;
}
function sExam(t) {
  const q7 = t > S(26) - 0.2, calm = t > S(28) - 0.2;
  const worry = q7 && !calm;
  let w = roomBg(0.7, 0.15) + josephFront(t, { desk: true, hR: [1020, 630], hL: [900, 630], face: { look: [0, 14], smile: worry ? -6 : 4, browAng: worry ? 0 : 0.5, browSad: worry ? 0.9 : 0, browUp: worry ? 4 : 0, lid: blink(t, 0.1) } });
  w += `<rect x="830" y="600" width="260" height="46" rx="4" fill="#fbf8f1" stroke="${INK}" stroke-width="5"/>`;
  let o = room(w, -360, 100, 1.0);
  if (worry) o += dark(0.35 * seg(t, S(26), S(26) + 1.2));
  // question panel on the right
  const qx = 1380;
  let qn = "QUESTÃO 1", qc = GREEN;
  if (t > S(25) - 0.3) qn = "QUESTÃO 2";
  if (q7) { qn = "QUESTÃO 7"; qc = REDC; }
  if (calm) qc = GOLD;
  o += `<g transform="translate(${qx} 480)"><rect x="-380" y="-330" width="760" height="620" rx="20" fill="#fbf8f1" stroke="${INK}" stroke-width="8"/>`;
  o += `<text class="hand" x="-330" y="-250" font-size="58" fill="${qc}">${qn}</text>`;
  if (!q7) {
    o += `<text class="hand" x="-330" y="-150" font-size="56" fill="${INK}">${t < S(25) - 0.3 ? "2x + 6 = 14" : "(-3)² = ?"}</text>`;
    const ok = t < S(25) - 0.3 ? S(24) + 2.6 : S(25) + 0.9;
    if (t > ok) o += `<path d="M -300 20 l 30 34 l 66 -76" fill="none" stroke="${GREEN}" stroke-width="14" stroke-linecap="round"/><text class="hand" x="-160" y="40" font-size="46" fill="${GREEN}">já vi essa!</text>`;
  } else {
    o += `<text class="hand" x="-330" y="-160" font-size="44" fill="${INK}">Um terreno tem 3x de frente</text><text class="hand" x="-330" y="-100" font-size="44" fill="${INK}">e x + 4 de fundo. A área</text><text class="hand" x="-330" y="-40" font-size="44" fill="${INK}">é 96 m². Quanto vale x?</text>`;
    if (t > S(29) - 0.3) {
      const steps = ["1) área = frente × fundo", "2) 3x · (x + 4) = 96", "3) x² + 4x − 32 = 0", "4) x = 4 ✓"];
      steps.forEach((s, i) => { o += `<text class="hand" x="-330" y="${50 + i * 60}" font-size="42" fill="${i === 3 ? GREEN : "#2d5aa8"}" opacity="${seg(t, S(29) + i * 1.0, S(29) + i * 1.0 + 0.4)}">${s}</text>`; });
    }
  }
  o += `</g>`;
  if (inR(t, S(27) + 2.2, S(28) - 0.3)) o += `<text class="hand" x="560" y="200" font-size="70" text-anchor="middle" fill="${REDC}" opacity="${0.75 * seg(t, S(27) + 2.2, S(27) + 2.8)}" style="filter: blur(1px)">"você não nasceu pra isso"</text>`;
  if (inR(t, S(27), S(28) - 0.2)) o += `<path d="M 700 380 q 14 24 0 36 q -14 -12 0 -36 Z" fill="#7fc8ff" stroke="${INK}" stroke-width="3"/>`;
  if (calm) o += chip(t, S(28) + 2.2, "REGRA 2: TENTA SOZINHO", ACC, 560, 140, 46);
  if (t > S(30) - 0.3) o += chip(t, S(30), "ENTREGUE", "#cfd8e3", 560, 880 - 20, 54);
  if (t < S(25) - 0.3) o += chip(t, S(24) - 0.5, "DIA 30", GOLD, 300, 120, 54);
  return o;
}
function sResult(t) {
  let o;
  if (t < S(32) - 0.5) {
    o = room(roomBg(0.7, 0.2) + josephFront(t, { desk: true, hR: [1040, 630], hL: [880, 630], face: { look: [0, -10], browUp: 8, smile: -2, mouthOpen: seg(t, S(31) + 2.0, S(31) + 2.6) * 0.3 } }), 0, 100, 1.0);
    o += chip(t, S(31) - 0.6, "UMA SEMANA DEPOIS", "#cfd8e3", 960, 120, 56);
    o += bubbleL(1500, 300, pop(t, S(31) + 1.8), ['"Joseph?"'], INK, "left");
  } else {
    o = `<rect width="${W}" height="${H}" fill="#101318"/>`;
    const half = t > S(33) - 0.2;
    o += room(roomBg(0.8, 0.4) + josephFront(t, { armsUp: half ? seg(t, S(33) + 2.4, S(33) + 3.0) : 0, face: { happy: half ? 1 : 0, smile: half ? 14 : 6, browUp: 10, mouthOpen: half ? 0 : 0.4 } }), 420, 120, 0.95);
    o += examPaper(640, 500, 0.98, -4, half ? "8,5" : "8", GREEN, t, S(32) - 0.1, { marks: [1, 1, 1, 1, 0, 1, 1] });
    if (half) o += chip(t, S(33) + 2.6, "QUESTÃO 7 ✓", GREEN, 640, 900 - 40, 56);
  }
  return o;
}
function sLesson(t) {
  let o = black();
  if (t < S(35) - 0.4) {
    o += txt("ESTUDAR PRA SENTIR QUE SABE", 960, 330, 74, "#8f99a3", 1, pop(t, S(34) + 3.6));
    if (t > S(34) + 5.0) o += `<line x1="430" y1="330" x2="1490" y2="330" stroke="${REDC}" stroke-width="10" opacity="${seg(t, S(34) + 5.0, S(34) + 5.4)}"/>`;
    o += txt("ESTUDAR PRA DAR RESULTADO", 960, 520, 84, GREEN, 1, pop(t, S(34) + 5.6));
  } else {
    o += txt("NINGUÉM NASCE", 960, 300, 110, CREAM, 1, pop(t, S(35))) + txt("PRA MATEMÁTICA.", 960, 430, 110, CREAM, 1, pop(t, S(35) + 0.6));
    o += txt("FAZENDO · ERRANDO · REFAZENDO", 960, 640, 70, GOLD, 1, pop(t, S(35) + 2.4));
  }
  return o;
}
function sRecap(t) {
  return black() + recapCards(t, S(36) - 0.4, S(38) - 0.5, "PROVA CHEGANDO? LEMBRA:", [
    [S(37), "25 MIN", "celular longe", ICON_P.timer(GOLD), GOLD],
    [S(37) + 2.4, "TENTA SOZINHO", "caderno fechado", ICON_P.pen(ACC), ACC],
    [S(37) + 4.8, "REFAZ OS ERROS", "toda sexta", ICON_P.book(GREEN), GREEN]]);
}
function sBA(t) {
  let o = black();
  o += txt("2", 560, 480, 300, REDC, 1, pop(t, S(38) - 0.3)) + txt("→", 960, 470, 200, CREAM, 1, pop(t, S(38) + 0.6)) + txt("8,5", 1380, 480, 300, GREEN, 1, pop(t, S(38) + 1.0));
  o += txt("EM 30 DIAS", 960, 720, 100, GOLD, 1, pop(t, S(38) + 2.2));
  return o;
}
function sCTA(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>`;
  o += room(josephFront(t, { face: { happy: 1, smile: 12 } }), -480, 120, 0.9);
  o += `<g transform="translate(1300 330) scale(${pop(t, S(39) + 0.2)})"><rect x="-330" y="-85" width="660" height="170" rx="85" fill="${RED}" stroke="#000" stroke-width="8"/>${txt("SEGUE O CANAL", 0, 0, 80, "#fff")}</g>`;
  const k = pop(t, S(39) + 2.6);
  if (k > 0) o += `<g transform="translate(1300 620) scale(${k})"><rect x="-400" y="-90" width="800" height="180" rx="30" fill="#f6f1e6" stroke="${INK}" stroke-width="7"/><text class="hand" x="0" y="-12" font-size="50" text-anchor="middle" fill="${INK}">Qual matéria é a sua prova?</text><text class="hand" x="0" y="52" font-size="40" text-anchor="middle" fill="#5a606b">comenta aqui</text></g>`;
  return o;
}
function sEndScreen(t, a) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>`;
  const k = seg(t, a, a + 0.6);
  o += `<g opacity="${k}">`;
  const P = Object.assign({ x: 960, c: JOSEPH }, face({ smile: 10, lid: blink(t, 0.05), look: [6, 4] }));
  o += `<clipPath id="avL"><circle cx="420" cy="430" r="190"/></clipPath><circle cx="420" cy="430" r="198" fill="${GOLD}"/><g clip-path="url(#avL)"><rect x="200" y="220" width="440" height="440" fill="#2a3140"/>${room(personBack(P) + personHead(P, t), -540, -10, 0.95)}</g>`;
  o += txt("JOSEPH", 420, 720, 110, CREAM) + txt("Melhore 1% por dia.", 420, 820, 54, GOLD);
  o += `<rect x="900" y="250" width="860" height="484" rx="24" fill="#12151c" stroke="#3a4150" stroke-width="5" stroke-dasharray="18 14"/>`;
  o += txt("ASSISTA A SEGUIR", 1330, 180, 60, GOLD);
  return o + `</g>`;
}

function cuts() {
  return [
    [S(3) - 0.4, sGrade], [S(4) - 0.4, sClass], [S(5) - 0.3, sWalk], [E(5) + 0.6, sDoubt], [S(6) - 0.6, sTitle],
    [S(7) - 0.4, sOld], [S(8) - 0.4, sReadVs], [S(9) - 0.5, sPhone], [S(10) - 0.3, sThree],
    [S(12) - 0.3, sRule1], [S(13) - 0.3, sRule2], [S(14) - 0.8, sRule3], [S(15) - 0.4, sWeek1], [S(16) - 0.4, sStuck], [S(17) - 0.7, sOne],
    [S(19) - 0.7, sWeek2], [S(21) - 0.9, sWeek3], [S(23) - 0.9, sWeek4], [S(24) - 0.6, sDay30], [S(31) - 0.9, sExam], [S(34) - 1.0, sResult],
    [S(36) - 0.6, sLesson], [S(38) - 0.5, sRecap], [S(39) - 0.6, sBA], [E(39) + 1.2, sCTA], [1e9, t => sEndScreen(t, E(39) + 1.2)],
  ];
}
let CUTS = null;
function render(t) {
  const end = window.TL.duration;
  CUTS = CUTS || cuts();
  let o = "";
  for (const [until, fn] of CUTS) if (t < until) { o += fn(t); break; }
  o += `<rect width="${W}" height="${H}" fill="url(#gVignette)" opacity="0.6"/>`;
  for (const [x] of CUTS.slice(0, -1)) o += `<rect width="${W}" height="${H}" fill="#000" opacity="${dip(t, x - 0.25, x, x, x + 0.25)}"/>`;
  o += captions2(t);
  o += `<rect width="${W}" height="${H}" fill="#000" opacity="${Math.max(1 - seg(t, 0, 0.5), seg(t, end - 0.6, end))}"/>`;
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
