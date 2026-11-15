// SHORT 12 — série O DESAFIO DE 30 DIAS · EP 1 (dias 1 a 3) — termina em cliffhanger
const REDC = "#e5484d", PEACE = "#30a46c", FOC = "#4fd1ff";

// ---------- status panel (shared look for the whole series) ----------
function stats(t) {
  const ans = kf(t, [[0, 0.5], [S(4), 0.55], [S(5), 0.4], [S(6), 0.7], [S(7), 0.6], [S(8), 0.92], [S(10), 0.95], [S(10) + 4, 0.5]]);
  const foc = kf(t, [[0, 0.3], [S(5), 0.4], [S(6), 0.35], [S(8), 0.3], [S(10), 0.3]]);
  const paz = kf(t, [[0, 0.3], [S(4), 0.25], [S(5), 0.55], [S(6), 0.35], [S(8), 0.15], [S(10), 0.15]]);
  return { ans, foc, paz };
}
function dayOf(t) { return t < S(6) - 0.3 ? 1 : t < S(8) - 0.3 ? 2 : t < S(10) + 3.6 ? 3 : 4; }
function hud(t) {
  const d = dayOf(t), st = stats(t), flash = [S(6) - 0.3, S(8) - 0.3, S(10) + 3.6].some(a => inR(t, a, a + 0.5));
  let o = `<g transform="translate(60 300)"><rect width="960" height="190" rx="30" fill="#07080b" opacity="0.88" stroke="${flash ? GOLD : "#2a3140"}" stroke-width="5"/>`;
  o += `<text class="hand" x="40" y="80" font-size="44" fill="#8f99a3">DIA</text><text class="hand" x="40" y="160" font-size="${d === 4 ? 96 : 96}" fill="${d === 4 ? GOLD : CREAM}">${d === 4 ? "4?" : d}<tspan font-size="44" fill="#8f99a3">/30</tspan></text>`;
  [["ANSIEDADE", st.ans, REDC], ["FOCO", st.foc, FOC], ["PAZ", st.paz, PEACE]].forEach(([lab, v, c], i) => {
    const y = 40 + i * 50;
    o += `<text class="hand" x="290" y="${y + 22}" font-size="32" fill="${c}">${lab}</text><rect x="480" y="${y}" width="440" height="30" rx="15" fill="#1a1f29"/><rect x="480" y="${y}" width="${440 * cl(v)}" height="30" rx="15" fill="${c}"/>`;
  });
  o += `</g>`;
  // 30-day strip
  for (let i = 0; i < 30; i++) { const done = i < d - 1 || (i === d - 1 && d < 4); o += `<rect x="${60 + i * 32}" y="510" width="26" height="26" rx="6" fill="${i === 2 && t > S(9) + 2.4 && t < S(10) ? REDC : done ? GOLD : "#1a1f29"}" stroke="#000" stroke-width="2"/>`; }
  return o;
}
function room(t, inner, day = 0.8, warm = 0.2, sy = 1240, s = 1.2) { return cam(960, 560, s, roomBg(day, warm) + inner, sy); }
function banner(t, a, s, col) { const p = pop(t, a); return p > 0 && t < a + 2.2 ? `<g transform="translate(540 760) scale(${p})" opacity="${1 - seg(t, a + 1.8, a + 2.2)}"><rect x="-260" y="-80" width="520" height="160" rx="30" fill="#07080b" stroke="${col}" stroke-width="8"/>${txt(s, 0, 0, 100, col)}</g>` : ""; }

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(2) - 0.1) {
    // the decision (night before)
    o += room(t, clockAt(1560, 250, 22 * 60 + 30) + josephFront(t, { desk: true, book: [960, 600], hR: [1040 + Math.sin(t * 8) * 6, 610], hL: [880, 610], face: { look: [0, 9], smile: 4, browAng: 0.6 } }), 0.2, 0.3);
    o += `<g transform="translate(540 760) rotate(-3) scale(${pop(t, 0.1)})"><rect x="-400" y="-110" width="800" height="220" rx="14" fill="#f6f1e6" stroke="#000" stroke-width="7"/>${txt("30 DIAS SEM CELULAR", 0, -38, 64, "#1c1c22", 1, 1)}<text class="hand" x="0" y="50" font-size="48" text-anchor="middle" fill="#8a6d3b">na 1ª hora do dia</text></g>`;
  } else if (t < S(4) - 0.1) {
    const stop = t > S(3) - 0.1;
    const reach = seg(t, S(2) + 2.4, S(2) + 3.6) * (stop ? 1 - seg(t, S(3), S(3) + 0.5) : 1);
    const hR = lerp2([1060, 660], [1240, 620], reach);
    const stand = `<rect x="1190" y="640" width="220" height="260" fill="#3a2f28" stroke="${INK}" stroke-width="7"/>` + (t < S(3) + 1.6 ? phoneBody([1270, 632], 0, t) + `<ellipse cx="1270" cy="610" rx="90" ry="40" fill="url(#gPhone)" opacity="${0.6 + 0.4 * Math.sin(t * 9)}"/>` : "");
    o += room(t, josephFront(t, { blanket: true, hR, face: { lid: t < S(2) + 1.6 ? 1 : 0.3, look: [10, 4], smile: stop ? 2 : 0, browAng: stop ? 0.8 : 0 } }) + stand + `<g transform="translate(700 330)">${clockAt(0, 0, 6 * 60 + 30)}</g>`, 0.6, 0.3);
    if (stop) {
      o += `<g transform="translate(820 820) scale(${pop(t, S(3))})"><path d="M -70 -170 L 70 -170 L 170 -70 L 170 70 L 70 170 L -70 170 L -170 70 L -170 -70 Z" transform="scale(0.55)" fill="${REDC}" stroke="#fff" stroke-width="10"/>${txt("PARA", 0, 0, 52, "#fff", 1, 1)}</g>`;
      if (t > S(3) + 1.4) o += `<g transform="translate(400 660) rotate(-6) scale(${pop(t, S(3) + 1.6)})"><rect x="-230" y="-60" width="460" height="120" rx="12" fill="none" stroke="${GOLD}" stroke-width="10"/>${txt("REGRA É REGRA", 0, 0, 56, GOLD)}</g>`;
    }
  } else if (t < S(5) - 0.1) {
    // strange silence
    o += room(t, josephFront(t, { desk: true, hR: [1040, 640], hL: [880, 640], face: { look: [Math.sin(t * 1.5) * 12, 2], smile: -1, browUp: 4 } }), 0.85, 0.3);
    for (let i = 0; i < 3; i++) { const k = ((t - S(4)) * 0.5 + i / 3) % 1; o += `<circle cx="540" cy="1000" r="${120 + k * 300}" fill="none" stroke="#cfd8e3" stroke-width="4" opacity="${0.4 * (1 - k)}"/>`; }
    o += txt("silêncio...", 540, 760, 80, "#cfd8e3", seg(t, S(4) + 1.6, S(4) + 2.0));
  } else if (t < S(6) - 0.3) {
    // coffee at the window
    let w = josephFront(t, { hR: [1080, 560], hL: [860, 650], face: { smile: 9, look: [-12, -2], lid: blink(t, 0.08) } });
    w += `<g transform="translate(1080 520)"><rect x="-34" y="-40" width="68" height="76" rx="10" fill="#fff" stroke="#000" stroke-width="6"/><path d="M 34 -20 q 26 0 26 20 q 0 20 -26 20" fill="none" stroke="#000" stroke-width="6"/><path d="M -12 -56 q 10 -20 0 -40 M 12 -56 q 10 -20 0 -40" stroke="#cfd8e3" stroke-width="5" fill="none" opacity="${0.5 + 0.5 * Math.sin(t * 3)}"/></g>`;
    o += room(t, w, 1, 0.9);
    o += txt("há anos não fazia isso", 540, 760, 60, GOLD, seg(t, S(5) + 2.0, S(5) + 2.4));
  } else if (t < S(8) - 0.3) {
    o += room(t, josephFront(t, { desk: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { look: [12, -4], smile: -3, browSad: 0.6, browUp: 4 } }), 0.85, 0.2);
    if (t < S(7) - 0.1) {
      o += `<g transform="translate(560 830) scale(${pop(t, S(6) + 2.0)})"><ellipse rx="380" ry="120" fill="#f4efe6" stroke="#000" stroke-width="7"/><text class="hand" x="0" y="-8" font-size="44" text-anchor="middle" fill="#1c1c22">e se alguém mandou</text><text class="hand" x="0" y="50" font-size="44" text-anchor="middle" fill="${REDC}">mensagem importante?</text></g>`;
    } else {
      o += `<g transform="translate(830 840) scale(${0.8 * pop(t, S(7))})"><rect x="-150" y="-230" width="300" height="460" rx="40" fill="#14161a" stroke="#000" stroke-width="8"/><rect x="-128" y="-200" width="256" height="400" rx="20" fill="#f2f2f5"/><text class="sans" x="0" y="-140" font-size="26" font-weight="800" text-anchor="middle" fill="#1c1c22">Notificações</text><text class="sans" x="0" y="20" font-size="30" font-weight="700" text-anchor="middle" fill="#8a8a95">Nenhuma</text><text class="sans" x="0" y="60" font-size="30" font-weight="700" text-anchor="middle" fill="#8a8a95">mensagem nova</text></g>`;
    }
    o += banner(t, S(6) - 0.3, "DIA 2", GOLD);
  } else if (t < S(10) - 0.1) {
    // day 3: the worst; "most people quit here"
    const tick = Math.floor((t - S(8)) * 3);
    o += room(t, josephFront(t, { desk: true, hR: [1040 + Math.sin(t * 12) * 8, 640], hL: [880, 640], face: { look: [10, 0], smile: -7, browAng: 1, lid: 0.15 } }), 0.75, 0.1);
    o += `<g transform="translate(830 930)"><rect x="-160" y="-60" width="320" height="120" rx="20" fill="#07080b" stroke="${REDC}" stroke-width="6"/><text class="sans" x="0" y="24" font-size="66" font-weight="800" text-anchor="middle" fill="${REDC}">07:${String(10 + (tick % 50)).padStart(2, "0")}</text></g>`;
    if (t > S(9) - 0.1) o += `<g transform="translate(300 780) scale(${pop(t, S(9) + 2.4)})"><rect x="-230" y="-70" width="460" height="140" rx="24" fill="#07080b" stroke="${REDC}" stroke-width="6"/>${txt("AQUI A MAIORIA", 0, -24, 46, CREAM)}${txt("DESISTE", 0, 34, 54, REDC)}</g>`;
    o += banner(t, S(8) - 0.3, "DIA 3", REDC);
  } else {
    // almost quits... then DAY 4: cliffhanger
    const cliff = seg(t, S(10) + 3.6, S(10) + 4.2);
    if (cliff < 1) {
      const walk = seg(t, S(10) + 0.4, S(10) + 3.4);
      o += `<g opacity="${1 - cliff}">` + room(t, `<rect x="1380" y="380" width="260" height="480" fill="#6b4a33" stroke="${INK}" stroke-width="8"/><circle cx="1420" cy="620" r="12" fill="${GOLD}"/>` + josephFront(t, { hR: lerp2([1060, 660], [1300, 560], walk), hL: [860, 660], face: { look: [12, 2], smile: -4, browSad: 0.6 } }), 0.6, 0.1, 1240, 1.1).replace("translate(540 1240)", `translate(${540 - walk * 120} 1240)`) + `</g>`;
    }
    if (cliff > 0) {
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="${cliff * 0.9}"/>`;
      o += `<g opacity="${cliff}"><rect x="340" y="640" width="400" height="600" fill="#05060a" stroke="#3a2a20" stroke-width="10"/><rect x="350" y="1220" width="380" height="14" fill="${GOLD}" opacity="${0.6 + 0.4 * Math.sin(t * 5)}"/><ellipse cx="540" cy="1240" rx="260" ry="40" fill="${GOLD}" opacity="${0.25 + 0.15 * Math.sin(t * 5)}" style="mix-blend-mode:screen"/></g>`;
      o += txt("DIA 4", 540, 760, 130, GOLD, cliff, pop(t, S(10) + 3.8)) + txt("?", 540, 950, 160, CREAM, seg(t, S(10) + 4.6, S(10) + 5.0));
      if (t > S(11) - 0.1) o += `<g transform="translate(540 1120) scale(${pop(t, S(11))})"><rect x="-300" y="-60" width="600" height="120" rx="60" fill="#12151c" stroke="${GOLD}" stroke-width="6"/>${txt("EP 2 EM BREVE", 0, 0, 62, GOLD)}</g>`;
    }
  }
  o += hud(t);
  o += vignette();
  o += topTag("DESAFIO 30 DIAS · EP 1", GOLD);
  o += capShort(t);
  o += endCard(t, E(11) + 0.2, "Segue pra ver o EP 2");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
