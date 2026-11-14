// SHORT 7 — OS LADRÕES DO JOSEPH #1: O LADRÃO DO FOCO
const REDC = "#e5484d", PURPLE = "#8b6ad8", FOC = "#4fd1ff", GOLDT = "#ffd27a";

// ---------- the thief (same design as O LADRÃO DAS 2 DA MANHÃ) ----------
function thief(x, y, sc, dir, alpha, t, opts = {}) {
  if (alpha <= 0) return "";
  const bob = Math.sin(t * 3) * 6;
  let o = `<g opacity="${alpha}" transform="translate(${x} ${y + bob}) scale(${sc * dir} ${sc})">`;
  o += `<ellipse cx="0" cy="40" rx="160" ry="200" fill="#6b4fa0" opacity="0.2" style="mix-blend-mode:screen"/>`;
  const fill = opts.sack || 0;
  o += `<g transform="translate(-70 -20) rotate(-12)"><path d="M -50 -40 Q -70 60 -20 80 Q 40 90 50 30 Q 40 -40 0 -50 Z" fill="#4a4258" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < fill; i++) o += `<circle cx="${-14 + (i % 3) * 16}" cy="${10 + Math.floor(i / 3) * 20}" r="10" fill="${FOC}" opacity="0.85"/>`;
  o += `<path d="M -10 -50 L 10 -70" stroke="${INK}" stroke-width="6"/></g>`;
  o += `<path d="M -20 90 Q -30 140 -18 180" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M -20 90 Q -30 140 -18 180" fill="none" stroke="#241c3a" stroke-width="14" stroke-linecap="round"/>`;
  o += `<path d="M 22 90 Q 30 140 34 176" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 22 90 Q 30 140 34 176" fill="none" stroke="#241c3a" stroke-width="14" stroke-linecap="round"/>`;
  o += `<path d="M -60 100 C -70 0 -50 -70 0 -80 C 50 -70 70 0 60 100 Z" fill="#241c3a" stroke="${INK}" stroke-width="7"/>`;
  const reach = opts.reach || 0, hx = lerp(55, 150, reach), hy = lerp(30, -110, reach);
  o += `<path d="M 40 -30 Q ${lerp(90, 110, reach)} ${lerp(20, -60, reach)} ${hx} ${hy}" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 40 -30 Q ${lerp(90, 110, reach)} ${lerp(20, -60, reach)} ${hx} ${hy}" fill="none" stroke="#241c3a" stroke-width="14" stroke-linecap="round"/>`;
  o += `<circle cx="${hx}" cy="${hy}" r="14" fill="#241c3a" stroke="${INK}" stroke-width="5"/>`;
  o += `<circle cx="0" cy="-120" r="62" fill="#241c3a" stroke="${INK}" stroke-width="7"/>`;
  o += `<path d="M -64 -134 Q 0 -150 64 -134 L 64 -106 Q 0 -120 -64 -106 Z" fill="#6b4fa0" stroke="${INK}" stroke-width="5"/>`;
  const look = opts.look || 0, sh = opts.shrug || 0;
  o += `<ellipse cx="${-22 + look}" cy="-122" rx="10" ry="${8 - 4 * sh}" fill="${GOLDT}"/><ellipse cx="${22 + look}" cy="-122" rx="10" ry="${8 - 4 * sh}" fill="${GOLDT}"/>`;
  o += `<ellipse cx="${-22 + look}" cy="-122" rx="22" ry="18" fill="${GOLDT}" opacity="0.25" style="mix-blend-mode:screen"/><ellipse cx="${22 + look}" cy="-122" rx="22" ry="18" fill="${GOLDT}" opacity="0.25" style="mix-blend-mode:screen"/>`;
  if (opts.grin) o += `<path d="M -26 -90 Q 0 -74 26 -90" fill="none" stroke="${GOLDT}" stroke-width="5" stroke-linecap="round"/>`;
  if (sh > 0) o += `<path d="M -30 -84 Q 0 ${-84 + 10 * sh} 30 -84" fill="none" stroke="${GOLDT}" stroke-width="5" stroke-linecap="round"/>`;
  return o + `</g>`;
}

