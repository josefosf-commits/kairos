// RECOMEÇA. — o pai do Joseph recomeça aos 43 (vídeo longo, 1920x1080, público 35–44)
const W = 1920, H = 1080, REDC = "#e5484d", BERRY = "#d1588a", NAVY = "#5b8cc4";
const DAD = { skin: "#9a6444", skinD: "#80503a", hood: "#2f4f6f", hoodD: "#233a52", hair: "#2e2a28", style: "short" };
const MOM = { skin: "#b07a52", skinD: "#946243", hood: "#a8466b", hoodD: "#83334f", hair: "#1f1410", style: "curly" };
const DOC = { skin: "#d9a47a", skinD: "#bf8a62", hood: "#f2f2f2", hoodD: "#d0d0d0", hair: "#8a8a8a", style: "short" };
const cam2 = (cx, cy, s, inner) => `<g transform="translate(960 540) scale(${s}) translate(${-cx} ${-cy})">${inner}</g>`;
const room = (inner, dx = 0, dy = 0, s = 1) => `<g transform="translate(${960 + dx} ${540 + dy}) scale(${s}) translate(-960 -540)">${inner}</g>`;
const dark = (op, c = "#000") => op > 0 ? `<rect width="${W}" height="${H}" fill="${c}" opacity="${op}"/>` : "";
const black = () => `<rect width="${W}" height="${H}" fill="#0b0c10"/>`;
function chip(t, a, label, col = CREAM, x = 960, y = 150, size = 64) {
  const p = pop(t, a); if (p <= 0 || window.THUMB) return "";
  const w = label.length * size * 0.52 + 90;
  return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.8}" width="${w}" height="${size * 1.6}" rx="${size * 0.8}" fill="#07080b" opacity="0.88" stroke="${col}" stroke-width="5"/>${txt(label, 0, 0, size, col)}</g>`;
}
function bubble(x, y, s, lines, col = INK, tail = "left") {
  const w = Math.max(...lines.map(l => l.length)) * 25 + 80, h = lines.length * 62 + 40;
  let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="34" fill="#fff" stroke="#000" stroke-width="7"/>`;
  const tx = tail === "left" ? -w / 2 + 70 : w / 2 - 70, dir = tail === "left" ? -1 : 1;
  o += `<path d="M ${tx - 30} ${h / 2 - 4} L ${tx + dir * 40} ${h / 2 + 60} L ${tx + 30} ${h / 2 - 4} Z" fill="#fff" stroke="#000" stroke-width="7" stroke-linejoin="round"/><rect x="${tx - 34}" y="${h / 2 - 14}" width="68" height="14" fill="#fff"/>`;
  lines.forEach((l, i) => { o += `<text class="hand" x="0" y="${-h / 2 + 64 + i * 62}" font-size="48" text-anchor="middle" fill="${col}">${l}</text>`; });
  return o + `</g>`;
}

// ---------- the family, front view (world coords) ----------
function dadFront(t, f = {}, x = 960, belly = 0) {
  const P = Object.assign({ x, c: DAD }, face(Object.assign({ lid: blink(t, 0.06, 0.7) }, f)));
  const dx = x - 960;
  let o = personBack(P);
  if (belly > 0) o += `<ellipse cx="${960 + dx}" cy="${660 + P.bob * 0.5}" rx="${150 * belly + 100 * (1 - belly)}" ry="${60 * belly}" fill="${DAD.hood}" stroke="${INK}" stroke-width="7"/><ellipse cx="${960 + dx}" cy="${660}" rx="${150 * belly}" ry="${60 * belly}" fill="${DAD.hood}"/>`;
  o += personHead(P, t);
  o += `<g transform="translate(${dx} ${P.bob})"><path d="M 925 448 Q 960 432 995 448 Q 980 462 960 454 Q 940 462 925 448 Z" fill="${DAD.hair}" stroke="${INK}" stroke-width="3"/><path d="M 890 360 q 4 -20 14 -26" stroke="#bdbdbd" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M 1030 360 q -4 -20 -14 -26" stroke="#bdbdbd" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
  return o;
}
function momFront(t, f = {}, x = 960) {
  const P = Object.assign({ x, c: MOM }, face(Object.assign({ lid: blink(t, 0.06, 1.7) }, f)));
  let o = personBack(P) + personHead(P, t);
  for (const ex of [884, 1036]) o += `<circle cx="${ex + x - 960}" cy="${432 + P.bob}" r="9" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>`;
  return o;
}
function jFront(t, f = {}, x = 960) { const P = Object.assign({ x, c: JOSEPH }, face(Object.assign({ lid: blink(t, 0.06, 2.3) }, f))); return personBack(P) + personHead(P, t); }
function docFront(t, f = {}, x = 960) {
  const P = Object.assign({ x, c: DOC }, face(Object.assign({ lid: blink(t, 0.06, 0.4) }, f)));
  return personBack(P) + `<path d="M ${x - 20} 560 L ${x - 10} 640 M ${x + 20} 560 L ${x + 10} 640" stroke="#3e63dd" stroke-width="8"/><circle cx="${x + 70}" cy="600" r="16" fill="#9aa3ad" stroke="${INK}" stroke-width="4"/>` + personHead(P, t) +
    `<g fill="none" stroke="${INK}" stroke-width="5"><circle cx="${x - 32}" cy="398" r="28"/><circle cx="${x + 32}" cy="398" r="28"/><line x1="${x - 4}" y1="398" x2="${x + 4}" y2="398"/></g>`;
}
function couch() { return `<rect x="560" y="560" width="800" height="170" rx="40" fill="#6b4a33" stroke="${INK}" stroke-width="8"/><rect x="520" y="620" width="880" height="160" rx="40" fill="#7a5640" stroke="${INK}" stroke-width="8"/>`; }

