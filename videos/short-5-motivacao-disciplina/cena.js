// SHORT 5 — MOTIVAÇÃO × DISCIPLINA
const REDC = "#e5484d", FLAME = "#ff9f1c";
const FLAME_DEFS = `<defs><linearGradient id="gFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe066"/><stop offset="60%" stop-color="#ff9f1c"/><stop offset="100%" stop-color="#ff5d2e"/></linearGradient>` +
  `<radialGradient id="gGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffb347" stop-opacity="0.9"/><stop offset="100%" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>`;

// the flame character (from DISCIPLINA)
function drawFlame(F, t) {
  if (!F || F.size <= 0.01) return "";
  const s = F.size, flick = Math.sin(t * 17) * 6 + Math.sin(t * 29) * 3 + (F.sputter ? Math.sin(t * 41) * 10 : 0);
  let o = `<g transform="translate(${F.x} ${F.y}) scale(${s})">`;
  o += `<ellipse cx="0" cy="0" rx="150" ry="150" fill="url(#gGlow)" opacity="${0.55 * F.bright}" style="mix-blend-mode:screen"/>`;
  if (F.cheer) {
    const w = Math.sin(t * 14) * 18;
    for (const sg of [-1, 1]) o += `<path d="M ${36 * sg} 10 Q ${66 * sg} ${-20 + w * sg} ${70 * sg} ${-50 + w * sg}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M ${36 * sg} 10 Q ${66 * sg} ${-20 + w * sg} ${70 * sg} ${-50 + w * sg}" fill="none" stroke="${FLAME}" stroke-width="7" stroke-linecap="round"/>`;
  }
  const tip = -95 + flick;
  o += `<path d="M ${flick * 0.6} ${tip} C 30 -50 50 -10 48 22 A 48 48 0 0 1 -48 22 C -50 -10 -28 -50 ${flick * 0.6} ${tip} Z" fill="url(#gFlame)" stroke="${INK}" stroke-width="6" opacity="${cl(F.bright)}"/>`;
  o += `<path d="M ${flick * 0.3} ${tip + 50} C 16 -20 24 0 22 22 A 22 22 0 0 1 -22 22 C -24 0 -12 -20 ${flick * 0.3} ${tip + 50} Z" fill="#fff3b0" opacity="${0.8 * cl(F.bright)}"/>`;
  const ey = 8;
  if (F.mood === "happy") {
    o += `<path d="M -22 ${ey} q 8 -10 16 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M 6 ${ey} q 8 -10 16 0" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
    o += `<path d="M -16 ${ey + 14} Q 0 ${ey + 36} 16 ${ey + 14} Z" fill="#7a1f12" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
  } else {
    const droop = F.mood === "sad" ? 1 : 0.5;
    o += `<circle cx="-13" cy="${ey}" r="5" fill="${INK}"/><circle cx="13" cy="${ey}" r="5" fill="${INK}"/>`;
    o += `<line x1="-22" y1="${ey - 6 - 4 * droop}" x2="-6" y2="${ey - 9 + 3 * droop}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><line x1="22" y1="${ey - 6 - 4 * droop}" x2="6" y2="${ey - 9 + 3 * droop}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
    o += `<path d="M -10 ${ey + 24} Q 0 ${ey + 24 - 8 * droop} 10 ${ey + 24}" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`;
  }
  if (F.sputter) for (let i = 0; i < 3; i++) { const k = ((t * 0.8 + i / 3) % 1); o += `<circle cx="${-20 + i * 20 + Math.sin(t * 3 + i) * 10}" cy="${-90 - k * 80}" r="${8 + k * 14}" fill="#c9d1d9" opacity="${0.5 * (1 - k)}"/>`; }
  return o + `</g>`;
}
function smoke(x, y, t, a) {
  let o = "";
  for (let i = 0; i < 5; i++) { const k = cl((t - a - i * 0.15) / 1.6); if (k <= 0 || k >= 1) continue; o += `<circle cx="${x + Math.sin(i * 2 + t * 2) * 20}" cy="${y - k * 220}" r="${14 + k * 40}" fill="#9aa3ad" opacity="${0.6 * (1 - k)}"/>`; }
  return o;
}

// running: speed table (world px/s), integrated for distance and stride phase
let SPEED = null;
function speedTable() {
  return [[0, 0], [S(3) - 0.3, 0], [S(3), 560], [S(4), 520], [S(4) + 1.2, 260], [S(5) + 0.8, 0], [S(8) - 0.1, 0], [S(8) + 0.5, 600],
    [S(8) + 2.0, 600], [S(8) + 2.5, 230], [S(8) + 3.4, 230], [S(8) + 3.9, 600], [99, 600]];
}
function runState(t) {
  SPEED = SPEED || speedTable();
  let dist = 0, phase = 0;
  const dt = 1 / 60;
  for (let u = 0; u < t; u += dt) { const v = kf(u, SPEED); dist += v * dt; phase += (v > 1 ? v / 250 : 0) * 2 * Math.PI * dt; }
  const v = kf(t, SPEED);
  return { dist, phase, v, gait: cl(v / 300) };
}
function street(t, q) {
  const R = runState(t);
  const P = Object.assign({ x: 960, dir: 1, groundY: 840, gait: R.gait, phase: R.phase, lean: R.v > 300 ? 9 : 2, look: [6, 0], lid: blink(t, 0.08), browUp: 0, browAng: 0, browSad: 0, pant: 0, smile: 4 }, q.P || {});
  let w = streetBg(R.dist);
  if (q.rain > 0) w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#1c2738" opacity="${0.62 * q.rain}"/>`;
  if (q.sunset > 0) w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#ff8a3d" opacity="${0.18 * q.sunset}" style="mix-blend-mode:screen"/>`;
  w += sidePerson(P, t);
  if (q.F) w += drawFlame(q.F, t);
  if (q.smokeAt) w += smoke(q.F0x || 820, 420, t, q.smokeAt);
  let o = cam(960, 580, 1.25, w, 1130);
  o += rainV(t, q.rain || 0, 90);
  return o;
}

function render(t) {
  const end = window.TL.duration;
  let o = FLAME_DEFS + plainBg();
  if (t < S(2) - 0.1) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0b10"/>`;
    o += drawFlame({ x: 540, y: 880, size: 3.4 * pop(t, 0.3, 0.5), bright: 1, mood: "happy", cheer: true }, t);
    o += txt("MOTIVAÇÃO", 540, 470, 140, FLAME, 1, pop(t, 0.9));
  } else if (t < S(3) - 0.1) {
    const F = { x: 1230, y: 330 + Math.sin(t * 4) * 12, size: 0.9, bright: 1, mood: "happy", cheer: true };
    o += cam(960, 560, 1.3, roomBg(0.15, 0.2) + clockAt(1560, 250, 22 * 60 + t * 3) + josephFront(t, { desk: true, book: [960, 600], hR: [1040 + Math.sin(t * 8) * 8, 610], hL: [880, 610], face: { smile: 12, browUp: 8, look: [0, 8] } }) + drawFlame(F, t), 1150);
    o += txt("DOMINGO, 22H", 540, 440, 90, CREAM, 1, pop(t, S(2)));
    o += `<g transform="translate(540 620) rotate(-4) scale(${pop(t, S(2) + 1.9)})"><rect x="-370" y="-70" width="740" height="140" rx="12" fill="#ffe8a3" stroke="#000" stroke-width="6"/>${txt("SEGUNDA EU COMEÇO!", 0, 0, 64, "#3a2a10", 1, 1, 'stroke-width="0"')}</g>`;
  } else if (t < S(9) - 0.1) {
    // the street: Mon, Tue, Wed (rain), flame dies, Joseph stops; discipline: runs anyway
    const tue = t > S(3) + 2.7;
    const rain = seg(t, S(4) - 0.4, S(4) + 0.6) * (1 - seg(t, S(10), S(10) + 2.0));
    let F = null;
    if (t < S(5) + 0.6) {
      const size = t < S(3) + 2.7 ? 1.0 : t < S(4) ? 0.7 : lerp(0.7, 0.35, seg(t, S(4), S(5)));
      F = { x: 760 + Math.sin(t * 3) * 10, y: 380 + Math.sin(t * 5) * 10, size: size * (1 - seg(t, S(5) + 0.2, S(5) + 0.6)), bright: rain > 0.3 ? 0.6 : 1, mood: rain > 0.3 ? "sad" : "happy", cheer: rain < 0.3, sputter: rain > 0.3 };
    }
    const stopped = t > S(5) + 0.6 && t < S(8);
    const det = t > S(7);
    const P = stopped ? { look: det ? [8, -2] : [4, 10], browSad: det ? 0 : 1, browAng: det ? 1 : 0, smile: det ? 0 : -6, lid: det ? 0.1 : 0.35 } : t > S(8) ? { browAng: 0.8, smile: 2, pant: R_pant(t) } : {};
    o += street(t, { rain, F, smokeAt: S(5) + 0.3, P });
    let lab = null, col = CREAM, la = 0;
    if (t < S(4) - 0.1) { lab = tue ? "TERÇA" : "SEGUNDA"; la = tue ? S(3) + 2.7 : S(3); col = tue ? GOLD : GREEN; }
    else if (t < S(5) - 0.1) { lab = "QUARTA"; la = S(4); col = ACC; }
    else if (t < S(6) - 0.1) { lab = "APAGOU."; la = S(5); col = "#8f99a3"; }
    else if (t < S(7) - 0.1) { lab = "PAROU."; la = S(6) + 0.6; col = REDC; }
    else if (t < S(8) - 0.1) { lab = "DISCIPLINA"; la = S(7); col = GREEN; }
    if (lab) o += txt(lab, 540, 470, 130, col, 1, pop(t, la));
    if (t > S(8) - 0.1) {
      const st = [["CHOVENDO? VAI.", S(8) + 0.2], ["CANSADO? MAIS DEVAGAR.", S(8) + 1.9], ["MAS VAI.", S(8) + 3.8]];
      st.forEach(([s, a], i) => { if (t > a) o += txt(s, 540, 400 + i * 110, s.length > 15 ? 64 : 92, i === 2 ? GREEN : CREAM, 1, pop(t, a)); });
    }
  } else if (t < S(10) - 0.1) {
    o += `<rect width="${SW}" height="${SH}" fill="#0a0b10"/>`;
    o += drawFlame({ x: 260, y: 620, size: 1.4 * pop(t, S(9)), bright: 1, mood: "happy" }, t);
    o += txt("MOTIVAÇÃO", 650, 560, 76, FLAME, 1, pop(t, S(9) + 0.1)) + txt("te faz COMEÇAR", 650, 660, 60, CREAM, seg(t, S(9) + 0.6, S(9) + 0.9));
    const P = { x: 260, dir: 1, groundY: 1220, gait: 1, phase: t * 13, lean: 9, look: [6, 0], lid: 0.08, browUp: 0, browAng: 0.6, browSad: 0, pant: 0, smile: 4 };
    o += `<g opacity="${seg(t, S(9) + 1.8, S(9) + 2.1)}">${`<g transform="translate(260 1080) scale(0.75) translate(-260 -1080)">${sidePerson(P, t)}</g>`}</g>`;
    o += txt("DISCIPLINA", 650, 1000, 76, GREEN, 1, pop(t, S(9) + 1.8)) + txt("te faz CONTINUAR", 650, 1100, 60, CREAM, seg(t, S(9) + 2.4, S(9) + 2.7));
  } else {
    o += street(t, { rain: 1 - seg(t, S(10), S(10) + 2.0), sunset: seg(t, S(10) + 0.5, S(10) + 2.5), P: { browAng: 0.6, smile: 6 } });
    o += txt("VAI MESMO ASSIM.", 540, 470, 100, GREEN, 1, pop(t, S(10) + 1.6));
  }
  o += vignette();
  o += topTag("MOTIVAÇÃO × DISCIPLINA", FLAME);
  o += capShort(t);
  o += endCard(t, E(10) + 0.5, "Segue pra mais disciplina");
  o += blackout(Math.max(1 - seg(t, 0, 0.3), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
const R_pant = t => (t > S(8) + 1.9 && t < S(8) + 3.8) ? 0.6 : 0;
window.render = render;