// ---------- the FOCO jar (screen space) ----------
const JAR = [800, 520];
function jar(level, t, glow = 0) {
  const [x, y] = JAR, w = 210, h = 280;
  let o = `<g transform="translate(${x} ${y})">`;
  if (glow > 0) o += `<ellipse cx="0" cy="20" rx="200" ry="220" fill="${FOC}" opacity="${0.18 * glow}" style="mix-blend-mode:screen"/>`;
  o += `<clipPath id="jarIn"><rect x="${-w / 2 + 10}" y="${-h / 2 + 40}" width="${w - 20}" height="${h - 50}" rx="26"/></clipPath>`;
  o += `<rect x="${-w / 2}" y="${-h / 2 + 30}" width="${w}" height="${h - 30}" rx="34" fill="#1a2433" opacity="0.7" stroke="#cfe8f5" stroke-width="7"/>`;
  const lh = (h - 50) * cl(level), top = h / 2 - 10 - lh;
  o += `<g clip-path="url(#jarIn)"><rect x="${-w / 2}" y="${top + Math.sin(t * 3) * 3}" width="${w}" height="${lh + 20}" fill="${FOC}" opacity="0.85"/>`;
  for (let i = 0; i < 6; i++) { const k = (t * 0.4 + hash(i)) % 1; o += `<circle cx="${-60 + hash(i + 3) * 120}" cy="${h / 2 - 20 - k * lh}" r="${5 + hash(i + 5) * 6}" fill="#fff" opacity="${0.5 * (1 - k)}"/>`; }
  o += `</g><rect x="${-w / 2 - 12}" y="${-h / 2 + 4}" width="${w + 24}" height="40" rx="12" fill="#8a6d3b" stroke="#000" stroke-width="6"/>`;
  o += txt("FOCO", 0, h / 2 + 50, 64, FOC);
  return o + `</g>`;
}
const orb = (x, y, r, op = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${FOC}" stroke="#fff" stroke-width="4" opacity="${op}"/>`;

// study scene (world), night lamp; phone lying on the desk at world (1200, 632)
function study(t, q) {
  let w = roomBg(0.15, 0.25) + clockAt(1560, 250, 22 * 60 + t * 4);
  w += josephFront(t, Object.assign({ desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], phone: { pc: [1200, 632], held: 0, on: !!q.phoneOn } }, q));
  w += `<ellipse cx="760" cy="520" rx="420" ry="300" fill="url(#gLamp)" opacity="0.35" style="mix-blend-mode:screen"/>`;
  return cam(960, 560, 1.3, w, 1150);
}
const PHONE = [852, 1244];   // phone on the desk, in screen space
function notif(t, a) {
  const k = seg(t, a, a + 0.15) * (1 - seg(t, a + 1.1, a + 1.4));
  if (k <= 0) return "";
  return `<g opacity="${k}"><ellipse cx="${PHONE[0]}" cy="${PHONE[1] - 20}" rx="150" ry="80" fill="${FOC}" opacity="0.5" style="mix-blend-mode:screen"/><g transform="translate(${PHONE[0]} ${PHONE[1] - 120}) scale(${easeBack(seg(t, a, a + 0.3))})"><rect x="-90" y="-40" width="180" height="80" rx="40" fill="#fff" stroke="#000" stroke-width="5"/><circle cx="-50" cy="0" r="18" fill="${REDC}"/>${txt("plim!", 20, 0, 44, "#1c1c22", 1, 1)}</g></g>`;
}

