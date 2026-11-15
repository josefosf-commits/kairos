// REEL (Instagram) — 4 CADEADOS — versão LOOP: o último quadro é igual ao primeiro,
// sem cartão final e sem fade; a última fala ("lembra:") emenda na primeira.
const REDC = "#e5484d";
const T5 = { energia: "#c6f135", foco: "#4fd1ff", tempo: "#ffc53d", autoestima: "#ff6fae", sono: "#8b6ad8" };
const KEYS = ["energia", "foco", "tempo", "autoestima", "sono"];
const DOOR = [540, 960], DS = 1.25;
const BASE = { energia: [150, 1120, 0.8, 1], foco: [300, 1160, 0.8, 1], tempo: [800, 1160, 0.8, -1], autoestima: [950, 1120, 0.8, -1], sono: [640, 1040, 0.75, -1] };
const WAIT = { energia: [130, 1190, 0.62, 1], foco: [270, 1210, 0.62, 1], tempo: [860, 1210, 0.62, -1], autoestima: [990, 1190, 0.62, -1], sono: [730, 1230, 0.62, -1] };
const KNOCK = [800, 1080, 0.85, -1];

function doorV(open, locks, glow, t, shake) {
  const [x, y] = DOOR;
  let o = `<g transform="translate(${x + shake} ${y}) scale(${DS})">`;
  o += `<rect x="-150" y="-280" width="300" height="560" fill="#3a2a20" stroke="#000" stroke-width="8"/>`;      // frame
  o += `<rect x="-130" y="-260" width="260" height="520" fill="#05060a"/>`;                                       // dark interior
  const w = 260 * (1 - open);
  o += `<rect x="-130" y="-260" width="${w}" height="520" fill="#6b4a33" stroke="#000" stroke-width="6"/>`;
  if (w > 120) o += `<rect x="-110" y="-235" width="${w - 40}" height="200" rx="8" fill="none" stroke="#5a3d2a" stroke-width="6"/><rect x="-110" y="25" width="${w - 40}" height="210" rx="8" fill="none" stroke="#5a3d2a" stroke-width="6"/>`;
  if (w > 60) o += `<circle cx="${-130 + w - 28}" cy="10" r="12" fill="${GOLD}" stroke="#000" stroke-width="4"/>`;
  [-170, -60, 50, 160].forEach((ly, i) => {
    const k = locks[i]; if (k <= 0) return;
    const lx = -130 + w / 2, drop = (1 - easeBack(cl(k))) * -120;
    if (glow > 0) o += `<circle cx="${lx}" cy="${ly + drop}" r="60" fill="${GOLD}" opacity="${0.25 * glow}" style="mix-blend-mode:screen"/>`;
    o += `<g transform="translate(${lx} ${ly + drop}) scale(0.62)" opacity="${cl(k * 2)}"><path d="M -34 -20 v -30 a 34 34 0 0 1 68 0 v 30" fill="none" stroke="${GOLD}" stroke-width="14"/><rect x="-52" y="-24" width="104" height="86" rx="14" fill="${GOLD}" stroke="#000" stroke-width="6"/><text class="hand" x="0" y="40" font-size="50" text-anchor="middle" fill="#3a2a00">${i + 1}</text></g>`;
  });
  return o + `</g>`;
}
function bg() {
  let o = `<rect width="${SW}" height="${SH}" fill="#0b0d16"/>`;
  o += `<rect x="0" y="1290" width="${SW}" height="630" fill="#07080b"/><line x1="0" y1="1290" x2="${SW}" y2="1290" stroke="#000" stroke-width="6"/>`;
  o += `<ellipse cx="540" cy="780" rx="420" ry="520" fill="#ffd38a" opacity="0.05"/>`;
  for (let i = 0; i < 18; i++) o += `<rect x="${(i % 6) * 190 + 20}" y="${1310 + Math.floor(i / 6) * 70}" width="150" height="10" rx="4" fill="#12151c"/>`;
  return o;
}
function card(t, a, title, sub, icon, col) {
  const p = pop(t, a), out = 1;
  if (p <= 0) return "";
  return `<g transform="translate(540 470) scale(${p})"><rect x="-470" y="-120" width="940" height="240" rx="40" fill="#12151c" stroke="${col}" stroke-width="7"/><g transform="translate(-360 0) scale(0.9)">${icon}</g>${txt(title, 90, -40, title.length > 16 ? 50 : 60, CREAM)}${txt(sub, 90, 50, 44, col)}</g>`;
}
const ICONS = {
  sala: `<rect x="-38" y="-66" width="76" height="132" rx="14" fill="#14161a" stroke="${ACC}" stroke-width="7"/><path d="M 0 66 Q 0 100 40 100 L 70 100" stroke="#e8e2d6" stroke-width="7" fill="none"/><path d="M 8 -30 L -10 4 L 2 4 L -6 34 L 16 -4 L 4 -4 Z" fill="${GOLD}"/>`,
  dnd: `<path d="M 20 -60 A 62 62 0 1 0 60 30 A 48 48 0 1 1 20 -60 Z" fill="#7c8cff" stroke="#000" stroke-width="6"/><line x1="-70" y1="-70" x2="70" y2="70" stroke="${REDC}" stroke-width="12" stroke-linecap="round"/>`,
  limite: `<rect x="-60" y="-60" width="120" height="120" rx="30" fill="#e93d82" stroke="#000" stroke-width="6"/><path d="M -20 -26 L 28 0 L -20 26 Z" fill="#fff"/><g transform="translate(50 -50)"><circle r="32" fill="#12151c" stroke="${GOLD}" stroke-width="6"/><text class="hand" x="0" y="12" font-size="32" text-anchor="middle" fill="${GOLD}">30</text></g>`,
  seguir: `<rect x="-80" y="-34" width="160" height="68" rx="16" fill="#3e63dd"/><text class="sans" x="0" y="12" font-size="30" font-weight="800" text-anchor="middle" fill="#fff">Seguir</text><path d="M 30 20 L 30 70 L 44 58 L 54 82 L 64 78 L 54 54 L 72 54 Z" fill="#fff" stroke="#000" stroke-width="4"/>`,
};
function phoneBuzz(op, t) {
  if (op <= 0) return "";
  const s = Math.sin(t * 60) * 4;
  return `<g opacity="${op}" transform="translate(${200 + s} 1400)"><ellipse rx="110" ry="60" fill="${ACC}" opacity="0.35" style="mix-blend-mode:screen"/><rect x="-34" y="-60" width="68" height="120" rx="12" fill="#14161a" stroke="#000" stroke-width="6"/><rect x="-26" y="-50" width="52" height="96" rx="6" fill="#0f2a36"/><circle cx="12" cy="-34" r="10" fill="${REDC}"/><g transform="translate(120 -70)"><rect x="-70" y="-30" width="140" height="60" rx="30" fill="#fff" stroke="#000" stroke-width="4"/><text class="hand" x="0" y="12" font-size="34" text-anchor="middle" fill="#1c1c22">plim!</text></g></g>`;
}

