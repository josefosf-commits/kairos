// SHORT 14 — série O DESAFIO DE 30 DIAS · EP 3 (dias 10 a 17) — a ligação da mãe, a armadilha, o convite do Lucas
const REDC = "#e5484d", PEACE = "#30a46c", FOC = "#4fd1ff";

function dayOf(t) {
  if (t < S(9) - 0.3) return 10; if (t < S(9) + 1.3) return 12; if (t < S(9) + 2.7) return 14; if (t < S(10) - 0.3) return 15; return 17;
}
function stats(t) {
  const tempt = seg(t, S(5), S(6) + 1.5) * (1 - seg(t, S(7), S(7) + 1.2));
  return {
    ans: kf(t, [[0, 0.55], [S(2), 0.3], [S(3), 0.2], [S(9), 0.15]]) + 0.6 * tempt,
    foc: kf(t, [[0, 0.72], [S(8), 0.75], [S(9) + 3, 0.85]]) - 0.4 * tempt,
    paz: kf(t, [[0, 0.5], [S(3), 0.9], [S(4), 0.85], [S(9) + 3, 0.9]]) - 0.5 * tempt - 0.3 * seg(t, S(10) + 1.0, S(10) + 2.5),
  };
}
function hud(t) {
  const d = dayOf(t), st = stats(t), flash = [S(9) - 0.3, S(9) + 1.3, S(9) + 2.7, S(10) - 0.3].some(a => inR(t, a, a + 0.5));
  let o = `<g transform="translate(60 300)"><rect width="960" height="190" rx="30" fill="#07080b" opacity="0.88" stroke="${flash ? GOLD : "#2a3140"}" stroke-width="5"/>`;
  o += `<text class="hand" x="40" y="80" font-size="44" fill="#8f99a3">DIA</text><text class="hand" x="40" y="160" font-size="96" fill="${d === 17 ? REDC : CREAM}">${d}<tspan font-size="44" fill="#8f99a3">/30</tspan></text>`;
  [["ANSIEDADE", st.ans, REDC], ["FOCO", st.foc, FOC], ["PAZ", st.paz, PEACE]].forEach(([lab, v, c], i) => {
    const y = 40 + i * 50;
    o += `<text class="hand" x="290" y="${y + 22}" font-size="32" fill="${c}">${lab}</text><rect x="480" y="${y}" width="440" height="30" rx="15" fill="#1a1f29"/><rect x="480" y="${y}" width="${440 * cl(v)}" height="30" rx="15" fill="${c}"/>`;
  });
  o += `</g>`;
  for (let i = 0; i < 30; i++) {
    const done = i < d - 1 || (i === d - 1 && d === 10 && t > S(7) + 0.5) || (i === d - 1 && d !== 10 && d !== 17);
    const fill = i === 6 ? "#ffd27a" : i === 14 && d >= 15 ? "#ffd27a" : done ? GOLD : i === 16 && d === 17 ? REDC : "#1a1f29";
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

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(2) - 0.2) {
    // continuity: the phone from EP 2 still ringing in the living room
    const who = t > S(1) + 3.0, sh = who ? 0 : Math.sin(t * 60) * 8;
    o += `<rect x="0" y="560" width="${SW}" height="900" fill="#141826"/>` + txt("SALA · 06:30", 540, 640, 60, "#cfd8e3", who ? 0 : 1);
    o += `<rect x="190" y="1160" width="700" height="34" rx="6" fill="#6b4a33" stroke="#000" stroke-width="7"/><rect x="230" y="1194" width="26" height="200" fill="#5a3d2a"/><rect x="824" y="1194" width="26" height="200" fill="#5a3d2a"/>`;
    for (let i = 0; i < 3; i++) { const k = (t * 1.2 + i / 3) % 1; o += `<circle cx="540" cy="1000" r="${100 + k * 340}" fill="none" stroke="${who ? "#ff8fb1" : REDC}" stroke-width="6" opacity="${0.6 * (1 - k)}"/>`; }
    o += bigPhone(540 + sh, 980, 2.0, t, "call", { who, pulse: 1 + 0.15 * Math.sin(t * 10) });
    if (who) o += pill(t, S(1) + 3.1, "ERA A MÃE", "#ff8fb1", 650, 70);
    o += banner(t, 0, "DIA 10", REDC, 820);
  } else if (t < S(4) - 0.2) {
    const talk = t > S(3) - 0.1;
    const ear = [1050, 420];
    o += room(t, josephFront(t, { hR: ear, face: { smile: talk ? 12 : 8, look: [-6, 2], happy: t > S(3) + 2.0 ? 1 : 0, lid: blink(t, 0.06), mouthOpen: !talk && t < E(2) ? 0.15 * Math.abs(Math.sin(t * 9)) : 0 } }) + `<rect x="1036" y="340" width="34" height="110" rx="8" fill="#14161a" stroke="${INK}" stroke-width="5"/>` + handC(ear, JOSEPH.skin), 1, 0.6);
    if (!talk) {
      o += pill(t, S(2) + 0.3, "ATENDEU ✓", PEACE, 760, 70);
      o += txt("fugir da TELA,", 540, 1500, 60, CREAM, seg(t, S(2) + 2.6, S(2) + 3.0)) + txt("não das PESSOAS", 540, 1590, 60, GOLD, seg(t, S(2) + 3.6, S(2) + 4.0));
    } else {
      const p = pop(t, S(3) + 0.3);
      if (p > 0) o += `<g transform="translate(560 790) scale(${p})"><rect x="-420" y="-110" width="840" height="220" rx="40" fill="#fff0f5" stroke="#000" stroke-width="7"/><path d="M 300 110 L 360 170 L 240 110 Z" fill="#fff0f5" stroke="#000" stroke-width="7" stroke-linejoin="round"/><rect x="236" y="100" width="70" height="16" fill="#fff0f5"/><text class="hand" x="0" y="-20" font-size="54" text-anchor="middle" fill="#3a1d28">"Filho, você tá diferente.</text><text class="hand" x="0" y="56" font-size="54" text-anchor="middle" fill="#3a1d28">Tá mais calmo." ♥</text></g>`;
    }
  } else if (t < S(5) - 0.2) {
    // hangs up smiling… then the trap
    const trap = t > S(4) + 1.6;
    o += room(t, josephFront(t, { hR: HOLD.hR, hL: HOLD.hL, phone: { pc: HOLD.pc, held: 1, on: true, mode: "notif" }, face: { smile: trap ? 2 : 12, look: [0, 10], lid: blink(t, 0.06) } }), trap ? 0.4 : 1, 0.4);
    if (trap) o += `<rect width="${SW}" height="${SH}" fill="#3a0a10" opacity="${0.35 * seg(t, S(4) + 1.6, S(4) + 2.2)}"/>` + pill(t, S(4) + 1.7, "A ARMADILHA", REDC, 760, 80);
  } else if (t < S(7) - 0.2) {
    // the phone in hand: notifications, the finger slides to the app
    const reach = seg(t, S(6), E(6) + 0.2);
    o += `<rect width="${SW}" height="${SH}" fill="#0b0d14"/><ellipse cx="540" cy="1050" rx="460" ry="560" fill="url(#gPhone)" opacity="0.35"/>`;
    o += bigPhone(540, 1050, 3.2, t, "home", { badges: true, count: Math.round(lerp(1, 30, seg(t, S(5) + 0.6, S(5) + 2.6))) });
    const fx = lerp(860, 540 + 38 * 3.2, sm(reach)), fy = lerp(1700, 1050 + 8 * 3.2 - 10, sm(reach));
    o += finger(fx, fy);
    if (t < S(6)) o += pill(t, S(5) + 3.2, "SÓ UMA OLHADINHA...", "#ff8fb1", 680, 60);
    else o += pill(t, S(6) + 0.2, "O DEDO FOI SOZINHO", REDC, 680, 60);
  } else if (t < S(8) - 0.2) {
    // stop
    const fy = lerp(1100 + 8, 1500, sm(seg(t, S(7) + 0.1, S(7) + 0.8)));
    o += `<rect width="${SW}" height="${SH}" fill="#0b0d14"/>`;
    o += `<g opacity="${1 - 0.5 * seg(t, S(7), S(7) + 0.6)}">${bigPhone(540, 1100, 2.4, t, "home", { badges: true, count: 30 })}</g>`;
    o += finger(540 + 38 * 2.4, fy);
    o += txt("PAROU.", 540, 660, 120, CREAM, 1, pop(t, S(7)));
    o += pill(t, S(7) + 1.0, "ATENDER: SIM ✓", PEACE, 1640, 62) + pill(t, S(7) + 2.2, "ROLAR: NÃO ✗", REDC, 1790, 62);
  } else if (t < S(9) - 0.3) {
    if (t < S(8) + 1.6) {
      o += `<rect x="0" y="560" width="${SW}" height="900" fill="#1a2030"/>` + txt("SALA", 540, 640, 60, "#cfd8e3");
      o += `<rect x="190" y="1160" width="700" height="34" rx="6" fill="#6b4a33" stroke="#000" stroke-width="7"/><rect x="230" y="1194" width="26" height="200" fill="#5a3d2a"/><rect x="824" y="1194" width="26" height="200" fill="#5a3d2a"/>`;
      const k = seg(t, S(8) - 0.1, S(8) + 0.8);
      o += `<g transform="translate(540 ${lerp(800, 1130, sm(k))}) rotate(${lerp(-20, 90, sm(k))}) scale(0.9)">${bigPhone(0, 0, 1, t, "off")}</g>`;
      o += pill(t, S(8) + 0.9, "DE VOLTA PRA SALA ✓", PEACE, 1460, 60);
    } else {
      o += room(t, josephFront(t, { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [0, 9], smile: 10, lid: blink(t, 0.06) } }), 1, 0.7);
      o += pill(t, S(8) + 1.7, "A MANHÃ É DELE", GOLD, 760, 70);
    }
  } else if (t < S(10) - 0.3) {
    o += room(t, josephFront(t, { blanket: true, armsUp: seg(t, S(9) + 2.8, S(9) + 3.4), face: { happy: 1, smile: 12 } }), 1, 0.8);
    o += banner(t, S(9) - 0.3, "DIA 12", GOLD) + banner(t, S(9) + 1.3, "DIA 14", GOLD, 640);
    if (t > S(9) + 2.7) o += `<g transform="translate(540 760) scale(${pop(t, S(9) + 2.7)})"><rect x="-370" y="-90" width="740" height="180" rx="34" fill="#07080b" stroke="${GOLD}" stroke-width="8"/>${txt("DIA 15: METADE!", 0, 0, 90, GOLD)}</g>`;
  } else if (t < S(11) - 0.1) {
    // Lucas arrives with the invite
    const PJ = Object.assign({ x: 700, c: JOSEPH }, face({ look: [10, 2], browUp: t > S(10) + 3.0 ? 6 : 0, smile: t > S(10) + 3.0 ? -2 : 6, lid: blink(t, 0.06) }));
    const PL = Object.assign({ x: 1230, c: FRIEND }, face({ look: [-10, 2], smile: 14, browUp: 6, lid: blink(t, 0.06, 1.3) }));
    const inL = seg(t, S(10) - 0.3, S(10) + 0.8);
    let w = roomBg(0.8, 0.3) + `<rect x="1080" y="300" width="300" height="560" fill="#2c241f" stroke="${INK}" stroke-width="8"/>`;
    w += personBack(PJ) + personHead(PJ, t);
    w += `<g transform="translate(${lerp(600, 0, sm(inL))} 0)">${personBack(PL) + personHead(PL, t)}${armF([1330, 565], [1390, 470], FRIEND.hood)}<rect x="1366" y="400" width="44" height="80" rx="8" fill="#14161a" stroke="${INK}" stroke-width="5"/><rect x="1372" y="408" width="32" height="64" rx="4" fill="#ff6fae"/>${handC([1390, 470], FRIEND.skin)}</g>`;
    o += cam(960, 560, 0.95, w, 1180);
    o += pill(t, S(10) - 0.1, "DIA 17", REDC, 630, 60);
    const p = pop(t, S(10) + 3.0);
    if (p > 0) o += `<g transform="translate(540 820) scale(${p})"><rect x="-420" y="-100" width="840" height="200" rx="40" fill="#fff" stroke="#000" stroke-width="7"/><path d="M 180 100 L 260 170 L 100 100 Z" fill="#fff" stroke="#000" stroke-width="7" stroke-linejoin="round"/><rect x="96" y="90" width="90" height="16" fill="#fff"/><text class="hand" x="0" y="-10" font-size="60" text-anchor="middle" fill="${REDC}">"Quebra a regra</text><text class="hand" x="0" y="60" font-size="60" text-anchor="middle" fill="${REDC}">só hoje..."</text></g>`;
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += txt("ELE VAI ACEITAR?", 540, 800, 100, CREAM, 1, pop(t, S(11) - 0.1));
    o += `<g transform="translate(540 1000) scale(${pop(t, S(11) + 0.6)})"><rect x="-300" y="-60" width="600" height="120" rx="60" fill="#12151c" stroke="${GOLD}" stroke-width="6"/>${txt("EP 4 EM BREVE", 0, 0, 62, GOLD)}</g>`;
  }
  o += hud(t);
  o += vignette();
  o += topTag("DESAFIO 30 DIAS · EP 3", GOLD);
  o += capShort(t);
  o += endCard(t, E(11) + 0.2, "Segue pra ver o EP 4");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