function render(t) {
  const end = window.TL.duration;
  const steals = [S(3), S(4), S(4) + 2.0];
  const stolen = steals.filter(a => t > a + 1.6).length;
  let level = 1 - 0.27 * stolen;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(5) - 0.1) {
    // study night + thief from the phone + three thefts
    const distracted = steals.some(a => inR(t, a, a + 1.6));
    o += study(t, { phoneOn: distracted, face: distracted ? { look: [10, 9], browUp: 6, smile: 0, lid: 0 } : { look: [0, 9], smile: 3, lid: blink(t, 0.08) } });
    o += jar(level, t, 1);
    steals.forEach(a => { o += notif(t, a); });
    // thief: emerges from the phone at S(2), hovers, steals
    const appear = seg(t, S(2) + 0.4, S(2) + 1.6);
    let tx = lerp(PHONE[0], 300, appear), ty = lerp(PHONE[1], 600, appear), sc = lerp(0.15, 1.05, appear), reach = 0, sack = stolen, dir = 1, grin = 0;
    if (t < S(2) + 0.4) { tx = 300; ty = 600; sc = 1.05; }      // hook: already there, lurking
    for (const a of steals) if (inR(t, a, a + 2.4)) {
      const u = t - a;
      const k = u < 0.8 ? sm(u / 0.8) : u < 1.6 ? 1 : 1 - sm((u - 1.6) / 0.8);
      tx = lerp(300, JAR[0] - 230, k); ty = lerp(600, JAR[1] + 20, k);
      reach = inR(u, 0.7, 1.7) ? Math.sin(cl((u - 0.7) / 1.0) * Math.PI) : 0;
      if (inR(u, 1.1, 1.6)) { const q = (u - 1.1) / 0.5; o += orb(lerp(JAR[0], tx + 60, q), lerp(JAR[1] - 60, ty - 40, q), 22, 1); }
      grin = u > 1.6 ? 1 : 0;
    }
    const alpha = t < S(2) + 0.4 ? 0.75 + 0.15 * Math.sin(t * 4) : 1;
    o += thief(tx, ty, sc, dir, alpha, t, { reach, sack, grin, look: 6 });
    if (t > S(2) + 1.2 && t < S(3)) o += `<g transform="translate(300 330) scale(${pop(t, S(2) + 1.2)})"><rect x="-230" y="-40" width="460" height="80" rx="40" fill="#12151c" stroke="${PURPLE}" stroke-width="5"/>${txt("LADRÃO DO FOCO", 0, 0, 52, PURPLE)}</g>`;
    if (t < S(2) - 0.1) o += txt("TEM UM LADRÃO", 540, 380, 110, GOLDT, 1, pop(t, 0.2)) + txt("NO SEU QUARTO", 540, 500, 92, CREAM, 1, pop(t, 0.7));
  } else if (t < S(6) - 0.1) {
    // 23 minutes to come back
    o += txt("PRA VOLTAR AO FOCO:", 540, 420, 76, CREAM, 1, pop(t, S(5) + 2.4));
    const k = seg(t, S(5) + 3.6, E(5) + 0.3);
    o += timerFace(540, 820, 230, k, `${Math.round(23 * k)}`, FOC) + txt("min", 540, 940, 56, "#cfd8e3");
    o += txt("~23 MIN", 540, 1180, 120, GOLDT, 1, pop(t, S(5) + 5.0));
    o += txt("em média (pesquisa da UC Irvine)", 540, 1290, 44, "#8f99a3", seg(t, S(5) + 5.3, S(5) + 5.6));
  } else if (t < S(7) - 0.1) {
    // 1 hour with 10 pings: focus never recovers
    o += txt("1 HORA, 10 NOTIFICAÇÕES", 540, 420, 70, CREAM, 1, pop(t, S(6)));
    const x0 = 100, x1 = 980, yb = 1150, yt = 650, k = seg(t, S(6) + 0.3, E(6));
    let d = `M ${x0} ${yb}`;
    for (let i = 0; i <= 200 * k; i++) {
      const u = i / 200, ph = (u * 10) % 1, f = 1 - Math.exp(-ph * 1.6);
      d += ` L ${lerp(x0, x1, u)} ${lerp(yb, yt, f * 0.55)}`;
    }
    o += `<line x1="${x0}" y1="${yt}" x2="${x1}" y2="${yt}" stroke="${GREEN}" stroke-width="5" stroke-dasharray="18 12"/>` + txt("foco total", 860, yt - 40, 44, GREEN);
    o += `<path d="${d}" fill="none" stroke="#000" stroke-width="18" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${FOC}" stroke-width="9" stroke-linejoin="round"/>`;
    for (let i = 1; i < 10; i++) if (i / 10 < k) o += `<circle cx="${lerp(x0, x1, i / 10)}" cy="${yb + 40}" r="14" fill="${REDC}"/>`;
    o += `<line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="#5a6170" stroke-width="5"/>`;
    o += txt("nunca chega lá", 540, 1290, 70, REDC, seg(t, E(6) - 1.4, E(6) - 1.0));
  } else if (t < S(8) - 0.1) {
    // 3 hours studied, 2 stolen
    const k = seg(t, S(7) + 2.0, S(7) + 3.0);
    o += txt("3 HORAS ESTUDANDO?", 540, 420, 80, CREAM, 1, pop(t, S(7)));
    const r = 260, cx = 540, cy = 830, a = k * (2 / 3) * 2 * Math.PI;
    o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${FOC}" stroke="#000" stroke-width="8"/>`;
    if (k > 0) o += `<path d="M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${cx + Math.sin(a) * r} ${cy - Math.cos(a) * r} Z" fill="#241c3a" stroke="#000" stroke-width="8"/>`;
    o += txt("2H ROUBADAS", 540, 1190, 100, REDC, 1, pop(t, S(7) + 2.6));
    o += thief(860, 640, 0.6, -1, seg(t, S(7) + 2.2, S(7) + 2.6), t, { sack: 6, grin: 1 });
  } else if (t < S(10) - 0.1) {
    // weak spot: the door; three locks
    o += study(t, { face: { look: [0, 9], smile: 4, lid: blink(t, 0.06) } });
    o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="0.6"/>`;
    o += txt("PONTO FRACO:", 540, 400, 90, GOLDT, 1, pop(t, S(8)));
    o += txt("a porta aberta", 540, 520, 76, CREAM, seg(t, S(8) + 1.6, S(8) + 1.9));
    const items = [[S(9), "NÃO PERTURBE", ICON.moon(GOLDT)], [S(9) + 1.7, "CELULAR EM OUTRO CÔMODO", ICON.phone(FOC)], [S(9) + 3.6, "NOTIFICAÇÕES OFF", ICON.cross(REDC)]];
    items.forEach(([a, s, ic], i) => { const p = pop(t, a); if (p > 0) o += `<g transform="translate(540 ${700 + i * 210}) scale(${p})"><rect x="-460" y="-80" width="920" height="160" rx="40" fill="#12151c" stroke="${GREEN}" stroke-width="6"/><g transform="translate(-370 0) scale(0.8)">${ic}</g>${txt(s, 70, 0, s.length > 16 ? 50 : 62, CREAM)}</g>`; });
  } else if (t < S(11) - 0.1) {
    // locked: thief arrives, no phone, shrugs and leaves; jar refills
    const back = seg(t, S(10) + 2.4, E(10) + 0.4);
    level = lerp(1 - 0.27 * 3, 1, back);
    o += study(t, { phone: null, face: { look: [0, 9], smile: 9, lid: blink(t, 0.05), browAng: 0.3 } });
    o += jar(level, t, 1);
    const a = S(10);
    const x = kf(t, [[a, -150], [a + 1.4, 300], [a + 2.6, 300], [E(10) + 0.4, -200]]);
    const sh = seg(t, a + 1.4, a + 1.8) * (1 - seg(t, a + 2.6, a + 3.0));
    o += thief(x, 640, 1.0, t > a + 2.6 ? -1 : 1, 1, t, { shrug: sh, look: Math.sin(t * 3) * 10 });
    if (sh > 0.5) o += txt("?", 300, 380, 110, GOLDT, sh);
    o += `<g transform="translate(${PHONE[0]} ${PHONE[1] - 140}) scale(${pop(t, a + 0.3)})"><rect x="-120" y="-44" width="240" height="88" rx="44" fill="#12151c" stroke="${GREEN}" stroke-width="5"/>${txt("SEM CELULAR", 0, 0, 40, GREEN)}</g>`;
  } else {
    // next thief? lineup of silhouettes
    o += txt("QUAL LADRÃO", 540, 400, 100, CREAM, 1, pop(t, S(11)));
    o += txt("VEM AGORA?", 540, 520, 100, GOLDT, 1, pop(t, S(11) + 0.4));
    const L = [["DO TEMPO", -300], ["DA AUTOESTIMA", 0], ["DA ENERGIA", 300]];
    L.forEach(([s, dx], i) => { const p = pop(t, S(11) + 0.8 + i * 0.3); if (p <= 0) return; o += thief(540 + dx, 900, 0.85 * p, i % 2 ? -1 : 1, 0.9, t + i, { look: 4 }) + txt("?", 540 + dx, 690, 90, GOLDT, p) + txt(s, 540 + dx, 1160 + (i === 1 ? 60 : 0), 44, PURPLE, p); });
    o += txt("comenta aqui 👇", 540, 1290, 64, CREAM, seg(t, S(11) + 2.0, S(11) + 2.4));
  }
  o += vignette();
  o += topTag("OS LADRÕES DO JOSEPH #1", PURPLE);
  o += capShort(t);
  o += endCard(t, E(11) + 0.4, "Segue pra ver o próximo ladrão");
  o += blackout(Math.max(1 - seg(t, 0, 0.2), seg(t, end - 0.3, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
