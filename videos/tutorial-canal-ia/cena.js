// TUTORIAL — Como criar um canal assim com IA (passo a passo). 1920x1080.
const REDC = "#e5484d", W = 1920, H = 1080;
const PX = 760, PY = 110, PW = 1080, PH = 750;            // browser panel
const VIDS = ["foco", "sono", "procrastinacao", "dopamina", "conectado", "um-por-cento", "comparacao", "disciplina"];
const speaking = t => window.TL.lines.some(l => t > l.start + 0.05 && t < l.end - 0.1);

// ---------- presenter (Joseph at the desk, left side) ----------
function presenter(t, q = {}) {
  const talk = speaking(t) && !window.THUMB;
  const f = Object.assign({ smile: 6, look: [6, 4], lid: blink(t, 0.05), mouthOpen: talk ? Math.max(0, Math.sin(t * 13) * Math.sin(t * 5.3)) * 0.5 : 0 }, q.face || {});
  const point = q.point || 0;
  const hR = lerp2([1040, 630], [1230, 470 + Math.sin(t * 2) * 6], point);
  const inner = roomBg(0.8, 0.35) + josephFront(t, { desk: true, laptop: !point, hR, hL: [880, 630], face: f });
  return `<g transform="translate(380 620) scale(0.95) translate(-960 -560)">${inner}</g>`;
}
function stage(t, a, b) { // dark backdrop for panel side
  return `<rect width="${W}" height="${H}" fill="#0d0f14"/>`;
}
// ---------- browser window ----------
function browser(t, url, content, a) {
  const k = seg(t, a, a + 0.4);
  let o = `<g opacity="${k}" transform="translate(0 ${(1 - k) * 30})">`;
  o += `<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="22" fill="#f2f2f5" stroke="#000" stroke-width="6"/>`;
  o += `<path d="M ${PX} ${PY + 22} a 22 22 0 0 1 22 -22 h ${PW - 44} a 22 22 0 0 1 22 22 v 58 h ${-PW} Z" fill="#dcdce3"/>`;
  [REDC, GOLD, GREEN].forEach((c, i) => { o += `<circle cx="${PX + 36 + i * 30}" cy="${PY + 40}" r="10" fill="${c}"/>`; });
  o += `<rect x="${PX + 140}" y="${PY + 18}" width="${PW - 180}" height="44" rx="22" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>`;
  o += `<path d="M ${PX + 166} ${PY + 34} v -4 a 8 8 0 0 1 16 0 v 4" fill="none" stroke="#30a46c" stroke-width="3"/><rect x="${PX + 162}" y="${PY + 34}" width="24" height="16" rx="3" fill="#30a46c"/>`;
  o += `<text class="sans" x="${PX + 200}" y="${PY + 49}" font-size="26" font-weight="600" fill="#1c1c22">${url}</text>`;
  o += `<g transform="translate(${PX} ${PY + 80})">${content}</g></g>`;
  return o;
}
// content helpers (local coords inside the browser: 0..1080 x 0..710)
const T = (s, x, y, size, col = "#1c1c22", w = 700, anchor = "start") => `<text class="sans" x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${col}" text-anchor="${anchor}">${s}</text>`;
const typed = (s, k) => esc(s.slice(0, Math.round(s.length * cl(k))));
function bubble(x, y, w, text, me, k, size = 30) {
  if (k <= 0) return "";
  const lines = wrap(text, Math.floor(w / (size * 0.55)));
  const h = 30 + lines.length * size * 1.3;
  let o = `<g opacity="${cl(k * 3)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${me ? "#3e63dd" : "#fff"}" stroke="${me ? "#3e63dd" : "#c9c9d0"}" stroke-width="3"/>`;
  lines.forEach((l, i) => { o += `<text class="sans" x="${x + 24}" y="${y + 18 + (i + 1) * size * 1.2}" font-size="${size}" font-weight="500" fill="${me ? "#fff" : "#1c1c22"}">${esc(l)}</text>`; });
  return o + `</g>`;
}
function wrap(s, n) { const out = []; let cur = ""; for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); } if (cur) out.push(cur); return out; }
function chatTyping(t, a, text, k) { // user bubble growing as it is typed
  return bubble(220, 40, 800, typed(text, k) + (k < 1 && Math.floor(t * 3) % 2 ? "▍" : ""), true, 1, 32);
}
const check = (x, y, k, c = GREEN) => k > 0 ? `<g transform="translate(${x} ${y}) scale(${0.45 * easeBack(k)})">${ICON.check(c)}</g>` : "";
const cross = (x, y, k) => k > 0 ? `<g transform="translate(${x} ${y}) scale(${0.45 * easeBack(k)})">${ICON.cross(REDC)}</g>` : "";
function node(x, y, w, label, sub, col, k) {
  if (k <= 0) return "";
  return `<g transform="translate(${x} ${y}) scale(${easeBack(k)})"><rect x="${-w / 2}" y="-58" width="${w}" height="116" rx="22" fill="#fff" stroke="${col}" stroke-width="6"/>${T(label, 0, sub ? -6 : 12, 36, "#1c1c22", 800, "middle")}${sub ? T(sub, 0, 34, 24, "#5a5a66", 500, "middle") : ""}</g>`;
}
const arrowR = (x1, y, x2, k) => k > 0 ? `<g opacity="${k}"><line x1="${x1}" y1="${y}" x2="${lerp(x1, x2, k)}" y2="${y}" stroke="#8a8a95" stroke-width="7"/><path d="M ${lerp(x1, x2, k) - 14} ${y - 12} L ${lerp(x1, x2, k)} ${y} L ${lerp(x1, x2, k) - 14} ${y + 12}" fill="none" stroke="#8a8a95" stroke-width="7"/></g>` : "";

