// SHORT 17 — série O DESAFIO DE 30 DIAS · EP 5 (final, dias 25 a 30) — o celular debaixo do travesseiro, o carregador na sala, o dia 30
const REDC = "#e5484d", PEACE = "#30a46c", FOC = "#4fd1ff";
function dayOf(t) { if (t < S(6) - 0.3) return 25; if (t < S(6) + 1.4) return 28; if (t < S(7) - 0.2) return 29; return 30; }
function stats(t) {
  return {
    ans: kf(t, [[0, 0.55], [S(3), 0.65], [S(5) + 2, 0.3], [S(8), 0.08]]),
    foc: kf(t, [[0, 0.6], [S(5) + 2, 0.8], [S(8), 0.97]]),
    paz: kf(t, [[0, 0.55], [S(5) + 2, 0.8], [S(8), 0.97]]),
  };
}
function hud(t) {
  const d = dayOf(t), st = stats(t), flash = [S(9) - 0.3, S(9) + 1.3, S(9) + 2.7, S(10) - 0.3].some(a => inR(t, a, a + 0.5));
  let o = `<g transform="translate(60 300)"><rect width="960" height="190" rx="30" fill="#07080b" opacity="0.88" stroke="${flash ? GOLD : "#2a3140"}" stroke-width="5"/>`;
  o += `<text class="hand" x="40" y="80" font-size="44" fill="#8f99a3">DIA</text><text class="hand" x="40" y="160" font-size="96" fill="${d === 30 ? GOLD : CREAM}">${d}<tspan font-size="44" fill="#8f99a3">/30</tspan></text>`;
  [["ANSIEDADE", st.ans, REDC], ["FOCO", st.foc, FOC], ["PAZ", st.paz, PEACE]].forEach(([lab, v, c], i) => {
    const y = 40 + i * 50;
    o += `<text class="hand" x="290" y="${y + 22}" font-size="32" fill="${c}">${lab}</text><rect x="480" y="${y}" width="440" height="30" rx="15" fill="#1a1f29"/><rect x="480" y="${y}" width="${440 * cl(v)}" height="30" rx="15" fill="${c}"/>`;
  });
  o += `</g>`;
  for (let i = 0; i < 30; i++) {
    const done = i < d - 1 || (i === d - 1 && (d !== 25 || t > S(5) + 3));
    const fill = i === 6 || i === 14 || (i === 29 && done) ? "#ffd27a" : done ? GOLD : i === 24 ? REDC : "#1a1f29";
    o += `<rect x="${60 + i * 32}" y="510" width="26" height="26" rx="6" fill="${fill}" stroke="#000" stroke-width="2"/>`;
  }
  return o;
}
function room(t, inner, day = 0.8, warm = 0.2, sy = 1240, s = 1.2) { return cam(960, 560, s, roomBg(day, warm) + inner, sy); }
function banner(t, a, s, col, y = 760) { const p = pop(t, a); return p > 0 && t < a + 1.6 ? `<g transform="translate(540 ${y}) scale(${p})" opacity="${1 - seg(t, a + 1.3, a + 1.6)}"><rect x="-${s.length * 32 + 60}" y="-80" width="${s.length * 64 + 120}" height="160" rx="30" fill="#07080b" stroke="${col}" stroke-width="8"/>${txt(s, 0, 0, 96, col)}</g>` : ""; }
function pill(t, a, s, col, y, size = 64, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#07080b" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }

// the big phone (screen space): mode = "call" | "home" | "off"
function bigPhone(x, y, s, t, mode, o = {}) {
  let g = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-80" y="-140" width="160" height="280" rx="24" fill="#14161a" stroke="#000" stroke-width="7"/><rect x="-66" y="-120" width="132" height="240" rx="14" fill="${mode === "off" ? "#07080b" : "#0f2a36"}"/>`;
  if (mode === "call") {
    const who = o.who;
    g += `<circle cx="0" cy="-50" r="32" fill="${who ? "#ff8fb1" : "#2a3140"}"/>`;
    g += who ? `<text class="hand" x="0" y="-38" font-size="34" text-anchor="middle" fill="#fff">♥</text><text class="sans" x="0" y="22" font-size="26" font-weight="800" text-anchor="middle" fill="#fff">MÃE</text>` : `<text class="hand" x="0" y="-40" font-size="40" text-anchor="middle" fill="#cfd8e3">?</text><text class="sans" x="0" y="20" font-size="18" font-weight="800" text-anchor="middle" fill="#fff">CHAMADA</text>`;
    g += `<circle cx="-34" cy="88" r="18" fill="${REDC}"/><circle cx="34" cy="88" r="${18 * (o.pulse || 1)}" fill="${PEACE}"/>`;
  } else if (mode === "home") {
    const cols = ["#3e63dd", "#ffc53d", "#30a46c", "#8b6ad8", "#4fd1ff", "#ff6fae", "#ff9f1c", "#5a606b", "#e5484d"];
    for (let i = 0; i < 9; i++) {
      const cx = -38 + (i % 3) * 38, cy = -80 + Math.floor(i / 3) * 44, hot = i === 8;
      g += `<rect x="${cx - 14}" y="${cy - 14}" width="28" height="28" rx="8" fill="${cols[i]}" ${hot ? `stroke="#fff" stroke-width="${2 + 2 * Math.abs(Math.sin(t * 8))}"` : ""}/>`;
      if (hot) g += `<path d="M ${cx - 5} ${cy - 7} L ${cx + 7} ${cy} L ${cx - 5} ${cy + 7} Z" fill="#fff"/>`;
      const badge = o.badges && i % 2 === 0 ? 1 : 0;
      if (badge) g += `<circle cx="${cx + 13}" cy="${cy - 13}" r="8" fill="${REDC}" stroke="#000" stroke-width="2"/>`;
    }
    if (o.count) g += `<rect x="-60" y="62" width="120" height="40" rx="20" fill="${REDC}"/><text class="sans" x="0" y="90" font-size="24" font-weight="800" text-anchor="middle" fill="#fff">${o.count} novas</text>`;
  }
  return g + `</g>`;
}
function finger(x, y) { return `<g transform="translate(${x} ${y})"><path d="M -30 300 L -30 40 Q -30 0 0 0 Q 30 0 30 40 L 30 300 Z" fill="${JOSEPH.skin}" stroke="#000" stroke-width="7"/><path d="M -16 14 Q 0 6 16 14" fill="none" stroke="${JOSEPH.skinD}" stroke-width="5"/></g>`; }


function people(t, jf, lf, lx = 1250, phone = true, jx = 700) {
  const PJ = Object.assign({ x: jx, c: JOSEPH }, face(Object.assign({ lid: blink(t, 0.06) }, jf)));
  const PL = Object.assign({ x: lx, c: FRIEND }, face(Object.assign({ lid: blink(t, 0.06, 1.3) }, lf)));
  let w = personBack(PJ) + personHead(PJ, t) + personBack(PL) + personHead(PL, t);
  if (phone) w += armF([lx + 100, 565], [lx + 160, 470], FRIEND.hood) + `<rect x="${lx + 136}" y="400" width="44" height="80" rx="8" fill="#14161a" stroke="${INK}" stroke-width="5"/><rect x="${lx + 142}" y="408" width="32" height="64" rx="4" fill="#ffc53d"/>` + handC([lx + 160, 470], FRIEND.skin);
  return w;
}
function speech(x, y, s, lines, col = INK) {
  const w = Math.max(...lines.map(l => l.length)) * 30 + 90, h = lines.length * 70 + 50;
  let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="40" fill="#fff" stroke="#000" stroke-width="7"/>`;
  lines.forEach((l, i) => { o += `<text class="hand" x="0" y="${-h / 2 + 76 + i * 70}" font-size="58" text-anchor="middle" fill="${col}">${l}</text>`; });
  return o + `</g>`;
}

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(2) - 0.2) {
    o += room(t, josephFront(t, { face: { look: [Math.sin(t * 2.4) * 14, 2], browUp: 8, mouthOpen: 0.15, lid: blink(t, 0.05) } }), 0.7, 0.5);
    o += banner(t, 0, "DIA 25", REDC, 760);
    if (t > S(1) + 2.6) for (let i = 0; i < 3; i++) o += txt("?", 300 + i * 240, 720 + (i % 2) * 60, 110, REDC, 1, pop(t, S(1) + 2.6 + i * 0.3));
  } else if (t < S(3) - 0.2) {
    const lift = seg(t, S(2) + 1.0, S(2) + 1.8);
    o += `<rect x="0" y="560" width="${SW}" height="900" fill="#1a2030"/>`;
    o += `<rect x="120" y="980" width="840" height="300" rx="30" fill="#3d5a80" stroke="#000" stroke-width="8"/>`;
    o += `<g transform="translate(540 ${lerp(960, 760, lift)}) rotate(${-14 * lift})"><rect x="-260" y="-80" width="520" height="160" rx="60" fill="#f2f2f2" stroke="#000" stroke-width="8"/></g>`;
    o += `<g transform="translate(540 1000) rotate(90)"><rect x="-40" y="-75" width="80" height="150" rx="14" fill="#14161a" stroke="#000" stroke-width="6"/><rect x="-32" y="-64" width="64" height="128" rx="8" fill="#0f2a36"/></g><ellipse cx="540" cy="1000" rx="200" ry="90" fill="url(#gPhone)" opacity="${0.8 * lift}"/>`;
    o += pill(t, S(2) + 1.6, "DEBAIXO DO TRAVESSEIRO", REDC, 640, 58);
  } else if (t < S(4) - 0.2) {
    o += room(t, josephFront(t, { blanket: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true, mode: "time" }, face: { look: [0, 12], lid: 0.65, bags: 1 } }), 0.02, 0) + `<rect width="${SW}" height="${SH}" fill="#0a1030" opacity="0.35"/>`;
    o += pill(t, S(3) + 0.3, "02:00 · NO AUTOMÁTICO", "#8b6ad8", 760, 56);
  } else if (t < S(5) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += txt("O HÁBITO ANTIGO", 540, 760, 92, CREAM, 1, pop(t, S(4)));
    o += txt("VOLTA", 540, 890, 130, REDC, 1, pop(t, S(4) + 0.6));
    o += txt("no automático", 540, 1030, 70, "#8b6ad8", seg(t, S(4) + 1.6, S(4) + 2.0));
  } else if (t < S(6) - 0.3) {
    o += `<rect x="0" y="560" width="${SW}" height="900" fill="#1a2030"/>` + txt("SALA", 540, 640, 60, "#cfd8e3");
    o += `<rect x="190" y="1160" width="700" height="34" rx="6" fill="#6b4a33" stroke="#000" stroke-width="7"/><rect x="230" y="1194" width="26" height="200" fill="#5a3d2a"/><rect x="824" y="1194" width="26" height="200" fill="#5a3d2a"/>`;
    o += `<path d="M 600 1150 Q 660 1180 700 1250 Q 740 1330 900 1400" fill="none" stroke="#e8e2d6" stroke-width="10" stroke-linecap="round"/><rect x="880" y="1380" width="60" height="44" rx="8" fill="#e8e2d6" stroke="#000" stroke-width="5"/>`;
    o += `<g transform="translate(540 1130) rotate(90)"><rect x="-40" y="-75" width="80" height="150" rx="14" fill="#14161a" stroke="#000" stroke-width="6"/><rect x="-14" y="-52" width="28" height="44" rx="4" fill="${PEACE}" opacity="${0.6 + 0.4 * Math.sin(t * 3)}"/></g>`;
    o += pill(t, S(5) + 1.0, "O CARREGADOR MORA NA SALA", PEACE, 820, 52);
    o += pill(t, S(5) + 4.4, "dormiu lá = não vai pro quarto", "#cfd8e3", 1680, 44);
  } else if (t < S(7) - 0.2) {
    o += room(t, josephFront(t, { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 9], smile: 8, lid: blink(t, 0.06) } }), 1, 0.6);
    o += banner(t, S(6) - 0.3, "DIA 28", GOLD) + banner(t, S(6) + 1.4, "DIA 29", GOLD, 640);
  } else if (t < S(8) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>` + `<circle cx="540" cy="900" r="${380 * seg(t, S(7) - 0.2, S(7) + 0.6)}" fill="${GOLD}" opacity="0.18"/>`;
    o += txt("DIA 30", 540, 900, 210, GOLD, 1, pop(t, S(7) - 0.1, 0.5));
  } else if (t < S(9) - 0.2) {
    o += room(t, josephFront(t, { armsUp: seg(t, S(8), S(8) + 0.6), face: { happy: 1, smile: 14 } }), 1, 0.8);
    o += pill(t, S(8) + 0.2, "30/30 ✓", GOLD, 760, 90);
  } else if (t < S(10) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += txt("ELE CONSEGUIU.", 540, 740, 110, GREEN, 1, pop(t, S(9)));
    o += txt("mas o desafio de verdade é", 540, 900, 60, "#cfd8e3", seg(t, S(9) + 1.8, S(9) + 2.2));
    o += txt("O DIA 31.", 540, 1040, 140, GOLD, 1, pop(t, S(9) + 2.8));
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#07080b"/>`;
    o += txt("QUAL O PRÓXIMO", 540, 640, 96, CREAM, 1, pop(t, S(10))) + txt("DESAFIO?", 540, 770, 130, GOLD, 1, pop(t, S(10) + 0.3));
    [["30 DIAS SEM AÇÚCAR", "#ff6fae"], ["ACORDAR ÀS 5H", ACC], ["TREINAR TODO DIA", GREEN]].forEach(([s, c], i) => { o += pill(t, S(10) + 1.0 + i * 0.4, s, c, 960 + i * 150, 54); });
    o += txt("COMENTA AQUI EMBAIXO", 540, 1700, 64, CREAM, seg(t, S(10) + 2.6, S(10) + 3.0));
  }
  if (t < S(7) - 0.2 || t > S(8) - 0.2 && t < S(9) - 0.2) o += hud(t);
  o += vignette();
  o += topTag("DESAFIO 30 DIAS · EP 5 (FINAL)", GOLD);
  o += capShort(t);
  o += endCard(t, E(10) + 0.2, "Segue: a próxima série vem aí");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
