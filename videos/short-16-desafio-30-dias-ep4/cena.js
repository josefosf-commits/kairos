// SHORT 16 — série O DESAFIO DE 30 DIAS · EP 4 (dias 17 a 25) — o convite do Lucas, "só hoje", o Lucas entra no desafio, o celular some
const REDC = "#e5484d", PEACE = "#30a46c", FOC = "#4fd1ff";
function dayOf(t) { if (t < S(6) - 0.3) return 17; if (t < S(8) - 0.3) return 18; if (t < S(8) + 1.6) return 20; if (t < S(9) - 0.3) return 22; return 25; }
function stats(t) {
  const tempt = seg(t, S(1) + 2, S(2)) * (1 - seg(t, S(4) + 2, S(4) + 4));
  return {
    ans: kf(t, [[0, 0.15], [S(9), 0.15], [S(9) + 3, 0.55]]) + 0.4 * tempt,
    foc: kf(t, [[0, 0.82], [S(8), 0.9]]) - 0.3 * tempt,
    paz: kf(t, [[0, 0.85], [S(8), 0.95], [S(9) + 2, 0.6]]) - 0.3 * tempt,
  };
}
function hud(t) {
  const d = dayOf(t), st = stats(t), flash = [S(9) - 0.3, S(9) + 1.3, S(9) + 2.7, S(10) - 0.3].some(a => inR(t, a, a + 0.5));
  let o = `<g transform="translate(60 300)"><rect width="960" height="190" rx="30" fill="#07080b" opacity="0.88" stroke="${flash ? GOLD : "#2a3140"}" stroke-width="5"/>`;
  o += `<text class="hand" x="40" y="80" font-size="44" fill="#8f99a3">DIA</text><text class="hand" x="40" y="160" font-size="96" fill="${d === 25 ? REDC : CREAM}">${d}<tspan font-size="44" fill="#8f99a3">/30</tspan></text>`;
  [["ANSIEDADE", st.ans, REDC], ["FOCO", st.foc, FOC], ["PAZ", st.paz, PEACE]].forEach(([lab, v, c], i) => {
    const y = 40 + i * 50;
    o += `<text class="hand" x="290" y="${y + 22}" font-size="32" fill="${c}">${lab}</text><rect x="480" y="${y}" width="440" height="30" rx="15" fill="#1a1f29"/><rect x="480" y="${y}" width="${440 * cl(v)}" height="30" rx="15" fill="${c}"/>`;
  });
  o += `</g>`;
  for (let i = 0; i < 30; i++) {
    const done = i < d - 1 || (i === d - 1 && d !== 25 && !(d === 17 && t < S(4) + 3));
    const fill = i === 6 || i === 14 ? "#ffd27a" : done ? GOLD : i === 24 && d === 25 ? REDC : "#1a1f29";
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
    let w = roomBg(0.8, 0.3) + `<rect x="1080" y="300" width="300" height="560" fill="#2c241f" stroke="${INK}" stroke-width="8"/>` + people(t, { look: [10, 2], browUp: t > S(1) + 4 ? 6 : 0, smile: 4 }, { look: [-10, 2], smile: 14, browUp: 6 });
    o += cam(960, 560, 0.95, w, 1180);
    o += banner(t, 0, "DIA 17", GOLD, 760);
    if (t > S(1) + 2.0) o += `<g transform="translate(540 800) scale(${pop(t, S(1) + 2.0)})"><rect x="-330" y="-110" width="660" height="220" rx="30" fill="#14161a" stroke="${GOLD}" stroke-width="8"/>${txt("FINAL DO", 0, -40, 64, CREAM)}${txt("CAMPEONATO · 06:00", 0, 50, 56, GOLD)}</g>`;
    if (t > S(1) + 5.2) o += `<g transform="translate(0 0)">${speech(560, 1700, pop(t, S(1) + 5.2), ['"assiste comigo.', 'só hoje."'], REDC)}</g>`;
  } else if (t < S(4) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += txt("SÓ HOJE.", 540, 760, 170, REDC, 1, pop(t, S(2)));
    o += txt("a frase mais perigosa", 540, 900, 60, "#cfd8e3", seg(t, S(2) + 1.2, S(2) + 1.6));
    if (t > S(3) - 0.2) {
      const items = [["1 EXCEÇÃO", "#cfd8e3", S(3)], ["2 EXCEÇÕES", GOLD, S(3) + 1.6], ["HÁBITO ANTIGO", REDC, S(3) + 2.9]];
      items.forEach(([s, c, a], i) => { o += pill(t, a, s, c, 1080 + i * 150, 58); if (i < 2 && t > a + 0.4) o += txt("↓", 540, 1155 + i * 150, 50, "#5a606b"); });
    }
  } else if (t < S(6) - 0.3) {
    const laugh = t > S(5) - 0.1;
    let w = roomBg(0.8, 0.3) + people(t, { look: [10, 2], smile: laugh ? 6 : 2, browAng: laugh ? 0 : 0.6 }, { look: [-10, 2], smile: laugh ? 0 : 6, happy: laugh ? 1 : 0, mouthOpen: laugh ? 0.5 + 0.3 * Math.abs(Math.sin(t * 14)) : 0 }, 1250, false);
    o += cam(960, 560, 0.95, w, 1180);
    if (t < S(5) - 0.1) {
      if (t > S(4) + 1.2) o += speech(540, 740, pop(t, S(4) + 1.2), ['"eu não quebro a regra."']);
      if (t > S(4) + 3.4) o += speech(540, 1720, pop(t, S(4) + 3.4), ['"mas te chamo', 'pra fazer comigo."'], PEACE);
    } else {
      o += txt("HAHAHA", 760, 760, 110, GOLD, 1, pop(t, S(5)) * (1 + 0.05 * Math.sin(t * 20)));
      o += txt("achou que era piada", 540, 1720, 56, "#cfd8e3", seg(t, S(5) + 1.0, S(5) + 1.4));
    }
  } else if (t < S(8) - 0.3) {
    const open = seg(t, S(6) + 2.8, S(6) + 3.6);
    let w = roomBg(0.35, 0.4) + `<rect x="760" y="250" width="400" height="610" fill="#1a1d24" stroke="${INK}" stroke-width="8"/>`;
    if (open > 0) w += people(t, { look: [0, 0], smile: 0 }, { look: [0, 4], smile: t > S(7) - 0.2 ? 10 : 4, browUp: 4 }, 960, false, -400).replace(/translate\(-1360/g, 'translate(-1360');
    w += `<g transform="translate(760 250) scale(${1 - 0.92 * open} 1)"><rect width="400" height="610" fill="#6b4a33" stroke="${INK}" stroke-width="8"/><circle cx="350" cy="320" r="16" fill="${GOLD}" stroke="${INK}" stroke-width="4"/></g>`;
    o += cam(960, 560, 1.05, w, 1180);
    o += banner(t, S(6) - 0.3, "DIA 18 · 06:30", GOLD, 640);
    if (t > S(6) + 1.6 && open < 0.5) for (let i = 0; i < 2; i++) o += txt("TOC", 760 + i * 140, 900 + i * 60, 80, CREAM, 1, pop(t, S(6) + 1.6 + i * 0.35));
    if (open > 0.6) o += pill(t, S(6) + 4.0, "SEM CELULAR ✓", PEACE, 760, 64);
    if (t > S(7) - 0.2) o += speech(540, 1720, pop(t, S(7) - 0.1), ['"vim ver como é."']);
  } else if (t < S(9) - 0.3) {
    let w = roomBg(0.85, 0.6) + `<rect x="420" y="640" width="1080" height="34" rx="6" fill="#6b4a33" stroke="${INK}" stroke-width="7"/>` + people(t, { look: [10, 6], smile: 10 }, { look: [-10, 6], smile: 10 }, 1220, false, 700) + book([700, 610], 170, 130) + book([1220, 610], 170, 130);
    o += cam(960, 560, 0.95, w, 1180);
    o += banner(t, S(8) - 0.3, "DIA 20", GOLD) + banner(t, S(8) + 1.6, "DIA 22", GOLD, 640);
    o += pill(t, S(8) + 2.6, "AGORA SÃO DOIS", PEACE, 1720, 70);
  } else if (t < S(10) - 0.1) {
    const look = seg(t, S(9) + 2.6, S(9) + 3.4);
    o += `<rect x="0" y="560" width="${SW}" height="900" fill="#141826"/>` + txt("SALA · 06:30", 540, 640, 60, "#cfd8e3");
    o += `<rect x="190" y="1160" width="700" height="34" rx="6" fill="#6b4a33" stroke="#000" stroke-width="7"/><rect x="230" y="1194" width="26" height="200" fill="#5a3d2a"/><rect x="824" y="1194" width="26" height="200" fill="#5a3d2a"/>`;
    o += `<rect x="460" y="1110" width="160" height="40" rx="10" fill="none" stroke="#cfd8e3" stroke-width="5" stroke-dasharray="14 10" opacity="${look}"/>`;
    if (look > 0) o += txt("?", 540, 960, 220, REDC, look, 1 + 0.06 * Math.sin(t * 8));
    o += banner(t, S(9) - 0.3, "DIA 25", REDC, 820);
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += txt("CADÊ O CELULAR?", 540, 800, 100, CREAM, 1, pop(t, S(10) - 0.1));
    o += `<g transform="translate(540 1000) scale(${pop(t, S(10) + 0.6)})"><rect x="-300" y="-60" width="600" height="120" rx="60" fill="#12151c" stroke="${GOLD}" stroke-width="6"/>${txt("EP 5 EM BREVE", 0, 0, 62, GOLD)}</g>`;
  }
  o += hud(t);
  o += vignette();
  o += topTag("DESAFIO 30 DIAS · EP 4", GOLD);
  o += capShort(t);
  o += endCard(t, E(10) + 0.2, "Segue pra ver o EP 5");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
