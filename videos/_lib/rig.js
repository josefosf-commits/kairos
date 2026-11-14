// Biblioteca comum dos curtas do canal Joseph: helpers, Joseph de frente e de perfil, celular, cenários.
// ======================= helpers =======================
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const sm = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => sm(cl((t - a) / (b - a)));
const inR = (t, a, b) => t >= a && t < b;
const dip = (t, a, b, c, d) => seg(t, a, b) * (1 - seg(t, c, d));
const lerp2 = (p, q, k) => [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
const D2R = Math.PI / 180;
const dirv = (deg, len) => [Math.sin(deg * D2R) * len, Math.cos(deg * D2R) * len];
function kf(t, pts) {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) {
    const [t0, v0] = pts[i - 1], [t1, v1] = pts[i];
    return lerp(v0, v1, sm((t - t0) / (t1 - t0)));
  }
  return pts[pts.length - 1][1];
}
function hex(c) { return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); }
function mixc(a, b, k) { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], k)).toString(16).padStart(2, "0")).join(""); }
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ======================= palette =======================
const INK = "#0e0f12", ACC = "#4fd1ff", RED = "#e5484d";
const JOSEPH = { skin: "#a86f4a", skinD: "#8e5a3a", hood: "#4f5d40", hoodD: "#3c4731", hair: "#17110e", style: "short" };
const FRIEND = { skin: "#d9a47a", skinD: "#bf8a62", hood: "#8c3b3b", hoodD: "#6e2d2d", hair: "#2a1a12", style: "curly" };
const PANTS = "#2c3140", PANTS_D = "#20242f";

window.TL = window.TL || { lines: [], duration: 245 };

