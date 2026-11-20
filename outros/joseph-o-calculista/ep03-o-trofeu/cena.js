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
  cap: { c: { skin: "#f1c9a5", skinD: "#d6ab86", hood: "#b3262f", hoodD: "#8a1d24", hair: "#3a2414", style: "short" }, label: "CAPITÃO RIVAL", alibi: "\"esse troféu é nosso\"", col: CRIME, L: "A" },
  zel: { c: { skin: "#c68b5e", skinD: "#a97046", hood: "#5a6270", hoodD: "#454b57", hair: "#bfbfc8", style: "short" }, label: "ZELADOR", alibi: "tem a chave da sala", col: "#cfd8e3", L: "B" },
  davi: { c: { skin: "#8d5a3b", skinD: "#744830", hood: "#1f8a4c", hoodD: "#176a3a", hair: "#120c09", style: "curly" }, label: "GOLEIRO DAVI", alibi: "o herói · \"não saí\"", col: "#5be08a", L: "C" },
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
    `<text class="hand" x="390" y="${y - 30}" font-size="${S0.label.length > 12 ? 60 : 70}" fill="${S0.col}">${S0.label}</text><text class="hand" x="390" y="${y + 50}" font-size="46" fill="#cfd8e3">${esc(S0.alibi)}</text>`;
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

