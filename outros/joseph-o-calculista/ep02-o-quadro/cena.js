// JOSEPH, O CALCULISTA · CASO 2: O QUADRO NO ESCURO (vertical, ~2:20). Pede o palpite do público antes da revelação.
const NOIR = "#0b0f1a", CRIME = "#e5484d", AQUA = "#4fd1ff", LILAC = "#b99be6";
const JW = 791, JH = 1249;                                   // assets/joseph.png
function jo(t, x, y, h, op = 1, glow = 0) {
  const w = h * JW / JH, br = 1 + 0.006 * Math.sin(t * 2.2);
  let o = `<g opacity="${op}" transform="translate(${x} ${y + h}) scale(1 ${br}) translate(${-x} ${-(y + h)})">`;
  if (glow) o += `<ellipse cx="${x}" cy="${y + h * 0.45}" rx="${w * 0.75}" ry="${h * 0.55}" fill="${GOLD}" opacity="${0.18 * glow}"/>`;
  o += `<image href="assets/joseph.png" x="${x - w / 2}" y="${y}" width="${w}" height="${h}"/>`;
  return o + `</g>`;
}
function pill(t, a, s, col, y, size = 58, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#05070c" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }
function rain(t, amt = 1, n = 90) {
  let o = `<g opacity="${amt}" stroke="#7f9cc4" stroke-width="3" stroke-linecap="round">`;
  for (let i = 0; i < n; i++) { const x = hash(i) * 1200 - 60, sp = 1400 + hash(i + 9) * 500, y = ((t * sp + hash(i + 3) * SH) % (SH + 200)) - 100; o += `<line x1="${x}" y1="${y}" x2="${x - 12}" y2="${y + 50}" opacity="${0.3 + 0.5 * hash(i + 7)}"/>`; }
  return o + `</g>`;
}
const FLASH = [0.5, 9.0, 43.6, 97.7];
const flash = t => { const f = FLASH.map(a => dip(t, a, a + 0.04, a + 0.12, a + 0.4)).reduce((m, v) => Math.max(m, v), 0); return f > 0 ? `<rect width="${SW}" height="${SH}" fill="#dfe8ff" opacity="${0.5 * f}"/>` : ""; };
function badge(t, a, n, x = 170, y = 520) { const p = pop(t, a); return p > 0 ? `<g transform="translate(${x} ${y}) scale(${p})"><circle r="70" fill="${GOLD}" stroke="#000" stroke-width="7"/>${txt(String(n), 0, 0, 90, "#05070c")}</g>` : ""; }
function stamp(t, a, s, y, col = CRIME, size = 110, w = 660) { return t > a ? `<g transform="translate(540 ${y}) rotate(-6) scale(${pop(t, a, 0.25)})"><rect x="${-w / 2}" y="-80" width="${w}" height="160" rx="14" fill="#05070c" opacity="0.85" stroke="${col}" stroke-width="12"/>${txt(s, 0, 0, size, col)}</g>` : ""; }

// ---------- the painting: a lighthouse at sunset, gold frame ----------
function painting(x, y, w, h, present = 1, cut = 0) {
  let o = `<g transform="translate(${x} ${y})"><rect x="${-w / 2 - 34}" y="${-h / 2 - 34}" width="${w + 68}" height="${h + 68}" rx="6" fill="#b8892b" stroke="#000" stroke-width="8"/><rect x="${-w / 2 - 14}" y="${-h / 2 - 14}" width="${w + 28}" height="${h + 28}" fill="#7a5a1c"/>`;
  o += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#1a1d24"/>`;
  if (present > 0) {
    o += `<g opacity="${present}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h * 0.62}" fill="url(#gSunset)"/><circle cx="${w * 0.18}" cy="${h * 0.05}" r="${h * 0.12}" fill="#ffe1a0"/>`;
    o += `<rect x="${-w / 2}" y="${-h / 2 + h * 0.62}" width="${w}" height="${h * 0.38}" fill="#1f3b63"/>`;
    for (let i = 0; i < 4; i++) o += `<line x1="${-w * 0.4 + i * 30}" y1="${h * 0.18 + i * 22}" x2="${w * 0.4 - i * 20}" y2="${h * 0.18 + i * 22}" stroke="#ffd27a" stroke-width="5" opacity="0.6"/>`;
    o += `<path d="M ${-w * 0.3} ${h * 0.12} L ${-w * 0.24} ${-h * 0.3} L ${-w * 0.16} ${-h * 0.3} L ${-w * 0.1} ${h * 0.12} Z" fill="#f4efe6" stroke="#000" stroke-width="4"/><rect x="${-w * 0.23}" y="${-h * 0.36}" width="${w * 0.06}" height="${h * 0.06}" fill="#ffe1a0" stroke="#000" stroke-width="3"/>`;
    o += `<path d="M ${-w * 0.2} ${-h * 0.33} L ${-w * 0.5} ${-h * 0.45} L ${-w * 0.5} ${-h * 0.25} Z" fill="#fff6c8" opacity="0.35"/></g>`;
  }
  if (cut > 0) { const s = w / 2 - 10; o += `<path d="M ${-s} ${-h / 2 + 10} L ${-s + 14} ${-h / 2 + 30} L ${-s} ${-h / 2 + 50} M ${s} ${h / 2 - 10} L ${s - 14} ${h / 2 - 30}" stroke="#f4efe6" stroke-width="5" opacity="${cut}" fill="none"/><rect x="${-w / 2 + 6}" y="${-h / 2 + 6}" width="${w - 12}" height="${h - 12}" fill="none" stroke="#f4efe6" stroke-width="4" stroke-dasharray="14 10" opacity="${cut * 0.7}"/>`; }
  return o + `</g>`;
}
function hall(t, light = 1) {
  let o = `<rect width="${SW}" height="${SH}" fill="#1b1420"/><rect y="1240" width="${SW}" height="680" fill="#2b1c18"/><rect y="1240" width="${SW}" height="20" fill="#4a2f22"/>`;
  o += `<path d="M 0 260 Q 140 520 60 1240 L 0 1240 Z" fill="#5a1626"/><path d="M 1080 260 Q 940 520 1020 1240 L 1080 1240 Z" fill="#5a1626"/><rect y="230" width="${SW}" height="70" fill="#6e1b2e"/>`;
  for (let i = 0; i < 7; i++) o += `<g transform="translate(${80 + i * 155} ${1560 + (i % 2) * 60})"><rect x="-55" y="-40" width="110" height="130" rx="14" fill="#140e14" stroke="#000" stroke-width="5"/><circle cx="0" cy="-70" r="38" fill="#140e14"/></g>`;   // audience silhouettes
  o += `<polygon points="460,300 620,300 860,1260 220,1260" fill="#fff3c8" opacity="${0.10 * light}"/>`;
  return o;
}
function podium(x = 860, y = 1050, phone = 0, t = 0) {
  let o = `<g transform="translate(${x} ${y})"><path d="M -110 -40 L 110 -40 L 90 220 L -90 220 Z" fill="#4a2f22" stroke="#000" stroke-width="7"/><rect x="-125" y="-62" width="250" height="30" rx="6" fill="#6b4530" stroke="#000" stroke-width="6"/><line x1="40" y1="-62" x2="70" y2="-150" stroke="#222" stroke-width="8"/><ellipse cx="72" cy="-158" rx="16" ry="22" fill="#333" stroke="#000" stroke-width="4"/>`;
  if (phone > 0) { o += `<g opacity="${phone}"><ellipse cx="0" cy="150" rx="140" ry="60" fill="url(#gPhone)" opacity="0.8"/><rect x="-34" y="120" width="68" height="110" rx="12" fill="#111" stroke="#000" stroke-width="5"/><rect x="-26" y="132" width="52" height="84" rx="6" fill="${AQUA}"/>`; for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; o += `<path d="M ${50 + k * 60} ${150 - k * 30} q 20 25 0 50" fill="none" stroke="${AQUA}" stroke-width="6" opacity="${1 - k}"/>`; } o += `</g>`; }
  return o + `</g>`;
}
function wallClock(x, y, r, mins) {
  const a = mins / 60 * 360, ha = (21 % 12) * 30 + mins * 0.5;
  return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#f4efe6" stroke="#000" stroke-width="8"/>${[0, 1, 2, 3].map(i => `<line x1="0" y1="${-r + 10}" x2="0" y2="${-r + 26}" stroke="#000" stroke-width="6" transform="rotate(${i * 90})"/>`).join("")}<line x1="0" y1="0" x2="0" y2="${-r * 0.5}" stroke="#000" stroke-width="10" stroke-linecap="round" transform="rotate(${ha})"/><line x1="0" y1="0" x2="0" y2="${-r * 0.8}" stroke="#000" stroke-width="6" stroke-linecap="round" transform="rotate(${a})"/><circle r="8" fill="#000"/></g>`;
}
// ---------- suspects (rig front busts) ----------
const SUS = {
  seg: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#1f2a3d", hoodD: "#151d2b", hair: "#120c09", style: "short" }, label: "SEGURANÇA", alibi: "desceu ao quadro de luz", col: "#8fb4ff" },
  col: { c: { skin: "#f0c8a8", skinD: "#d6a888", hood: "#8a1f2e", hoodD: "#6a1722", hair: "#1c1410", style: "curly" }, label: "COLECIONADORA", alibi: "\"ainda vai ser meu\"", col: CRIME },
  zel: { c: { skin: "#e8bf9a", skinD: "#cc9f7a", hood: "#7a5fa8", hoodD: "#5e4785", hair: "#d8d8de", style: "old" }, label: "DONA ZÉLIA, 72", alibi: "voz no palco o tempo todo", col: LILAC },
};
function bust(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: SUS[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.01) }, f)));
  let w = "";
  if (k === "zel") w += `<circle cx="960" cy="276" r="44" fill="#d8d8de" stroke="${INK}" stroke-width="5"/>`;
  w += personBack(P) + personHead(P, t);
  if (k === "seg") w += `<path d="M 878 330 Q 960 250 1042 330 L 1060 340 L 860 340 Z" fill="#1f2a3d" stroke="#000" stroke-width="6"/><rect x="935" y="290" width="50" height="26" rx="5" fill="${GOLD}" stroke="#000" stroke-width="4"/>` +
    [0, 1].map(i => { const k2 = (t * 0.7 + i / 2) % 1; return `<path d="M ${1040 - i * 140} ${360 + k2 * 60} q 10 18 0 26 q -10 -8 0 -26 Z" fill="${AQUA}" opacity="${1 - k2}"/>`; }).join("");
  if (k === "col") w += `<circle cx="884" cy="440" r="10" fill="#f4efe6" stroke="#000" stroke-width="3"/><circle cx="1036" cy="440" r="10" fill="#f4efe6" stroke="#000" stroke-width="3"/>`;
  if (k === "zel") w += `<circle cx="928" cy="398" r="30" fill="none" stroke="#3a3326" stroke-width="5"/><circle cx="992" cy="398" r="30" fill="none" stroke="#3a3326" stroke-width="5"/><line x1="958" y1="398" x2="962" y2="398" stroke="#3a3326" stroke-width="5"/><path d="M 900 330 Q 960 300 1020 330" stroke="#bfbfc8" stroke-width="10" fill="none"/>`;
  return cam(960, 470, s, w, y).replace("translate(540 ", `translate(${x} `);
}
function suspectCard(t, a, k, y, letter) {
  const p = pop(t, a); if (p <= 0) return "";
  const S0 = SUS[k];
  let o = `<g transform="translate(540 ${y}) scale(${p}) translate(-540 ${-y})"><rect x="60" y="${y - 150}" width="960" height="300" rx="30" fill="#0d111c" stroke="${S0.col}" stroke-width="6"/>` +
    `<clipPath id="cl${k}"><rect x="80" y="${y - 135}" width="270" height="270" rx="20"/></clipPath><g clip-path="url(#cl${k})"><rect x="80" y="${y - 135}" width="270" height="270" fill="#1d2336"/>${bust(t, k, 215, y + 20, 0.5)}</g>` +
    `<text class="hand" x="390" y="${y - 30}" font-size="${S0.label.length > 12 ? 58 : 70}" fill="${S0.col}">${S0.label}</text><text class="hand" x="390" y="${y + 50}" font-size="44" fill="#cfd8e3">${esc(S0.alibi)}</text>`;
  if (letter) o += `<g transform="translate(960 ${y - 110})"><circle r="52" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt(letter, 0, 0, 70, "#05070c")}</g>`;
  return o + `</g>`;
}
// voice waveform with the cough spike
function wave(x, y, w, col, prog = 1, label = "") {
  let o = `<g transform="translate(${x} ${y})">`, n = 46;
  for (let i = 0; i < n * prog; i++) {
    const cough = i >= 33 && i <= 35, h = cough ? 150 : 20 + 70 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6));
    o += `<rect x="${-w / 2 + i * w / n}" y="${-h / 2}" width="${w / n - 6}" height="${h}" rx="5" fill="${cough ? CRIME : col}"/>`;
  }
  if (prog >= 0.78) o += `<text class="hand" x="${-w / 2 + 34 * w / n}" y="-100" font-size="44" text-anchor="middle" fill="${CRIME}">cof!</text>`;
  if (label) o += `<text class="hand" x="${w / 2}" y="110" font-size="44" text-anchor="end" fill="#8f99a3">${label}</text>`;
  return o + `</g>`;
}
function cane(x, y, open = 0, t = 0) {
  let o = `<g transform="translate(${x} ${y}) rotate(-20)"><path d="M 0 0 L 0 -520 Q 0 -600 70 -600 Q 120 -600 120 -560" fill="none" stroke="#4a2f22" stroke-width="34" stroke-linecap="round"/><path d="M 0 0 L 0 -520 Q 0 -600 70 -600 Q 120 -600 120 -560" fill="none" stroke="#6b4530" stroke-width="18" stroke-linecap="round"/>`;
  if (open > 0) { const L = 380 * open; o += `<g transform="translate(0 ${-30 + L * 0.2})"><rect x="-26" y="${-L}" width="52" height="${L}" rx="10" fill="#f6eedc" stroke="#000" stroke-width="5" transform="translate(${70 * open} 0)"/><rect x="-26" y="${-L}" width="52" height="${L}" fill="url(#gSunset)" opacity="0.55" transform="translate(${70 * open} 0)"/></g>`; }
  return o + `</g>`;
}