// ---------- step header + progress ----------
function stepHeader(t, n, title, col) {
  let o = `<g><rect x="60" y="40" width="${(title.length + 10) * 26 + 120}" height="86" rx="43" fill="#12151c" stroke="${col}" stroke-width="5"/><circle cx="104" cy="83" r="32" fill="${col}"/><text class="hand" x="104" y="100" font-size="46" text-anchor="middle" fill="#07080b">${n}</text>`;
  o += `<text class="hand" x="152" y="100" font-size="46" fill="${CREAM}">PASSO ${n} · ${title}</text></g>`;
  for (let i = 1; i <= 8; i++) o += `<circle cx="${PX + 700 + i * 40}" cy="70" r="12" fill="${i < n ? GREEN : i === n ? col : "#2a3140"}" stroke="#000" stroke-width="3"/>`;
  return o;
}
// ---------- full-screen helpers ----------
function bigTxt(s, x, y, size, col, k) { return txt(s, x, y, size, col, cl(k * 3), easeBack(k)); }
function thumbs(t, a, cx, cy, s) {
  let o = "";
  VIDS.forEach((v, i) => {
    const k = pop(t, a + i * 0.15);
    if (k <= 0) return;
    const x = cx + ((i % 4) - 1.5) * 330 * s, y = cy + (Math.floor(i / 4) - 0.5) * 190 * s;
    o += `<g transform="translate(${x} ${y}) scale(${k * s}) rotate(${(hash(i) - 0.5) * 6})"><rect x="-155" y="-88" width="310" height="176" rx="12" fill="#000" stroke="${CREAM}" stroke-width="5"/><image href="assets/${v}.jpg" x="-150" y="-83" width="300" height="166" preserveAspectRatio="xMidYMid slice"/></g>`;
  });
  return o;
}

