// SHORT 15 — A MÃE DO JOSEPH: 20 minutos às 05:40 (público adulto 35–44)
const REDC = "#e5484d", BERRY = "#d1588a";
const MOM = { skin: "#b07a52", skinD: "#946243", hood: "#a8466b", hoodD: "#83334f", hair: "#1f1410", style: "curly" };
function momFront(t, f = {}, x = 960, extra = "") {
  const P = Object.assign({ x, c: MOM }, face(Object.assign({ lid: blink(t, 0.06) }, f)));
  let o = personBack(P) + extra + personHead(P, t);
  for (const ex of [884, 1036]) o += `<circle cx="${ex + x - 960}" cy="${432 + P.bob}" r="9" fill="${GOLD}" stroke="${INK}" stroke-width="3"/>`;
  return o;
}
function pill(t, a, s, col, y, size = 64, x = 540) { const p = pop(t, a); if (p <= 0) return ""; const w = s.length * size * 0.52 + 90; return `<g transform="translate(${x} ${y}) scale(${p})"><rect x="${-w / 2}" y="${-size * 0.85}" width="${w}" height="${size * 1.7}" rx="${size * 0.85}" fill="#07080b" opacity="0.92" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, size, col)}</g>`; }
const room = (t, inner, day = 0.8, warm = 0.2, sy = 1240, s = 1.2) => cam(960, 560, s, roomBg(day, warm) + inner, sy);

