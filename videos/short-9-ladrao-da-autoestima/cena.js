// SHORT 9 — OS LADRÕES DO JOSEPH #3: O LADRÃO DA AUTOESTIMA
const REDC = "#e5484d", PINK = "#ff6fae", PURPLE = THIEF_PURPLE;

// ---------- autoestima jar (same idea as the FOCO jar of #1) ----------
const JAR = [820, 520];
function jar(level, t) {
  const [x, y] = JAR, w = 210, h = 280;
  let o = `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="20" rx="200" ry="220" fill="${PINK}" opacity="0.14" style="mix-blend-mode:screen"/>`;
  o += `<clipPath id="jarIn"><rect x="${-w / 2 + 10}" y="${-h / 2 + 40}" width="${w - 20}" height="${h - 50}" rx="26"/></clipPath>`;
  o += `<rect x="${-w / 2}" y="${-h / 2 + 30}" width="${w}" height="${h - 30}" rx="34" fill="#2a1a26" opacity="0.7" stroke="#f5cfe2" stroke-width="7"/>`;
  const lh = (h - 50) * cl(level), top = h / 2 - 10 - lh;
  o += `<g clip-path="url(#jarIn)"><rect x="${-w / 2}" y="${top + Math.sin(t * 3) * 3}" width="${w}" height="${lh + 20}" fill="${PINK}" opacity="0.85"/>`;
  for (let i = 0; i < 5; i++) { const k = (t * 0.35 + hash(i)) % 1; o += `<path d="M 0 8 C -18 -6 -8 -20 0 -10 C 8 -20 18 -6 0 8 Z" transform="translate(${-50 + hash(i + 3) * 100} ${h / 2 - 20 - k * lh}) scale(${1 + hash(i) * 0.6})" fill="#fff" opacity="${0.55 * (1 - k)}"/>`; }
  o += `</g><rect x="${-w / 2 - 12}" y="${-h / 2 + 4}" width="${w + 24}" height="40" rx="12" fill="#8a6d3b" stroke="#000" stroke-width="6"/>`;
  return o + txt("AUTOESTIMA", 0, h / 2 + 50, 54, PINK) + `</g>`;
}
const heartOrb = (x, y, s, op = 1) => `<path d="M 0 14 C -32 -10 -14 -36 0 -18 C 14 -36 32 -10 0 14 Z" transform="translate(${x} ${y}) scale(${s})" fill="${PINK}" stroke="#fff" stroke-width="3" opacity="${op}"/>`;