// ======================= frontal person =======================
// coordinates follow the FOCO rig: head centre ~ (960, 400) when x = 960
function personBack(P) {
  let o = `<g transform="translate(${P.x - 960} ${P.bob * 0.5})">`;
  o += `<path d="M 858 540 C 850 470 1070 470 1062 540 Z" fill="${P.c.hoodD}" stroke="${INK}" stroke-width="7"/>`;
  o += `<path d="M 790 700 C 788 572 840 518 960 512 C 1080 518 1132 572 1130 700 Z" fill="${P.c.hood}" stroke="${INK}" stroke-width="7"/>`;
  o += `<rect x="928" y="478" width="64" height="52" fill="${P.c.skinD}" stroke="${INK}" stroke-width="6"/>`;
  o += `<path d="M 895 520 Q 960 566 1025 520" fill="${P.c.hoodD}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`;
  o += `<path d="M 938 540 L 934 590" stroke="#d9d4c7" stroke-width="5" stroke-linecap="round"/><path d="M 982 540 L 986 590" stroke="#d9d4c7" stroke-width="5" stroke-linecap="round"/>`;
  o += `<path d="M 850 560 Q 862 600 860 680" fill="none" stroke="${P.c.hoodD}" stroke-width="5"/><path d="M 1070 560 Q 1058 600 1060 680" fill="none" stroke="${P.c.hoodD}" stroke-width="5"/>`;
  return o + `</g>`;
}
function personHead(P, t) {
  const c = P.c;
  let o = `<g transform="translate(${P.x - 960} ${P.bob})">`;
  if (c.style === "curly") for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; o += `<circle cx="${960 + Math.cos(a) * 82}" cy="${350 + Math.sin(a) * 70}" r="38" fill="${c.hair}" stroke="${INK}" stroke-width="5"/>`; }
  o += `<ellipse cx="884" cy="405" rx="14" ry="22" fill="${c.skin}" stroke="${INK}" stroke-width="6"/><ellipse cx="1036" cy="405" rx="14" ry="22" fill="${c.skin}" stroke="${INK}" stroke-width="6"/>`;
  o += `<rect x="885" y="292" width="150" height="212" rx="64" fill="${c.skin}" stroke="${INK}" stroke-width="7"/>`;
  if (c.style === "short") o += `<path d="M 886 362 C 880 284 1040 284 1034 362 C 1022 330 992 318 960 320 C 928 318 898 330 886 362 Z" fill="${c.hair}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  else o += `<path d="M 886 350 C 900 300 1020 300 1034 350 C 1000 330 920 330 886 350 Z" fill="${c.hair}"/>`;
  const L = P.look;
  for (const [cx, side] of [[928, -1], [992, 1]]) {
    if (P.happy > 0.5) {
      o += `<path d="M ${cx - 18} 404 Q ${cx} 380 ${cx + 18} 404" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>`;
    } else {
      o += `<ellipse cx="${cx}" cy="398" rx="21" ry="25" fill="#fbfaf6"/>`;
      o += `<circle cx="${cx + L[0]}" cy="${398 + L[1]}" r="10.5" fill="${INK}"/><circle cx="${cx + L[0] + 3}" cy="${394 + L[1]}" r="3" fill="#fff"/>`;
      if (P.lid > 0) o += `<path d="M ${cx - 21} 398 A 21 25 0 0 1 ${cx + 21} 398 L ${cx + 21} ${373 + 50 * P.lid} L ${cx - 21} ${373 + 50 * P.lid} Z" fill="${c.skin}"/><line x1="${cx - 20}" y1="${373 + 50 * P.lid}" x2="${cx + 20}" y2="${373 + 50 * P.lid}" stroke="${INK}" stroke-width="5"/>`;
      o += `<ellipse cx="${cx}" cy="398" rx="21" ry="25" fill="none" stroke="${INK}" stroke-width="5"/>`;
    }
    if (P.bags > 0) o += `<path d="M ${cx - 16} 428 Q ${cx} 438 ${cx + 16} 428" fill="none" stroke="#5a3a52" stroke-width="4" opacity="${P.bags}"/>`;
    const inner = cx - side * 18, outer = cx + side * 22;
    const yIn = 358 - P.browUp - P.browSad * 9 + P.browAng * 10, yOut = 362 - P.browUp * 0.6 + P.browSad * 4 - P.browAng * 6;
    o += `<line x1="${inner}" y1="${yIn}" x2="${outer}" y2="${yOut}" stroke="${c.hair}" stroke-width="10" stroke-linecap="round"/>`;
  }
  o += `<path d="M 958 412 Q 952 432 962 436" fill="none" stroke="${c.skinD}" stroke-width="5" stroke-linecap="round"/>`;
  if (P.mouthOpen > 0.05) {
    const h = 6 + 22 * P.mouthOpen;
    o += `<path d="M ${960 - 22} 458 Q 960 ${458 + h * 1.6} ${960 + 22} 458 Z" fill="#5a1f1a" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  } else o += `<path d="M ${960 - P.mouthW} 462 Q 960 ${462 + P.smile * 1.6} ${960 + P.mouthW} 462" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  if (P.zzz) for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; o += `<text class="hand" x="${1060 + k * 60}" y="${320 - k * 120}" font-size="${30 + k * 20}" fill="#cfd8e3" opacity="${1 - k}">z</text>`; }
  return o + `</g>`;
}
function armF(sh, h, col, layered) {
  const ex = (sh[0] + h[0]) / 2 + (h[0] > sh[0] ? 24 : -24), ey = Math.max(sh[1], h[1]) + (layered ? -10 : 48);
  return `<path d="M ${sh[0]} ${sh[1]} Q ${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="${INK}" stroke-width="48" stroke-linecap="round"/>` +
         `<path d="M ${sh[0]} ${sh[1]} Q ${ex} ${ey} ${h[0]} ${h[1]}" fill="none" stroke="${col}" stroke-width="35" stroke-linecap="round"/>`;
}
const handC = (h, skin) => `<circle cx="${h[0]}" cy="${h[1]}" r="21" fill="${skin}" stroke="${INK}" stroke-width="6"/>`;
function armsBehindHead(P, k) {
  const x = P.x - 960, shR = [1060 + x, 565], shL = [860 + x, 565];
  const eR = lerp2([1100 + x, 650], [1150 + x, 360], k), eL = lerp2([820 + x, 650], [770 + x, 360], k);
  const hR = lerp2([1060 + x, 660], [1010 + x, 330], k), hL = lerp2([860 + x, 660], [910 + x, 330], k);
  let o = "";
  for (const [sh, e, h] of [[shR, eR, hR], [shL, eL, hL]]) {
    const d = `M ${sh[0]} ${sh[1]} L ${e[0]} ${e[1]} L ${h[0]} ${h[1]}`;
    o += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${P.c.hood}" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return o;
}

// default face
function face(over) {
  return Object.assign({ look: [0, 6], smile: 2, mouthW: 18, browUp: 0, browSad: 0, browAng: 0, lid: 0.08, bags: 0, mouthOpen: 0, happy: 0, bob: 0, zzz: false }, over);
}
function blink(t, lid, seed = 0) { const p = (t + seed) % 3.7; return p < 0.13 ? 1 : lid; }

// ======================= phone =======================
function phoneBody(pc, held, t) {
  const pw = lerp(92, 78, held), ph = lerp(16, 140, held);
  return `<g transform="translate(${pc[0]} ${pc[1]})"><rect x="${-pw / 2}" y="${-ph / 2}" width="${pw}" height="${ph}" rx="${lerp(4, 12, held)}" fill="#14161a" stroke="${INK}" stroke-width="6"/></g>`;
}
// screen content (drawn in the colour layer so it stays vivid in a grey world)
function phoneScreen(pc, mode, t, gray) {
  const sw = 66, sh = 126;
  const cols = gray ? ["#3a3a3a", "#5a5a5a", "#8a8a8a", "#4a4a4a"] : ["#1d4b5e", "#3a6f86", ACC, "#27566a"];
  let o = `<g transform="translate(${pc[0]} ${pc[1]})"><svg x="${-sw / 2}" y="${-sh / 2}" width="${sw}" height="${sh}" viewBox="0 0 ${sw} ${sh}">`;
  o += `<rect width="${sw}" height="${sh}" rx="7" fill="${gray ? "#1a1a1a" : "#0f2a36"}"/>`;
  if (mode === "feed") {
    const off = (t * 220) % 60;
    for (let i = -1; i < 4; i++) { const idx = ((Math.floor(t * 220 / 60) + i) % 4 + 4) % 4; o += `<rect x="5" y="${i * 60 - off + 4}" width="${sw - 10}" height="52" rx="6" fill="${cols[idx]}"/>`; }
  } else if (mode === "notif") {
    o += `<rect x="5" y="10" width="${sw - 10}" height="26" rx="6" fill="${cols[2]}"/><path d="M ${sw / 2} 80 c -12 -12 -26 4 0 22 c 26 -18 12 -34 0 -22 Z" fill="${gray ? "#aaa" : RED}"/>`;
  } else if (mode === "call") {
    o += `<circle cx="${sw / 2}" cy="40" r="16" fill="${gray ? "#777" : "#30a46c"}"/><text class="sans" x="${sw / 2}" y="80" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">Mãe</text><text class="sans" x="${sw / 2}" y="98" font-size="10" text-anchor="middle" fill="#bbb">02:14</text>`;
  } else if (mode === "time") {
    o += `<text class="sans" x="${sw / 2}" y="60" font-size="18" font-weight="800" text-anchor="middle" fill="#fff">02:13</text>`;
  }
  o += `</svg></g>`;
  return o;
}
function phoneGlowFace(x, held, k = 1) { return `<ellipse cx="${x}" cy="440" rx="170" ry="190" fill="url(#gPhone)" opacity="${0.35 * held * k}" style="mix-blend-mode:screen"/>`; }

// ======================= settings =======================
function roomBg(day, warm) {
  const wall = mixc("#262a33", "#121419", 1 - day);
  const sky = mixc(mixc("#0a0f1c", "#5b7fa3", day), "#f0a35e", warm * 0.8);
  let o = `<rect x="-600" y="-400" width="3120" height="1260" fill="${mixc(wall, "#3a2e2a", warm * 0.4)}"/>`;
  o += `<rect x="-600" y="860" width="3120" height="700" fill="${mixc("#0c0d10", "#181a20", day)}"/><line x1="-600" y1="860" x2="2520" y2="860" stroke="${INK}" stroke-width="6"/>`;
  o += `<rect x="260" y="200" width="360" height="360" rx="10" fill="${sky}" stroke="#2b2f38" stroke-width="14"/>`;
  if (warm > 0) o += `<circle cx="360" cy="480" r="40" fill="#ffd27a" opacity="${warm}"/>`;
  o += `<circle cx="520" cy="290" r="34" fill="#e8e2d0" opacity="${(1 - day) * (1 - warm)}"/>`;
  o += `<line x1="440" y1="200" x2="440" y2="560" stroke="#2b2f38" stroke-width="12"/><line x1="260" y1="380" x2="620" y2="380" stroke="#2b2f38" stroke-width="12"/>`;
  o += `<polygon points="270,860 610,860 760,1060 140,1060" fill="${warm > 0 ? "#ffc285" : "#9fc0e0"}" opacity="${0.06 * day + 0.1 * warm}"/>`;
  return o;
}
function clockAt(x, y, mins) {
  const hA = (mins / 720) * 360, mA = ((mins % 60) / 60) * 360;
  let o = `<g transform="translate(${x} ${y})"><circle r="80" fill="#e8e2d6" stroke="${INK}" stroke-width="8"/>`;
  for (let i = 0; i < 12; i++) { const a = i * 30 * D2R; o += `<line x1="${Math.sin(a) * 60}" y1="${-Math.cos(a) * 60}" x2="${Math.sin(a) * 70}" y2="${-Math.cos(a) * 70}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`; }
  o += `<line y2="-38" stroke="${INK}" stroke-width="9" stroke-linecap="round" transform="rotate(${hA})"/><line y2="-58" stroke="${INK}" stroke-width="5" stroke-linecap="round" transform="rotate(${mA})"/><circle r="7" fill="${INK}"/></g>`;
  return o;
}
function deskFront(laptop) {
  let o = `<rect x="600" y="668" width="26" height="194" fill="#2c241f" stroke="${INK}" stroke-width="6"/><rect x="1294" y="668" width="26" height="194" fill="#2c241f" stroke="${INK}" stroke-width="6"/>`;
  o += `<rect x="560" y="640" width="800" height="32" rx="4" fill="#3a2f28" stroke="${INK}" stroke-width="7"/>`;
  if (laptop) o += `<rect x="868" y="556" width="184" height="84" rx="8" fill="#3b4049" stroke="${INK}" stroke-width="7"/><circle cx="960" cy="598" r="8" fill="#7b8390"/><rect x="852" y="636" width="216" height="8" rx="3" fill="#2a2e35" stroke="${INK}" stroke-width="4"/>`;
  return o;
}
function plant() { return `<rect x="1180" y="590" width="60" height="50" rx="6" fill="#b5651d" stroke="${INK}" stroke-width="5"/><path d="M 1210 590 C 1180 540 1190 520 1200 500 M 1210 590 C 1230 540 1250 530 1255 505 M 1210 590 C 1210 550 1212 530 1214 490" fill="none" stroke="#30a46c" stroke-width="10" stroke-linecap="round"/>`; }
function book(c, w, h, open) {
  let o = `<g transform="translate(${c[0]} ${c[1]})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="#8c4a2f" stroke="${INK}" stroke-width="6"/>`;
  o += `<rect x="${-w / 2 + 14}" y="${-h / 2 + 22}" width="${w - 28}" height="10" rx="5" fill="#e9c46a"/><rect x="${-w / 2 + 14}" y="${-h / 2 + 42}" width="${w - 60}" height="8" rx="4" fill="#e9c46a" opacity="0.7"/>`;
  o += `<rect x="${-w / 2 + 4}" y="${-h / 2 - 6}" width="${w - 8}" height="8" fill="#f6f1e6" stroke="${INK}" stroke-width="3"/></g>`;
  return o;
}

// ======================= side-view person (from DISCIPLINA) =======================
function legPose(phase, amp) {
  const th = 38 * amp * Math.sin(phase), bend = amp * (12 + 75 * Math.max(0, -Math.sin(phase - 0.9))) + (amp > 0 ? 0 : 2);
  const knee = dirv(th, 115), shin = dirv(th - bend, 115);
  return { knee, foot: [knee[0] + shin[0], knee[1] + shin[1]], footAng: th - bend };
}
function limb(a, b, c, w1, w2, col) {
  const d = `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${c[0]} ${c[1]}`;
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w1}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w2}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function sidePerson(S, t) {
  const c = JOSEPH, g = S.gait;
  const L1 = legPose(S.phase, g), L2 = legPose(S.phase + Math.PI, g);
  const hipY = S.groundY - Math.max(L1.foot[1], L2.foot[1]) - 10;
  let o = `<g transform="translate(${S.x} ${hipY}) scale(${S.dir} 1)">`;
  const shoe = (L, far) => { const f = L.foot, a = Math.max(-30, Math.min(30, L.footAng * 0.4)); return `<g transform="translate(${f[0]} ${f[1]}) rotate(${-a})"><path d="M -14 -12 L 38 -12 Q 52 -10 50 6 L -16 6 Z" fill="${far ? "#cfcfcf" : "#eee"}" stroke="${INK}" stroke-width="5"/><rect x="-16" y="2" width="66" height="6" fill="${RED}"/></g>`; };
  o += limb([0, 0], L2.knee, L2.foot, 46, 34, PANTS_D) + shoe(L2, true);
  o += `<g transform="rotate(${S.lean})">`;
  const sh = [6, -160];
  const armPose = (ph, near) => {
    let up = -45 * g * Math.sin(ph), fore = up + (g > 0.1 ? 85 : 12);
    if (near && S.arm) { up = S.arm[0]; fore = S.arm[1]; }
    const e = [sh[0] + dirv(up, 92)[0], sh[1] + dirv(up, 92)[1]];
    return [e, [e[0] + dirv(fore, 82)[0], e[1] + dirv(fore, 82)[1]]];
  };
  const [eF, hF] = armPose(S.phase, false);
  o += limb(sh, eF, hF, 40, 28, c.hoodD) + `<circle cx="${hF[0]}" cy="${hF[1]}" r="17" fill="${c.skinD}" stroke="${INK}" stroke-width="5"/>`;
  o += `<path d="M -66 -150 C -80 -205 -20 -222 0 -190 L -10 -150 Z" fill="${c.hoodD}" stroke="${INK}" stroke-width="6"/>`;
  o += `<rect x="-58" y="-188" width="118" height="200" rx="44" fill="${c.hood}" stroke="${INK}" stroke-width="7"/>`;
  o += `<path d="M 36 -178 L 40 -128" stroke="#d9d4c7" stroke-width="5" stroke-linecap="round"/><circle cx="40" cy="-126" r="5" fill="#d9d4c7" stroke="${INK}" stroke-width="2"/>`;
  o += `<rect x="-16" y="-214" width="40" height="36" fill="${c.skinD}" stroke="${INK}" stroke-width="5"/>`;
  // head
  o += `<rect x="-58" y="-395" width="140" height="205" rx="62" fill="${c.skin}" stroke="${INK}" stroke-width="7"/>`;
  o += `<ellipse cx="-4" cy="-285" rx="13" ry="21" fill="${c.skin}" stroke="${INK}" stroke-width="5"/>`;
  o += `<path d="M -58 -265 C -68 -360 -10 -410 50 -393 C 72 -388 82 -372 84 -350 C 52 -364 20 -362 0 -342 C -20 -322 -40 -298 -58 -265 Z" fill="${c.hair}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  o += `<ellipse cx="50" cy="-300" rx="15" ry="20" fill="#fbfaf6"/>`;
  o += `<g clip-path="url(#eyeS)"><circle cx="${54 + S.look[0]}" cy="${-300 + S.look[1]}" r="8.5" fill="${INK}"/><circle cx="${57 + S.look[0]}" cy="${-304 + S.look[1]}" r="2.6" fill="#fff"/>`;
  if (S.lid > 0) o += `<rect x="30" y="-322" width="40" height="${44 * S.lid}" fill="${c.skin}"/><line x1="30" y1="${-322 + 44 * S.lid}" x2="70" y2="${-322 + 44 * S.lid}" stroke="${INK}" stroke-width="4"/>`;
  o += `</g><ellipse cx="50" cy="-300" rx="15" ry="20" fill="none" stroke="${INK}" stroke-width="5"/>`;
  const by1 = -334 - S.browUp + S.browAng * 8 - S.browSad * 2, by2 = -337 - S.browUp - S.browAng * 4 + S.browSad * 6;
  o += `<line x1="34" y1="${by2}" x2="70" y2="${by1}" stroke="${c.hair}" stroke-width="9" stroke-linecap="round"/>`;
  o += `<path d="M 80 -292 Q 98 -274 80 -264" fill="${c.skin}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`;
  if (S.pant > 0.05) o += `<ellipse cx="66" cy="-232" rx="10" ry="${5 + 8 * S.pant * (0.6 + 0.4 * Math.abs(Math.sin(t * 9)))}" fill="#3a1f1a" stroke="${INK}" stroke-width="4"/>`;
  else o += `<path d="M 44 -234 Q 60 ${-234 + S.smile * 1.1} 78 ${-236 - S.smile * 0.2}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  // near arm (+ optional phone in hand)
  const [eN, hN] = armPose(S.phase + Math.PI, true);
  o += limb(sh, eN, hN, 44, 31, c.hood);
  if (S.phoneInHand) o += `<rect x="${hN[0] - 6}" y="${hN[1] - 70}" width="16" height="96" rx="5" fill="#14161a" stroke="${INK}" stroke-width="5"/>`;
  o += `<circle cx="${hN[0]}" cy="${hN[1]}" r="18" fill="${c.skin}" stroke="${INK}" stroke-width="5"/>`;
  o += `</g>`;
  o += limb([0, 0], L1.knee, L1.foot, 50, 37, PANTS) + shoe(L1, false);
  o += `</g>`;
  S.handWorld = [S.x + S.dir * (Math.cos(S.lean * D2R) * hN[0] - Math.sin(S.lean * D2R) * hN[1]), hipY + Math.sin(S.lean * D2R) * hN[0] + Math.cos(S.lean * D2R) * hN[1]];
  return o;
}
function streetBg(dist) {
  let o = `<defs><linearGradient id="gSky2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f2a65a"/><stop offset="100%" stop-color="#ffd79a"/></linearGradient></defs>`;
  o += `<rect x="-600" y="-400" width="3120" height="1240" fill="url(#gSky2)"/><circle cx="1500" cy="300" r="70" fill="#fff1c9" opacity="0.6"/>`;
  const off1 = (dist * 0.15) % 2400;
  for (let rep = -1; rep < 2; rep++) for (let i = 0; i < 16; i++) { const w = 110 + hash(i) * 90, h = 160 + hash(i + 40) * 260, x = i * 150 - off1 + rep * 2400; if (x > 2200 || x + w < -400) continue; o += `<rect x="${x}" y="${640 - h}" width="${w}" height="${h + 200}" fill="#b86e4c"/>`; }
  const off2 = (dist * 0.5) % 1800;
  for (let rep = -1; rep < 2; rep++) for (let i = 0; i < 6; i++) { const x = i * 300 - off2 + rep * 1800; if (x > 2300 || x < -500) continue; if (i % 2 === 0) o += `<rect x="${x - 10}" y="580" width="20" height="200" fill="#7a4535"/><circle cx="${x}" cy="560" r="${80 + hash(i) * 30}" fill="#5f7d3a"/>`; else o += `<rect x="${x - 6}" y="420" width="12" height="380" fill="#7a4535"/>`; }
  o += `<rect x="-600" y="780" width="3120" height="60" fill="#3b302f"/><line x1="-600" y1="780" x2="2520" y2="780" stroke="${INK}" stroke-width="5"/>`;
  for (let i = -4; i < 18; i++) { const x = i * 160 - dist % 160; o += `<line x1="${x}" y1="780" x2="${x - 30}" y2="840" stroke="${INK}" stroke-width="3" opacity="0.5"/>`; }
  o += `<rect x="-600" y="840" width="3120" height="18" fill="#221c1c"/><rect x="-600" y="858" width="3120" height="300" fill="#272022"/>`;
  for (let i = -3; i < 10; i++) { const x = i * 320 - dist % 320; o += `<rect x="${x}" y="950" width="150" height="10" fill="#d9d4c7" opacity="0.35"/>`; }
  return o;
}


// ======================= timeline helpers =======================
// S(id) / E(id): start / end (s) of narration line `id` in timeline.json
const S = id => { const L = window.TL.lines.find(l => l.id === id); return L ? L.start : 0; };
const E = id => { const L = window.TL.lines.find(l => l.id === id); return L ? L.end : 0; };
// captions (auto-size), letterbox, black fades, title card
function captions(t) {
  let o = "";
  if (window.THUMB) return o;
  for (const L of window.TL.lines) {
    if (L.nocap) continue;
    const a = L.start - 0.1, b = L.end + 0.35;
    if (t < a || t > b) continue;
    const op = seg(t, a, a + 0.15) * (1 - seg(t, b - 0.2, b));
    const fs = Math.min(54, 1780 / (L.text.length * 0.47));
    o += `<text class="hand" x="960" y="955" font-size="${fs}" text-anchor="middle" fill="#f4efe6" stroke="#000" stroke-width="10" paint-order="stroke" opacity="${op}">${esc(L.text)}</text>`;
  }
  return o;
}
function letterbox() { return window.THUMB ? "" : `<rect x="0" y="0" width="1920" height="70" fill="#000"/><rect x="0" y="1010" width="1920" height="70" fill="#000"/>`; }
function cornerLabel(text, op) { return (window.THUMB || op <= 0) ? "" : `<text class="hand" x="150" y="170" font-size="48" fill="#f4efe6" stroke="#000" stroke-width="8" paint-order="stroke" opacity="${op}">${text}</text>`; }
function titleCard(t, a, title, accent, size = 190) {
  if (t < a) return "";
  const tIn = seg(t, a + 0.2, a + 1.0), sIn = seg(t, a + 1.0, a + 1.8), nIn = seg(t, a + 1.8, a + 2.5), out = 1 - seg(t, a + 8.0, a + 8.8);
  return `<g opacity="${out}"><text class="hand" x="960" y="${560 + (1 - tIn) * 20}" font-size="${size}" text-anchor="middle" fill="#f4efe6" opacity="${tIn}">${title}</text>` +
    `<text class="sans" x="960" y="640" font-size="30" font-weight="500" letter-spacing="12" text-anchor="middle" fill="#8f99a3" opacity="${sIn}">UM CURTA ANIMADO</text>` +
    `<line x1="900" y1="600" x2="1020" y2="600" stroke="${accent}" stroke-width="4" opacity="${sIn}"/>` +
    `<text class="hand" x="960" y="900" font-size="40" text-anchor="middle" fill="#cfc9bd" opacity="${nIn}">JOSEPH</text></g>`;
}
// full-screen quote on black: lines = [[text, start, end, color, size, y]]
function quotes(t, lines) {
  let o = "";
  for (const [txt, a, b, col, size, y] of lines) {
    const op = seg(t, a, a + 0.4) * (1 - seg(t, b - 0.5, b));
    if (op > 0) o += `<text class="hand" x="960" y="${y || 560}" font-size="${size || 96}" text-anchor="middle" fill="${col || "#f4efe6"}" opacity="${op}">${txt}</text>`;
  }
  return o;
}
// numbered technique card (full screen) + corner badge
function techCard(t, a, demo, end, n, title, sub, icon, accent) {
  let o = "";
  if (!inR(t, a, end)) return o;
  const full = seg(t, a, a + 0.4) * (1 - seg(t, demo - 0.4, demo));
  const badge = seg(t, demo, demo + 0.3) * (1 - seg(t, end - 0.3, end));
  if (full > 0) {
    o += `<g opacity="${full}"><rect x="0" y="0" width="1920" height="1080" fill="#07080b" opacity="0.9"/>`;
    o += `<circle cx="480" cy="500" r="80" fill="${accent}"/><text class="hand" x="480" y="530" font-size="90" text-anchor="middle" fill="#07080b">${n}</text>`;
    o += `<text class="hand" x="600" y="480" font-size="${title.length > 22 ? 64 : 80}" fill="#f4efe6">${title}</text><text class="hand" x="600" y="565" font-size="40" fill="#cfd8e3">${sub}</text>`;
    o += `<g transform="translate(1480 700)">${icon}</g></g>`;
  }
  if (badge > 0) o += `<g opacity="${badge}" transform="translate(1500 140)"><rect x="-300" y="-46" width="600" height="92" rx="46" fill="#12151c" stroke="${accent}" stroke-width="5"/><circle cx="-250" cy="0" r="32" fill="${accent}"/><text class="hand" x="-250" y="14" font-size="44" text-anchor="middle" fill="#07080b">${n}</text><text class="hand" x="20" y="14" font-size="${title.length > 22 ? 30 : 38}" text-anchor="middle" fill="#f4efe6">${title}</text></g>`;
  return o;
}
// recap grid of cards: items = [[start, title, sub, iconSvg, color]]
function recapCards(t, a, b, heading, items) {
  const vis = seg(t, a, a + 0.6) * (1 - seg(t, b - 0.8, b));
  if (vis <= 0) return "";
  let o = `<g opacity="${vis}"><rect x="0" y="0" width="1920" height="1080" fill="#07080b" opacity="0.82"/>`;
  o += `<text class="hand" x="960" y="220" font-size="68" text-anchor="middle" fill="#f4efe6" opacity="${seg(t, a + 0.6, a + 1.1)}">${heading}</text>`;
  const n = items.length, W = n > 4 ? 300 : 380, gap = n > 4 ? 30 : 40, x0 = 960 - (n * W + (n - 1) * gap) / 2;
  items.forEach(([s, title, sub, icon, col], i) => {
    const pop = seg(t, s, s + 0.35); if (pop <= 0) return;
    const next = i + 1 < n ? items[i + 1][0] : b;
    const active = inR(t, s, next) ? 1 : 0.45;
    o += `<g opacity="${pop * (0.45 + 0.55 * active)}" transform="translate(${x0 + i * (W + gap) + W / 2} 530) scale(${(0.85 + 0.15 * pop) * (1 + 0.04 * active)})">`;
    o += `<rect x="${-W / 2}" y="-230" width="${W}" height="460" rx="26" fill="#12151c" stroke="${col}" stroke-width="${3 + 4 * active}"/>`;
    o += `<g transform="translate(0 -80) scale(0.8)">${icon}</g>`;
    o += `<text class="hand" x="0" y="90" font-size="${title.length > 10 ? 38 : 48}" text-anchor="middle" fill="${col}">${title}</text>`;
    o += `<text class="hand" x="0" y="150" font-size="${sub.length > 18 ? 28 : 34}" text-anchor="middle" fill="#cfd8e3">${sub}</text></g>`;
  });
  return o + `</g>`;
}
