// SHORT 13 — série O DESAFIO DE 30 DIAS · EP 2 (dias 4 a 10) — abre na porta dourada do EP 1, termina no telefonema
const REDC = "#e5484d", PEACE = "#30a46c", FOC = "#4fd1ff";

function dayOf(t) {
  if (t < S(4) - 0.3) return 4; if (t < S(4) + 2.6) return 5; if (t < S(6) - 0.3) return 6; if (t < S(8) - 0.3) return 7;
  if (t < S(8) + 1.4) return 8; if (t < S(9) - 0.3) return 9; return 10;
}
function stats(t) {
  const call = seg(t, S(9) + 1.0, S(9) + 2.0);
  return {
    ans: kf(t, [[0, 0.5], [S(2), 0.4], [S(5), 0.35], [S(5) + 3, 0.22], [S(9), 0.18]]) + 0.6 * call,
    foc: kf(t, [[0, 0.3], [S(4), 0.45], [S(4) + 3, 0.6], [S(8), 0.72]]),
    paz: kf(t, [[0, 0.15], [S(3), 0.45], [S(5), 0.5], [S(5) + 3, 0.7], [S(8), 0.8]]) - 0.3 * call,
  };
}
function hud(t) {
  const d = dayOf(t), st = stats(t), flash = [S(4) - 0.3, S(4) + 2.6, S(6) - 0.3, S(8) - 0.3, S(8) + 1.4, S(9) - 0.3].some(a => inR(t, a, a + 0.5));
  let o = `<g transform="translate(60 300)"><rect width="960" height="190" rx="30" fill="#07080b" opacity="0.88" stroke="${flash ? GOLD : "#2a3140"}" stroke-width="5"/>`;
  o += `<text class="hand" x="40" y="80" font-size="44" fill="#8f99a3">DIA</text><text class="hand" x="40" y="160" font-size="96" fill="${d === 10 ? REDC : CREAM}">${d}<tspan font-size="44" fill="#8f99a3">/30</tspan></text>`;
  [["ANSIEDADE", st.ans, REDC], ["FOCO", st.foc, FOC], ["PAZ", st.paz, PEACE]].forEach(([lab, v, c], i) => {
    const y = 40 + i * 50;
    o += `<text class="hand" x="290" y="${y + 22}" font-size="32" fill="${c}">${lab}</text><rect x="480" y="${y}" width="440" height="30" rx="15" fill="#1a1f29"/><rect x="480" y="${y}" width="${440 * cl(v)}" height="30" rx="15" fill="${c}"/>`;
  });
  o += `</g>`;
  for (let i = 0; i < 30; i++) { const done = i < d - 1 || (i === d - 1 && d !== 10); o += `<rect x="${60 + i * 32}" y="510" width="26" height="26" rx="6" fill="${i === 6 && d >= 7 ? "#ffd27a" : done ? GOLD : i === 9 && d === 10 ? REDC : "#1a1f29"}" stroke="#000" stroke-width="2"/>`; }
  return o;
}
function room(t, inner, day = 0.8, warm = 0.2, sy = 1240, s = 1.2) { return cam(960, 560, s, roomBg(day, warm) + inner, sy); }
function banner(t, a, s, col, y = 760) { const p = pop(t, a); return p > 0 && t < a + 1.6 ? `<g transform="translate(540 ${y}) scale(${p})" opacity="${1 - seg(t, a + 1.3, a + 1.6)}"><rect x="-${s.length * 32 + 60}" y="-80" width="${s.length * 64 + 120}" height="160" rx="30" fill="#07080b" stroke="${col}" stroke-width="8"/>${txt(s, 0, 0, 96, col)}</g>` : ""; }
const mug = `<g transform="translate(1080 520)"><rect x="-34" y="-40" width="68" height="76" rx="10" fill="#fff" stroke="#000" stroke-width="6"/><path d="M 34 -20 q 26 0 26 20 q 0 20 -26 20" fill="none" stroke="#000" stroke-width="6"/></g>`;

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(4) - 0.3) {
    const open = seg(t, 0.3, 1.6);           // the golden door from the end of EP 1 opens into the morning
    if (t < S(3) - 0.1) {
      o += room(t, josephFront(t, { blanket: true, armsUp: seg(t, S(2) + 0.2, S(2) + 1.0), face: t < S(2) ? { lid: blink(t, 0.05), look: [0, -6], browUp: 8, mouthOpen: 0.15 } : { happy: 1, smile: 12 } }), 1, 0.8);
      if (t > S(2) + 0.6) o += `<g transform="translate(540 760) scale(${pop(t, S(2) + 0.6)})"><rect x="-300" y="-70" width="600" height="140" rx="30" fill="#07080b" stroke="${PEACE}" stroke-width="7"/>${txt("SEM CANSAÇO", 0, 0, 80, PEACE)}</g>`;
    } else {
      o += room(t, josephFront(t, { hR: [1080, 560], hL: [860, 650], face: { smile: 10, look: [-12, -2], lid: blink(t, 0.06) } }) + mug, 1, 1);
      o += `<g transform="translate(540 760) scale(${pop(t, S(3) + 1.6)})"><rect x="-380" y="-70" width="760" height="140" rx="30" fill="#07080b" stroke="${GOLD}" stroke-width="7"/>${txt("UMA MANHÃ SÓ DELE", 0, 0, 70, GOLD)}</g>`;
    }
    if (open < 1) {   // golden door overlay (continuity with EP 1)
      const w = 400 * (1 + 3 * sm(open));
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="${0.9 * (1 - open)}"/><rect x="${540 - w / 2}" y="${640 - 800 * sm(open)}" width="${w}" height="${600 + 1600 * sm(open)}" fill="${GOLD}" opacity="${0.5 * (1 - open)}"/>`;
      o += txt("DIA 4", 540, 760, 130, GOLD, 1 - open);
    }
  } else if (t < S(5) - 0.1) {
    const pages = t < S(4) + 2.6 ? 10 : 20;
    o += room(t, josephFront(t, { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 9], smile: 8, lid: blink(t, 0.06) } }) + mug.replace("1080 520", "1260 600"), 1, 0.6);
    o += `<g transform="translate(820 820) scale(${pop(t, t < S(4) + 2.6 ? S(4) + 1.6 : S(4) + 2.8)})"><rect x="-150" y="-60" width="300" height="120" rx="60" fill="#12151c" stroke="${FOC}" stroke-width="6"/>${txt(`${pages} PÁG`, 0, 0, 62, FOC)}</g>`;
    o += banner(t, S(4) - 0.3, "DIA 5", GOLD) + banner(t, S(4) + 2.6, "DIA 6", GOLD, 640);
  } else if (t < S(6) - 0.3) {
    // the two lines cross
    const x0 = 120, x1 = 960, yb = 1250, yt = 700, k = seg(t, S(5) + 0.3, E(5));
    const A = u => lerp(0.95, 0.2, sm(u)), P = u => lerp(0.15, 0.8, sm(u));
    let da = "", dp = "";
    for (let i = 0; i <= 80 * k; i++) { const u = i / 80; da += `${i ? "L" : "M"} ${lerp(x0, x1, u)} ${lerp(yb, yt, A(u))} `; dp += `${i ? "L" : "M"} ${lerp(x0, x1, u)} ${lerp(yb, yt, P(u))} `; }
    o += `<line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="#3a4150" stroke-width="5"/>`;
    if (da) o += `<path d="${da}" fill="none" stroke="${REDC}" stroke-width="12" stroke-linecap="round"/><path d="${dp}" fill="none" stroke="${PEACE}" stroke-width="12" stroke-linecap="round"/>`;
    o += txt("ANSIEDADE", 260, 680, 50, REDC, seg(t, S(5), S(5) + 0.4)) + txt("PAZ", 860, 640, 60, PEACE, seg(t, E(5) - 1.0, E(5) - 0.6));
    if (k > 0.5) o += `<g transform="translate(${lerp(x0, x1, 0.5)} ${lerp(yb, yt, 0.55)}) scale(${pop(t, S(5) + 0.3 + (E(5) - S(5) - 0.3) * 0.5)})"><path d="M 0 -50 L 14 -16 L 50 -14 L 22 8 L 32 46 L 0 24 L -32 46 L -22 8 L -50 -14 L -14 -16 Z" fill="${GOLD}" stroke="#000" stroke-width="5"/></g>`;
  } else if (t < S(8) - 0.3) {
    if (t < S(7) - 0.1) {
      o += room(t, `<rect x="1190" y="640" width="220" height="260" fill="#3a2f28" stroke="${INK}" stroke-width="7"/>` + josephFront(t, { blanket: true, armsUp: seg(t, S(6) + 1.6, S(6) + 2.2), face: { happy: 1, smile: 12 } }), 1, 0.8);
      o += txt("mesinha vazia ✓", 820, 1000, 48, PEACE, seg(t, S(6) + 2.6, S(6) + 3.0));
      o += banner(t, S(6) - 0.3, "1 SEMANA", "#ffd27a");
    } else {
      // tug of war: new habit vs old habit
      const pos = lerp(0, -1, sm(seg(t, S(7) + 0.4, E(7))));
      o += `<line x1="80" y1="900" x2="1000" y2="900" stroke="#8a6d3b" stroke-width="16" stroke-linecap="round"/><rect x="${530 + pos * 260}" y="860" width="20" height="80" fill="${GOLD}" stroke="#000" stroke-width="4"/><line x1="540" y1="820" x2="540" y2="980" stroke="#cfd8e3" stroke-width="4" stroke-dasharray="10 8"/>`;
      o += `<g transform="translate(260 720)"><rect x="-220" y="-64" width="440" height="128" rx="64" fill="#12151c" stroke="${PEACE}" stroke-width="7"/>${txt("HÁBITO NOVO", 0, 0, 62, PEACE)}</g><g transform="translate(820 720)"><rect x="-230" y="-64" width="460" height="128" rx="64" fill="#12151c" stroke="${REDC}" stroke-width="7"/>${txt("HÁBITO ANTIGO", 0, 0, 58, REDC)}</g>`;
      o += cam(960, 560, 0.55, josephFront(t, { hR: [1150, 640], hL: [1100, 660], face: { browAng: 0.8, smile: 4, look: [10, 0] } }), 1110).replace("translate(540 1110)", `translate(${200 + pos * 40} 1110)`);
      o += `<g transform="translate(${880 + pos * 60} 1080) scale(1.4)">${ICON.phone(REDC)}</g>`;
    }
  } else if (t < S(9) - 0.3) {
    o += room(t, josephFront(t, { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 9], smile: 9, lid: blink(t, 0.06) } }), 1, 0.6);
    o += banner(t, S(8) - 0.3, "DIA 8", GOLD) + banner(t, S(8) + 1.4, "DIA 9", GOLD, 640);
    o += txt("tudo funcionando ✓", 540, 1000, 56, PEACE, seg(t, S(8) + 2.4, S(8) + 2.8));
  } else if (t < S(11) - 0.1) {
    // day 10, 06:30: the phone rings in the living room
    const zoom = seg(t, S(10), S(10) + 1.4);
    const sh = Math.sin(t * 60) * 8;
    o += `<rect x="0" y="560" width="${SW}" height="900" fill="#141826"/>` + txt("SALA · 06:30", 540, 640, 60, "#cfd8e3");
    o += `<rect x="190" y="1160" width="700" height="34" rx="6" fill="#6b4a33" stroke="#000" stroke-width="7"/><rect x="230" y="1194" width="26" height="200" fill="#5a3d2a"/><rect x="824" y="1194" width="26" height="200" fill="#5a3d2a"/>`;
    for (let i = 0; i < 3; i++) { const k = ((t - S(9)) * 1.2 + i / 3) % 1; o += `<circle cx="540" cy="1000" r="${100 + k * 340}" fill="none" stroke="${REDC}" stroke-width="6" opacity="${0.6 * (1 - k)}"/>`; }
    const s = lerp(1, 2.0, sm(zoom));
    o += `<g transform="translate(${540 + sh} ${lerp(1060, 980, zoom)}) scale(${s})"><rect x="-80" y="-140" width="160" height="280" rx="24" fill="#14161a" stroke="#000" stroke-width="7"/><rect x="-66" y="-120" width="132" height="240" rx="14" fill="#0f2a36"/><circle cx="0" cy="-50" r="32" fill="#2a3140"/><text class="hand" x="0" y="-40" font-size="40" text-anchor="middle" fill="#cfd8e3">?</text><text class="sans" x="0" y="20" font-size="18" font-weight="800" text-anchor="middle" fill="#fff">CHAMADA</text><rect x="-50" y="34" width="100" height="16" rx="8" fill="#cfd8e3" opacity="0.6"/><circle cx="-34" cy="88" r="18" fill="${REDC}"/><circle cx="34" cy="88" r="18" fill="${PEACE}"/></g>`;
    o += banner(t, S(9) - 0.3, "DIA 10", REDC, 820);
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += txt("QUEM LIGOU?", 540, 800, 110, CREAM, 1, pop(t, S(11) - 0.1));
    o += `<g transform="translate(540 1000) scale(${pop(t, S(11) + 0.6)})"><rect x="-300" y="-60" width="600" height="120" rx="60" fill="#12151c" stroke="${GOLD}" stroke-width="6"/>${txt("EP 3 EM BREVE", 0, 0, 62, GOLD)}</g>`;
  }
  o += hud(t);
  o += vignette();
  o += topTag("DESAFIO 30 DIAS · EP 2", GOLD);
  o += capShort(t);
  o += endCard(t, E(11) + 0.2, "Segue pra ver o EP 3");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