// ======================= sections =======================
function intro(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>`;
  if (t < S(3) - 0.2) {
    o += thumbs(t, 0.2, 960, 300, 1.05);
    o += `<rect width="${W}" height="${H}" fill="#0d0f14" opacity="${0.55 * seg(t, 1.2, 2.0)}"/>`;
    o += bigTxt("COMO CRIAR UM CANAL ASSIM", 960, 520, 120, CREAM, seg(t, 1.0, 1.4));
    o += bigTxt("e ter a possibilidade de ganhar com o YouTube", 960, 640, 58, GOLD, seg(t, 3.0, 3.4));
    if (t > S(2)) o += bigTxt("PASSO A PASSO", 960, 780, 110, GREEN, seg(t, S(2) + 1.6, S(2) + 2.0));
  } else if (t < S(4) - 0.2) {
    o += presenter(t, { point: 0 }) + bigTxt("LINKS OFICIAIS", 1300, 420, 110, CREAM, seg(t, S(3), S(3) + 0.4)) + bigTxt("na descrição", 1300, 540, 70, GOLD, seg(t, S(3) + 0.6, S(3) + 1.0));
    const b = Math.sin(t * 6) * 12;
    o += `<g opacity="${seg(t, S(3) + 1.0, S(3) + 1.4)}" transform="translate(1300 ${700 + b})"><path d="M -40 -60 L 40 -60 L 40 0 L 80 0 L 0 90 L -80 0 L -40 0 Z" fill="${GOLD}" stroke="#000" stroke-width="6" stroke-linejoin="round"/></g>`;
  } else {
    o += presenter(t, { face: { smile: 10 } });
    const items = [["programar", 0.25], ["desenhar", 0.4], ["ter voz bonita", 0.6]];
    o += bigTxt("VOCÊ NÃO PRECISA", 1300, 300, 84, CREAM, seg(t, S(4), S(4) + 0.4));
    items.forEach(([s, f], i) => {
      const a = lerp(S(4), E(4), f);
      o += cross(1000, 450 + i * 150, seg(t, a, a + 0.3)) + (t > a ? `<text class="hand" x="1060" y="${470 + i * 150}" font-size="72" fill="${CREAM}" opacity="${seg(t, a, a + 0.3)}">${s}</text>` : "");
    });
  }
  return o;
}
function step1(t) {
  let o = stage() + presenter(t, { point: seg(t, S(5) + 1.0, S(5) + 1.6) });
  o += stepHeader(t, 1, "CLAUDE", "#d97757");
  let c = T("Claude Code", 60, 90, 54, "#1c1c22", 800) + T("da Anthropic · roda no navegador", 60, 140, 30, "#5a5a66", 500);
  if (t < S(7) - 0.1) {
    c += `<rect x="60" y="200" width="960" height="440" rx="20" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>` + T("Como posso ajudar?", 540, 400, 46, "#8a8a95", 600, "middle");
    c += `<rect x="100" y="540" width="880" height="70" rx="35" fill="#f2f2f5" stroke="#c9c9d0" stroke-width="3"/>` + T("Escreva o que você quer criar…", 140, 586, 28, "#8a8a95", 500);
  } else if (t < S(8) - 0.1) {
    const k = pop(t, S(7));
    c += `<g transform="translate(540 400) scale(${k})"><rect x="-420" y="-160" width="840" height="320" rx="28" fill="#fff" stroke="#d97757" stroke-width="6"/>${T("Plano pago do Claude", 0, -50, 52, "#1c1c22", 800, "middle")}${T("(inclui o Claude Code)", 0, 0, 34, "#5a5a66", 500, "middle")}${T("Confira o preço atual no site oficial", 0, 80, 34, "#d97757", 700, "middle")}</g>`;
  } else {
    c = `<rect x="0" y="0" width="1080" height="710" fill="#f2f2f5"/>`;
    c += chatTyping(t, S(8), "Quero um vídeo de 4 minutos sobre foco, com o Joseph.", seg(t, S(8) + 0.3, S(8) + 2.6));
    c += bubble(60, 230, 820, "Combinado! Vou escrever o roteiro, gerar a voz e animar as cenas.", false, seg(t, S(8) + 3.0, S(8) + 3.3), 32);
  }
  return o + browser(t, "claude.ai/code", c, S(5) + 0.6);
}
function step2(t) {
  let o = stage() + presenter(t, { point: 1 }) + stepHeader(t, 2, "GITHUB", "#8b949e");
  let c = T("GitHub", 60, 90, 54, "#1c1c22", 800) + T("conta grátis · repositório = a pasta do canal", 60, 140, 30, "#5a5a66", 500);
  const k = pop(t, S(9) + 2.5);
  c += `<g opacity="${cl(k)}"><rect x="60" y="190" width="960" height="330" rx="20" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>${T("📁 seu-usuario / meu-canal", 100, 250, 36, "#3e63dd", 800)}`;
  ["videos/", "roteiros/", "trilhas/", "README.md"].forEach((f, i) => { c += T(f, 130, 320 + i * 50, 30, "#1c1c22", 500) + `<line x1="100" y1="${336 + i * 50}" x2="980" y2="${336 + i * 50}" stroke="#ececf0" stroke-width="2"/>`; });
  c += `</g>`;
  const b = seg(t, S(10), S(10) + 0.4), done = seg(t, S(10) + 2.4, S(10) + 2.8);
  c += `<g opacity="${b}" transform="translate(540 610)"><rect x="-330" y="-50" width="660" height="100" rx="50" fill="${done ? GREEN : "#1c1c22"}"/>${T(done > 0.5 ? "Conectado ao Claude Code ✓" : "Conectar ao Claude Code", 0, 12, 34, "#fff", 800, "middle")}</g>`;
  return o + browser(t, "github.com", c, S(9) + 0.4);
}
function step3(t) {
  let o = stage() + presenter(t, { point: 1 }) + stepHeader(t, 3, "VOZ", ACC);
  let c = T("Speko + Cartesia", 60, 90, 54, "#1c1c22", 800) + T("vozes de IA conectadas ao Claude", 60, 140, 30, "#5a5a66", 500);
  c += node(190, 330, 260, "Claude", "escreve o texto", "#d97757", seg(t, S(11) + 1.6, S(11) + 2.0));
  c += arrowR(330, 330, 410, seg(t, S(11) + 2.2, S(11) + 2.6));
  c += node(540, 330, 240, "Speko", "conector", ACC, seg(t, S(11) + 2.4, S(11) + 2.8));
  c += arrowR(670, 330, 750, seg(t, S(12) + 0.2, S(12) + 0.6));
  c += node(890, 330, 260, "Cartesia", "voz do narrador", "#8e4ec6", seg(t, S(12) + 0.4, S(12) + 0.8));
  if (t > S(12) + 2.4) c += `<g opacity="${seg(t, S(12) + 2.4, S(12) + 2.8)}"><rect x="200" y="450" width="680" height="80" rx="40" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>${T("Configurações → Conectores → Speko", 540, 502, 32, "#1c1c22", 700, "middle")}</g>`;
  for (let i = 0; i < 30 && t > S(11) + 3; i++) { const h = 8 + 40 * Math.abs(Math.sin(t * 8 + i * 0.6) * Math.sin(t * 3.1 + i)); c += `<rect x="${240 + i * 20}" y="${620 - h}" width="12" height="${2 * h}" rx="6" fill="${ACC}" opacity="${speaking(t) ? 1 : 0.4}"/>`; }
  if (t > S(13)) { const k = pop(t, S(13) + 0.3); c = `<rect x="0" y="0" width="1080" height="710" fill="#f2f2f5"/>` + `<g transform="translate(540 340) scale(${k})"><rect x="-380" y="-150" width="760" height="300" rx="30" fill="#fff" stroke="${GREEN}" stroke-width="7"/>${T("menos de US$ 0,30", 0, -10, 72, GREEN, 800, "middle")}${T("de voz por vídeo de 4 minutos", 0, 60, 34, "#5a5a66", 500, "middle")}</g>`; }
  return o + browser(t, "speko.ai", c, S(11) + 0.4);
}
function step4(t) {
  let o = stage() + presenter(t, { point: 1, face: { smile: 8 } }) + stepHeader(t, 4, "O PEDIDO", GOLD);
  let c = `<rect x="0" y="0" width="1080" height="710" fill="#f2f2f5"/>`;
  const p1 = "Crie um canal de curtas animados sobre disciplina. O personagem se chama Joseph, usa moletom verde, e a narração é firme e direta.";
  c += bubble(160, 30, 880, typed(p1, seg(t, S(15), E(15))), true, seg(t, S(14) + 1.2, S(14) + 1.4), 32);
  if (t > S(16)) {
    c += bubble(60, 300, 700, "Pronto! Personagem e estilo definidos.", false, seg(t, S(16) - 0.4, S(16)), 30);
    c += bubble(260, 430, 780, typed("Faça um vídeo de 4 minutos sobre procrastinação.", seg(t, S(16) + 3.6, E(16))), true, seg(t, S(16) + 3.4, S(16) + 3.6), 32);
  }
  return o + browser(t, "claude.ai/code", c, S(14) + 0.4);
}
function step5(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>` + stepHeader(t, 5, "O CLAUDE FAZ O RESTO", GREEN);
  const items = [
    [S(17) + 1.6, "ROTEIRO", "o texto do vídeo", GOLD, ICON.book(GOLD)],
    [S(18), "NARRAÇÃO", "voz, fala por fala", ACC, `<g transform="scale(0.8)">${ICON.phone(ACC)}</g>`],
    [S(19), "ANIMAÇÃO", "Chromium + Playwright", GREEN, `<rect x="-60" y="-45" width="120" height="90" rx="8" fill="none" stroke="${GREEN}" stroke-width="8"/><path d="M -20 -20 L 25 0 L -20 20 Z" fill="${GREEN}"/>`],
    [S(20), "TRILHA", "Python, do zero", "#c792ea", `<ellipse cx="-15" cy="30" rx="26" ry="20" fill="#c792ea"/><line x1="9" y1="30" x2="9" y2="-50" stroke="#c792ea" stroke-width="9"/><path d="M 9 -50 Q 45 -30 35 0" fill="none" stroke="#c792ea" stroke-width="9"/>`],
    [S(21), "VÍDEO FINAL", "FFmpeg (grátis)", REDC, `<rect x="-60" y="-40" width="120" height="80" rx="18" fill="${REDC}"/><path d="M -15 -20 L 25 0 L -15 20 Z" fill="#fff"/>`],
  ];
  items.forEach(([a, title, sub, col, icon], i) => {
    const k = pop(t, a);
    if (k <= 0) return;
    const x = 230 + i * 365, y = 480, act = t < (items[i + 1] ? items[i + 1][0] : S(22)) ? 1 : 0.55;
    if (i > 0) o += `<g opacity="${cl(k)}"><path d="M ${x - 200} ${y} L ${x - 165} ${y}" stroke="#5a6170" stroke-width="10" stroke-linecap="round"/><path d="M ${x - 180} ${y - 16} L ${x - 160} ${y} L ${x - 180} ${y + 16}" fill="none" stroke="#5a6170" stroke-width="10" stroke-linecap="round"/></g>`;
    o += `<g transform="translate(${x} ${y}) scale(${k * (act > 0.9 ? 1.04 : 1)})" opacity="${0.45 + 0.55 * act}"><rect x="-150" y="-190" width="300" height="380" rx="28" fill="#12151c" stroke="${col}" stroke-width="${act > 0.9 ? 8 : 4}"/><g transform="translate(0 -70)">${icon}</g>${txt(title, 0, 60, title.length > 9 ? 44 : 52, col)}<text class="hand" x="0" y="140" font-size="32" text-anchor="middle" fill="#cfd8e3">${sub}</text></g>`;
  });
  if (t > S(19) + 3.5 && t < S(20)) o += txt("30 fotos por segundo", 960, 760, 60, GREEN, seg(t, S(19) + 3.5, S(19) + 3.8));
  if (t > S(22) - 0.1) {
    const k = pop(t, S(22) + 0.2);
    o += `<g transform="translate(1000 800) scale(${0.85 * k})"><path d="M -200 50 a 70 70 0 0 1 20 -137 a 100 100 0 0 1 190 -20 a 80 80 0 0 1 150 70 a 60 60 0 0 1 -10 87 Z" fill="#cfd8e3" stroke="#000" stroke-width="7"/><text class="hand" x="-10" y="20" font-size="40" text-anchor="middle" fill="#07080b">TUDO NA NUVEM</text></g>`;
  }
  return o;
}
function step6(t) {
  let o = stage() + presenter(t, { point: 1 }) + stepHeader(t, 6, "AJUSTES", ACC);
  let c = `<rect x="0" y="0" width="1080" height="710" fill="#f2f2f5"/>`;
  const L = window.TL.lines.find(l => l.id === 23), a = L.start;
  c += bubble(420, 30, 620, "Ficou rápido demais.", true, seg(t, a + 2.2, a + 2.4), 32);
  c += bubble(60, 150, 560, "Deixei mais lento. ✓", false, seg(t, a + 3.4, a + 3.6), 32);
  c += bubble(320, 290, 720, "A legenda cobriu o rosto.", true, seg(t, a + 4.8, a + 5.0), 32);
  c += bubble(60, 410, 600, "Legenda ajustada. ✓", false, seg(t, a + 7.4, a + 7.6), 32);
  return o + browser(t, "claude.ai/code", c, a + 0.4);
}
function step7(t) {
  let o = stage() + presenter(t, { point: 1 }) + stepHeader(t, 7, "SEO", "#ff9f1c");
  let c = `<rect x="0" y="0" width="1080" height="710" fill="#f2f2f5"/>`;
  if (t < S(25) - 0.1) {
    const items = ["Título", "Descrição com capítulos", "Tags", "Palavras-chave", "Thumbnail"];
    c += T("Pacote de SEO", 60, 80, 50, "#1c1c22", 800);
    items.forEach((s, i) => { const a = S(24) + 2.0 + i * 0.9; c += `<g opacity="${seg(t, a - 0.2, a)}"><rect x="60" y="${130 + i * 108}" width="960" height="90" rx="18" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>${T(s, 180, 188 + i * 108, 38, "#1c1c22", 700)}</g>` + check(120, 175 + i * 108, seg(t, a, a + 0.3)); });
  } else {
    c += `<rect x="60" y="40" width="960" height="80" rx="40" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>` + T(typed("como parar de procrastinar", seg(t, S(25), S(25) + 1.0)), 110, 93, 34, "#1c1c22", 500);
    for (let i = 0; i < 3; i++) {
      const k = seg(t, S(25) + 1.0 + i * 0.2, S(25) + 1.3 + i * 0.2), y = 160 + i * 175;
      c += `<g opacity="${k}"><rect x="60" y="${y}" width="270" height="152" rx="10" fill="#cfd0d8"/>${i === 0 ? `<image href="assets/procrastinacao.jpg" x="60" y="${y}" width="270" height="152" preserveAspectRatio="xMidYMid slice"/>` : ""}<rect x="360" y="${y + 20}" width="${i ? 520 : 600}" height="30" rx="8" fill="${i ? "#d6d6dd" : "#1c1c22"}"/>${i === 0 ? T("PROCRASTINAÇÃO | Como Parar de…", 372, y + 44, 22, "#fff", 700) : ""}<rect x="360" y="${y + 66}" width="320" height="22" rx="8" fill="#e2e2e8"/></g>`;
    }
    c += `<g opacity="${seg(t, S(25) + 1.6, S(25) + 2.0)}"><rect x="54" y="154" width="932" height="164" rx="14" fill="none" stroke="${GREEN}" stroke-width="7"/>${T("1º", 960, 300, 36, GREEN, 800, "end")}</g>`;
  }
  return o + browser(t, "youtube.com", c, S(24) + 0.4);
}
function step8(t) {
  let o = stage() + presenter(t, { point: 1 }) + stepHeader(t, 8, "PUBLICAR", RED);
  let c = `<rect x="0" y="0" width="1080" height="710" fill="#f2f2f5"/>`;
  if (t < S(28) - 0.1) {
    c += T("Detalhes do vídeo", 60, 70, 44, "#1c1c22", 800);
    const f = [["Título", "DOPAMINA | Como Vencer o Vício no Celular…", S(27) + 0.3], ["Descrição", "Vício em celular não é falta de caráter…", S(27) + 1.4]];
    f.forEach(([lab, val, a], i) => { c += `<rect x="60" y="${100 + i * 120}" width="620" height="100" rx="12" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>${T(lab, 80, 130 + i * 120, 22, "#5a5a66", 600)}${T(typed(val, seg(t, a, a + 1.0)), 80, 175 + i * 120, 26, "#1c1c22", 500)}`; });
    const th = seg(t, S(27) + 2.6, S(27) + 3.0);
    c += `<rect x="720" y="100" width="300" height="220" rx="12" fill="#fff" stroke="#c9c9d0" stroke-width="3"/>${T("Miniatura", 740, 130, 22, "#5a5a66", 600)}<g opacity="${th}"><image href="assets/dopamina.jpg" x="740" y="150" width="260" height="146" preserveAspectRatio="xMidYMid slice"/></g>`;
    c += T("Público", 60, 400, 30, "#1c1c22", 800);
    const sel = seg(t, S(27) + 3.6, S(27) + 4.0);
    [["Sim, é conteúdo para crianças", 0], ["Não, não é conteúdo para crianças", 1]].forEach(([s, v], i) => {
      const on = v ? sel : 0, y = 460 + i * 80;
      c += `<circle cx="90" cy="${y}" r="18" fill="#fff" stroke="${on ? "#3e63dd" : "#8a8a95"}" stroke-width="4"/>${on ? `<circle cx="90" cy="${y}" r="10" fill="#3e63dd"/>` : ""}${T(s, 125, y + 10, 30, "#1c1c22", v ? 700 : 500)}`;
    });
    c += `<g opacity="${sel}"><rect x="50" y="490" width="660" height="60" rx="14" fill="none" stroke="${REDC}" stroke-width="5"/>${T("IMPORTANTE", 730, 530, 30, REDC, 800)}</g>`;
  } else {
    const k = pop(t, S(28) + 0.2), k2 = seg(t, S(28) + 2.6, S(28) + 3.2);
    c += `<g transform="translate(250 360) scale(${k})"><rect x="-110" y="-200" width="220" height="400" rx="26" fill="#14161a" stroke="#000" stroke-width="6"/><image href="assets/dopamina.jpg" x="-96" y="-180" width="192" height="360" preserveAspectRatio="xMidYMid slice"/>${T("SHORT", 0, 240, 34, "#1c1c22", 800, "middle")}</g>`;
    c += `<g opacity="${k2}"><line x1="400" y1="360" x2="${lerp(400, 560, k2)}" y2="360" stroke="${RED}" stroke-width="10"/><path d="M 540 340 L 565 360 L 540 380" fill="none" stroke="${RED}" stroke-width="10"/></g>`;
    c += `<g transform="translate(800 360) scale(${pop(t, S(28) + 1.0)})"><rect x="-210" y="-120" width="420" height="240" rx="16" fill="#000" stroke="#000" stroke-width="6"/><image href="assets/dopamina.jpg" x="-204" y="-114" width="408" height="228" preserveAspectRatio="xMidYMid slice"/>${T("VÍDEO LONGO", 0, 170, 34, "#1c1c22", 800, "middle")}</g>`;
    c += T("Vídeo relacionado", 540, 640, 36, RED, 800, "middle");
  }
  return o + browser(t, "studio.youtube.com", c, S(26) + 0.4);
}
function money(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>`;
  if (t < S(31) - 0.1) {
    o += bigTxt("E A GRANA?", 960, 170, 120, GOLD, seg(t, S(29), S(29) + 0.4));
    o += txt("Programa de Parcerias do YouTube (hoje)", 960, 280, 46, "#cfd8e3", seg(t, S(29) + 1.2, S(29) + 1.6));
    const card = (x, a, big, sub, col) => { const k = pop(t, a); return k <= 0 ? "" : `<g transform="translate(${x} 520) scale(${k})"><rect x="-260" y="-150" width="520" height="300" rx="34" fill="#12151c" stroke="${col}" stroke-width="7"/>${txt(big, 0, -30, 96, col)}<text class="hand" x="0" y="70" font-size="40" text-anchor="middle" fill="#cfd8e3">${sub}</text></g>`; };
    o += card(380, S(29) + 3.0, "1.000", "inscritos", GREEN);
    o += txt("+", 690, 520, 90, CREAM, seg(t, S(29) + 4.5, S(29) + 4.8));
    o += card(1000, S(29) + 4.6, "4.000 h", "assistidas em 12 meses", ACC);
    o += txt("ou", 1310, 520, 70, CREAM, seg(t, S(29) + 7.0, S(29) + 7.3));
    o += card(1610, S(29) + 7.2, "10 mi", "views em Shorts / 90 dias", "#e93d82");
    if (t > S(30) - 0.1) o += `<g opacity="${seg(t, S(30), S(30) + 0.4)}"><rect x="460" y="760" width="1000" height="110" rx="55" fill="#12151c" stroke="${GOLD}" stroke-width="5"/>${txt("as regras mudam · link oficial na descrição ↓", 960, 815, 46, GOLD)}</g>`;
  } else if (t < S(33) - 0.1) {
    o += bigTxt("A REGRA QUE DERRUBA CANAIS DE IA", 960, 190, 78, CREAM, seg(t, S(31), S(31) + 0.4));
    o += `<g transform="translate(560 520) scale(${pop(t, S(31) + 3.6)})"><rect x="-330" y="-170" width="660" height="340" rx="34" fill="#12151c" stroke="${GREEN}" stroke-width="8"/><g transform="translate(0 -60)">${ICON.check(GREEN)}</g>${txt("ORIGINAL", 0, 80, 100, GREEN)}</g>`;
    const bad = ["EM MASSA", "REPETIDO", "COPIADO"];
    bad.forEach((s, i) => { const a = S(32) + 0.3 + i * 1.0; o += `<g transform="translate(1360 ${380 + i * 140}) scale(${pop(t, a)})">${cross(-230, 0, 1)}${txt(s, 40, 0, 80, REDC)}</g>`; });
  } else if (t < S(34) - 0.1) {
    o += thumbs(t, S(33), 960, 470, 1.25);
    o += txt("história nova · técnica útil · vídeo revisado", 960, 820, 54, CREAM, seg(t, S(33) + 0.8, S(33) + 1.2));
  } else {
    o += presenter(t, { face: { smile: 4, browAng: 0.3 } });
    o += bigTxt("NINGUÉM GARANTE DINHEIRO.", 1300, 380, 72, "#cfd8e3", seg(t, S(34), S(34) + 0.4));
    o += bigTxt("CONSTÂNCIA + VALOR", 1300, 560, 96, GREEN, seg(t, S(34) + 2.2, S(34) + 2.6));
    o += bigTxt("= possibilidade real", 1300, 690, 64, GOLD, seg(t, S(34) + 3.6, S(34) + 4.0));
  }
  return o;
}
function recap(t) {
  let o = `<rect width="${W}" height="${H}" fill="#0d0f14"/>`;
  if (t < S(36) - 0.1) {
    o += `<rect width="${W}" height="${H}" fill="#07080b"/>` + recapCards(t, S(35) - 0.3, S(36) + 0.2, "RESUMO", [
      [S(35) + 1.0, "CLAUDE", "pra criar", ICON.book("#d97757"), "#d97757"],
      [S(35) + 2.5, "GITHUB", "pra guardar", `<rect x="-60" y="-45" width="120" height="90" rx="10" fill="#8b949e"/>`, "#8b949e"],
      [S(35) + 4.0, "SPEKO + CARTESIA", "pra voz", ICON.phone(ACC), ACC],
      [S(35) + 6.0, "YOUTUBE STUDIO", "pra publicar", `<rect x="-60" y="-40" width="120" height="80" rx="18" fill="${RED}"/><path d="M -15 -20 L 25 0 L -15 20 Z" fill="#fff"/>`, RED]]);
  } else {
    o += presenter(t, { face: { smile: 10 } });
    o += bigTxt("O MAIS IMPORTANTE:", 1300, 300, 70, "#cfd8e3", seg(t, S(36) + 1.6, S(36) + 2.0));
    o += bigTxt("PUBLICAR", 1300, 450, 130, GREEN, seg(t, S(36) + 3.0, S(36) + 3.4));
    o += bigTxt("TODA SEMANA", 1300, 590, 110, GOLD, seg(t, S(36) + 3.6, S(36) + 4.0));
  }
  return o;
}
function cta(t) {
  let o = presenter(t, { face: { smile: 12 } });
  if (t < S(38) - 0.1) {
    o += bigTxt("LINKS OFICIAIS", 1300, 380, 110, CREAM, seg(t, S(37), S(37) + 0.4)) + bigTxt("na descrição ↓", 1300, 510, 76, GOLD, seg(t, S(37) + 0.8, S(37) + 1.2));
  } else {
    const L = [[S(38) + 1.2, "👍 LIKE", ACC], [S(38) + 1.9, "INSCREVA-SE", RED], [S(38) + 3.0, "💬 qual canal você vai criar?", GOLD]];
    L.forEach(([a, s, col], i) => { const k = pop(t, a); if (k > 0) o += `<g transform="translate(1300 ${280 + i * 190}) scale(${k})"><rect x="-${s.length * 22 + 60}" y="-70" width="${s.length * 44 + 120}" height="140" rx="70" fill="${i === 1 ? RED : "#12151c"}" stroke="${col}" stroke-width="6"/>${txt(s, 0, 0, i === 2 ? 58 : 70, i === 1 ? "#fff" : col)}</g>`; });
  }
  return o;
}

