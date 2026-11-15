// SHORT 11 — OS LADRÕES DO JOSEPH #5: O PILOTO AUTOMÁTICO (o chefe e os 3 botões)
const REDC = "#e5484d", BLUE = "#9fd8ff", PURPLE = THIEF_PURPLE;
const T5 = { energia: "#c6f135", foco: "#4fd1ff", tempo: "#ffc53d", autoestima: "#ff6fae", sono: "#8b6ad8" };
const KEYS = Object.keys(T5);
const BTN = [["SONECA", "#7c8cff"], ["ABRIR APP", "#e93d82"], ["SÓ MAIS UM", "#ff9f1c"]];

// big remote with the 3 buttons; pressed: index being pressed (0..2) with depth 0..1; off: buttons disabled 0..1
function remote(x, y, s, pressed = -1, depth = 0, off = 0, hi = -1) {
  let o = `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-290" width="300" height="580" rx="60" fill="#2a2e35" stroke="#000" stroke-width="10"/><rect x="-110" y="-250" width="220" height="60" rx="14" fill="#12151c"/><text class="sans" x="0" y="-210" font-size="28" font-weight="800" text-anchor="middle" fill="${BLUE}">AUTO ▶▶</text>`;
  BTN.forEach(([lab, c], i) => {
    const y0 = -110 + i * 150, d = i === pressed ? depth : 0, dead = off, glow = i === hi ? 1 : 0;
    const col = mixc(c, "#4a4f5a", dead);
    if (glow) o += `<circle cx="0" cy="${y0}" r="90" fill="${c}" opacity="0.25" style="mix-blend-mode:screen"/>`;
    o += `<circle cx="0" cy="${y0 + 8}" r="62" fill="#000"/><circle cx="0" cy="${y0 + 8 * d}" r="62" fill="${col}" stroke="#000" stroke-width="7"/>`;
    o += `<text class="hand" x="0" y="${y0 + 8 * d + 12}" font-size="${lab.length > 8 ? 30 : 36}" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke">${lab}</text>`;
    if (dead > 0.5) o += `<path d="M -48 ${y0 - 48} L 48 ${y0 + 48} M 48 ${y0 - 48} L -48 ${y0 + 48}" stroke="${REDC}" stroke-width="12" stroke-linecap="round" opacity="${dead}"/>`;
  });
  return o + `</g>`;
}
const finger = (x, y, d) => `<g transform="translate(${x} ${y + 26 * d})"><path d="M -18 -110 L -18 -10 Q 0 14 18 -10 L 18 -110 Z" fill="#141a2e" stroke="#000" stroke-width="7"/><rect x="-46" y="-190" width="92" height="90" rx="26" fill="#141a2e" stroke="#000" stroke-width="7"/></g>`;
const press = (t, a, n = 1, gap = 0.45) => { for (let i = 0; i < n; i++) { const u = t - a - i * gap; if (u > 0 && u < 0.3) return Math.sin(u / 0.3 * Math.PI); } return 0; };
function bedScene(t, q) {
  let w = roomBg(0.4, 0.2) + josephFront(t, Object.assign({ blanket: true }, q)) + `<rect x="-600" y="-400" width="3120" height="1900" fill="#000" opacity="0.25"/>`;
  return cam(960, 560, 1.15, w, 1240);
}
function deskScene(t, q, day = 0.5) { return cam(960, 560, 1.15, roomBg(day, 0.2) + josephFront(t, Object.assign({ desk: true }, q)), 1240); }
// strings from the boss' control bar to Joseph's hands (marionette)
function strings(op, t) {
  if (op <= 0) return "";
  const sw = Math.sin(t * 2) * 10;
  return `<g opacity="${op}"><rect x="${300 + sw}" y="620" width="480" height="26" rx="10" fill="#141a2e" stroke="#000" stroke-width="5"/>${[[340, 1120], [740, 1120], [540, 980]].map(([x, y]) => `<line x1="${x + sw}" y1="640" x2="${x}" y2="${y}" stroke="#cfd8e3" stroke-width="3"/>`).join("")}</g>`;
}

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0a0b14", "#07080b");
  if (t < S(3) - 0.1) {
    // the boss reveal + his remote
    const showRemote = seg(t, S(2) + 1.6, S(2) + 2.2);
    o += `<ellipse cx="540" cy="820" rx="460" ry="520" fill="#3e63dd" opacity="0.08"/>`;
    o += piloto(lerp(540, 380, showRemote), 900, 1.25, t);
    KEYS.forEach((k, i) => { o += thief(140 + i * 200, 1300, 0.55, i % 2 ? -1 : 1, 0.9, t + i, { mask: T5[k], loot: T5[k], look: 4 }); });
    if (t < S(2) - 0.1) o += txt("O CHEFE", 540, 330, 120, CREAM, 1, pop(t, 0.15)) + txt("DOS LADRÕES", 540, 460, 100, GOLD, 1, pop(t, 0.6));
    else o += `<g transform="translate(540 340) scale(${pop(t, S(2))})"><rect x="-400" y="-62" width="800" height="124" rx="62" fill="#12151c" stroke="#3e63dd" stroke-width="7"/>${txt("PILOTO AUTOMÁTICO", 0, 0, 64, BLUE)}</g>`;
    if (showRemote > 0) o += `<g opacity="${showRemote}">${remote(820, 860, 0.85, -1, 0, 0, Math.floor(t * 2) % 3)}</g>` + txt("3 BOTÕES", 820, 500, 70, GOLD, showRemote);
  } else if (t < S(4) - 0.1) {
    // button 1: snooze x3
    const n = [S(3) + 2.4, S(3) + 3.2, S(3) + 4.0].filter(a => t > a).length;
    o += bedScene(t, { face: { lid: 1, zzz: true, smile: 0, bags: 0.8 } });
    o += `<g transform="translate(260 520)"><circle cx="-60" cy="-70" r="28" fill="${REDC}" stroke="#000" stroke-width="6"/><circle cx="60" cy="-70" r="28" fill="${REDC}" stroke="#000" stroke-width="6"/>${clockAt(0, 0, 6 * 60 + 30)}</g>`;
    const d = press(t, S(3) + 2.4, 3, 0.8);
    o += remote(800, 700, 0.8, 0, d, 0, 0) + finger(800, 700 + (-110 - 40) * 0.8, d);
    o += txt("BOTÃO 1", 540, 330, 80, BTN[0][1], 1, pop(t, S(3)));
    if (n) o += txt(`SONECA ×${n}`, 260, 760, 64, GOLD, 1, pop(t, [S(3) + 2.4, S(3) + 3.2, S(3) + 4.0][n - 1]));
  } else if (t < S(5) - 0.1) {
    // button 2: open the app without deciding
    const k = seg(t, S(4) + 2.4, S(4) + 3.2);
    const hR = lerp2([1150, 640], HOLD.hR, k), pc = lerp2([1200, 632], HOLD.pc, k);
    o += deskScene(t, { book: [960, 600], hR, hL: k > 0.5 ? HOLD.hL : [880, 610], phone: { pc, held: k, on: k > 0.5 }, face: k > 0.5 ? { look: [0, 9], lid: 0.2, smile: 2 } : { look: [0, 8], smile: 2 } });
    const d = press(t, S(4) + 2.2);
    o += remote(820, 700, 0.8, 1, d, 0, 1) + finger(820, 700 + (40 - 40) * 0.8, d);
    o += txt("BOTÃO 2", 540, 330, 80, BTN[1][1], 1, pop(t, S(4)));
    o += txt("você nem decidiu...", 300, 560, 54, "#cfd8e3", seg(t, S(4) + 3.0, S(4) + 3.4));
  } else if (t < S(6) - 0.1) {
    // button 3: "só mais um" pressed again and again, clock running
    const presses = [0, 1, 2, 3, 4].map(i => S(5) + 1.4 + i * 0.9);
    const n = presses.filter(a => t > a).length;
    const d = press(t, S(5) + 1.4, 5, 0.9);
    o += bedScene(t, { ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { lid: 0.45, bags: 1, look: [0, 9], smile: 0 } });
    o += remote(820, 700, 0.8, 2, d, 0, 2) + finger(820, 700 + (190 - 40) * 0.8, d);
    o += txt("BOTÃO 3", 540, 330, 80, BTN[2][1], 1, pop(t, S(5)));
    const items = ["+1 vídeo", "+1 episódio", "+5 min", "+1 vídeo", "+5 min"];
    for (let i = 0; i < n; i++) o += txt(items[i], 250, 480 + i * 70, 50, GOLD, 1, pop(t, presses[i]));
    const mins = 23 * 60 + n * 37;
    o += `<g transform="translate(250 900)"><rect x="-140" y="-56" width="280" height="112" rx="20" fill="#07080b" stroke="${REDC}" stroke-width="6"/><text class="sans" x="0" y="22" font-size="64" font-weight="800" text-anchor="middle" fill="${REDC}">${String(Math.floor(mins / 60) % 24).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}</text></g>`;
  } else if (t < S(7) - 0.1) {
    // marionette: he commands when you don't decide
    o += piloto(540, 520, 0.6, t, { press: Math.max(0, Math.sin(t * 5)) });
    o += strings(seg(t, S(6), S(6) + 0.5), t);
    o += cam(960, 560, 0.9, josephFront(t, { hR: [1150, 700 + Math.sin(t * 3) * 30], hL: [770, 700 - Math.sin(t * 3) * 30], face: { look: [0, -10], lid: 0.3, smile: -2, browSad: 0.6 } }), 1180);
    o += txt("quando você não decide,", 540, 1400 - 70, 0, CREAM, 0);
  } else if (t < S(9) - 0.1) {
    // decide before: "QUANDO ___, EU ___"
    o += txt("DECIDA ANTES", 540, 330, 110, GREEN, 1, pop(t, S(7)));
    const card = (y, a, q, e) => {
      const p = pop(t, a); if (p <= 0) return "";
      const kq = seg(t, a + 0.3, a + 1.2), ke = seg(t, a + 1.3, a + 2.2);
      return `<g transform="translate(540 ${y}) scale(${p})"><rect x="-470" y="-120" width="940" height="240" rx="36" fill="#12151c" stroke="${GREEN}" stroke-width="6"/><text class="hand" x="-430" y="-40" font-size="44" fill="${GOLD}">QUANDO</text><text class="hand" x="-235" y="-40" font-size="44" fill="${CREAM}">${esc(q.slice(0, Math.round(q.length * kq)))}</text><text class="hand" x="-430" y="60" font-size="44" fill="${GREEN}">EU</text><text class="hand" x="-350" y="60" font-size="44" fill="${CREAM}">${esc(e.slice(0, Math.round(e.length * ke)))}</text></g>`;
    };
    if (t < S(8) - 0.1) o += card(640, S(7) + 2.2, "acontecer isso,", "faço aquilo.");
    else { o += card(620, S(8), "o despertador tocar,", "levanto e bebo água."); o += card(920, S(8) + 3.0, "pegar o celular,", "pergunto: pra quê?"); }
  } else if (t < S(10) - 0.1) {
    // buttons stop working
    const off = seg(t, S(9) + 0.4, S(9) + 1.2);
    o += piloto(330, 860, 0.85, t, { press: Math.max(0, Math.sin(t * 8)) });
    o += remote(800, 780, 0.75, Math.floor(t * 3) % 3, Math.max(0, Math.sin(t * 9)), off);
    o += txt("clic... clic...", 800, 380, 60, "#8f99a3", seg(t, S(9) + 1.2, S(9) + 1.6));
    o += txt("NÃO FUNCIONA", 540, 1240, 84, REDC, 1, pop(t, S(9) + 1.6));
  } else if (t < S(11) - 0.1) {
    // Joseph holds the remote now; thieves stuck outside
    o += cam(960, 560, 1.15, roomBg(0.95, 0.5) + josephFront(t, { hR: [1100, 470], hL: [880, 640], face: { smile: 12, look: [8, 4], browAng: 0.4 } }), 1240);
    o += `<g transform="translate(${540 + (1100 - 960) * 1.15} ${1240 + (470 - 560) * 1.15}) rotate(15)">${remote(0, -70, 0.35)}</g>`;
    KEYS.forEach((k, i) => { o += thief(80 + i * 60, 1240, 0.4, 1, 0.6, t + i, { mask: T5[k], shrug: 0.6 }); });
    o += txt("AGORA QUEM APERTA", 540, 330, 80, CREAM, 1, pop(t, S(10) + 2.0)) + txt("É VOCÊ", 540, 450, 120, GREEN, 1, pop(t, S(10) + 2.6));
  } else {
    o += txt("QUAL BOTÃO", 540, 330, 110, CREAM, 1, pop(t, S(11))) + txt("TE PEGA MAIS?", 540, 460, 100, GOLD, 1, pop(t, S(11) + 0.3));
    o += remote(540, 900, 0.8, -1, 0, 0, Math.floor(t * 2.5) % 3);
    o += txt("comenta 1, 2 ou 3 👇", 540, 1300, 60, CREAM, seg(t, S(11) + 1.0, S(11) + 1.4));
  }
  o += vignette();
  o += topTag("OS LADRÕES DO JOSEPH #5", PURPLE);
  o += capShort(t);
  o += endCard(t, E(11) + 0.3, "Segue pra ver o próximo episódio");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.3, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