// state of each thief at time t: [x, y, s, dir, alpha, shrug, knock]
function thiefState(k, t) {
  const b = BASE[k], w = WAIT[k];
  const close = seg(t, S(2) - 0.4, S(2) + 0.6);                 // door closes: everyone steps back
  const back = seg(t, S(12) + 1.6, S(12) + 2.9);                // end: everyone returns to the base pose
  let p = [lerp(b[0], w[0], close), lerp(b[1], w[1], close), lerp(b[2], w[2], close), b[3], 1, 0, 0];
  const turn = { sono: [S(3), 0], energia: [S(3) + 1.8, 0], foco: [S(5), 0], tempo: [S(7), 0], autoestima: [S(9) + 2.0, 0] }[k][0];
  if (t > turn) {
    const u = t - turn;
    if (u < 0.8) { const q = sm(u / 0.8); p = [lerp(w[0], KNOCK[0], q), lerp(w[1], KNOCK[1], q), lerp(w[2], KNOCK[2], q), KNOCK[3], 1, 0, 0]; }
    else if (u < 2.0) { p = [KNOCK[0] + Math.sin(u * 30) * 6 * (u < 1.4 ? 1 : 0), KNOCK[1], KNOCK[2], KNOCK[3], 1, u > 1.4 ? 0.8 : 0, u < 1.4 ? 1 : 0]; }
    else { const q = sm((u - 2.0) / 1.1); p = [lerp(KNOCK[0], 1250, q), KNOCK[1] + 20 * q, KNOCK[2], 1, 1 - q, 0.8, 0]; }
  }
  if (back > 0) {   // fly back in from the right to the base pose
    const from = t > turn + 3.1 ? [1250, 1120, 0.8, 1, 0] : [p[0], p[1], p[2], p[3], p[4]];
    p = [lerp(from[0], b[0], back), lerp(from[1], b[1], back), lerp(from[2], b[2], back), back > 0.5 ? b[3] : from[3], lerp(from[4], 1, back), 0, 0];
  }
  return p;
}

