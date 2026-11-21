// SHORT 23 — OS LADRÕES DO JOSEPH · T2 · EP 3: O LADRÃO DA COMPARAÇÃO (base: short-20)
const REDC = "#e5484d", PINK = "#d1588a", NEXT = "#9b6bff";
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
function ruler(x, y, w, rot, label, col = "#ffd166") {
  let o = `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2}" y="-38" width="${w}" height="76" rx="8" fill="${col}" stroke="#000" stroke-width="6"/>`;
  for (let i = 0; i <= 20; i++) { const xx = -w / 2 + 14 + i * (w - 28) / 20; o += `<line x1="${xx}" y1="-38" x2="${xx}" y2="${i % 5 ? -20 : -6}" stroke="#000" stroke-width="4"/>`; }
  if (label) o += `<text class="hand" x="0" y="28" font-size="34" text-anchor="middle" fill="#1c1c22">${label}</text>`;
  return o + `</g>`;
}
function post(x, y, s, rot, icon, title, bg, p = 1) {
  if (p <= 0) return "";
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s * p})"><rect x="-220" y="-170" width="440" height="340" rx="22" fill="#fff" stroke="#000" stroke-width="7"/><rect x="-200" y="-150" width="400" height="220" rx="12" fill="${bg}"/><text x="0" y="-10" font-size="120" text-anchor="middle">${icon}</text><text class="hand" x="0" y="130" font-size="42" text-anchor="middle" fill="#1c1c22">${title}</text><text x="170" y="130" font-size="34" text-anchor="middle">❤️</text></g>`;
}
function check(x, y, s, items, t, a) { const p = pop(t, a); if (p <= 0) return ""; let o = `<g transform="translate(${x} ${y}) scale(${s * p}) rotate(-3)"><rect x="-200" y="-130" width="400" height="260" rx="14" fill="#f6f1e6" stroke="#000" stroke-width="7"/><text class="hand" x="0" y="-70" font-size="46" text-anchor="middle" fill="#1c1c22">MEU DIA</text>`; items.forEach((s2, i) => { o += `<text class="hand" x="-160" y="${-6 + i * 62}" font-size="44" fill="#1c1c22">${s2}</text><path d="M 120 ${-22 + i * 62} l 14 16 l 30 -32" fill="none" stroke="${GREEN}" stroke-width="8" stroke-linecap="round"/>`; }); return o + `</g>`; }

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#1a0f1c", "#07080b");
  if (t < S(2) - 0.2) {
    o += desk(t, { face: { look: [0, 6], smile: 12, happy: t > S(1) + 2.5 ? 1 : 0 } });
    o += check(540, 700, 1.1, ["TREINO", "ESTUDO"], t, S(1) + 2.4);
    o += pill(t, 0.2, "TEMPORADA 2 · EP 3", PINK, 470, 60);
  } else if (t < S(3) - 0.2) {
    const out = seg(t, S(2) + 1.6, S(2) + 3.0);
    o += desk(t, { face: { look: [0, 14], smile: 2 }, phone: { pc: [960, 600], held: 1, on: true, mode: "feed" }, hR: [1000, 600], hL: [920, 600] });
    o += `<ellipse cx="540" cy="900" rx="${200 + out * 200}" ry="${200 + out * 200}" fill="url(#gPhone)" opacity="0.5" style="mix-blend-mode:screen"/>`;
    o += thief(lerp(540, 820, out), lerp(1000, 860, out), lerp(0.2, 0.9, out), -1, seg(t, S(2) + 1.4, S(2) + 1.8), t, { mask: PINK, grin: 1 });
  } else if (t < S(4) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#140b16"/>`;
    o += thief(540, 1000, 1.3, 1, 1, t, { mask: PINK, grin: 1, look: 4 });
    o += txt("ELE ROUBA:", 540, 520, 80, CREAM, 1, pop(t, S(3) + 0.4)) + txt("PAZ", 540, 640, 130, PINK, 1, pop(t, S(3) + 1.0));
    if (t > S(3) + 2.4) o += ruler(540, 1300, 760 * pop(t, S(3) + 2.4), -6, "");
  } else if (t < S(5) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#140b16"/>`;
    [["🚗", "carro do primo", "#9fd3ff", -240, 640, -6, S(4) + 1.6], ["✈️", "viagem da colega", "#ffd8a8", 240, 720, 5, S(4) + 2.8], ["💪", "corpo do influencer", "#c8f7c5", 0, 1060, -2, S(4) + 4.0]].forEach(([ic, ti, bg, dx, y, r, a]) => { o += post(540 + dx, y, 0.9, r, ic, ti, bg, pop(t, a)); });
    o += ruler(540, 1330, 900, 0, "COMPARÔMETRO");
  } else if (t < S(6) - 0.2) {
    const k = seg(t, S(5), S(5) + 2.5);
    o += `<g transform="translate(540 1150) scale(${lerp(1, 0.55, k)}) translate(-540 -1150)">${desk(t, { face: { look: [0, 12], smile: -6, browSad: 0.9 } })}</g>`;
    o += thief(860, 900, 0.95, -1, 1, t, { mask: PINK, grin: 1 });
    o += check(540, 640, lerp(1, 0.45, k), ["TREINO", "ESTUDO"], t, -1);
    o += pill(t, S(5) + 1.6, "O DIA BOM PARECEU PEQUENO", PINK, 1360, 48);
  } else if (t < S(7) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += `<g transform="translate(290 900) scale(${pop(t, S(6) + 2.2)})"><rect x="-230" y="-330" width="460" height="660" rx="20" fill="#2a2f3a" stroke="#000" stroke-width="7"/>${txt("BASTIDORES", 0, -270, 50, "#cfd8e3")}<text x="0" y="40" font-size="200" text-anchor="middle">😮‍💨</text>${txt("cansado, real", 0, 250, 44, "#8f99a3")}</g>`;
    o += `<g transform="translate(790 900) scale(${pop(t, S(6) + 4.0)})"><rect x="-230" y="-330" width="460" height="660" rx="20" fill="#fff4c2" stroke="#000" stroke-width="7"/>${txt("MELHOR MOMENTO", 0, -270, 44, "#8a5a00")}<text x="0" y="40" font-size="200" text-anchor="middle">🤩</text>${txt("filtro, ângulo", 0, 250, 44, "#8a5a00")}</g>`;
    o += txt("VS", 540, 900, 90, PINK, 1, pop(t, S(6) + 3.4));
    if (t < S(6) + 2.2) o += txt("O TRUQUE DELE:", 540, 470, 84, CREAM, 1, pop(t, S(6) - 0.1)) + thief(540, 1000, 1.1, 1, 1, t, { mask: PINK, grin: 1 });
    else o += txt("O TRUQUE DELE:", 540, 470, 70, CREAM);
  } else if (t < S(8) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += post(330, 700, 0.85, -4, "🌧️", "o dia ruim", "#c9d3df", pop(t, S(7) - 0.1)) + post(330, 1110, 0.85, 4, "🧾", "o boleto", "#f2d0d0", pop(t, S(7) + 1.6));
    o += txt("0 POSTS", 810, 700, 84, REDC, 1, pop(t, S(7) + 0.9)) + txt("0 POSTS", 810, 1110, 84, REDC, 1, pop(t, S(7) + 2.4));
  } else if (t < S(9) - 0.2) {
    const snap = seg(t, S(8) + 0.8, S(8) + 1.3);
    o += desk(t, { face: { look: [0, -6], smile: 8, browAng: 0.6 } });
    if (snap < 1) o += `<g opacity="${1 - snap}">${ruler(400 - snap * 80, 700 + snap * 200, 500, -10 - snap * 40, "OS OUTROS")}${ruler(680 + snap * 80, 700 + snap * 200, 500, 10 + snap * 40, "")}</g>`;
    if (t > S(8) + 2.6) o += ruler(540, 700, 860 * pop(t, S(8) + 2.6), 0, "EU DE ONTEM", GREEN);
    o += thief(870, 900, 0.85, -1, 1, t, { mask: PINK, look: -6, shrug: 0.4 });
  } else if (t < S(10) - 0.2) {
    const leave = seg(t, S(9) + 3.4, S(9) + 5.4);
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += txt("ONTEM", 290, 560, 70, "#8f99a3", 1, pop(t, S(9))) + txt("0", 290, 760, 220, "#8f99a3", 1, pop(t, S(9) + 0.3));
    o += txt("HOJE", 790, 560, 70, GREEN, 1, pop(t, S(9) + 1.2)) + txt("10", 790, 760, 220, GREEN, 1, pop(t, S(9) + 1.5));
    o += txt("flexões", 540, 900, 60, CREAM, seg(t, S(9) + 1.8, S(9) + 2.2));
    o += pill(t, S(9) + 3.2, "NINGUÉM POSTA. MAS É REAL.", GOLD, 1060, 48);
    o += thief(lerp(820, 1300, leave), 1280, 0.7, 1, 1 - leave * 0.7, t, { mask: PINK, shrug: 0.8 });
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#000"/>`;
    o += `<g opacity="${seg(t, S(10) + 1.0, S(10) + 2.0)}"><ellipse cx="540" cy="960" rx="260" ry="320" fill="${NEXT}" opacity="0.25"/><g style="filter: brightness(0.25)">${thief(540, 960, 1.4, 1, 1, t, { mask: NEXT })}</g>`;
    o += bubble(760, 640, 1.1, ['"eu não consigo"'], NEXT, "left") + `</g>`;
    o += txt("AMANHÃ:", 540, 470, 90, CREAM, 1, pop(t, S(10))) + txt("ELE USA A SUA VOZ", 540, 1300, 76, NEXT, 1, pop(t, S(10) + 2.4));
  }
  o += vignette();
  o += topTag("OS LADRÕES · T2 EP 3", PINK);
  o += capShort(t);
  o += endCard(t, E(10) + 0.2, "Segue: o próximo ladrão sai amanhã");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
