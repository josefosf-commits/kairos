// SHORT 20 — OS LADRÕES DO JOSEPH · TEMPORADA 2 · EP 2: O LADRÃO DA CORAGEM (base: short-18)
const REDC = "#e5484d", BLUE = "#5b8cff", NEXT = "#d1588a";
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
function board(t, a, ans) {
  const p = pop(t, a); if (p <= 0) return "";
  let o = `<g transform="translate(540 470) scale(${p})"><rect x="-420" y="-140" width="840" height="280" rx="14" fill="#7a5532" stroke="#000" stroke-width="7"/><rect x="-395" y="-118" width="790" height="236" rx="6" fill="#2f4a3a"/>`;
  o += `<text class="hand" x="0" y="40" font-size="120" text-anchor="middle" fill="#f4efe6" opacity="0.92">7 × 8 = ${ans}</text>`;
  return o + `</g>`;
}
function friendFront(t, f = {}, k = 1) {
  const P = Object.assign({ x: 960, c: FRIEND }, face(Object.assign({ lid: blink(t, 0.06, 1.3) }, f)));
  return personBack(P) + personHead(P, t) + deskFront(false) + armF([1060, 565], handUp(k), FRIEND.hood) + handC(handUp(k), FRIEND.skin);
}
const haha = (t, a) => [[230, 640, -12], [850, 700, 10], [180, 1240, 8], [900, 1300, -8], [150, 940, -6]].map(([x, y, r], i) => { const p = pop(t, a + i * 0.25); return p > 0 ? `<g transform="translate(${x} ${y}) rotate(${r}) scale(${p})" opacity="0.75"><text class="hand" x="0" y="0" font-size="76" text-anchor="middle" fill="${REDC}" stroke="#000" stroke-width="10" paint-order="stroke">HAHA</text></g>` : ""; }).join("");

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0f1422", "#07080b");
  if (t < S(2) - 0.2) {
    o += desk(t, { face: { look: [0, 9], smile: 2, lid: blink(t, 0.06) } });
    o += thief(860, 900, 0.9, -1, seg(t, S(1) + 2.2, S(1) + 3.0), t, { mask: BLUE, grin: 1, look: -4 });
    o += pill(t, 0.2, "TEMPORADA 2 · EP 2", BLUE, 640, 64);
  } else if (t < S(3) - 0.2) {
    const k = 0.35 * seg(t, S(2) + 3.6, S(2) + 4.8);
    o += desk(t, { face: { look: [0, -12], smile: 6, browUp: 6 } }, k);
    o += board(t, S(2), "?");
    if (t > S(2) + 2.6) o += bubble(300, 720, pop(t, S(2) + 2.6) * 1.5, ["56!"], INK, "right");
  } else if (t < S(4) - 0.2) {
    const shake = Math.sin(t * 40) * 3 * seg(t, S(3) + 2, S(3) + 3);
    o += desk(t, { face: { look: [10, 4], browSad: 0.7, smile: -4 } }, 0.35, "");
    o += `<g transform="translate(${shake} 0)">${thief(830, 880, 0.9, -1, 1, t, { mask: BLUE, grin: 1, look: -8, reach: 0.3 })}</g>`;
    o += bubble(640, 600, pop(t, S(3) + 0.6) * 1.35, ["e se você", "errar?"], BLUE, "right");
    o += haha(t, S(3) + 3.4);
  } else if (t < S(5) - 0.2) {
    const k = 0.35 * (1 - seg(t, S(4) + 0.2, S(4) + 1.2));
    o += desk(t, { face: { look: [0, 16], browSad: 0.9, smile: -6, lid: 0.4 } }, k);
    o += thief(860, 900, 0.9, -1, 1, t, { mask: BLUE, grin: 1, shrug: 0.4 });
    o += txt("...", 540, 700, 140, CREAM, seg(t, S(4) + 1.6, S(4) + 2.0));
  } else if (t < S(6) - 0.2) {
    o += cam(960, 560, 1.3, roomBg(0.7, 0.25) + friendFront(t, { smile: 10, look: [0, -10] }, seg(t, S(5) + 0.4, S(5) + 1.2)), 1150);
    o += board(t, S(5) - 0.1, t > S(5) + 3.6 ? "56" : "?");
    o += pill(t, S(5) + 1.8, "A MESMA RESPOSTA", GOLD, 1350, 56);
    if (t > S(5) + 4.4) o += bubble(300, 740, pop(t, S(5) + 4.4) * 1.3, ["PERFEITO!"], "#1e8a52", "right");
  } else if (t < S(7) - 0.2) {
    const gone = seg(t, S(6) + 4.4, S(6) + 6.0);
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += thief(540, 1050, 1.25, 1, 1 - gone, t, { mask: BLUE, look: 4, grin: gone > 0 ? 0 : 1 });
    o += txt("A FRAQUEZA DELE:", 540, 560, 70, CREAM, 1, pop(t, S(6) + 1.0)) + txt("ELE SÓ EXISTE ANTES", 540, 680, 70, BLUE, 1, pop(t, S(6) + 2.6));
    o += pill(t, S(6) + 4.4, "FALOU → ELE SOME", GREEN, 1350, 60);
  } else if (t < S(7) + 3.4) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += txt("REGRA DO", 540, 520, 90, CREAM, 1, pop(t, S(7)));
    const n = t < S(7) + 2.0 ? "3" : t < S(7) + 2.6 ? "2" : "1", a = t < S(7) + 2.0 ? S(7) + 1.4 : t < S(7) + 2.6 ? S(7) + 2.0 : S(7) + 2.6;
    if (t > S(7) + 1.4) o += txt(n, 540, 950, 380, GREEN, 1, pop(t, a, 0.2));
  } else if (t < S(8) - 0.2) {
    const k = seg(t, S(7) + 3.4, S(7) + 4.0);
    o += desk(t, { face: { look: [0, -12], browAng: 0.4, smile: 6 } }, k);
    o += pill(t, S(7) + 3.6, "MÃO PRA CIMA ANTES DE PENSAR", GOLD, 620, 50);
  } else if (t < S(9) - 0.2) {
    const tr = Math.sin(t * 60) * 4 * (1 - seg(t, S(8), S(8) + 1.4)), sc = lerp(0.9, 0.35, seg(t, S(8) + 2.4, S(8) + 3.6));
    o += desk(t, { face: { look: [0, -8], smile: 12, browAng: 0.2, mouthOpen: 0.3 } }, 1);
    o += `<g transform="translate(${tr} 0)">${bubble(300, 700, pop(t, S(8)) * 1.4, ["é... 56!"], INK, "right")}</g>`;
    o += thief(880, lerp(900, 1180, seg(t, S(8) + 2.4, S(8) + 3.6)), sc, -1, 1, t, { mask: BLUE, shrug: 0.8 });
    o += pill(t, S(8) + 1.4, "NINGUÉM RIU ✓", GREEN, 1350, 60);
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += `<g opacity="${seg(t, S(9) + 1.0, S(9) + 2.0)}"><ellipse cx="540" cy="960" rx="260" ry="320" fill="${NEXT}" opacity="0.25"/><g style="filter: brightness(0.25)">${thief(540, 960, 1.4, 1, 1, t, { mask: NEXT })}</g>`;
    o += `<g transform="translate(700 900) rotate(12)">${ICON.phone(NEXT)}</g></g>`;
    o += txt("AMANHÃ:", 540, 560, 90, CREAM, 1, pop(t, S(9))) + txt("ELE MORA NO SEU CELULAR", 540, 1300, 66, NEXT, 1, pop(t, S(9) + 2.0));
  }
  o += vignette();
  o += topTag("OS LADRÕES · T2 EP 2", BLUE);
  o += capShort(t);
  o += endCard(t, E(9) + 0.2, "Segue: o próximo ladrão sai amanhã");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
