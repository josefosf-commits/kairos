// NINGUÉM VIU. — o ano que ninguém viu (vídeo longo, 1920x1080)
const W = 1920, H = 1080, REDC = "#e5484d", LAMP = "#ffd38a", PINK = "#ff6fae";
const cam2 = (cx, cy, s, inner) => `<g transform="translate(960 540) scale(${s}) translate(${-cx} ${-cy})">${inner}</g>`;
const room = (inner, dx = 0, dy = 0, s = 1) => `<g transform="translate(${960 + dx} ${540 + dy}) scale(${s}) translate(-960 -540)">${inner}</g>`;
const dark = (op, c = "#000") => op > 0 ? `<rect width="${W}" height="${H}" fill="${c}" opacity="${op}"/>` : "";
const black = () => `<rect width="${W}" height="${H}" fill="#0b0c10"/>`;
function chip(t, a, label, col = CREAM, x = 960, y = 150, size = 64) {
  const p = pop(t, a); if (p <= 0 || window.THUMB) return "";
  const w = label.length * size * 0.52 + 90;
  return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.8}" width="${w}" height="${size * 1.6}" rx="${size * 0.8}" fill="#07080b" opacity="0.88" stroke="${col}" stroke-width="5"/>${txt(label, 0, 0, size, col)}</g>`;
}

// ---------- the night room: lamp, desk, clock ----------
function lampGlow(k = 1) { return `<ellipse cx="960" cy="560" rx="620" ry="420" fill="url(#gLamp)" opacity="${0.55 * k}" style="mix-blend-mode:screen"/>`; }
function lamp() { return `<g><path d="M 1250 640 L 1250 520 L 1190 470" fill="none" stroke="#2a2f3a" stroke-width="12" stroke-linecap="round"/><path d="M 1150 440 L 1230 450 L 1205 500 L 1135 485 Z" fill="#3a3f4a" stroke="${INK}" stroke-width="6"/><rect x="1215" y="630" width="70" height="14" rx="5" fill="#2a2f3a" stroke="${INK}" stroke-width="5"/></g>`; }
function books(n) { let o = ""; for (let i = 0; i < n; i++) o += `<rect x="${600 + (i % 2) * 8}" y="${618 - i * 22}" width="150" height="22" rx="4" fill="${["#8c4a2f", "#3e63dd", "#30a46c", "#ffc53d", "#8b6ad8", "#e5484d"][i % 6]}" stroke="${INK}" stroke-width="4"/>`; return o; }
function nightRoom(t, q = {}) {
  let w = roomBg(q.day || 0, q.warm || 0);
  if (q.clock !== undefined) w += clockAt(1560, 260, q.clock);
  if (q.wall) w += q.wall;
  w += lampGlow(q.glow === undefined ? 1 : q.glow);
  w += josephFront(t, Object.assign({ desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610] }, q.J || {}));
  w += lamp() + books(q.books === undefined ? 4 : q.books);
  if (q.tears) w += tears(t);
  return room(w, q.dx || 0, q.dy || 120, q.s || 1.15);
}
function tears(t) { let o = ""; for (const x of [912, 1008]) for (let i = 0; i < 2; i++) { const k = ((t * 0.8 + i * 0.5) % 1); o += `<ellipse cx="${x + (x < 960 ? -6 : 6) * k}" cy="${425 + k * 90}" rx="7" ry="11" fill="#9fd8ff" stroke="${INK}" stroke-width="2" opacity="${1 - k * 0.7}"/>`; } return o; }

// ---------- the night street: one lit window ----------
function street(t, lit, extra = 0) {
  let o = `<defs><linearGradient id="gNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#070a16"/><stop offset="100%" stop-color="#1a2240"/></linearGradient></defs><rect x="-400" y="-400" width="2720" height="1880" fill="url(#gNight)"/>`;
  for (let i = 0; i < 60; i++) o += `<circle cx="${hash(i) * 1920}" cy="${hash(i + 70) * 420}" r="${1.5 + hash(i + 3) * 2}" fill="#fff" opacity="${0.3 + 0.6 * Math.abs(Math.sin(t * 0.8 + i))}"/>`;
  o += `<circle cx="1580" cy="170" r="60" fill="#e8e2d0"/><circle cx="1605" cy="155" r="58" fill="#0d1226"/>`;
  const houses = [[60, 360, 300], [380, 300, 380], [700, 340, 330], [1060, 280, 420], [1380, 330, 340], [1700, 280, 300]];
  houses.forEach(([x, w, h], i) => {
    o += `<rect x="${x}" y="${860 - h}" width="${w}" height="${h}" fill="${["#161b2c", "#1b2133", "#141929"][i % 3]}" stroke="#070a12" stroke-width="5"/><path d="M ${x - 20} ${860 - h} L ${x + w / 2} ${800 - h - 40} L ${x + w + 20} ${860 - h} Z" fill="#10131f" stroke="#070a12" stroke-width="5"/>`;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
      const wx = x + 40 + c * (w - 140), wy = 860 - h + 60 + r * 130, me = i === 3 && r === 0 && c === 1;
      const on = me ? lit : extra > 0 && hash(i * 7 + r * 3 + c) < extra ? 1 : 0;
      o += `<rect x="${wx}" y="${wy}" width="90" height="90" rx="6" fill="${on ? LAMP : "#0b0e18"}" stroke="#070a12" stroke-width="5"/>`;
      if (on) o += `<rect x="${wx - 50}" y="${wy - 50}" width="190" height="190" fill="url(#gLamp)" opacity="${0.5 * on}" style="mix-blend-mode:screen"/>`;
    }
  });
  o += `<rect x="-400" y="860" width="2720" height="600" fill="#0a0c14"/>`;
  return o;
}