// ---------- doctor's office ----------
function office(t, q = {}) {
  let w = `<rect x="-600" y="-400" width="3120" height="1260" fill="#dfe6ea"/><rect x="-600" y="860" width="3120" height="700" fill="#b8c2c8"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="6"/>`;
  w += `<rect x="120" y="140" width="300" height="200" rx="10" fill="#fff" stroke="${INK}" stroke-width="6"/><path d="M 180 240 L 230 240 L 250 200 L 280 280 L 300 220 L 360 220" fill="none" stroke="${REDC}" stroke-width="8" stroke-linejoin="round"/>`;
  w += docFront(t, q.doc || {}, 1320);
  w += dadFront(t, q.dad || {}, 600, q.belly === undefined ? 1 : q.belly);
  w += `<rect x="300" y="660" width="1320" height="36" rx="6" fill="#8a6d4f" stroke="${INK}" stroke-width="7"/><rect x="340" y="696" width="26" height="200" fill="#6b5039"/><rect x="1554" y="696" width="26" height="200" fill="#6b5039"/>`;
  if (q.paper) w += `<g transform="translate(960 650) rotate(-3)"><rect x="-110" y="-26" width="220" height="40" fill="#fff" stroke="${INK}" stroke-width="4"/></g>`;
  return room(w, 0, 120, 1.1);
}
function examCard(t, a, rows, title, x = 1460, y = 470) {
  const p = pop(t, a); if (p <= 0) return "";
  let o = `<g transform="translate(${x} ${y}) rotate(2) scale(${p})"><rect x="-300" y="-250" width="600" height="${110 + rows.length * 110}" rx="16" fill="#fdfbf5" stroke="${INK}" stroke-width="7"/><text class="hand" x="0" y="-180" font-size="52" text-anchor="middle" fill="${INK}">${title}</text>`;
  rows.forEach(([lab, val, col, ra], i) => { const k = seg(t, ra, ra + 0.3); o += `<g opacity="${k}"><text class="sans" x="-260" y="${-90 + i * 110}" font-size="38" font-weight="700" fill="#5a606b">${lab}</text><text class="sans" x="260" y="${-90 + i * 110}" font-size="44" font-weight="800" text-anchor="end" fill="${col}">${val}</text></g>`; });
  return o + `</g>`;
}

