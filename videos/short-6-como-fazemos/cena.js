// SHORT 6 — COMO FAZEMOS ESTE CANAL (making of + monetização + inscreva-se)
const REDC = "#e5484d";
const WIRE = `<style>.wire * { fill: none !important; stroke: #4fd1ff !important; stroke-width: 4px !important; } .mono { font-family: "DejaVu Sans Mono", monospace; }</style>`;

function stepBadge(t, a, n, title, col) {
  const p = pop(t, a);
  return `<g transform="translate(540 400) scale(${p})"><rect x="-330" y="-70" width="660" height="140" rx="70" fill="#12151c" stroke="${col}" stroke-width="7"/><circle cx="-260" cy="0" r="50" fill="${col}"/><text class="hand" x="-260" y="26" font-size="76" text-anchor="middle" fill="#07080b">${n}</text>${txt(title, 40, 0, 80, CREAM)}</g>`;
}
function scriptPage(t, a) {
  const lines = ["FOCO — roteiro", "Só uma olhadinha.", "Só mais um vídeo.", "Só mais cinco minutos.", "Hoje é o Dia 1.", "✓ técnica: celular longe"];
  let o = `<g transform="translate(540 900) rotate(-2)"><rect x="-380" y="-330" width="760" height="660" rx="18" fill="#f6f1e6" stroke="#000" stroke-width="8"/>`;
  lines.forEach((l, i) => {
    const k = seg(t, a + 0.3 + i * 0.7, a + 0.9 + i * 0.7), n = Math.round(l.length * k);
    if (n <= 0) return;
    const last = i === lines.length - 1;
    o += `<text class="hand" x="-320" y="${-230 + i * 100}" font-size="${i ? 54 : 46}" fill="${last ? GREEN : i ? "#1c1c22" : "#8a6d3b"}">${esc(l.slice(0, n))}</text>`;
  });
  return o + `</g>`;
}
function waveform(t, amp) {
  let o = `<g transform="translate(540 980)">`;
  for (let i = 0; i < 25; i++) {
    const h = 30 + amp * (90 + 80 * Math.abs(Math.sin(t * 9 + i * 0.7) * Math.sin(t * 4.3 + i * 1.3)));
    o += `<rect x="${-480 + i * 40}" y="${-h}" width="24" height="${2 * h}" rx="12" fill="${ACC}"/>`;
  }
  return o + `</g>`;
}
function mic(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-110" width="80" height="140" rx="40" fill="#2a3140" stroke="#000" stroke-width="7"/><path d="M -70 0 Q -70 80 0 80 Q 70 80 70 0" fill="none" stroke="${CREAM}" stroke-width="10"/><line x1="0" y1="80" x2="0" y2="130" stroke="${CREAM}" stroke-width="10"/><line x1="-45" y1="130" x2="45" y2="130" stroke="${CREAM}" stroke-width="10" stroke-linecap="round"/></g>`;
}
function codePanel(t, a) {
  const code = ["function render(t) {", "  personHead(P, t);", "  armF(ombro, mão);", "  phoneScreen(\"feed\");", "  roomBg(dia, luz);", "}"];
  let o = `<rect x="70" y="300" width="940" height="430" rx="24" fill="#0b0e14" stroke="#2a3140" stroke-width="5"/>`;
  code.forEach((l, i) => {
    const k = seg(t, a + i * 0.35, a + 0.3 + i * 0.35), n = Math.round(l.length * k);
    if (n > 0) o += `<text class="mono" x="110" y="${370 + i * 62}" font-size="38" fill="${i === 0 || i === 5 ? "#c792ea" : "#7fdbca"}">${esc(l.slice(0, n))}</text>`;
  });
  return o;
}
function equalizer(t, amp) {
  let o = `<g transform="translate(540 1130)">`;
  for (let i = 0; i < 12; i++) {
    const h = 40 + amp * 300 * Math.abs(Math.sin(t * (3 + i * 0.4) + i));
    o += `<rect x="${-450 + i * 78}" y="${-h}" width="58" height="${h}" rx="10" fill="${mixc(GREEN, GOLD, i / 11)}" stroke="#000" stroke-width="4"/>`;
  }
  return o + `</g>`;
}
function note(x, y, s, op) {
  return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><ellipse cx="0" cy="40" rx="26" ry="20" fill="${CREAM}" stroke="#000" stroke-width="5"/><line x1="24" y1="40" x2="24" y2="-60" stroke="${CREAM}" stroke-width="9"/><path d="M 24 -60 Q 60 -40 50 -10" fill="none" stroke="${CREAM}" stroke-width="9"/></g>`;
}
function reqCard(t, a, y, big, small, icon, col) {
  const p = pop(t, a);
  if (p <= 0) return "";
  return `<g transform="translate(540 ${y}) scale(${p})"><rect x="-440" y="-120" width="880" height="240" rx="36" fill="#12151c" stroke="${col}" stroke-width="7"/><g transform="translate(-320 0)">${icon}</g>${txt(big, 70, -30, 92, col)}${txt(small, 70, 60, 52, "#cfd8e3")}</g>`;
}
const personIcon = `<circle cx="0" cy="-35" r="34" fill="${CREAM}" stroke="#000" stroke-width="6"/><path d="M -60 70 Q -60 10 0 10 Q 60 10 60 70 Z" fill="${CREAM}" stroke="#000" stroke-width="6"/>`;
const clockIcon = `<circle r="70" fill="${CREAM}" stroke="#000" stroke-width="7"/><line x1="0" y1="0" x2="0" y2="-45" stroke="#000" stroke-width="9" stroke-linecap="round"/><line x1="0" y1="0" x2="32" y2="12" stroke="#000" stroke-width="9" stroke-linecap="round"/>`;

function render(t) {
  const end = window.TL.duration;
  let o = WIRE + plainBg();
  if (t < S(2) - 0.1) {
    o += cam(960, 560, 1.3, roomBg(0.7, 0.3) + clockAt(1560, 250, 600 + t * 3) + josephFront(t, { desk: true, laptop: true, hR: [1040, 630], hL: [880, 630], face: { smile: 10, look: [0, 4], lid: blink(t, 0.05), browUp: 4 } }), 1150);
    o += `<g transform="translate(540 520) rotate(-6) scale(${pop(t, 0.3)})"><rect x="-400" y="-100" width="800" height="200" rx="24" fill="none" stroke="${GOLD}" stroke-width="14"/>${txt("FEITO COM IA", 0, 0, 120, GOLD)}</g>`;
    o += txt("como?", 540, 720, 80, CREAM, seg(t, 3.4, 3.7), pop(t, 3.4));
  } else if (t < S(3) - 0.1) {
    o += stepBadge(t, S(2), 1, "ROTEIRO", GOLD) + scriptPage(t, S(2) + 0.4);
  } else if (t < S(4) - 0.1) {
    const amp = window.TL.lines.some(l => t > l.start && t < l.end) ? 1 : 0.15;
    o += stepBadge(t, S(3), 2, "VOZ", ACC) + mic(540, 680, 1.3 * pop(t, S(3) + 0.3)) + waveform(t, amp * seg(t, S(3) + 0.5, S(3) + 0.9));
    o += txt("voz de IA", 540, 1240, 70, "#cfd8e3", seg(t, S(3) + 1.6, S(3) + 1.9));
  } else if (t < S(5) - 0.1) {
    o += stepBadge(t, S(4), 3, "ANIMAÇÃO", GREEN);
    if (t > S(4) + 0.9) {
      o = WIRE + plainBg() + codePanel(t, S(4) + 0.9);
      const P = josephFront(t, { hR: [1040, 680], hL: [880, 680], face: { smile: 10, lid: blink(t, 0.05), look: [0, 4] } });
      const k = seg(t, S(4) + 2.4, S(4) + 4.4), y0 = 760, y1 = 1440;
      o += `<clipPath id="wipe"><rect x="0" y="${y0}" width="${SW}" height="${(y1 - y0) * k}"/></clipPath>`;
      o += `<g class="wire">${cam(960, 480, 1.25, P, 1080)}</g><g clip-path="url(#wipe)">${cam(960, 480, 1.25, P, 1080)}</g>`;
    }
  } else if (t < S(6) - 0.1) {
    o += stepBadge(t, S(5), 4, "TRILHA", "#c792ea") + equalizer(t, seg(t, S(5) + 0.4, S(5) + 0.8));
    for (let i = 0; i < 5; i++) { const k = ((t - S(5)) * 0.45 + i / 5) % 1; o += note(160 + i * 190, 1160 - k * 520, 0.9, Math.sin(k * Math.PI) * seg(t, S(5) + 0.5, S(5) + 0.9)); }
    if (t > E(5) - 1.4) o += `<g transform="translate(540 640) rotate(-6) scale(${pop(t, E(5) - 1.4)})"><rect x="-370" y="-80" width="740" height="160" rx="20" fill="#07080b" stroke="${GREEN}" stroke-width="12"/>${txt("NADA COPIADO", 0, 0, 96, GREEN)}</g>`;
  } else if (t < S(7) - 0.1) {
    o += txt("E O DINHEIRO?", 540, 430, 120, GOLD, 1, pop(t, S(6)));
    o += txt("pra monetizar, o YouTube pede:", 540, 560, 56, "#cfd8e3", seg(t, S(6) + 1.3, S(6) + 1.6));
    o += reqCard(t, S(6) + 2.6, 790, "1.000", "inscritos", personIcon, GREEN);
    o += reqCard(t, S(6) + 4.3, 1090, "4.000 HORAS", "assistidas em 12 meses", clockIcon, ACC);
  } else if (t < S(8) - 0.1) {
    const r1 = pop(t, S(7) + 0.4), r2 = pop(t, S(7) + 2.6);
    o += txt("A REGRA DE OURO", 540, 430, 96, GOLD, 1, pop(t, S(7)));
    o += `<g transform="translate(540 760) scale(${r1})"><g transform="translate(-300 0)">${ICON.check(GREEN)}</g>${txt("ORIGINAL", 80, 0, 110, GREEN)}</g>`;
    o += `<g transform="translate(540 1060) scale(${r2})"><g transform="translate(-340 0)">${ICON.cross(REDC)}</g>${txt("COPIADO", 60, -40, 84, REDC)}${txt("ou repetido", 60, 50, 58, "#cfd8e3")}</g>`;
  } else if (t < S(10) - 0.1) {
    const vids = ["foco", "sono", "procrastinacao", "dopamina", "conectado", "um-por-cento", "comparacao", "disciplina"];
    const zoom = 1 + 0.04 * seg(t, S(9), E(9));
    o += `<g transform="translate(540 860) scale(${zoom}) translate(-540 -860)">`;
    vids.forEach((v, i) => {
      const p = pop(t, S(8) + 0.2 + i * 0.4);
      if (p <= 0) return;
      const x = 285 + (i % 2) * 510, y = 420 + Math.floor(i / 2) * 290;
      o += `<g transform="translate(${x} ${y}) scale(${p})"><rect x="-243" y="-137" width="486" height="274" rx="18" fill="#000" stroke="${CREAM}" stroke-width="6"/><image href="assets/${v}.jpg" x="-237" y="-131" width="474" height="262" preserveAspectRatio="xMidYMid slice"/></g>`;
    });
    o += `</g>`;
    if (t > S(9) - 0.1) o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="${0.45 * seg(t, S(9), S(9) + 0.4)}"/>` + txt("CONTEÚDO DE VERDADE", 540, 860, 86, GOLD, 1, pop(t, S(9)));
  } else {
    o += cam(960, 560, 1.3, roomBg(0.9, 0.5) + josephFront(t, { armsUp: seg(t, S(10) + 0.2, S(10) + 0.8), face: { happy: 1, smile: 12 } }), 1250);
    const press = 1 - 0.08 * dip(t, S(10) + 0.9, S(10) + 1.0, S(10) + 1.1, S(10) + 1.25);
    o += `<g transform="translate(540 500) scale(${pop(t, S(10)) * press})"><rect x="-330" y="-85" width="660" height="170" rx="85" fill="${RED}" stroke="#000" stroke-width="8"/>${txt("INSCREVA-SE", 0, 0, 92, "#fff")}</g>`;
    const hx = lerp(900, 640, seg(t, S(10) + 0.3, S(10) + 0.9));
    o += `<g transform="translate(${hx} ${lerp(800, 560, seg(t, S(10) + 0.3, S(10) + 0.9))})"><path d="M 0 0 L 0 80 L 22 62 L 38 98 L 52 92 L 36 56 L 64 56 Z" fill="#fff" stroke="#000" stroke-width="6" stroke-linejoin="round"/></g>`;
    const k = seg(t, S(10) + 1.5, S(10) + 3.5);
    o += `<g opacity="${seg(t, S(10) + 1.3, S(10) + 1.6)}">${txt("RUMO AOS 1.000", 540, 690, 64, CREAM)}<rect x="190" y="740" width="700" height="44" rx="22" fill="#12151c" stroke="${CREAM}" stroke-width="5"/><rect x="198" y="748" width="${684 * (0.08 + 0.3 * k)}" height="28" rx="14" fill="${GREEN}"/></g>`;
  }
  o += vignette();
  o += topTag("COMO FAZEMOS ESTE CANAL", GOLD);
  o += capShort(t);
  o += endCard(t, E(10) + 0.25, "Segue pra melhorar 1% por dia");
  o += blackout(Math.max(1 - seg(t, 0, 0.3), seg(t, end - 0.3, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