// ---------- "perfect" posts ----------
function post(x, y, s, kind, k, rot = 0) {
  if (k <= 0) return "";
  let pic = "";
  if (kind === 0) pic = `<rect x="-160" y="-150" width="320" height="230" fill="#58c4e6"/><circle cx="90" cy="-90" r="34" fill="#ffd27a"/><path d="M -160 30 Q -80 0 0 30 T 160 30 L 160 80 L -160 80 Z" fill="#f2d39b"/><path d="M -60 30 L -60 -60 M -60 -60 Q -100 -70 -120 -40 M -60 -60 Q -20 -80 0 -50" stroke="#2f7a3a" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  if (kind === 1) pic = `<rect x="-160" y="-150" width="320" height="230" fill="#ff9f6b"/><g transform="translate(0 -30)"><rect x="-90" y="-12" width="180" height="24" rx="8" fill="#2a2e35"/><rect x="-110" y="-40" width="34" height="80" rx="10" fill="#2a2e35"/><rect x="76" y="-40" width="34" height="80" rx="10" fill="#2a2e35"/></g>${txt("💪", 0, 50, 50, "#fff", 1, 1, 'stroke-width="0"')}`;
  if (kind === 2) pic = `<rect x="-160" y="-150" width="320" height="230" fill="#9b8cff"/><path d="M -90 60 L -90 -20 L -30 -70 L 30 -20 L 30 60 Z" fill="#fff4dc" stroke="#000" stroke-width="5"/><rect x="50" y="20" width="100" height="40" rx="14" fill="${REDC}" stroke="#000" stroke-width="5"/><circle cx="75" cy="62" r="12" fill="#000"/><circle cx="125" cy="62" r="12" fill="#000"/>`;
  const labels = ["viagem perfeita", "corpo perfeito", "vida perfeita"];
  return `<g transform="translate(${x} ${y}) scale(${s * easeBack(k)}) rotate(${rot})"><rect x="-180" y="-200" width="360" height="400" rx="26" fill="#fff" stroke="#000" stroke-width="7"/><circle cx="-140" cy="-172" r="16" fill="#cfd0d8"/><rect x="-115" y="-182" width="120" height="18" rx="9" fill="#e2e2e8"/><clipPath id="pc${kind}"><rect x="-160" y="-150" width="320" height="230" rx="10"/></clipPath><g clip-path="url(#pc${kind})">${pic}</g>` +
    `<path d="M -140 120 c -14 -14 -32 4 0 26 c 32 -22 14 -40 0 -26 Z" fill="${REDC}"/><text class="sans" x="-105" y="140" font-size="28" font-weight="800" fill="#1c1c22">${["24 mil", "51 mil", "88 mil"][kind]}</text><text class="hand" x="0" y="185" font-size="32" text-anchor="middle" fill="#5a5a66">${labels[kind]}</text></g>`;
}
function scrollScene(t, q = {}) {
  let w = roomBg(0.3, 0.1) + josephFront(t, Object.assign({ desk: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true } }, q));
  return cam(960, 560, 1.3, w, 1150);
}
function mirror(t, sad) {
  const P = Object.assign({ x: 960, c: JOSEPH }, face(sad ? { browSad: 1, smile: -6, look: [0, 6], lid: 0.25, mouthW: 12 } : { smile: 10, look: [0, 4] }));
  let o = `<g transform="translate(540 820)"><ellipse rx="300" ry="390" fill="#8a6d3b" stroke="#000" stroke-width="10"/><ellipse rx="262" ry="352" fill="#cfe2ec"/>`;
  o += `<clipPath id="mir"><ellipse rx="262" ry="352"/></clipPath><g clip-path="url(#mir)"><rect x="-300" y="-400" width="600" height="800" fill="#b8ccd8"/>${`<g transform="translate(0 40) scale(1.35) translate(-960 -480)">${personBack(P) + personHead(P, t)}</g>`}<path d="M -200 -300 L -120 -360 M -230 -200 L -80 -330" stroke="#fff" stroke-width="12" opacity="0.5"/></g></g>`;
  return o;
}
function thought(x, y, s, k, textA, col) {
  if (k <= 0) return "";
  return `<g transform="translate(${x} ${y}) scale(${easeBack(k)})"><ellipse rx="${s}" ry="90" fill="#f4efe6" stroke="#000" stroke-width="7"/><text class="hand" x="0" y="18" font-size="52" text-anchor="middle" fill="${col}">${textA}</text></g>`;
}

function render(t) {
  const end = window.TL.duration;
  const steals = [S(3) - 0.2, S(3) + 1.0, S(3) + 2.2];
  let o = plainBg("#1a0f1c", "#07080b");
  if (t < S(4) - 0.1) {
    const stolen = steals.filter(a => t > a + 1.6).length;
    o += scrollScene(t, { face: { look: [0, 9], lid: 0.2, smile: t > S(3) ? -4 : 2, browSad: t > S(3) ? 0.7 : 0 } });
    // feed posts float up from the phone
    if (t > S(2) - 0.2) {
      const ks = [S(2) + 0.2, S(2) + 1.7, S(2) + 3.2];
      const fo = 1 - seg(t, S(3) - 0.5, S(3) - 0.1); ks.forEach((a, i) => { o += `<g opacity="${fo}">` + post(250 + i * 290, 560 - (i % 2) * 40, 0.72, i, seg(t, a, a + 0.35), (i - 1) * 6) + `</g>`; });
      o = o + `<rect width="${SW}" height="${SH}" fill="#000" opacity="${0.0}"/>`;
    }
    if (t > S(3) - 0.6) o += `<g opacity="${seg(t, S(3) - 0.6, S(3) - 0.2)}">${jar(1 - 0.25 * stolen, t)}</g>`;
    let tx = 160, ty = 900, reach = 0;
    for (const a of steals) if (inR(t, a, a + 2.2)) {
      const u = t - a, k = u < 0.7 ? sm(u / 0.7) : u < 1.5 ? 1 : 1 - sm((u - 1.5) / 0.7);
      tx = lerp(160, JAR[0] - 230, k); ty = lerp(900, JAR[1] + 40, k);
      reach = inR(u, 0.6, 1.5) ? Math.sin(cl((u - 0.6) / 0.9) * Math.PI) : 0;
      if (inR(u, 0.9, 1.4)) { const q = (u - 0.9) / 0.5; o += heartOrb(lerp(JAR[0], tx + 60, q), lerp(JAR[1] - 60, ty - 40, q), 1.4); }
    }
    const appear = seg(t, 0.05, 0.9);
    o += thief(lerp(PHONE_SX, tx, appear), lerp(1145, ty, appear), lerp(0.2, 0.95, appear), 1, appear, t, { reach, sack: stolen, loot: PINK, grin: 1 });
    if (t < S(2) - 0.2) o += txt("ELE ENTRA", 540, 360, 110, CREAM, 1, pop(t, 0.2)) + txt("PELO SEU FEED", 540, 490, 110, PINK, 1, pop(t, 2.4));
    if (t > S(3) - 0.2 && t < S(4)) o += `<g transform="translate(320 330) scale(${pop(t, S(3))})"><rect x="-280" y="-40" width="560" height="80" rx="40" fill="#12151c" stroke="${PURPLE}" stroke-width="5"/>${txt("LADRÃO DA AUTOESTIMA", 0, 0, 46, PURPLE)}</g>`;
  } else if (t < S(5) - 0.1) {
    o += mirror(t, true);
    o += thought(300, 420, 230, seg(t, S(4) + 2.2, S(4) + 2.5), "tô atrasado", "#1c1c22");
    o += thought(760, 1260, 290, seg(t, S(4) + 3.6, S(4) + 3.9), "não sou suficiente", REDC);
  } else if (t < S(7) - 0.1) {
    // stage vs backstage
    const reveal = seg(t, S(5) + 3.6, S(5) + 4.6);
    o += `<rect x="0" y="300" width="${SW}" height="1100" fill="#140d16"/>`;
    o += `<polygon points="540,300 240,1200 840,1200" fill="#fff4c2" opacity="${0.12 * (1 - reveal)}"/>`;
    o += txt(reveal < 0.5 ? "PALCO" : "BASTIDORES", 540, 400, 100, reveal < 0.5 ? GOLD : PINK, 1, reveal < 0.5 ? pop(t, S(5) + 1.6) : pop(t, S(5) + 4.1));
    if (reveal < 1) o += `<g opacity="${1 - reveal}">${post(540, 800, 1.2, 0, 1)}</g>`;
    // curtains
    const cw = lerp(0, 540, seg(t, S(5) + 2.8, S(5) + 3.6)) * (1 - reveal);
    o += `<rect x="0" y="300" width="${cw}" height="1100" fill="#8c2f3a"/><rect x="${SW - cw}" y="300" width="${cw}" height="1100" fill="#8c2f3a"/>`;
    if (reveal > 0) {
      for (let i = 0; i < 12; i++) { const k = seg(t, S(5) + 4.4 + i * 0.05, S(5) + 4.8 + i * 0.05); o += `<g opacity="${reveal * k}" transform="translate(${300 + (hash(i) - 0.5) * 140} ${720 + (hash(i + 4) - 0.5) * 100}) rotate(${(hash(i + 2) - 0.5) * 40}) scale(1.35)"><rect x="-110" y="-80" width="220" height="160" rx="8" fill="#fff" stroke="#000" stroke-width="5"/><rect x="-95" y="-65" width="190" height="105" fill="${["#58c4e6", "#9aa3ad", "#c9b8a0"][i % 3]}"/>${i === 11 ? txt("✗", 0, -10, 70, REDC) : ""}</g>`; }
      o += txt("30 TENTATIVAS", 300, 900, 62, CREAM, seg(t, S(6) + 0.4, S(6) + 0.8));
      const rk = pop(t, S(6) + 2.6);
      if (rk > 0) o += `<g transform="translate(790 760) scale(${rk}) rotate(4)"><path d="M -150 -200 L 150 -200 L 150 200 L 120 180 L 90 200 L 60 180 L 30 200 L 0 180 L -30 200 L -60 180 L -90 200 L -120 180 L -150 200 Z" fill="#fff" stroke="#000" stroke-width="6"/><text class="sans" x="0" y="-140" font-size="30" font-weight="800" text-anchor="middle" fill="#1c1c22">FATURA</text>${[0, 1, 2, 3].map(i => `<rect x="-110" y="${-100 + i * 50}" width="${160 - i * 20}" height="18" rx="6" fill="#d6d6dd"/>`).join("")}<text class="sans" x="0" y="140" font-size="44" font-weight="800" text-anchor="middle" fill="${REDC}">1/12</text></g>` + txt("PARCELADA EM 12X", 790, 1010, 54, CREAM, rk);
    }
  } else if (t < S(8) - 0.1) {
    o += `<rect x="0" y="300" width="540" height="1100" fill="#1d1820"/><rect x="540" y="300" width="540" height="1100" fill="#2a2130"/>`;
    o += cam(960, 520, 0.6, josephFront(t, { hR: [1060, 680], hL: [860, 680], face: { smile: 0, lid: 0.3, look: [0, 6], bags: 0.6 } }), 900).replace("<g transform", `<g transform="translate(-270 0)"><g transform`) + `</g>`;
    o += `<polygon points="810,300 640,1100 980,1100" fill="#fff4c2" opacity="0.18"/>` + `<g transform="translate(810 820)">${post(0, 0, 0.75, 2, 1)}</g>`;
    o += txt("SEUS", 270, 420, 70, CREAM, 1, pop(t, S(7) + 0.4)) + txt("BASTIDORES", 270, 510, 70, PINK, 1, pop(t, S(7) + 0.6));
    o += txt("O PALCO", 810, 420, 70, CREAM, 1, pop(t, S(7) + 2.4)) + txt("DOS OUTROS", 810, 510, 70, GOLD, 1, pop(t, S(7) + 2.6));
    o += txt("≠", 540, 820, 160, REDC, 1, pop(t, S(7) + 3.0));
  } else if (t < S(9) - 0.1) {
    // unfollow
    const k = seg(t, S(8) + 2.0, S(8) + 2.3);
    o += txt("DEIXA DE SEGUIR", 540, 420, 96, CREAM, 1, pop(t, S(8)));
    o += `<g transform="translate(540 800) scale(${pop(t, S(8) + 0.5)})"><rect x="-380" y="-200" width="760" height="400" rx="40" fill="#fff" stroke="#000" stroke-width="7"/><circle cx="-260" cy="-60" r="70" fill="#cfd0d8"/><rect x="-160" y="-100" width="300" height="30" rx="10" fill="#1c1c22"/><rect x="-160" y="-50" width="200" height="22" rx="8" fill="#d6d6dd"/>`;
    o += `<rect x="-300" y="60" width="600" height="90" rx="20" fill="${k > 0.5 ? "#3e63dd" : "#e8e8ee"}"/><text class="sans" x="0" y="118" font-size="40" font-weight="800" text-anchor="middle" fill="${k > 0.5 ? "#fff" : "#1c1c22"}">${k > 0.5 ? "Seguir" : "Seguindo ✓"}</text></g>`;
    const hx = lerp(820, 600, seg(t, S(8) + 1.2, S(8) + 1.9));
    o += `<g transform="translate(${hx} ${lerp(1200, 940, seg(t, S(8) + 1.2, S(8) + 1.9))})"><path d="M 0 0 L 0 80 L 22 62 L 38 98 L 52 92 L 36 56 L 64 56 Z" fill="#fff" stroke="#000" stroke-width="6" stroke-linejoin="round"/></g>`;
    o += txt("quem te faz se sentir menor", 540, 1140, 56, "#cfd8e3", seg(t, S(8) + 2.6, S(8) + 3.0));
  } else if (t < S(10) - 0.1) {
    // yesterday vs today
    const k = seg(t, S(9) + 1.4, S(9) + 2.6);
    o += txt("A ÚNICA COMPARAÇÃO", 540, 400, 80, CREAM, 1, pop(t, S(9)));
    o += `<g opacity="0.55">${cam(960, 480, 0.62, josephFront(t, { hR: [1060, 680], hL: [860, 680], face: { smile: 2 } }), 900).replace(`translate(540 900)`, `translate(310 900)`)}</g>`;
    o += cam(960, 480, 0.62 + 0.06 * k, josephFront(t, { hR: [1060, 680], hL: [860, 680], face: { smile: 10, look: [-8, 4] } }), 880).replace(`translate(540 880)`, `translate(770 880)`);
    o += txt("ONTEM", 310, 1180, 70, "#8f99a3") + txt("HOJE", 770, 1180, 80, GREEN, 1, pop(t, S(9) + 1.4)) + txt("+1%", 770, 600, 80, GREEN, k);
  } else if (t < S(11) - 0.1) {
    // he gives back the pieces
    const back = seg(t, S(10) + 0.4, E(10));
    o += scrollScene(t, { phone: null, hR: [1040, 610], hL: [880, 610], book: [960, 600], face: { smile: 11, look: [0, 8] } });
    o += jar(0.25 + 0.75 * back, t);
    for (let i = 0; i < 3; i++) { const k = seg(t, S(10) + 0.4 + i * 0.5, S(10) + 1.2 + i * 0.5); if (k > 0 && k < 1) o += heartOrb(lerp(260, JAR[0], k), lerp(820, JAR[1], k) - Math.sin(k * Math.PI) * 140, 1.5); }
    o += thief(lerp(260, -200, seg(t, S(10) + 1.8, E(10) + 0.3)), 820, 0.9, -1, 1, t, { sack: 0, shrug: 0.6, loot: PINK });
  } else {
    o += txt("PRÓXIMO LADRÃO?", 540, 400, 100, CREAM, 1, pop(t, S(11)));
    [["DA ENERGIA", -220], ["OUTRO?", 220]].forEach(([s, dx], i) => { const p = pop(t, S(11) + 0.5 + i * 0.4); if (p <= 0) return; o += thief(540 + dx, 860, 0.95 * p, i ? -1 : 1, 0.95, t + i, { look: 4 }) + txt("?", 540 + dx, 640, 100, PINK, p) + txt(s, 540 + dx, 1130, 56, PURPLE, p); });
    o += txt("comenta aqui 👇", 540, 1260, 64, CREAM, seg(t, S(11) + 1.6, S(11) + 2.0));
  }
  o += vignette();
  o += topTag("OS LADRÕES DO JOSEPH #3", PURPLE);
  o += capShort(t);
  o += endCard(t, E(11) + 0.3, "Segue pra ver o próximo ladrão");
  o += blackout(Math.max(1 - seg(t, 0, 0.2), seg(t, end - 0.3, end)));
  document.getElementById("frame").innerHTML = o;
}
const PHONE_SX = 540;
window.render = render;
