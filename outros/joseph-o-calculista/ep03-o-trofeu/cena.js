// JOSEPH, O CALCULISTA · CASO 3: O TROFÉU DO INTERVALO (vertical, ~1:17). Palpite A/B/C antes da revelação.
const NOIR = "#0b0f1a", CRIME = "#e5484d", AQUA = "#4fd1ff", GRASS = "#2f7a3e", MUD = "#6b4a2b", DIM = "#8f99a3";
const JW = 791, JH = 1249;
function jo(t, x, y, h, op = 1, glow = 0) {
  const w = h * JW / JH, br = 1 + 0.006 * Math.sin(t * 2.2);
  let o = `<g opacity="${op}" transform="translate(${x} ${y + h}) scale(1 ${br}) translate(${-x} ${-(y + h)})">`;
  if (glow) o += `<ellipse cx="${x}" cy="${y + h * 0.45}" rx="${w * 0.75}" ry="${h * 0.55}" fill="${GOLD}" opacity="${0.18 * glow}"/>`;
  return o + `<image href="assets/joseph.png" x="${x - w / 2}" y="${y}" width="${w}" height="${h}"/></g>`;
}
function pill(t, a, s, col, y, size = 58, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#05070c" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(esc(s), 0, 0, size, col)}</g>`; }
function badge(t, a, n, x = 170, y = 420) { const p = pop(t, a); return p > 0 ? `<g transform="translate(${x} ${y}) scale(${p})"><circle r="70" fill="${GOLD}" stroke="#000" stroke-width="7"/>${txt(String(n), 0, 0, 90, "#05070c")}</g>` : ""; }
function stamp(t, a, s, y, col = CRIME, size = 100) { if (t < a) return ""; const w = s.length * size * 0.55 + 90; return `<g transform="translate(540 ${y}) rotate(-6) scale(${pop(t, a, 0.25)})"><rect x="${-w / 2}" y="-80" width="${w}" height="160" rx="14" fill="#05070c" opacity="0.85" stroke="${col}" stroke-width="12"/>${txt(esc(s), 0, 0, size, col)}</g>`; }
function trophy(x, y, s, t, glow = 1) {
  const k = Math.abs(Math.sin(t * 4));
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-60" rx="170" ry="190" fill="${GOLD}" opacity="${0.12 * glow}"/><path d="M -90 -200 L 90 -200 Q 90 -40 0 -10 Q -90 -40 -90 -200 Z" fill="${GOLD}" stroke="#000" stroke-width="7"/><path d="M -90 -170 Q -160 -170 -140 -110 Q -120 -70 -70 -80" fill="none" stroke="${GOLD}" stroke-width="16"/><path d="M 90 -170 Q 160 -170 140 -110 Q 120 -70 70 -80" fill="none" stroke="${GOLD}" stroke-width="16"/><rect x="-18" y="-12" width="36" height="60" fill="${GOLD}" stroke="#000" stroke-width="6"/><rect x="-80" y="48" width="160" height="40" rx="6" fill="#3a2414" stroke="#000" stroke-width="6"/><path d="M -40 -170 Q -50 -100 -20 -60" stroke="#fff3c8" stroke-width="10" fill="none" opacity="0.7"/><path d="M 60 -230 l 6 16 l 16 6 l -16 6 l -6 16 l -6 -16 l -16 -6 l 16 -6 Z" fill="#fff" opacity="${k}"/></g>`;
}
function vitrine(t, has) {
  let o = `<rect width="${SW}" height="${SH}" fill="#141821"/><rect y="1240" width="${SW}" height="680" fill="#2a2420"/>`;
  o += `<rect x="290" y="420" width="500" height="760" fill="#0d111c" stroke="#9aa3b2" stroke-width="12"/><rect x="290" y="1180" width="500" height="80" fill="#3a2414" stroke="#000" stroke-width="6"/><path d="M 330 460 L 420 460 L 330 600 Z" fill="#fff" opacity="0.08"/>`;
  return o + (has ? trophy(540, 960, 1.2, t) : `<rect x="440" y="1040" width="200" height="40" fill="#1d2336"/>`);
}
function stadium(t) {
  let o = `<rect width="${SW}" height="${SH}" fill="#070a12"/><rect y="1100" width="${SW}" height="820" fill="${GRASS}"/>`;
  for (let i = 0; i < 6; i++) o += `<rect x="0" y="${1100 + i * 140}" width="${SW}" height="70" fill="#2a6e37"/>`;
  for (const x of [140, 940]) o += `<g transform="translate(${x} 360)"><rect x="-10" y="0" width="20" height="740" fill="#2a2f3a"/><rect x="-90" y="-60" width="180" height="90" fill="#e8efe6" stroke="#000" stroke-width="5"/><polygon points="${x < 540 ? "-90,30 90,30 600,800 -200,800" : "-90,30 90,30 200,800 -600,800"}" fill="#fff6d8" opacity="0.06"/></g>`;
  for (let i = 0; i < 40; i++) o += `<circle cx="${hash(i) * 1080}" cy="${880 + hash(i + 5) * 180}" r="16" fill="#151a24"/>`;
  return o;
}
function scoreboard(t, mins) {
  return `<g transform="translate(540 600)"><rect x="-330" y="-150" width="660" height="300" rx="16" fill="#05070c" stroke="#3a3326" stroke-width="12"/><text x="0" y="-60" font-family="monospace" font-size="54" font-weight="700" text-anchor="middle" fill="${GOLD}">INTERVALO</text><text x="0" y="80" font-family="monospace" font-size="150" font-weight="700" text-anchor="middle" fill="${CRIME}">${String(Math.floor(mins)).padStart(2, "0")}:${String(Math.floor((mins % 1) * 60)).padStart(2, "0")}</text></g>`;
}
const SUS = {
  cap: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#b3262f", hoodD: "#8a1d24", hair: "#3a2414", style: "short" }, label: "BRUNO · CAPITÃO RIVAL", alibi: "sumiu no intervalo", col: CRIME, L: "A" },
  zel: { c: { skin: "#c68b5e", skinD: "#a97046", hood: "#5a6270", hoodD: "#454b57", hair: "#bfbfc8", style: "short" }, label: "SEU JAIRO · ZELADOR", alibi: "chave + dívidas", col: "#cfd8e3", L: "B" },
  davi: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#1f8a4c", hoodD: "#176a3a", hair: "#120c09", style: "curly" }, label: "DAVI · GOLEIRO, 17", alibi: "o herói · gelo no joelho", col: "#5be08a", L: "C" },
};
function bust(t, k, x, y, s, f = {}) {
  const P = Object.assign({ x: 960, c: SUS[k].c }, face(Object.assign({ lid: blink(t, 0.08, x * 0.01) }, f)));
  let w = personBack(P) + personHead(P, t);
  if (k === "cap") w += `<rect x="830" y="600" width="70" height="30" fill="#f4efe6" stroke="#000" stroke-width="4" transform="rotate(-10 865 615)"/><text x="865" y="625" font-family="monospace" font-size="24" font-weight="700" text-anchor="middle" fill="#05070c" transform="rotate(-10 865 615)">C</text>`;
  if (k === "zel") w += `<path d="M 878 330 Q 960 260 1042 330 L 1062 342 L 858 342 Z" fill="#5a6270" stroke="#000" stroke-width="6"/><circle cx="1050" cy="640" r="14" fill="${GOLD}" stroke="#000" stroke-width="4"/><path d="M 1050 626 L 1050 600" stroke="${GOLD}" stroke-width="6"/>`;
  if (k === "davi") w += `<text x="960" y="650" font-family="monospace" font-size="70" font-weight="700" text-anchor="middle" fill="#f4efe6" stroke="#000" stroke-width="3">1</text>`;
  return cam(960, 470, s, w, y).replace("translate(540 ", `translate(${x} `);
}
function card(t, a, k, y, letter = true, dim = 1) {
  const p = pop(t, a); if (p <= 0) return "";
  const S0 = SUS[k];
  let o = `<g opacity="${dim}" transform="translate(540 ${y}) scale(${p}) translate(-540 ${-y})"><rect x="60" y="${y - 150}" width="960" height="300" rx="30" fill="#0d111c" stroke="${S0.col}" stroke-width="6"/>` +
    `<clipPath id="cl${k}${y}"><rect x="80" y="${y - 135}" width="270" height="270" rx="20"/></clipPath><g clip-path="url(#cl${k}${y})"><rect x="80" y="${y - 135}" width="270" height="270" fill="#1d2336"/>${bust(t, k, 215, y + 20, 0.5)}</g>` +
    `<text class="hand" x="390" y="${y - 30}" font-size="${S0.label.length > 16 ? 50 : 60}" fill="${S0.col}">${S0.label}</text><text class="hand" x="390" y="${y + 50}" font-size="46" fill="#cfd8e3">${esc(S0.alibi)}</text>`;
  if (letter) o += `<g transform="translate(960 ${y - 110})"><circle r="52" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt(S0.L, 0, 0, 70, "#05070c")}</g>`;
  return o + `</g>`;
}
function field(t, hi) {   // top view of a pitch: dry, only the small areas muddy
  let o = `<g transform="translate(540 1000)"><rect x="-420" y="-560" width="840" height="1120" rx="10" fill="#3f9a52" stroke="#e8efe6" stroke-width="8"/><line x1="-420" y1="0" x2="420" y2="0" stroke="#e8efe6" stroke-width="6"/><circle r="110" fill="none" stroke="#e8efe6" stroke-width="6"/>`;
  for (const s of [-1, 1]) {
    o += `<rect x="-240" y="${s < 0 ? -560 : 360}" width="480" height="200" fill="none" stroke="#e8efe6" stroke-width="6"/>`;
    o += `<rect x="-120" y="${s < 0 ? -560 : 470}" width="240" height="90" fill="${MUD}" stroke="${hi ? GOLD : "#e8efe6"}" stroke-width="${hi ? 10 : 6}"/>`;
  }
  return o + `</g>`;
}

function sweat(t, x, y) { let o = ""; for (let i = 0; i < 3; i++) { const k = (t * 0.8 + i / 3) % 1; o += `<path d="M ${x + i * 60} ${y + k * 80} q 10 18 0 26 q -10 -8 0 -26 Z" fill="${AQUA}" opacity="${1 - k}"/>`; } return o; }
function bubble(t, a, s, x, y, col = "#1a1a1a") { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * 30 + 80; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="-70" width="${w}" height="140" rx="40" fill="#f4efe6" stroke="#000" stroke-width="7"/><path d="M -40 66 L -90 150 L 20 70 Z" fill="#f4efe6" stroke="#000" stroke-width="7"/>${txt(esc(s), 0, 0, 56, col)}</g>`; }
const red = (t, k = 1) => `<rect width="${SW}" height="${SH}" fill="${CRIME}" opacity="${0.08 * k + 0.04 * Math.sin(t * 3)}"/>`;
function render(t) {
  const end = window.TL.duration;
  let o = `<rect width="${SW}" height="${SH}" fill="${NOIR}"/>`;
  if (t < S(2) - 0.2) {
    if (t < 2.4) o += stadium(t) + scoreboard(t, 15 - t * 2);
    else o += vitrine(t, false) + stamp(t, 2.9, "SUMIU", 760, CRIME, 120);
    o += pill(t, 0.6, "FINAL DO CAMPEONATO", GOLD, 380, 52);
  } else if (t < S(3) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
    o += txt("TODO MUNDO", 540, 640, 100, CREAM, 1, pop(t, S(2))) + txt("TINHA UM CULPADO", 540, 770, 90, CRIME, 1, pop(t, S(2) + 0.6));
    o += txt("COMENTA ANTES DO FIM:", 540, 1050, 66, CREAM, 1, pop(t, S(2) + 2.2)) + txt("QUEM FOI?", 540, 1190, 130, GOLD, 1, pop(t, S(2) + 2.8));
  } else if (t < S(5) - 0.3) {                         // A: Bruno, made to look guilty
    o += `<rect width="${SW}" height="${SH}" fill="#1a0c10"/>` + red(t) + bust(t, "cap", 540, 1050, 1.7, { browAng: 1, look: [6, 2], smile: -4 });
    o += `<g transform="translate(900 380)"><circle r="60" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("A", 0, 0, 80, "#05070c")}</g>` + pill(t, S(3) + 0.3, "BRUNO · CAPITÃO RIVAL", CRIME, 380, 52, 470);
    o += bubble(t, S(3) + 4.0, "\"ESSA TAÇA VAI SER NOSSA\"", 540, 560, "#8a1f1f");
    if (t > S(4)) o += stamp(t, S(4) + 1.0, "SUMIU NO INTERVALO", 1600, CRIME, 70);
  } else if (t < S(7) - 0.3) {                         // B: Seu Jairo, made to look guilty
    o += `<rect width="${SW}" height="${SH}" fill="#11141a"/>` + red(t, 0.6) + bust(t, "zel", 540, 1050, 1.7, { browSad: 1, look: [-6, 8], smile: -6 }) + (t > S(6) ? sweat(t, 700, 620) : "");
    o += `<g transform="translate(900 380)"><circle r="60" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("B", 0, 0, 80, "#05070c")}</g>` + pill(t, S(5) + 0.3, "SEU JAIRO · ZELADOR", "#cfd8e3", 380, 52, 450);
    o += pill(t, S(5) + 2.6, "SÓ ELE TEM A CHAVE", GOLD, 560, 52) + pill(t, S(5) + 4.6, "CHEIO DE DÍVIDAS", CRIME, 1500, 60);
    if (t > S(6)) { const p = pop(t, S(6) + 1.6); o += `<g transform="translate(820 1450) scale(${p})">${[0, 1, 2].map(i => `<g transform="rotate(${-20 + i * 20})"><circle cx="0" cy="-60" r="22" fill="none" stroke="${GOLD}" stroke-width="10"/><rect x="-6" y="-40" width="12" height="80" fill="${GOLD}"/></g>`).join("")}</g>` + stamp(t, S(6) + 2.4, "SUANDO", 1700, AQUA, 80); }
  } else if (t < S(9) - 0.3) {                         // C: Davi, the hero
    o += stadium(t) + `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.45"/><circle cx="540" cy="1000" r="560" fill="${GOLD}" opacity="${0.12 + 0.04 * Math.sin(t * 4)}"/>`;
    o += bust(t, "davi", 540, 1050, 1.7, { smile: 12, look: [0, 4] });
    o += `<g transform="translate(900 380)"><circle r="60" fill="${GOLD}" stroke="#000" stroke-width="6"/>${txt("C", 0, 0, 80, "#05070c")}</g>` + pill(t, S(7) + 0.3, "DAVI · GOLEIRO, 17", "#5be08a", 380, 52, 450);
    o += pill(t, S(7) + 3.0, "DEFENDEU UM PÊNALTI", GOLD, 560, 52);
    if (t > S(7) + 5.4) for (let i = 0; i < 3; i++) { const k = ((t - S(7) - 5.4) * 0.7 + i / 3) % 1; o += txt("DAVI!", 200 + i * 340, 1500 - k * 200, 70, GOLD, 1 - k); }
    if (t > S(8)) o += pill(t, S(8) + 1.2, "VESTIÁRIO · GELO NO JOELHO", AQUA, 1680, 46);
  } else if (t < S(10) - 0.3) {
    const enter = seg(t, S(9) + 2.0, S(9) + 3.2), pol = 1 - enter;
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>`;
    if (pol > 0.02) o += `<g opacity="${pol}"><rect width="${SW}" height="${SH}" fill="${Math.sin(t * 9) > 0 ? "#2a5bd7" : CRIME}" opacity="0.18"/>${bust(t, "zel", 540, 1000, 1.6, { browSad: 1, look: [0, 8], smile: -6 })}<g transform="translate(540 1420)"><circle cx="-60" r="40" fill="none" stroke="#cfd8e3" stroke-width="14"/><circle cx="60" r="40" fill="none" stroke="#cfd8e3" stroke-width="14"/><line x1="-20" x2="20" stroke="#cfd8e3" stroke-width="10"/></g>${pill(t, S(9) + 0.3, "POLÍCIA: \"FOI O ZELADOR\"", DIM, 560, 50)}</g>`;
    o += `<rect x="330" y="300" width="420" height="1060" fill="#ffe7b0" opacity="${0.3 * enter}"/>` + jo(t, 540, lerp(1700, 470, sm(enter)), 900, enter);
  } else if (t < S(11) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><circle cx="540" cy="900" r="520" fill="${GOLD}" opacity="0.08"/>` + jo(t, 540, 520, 1000, 1, 1);
    o += txt("JOSEPH", 540, 360, 150, CREAM, 1, pop(t, S(10))) + txt("O CALCULISTA", 540, 470, 80, GOLD, 1, pop(t, S(10) + 0.5)) + pill(t, S(10) + 3.0, "ELE FAZ A CONTA", GOLD, 1680, 54);
  } else if (t < S(13) - 0.3) {                        // clue 1: key -> spare key in the corridor
    if (t < S(12) + 2.6) {
      o += vitrine(t, false) + `<g transform="translate(790 820)"><rect x="-14" y="-40" width="28" height="80" fill="#2a2f3a"/><g transform="rotate(90)"><circle cx="-60" r="26" fill="none" stroke="${GOLD}" stroke-width="10"/><rect x="-36" y="-6" width="70" height="12" fill="${GOLD}"/></g></g>`;
      o += badge(t, S(11), 1) + pill(t, S(11) + 2.4, "SEM VIDRO QUEBRADO", GOLD, 1420, 54) + pill(t, S(11) + 3.6, "ABERTA COM CHAVE", CRIME, 1560, 58);
      if (t > S(12)) o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.5"/>` + bust(t, "zel", 540, 1000, 1.3, { browSad: 1, look: [0, 8] }) + pill(t, S(12) + 0.4, "TODOS OLHARAM PRO ZELADOR", CRIME, 400, 46);
    } else {
      o += `<rect width="${SW}" height="${SH}" fill="#1b1f28"/>` + `<rect x="0" y="1300" width="${SW}" height="620" fill="#2a2f3a"/>`;
      for (const x of [140, 940]) o += `<rect x="${x - 100}" y="500" width="200" height="800" fill="#3a3326" stroke="#000" stroke-width="8"/>`;
      o += `<rect x="440" y="620" width="200" height="140" rx="10" fill="#3a2414" stroke="#000" stroke-width="6"/><circle cx="540" cy="660" r="8" fill="#888"/><g transform="translate(540 700)"><circle cx="0" cy="-30" r="20" fill="none" stroke="${GOLD}" stroke-width="8"/><rect x="-5" y="-12" width="10" height="60" fill="${GOLD}"/></g>`;
      o += pill(t, S(12) + 2.8, "CHAVE RESERVA", GOLD, 420, 60) + pill(t, S(12) + 4.4, "QUALQUER UM PODIA PEGAR", AQUA, 1500, 50);
      o += txt("VESTIÁRIO A", 140, 460, 40, DIM) + txt("VESTIÁRIO B", 940, 460, 40, DIM);
    }
  } else if (t < S(15) - 0.3) {                        // clue 2: mud -> points at Bruno
    if (t < S(14) - 0.2) {
      o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + field(t, t > S(13) + 4.6) + badge(t, S(13), 2);
      o += pill(t, S(13) + 0.8, "LAMA FRESCA NA SALA", "#e0a060", 330, 50);
      if (t > S(13) + 4.6) o += pill(t, S(13) + 4.6, "SÓ NA PEQUENA ÁREA", "#e0a060", 1720, 54);
    } else {
      o += `<rect width="${SW}" height="${SH}" fill="#1a0c10"/>` + red(t) + bust(t, "cap", 540, 1000, 1.6, { browAng: 1, look: [8, 2], smile: -2 });
      o += `<g transform="translate(540 1450)"><path d="M -150 -40 L 60 -40 Q 120 -40 150 10 L 150 40 L -150 40 Z" fill="#111" stroke="#000" stroke-width="6"/><path d="M -150 40 Q 0 80 150 40" fill="${MUD}"/>${[0, 1, 2, 3].map(i => `<circle cx="${-110 + i * 70}" cy="50" r="10" fill="#555"/>`).join("")}</g>`;
      o += pill(t, S(14) + 0.6, "ATACANTE: VIVE NA ÁREA", CRIME, 420, 50) + stamp(t, S(14) + 3.0, "LAMA NA CHUTEIRA?", 1660, CRIME, 64);
    }
  } else if (t < S(17) - 0.3) {                        // clue 3: 4 minutes; alibis (Davi slipped in quietly)
    if (t < S(16) - 0.2) {
      o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + badge(t, S(15), 3);
      const row = (y, h, ok, a) => { const p = pop(t, a); return p > 0 ? `<g transform="translate(540 ${y}) scale(${p})"><rect x="-360" y="-90" width="720" height="180" rx="24" fill="#05070c" stroke="${ok ? OKC : CRIME}" stroke-width="8"/>${txt(h, -100, 0, 90, CREAM)}<g transform="translate(240 0)">${ok ? trophy(0, 60, 0.4, t) : txt("✗", 0, 0, 120, CRIME)}</g></g>` : ""; };
      o += row(700, "15:10", true, S(15) + 2.0) + row(1000, "15:14", false, S(15) + 5.0);
      o += stamp(t, S(15) + 8.0, "4 MINUTOS", 1350, GOLD, 100);
    } else {
      o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
      o += card(t, S(16), "cap", 620, true) + pill(t, S(16) + 0.6, "SUMIU 10 MINUTOS", CRIME, 800, 50, 640);
      o += card(t, S(16) + 2.6, "zel", 1000, true) + pill(t, S(16) + 3.2, "SOZINHO", CRIME, 1180, 50, 640);
      o += card(t, S(16) + 6.0, "davi", 1380, true, 0.55) + pill(t, S(16) + 7.2, "4 min · ligou pra mãe", DIM, 1560, 34, 640);
    }
  } else if (t < S(18) - 0.2) {                        // challenge + 5-second countdown
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
    o += txt("COMENTA AGORA:", 540, 380, 84, CREAM, 1, pop(t, S(17))) + txt("A, B OU C?", 540, 480, 76, GOLD, 1, pop(t, S(17) + 0.6));
    o += card(t, S(17) + 0.3, "cap", 700) + card(t, S(17) + 0.6, "zel", 1010) + card(t, S(17) + 0.9, "davi", 1320);
    const g0 = E(17) + 0.2;
    if (t > g0) {
      const n = Math.max(1, 5 - Math.floor((t - g0) / 1.0)), ph = ((t - g0) % 1.0);
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.55"/><g transform="translate(540 960) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="230" fill="#05070c" stroke="${GOLD}" stroke-width="14"/><circle r="230" fill="none" stroke="${CRIME}" stroke-width="14" stroke-dasharray="${1445 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 260, CREAM)}</g>`;
      o += txt("A, B OU C?", 540, 1560, 100, GOLD) + txt("ESCREVE NOS COMENTÁRIOS", 540, 1680, 60, CREAM);
    }
  } else if (t < S(21) - 0.3) {                        // the calculation: who fits in 4 minutes
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><rect x="60" y="330" width="960" height="1000" rx="20" fill="#13261d" stroke="#5a4630" stroke-width="16"/>`;
    o += txt("CABE EM 4 MIN?", 540, 420, 70, GOLD);
    const rows = [["BRUNO", "8 min", "✗", S(18) + 1.0, CRIME], ["JAIRO", "12 min", "✗", S(19) + 0.6, CRIME], ["CASA", "2 + 2 = 4", "✓", S(20) + 1.2, OKC]];
    rows.forEach(([a, b, m, at, c], i) => { const k = seg(t, at, at + 0.4); if (k > 0) o += `<text class="hand" x="110" y="${600 + i * 200}" font-size="76" fill="#e8efe6" opacity="${k}">${a}: <tspan fill="${GOLD}">${b}</tspan> <tspan fill="${c}" font-size="96">${m}</tspan></text>`; });
    if (t > S(20) + 4.2) o += stamp(t, S(20) + 4.4, "EXATAMENTE 4", 1180, OKC, 90);
  } else if (t < S(22) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + field(t, true);
    o += pill(t, S(21) + 0.6, "ATACANTE: PASSA", DIM, 330, 54) + pill(t, S(21) + 3.0, "GOLEIRO: MORA", GOLD, 1720, 64);
  } else if (t < S(23) - 0.3) {                        // the twist
    const k = seg(t, S(22) + 0.4, S(22) + 1.6);
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + trophy(540, lerp(1320, 980, sm(k)), 1.3, t, k);
    o += `<g transform="translate(540 1300)"><path d="M -320 -120 L 320 -120 L 290 200 L -290 200 Z" fill="#1f8a4c" stroke="#000" stroke-width="10"/><path d="M -200 -120 Q 0 -260 200 -120" fill="none" stroke="#000" stroke-width="22"/>${txt("LUVAS · DAVI 1", 0, 60, 52, "#f4efe6")}</g>`;
    o += stamp(t, S(22) + 2.2, "C · O HERÓI", 420, CRIME, 100);
  } else if (t < S(24) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + bust(t, "davi", 540, 1050, 1.6, { browSad: 1, look: [0, 10], smile: -6 });
    o += pill(t, S(23) + 0.6, "A CASA DA FAMÍLIA", DIM, 420, 56) + pill(t, S(23) + 4.4, "COLECIONADOR: R$ 50 MIL", GOLD, 1600, 50);
  } else if (t < S(25) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/><g transform="translate(540 1400) scale(${lerp(1.0, 1.15, seg(t, S(24), E(24)))}) translate(-540 -1400)">${jo(t, 540, 560, 1500, 1, 0.6)}</g>`;
    o += txt("OS NÚMEROS NÃO MENTEM.", 540, 400, 70, GOLD, 1, pop(t, S(24))) + txt("AS PESSOAS, SIM.", 540, 500, 70, CREAM, 1, pop(t, S(24) + 1.8));
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + jo(t, 540, 760, 900, 0.9, 0.4);
    o += `<g transform="translate(540 520) rotate(-6) scale(${pop(t, S(25), 0.25)})"><rect x="-400" y="-90" width="800" height="180" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO 3 · RESOLVIDO", 0, 0, 84, CRIME)}</g>`;
    o += pill(t, S(25) + 1.6, "SUSPEITOU DO HERÓI? \"EU SABIA\"", GOLD, 720, 44);
    o += pill(t, S(25) + 4.6, "CASO 4: EM BREVE", GOLD, 1620, 60);
  }
  o += vignette();
  if (!window.THUMB) o += `<g><rect x="70" y="140" width="940" height="120" rx="30" fill="#05070c" opacity="0.9" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="540" y="222" font-size="58" text-anchor="middle" fill="${CREAM}">JOSEPH, O CALCULISTA · CASO 3</text></g>`;
  o += capShort(t, 1800);
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
const OKC = "#30a46c";
window.render = render;