function render(t) {
  const end = window.TL.duration;
  // door: ajar at start/end, closed in the middle
  const closeK = seg(t, S(2) - 0.4, S(2) + 0.4), reopen = seg(t, S(12) + 1.3, S(12) + 2.5);
  const open = lerp(0.55, 0, closeK) + 0.55 * reopen;
  const lockA = [S(2) + 1.4, S(4) + 1.6, S(6) + 1.6, S(8) + 1.8];
  const unlock = i => seg(t, S(12) + 0.2 + i * 0.25, S(12) + 0.5 + i * 0.25);
  const locks = lockA.map((a, i) => seg(t, a, a + 0.45) * (1 - unlock(i)));
  const glow = dip(t, S(10), S(10) + 0.5, S(12) - 0.4, S(12));
  const knocking = KEYS.some(k => thiefState(k, t)[6] > 0);
  let o = bg();
  // thieves behind the door frame (the one in the gap) first
  const order = ["sono", "energia", "foco", "tempo", "autoestima"];
  const drawT = k => { const [x, y, s, dir, a, shrug] = thiefState(k, t); return a > 0.01 ? thief(x, y, s, dir, a, t + KEYS.indexOf(k), { mask: T5[k], loot: T5[k], shrug, look: dir < 0 ? -6 : 6 }) : ""; };
  o += drawT("sono");
  o += doorV(open, locks, glow, t, knocking ? Math.sin(t * 50) * 3 : 0);
  order.slice(1).forEach(k => { o += drawT(k); });
  if (knocking) o += txt("TOC TOC", 840, 840, 56, CREAM, 0.9);
  // falling key for the self-esteem thief
  const kk = seg(t, S(9) + 2.6, S(9) + 3.4);
  if (kk > 0 && kk < 1) o += `<g transform="translate(${800 + 40 * kk} ${1040 + 220 * kk * kk}) rotate(${kk * 220})"><circle r="16" fill="none" stroke="${GOLD}" stroke-width="7"/><path d="M 16 0 L 56 0 M 44 0 L 44 14 M 54 0 L 54 12" stroke="${GOLD}" stroke-width="7"/></g>`;
  // top: title at start/end, cards in the middle
  const titleOp = Math.max(1 - seg(t, S(2) - 0.6, S(2) - 0.2), seg(t, S(12) + 2.2, S(12) + 2.9));
  if (titleOp > 0) o += txt("4 CADEADOS", 540, 400, 140, GOLD, titleOp) + txt("pra trancar a porta do celular", 540, 520, 54, "#cfd8e3", titleOp);
  const cards = [[2, "CELULAR FORA DO QUARTO", "ladrões: Sono + Energia", ICONS.sala, T5.sono], [4, "NÃO PERTURBE NO ESTUDO", "ladrão: Foco", ICONS.dnd, T5.foco], [6, "LIMITE NOS APPS", "ladrão: Tempo", ICONS.limite, T5.tempo], [8, "DEIXAR DE SEGUIR", "ladrão: Autoestima", ICONS.seguir, T5.autoestima]];
  cards.forEach(([id, ti, sub, ic, col], i) => {
    const next = i < 3 ? S(cards[i + 1][0]) - 0.2 : S(10) - 0.2;
    if (t > S(id) - 0.2 && t < next) o += `<g opacity="${1 - seg(t, next - 0.3, next)}">${card(t, S(id) - 0.1, ti, sub, ic, col)}</g>` + txt(`CADEADO ${i + 1}`, 540, 318, 56, GOLD, seg(t, S(id) - 0.1, S(id) + 0.2));
  });
  if (t > S(10) - 0.2 && t < S(12)) {
    const op = 1 - seg(t, S(12) - 0.4, S(12));
    if (t < S(11) - 0.1) {
      o += txt("ESCOLHE UM. FECHA.", 540, 400, 90, CREAM, op, pop(t, S(10) + 1.6));
      ["HOJE", "AMANHÃ", "DIA 3", "DIA 4"].forEach((s, i) => { const p = pop(t, S(10) + 2.4 + i * 0.4); if (p > 0) o += `<g transform="translate(${180 + i * 240} 540) scale(${p})" opacity="${op}"><rect x="-100" y="-38" width="200" height="76" rx="38" fill="#12151c" stroke="${GOLD}" stroke-width="4"/>${txt(s, 0, 0, 38, GOLD)}</g>`; });
    } else {
      // mid-video follow CTA (no end card: it would break the loop)
      o += `<g transform="translate(540 440) scale(${pop(t, S(11))})" opacity="${op}"><rect x="-380" y="-80" width="760" height="160" rx="80" fill="#12151c" stroke="${GREEN}" stroke-width="7"/>${txt("SEGUE O JOSEPH", -40, -18, 62, CREAM)}${txt("1 porta por dia", -40, 44, 40, GREEN)}<g transform="translate(270 0)"><rect x="-70" y="-38" width="140" height="76" rx="20" fill="#3e63dd"/><text class="sans" x="0" y="12" font-size="30" font-weight="800" text-anchor="middle" fill="#fff">Seguir</text></g></g>`;
    }
  }
  // phone calling: at the very end and (fading out) at the very start => seamless loop
  o += phoneBuzz(Math.max(seg(t, S(12) - 0.9, S(12) - 0.5), 1 - seg(t, 0.8, 1.4)), t);
  o += vignette();
  o += topTag("OS LADRÕES DO JOSEPH", THIEF_PURPLE);
  o += capShort(t);
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