function render(t) {
  const end = window.TL.duration;
  let o = `<rect width="${SW}" height="${SH}" fill="${NOIR}"/>`;
  if (t < S(2) - 0.2) {                               // halftime, empty showcase
    if (t < 2.4) o += stadium(t) + scoreboard(t, 15 - t * 2);
    else o += vitrine(t, false) + stamp(t, 2.9, "SUMIU", 760, CRIME, 120);
    o += pill(t, 0.6, "FINAL DO CAMPEONATO", GOLD, 330, 52);
  } else if (t < S(3) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
    o += txt("COMENTA ANTES DO FIM:", 540, 700, 78, CREAM, 1, pop(t, S(2))) + txt("QUEM FOI?", 540, 860, 150, GOLD, 1, pop(t, S(2) + 0.8));
  } else if (t < S(6) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>` + txt("3 SUSPEITOS", 540, 370, 100, CREAM);
    o += card(t, S(3), "cap", 620) + card(t, S(4), "zel", 940) + card(t, S(5), "davi", 1260);
    if (t > S(5) + 1.0) o += pill(t, S(5) + 1.0, "DEFENDEU UM PÊNALTI", "#5be08a", 1480, 46);
  } else if (t < S(7) - 0.3) {
    const enter = seg(t, S(6), S(6) + 1.2);
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><circle cx="540" cy="900" r="520" fill="${GOLD}" opacity="${0.08 * enter}"/>` + jo(t, 540, lerp(1500, 520, sm(enter)), 1000, enter, 1);
    o += txt("JOSEPH", 540, 360, 150, CREAM, 1, pop(t, S(6) + 1.0)) + txt("O CALCULISTA", 540, 470, 80, GOLD, 1, pop(t, S(6) + 1.4));
    o += pill(t, S(6) + 3.0, "ELE FAZ A CONTA", GOLD, 1680, 54);
  } else if (t < S(8) - 0.2) {                        // clue 1: mud only in the small area
    if (t < S(7) + 2.2) {
      o += `<rect width="${SW}" height="${SH}" fill="#2a2420"/>`;
      for (const [x, y, r] of [[400, 900, -12], [640, 1180, -6], [420, 1460, -14]]) o += `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M -50 -110 Q 0 -150 50 -110 Q 70 -30 45 30 Q 0 50 -45 30 Q -70 -30 -50 -110 Z" fill="${MUD}" stroke="#3a2614" stroke-width="5"/></g>`;
      o += pill(t, S(7) + 0.4, "LAMA NA SALA", "#e0a060", 400, 64);
    } else {
      o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + field(t, t > S(7) + 4.0);
      o += pill(t, S(7) + 2.4, "CAMPO SECO", GOLD, 330, 56);
      if (t > S(7) + 4.0) o += pill(t, S(7) + 4.0, "SÓ A PEQUENA ÁREA", "#e0a060", 1720, 54);
    }
    o += badge(t, S(7), 1);
  } else if (t < S(9) - 0.2) {                        // clue 2: left for 4 minutes
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + badge(t, S(8), 2);
    o += `<g transform="translate(540 900)"><rect x="-150" y="-260" width="300" height="520" rx="40" fill="#111" stroke="#000" stroke-width="8"/><rect x="-125" y="-215" width="250" height="410" rx="16" fill="#1d2336"/>${txt("MÃE", 0, -120, 60, CREAM)}<circle cx="0" cy="40" r="60" fill="#30a46c"/><path d="M -24 30 q 24 -30 48 0" stroke="#fff" stroke-width="10" fill="none"/></g>`;
    o += pill(t, S(8) + 0.8, "FISIOTERAPEUTA:", DIM, 380, 50) + pill(t, S(8) + 2.6, "SAIU 4 MINUTOS", CRIME, 1380, 70);
  } else if (t < S(10) - 0.3) {                       // the calculation
    o += `<rect width="${SW}" height="${SH}" fill="#07090f"/><rect x="60" y="380" width="960" height="900" rx="20" fill="#13261d" stroke="#5a4630" stroke-width="16"/>`;
    const rows = [["ATÉ A SALA", "2 min", S(9) + 1.0], ["IDA + VOLTA", "2 + 2", S(9) + 3.0], ["= ", "4 min", S(9) + 4.6], ["\"NÃO SAÍ\"", "", S(9) + 5.0]];
    rows.forEach(([a, b, at], i) => { const k = seg(t, at, at + 0.4); if (k > 0) o += `<text class="hand" x="120" y="${510 + i * 140}" font-size="72" fill="#e8efe6" opacity="${k}">${a} <tspan fill="${i === 2 ? CRIME : GOLD}">${b}</tspan></text>`; });
    o += stamp(t, S(9) + 5.4, "= MENTIU", 1170);
  } else if (t < S(11) - 0.2) {                       // challenge + 3-second countdown
    o += `<rect width="${SW}" height="${SH}" fill="#0a0d16"/>`;
    o += txt("COMENTA AGORA:", 540, 380, 84, CREAM, 1, pop(t, S(10))) + txt("A, B OU C?", 540, 480, 76, GOLD, 1, pop(t, S(10) + 0.6));
    o += card(t, S(10) + 0.3, "cap", 700) + card(t, S(10) + 0.6, "zel", 1010) + card(t, S(10) + 0.9, "davi", 1320);
    const g0 = E(10) + 0.2;
    if (t > g0) {
      const n = Math.max(1, 3 - Math.floor((t - g0) / 1.2)), ph = ((t - g0) % 1.2) / 1.2;
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.55"/><g transform="translate(540 960) scale(${1.25 - 0.25 * sm(cl(ph * 3))})"><circle r="230" fill="#05070c" stroke="${GOLD}" stroke-width="14"/><circle r="230" fill="none" stroke="${CRIME}" stroke-width="14" stroke-dasharray="${1445 * (1 - ph)} 2000" transform="rotate(-90)"/>${txt(String(n), 0, 0, 260, CREAM)}</g>`;
      o += txt("A, B OU C?", 540, 1560, 100, GOLD) + txt("ESCREVE NOS COMENTÁRIOS", 540, 1680, 60, CREAM);
    }
  } else if (t < S(12) - 0.3) {                       // who lives in the small area?
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>` + field(t, true);
    if (t > S(11) + 2.2) o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.6"/>` + bust(t, "davi", 540, 1000, 1.6, { look: [6, 4] }) + stamp(t, S(11) + 2.4, "O GOLEIRO", 520);
  } else if (t < S(13) - 0.3) {                       // the bag
    const k = seg(t, S(12) + 0.6, S(12) + 2.0);
    o += `<rect width="${SW}" height="${SH}" fill="#0d111c"/>`;
    o += trophy(540, lerp(1320, 980, sm(k)), 1.3, t, k);
    o += `<g transform="translate(540 1300)"><path d="M -320 -120 L 320 -120 L 290 200 L -290 200 Z" fill="#1f8a4c" stroke="#000" stroke-width="10"/><path d="M -200 -120 Q 0 -260 200 -120" fill="none" stroke="#000" stroke-width="22"/>${txt("LUVAS · DAVI 1", 0, 60, 52, "#f4efe6")}</g>`;
    o += stamp(t, S(12) + 2.4, "C · CULPADO", 420);
  } else if (t < S(14) - 0.3) {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/><g transform="translate(540 1400) scale(${lerp(1.0, 1.15, seg(t, S(13), E(13)))}) translate(-540 -1400)">${jo(t, 540, 560, 1500, 1, 0.6)}</g>`;
    o += txt("OS NÚMEROS NÃO MENTEM.", 540, 400, 70, GOLD, 1, pop(t, S(13))) + txt("AS PESSOAS, SIM.", 540, 500, 70, CREAM, 1, pop(t, S(13) + 1.8));
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#05070c"/>` + jo(t, 540, 760, 900, 0.9, 0.4);
    o += `<g transform="translate(540 520) rotate(-6) scale(${pop(t, S(14), 0.25)})"><rect x="-400" y="-90" width="800" height="180" rx="16" fill="#05070c" stroke="${CRIME}" stroke-width="12"/>${txt("CASO 3 · RESOLVIDO", 0, 0, 84, CRIME)}</g>`;
    o += pill(t, S(14) + 1.6, "ACERTOU? COMENTA \"EU SABIA\"", GOLD, 720, 46);
    o += pill(t, S(14) + 4.0, "CASO 4: EM BREVE", GOLD, 1700, 60);
  }
  o += vignette();
  if (!window.THUMB) o += `<g><rect x="70" y="140" width="940" height="120" rx="30" fill="#05070c" opacity="0.9" stroke="${GOLD}" stroke-width="5"/><text class="hand" x="540" y="222" font-size="58" text-anchor="middle" fill="${CREAM}">JOSEPH, O CALCULISTA · CASO 3</text></g>`;
  o += capShort(t, 1800);
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
