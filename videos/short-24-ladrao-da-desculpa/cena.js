// SHORT 24 — OS LADRÕES DO JOSEPH · T2 · EP 4: O LADRÃO DA DESCULPA (usa a sua voz) — base: short-20
const REDC = "#e5484d", VIO = "#9b6bff", BOSS = "#ffc53d";
const handUp = k => [lerp(1040, 1150, k), lerp(630, 250, k)];
const desk = (t, f = {}, k = 0, extra = "") => cam(960, 560, 1.3, roomBg(0.7, 0.25) + josephFront(t, Object.assign({ desk: true, hR: handUp(k), hL: [880, 630] }, f)) + extra, 1150);
function pill(t, a, s, col, y, size = 60, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#07080b" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }
function bubble(x, y, s, lines, col = INK, tail = "left") {
  if (s <= 0) return "";
  const w = Math.max(...lines.map(l => l.length)) * 27 + 80, h = lines.length * 64 + 40;
  let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="34" fill="#fff" stroke="#000" stroke-width="7"/>`;
  const tx = tail === "left" ? -w / 2 + 70 : w / 2 - 70, dir = tail === "left" ? -1 : 1;
  o += `<path d="M ${tx - 30} ${h / 2 - 4} L ${tx + dir * 40} ${h / 2 + 60} L ${tx + 30} ${h / 2 - 4} Z" fill="#fff" stroke="#000" stroke-width="7" stroke-linejoin="round"/><rect x="${tx - 34}" y="${h / 2 - 14}" width="68" height="14" fill="#fff"/>`;
  lines.forEach((l, i) => { o += `<text class="hand" x="0" y="${-h / 2 + 66 + i * 64}" font-size="52" text-anchor="middle" fill="${col}">${l}</text>`; });
  return o + `</g>`;
}
function court(t, inner = "") {
  let o = `<rect width="${SW}" height="${SH}" fill="#14261c"/><rect y="1180" width="${SW}" height="740" fill="#1f6b45"/><line x1="0" y1="1180" x2="${SW}" y2="1180" stroke="#fff" stroke-width="8"/><ellipse cx="540" cy="1420" rx="260" ry="80" fill="none" stroke="#fff" stroke-width="7" opacity="0.8"/>`;
  o += `<g transform="translate(900 1060)"><rect x="-10" y="-200" width="20" height="320" fill="#fff" stroke="#000" stroke-width="5"/><rect x="150" y="-200" width="20" height="320" fill="#fff" stroke="#000" stroke-width="5"/><rect x="-10" y="-210" width="180" height="20" fill="#fff" stroke="#000" stroke-width="5"/>`;
  for (let i = 0; i < 6; i++) o += `<line x1="${10 + i * 28}" y1="-190" x2="${10 + i * 28}" y2="120" stroke="#cfd8e3" stroke-width="3" opacity="0.6"/>`;
  return o + `</g>` + inner;
}
const ball = (x, y, r = 34) => `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff" stroke="#000" stroke-width="6"/><path d="M 0 ${-r * 0.4} l ${r * 0.38} ${r * 0.28} l ${-r * 0.15} ${r * 0.45} h ${-r * 0.46} l ${-r * 0.15} ${-r * 0.45} Z" fill="#1c1c22"/></g>`;
function vbubble(x, y, s, lines, tail = "left") { return bubble(x, y, s, lines, VIO, tail); }

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#140f22", "#07080b");
  if (t < S(2) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0f0b1a"/>`;
    o += thief(540, 1000, 1.3, 1, seg(t, 0.3, 1.0), t, { mask: VIO, grin: 1, look: 4 });
    for (let i = 0; i < 9; i++) { const h = 30 + 60 * Math.abs(Math.sin(t * 6 + i)); o += `<rect x="${330 + i * 50}" y="${1330 - h / 2}" width="26" height="${h}" rx="13" fill="${VIO}" opacity="${seg(t, S(1) + 3.0, S(1) + 3.4)}"/>`; }
    o += txt("ELE USA", 540, 580, 90, CREAM, 1, pop(t, S(1) + 4.2)) + txt("A SUA VOZ", 540, 700, 110, VIO, 1, pop(t, S(1) + 4.8));
    o += pill(t, 0.2, "TEMPORADA 2 · EP 4", VIO, 400, 56);
  } else if (t < S(3) - 0.2) {
    o += desk(t, { face: { look: [-12, -6], smile: 12, browUp: 6 } });
    o += `<g transform="translate(300 680) rotate(-4) scale(${pop(t, S(2) + 0.2)})"><rect x="-210" y="-150" width="420" height="300" rx="12" fill="#f6f1e6" stroke="#000" stroke-width="7"/><rect x="-210" y="-150" width="420" height="80" rx="12" fill="${GREEN}" stroke="#000" stroke-width="7"/><text class="hand" x="0" y="-95" font-size="50" text-anchor="middle" fill="#fff">PENEIRA</text><text class="hand" x="0" y="-10" font-size="56" text-anchor="middle" fill="#1c1c22">FUTSAL</text><text class="hand" x="0" y="80" font-size="58" text-anchor="middle" fill="${REDC}">SEXTA</text></g>`;
    o += ball(820, 720 + Math.abs(Math.sin(t * 5)) * -40, 46);
  } else if (t < S(4) - 0.2) {
    o += desk(t, { face: { look: [0, 12], smile: -5, browSad: 0.8 } });
    o += vbubble(540, 660, pop(t, S(3) + 1.6) * 1.15, ["eu não sou bom", "o suficiente"], "left");
  } else if (t < S(5) - 0.2) {
    o += desk(t, { face: { look: [10, 6], smile: -5, browSad: 0.8 } });
    o += thief(840, 880, 0.95, -1, seg(t, S(4) + 1.4, S(4) + 2.2), t, { mask: VIO, grin: 1, reach: 0.35, look: -8 });
    o += txt("NÃO É VOCÊ.", 540, 560, 84, CREAM, 1, pop(t, S(4) + 2.4)) + txt("É ELE.", 540, 680, 110, VIO, 1, pop(t, S(4) + 3.2));
  } else if (t < S(6) - 0.2) {
    o += desk(t, { face: { look: [0, 14], smile: -7, browSad: 1, lid: 0.3 } });
    o += thief(860, 900, 0.9, -1, 1, t, { mask: VIO, grin: 1 });
    o += vbubble(330, 560, pop(t, S(5)) * 0.95, ["tô cansado hoje"], "right");
    o += vbubble(720, 700, pop(t, S(5) + 1.3) * 0.95, ["começo segunda"], "left");
    o += vbubble(560, 1300, pop(t, S(5) + 2.6) * 0.95, ["todo mundo é melhor que eu"], "right");
  } else if (t < S(7) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += txt("A FRAQUEZA DELE:", 540, 560, 76, CREAM, 1, pop(t, S(6) + 0.6));
    o += thief(540, 1150, 1.0, 1, 1, t, { mask: VIO, look: 0, shrug: seg(t, S(6) + 5.6, S(6) + 6.2) });
    o += txt("AINDA", 540, 780, 200, GOLD, 1, pop(t, S(6) + 5.6));
  } else if (t < S(8) - 0.2) {
    const ins = seg(t, S(7) + 0.8, S(7) + 1.4);
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += `<g transform="translate(540 700)"><rect x="-440" y="-110" width="880" height="220" rx="40" fill="#fff" stroke="#000" stroke-width="8"/>`;
    o += ins < 1 ? `<text class="hand" x="0" y="26" font-size="86" text-anchor="middle" fill="${VIO}">"eu não consigo"</text>` : `<text class="hand" x="0" y="26" font-size="78" text-anchor="middle" fill="#1c1c22">"eu <tspan fill="${GOLD}" stroke="#000" stroke-width="3">AINDA</tspan> não consigo"</text>`;
    if (ins > 0 && ins < 1) o += `<text class="hand" x="-150" y="${-60 - (1 - ins) * 120}" font-size="70" text-anchor="middle" fill="${GOLD}" opacity="${ins}">AINDA ↓</text>`;
    o += `</g>`;
    o += pill(t, S(7) + 3.2, "QUEM AINDA NÃO CONSEGUE, TREINA", GREEN, 1000, 44);
  } else if (t < S(9) - 0.2) {
    const k = ((t - S(8)) * 1.2) % 1, bx = lerp(200, 980, k), by = 1250 - Math.sin(k * Math.PI) * 300;
    o += court(t, ball(bx, by, 32));
    o += timerFace(300, 560, 120, 1 - cl((t - S(8)) / 3.4), "15:00", GOLD);
    ["SEG", "TER", "QUA", "QUI"].forEach((d, i) => { o += pill(t, S(8) + 0.2 + i * 0.5, d + " ✓", GREEN, 470 + Math.floor(i / 2) * 120, 44, 640 + (i % 2) * 250); });
  } else if (t < S(10) - 0.2) {
    const leave = seg(t, S(9) + 2.4, S(9) + 4.2);
    o += court(t, cam(960, 560, 1.15, josephFront(t, { armsUp: seg(t, S(9) + 2.0, S(9) + 2.6), face: { happy: t > S(9) + 2.0 ? 1 : 0, smile: 12, look: [0, 4] } }), 1290));
    o += pill(t, S(9) + 2.0, "CHAMADO PRO TIME ✓", GREEN, 560, 60);
    o += thief(lerp(860, 1300, leave), 1500, 0.6, 1, 1 - leave * 0.8, t, { mask: VIO, shrug: 0.8 });
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    const k = seg(t, S(10) + 0.8, S(10) + 2.0);
    ["#ff9f1c", "#5b8cff", "#d1588a", VIO].forEach((m, i) => { o += `<g opacity="${0.55 * k}" style="filter: brightness(0.35)">${thief(180 + i * 240, 1150, 0.5, 1, 1, t, { mask: m })}</g>`; });
    o += `<g opacity="${k}"><ellipse cx="540" cy="900" rx="320" ry="380" fill="${BOSS}" opacity="0.18"/><g style="filter: brightness(0.2)">${thief(540, 900, 1.8, 1, 1, t, { mask: BOSS })}</g><path d="M 440 560 L 470 480 L 510 540 L 540 460 L 570 540 L 610 480 L 640 560 Z" fill="${BOSS}" stroke="#000" stroke-width="6"/></g>`;
    o += txt("FINAL DA TEMPORADA", 540, 360, 70, CREAM, 1, pop(t, S(10)));
    o += txt("O CHEFE DOS LADRÕES", 540, 1340, 74, BOSS, 1, pop(t, S(10) + 2.4));
  }
  o += vignette();
  o += topTag("OS LADRÕES · T2 EP 4", VIO);
  o += capShort(t);
  o += endCard(t, E(10) + 0.2, "Segue: o final sai amanhã");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