function render(t) {
  const end = window.TL.duration;
  let o = "";
  if (t < S(5) - 0.6) o += intro(t);
  else if (t < S(9) - 0.6) o += step1(t);
  else if (t < S(11) - 0.6) o += step2(t);
  else if (t < S(14) - 0.6) o += step3(t);
  else if (t < S(17) - 0.6) o += step4(t);
  else if (t < S(23) - 0.6) o += step5(t);
  else if (t < S(24) - 0.6) o += step6(t);
  else if (t < S(26) - 0.6) o += step7(t);
  else if (t < S(29) - 0.6) o += step8(t);
  else if (t < S(35) - 0.6) o += money(t);
  else if (t < S(37) - 0.6) o += recap(t);
  else if (t < E(39) + 0.8) o += cta(t);
  else { const a = E(39) + 0.8; o += `<rect width="${W}" height="${H}" fill="#000"/>` + txt("JOSEPH", 960, 500, 200, CREAM, seg(t, a, a + 0.6), 1) + txt("Melhore 1% por dia.", 960, 680, 70, GREEN, seg(t, a + 0.8, a + 1.4)); }
  o += `<rect width="${W}" height="${H}" fill="url(#gVignette)" opacity="0.6"/>`;
  // section dips
  for (const id of [5, 9, 11, 14, 17, 23, 24, 26, 29, 35, 37]) o += `<rect width="${W}" height="${H}" fill="#000" opacity="${dip(t, S(id) - 0.9, S(id) - 0.6, S(id) - 0.6, S(id) - 0.3)}"/>`;
  o += captions2(t);
  o += `<rect width="${W}" height="${H}" fill="#000" opacity="${Math.max(1 - seg(t, 0, 0.5), seg(t, end - 0.6, end))}"/>`;
  document.getElementById("frame").innerHTML = o;
}
window.render = render;

// captions in up to two lines (long tutorial sentences)
function captions2(t) {
  let o = "";
  if (window.THUMB) return o;
  for (const L of window.TL.lines) {
    const a = L.start - 0.1, b = L.end + 0.35;
    if (t < a || t > b) continue;
    const op = seg(t, a, a + 0.15) * (1 - seg(t, b - 0.2, b));
    let lines = [L.text];
    if (L.text.length > 62) {
      const mid = L.text.length / 2; let best = -1;
      for (let i = 0; i < L.text.length; i++) if (L.text[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
      lines = [L.text.slice(0, best), L.text.slice(best + 1)];
    }
    const longest = Math.max(...lines.map(x => x.length)), fs = Math.min(52, 1780 / (longest * 0.47));
    lines.forEach((ln, i) => { o += `<text class="hand" x="960" y="${lines.length > 1 ? 985 + i * (fs + 8) - (fs + 8) * 0.5 : 995}" font-size="${fs}" text-anchor="middle" fill="#f4efe6" stroke="#000" stroke-width="10" paint-order="stroke" opacity="${op}">${esc(ln)}</text>`; });
  }
  return o;
}