// ---------- phone (screen space) ----------
function phonePost(x, y, s, t, title, likes, o = {}) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-160" y="-290" width="320" height="580" rx="36" fill="#14161a" stroke="#000" stroke-width="8"/><rect x="-140" y="-260" width="280" height="520" rx="20" fill="${o.bg || "#1d2333"}"/>`;
  g += `<circle cx="-100" cy="-215" r="22" fill="${JOSEPH.skin}" stroke="#000" stroke-width="3"/><text class="sans" x="-66" y="-207" font-size="22" font-weight="800" fill="#fff">joseph</text>`;
  g += `<rect x="-120" y="-180" width="240" height="300" rx="12" fill="${o.photo || "#3e63dd"}"/><text class="hand" x="0" y="-20" font-size="${title.length > 14 ? 30 : 40}" text-anchor="middle" fill="#fff">${title}</text>`;
  g += `<path d="M -110 175 c -14 -14 -32 4 0 26 c 32 -22 14 -40 0 -26 Z" fill="${likes > 0 ? REDC : "#5a606b"}"/><text class="sans" x="-70" y="200" font-size="34" font-weight="800" fill="#fff">${likes}</text>`;
  if (o.comment) g += `<text class="sans" x="-120" y="240" font-size="20" fill="#8f99a3">${o.comment}</text>`;
  return g + `</g>`;
}
function message(x, y, s, who, text, mine, op = 1) {
  const w = text.length * 15 + 60;
  return `<g opacity="${op}" transform="translate(${x} ${y}) scale(${s})"><rect x="${mine ? -w : 0}" y="-34" width="${w}" height="68" rx="34" fill="${mine ? "#30a46c" : "#2a3140"}"/><text class="sans" x="${mine ? -w / 2 : w / 2}" y="9" font-size="26" font-weight="700" text-anchor="middle" fill="#fff">${text}</text>${who ? `<text class="sans" x="10" y="-44" font-size="20" fill="#8f99a3">${who}</text>` : ""}</g>`;
}

// ---------- laptop with the result ----------
function laptopScreen(t, inner) {
  return `<g><rect x="360" y="150" width="1200" height="720" rx="30" fill="#14161a" stroke="#000" stroke-width="10"/><rect x="395" y="185" width="1130" height="650" rx="10" fill="#f6f1e6"/><clipPath id="lap"><rect x="395" y="185" width="1130" height="650" rx="10"/></clipPath><g clip-path="url(#lap)">${inner}</g><rect x="250" y="870" width="1420" height="40" rx="14" fill="#2a2f3a" stroke="#000" stroke-width="8"/></g>`;
}
function resultBar() { return `<rect x="395" y="185" width="1130" height="80" fill="#3e63dd"/><text class="sans" x="440" y="238" font-size="34" font-weight="800" fill="#fff">RESULTADO · LISTA DE APROVADOS</text>`; }

// ---------- the exam hall ----------
function examHall(t, q = {}) {
  let w = `<rect x="-600" y="-400" width="3120" height="1260" fill="#2a2f3a"/><rect x="-600" y="860" width="3120" height="700" fill="#181b22"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="6"/>`;
  w += `<rect x="300" y="120" width="1320" height="300" rx="10" fill="#22352b" stroke="#6b4a2f" stroke-width="16"/><text class="hand" x="700" y="230" font-size="70" text-anchor="middle" fill="#e8efe6">${q.board || "PROVA"}</text>`;
  w += clockAt(1760, 230, q.clock || 13 * 60);
  for (const x of [260, 1660]) { const P = Object.assign({ x, c: { skin: "#c9a27e", skinD: "#a9825e", hood: "#4a5060", hoodD: "#3a404c", hair: "#2a2420", style: "short" } }, face({ look: [0, 12], lid: 0.3 })); w += `<g opacity="0.75">${personBack(P) + personHead(P, t)}</g><rect x="${x - 200}" y="640" width="400" height="30" fill="#3a2f28" stroke="${INK}" stroke-width="6"/>`; }
  w += josephFront(t, Object.assign({ desk: true, hR: [1030, 615], hL: [890, 620] }, q.J || {}));
  w += `<g transform="translate(960 625) rotate(-4)"><rect x="-90" y="-20" width="180" height="40" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;
  if (q.sweat) w += `<path d="M 1035 330 q 10 18 0 28 q -10 -10 0 -28 Z" fill="#9fd8ff" stroke="${INK}" stroke-width="3"/>`;
  return room(w, 0, 140, 1.15);
}
function examPaper(t, a, q = {}) {
  const p = pop(t, a); if (p <= 0) return "";
  let o = `<g transform="translate(${q.x || 1450} ${q.y || 520}) rotate(3) scale(${p * (q.s || 1)})"><rect x="-260" y="-320" width="520" height="640" rx="10" fill="#fdfbf5" stroke="${INK}" stroke-width="7"/>`;
  o += `<text class="hand" x="-220" y="-250" font-size="44" fill="${INK}">QUESTÃO 1</text>`;
  for (let i = 0; i < 4; i++) o += `<rect x="-220" y="${-210 + i * 34}" width="${440 - (i % 2) * 90}" height="12" rx="6" fill="#c9c2b4"/>`;
  ["A", "B", "C", "D", "E"].forEach((l, i) => { const y = -40 + i * 62, pick = q.pick === i; o += `<circle cx="-190" cy="${y}" r="22" fill="${pick ? GREEN : "#fff"}" stroke="${INK}" stroke-width="4"/><text class="hand" x="-190" y="${y + 10}" font-size="28" text-anchor="middle" fill="${pick ? "#fff" : INK}">${l}</text><rect x="-150" y="${y - 6}" width="${280 - i * 20}" height="12" rx="6" fill="#d9d3c6"/>`; });
  if (q.marks) o += `<text class="hand" x="150" y="-150" font-size="140" fill="${REDC}" opacity="0.85">?</text>`;
  return o + `</g>`;
}