// ---------- walking / running on the street (landscape) ----------
function street(t, q = {}) {
  const v = q.v || 200, dist = t * v;
  let w = streetBg(dist);
  if (q.night) w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#0d1226" opacity="${0.72 * q.night}"/>`;
  if (q.sunset) w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#ff8a3d" opacity="${0.16 * q.sunset}" style="mix-blend-mode:screen"/>`;
  if (q.rain) w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#1c2738" opacity="${0.55 * q.rain}"/>`;
  if (q.back) w += q.back(t);
  const rate = v / 250 * 2 * Math.PI, gait = cl(v / 300);
  for (const p of q.people || []) {
    const S0 = { x: p.x, dir: 1, groundY: p.gy || 840, gait: p.gait || gait, phase: t * (p.rate || rate) + (p.off || 0), lean: v > 300 ? 9 : 4, look: [6, 0], lid: blink(t, 0.08, p.off || 0), browUp: 0, browAng: p.ang || 0.2, browSad: p.sad || 0, pant: p.pant || 0, smile: p.smile || 6, c: p.c, bun: p.bun };
    w += p.sc ? `<g transform="translate(${p.x} ${p.gy}) scale(${p.sc}) translate(${-p.x} ${-p.gy})">${sidePerson(S0, t)}</g>` : sidePerson(S0, t);
    if (p.knee) w += `<circle cx="${p.x + 30}" cy="710" r="${36 + 10 * Math.sin(t * 12)}" fill="${REDC}" opacity="0.45" style="mix-blend-mode:screen"/>`;
  }
  let o = cam2(960, 560, q.zoom || 1, w);
  if (q.rain) o += rainL(t, q.rain);
  return o;
}
function rainL(t, amt) { let o = `<g opacity="${amt}" stroke="#9fb6d0" stroke-width="3.5" stroke-linecap="round">`; for (let i = 0; i < 110; i++) { const x = hash(i) * 2200 - 100, sp = 1500 + hash(i + 9) * 600, y = ((t * sp + hash(i + 3) * H) % (H + 200)) - 100; o += `<line x1="${x}" y1="${y}" x2="${x - 16}" y2="${y + 56}" opacity="${0.4 + 0.5 * hash(i + 7)}"/>`; } return o + `</g>`; }
function hudBox(label, sub, col = GOLD) { return `<g transform="translate(70 70)"><rect width="${Math.max(label.length * 34 + 60, (sub || "").length * 19 + 60, 320)}" height="${sub ? 150 : 100}" rx="24" fill="#07080b" opacity="0.85" stroke="${col}" stroke-width="5"/><text class="sans" x="30" y="70" font-size="54" font-weight="800" fill="${col}">${label}</text>${sub ? `<text class="hand" x="30" y="125" font-size="38" fill="#cfd8e3">${sub}</text>` : ""}</g>`; }