function render(t) {
  const end = window.TL.duration;
  let o = `<rect width="${SW}" height="${SH}" fill="${NOIR}"/>`;
  if (t < S(4) - 0.3) {
    // the auction, 21:00, blackout, empty frame
    const off = dip(t, 3.0, 3.15, S(2) + 2.4, S(2) + 2.7), gone = t > S(2) + 2.4 ? 1 : 0;
    o += hall(t) + painting(540, 860, 420, 520, 1 - gone, gone) + podium() + wallClock(160, 470, 80, 59 + seg(t, 0.4, 3.0));
    o += pill(t, 1.2, "21:00", GOLD, 430, 60, 800);
    o += blackout(off * 0.97);
    if (off > 0.5) o += txt("APAGÃO", 540, 760, 120, "#8f99a3", off) + txt(String(Math.max(1, 60 - Math.floor((t - 3.1) * 12))) + " s", 540, 900, 90, CREAM, off);
    if (gone) o += pill(t, S(2) + 2.6, "MOLDURA VAZIA", CRIME, 380, 60, 440) + pill(t, S(3), "QUADRO: R$ 3 MILHÕES", GOLD, 1350, 56);
  } else if (t < S(5) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/>`;
    const pulse = 1 + 0.04 * Math.sin(t * 6);
    o += `<g transform="translate(540 820) scale(${pop(t, S(4)) * pulse})"><circle r="170" fill="none" stroke="${GOLD}" stroke-width="22"/><line x1="120" y1="120" x2="260" y2="260" stroke="${GOLD}" stroke-width="34" stroke-linecap="round"/>${txt("?", 0, 0, 200, CREAM)}</g>`;
    o += txt("PRESTA ATENÇÃO", 540, 470, 96, CREAM, 1, pop(t, S(4) + 0.3));
    o += pill(t, S(4) + 2.4, "NO FIM: VOCÊ APONTA O CULPADO", GOLD, 1250, 46);
  } else if (t < S(9) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
    o += txt("3 SUSPEITOS", 540, 370, 100, CREAM, 1, pop(t, S(5)));
    o += suspectCard(t, S(6), "seg", 620) + suspectCard(t, S(7), "col", 940) + suspectCard(t, S(8), "zel", 1260);
  } else if (t < S(10) - 0.3) {
    const enter = seg(t, S(9) + 2.0, S(9) + 3.3), pol = 1 - enter;
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>`;
    if (pol > 0.02) {
      const blue = Math.sin(t * 9) > 0;
      o += `<g opacity="${pol}"><rect width="${SW}" height="${SH}" fill="${blue ? "#2a5bd7" : CRIME}" opacity="0.18"/>${bust(t, "seg", 540, 1000, 1.6, { browSad: 1, look: [0, 8], smile: -6 })}`;
      o += `<g transform="translate(540 1420)"><circle cx="-60" r="40" fill="none" stroke="#cfd8e3" stroke-width="14"/><circle cx="60" r="40" fill="none" stroke="#cfd8e3" stroke-width="14"/><line x1="-20" y1="0" x2="20" y2="0" stroke="#cfd8e3" stroke-width="10"/></g>`;
      o += pill(t, S(9) + 0.3, "POLÍCIA: \"FOI O SEGURANÇA\"", "#8f99a3", 560, 50) + `</g>`;
    }
    o += `<rect x="330" y="300" width="420" height="1060" fill="#ffe7b0" opacity="${0.3 * enter}"/>` + jo(t, 540, lerp(1700, 470, sm(enter)), 900, enter, 0);
  } else if (t < S(11) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><circle cx="540" cy="900" r="520" fill="${GOLD}" opacity="0.08"/>`;
    o += jo(t, 540, 520, 1000, 1, 1);
    o += txt("JOSEPH", 540, 360, 150, CREAM, 1, pop(t, S(10))) + txt("O CALCULISTA", 540, 470, 80, GOLD, 1, pop(t, S(10) + 0.5));
    o += pill(t, S(10) + 3.2, "ELE FAZ A CONTA", GOLD, 1680, 54);
  } else if (t < S(12) - 0.2) {
    // clue 1: the timer in the fuse box
    o += `<rect width="${SW}" height="${SH}" fill="#11151c"/>`;
    for (let i = 0; i < 9; i++) o += `<rect x="0" y="${300 + i * 130}" width="${SW}" height="6" fill="#1a2029"/>`;
    o += `<g transform="translate(540 930)"><rect x="-300" y="-360" width="600" height="720" rx="16" fill="#5a6270" stroke="#000" stroke-width="10"/><rect x="-260" y="-320" width="520" height="640" rx="8" fill="#2a2f3a"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) o += `<rect x="${-220 + c * 115}" y="${-280 + r * 80}" width="70" height="56" rx="6" fill="#d9d4c7" stroke="#000" stroke-width="4"/><rect x="${-198 + c * 115}" y="${-270 + r * 80}" width="26" height="${r === 1 && c === 2 ? 20 : 34}" fill="${r === 1 && c === 2 ? CRIME : "#555"}"/>`;
    const k = seg(t, S(11) + 2.4, S(11) + 3.0);
    o += `<g transform="translate(0 ${200}) scale(${0.6 + 0.4 * k})"><rect x="-190" y="-80" width="380" height="160" rx="14" fill="#111" stroke="${CRIME}" stroke-width="${4 + 6 * k}"/><text x="0" y="40" font-family="monospace" font-size="110" font-weight="700" text-anchor="middle" fill="${CRIME}">21:00</text></g></g>`;
    o += badge(t, S(11), 1) + pill(t, S(11) + 1.0, "NÃO FOI ACIDENTE", CRIME, 400, 56, 640) + pill(t, S(11) + 3.4, "TIMER: 21:00 EM PONTO", GOLD, 1420, 52);
  } else if (t < S(13) - 0.2) {
    // clue 2: the folded cloth
    o += hall(t, 0.6) + painting(540, 780, 360, 440, 0, 1);
    const k = seg(t, S(12) + 1.4, S(12) + 2.4);
    o += `<g transform="translate(540 1180) scale(${0.8 + 0.4 * k})"><path d="M -170 40 L 170 40 L 150 -10 L -150 -10 Z" fill="#5a1626" stroke="#000" stroke-width="6"/><path d="M -150 -10 L 150 -10 L 135 -50 L -135 -50 Z" fill="#6e1b2e" stroke="#000" stroke-width="6"/><path d="M -135 -50 L 135 -50 L 120 -86 L -120 -86 Z" fill="#7d2236" stroke="#000" stroke-width="6"/><line x1="-120" y1="-30" x2="120" y2="-30" stroke="#9a3048" stroke-width="4"/></g>`;
    o += badge(t, S(12), 2) + pill(t, S(12) + 1.6, "PANO DOBRADO", GOLD, 1380, 60) + pill(t, S(12) + 3.6, "LADRÃO COM PRESSA NÃO DOBRA", AQUA, 1660, 44);
  } else if (t < S(15) - 0.3) {
    // clue 3: the cough, twice
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + `<g opacity="0.35">${podium(540, 1150)}</g>`;
    o += badge(t, S(13), 3);
    o += pill(t, S(13) + 1.4, "\"CALMA, NINGUÉM SAI DO LUGAR\"", LILAC, 400, 44);
    o += wave(540, 640, 860, LILAC, seg(t, S(13) + 1.4, E(13)), "21:00:10");
    if (t > S(14)) {
      o += wave(540, 960, 860, LILAC, seg(t, S(14) + 1.0, S(14) + 4.0), "21:00:40");
      const k = seg(t, S(14) + 4.6, S(14) + 5.4);
      if (k > 0) o += `<rect x="${540 - 430 + 33 * 860 / 46 - 14}" y="520" width="${3 * 860 / 46 + 22}" height="560" rx="16" fill="none" stroke="${GOLD}" stroke-width="8" opacity="${k}"/>`;
      o += pill(t, S(14) + 5.0, "MESMA FRASE · MESMA TOSSE", GOLD, 1250, 50);
    }
  } else if (t < S(17) - 0.2) {
    // the challenge: comment before the reveal
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
    const glow = 0.5 + 0.5 * Math.sin(t * 5);
    o += `<rect x="40" y="320" width="1000" height="200" rx="30" fill="${CRIME}" opacity="${0.15 + 0.1 * glow}"/>`;
    o += txt("COMENTA AGORA:", 540, 380, 84, CREAM, 1, pop(t, S(15))) + txt("QUEM ROUBOU O QUADRO?", 540, 470, 66, GOLD, 1, pop(t, S(15) + 1.0));
    o += suspectCard(t, S(16), "seg", 700, "A") + suspectCard(t, S(16) + 0.8, "col", 1010, "B") + suspectCard(t, S(16) + 1.6, "zel", 1320, "C");
    const g0 = E(16) + 0.2;
    if (t > g0) {
      const n = Math.max(1, 5 - Math.floor((t - g0) / 1.1)), ph = ((t - g0) % 1.1) / 1.1;
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.55"/>`;
      o += `<g transform="translate(540 960) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="230" fill="#05070c" stroke="${GOLD}" stroke-width="14"/><circle r="230" fill="none" stroke="${CRIME}" stroke-width="14" stroke-dasharray="${1445 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 260, CREAM)}</g>`;
      o += txt("A, B OU C?", 540, 1560, 100, GOLD) + txt("ESCREVE NOS COMENTÁRIOS", 540, 1680, 60, CREAM);
    }
  } else if (t < S(18) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>`;
    const k = seg(t, S(17) + 0.4, S(17) + 1.8);
    o += wave(540, lerp(640, 820, k), 860, LILAC, 1, "") + `<g opacity="0.75">${wave(540, lerp(1000, 820, k), 860, GOLD, 1, "")}</g>`;
    o += txt("NINGUÉM TOSSE IGUAL 2 VEZES", 540, 420, 58, CREAM, 1, pop(t, S(17)));
    o += stamp(t, S(17) + 2.0, "= GRAVAÇÃO", 1180, CRIME, 100, 720);
  } else if (t < S(19) - 0.2) {
    // the voice is on stage; she is not
    o += hall(t, 0.1) + `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.6"/>` + podium(540, 1000, 1, t);
    const k = seg(t, S(18) + 1.6, E(18));
    o += `<g opacity="${0.4 + 0.6 * k}" transform="translate(${lerp(200, 130, k)} 1080)"><circle cy="-170" r="46" fill="#000" stroke="${LILAC}" stroke-width="4"/><circle cy="-224" r="22" fill="#000" stroke="${LILAC}" stroke-width="4"/><path d="M -70 120 Q -60 -110 0 -118 Q 60 -110 70 120 Z" fill="#000" stroke="${LILAC}" stroke-width="4"/><line x1="70" y1="-20" x2="100" y2="140" stroke="${LILAC}" stroke-width="8"/></g>`;
    o += pill(t, S(18), "A VOZ: NO PALCO", AQUA, 420, 60) + pill(t, S(18) + 1.8, "ELA: NÃO", CRIME, 560, 64);
  } else if (t < S(20) - 0.3) {
    // the calculation board
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><rect x="60" y="380" width="960" height="900" rx="20" fill="#13261d" stroke="#5a4630" stroke-width="16"/>`;
    const rows = [["APAGÃO", "60 s", S(19) + 0.3], ["ATÉ A MOLDURA", "8 PASSOS", S(19) + 2.0], ["VOZ NO PALCO", "GRAVAÇÃO", S(19) + 3.4], ["ZÉLIA", "LIVRE", S(19) + 4.2]];
    rows.forEach(([a, b, at], i) => { const k = seg(t, at, at + 0.4); if (k > 0) o += `<text class="hand" x="110" y="${490 + i * 140}" font-size="62" fill="#e8efe6" opacity="${k}">${a} <tspan fill="${i % 2 ? CRIME : GOLD}">${b}</tspan></text>`; });
    const ln = seg(t, S(19) + 4.4, S(19) + 4.8);
    if (ln > 0) o += `<line x1="110" y1="1050" x2="${lerp(110, 970, ln)}" y2="1050" stroke="#e8efe6" stroke-width="8"/>`;
    o += stamp(t, S(19) + 4.8, "= MENTIU", 1170);
  } else if (t < S(21) - 0.3) {
    // phone under the pulpit + the hollow cane
    const k1 = seg(t, S(20) + 0.2, S(20) + 1.0), k2 = seg(t, S(20) + 3.6, S(20) + 5.2);
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "zel", 540, 900, 1.3, { browUp: 8, look: [0, 4], mouthOpen: 0.35 * k2 });
    o += `<g transform="translate(220 1350) scale(${0.6 + 0.4 * k1})" opacity="${k1}"><ellipse cx="0" cy="0" rx="150" ry="80" fill="url(#gPhone)" opacity="0.8"/><rect x="-40" y="-70" width="80" height="140" rx="14" fill="#111" stroke="#000" stroke-width="5"/><rect x="-30" y="-56" width="60" height="110" rx="6" fill="${AQUA}"/><path d="M -14 -20 L 16 0 L -14 20 Z" fill="#05070c"/></g>`;
    o += pill(t, S(20) + 0.6, "CELULAR NO PÚLPITO", AQUA, 1560, 46, 360);
    if (t > S(20) + 3.2) o += cane(770, 1760, k2, t) + pill(t, S(20) + 4.6, "A BENGALA OCA", GOLD, 400, 64);
  } else if (t < S(22) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "zel", 540, 960, 1.4, { browSad: 1, look: [0, 10], smile: -4 });
    o += pill(t, S(21) + 0.8, "ORFANATO FALINDO", "#8f99a3", 420, 58);
    o += pill(t, S(21) + 4.6, "1 QUADRO = VENDIDO 2 VEZES", GOLD, 1420, 48) + pill(t, S(21) + 6.2, "LEILÃO + MERCADO ESCONDIDO", CRIME, 1580, 44);
  } else if (t < S(23) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>`;
    o += `<g transform="translate(540 1400) scale(${lerp(1.0, 1.15, seg(t, S(22), E(22)))}) translate(-540 -1400)">${jo(t, 540, 560, 1500, 1, 0.6)}</g>`;
    o += txt("OS NÚMEROS NÃO MENTEM.", 540, 400, 70, GOLD, 1, pop(t, S(22))) + txt("AS PESSOAS, SIM.", 540, 500, 70, CREAM, 1, pop(t, S(22) + 1.8));
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + jo(t, 540, 760, 900, 0.9, 0.4);
    o += `<g transform="translate(540 520) rotate(-6) scale(${pop(t, S(23), 0.25)})"><rect x="-400" y="-90" width="800" height="180" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO 2 · RESOLVIDO", 0, 0, 84, CRIME)}</g>`;
    o += pill(t, S(23) + 1.6, "ACERTOU? COMENTA \"EU SABIA\"", GOLD, 720, 46);
    o += pill(t, S(23) + 4.6, "CASO 3: EM BREVE", GOLD, 1700, 60);
  }
  if (t < S(4) - 0.3) o += rain(t, 0.12);
  o += flash(t);
  o += vignette();
  if (!window.THUMB) o += `<g><rect x="70" y="140" width="940" height="120" rx="30" fill="#05070c" opacity="0.9" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="540" y="222" font-size="58" text-anchor="middle" fill="${CREAM}">JOSEPH, O CALCULISTA · CASO 2</text></g>`;
  o += capShort(t, 1800);
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