// ---------- calendar wall of Xs ----------
function wallX(x, y, cell, cols, rows, n, t, col = REDC) {
  let o = `<g transform="translate(${x} ${y})">`;
  for (let i = 0; i < cols * rows; i++) {
    const cx = (i % cols) * cell, cy = Math.floor(i / cols) * cell, k = cl(n - i);
    o += `<rect x="${cx + 3}" y="${cy + 3}" width="${cell - 6}" height="${cell - 6}" rx="4" fill="#f6f1e6" opacity="0.9"/>`;
    if (k > 0) { const m = cell * 0.24; o += `<path d="M ${cx + m} ${cy + m} L ${cx + cell - m} ${cy + cell - m} M ${cx + cell - m} ${cy + m} L ${cx + m} ${cy + cell - m}" stroke="${col}" stroke-width="${cell * 0.13}" stroke-linecap="round" opacity="${k}"/>`; }
  }
  return o + `</g>`;
}

// ---------- icons for the 3 changes ----------
const ICON3 = {
  clock: c => `<circle r="80" fill="#f6f1e6" stroke="#000" stroke-width="8"/><line x1="0" y1="0" x2="0" y2="-52" stroke="#000" stroke-width="10" stroke-linecap="round"/><line x1="0" y1="0" x2="40" y2="0" stroke="#000" stroke-width="10" stroke-linecap="round"/><circle r="10" fill="${c}"/>`,
  timer: c => `<circle r="80" fill="#12151c" stroke="#000" stroke-width="8"/><path d="M 0 -64 A 64 64 0 1 1 -45 45" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/><text class="sans" x="0" y="16" font-size="46" font-weight="800" text-anchor="middle" fill="#fff">25</text>`,
  paper: c => `<rect x="-62" y="-80" width="124" height="160" rx="8" fill="#fdfbf5" stroke="#000" stroke-width="7"/><path d="M -36 -40 L 36 -40 M -36 -10 L 36 -10 M -36 20 L 10 20" stroke="#c9c2b4" stroke-width="8" stroke-linecap="round"/><path d="M -10 52 L 6 66 L 40 30" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`,
};
function scoreChart(t, a, b) {
  const pts = [[0, 520], [1, 548], [2, 539], [3, 590], [4, 612], [5, 655], [6, 690], [7, 741]];
  const k = seg(t, a, b), n = k * (pts.length - 1);
  const X = i => 360 + i * 170, Y = v => 820 - (v - 480) * 1.9;
  let o = `<rect x="280" y="200" width="1360" height="700" rx="24" fill="#12151c" stroke="#2a3140" stroke-width="5"/><text class="hand" x="340" y="270" font-size="52" fill="${CREAM}">NOTAS DOS SIMULADOS</text>`;
  o += `<line x1="340" y1="${Y(707)}" x2="1600" y2="${Y(707)}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="16 12"/><text class="hand" x="1590" y="${Y(707) - 14}" font-size="34" text-anchor="end" fill="${GOLD}">nota de corte</text>`;
  let d = "";
  for (let i = 0; i <= Math.floor(n); i++) d += `${i ? "L" : "M"} ${X(i)} ${Y(pts[i][1])} `;
  const fi = Math.floor(n), fr = n - fi;
  if (fi < pts.length - 1) d += `L ${lerp(X(fi), X(fi + 1), fr)} ${lerp(Y(pts[fi][1]), Y(pts[fi + 1][1]), fr)}`;
  o += `<path d="${d}" fill="none" stroke="${GREEN}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (let i = 0; i <= Math.floor(n); i++) o += `<circle cx="${X(i)}" cy="${Y(pts[i][1])}" r="12" fill="${GREEN}" stroke="#000" stroke-width="4"/>`;
  ["FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET"].forEach((m, i) => { o += `<text class="sans" x="${X(i)}" y="870" font-size="26" text-anchor="middle" fill="#8f99a3">${m}</text>`; });
  return o;
}

// ---------- scenes ----------
function sOpen(t) {
  // L1: the street, one lit window; zoom into it. L2–3: inside.
  if (t < S(2) - 0.3) {
    const z = kf(t, [[0, 1], [S(2) - 0.3, 2.3]]);
    return cam2(lerp(960, 1325, seg(t, 0.5, S(2) - 0.3)), lerp(540, 330, seg(t, 0.5, S(2) - 0.3)), z, street(t, seg(t, 0.4, 1.4)));
  }
  const tired = t > S(3) + 3.6;
  let o = nightRoom(t, { clock: 120 + (t - S(2)) * 2, books: t > S(3) + 1.6 ? 6 : 4, J: { face: { look: [0, 9], lid: tired ? 0.55 : blink(t, 0.15), bags: tired ? 1 : 0.5, browSad: tired ? 0.8 : 0, smile: tired ? -4 : 0 } } });
  o += chip(t, S(2) - 0.1, "02:00", LAMP, 300, 150);
  if (t > S(3) - 0.2) {
    const items = [["as noites", S(3) + 0.2], ["os cadernos", S(3) + 1.6], ["quase desistiu", S(3) + 3.4]];
    items.forEach(([s, a], i) => { if (t > a) o += txt(`ninguém viu ${s}`, 1560, 520 + i * 80, 46, i === 2 ? REDC : CREAM, 1, pop(t, a)); });
  }
  return o;
}
function sOneYear(t) {
  return black() + txt("UM ANO", 960, 460, 120, CREAM, 1, pop(t, S(4) + 1.0)) + txt("QUE NINGUÉM VIU.", 960, 600, 100, LAMP, 1, pop(t, S(4) + 1.6));
}
function sTitle(t, a) { return black() + titleCard(t, a, "NINGUÉM VIU.", LAMP, 200); }
function sJanuary(t) {
  let w = roomBg(0.8, 0.2);
  const p = pop(t, S(5) + 2.0);
  w += `<g transform="translate(1420 360) rotate(-3) scale(${p})"><rect x="-170" y="-130" width="340" height="260" rx="10" fill="#fff7c2" stroke="${INK}" stroke-width="7"/><text class="hand" x="0" y="-50" font-size="44" text-anchor="middle" fill="${INK}">META:</text><text class="hand" x="0" y="20" font-size="50" text-anchor="middle" fill="${REDC}">FACULDADE</text><text class="hand" x="0" y="80" font-size="34" text-anchor="middle" fill="#5a606b">dos sonhos</text></g>`;
  w += josephFront(t, { face: { smile: 10, browAng: 0.5, look: [8, -2], lid: blink(t, 0.06) } });
  return room(w, -120, 160, 1.2) + chip(t, S(5) - 0.2, "JANEIRO · ANO 1", GOLD, 330, 150, 52);
}
function sStory(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  const likes = Math.round(lerp(0, 50, seg(t, S(6) + 1.8, S(6) + 3.2)));
  const fade = seg(t, S(7) - 0.2, S(7) + 0.8);
  o += `<g opacity="${1 - 0.6 * fade}">${phonePost(700, 520, 1.45, t, "ESSE ANO É MEU", likes, { photo: "#e5484d", comment: "\"vai com tudo!!\" \"orgulho\"" })}</g>`;
  for (let i = 0; i < 8; i++) { const k = cl((t - S(6) - 1.8 - i * 0.18) / 1.6); if (k > 0 && k < 1 && fade < 0.5) o += `<path transform="translate(${560 + hash(i) * 260} ${780 - k * 520}) scale(${1.2 - k * 0.4})" d="M 0 0 c -14 -14 -32 4 0 26 c 32 -22 14 -40 0 -26 Z" fill="${REDC}" opacity="${1 - k}"/>`; }
  o += txt("50 curtidas", 1350, 420, 70, PINK, 1, pop(t, S(6) + 3.0));
  o += txt("todo mundo apoiou", 1350, 520, 54, CREAM, seg(t, S(6) + 4.0, S(6) + 4.4));
  if (t > S(7)) o += txt("MAS APLAUSO", 1350, 420 + 0, 90, CREAM, 1, pop(t, S(7))) + txt("NÃO ESTUDA POR VOCÊ.", 1350, 540, 70, LAMP, 1, pop(t, S(7) + 0.8));
  return t > S(7) ? o.replace(txt("50 curtidas", 1350, 420, 70, PINK, 1, pop(t, S(6) + 3.0)), "").replace(txt("todo mundo apoiou", 1350, 520, 54, CREAM, seg(t, S(6) + 4.0, S(6) + 4.4)), "") : o;
}
function sFriends(t) {
  const apr = t > S(8) + 2.8;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  for (let i = 0; i < 14; i++) o += `<circle cx="${hash(i) * 1920}" cy="${hash(i + 5) * 500}" r="${30 + hash(i + 9) * 50}" fill="${["#ff6fae", "#4fd1ff", "#ffc53d", "#8b6ad8"][i % 4]}" opacity="${0.18 + 0.12 * Math.sin(t * 3 + i)}"/>`;
  const PL = Object.assign({ x: 1320, c: FRIEND }, face({ smile: 14, look: [-10, 0], browUp: 6, lid: blink(t, 0.06, 1) }));
  const PJ = Object.assign({ x: 640, c: JOSEPH }, face({ smile: 10, look: [10, 0], lid: blink(t, 0.06) }));
  o += room(personBack(PJ) + personHead(PJ, t) + personBack(PL) + personHead(PL, t), 0, 160, 1.0);
  o += message(1400, 240, 1.2, "Lucas", "bora sair hoje?", false, seg(t, S(8), S(8) + 0.4));
  o += chip(t, S(8) - 0.2, apr ? "ABRIL" : "MARÇO", apr ? PINK : "#4fd1ff", 300, 150, 56);
  if (apr) o += txt("de novo.", 960, 300, 70, CREAM, 1, pop(t, S(8) + 3.0));
  return o;
}
function sMay(t) {
  let w = roomBg(0.5, 0.1) + `<rect x="1300" y="560" width="260" height="20" fill="#3a2f28" stroke="${INK}" stroke-width="5"/>` + `<g opacity="0.6">${books(5).replace(/x="60/g, 'x="135')}</g>`;
  w += josephFront(t, { blanket: true, hR: HOLD.hR, hL: HOLD.hL, phone: { pc: HOLD.pc, held: 1, on: true, mode: "feed" }, face: { look: [0, 12], lid: 0.4, smile: -2 } });
  let o = room(w, 0, 140, 1.15) + chip(t, S(9) - 0.2, "MAIO", "#8f99a3", 300, 150, 56);
  const v = lerp(0.6, 0.08, seg(t, S(9) + 2.0, E(9)));
  o += `<g transform="translate(1480 400)"><rect x="-230" y="-80" width="460" height="160" rx="24" fill="#07080b" opacity="0.88"/><text class="hand" x="-190" y="-20" font-size="40" fill="#cfd8e3">VONTADE</text><rect x="-190" y="10" width="380" height="36" rx="18" fill="#1a1f29"/><rect x="-190" y="10" width="${380 * v}" height="36" rx="18" fill="${v < 0.2 ? REDC : GOLD}"/></g>`;
  return o;
}
function sExam1(t) {
  const lost = t > S(11) + 1.6;
  let o = examHall(t, { clock: 13 * 60 + (t - S(10)) * 3, sweat: lost, J: { face: { look: [0, 12], browSad: lost ? 1 : 0, browUp: lost ? 6 : 0, smile: lost ? -6 : 0, lid: blink(t, 0.08), mouthOpen: lost ? 0.2 : 0 } } });
  o += chip(t, S(10) - 0.4, "NOVEMBRO · ANO 1", REDC, 330, 150, 50);
  if (t > S(11)) o += examPaper(t, S(11) + 0.2, { marks: lost });
  return o;
}
function sResult1(t) {
  let inner = resultBar();
  const k = seg(t, S(12) + 0.4, S(12) + 1.2);
  inner += `<g opacity="${k}"><text class="sans" x="960" y="430" font-size="56" font-weight="800" text-anchor="middle" fill="${INK}">Joseph</text><rect x="660" y="490" width="600" height="110" rx="20" fill="${REDC}"/><text class="sans" x="960" y="565" font-size="58" font-weight="800" text-anchor="middle" fill="#fff">NÃO APROVADO</text></g>`;
  if (t > S(13) - 0.3) inner += `<g transform="translate(960 730) scale(${pop(t, S(13) - 0.2)})"><text class="sans" x="0" y="0" font-size="60" font-weight="800" text-anchor="middle" fill="${REDC}">faltaram 12 pontos</text></g>`;
  return `<rect width="${W}" height="${H}" fill="#0d0f14"/>` + laptopScreen(t, inner);
}
function sCeiling(t) {
  let w = roomBg(0.02, 0) + `<rect x="1190" y="640" width="220" height="260" fill="#2c241f" stroke="${INK}" stroke-width="7"/><rect x="1260" y="600" width="70" height="14" rx="4" fill="#14161a" stroke="${INK}" stroke-width="4"/>`;
  w += josephFront(t, { blanket: true, face: { look: [0, -14], lid: 0.25, browSad: 1, smile: -6 } });
  let o = room(w, 0, 160, 1.2) + dark(0.35, "#05070d");
  o += chip(t, S(14) + 0.8, "celular desligado", "#8f99a3", 1500, 180, 40);
  if (t > S(15) - 0.2) {
    const k = seg(t, S(15), S(15) + 0.6) * (1 - seg(t, E(15) + 0.3, E(15) + 0.8));
    o += dark(0.4 * k, "#12060a");
    o += `<g transform="translate(${960 + Math.sin(t * 7) * 3} 250)">${txt("talvez você não seja", 0, 0, 70, "#b13438", k)}${txt("inteligente o suficiente...", 0, 100, 70, "#b13438", k)}</g>`;
  }
  return o;
}
function sMethod(t) {
  let o = black();
  o += txt("O PROBLEMA NUNCA FOI", 960, 380, 80, "#8f99a3", seg(t, S(16), S(16) + 0.4));
  o += txt("a inteligência", 960, 500, 90, "#8f99a3", seg(t, S(16) + 0.8, S(16) + 1.2));
  const x = seg(t, S(16) + 1.8, S(16) + 2.2);
  if (x > 0) o += `<line x1="680" y1="490" x2="${lerp(680, 1240, x)}" y2="490" stroke="${REDC}" stroke-width="12" stroke-linecap="round"/>`;
  o += txt("FOI O MÉTODO.", 960, 680, 130, GREEN, 1, pop(t, S(16) + 2.4));
  return o;
}
function sYear2(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += chip(t, S(17) - 0.3, "ANO 2", GREEN, 960, 150, 64);
  o += `<g transform="translate(960 580) rotate(-2) scale(${pop(t, S(17) + 1.6)})"><rect x="-420" y="-300" width="840" height="600" rx="20" fill="#f6f1e6" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 11; i++) o += `<line x1="-380" y1="${-180 + i * 48}" x2="380" y2="${-180 + i * 48}" stroke="#c6d4e6" stroke-width="3"/>`;
  o += `<text class="hand" x="0" y="-210" font-size="70" text-anchor="middle" fill="${GREEN}">3 MUDANÇAS</text>`;
  for (let i = 0; i < 3; i++) { const k = seg(t, S(17) + 2.4 + i * 0.4, S(17) + 2.7 + i * 0.4); o += `<g opacity="${k}"><circle cx="-300" cy="${-90 + i * 140}" r="40" fill="${[GOLD, ACC, GREEN][i]}" stroke="${INK}" stroke-width="5"/><text class="hand" x="-300" y="${-74 + i * 140}" font-size="54" text-anchor="middle" fill="${INK}">${i + 1}</text><line x1="-230" y1="${-80 + i * 140}" x2="330" y2="${-80 + i * 140}" stroke="#8a8478" stroke-width="6" stroke-dasharray="14 12"/></g>`; }
  o += `</g>`;
  o += txt("sem postar nada.", 1600, 330, 46, "#8f99a3", seg(t, S(17) + 0.4, S(17) + 0.8));
  return o;
}
function sRule1(t) {
  const a = S(18) - 0.3, demo = S(18) + 3.6, end = S(19) - 0.3;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
    days.forEach((d, i) => { const p = pop(t, demo + 0.2 + i * 0.2); if (p <= 0) return; o += `<g transform="translate(${460 + i * 200} 470) scale(${p})"><rect x="-80" y="-120" width="160" height="240" rx="18" fill="#12151c" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="0" y="-70" font-size="38" text-anchor="middle" fill="#cfd8e3">${d}</text><text class="sans" x="0" y="0" font-size="44" font-weight="800" text-anchor="middle" fill="${GOLD}">06:00</text><g transform="translate(0 70) scale(0.42)">${ICON.check(GREEN)}</g></g>`; });
    o += txt("com vontade ou sem vontade", 960, 760, 54, CREAM, seg(t, demo + 1.6, demo + 2.0));
  }
  return o + techCard(t, a, demo, end, 1, "MESMO HORÁRIO, TODO DIA", "o horário decide, não o humor", ICON3.clock(GOLD), GOLD);
}
function sRule2(t) {
  const a = S(19) - 0.3, demo = S(19) + 3.4, end = S(20) - 0.3;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    o += room(nightRoom(t, { day: 0.7, warm: 0.2, glow: 0.3, J: { face: { look: [0, 9], smile: 4, lid: blink(t, 0.06) } } }), -420, 0, 0.7);
    const frac = cl((t - demo) / (end - demo));
    o += timerFace(1380, 380, 140, 1 - frac, `${24 - Math.floor(frac * 24)}:${String(59 - Math.floor((frac * 1440) % 60)).padStart(2, "0")}`, ACC);
    o += `<g transform="translate(1380 720)"><rect x="-260" y="-80" width="520" height="160" rx="24" fill="#12151c" stroke="#3a4150" stroke-width="4"/><g transform="translate(-180 0) scale(0.6)">${ICON.phone(REDC)}</g><text class="hand" x="40" y="-6" font-size="38" text-anchor="middle" fill="#cfd8e3">celular:</text><text class="hand" x="40" y="44" font-size="38" text-anchor="middle" fill="${REDC}">outro cômodo</text></g>`;
    o += chip(t, demo + 2.4, "4 BLOCOS POR DIA", ACC, 1380, 150, 48);
  }
  return o + techCard(t, a, demo, end, 2, "BLOCOS DE 25 MINUTOS", "celular em outro cômodo", ICON3.timer(ACC), ACC);
}
function sRule3(t) {
  const a = S(20) - 0.3, demo = S(20) + 2.6, end = S(21) - 0.3;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    o += chip(t, demo, "TODA SEXTA", GREEN, 960, 140, 56);
    o += examPaper(t, demo + 0.2, { x: 620, y: 540, marks: true, s: 0.82 });
    o += `<path d="M 920 600 L 1060 600" stroke="${GOLD}" stroke-width="12" stroke-linecap="round" opacity="${seg(t, demo + 1.0, demo + 1.3)}"/><path d="M 1040 578 L 1066 600 L 1040 622" fill="none" stroke="${GOLD}" stroke-width="12" stroke-linecap="round" opacity="${seg(t, demo + 1.0, demo + 1.3)}"/>`;
    o += examPaper(t, demo + 1.2, { x: 1350, y: 540, pick: 2, s: 0.82 });
    o += txt("errar no treino", 620, 885, 46, REDC, seg(t, demo + 0.4, demo + 0.8)) + txt("acertar no dia", 1350, 885, 46, GREEN, seg(t, demo + 1.6, demo + 2.0));
  }
  return o + techCard(t, a, demo, end, 3, "TODA SEXTA: PROVA ANTIGA", "errar no treino pra não errar no dia", ICON3.paper(GREEN), GREEN);
}
function sNo(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += `<g transform="translate(960 520)"><rect x="-330" y="-420" width="660" height="840" rx="50" fill="#14161a" stroke="#000" stroke-width="10"/><rect x="-300" y="-380" width="600" height="760" rx="26" fill="#0f141d"/></g>`;
  const msgs = [["Lucas", "bora sair hoje?", false, S(21)], [null, "hoje não", true, S(21) + 1.8], ["Ana", "festa sábado!!", false, S(21) + 2.4], [null, "hoje não", true, S(21) + 2.9]];
  const quiet = seg(t, S(22) - 0.2, S(22) + 1.2);
  msgs.forEach(([w, s, m, a], i) => { if (t > a) o += message(m ? 1220 : 700, 300 + i * 130, 1.1, w, s, m, 1 - 0.6 * quiet); });
  if (t > S(22)) o += txt("...", 960, 860, 120, "#5a606b", seg(t, S(22) + 0.4, S(22) + 0.8)) + txt("isso doeu.", 1560, 520, 60, "#cfd8e3", seg(t, S(22) + 1.6, S(22) + 2.0));
  return o;
}
function sWall(t) {
  let w = roomBg(0.15, 0) + wallX(220, 70, 46, 30, 4, lerp(10, 120, seg(t, S(23) + 0.4, E(23) + 0.3)), t);
  w += lampGlow(0.6) + josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 9], smile: 6, lid: blink(t, 0.06) } }) + lamp();
  return room(w, 0, 150, 1.1);
}
function sScores(t) { return `<rect width="${W}" height="${H}" fill="#0d0f14"/>` + scoreChart(t, S(24) - 0.2, E(24) + 0.2) + chip(t, S(24) + 3.2, "devagar. mas subiam.", GREEN, 1150, 140, 44); }
function sNobody(t) {
  if (t < S(26) - 0.3) {
    let o = `<rect width="${W}" height="${H}" fill="#151a24"/>` + phonePost(960, 520, 1.45, t, "(nenhum post)", 0, { bg: "#141826", photo: "#2a3140", comment: "0 comentários" });
    o += txt("ninguém viu.", 400, 360, 60, "#8f99a3", seg(t, S(25), S(25) + 0.3)) + txt("ninguém comentou.", 1520, 520, 56, "#8f99a3", seg(t, S(25) + 1.2, S(25) + 1.5)) + txt("ninguém deu like.", 420, 700, 56, "#8f99a3", seg(t, S(25) + 2.4, S(25) + 2.7));
    return o;
  }
  let o = nightRoom(t, { day: 0.45, warm: 0.8, glow: 0.4, J: { face: { look: [0, 9], smile: 6, lid: blink(t, 0.06) } } });
  o += chip(t, S(26) - 0.2, "06:00", GOLD, 300, 150);
  o += txt("A DISCIPLINA DE VERDADE", 1450, 330, 56, CREAM, 1, pop(t, S(26) + 0.4)) + txt("NÃO APARECE NO STORY.", 1450, 420, 56, LAMP, 1, pop(t, S(26) + 1.4));
  return o;
}
function sExam2(t) {
  const know = t > S(28) + 0.8;
  let o = examHall(t, { clock: 13 * 60 + (t - S(27)) * 3, J: { face: { look: [0, 12], smile: know ? 10 : 2, browAng: know ? 0.5 : 0.2, lid: blink(t, 0.08) } } });
  o += chip(t, S(27) - 0.4, "NOVEMBRO · ANO 2", GOLD, 330, 150, 50);
  if (t > S(28) && t < S(29) - 0.3) o += examPaper(t, S(28) + 0.2, { pick: know && t > S(28) + 3.4 ? 2 : -1 });
  if (t > S(28) + 2.4 && t < S(29) - 0.3) o += `<g transform="translate(1100 130) rotate(-6) scale(${pop(t, S(28) + 2.4)})"><rect x="-230" y="-50" width="460" height="100" rx="12" fill="none" stroke="${GREEN}" stroke-width="8"/><text class="hand" x="0" y="18" font-size="48" text-anchor="middle" fill="${GREEN}">JÁ FIZ ESSA!</text></g>`;
  if (t > S(29) - 0.3) o += txt("deu tudo.", 1450, 300, 90, GREEN, 1, pop(t, S(29) + 2.6));
  return o;
}
function sResult2(t) {
  let inner = resultBar();
  const names = ["Ana Beatriz S.", "Bruno M. Costa", "Carla Dias", "Davi Rocha", "Eduarda Lima", "Felipe Nunes", "Gabriel Souza", "Helena Prado", "Igor Melo", "João Victor P.", "Joseph", "Júlia Ramos", "Karen Alves", "Lucas Teixeira"];
  const scroll = kf(t, [[S(31) - 0.3, 0], [S(31) + 2.6, 440], [S(32) - 0.4, 560]]);
  names.forEach((n, i) => {
    const y = 330 + i * 80 - scroll, me = n === "Joseph", hl = me && t > S(32) - 0.2;
    if (y < 260 || y > 880) return;
    if (hl) inner += `<rect x="420" y="${y - 52}" width="1080" height="72" rx="12" fill="${GOLD}" opacity="${seg(t, S(32) - 0.2, S(32) + 0.3)}"/>`;
    inner += `<text class="sans" x="460" y="${y}" font-size="40" font-weight="${me ? 800 : 500}" fill="${INK}">${i + 1}. ${n}</text>`;
    if (hl && t > S(33) - 0.1) inner += `<text class="sans" x="1460" y="${y}" font-size="40" font-weight="800" text-anchor="end" fill="${GREEN}">APROVADO ✓</text>`;
  });
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>` + laptopScreen(t, inner);
  o += chip(t, S(30) - 0.3, "JANEIRO · RESULTADO", GOLD, 330, 90, 44);
  if (t > S(33) - 0.1) o += `<g transform="translate(1100 740) rotate(-8) scale(${0.75 * pop(t, S(33) - 0.1, 0.25)})" opacity="0.92"><rect x="-360" y="-90" width="720" height="180" rx="20" fill="none" stroke="${GREEN}" stroke-width="16"/><text class="hand" x="0" y="45" font-size="130" text-anchor="middle" fill="${GREEN}">APROVADO</text></g>`;
  return o;
}
function sCry(t) {
  return nightRoom(t, { clock: 2 * 60 + 10, tears: true, J: { hR: null, hL: null, book: null, face: { happy: 1, smile: 14, browSad: 0.6 } }, dy: 200, s: 1.35 }) + chip(t, S(34) + 0.2, "o mesmo quarto das 02:00", LAMP, 1460, 160, 40);
}
function sPost(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t < S(36) - 0.3) {
    const likes = Math.round(lerp(0, 847, seg(t, S(35) + 1.0, S(35) + 3.6)));
    o += phonePost(700, 520, 1.45, t, "APROVADO!", likes, { photo: GREEN, comment: "\"parabéns!!\" \"que orgulho\"" });
    for (let i = 0; i < 16; i++) { const k = cl((t - S(35) - 1.0 - i * 0.15) / 1.6); if (k > 0 && k < 1) o += `<path transform="translate(${520 + hash(i) * 320} ${800 - k * 600}) scale(${1.3 - k * 0.4})" d="M 0 0 c -14 -14 -32 4 0 26 c 32 -22 14 -40 0 -26 Z" fill="${REDC}" opacity="${1 - k}"/>`; }
    o += txt("centenas de parabéns", 1380, 480, 60, PINK, 1, pop(t, S(35) + 2.6));
    return o;
  }
  o = black();
  o += txt("Todo mundo viu o resultado.", 960, 400, 80, "#cfd8e3", seg(t, S(36) - 0.2, S(36) + 0.2));
  o += txt("NINGUÉM VIU O ANO.", 960, 600, 130, LAMP, 1, pop(t, S(36) + 1.6));
  return o;
}
function sYou(t) {
  const extra = lerp(0, 0.75, seg(t, S(37), E(38)));
  let o = cam2(960, 560, 1, street(t, 1, extra));
  o += txt("o seu ano que ninguém vê", 960, 140, 70, LAMP, seg(t, S(37) + 0.6, S(37) + 1.2));
  if (t > S(38)) o += txt("em silêncio. sem aplauso.", 960, 960 - 40, 50, "#cfd8e3", seg(t, S(38) + 3.2, S(38) + 3.6));
  return o;
}
function sRecap(t) {
  return black() + recapCards(t, S(39) - 0.4, S(40) - 0.4, "AS 3 MUDANÇAS:", [
    [S(39) + 2.2, "HORÁRIO", "mesmo horário, todo dia", ICON3.clock(GOLD), GOLD],
    [S(39) + 4.6, "25 MIN", "celular longe", ICON3.timer(ACC), ACC],
    [S(39) + 6.4, "SEXTA", "treina o dia da prova", ICON3.paper(GREEN), GREEN]]);
}
function sQuote(t) {
  return black() + txt("O RESULTADO APARECE.", 960, 420, 100, CREAM, 1, pop(t, S(40))) + txt("mas só pra quem continua", 960, 580, 70, "#cfd8e3", seg(t, S(40) + 1.8, S(40) + 2.2)) + txt("QUANDO NINGUÉM TÁ VENDO.", 960, 700, 90, LAMP, 1, pop(t, S(40) + 2.8));
}
function sCTA(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/><rect y="820" width="${W}" height="260" fill="#090a0e"/>` + lampGlow(0.3).replace('cx="960"', 'cx="480"');
  o += room(josephFront(t, { armsUp: seg(t, S(41) + 1.6, S(41) + 2.2), face: { happy: t > S(41) + 1.6 ? 1 : 0, smile: 12, look: [8, 2] } }), -480, 120, 0.9);
  o += `<g transform="translate(1300 330) scale(${pop(t, S(41) + 1.0) * (1 - 0.06 * dip(t, S(41) + 2.2, S(41) + 2.3, S(41) + 2.4, S(41) + 2.55))})"><rect x="-330" y="-85" width="660" height="170" rx="85" fill="${RED}" stroke="#000" stroke-width="8"/>${txt("INSCREVA-SE", 0, 0, 90, "#fff")}</g>`;
  o += txt("esse canal é pra você.", 1300, 480, 54, LAMP, seg(t, S(41) + 2.4, S(41) + 2.8));
  const k = pop(t, S(41) + 3.6);
  if (k > 0) o += `<g transform="translate(1300 680) scale(${k})"><rect x="-420" y="-90" width="840" height="180" rx="30" fill="#f6f1e6" stroke="${INK}" stroke-width="7"/><text class="hand" x="0" y="-12" font-size="46" text-anchor="middle" fill="${INK}">O que você tá construindo</text><text class="hand" x="0" y="52" font-size="46" text-anchor="middle" fill="${INK}">em silêncio?</text></g>`;
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
  return o + `</g>`;
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

function cuts() {
  return [
    [S(4) - 0.4, sOpen], [E(4) + 0.6, sOneYear], [S(5) - 0.5, t => sTitle(t, E(4) + 0.6)], [S(6) - 0.4, sJanuary], [S(8) - 0.4, sStory],
    [S(9) - 0.5, sFriends], [S(10) - 0.6, sMay], [S(12) - 0.5, sExam1], [S(14) - 0.5, sResult1], [S(16) - 0.4, sCeiling], [S(17) - 0.6, sMethod],
    [S(18) - 0.3, sYear2], [S(19) - 0.3, sRule1], [S(20) - 0.3, sRule2], [S(21) - 0.3, sRule3], [S(23) - 0.4, sNo], [S(24) - 0.4, sWall],
    [S(25) - 0.4, sScores], [S(27) - 0.7, sNobody], [S(30) - 0.6, sExam2], [S(34) - 0.5, sResult2], [S(35) - 0.4, sCry], [S(37) - 0.6, sPost],
    [S(39) - 0.5, sYou], [S(40) - 0.4, sRecap], [S(41) - 0.5, sQuote], [E(41) + 1.4, sCTA], [1e9, t => sEndScreen(t, E(41) + 1.4)],
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