// ---------- icons ----------
const ICONR = {
  walk: c => `<circle r="80" fill="#12151c" stroke="#000" stroke-width="8"/><path d="M 0 -64 A 64 64 0 1 1 -45 45" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/><text class="sans" x="0" y="16" font-size="46" font-weight="800" text-anchor="middle" fill="#fff">10</text>`,
  swap: c => `<rect x="-100" y="-60" width="70" height="120" rx="12" fill="${REDC}" stroke="#000" stroke-width="6"/><path d="M -20 -20 L 20 -20 M 10 -32 L 22 -20 L 10 -8 M 20 20 L -20 20 M -10 8 L -22 20 L -10 32" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M 34 -50 L 96 -50 L 88 60 L 42 60 Z" fill="#cfefff" stroke="#000" stroke-width="6"/><circle cx="66" cy="-50" r="16" fill="#c6f135" stroke="#000" stroke-width="4"/>`,
  moon: c => `<path d="M 20 -70 A 72 72 0 1 0 70 34 A 56 56 0 1 1 20 -70 Z" fill="${c}" stroke="#000" stroke-width="7"/><text class="sans" x="10" y="100" font-size="40" font-weight="800" text-anchor="middle" fill="#fff">23h</text>`,
};
function swapCard(x, y, from, to, t, a) {
  const p = pop(t, a); if (p <= 0) return "";
  const k = seg(t, a + 0.6, a + 1.0);
  return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="-380" y="-90" width="760" height="180" rx="30" fill="#12151c" stroke="#3a4150" stroke-width="5"/>` +
    `<text class="hand" x="-190" y="16" font-size="50" text-anchor="middle" fill="#8f99a3">${from}</text><line x1="-300" y1="0" x2="${lerp(-300, -80, k)}" y2="0" stroke="${REDC}" stroke-width="8" opacity="${k}"/>` +
    `<path d="M -40 0 L 30 0 M 10 -20 L 32 0 L 10 20" fill="none" stroke="${GOLD}" stroke-width="10" stroke-linecap="round" opacity="${k}"/>` +
    `<text class="hand" x="200" y="16" font-size="50" text-anchor="middle" fill="${GREEN}" opacity="${k}">${to}</text></g>`;
}

// ---------- scenes ----------
function sCouch(t) {
  let w = roomBg(0.15, 0.3) + couch() + dadFront(t, { look: [0, 6], lid: 0.35, smile: -2, bags: 0.6 }, 960, 1) + `<ellipse cx="960" cy="440" rx="260" ry="220" fill="url(#gPhone)" opacity="0.25" style="mix-blend-mode:screen"/>`;
  let o = room(w, 0, 140, 1.15);
  o += chip(t, 0.4, "PAI DO JOSEPH · 43 ANOS", NAVY, 400, 120, 48);
  if (t > S(2) - 0.4) {
    const years = ["2016", "2018", "2020", "2022", "2024", "2026"];
    years.forEach((y, i) => { const a = S(2) - 0.2 + i * 0.14; if (t > a) o += `<g transform="translate(${1450 + (i % 2) * 120} ${280 + i * 85}) rotate(${-6 + (i % 3) * 5}) scale(${pop(t, a)})"><rect x="-200" y="-36" width="400" height="72" rx="12" fill="#fff7c2" stroke="#000" stroke-width="5"/><text class="hand" x="0" y="14" font-size="36" text-anchor="middle" fill="${INK}">${y}: "na segunda..."</text></g>`; });
  }
  return o;
}
function sReasons(t) {
  let w = roomBg(0.15, 0.3) + couch() + dadFront(t, { look: [0, 8], lid: 0.45, smile: -2, bags: 0.8 }, 960, 1);
  let o = room(w, 0, 140, 1.15);
  [["TRABALHO", "#4fd1ff", 380, 300], ["CONTAS", GOLD, 1540, 300], ["FILHO", BERRY, 340, 560], ["CANSAÇO", "#8f99a3", 1580, 560]].forEach(([s, c, x, y], i) => { o += chip(t, S(3) + 0.3 + i * 0.7, s, c, x, y, 56); });
  if (t > S(3) + 4.2) o += txt("sempre um motivo bom.", 960, 130, 60, CREAM, seg(t, S(3) + 4.4, S(3) + 4.8));
  return o;
}
function sDoctor1(t) {
  const silent = t < S(5) - 0.3;
  let o = office(t, { paper: true, doc: { look: [0, 12], smile: silent ? -2 : -4, browSad: 0.4 }, dad: { look: [10, 2], browUp: 6, smile: -2 } });
  o += chip(t, S(4) - 0.4, "TERÇA-FEIRA", "#cfd8e3", 330, 110, 44);
  if (silent && t > S(4) + 2.4) o += txt("...", 1320, 220, 120, CREAM, seg(t, S(4) + 2.6, S(4) + 3.0));
  if (!silent) o += examCard(t, S(5) - 0.2, [["PRESSÃO", "15 por 10 ⚠", REDC, S(5)], ["GLICOSE", "no limite ⚠", REDC, S(5) + 1.4], ["CONSELHO", "muda agora", GOLD, S(5) + 3.0]], "EXAMES", 960, 330);
  return o;
}
function sTitle(t, a) { return black() + titleCard(t, a, "RECOMEÇA.", GREEN, 220); }
function sNight(t) {
  const blanket = `<path d="M 480 1500 L 480 660 Q 960 600 1440 660 L 1440 1500 Z" fill="#3d4a6a" stroke="${INK}" stroke-width="7"/>`;
  let o = room(roomBg(0.02, 0) + clockAt(1560, 260, 3 * 60 + 10) + dadFront(t, { look: [0, -14], lid: 0.15, browSad: 1, smile: -4 }, 960, 0) + blanket, 0, 160, 1.2) + dark(0.3, "#05070d");
  if (t > S(7) - 0.2) { const k = seg(t, S(7), S(7) + 0.5); o += dark(0.3 * k, "#12060a") + `<g transform="translate(${960 + Math.sin(t * 7) * 3} 230)">${txt("na minha idade, não dá mais.", 0, 0, 66, "#b13438", k)}${txt("já passou o tempo.", 0, 90, 66, "#b13438", seg(t, S(7) + 2.4, S(7) + 2.9))}</g>`; }
  return o;
}
function sTogether(t) {
  let w = roomBg(0.1, 0.4) + couch() + dadFront(t, { look: [12, 2], browSad: t < S(8) + 3 ? 0.8 : 0, smile: t > S(8) + 4 ? 6 : -2 }, 700, 1) + jFront(t, { look: [-12, 2], smile: 8, browAng: 0.3 }, 1220);
  let o = room(w, 0, 140, 1.1);
  if (t > S(8) + 1.8) o += bubble(1250, 200, 1, ["pai, a gente começa junto."], INK, "right");
  if (t > S(8) + 4.0) o += txt("MAS COMEÇA PEQUENO.", 960, 900 - 40, 72, GOLD, 1, pop(t, S(8) + 4.2));
  return t > S(8) + 1.8 ? o.replace(bubble(1250, 200, 1, ["pai, a gente começa junto."], INK, "right"), `<g transform="translate(0 0)">${bubble(1250, 200, pop(t, S(8) + 1.8), ["pai, a gente começa junto."], INK, "right")}</g>`) : o;
}
function sMistake(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += txt("O ERRO DE QUEM RECOMEÇA DEPOIS DOS 40:", 960, 170, 60, "#cfd8e3", seg(t, S(9), S(9) + 0.4));
  o += txt("10 anos em 1 semana", 960, 330, 100, REDC, 1, pop(t, S(9) + 3.0));
  if (t > S(10) - 0.2) {
    [["ACADEMIA TODO DIA", S(10)], ["DIETA RADICAL", S(10) + 1.5]].forEach(([s, a], i) => { o += chip(t, a, s, "#8f99a3", 560 + i * 800, 560, 54); });
    if (t > S(10) + 3.0) o += `<g transform="translate(960 800) rotate(-6) scale(${pop(t, S(10) + 3.2)})"><rect x="-330" y="-80" width="660" height="160" rx="16" fill="none" stroke="${REDC}" stroke-width="12"/><text class="hand" x="0" y="34" font-size="96" text-anchor="middle" fill="${REDC}">SEMANA 2: DESISTE</text></g>`;
  }
  return o;
}
function sDeal(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  o += `<g transform="translate(960 560) rotate(-2) scale(${pop(t, S(11) - 0.4)})"><rect x="-420" y="-300" width="840" height="600" rx="20" fill="#f6f1e6" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 11; i++) o += `<line x1="-380" y1="${-180 + i * 48}" x2="380" y2="${-180 + i * 48}" stroke="#c6d4e6" stroke-width="3"/>`;
  o += `<text class="hand" x="0" y="-210" font-size="70" text-anchor="middle" fill="${NAVY}">3 COMBINADOS</text>`;
  for (let i = 0; i < 3; i++) { const k = seg(t, S(11) + 0.4 + i * 0.4, S(11) + 0.7 + i * 0.4); o += `<g opacity="${k}"><circle cx="-300" cy="${-90 + i * 140}" r="40" fill="${[GOLD, ACC, GREEN][i]}" stroke="${INK}" stroke-width="5"/><text class="hand" x="-300" y="${-74 + i * 140}" font-size="54" text-anchor="middle" fill="${INK}">${i + 1}</text><line x1="-230" y1="${-80 + i * 140}" x2="330" y2="${-80 + i * 140}" stroke="#8a8478" stroke-width="6" stroke-dasharray="14 12"/></g>`; }
  return o + `</g>`;
}
function sRule1(t) {
  const a = S(12) - 0.3, demo = S(12) + 3.0, end = S(13) - 0.3;
  let o = street(t, { night: 0.7, v: 130, people: [{ x: 760, c: DAD, pant: 0.4, smile: 2 }, { x: 1080, c: JOSEPH, off: 1.3, smile: 8 }] });
  if (t > demo) o += timerFace(1640, 240, 110, 1 - cl((t - demo) / (end - demo)), "10:00", ACC) + chip(t, demo + 0.6, "depois do jantar", "#cfd8e3", 360, 120, 46);
  return o + techCard(t, a, demo, end, 1, "10 MINUTOS, TODO DIA", "caminhada depois do jantar", ICONR.walk(GOLD), GOLD);
}
function sRule2(t) {
  const a = S(13) - 0.3, demo = S(13) + 2.8, end = S(14) - 0.3;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) { o += swapCard(960, 360, "refrigerante", "água com limão", t, demo + 0.2) + swapCard(960, 620, "pão da noite", "ovo", t, demo + 2.0); o += txt("não é cortar. é trocar.", 960, 840, 56, GOLD, seg(t, demo + 3.0, demo + 3.4)); }
  return o + techCard(t, a, demo, end, 2, "TROCAR, NÃO CORTAR", "o que sai, alguma coisa entra", ICONR.swap(ACC), ACC);
}
function sRule3(t) {
  const a = S(14) - 0.3, demo = S(14) + 2.6, end = S(15) - 0.6;
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t > demo) {
    const blanket = `<path d="M 480 1500 L 480 660 Q 960 600 1440 660 L 1440 1500 Z" fill="#3d4a6a" stroke="${INK}" stroke-width="7"/>`;
    const P = Object.assign({ x: 960, c: DAD }, face({ lid: 1, smile: 4, zzz: true }));
    o += room(roomBg(0.02, 0) + clockAt(1560, 260, 22 * 60 + 45) + personBack(P) + personHead(P, t) + `<path d="M 925 448 Q 960 432 995 448 Q 980 462 960 454 Q 940 462 925 448 Z" fill="${DAD.hair}"/>` + blanket, 0, 160, 1.2);
    o += chip(t, demo + 0.4, "22:45 · luz apagada", GREEN, 400, 120, 46);
  }
  return o + techCard(t, a, demo, end, 3, "DORMIR ANTES DAS 23H", "o corpo de 40 se conserta dormindo", ICONR.moon(GREEN), GREEN);
}
function sWeeks(t) {
  const w3 = S(16) - 0.3, m1 = S(17) - 0.3;
  if (t < w3) return street(t, { night: 0.6, v: 110, people: [{ x: 960, c: DAD, pant: 0.9, sad: 0.4, smile: -2 }] }) + hudBox("SEMANA 1", "10 min = maratona", GOLD);
  if (t < m1) return street(t, { night: 0.6, v: 80, people: [{ x: 960, c: DAD, pant: 0.4, ang: 0.6, smile: 0, knee: t < S(16) + 3.0 }] }) + hudBox("SEMANA 3", "joelho doeu. diminuiu.", REDC) + (t > S(16) + 3.0 ? txt("MAS NÃO PAROU.", 1400, 240, 80, GREEN, 1, pop(t, S(16) + 3.0)) : "");
  return street(t, { night: 0.4, v: 170, people: [{ x: 960, c: DAD, smile: 8, ang: 0.4 }] }) + hudBox("1º MÊS", "10 min → 20 min", GREEN) + (t > S(17) + 3.0 ? txt("ninguém pediu. ele quis.", 1380, 240, 60, CREAM, seg(t, S(17) + 3.0, S(17) + 3.4)) : "");
}
function sObstacles(t) {
  let o = `<rect width="${W}" height="${H}" fill="#151a24"/>`;
  if (t < S(19) - 0.3) {
    [["CHUVA", "#4fd1ff", S(18)], ["CHURRASCO DE DOMINGO", GOLD, S(18) + 1.8], ["HORA EXTRA ATÉ 21H", REDC, S(18) + 3.6]].forEach(([s, c, a], i) => { o += chip(t, a, s, c, 960, 300 + i * 200, 64); });
    return o;
  }
  const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"], marks = [1, 1, 0, 1, 1, 1, 1];
  days.forEach((d, i) => { const p = pop(t, S(19) + 0.2 + i * 0.15); if (p <= 0) return; const m = marks[i]; o += `<g transform="translate(${510 + i * 150} 420) scale(${p})"><rect x="-62" y="-90" width="124" height="180" rx="16" fill="#12151c" stroke="${m ? "#3a4150" : GOLD}" stroke-width="${m ? 4 : 7}"/><text class="hand" x="0" y="-48" font-size="34" text-anchor="middle" fill="#cfd8e3">${d}</text><g transform="translate(0 30) scale(0.6)">${m ? ICON.check(GREEN) : ICON.cross(GOLD)}</g></g>`; });
  o += txt("UM DIA: TUDO BEM.", 960, 680, 80, GOLD, 1, pop(t, S(19) + 2.4)) + txt("DOIS: NUNCA.", 960, 800, 100, REDC, 1, pop(t, S(19) + 3.8));
  return o;
}
function sFamily(t) {
  const mom = t > S(20) - 0.1;
  const people = [{ x: 700, c: DAD, smile: 10, ang: 0.3 }, { x: 1020, c: JOSEPH, off: 1.3, smile: 10 }];
  if (mom) people.unshift({ x: lerp(-300, 400, seg(t, S(20) - 0.1, S(20) + 1.6)), c: MOM, bun: true, off: 2.1, smile: 12 });
  let o = street(t, { sunset: 1, v: 160, people });
  o += chip(t, S(20) - 0.2, "3º MÊS", BERRY, 330, 110, 50);
  if (t > S(21)) { o += bubble(560, 230, pop(t, S(21) + 0.4) * 0.8, ["e o seu dia?"], INK, "left"); o += bubble(1250, 200, pop(t, S(21) + 2.0) * 0.8, ["pai, lembra quando..."], INK, "right"); }
  if (t > S(22) + 2.6) o = o + dark(0.35) + txt("MUDA A CASA INTEIRA.", 960, 540, 110, GOLD, 1, pop(t, S(22) + 2.8));
  return o;
}
function sDoctor2(t) {
  const smile = t > S(25) + 2.4;
  let o = office(t, { belly: 0.45, paper: true, doc: { look: [0, 12], smile: smile ? 14 : -1, happy: t > S(26) ? 1 : 0 }, dad: { look: [10, 2], browUp: smile ? 8 : 4, smile: t > S(26) ? 12 : -2 } });
  o += chip(t, S(23) - 0.4, "6 MESES DEPOIS", GOLD, 330, 110, 46);
  if (t > S(24) && t < S(26) - 0.2) o += `<g transform="translate(560 640)">${[0, 1, 2].map(i => `<ellipse cx="${-40 + i * 40}" cy="${(t * 80 + i * 30) % 60}" rx="9" ry="14" fill="#9fd8ff" stroke="${INK}" stroke-width="3"/>`).join("")}</g>` + chip(t, S(24), "mão suando", "#cfd8e3", 560, 820, 40);
  if (t > S(26) - 0.3) o += examCard(t, S(26) - 0.2, [["PRESSÃO", "controlada ✓", GREEN, S(26) + 0.2], ["GLICOSE", "normal ✓", GREEN, S(26) + 2.0], ["PESO", "−12 kg", GOLD, S(26) + 3.8]], "6 MESES DEPOIS", 960, 330);
  return o;
}
function sPaper(t) { return black() + txt("o melhor resultado", 960, 460, 80, "#cfd8e3", seg(t, S(27), S(27) + 0.4)) + txt("NÃO ESTAVA NO PAPEL.", 960, 600, 110, GOLD, 1, pop(t, S(27) + 1.2)); }
function sRun(t) {
  const slow = seg(t, S(29) - 0.2, S(29) + 1.5), pass = seg(t, S(30) + 3.6, S(31) - 0.2);
  const jx = lerp(1180, 1000, slow) - 160 * pass, dx = lerp(760, 760, slow) + 440 * pass;
  const back = tt => kmSign(1500 - ((tt - S(28)) * 120) % 2600, "KM 5");
  let o = street(t, { sunset: 0.6, v: 420, back, people: [{ x: jx, c: JOSEPH, off: 1.3, smile: 10, gy: 800, sc: 0.92 }, { x: dx, c: DAD, smile: t > S(30) ? 14 : 8, ang: 0.6, pant: t < S(30) ? 0.4 : 0, gy: 870, sc: 1.04 }] });
  o += chip(t, S(28) - 0.3, "DOMINGO · 5 KM", GOLD, 330, 110, 46);
  if (t > S(30) + 0.3) o += bubble(dx + 60, 230, pop(t, S(30) + 0.3) * 0.85, ["não precisa.", "hoje eu te alcanço."], INK, "left");
  return o;
}
function kmSign(x, label) { return `<g transform="translate(${x} 0)"><rect x="-8" y="560" width="16" height="230" fill="#4a4f5a" stroke="${INK}" stroke-width="4"/><rect x="-90" y="470" width="180" height="110" rx="12" fill="${GOLD}" stroke="${INK}" stroke-width="7"/><text class="sans" x="0" y="545" font-size="56" font-weight="800" text-anchor="middle" fill="${INK}">${label}</text></g>`; }
function sYoung(t) {
  let w = roomBg(0.85, 0.5) + dadFront(t, { happy: 1, smile: 14 }, 960, 0);
  if (window.THUMB) return room(w, 0, 260, 1.5);
  return room(w, 0, 260, 1.5) + txt("43 ANOS.", 1560, 300, 100, CREAM, 1, pop(t, S(31) + 0.2)) + txt("nunca tão novo.", 1560, 420, 60, GREEN, seg(t, S(31) + 2.6, S(31) + 3.0));
}
function sYou(t) {
  let o = black();
  if (t < S(33) - 0.3) return o + txt("+35?", 960, 420, 200, NAVY, 1, pop(t, S(32))) + txt("acha que passou do tempo?", 960, 620, 70, "#cfd8e3", seg(t, S(32) + 1.4, S(32) + 1.8));
  return o + txt("O tempo que passou não volta.", 960, 420, 80, "#8f99a3", seg(t, S(33), S(33) + 0.4)) + txt("O QUE FALTA AINDA É SEU.", 960, 600, 110, GOLD, 1, pop(t, S(33) + 2.4));
}
function sRecap(t) {
  return black() + recapCards(t, S(34) - 0.4, S(36) - 0.5, "COMEÇA PEQUENO:", [
    [S(34) + 1.6, "10 MIN", "todo dia", ICONR.walk(GOLD), GOLD],
    [S(34) + 3.4, "TROCAR", "em vez de cortar", ICONR.swap(ACC), ACC],
    [S(34) + 5.0, "23H", "dormir antes", ICONR.moon(GREEN), GREEN],
    [S(35) + 0.2, "1 DIA OK", "dois, nunca", ICON.check(REDC), REDC]]);
}
function sQuote(t) { return black() + txt("NUNCA É TARDE PRA RECOMEÇAR.", 960, 440, 96, CREAM, 1, pop(t, S(36))) + txt("mas é sempre cedo pra desistir.", 960, 600, 70, GOLD, seg(t, S(36) + 2.0, S(36) + 2.4)); }
function sCTA(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/><rect y="820" width="${W}" height="260" fill="#090a0e"/>`;
  o += room(dadFront(t, { happy: 1, smile: 12 }, 760, 0) + jFront(t, { smile: 12, look: [-8, 2] }, 1180), -500, 160, 0.85);
  o += `<g transform="translate(1360 330) scale(${pop(t, S(37) + 0.8) * (1 - 0.06 * dip(t, S(37) + 2.0, S(37) + 2.1, S(37) + 2.2, S(37) + 2.35))})"><rect x="-330" y="-85" width="660" height="170" rx="85" fill="${RED}" stroke="#000" stroke-width="8"/>${txt("INSCREVA-SE", 0, 0, 90, "#fff")}</g>`;
  const k = pop(t, S(37) + 2.6);
  if (k > 0) o += `<g transform="translate(1360 640) scale(${k})"><rect x="-430" y="-90" width="860" height="180" rx="30" fill="#f6f1e6" stroke="${INK}" stroke-width="7"/><text class="hand" x="0" y="-12" font-size="46" text-anchor="middle" fill="${INK}">O que você vai recomeçar</text><text class="hand" x="0" y="52" font-size="46" text-anchor="middle" fill="${INK}">essa semana?</text></g>`;
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
    [S(3) - 0.3, sCouch], [S(4) - 0.6, sReasons], [E(5) + 0.8, sDoctor1], [S(6) - 0.6, t => sTitle(t, E(5) + 0.8)], [S(8) - 0.5, sNight], [S(9) - 0.5, sTogether],
    [S(11) - 0.5, sMistake], [S(12) - 0.3, sDeal], [S(13) - 0.3, sRule1], [S(14) - 0.3, sRule2], [S(15) - 0.6, sRule3], [S(18) - 0.4, sWeeks], [S(20) - 0.4, sObstacles],
    [S(23) - 0.7, sFamily], [S(27) - 0.4, sDoctor2], [S(28) - 0.6, sPaper], [S(31) - 0.4, sRun], [S(32) - 0.6, sYoung], [S(34) - 0.4, sYou], [S(36) - 0.5, sRecap],
    [S(37) - 0.5, sQuote], [E(37) + 1.4, sCTA], [1e9, t => sEndScreen(t, E(37) + 1.4)],
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