// walking street at dawn: brightness 0 (night) … 1 (sunrise)
function walk(t, light, who = "mom", q = {}) {
  const dist = t * 220;
  let w = streetBg(dist);
  w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#0d1226" opacity="${0.88 * (1 - light)}"/>`;
  if (light > 0.5) w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#ff8a3d" opacity="${0.15 * (light - 0.5) * 2}" style="mix-blend-mode:screen"/>`;
  const base = { dir: 1, groundY: 840, gait: 0.55, phase: t * 5.6, lean: 5, look: [6, 0], lid: blink(t, 0.08), browUp: 0, browAng: 0.3, browSad: 0, pant: 0, smile: q.smile || 6 };
  if (who === "both") w += sidePerson(Object.assign({}, base, { x: 1140, phase: t * 5.6 + 1.4 }), t);
  w += sidePerson(Object.assign({}, base, { x: who === "both" ? 820 : 960, c: MOM, bun: true }), t);
  return cam(960, 580, 1.25, w, 1130);
}

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#121726", "#07080b");
  if (t < S(2) - 0.2) {
    o += room(t, momFront(t, { smile: 2, look: [0, 6], bags: 0.6 }), 0.8, 0.2);
    o += pill(t, S(1) + 2.4, "TRABALHO", "#4fd1ff", 700, 56, 320) + pill(t, S(1) + 3.6, "CASA", GOLD, 700, 56, 780);
    o += pill(t, S(1) + 4.6, "TEMPO PRA ELA: 0 MIN", REDC, 860, 58);
  } else if (t < S(3) - 0.2) {
    const blanket = `<path d="M 480 1500 L 480 660 Q 960 600 1440 660 L 1440 1500 Z" fill="#6a4a7a" stroke="${INK}" stroke-width="7"/>`;
    o += room(t, momFront(t, { look: [0, -8], smile: -2, lid: 0.35 }, 960, "") + blanket, 0.05, 0);
    const pages = Math.min(3, Math.floor((t - S(2) - 2.4) / 0.9) + 1);
    o += `<g transform="translate(540 720) scale(${pop(t, S(2) + 0.3)})"><rect x="-340" y="-70" width="680" height="140" rx="40" fill="#fff" stroke="#000" stroke-width="7"/><text class="hand" x="0" y="20" font-size="58" text-anchor="middle" fill="${INK}">"amanhã eu começo"</text></g>`;
    for (let i = 0; i < pages; i++) o += `<g transform="translate(${300 + i * 240} 1720) rotate(${-6 + i * 6})"><rect x="-100" y="-90" width="200" height="180" rx="12" fill="#f6f1e6" stroke="#000" stroke-width="6"/><rect x="-100" y="-90" width="200" height="50" rx="12" fill="${REDC}"/><text class="hand" x="0" y="34" font-size="40" text-anchor="middle" fill="${INK}">AMANHÃ</text></g>`;
  } else if (t < S(4) - 0.2) {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += txt("TEMPO QUE SOBRA", 540, 720, 80, "#8f99a3", seg(t, S(3) + 1.2, S(3) + 1.6));
    o += txt("= 0", 540, 840, 110, REDC, 1, pop(t, S(3) + 2.2));
    o += txt("TEMPO A GENTE", 540, 1080, 84, CREAM, 1, pop(t, S(3) + 3.2)) + txt("GUARDA.", 540, 1210, 130, GOLD, 1, pop(t, S(3) + 3.8));
  } else if (t < S(5) - 0.2) {
    o += walk(t, 0.05);
    o += pill(t, S(4) - 0.1, "05:40", BERRY, 420, 90);
    o += txt("casa dormindo", 540, 560, 56, "#cfd8e3", seg(t, S(4) + 1.6, S(4) + 2.0));
    o += pill(t, S(4) + 3.2, "20 MIN SÓ DELA", GOLD, 1680, 60);
  } else if (t < S(5) + 2.2) {
    const blanket = `<path d="M 480 1500 L 480 700 Q 960 640 1440 700 L 1440 1500 Z" fill="#6a4a7a" stroke="${INK}" stroke-width="7"/>`;
    o += room(t, momFront(t, { lid: 0.6, smile: -2, look: [0, 4] }) + blanket + clockAt(1500, 300, 5 * 60 + 40), 0.05, 0);
    o += pill(t, S(5) + 0.6, "QUASE VOLTOU...", "#8f99a3", 760, 64);
  } else if (t < S(6) - 0.2) {
    o += walk(t, 0.2, "mom", { smile: 8 }) + txt("MAS FOI.", 540, 470, 140, GREEN, 1, pop(t, S(5) + 2.3));
  } else if (t < S(7) - 0.2) {
    o += walk(t, 0.5);
    const month = t > S(6) + 3.0, n = month ? 22 : 5, tot = month ? 30 : 7;
    o += pill(t, S(6) - 0.1, month ? "1º MÊS" : "1ª SEMANA", GOLD, 370, 56);
    const cols = month ? 10 : 7, cell = month ? 64 : 110, x0 = 540 - cols * cell / 2;
    o += `<g transform="translate(0 440)">`;
    for (let i = 0; i < tot; i++) { const cx = x0 + (i % cols) * cell, cy = Math.floor(i / cols) * cell; const k = cl(lerp(0, n, seg(t, month ? S(6) + 3.0 : S(6), month ? S(6) + 5.0 : S(6) + 2.2)) - i); o += `<rect x="${cx + 3}" y="${cy + 3}" width="${cell - 6}" height="${cell - 6}" rx="8" fill="#f6f1e6" opacity="0.92"/>`; if (k > 0) { const m = cell * 0.22; o += `<path d="M ${cx + m} ${cy + m} L ${cx + cell - m} ${cy + cell - m} M ${cx + cell - m} ${cy + m} L ${cx + m} ${cy + cell - m}" stroke="${BERRY}" stroke-width="${cell * 0.12}" stroke-linecap="round" opacity="${k}"/>`; } }
    o += `</g>`;
  } else if (t < S(8) - 0.2) {
    o += walk(t, 1, "mom", { smile: 12 });
    o += pill(t, S(7) - 0.1, "6 MESES DEPOIS", GOLD, 400, 64);
    o += pill(t, S(7) + 2.0, "LADEIRA: SEM PARAR ✓", GREEN, 540, 56);
  } else if (t < S(9) - 0.3) {
    if (t < S(8) + 2.2) {
      const blanket = `<path d="M 480 1500 L 480 660 Q 960 600 1440 660 L 1440 1500 Z" fill="#3d5a80" stroke="${INK}" stroke-width="7"/>`;
      o += room(t, josephFront(t, { blanket: true, face: { look: [-12, -2], browUp: 8, lid: 0.05 } }), 0.3, 0.6);
      o += pill(t, S(8), "E O JOSEPH?", "#4fd1ff", 760, 70);
    } else {
      o += walk(t, 1, "both", { smile: 12 }) + pill(t, S(8) + 2.4, "NINGUÉM MANDOU.", CREAM, 390, 56) + pill(t, S(8) + 3.6, "ELE SÓ VIU.", GOLD, 530, 66);
    }
  } else {
    o += `<rect width="${SW}" height="${SH}" fill="#0d0f14"/>`;
    o += txt("DISCIPLINA", 540, 720, 120, GREEN, 1, pop(t, S(9))) + txt("SE ENSINA", 540, 850, 90, CREAM, 1, pop(t, S(9) + 0.5));
    o += txt("FAZENDO.", 540, 1060, 140, GOLD, 1, pop(t, S(9) + 1.6));
    o += txt("na frente de quem te olha", 540, 1200, 54, "#cfd8e3", seg(t, S(9) + 2.6, S(9) + 3.0));
  }
  o += vignette();
  o += topTag("A MÃE DO JOSEPH", BERRY);
  o += capShort(t);
  o += endCard(t, E(10) + 0.2, "Segue: tem mais história assim");
  o += blackout(Math.max(1 - seg(t, 0, 0.15), seg(t, end - 0.25, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
