// SHORT 8 — OS LADRÕES DO JOSEPH #2: O LADRÃO DO TEMPO
const REDC = "#e5484d", TIME = "#ffc53d", PURPLE = THIEF_PURPLE;

const coin = (x, y, r, label = "5 min", op = 1) => `<g opacity="${op}" transform="translate(${x} ${y})"><circle r="${r}" fill="${TIME}" stroke="#000" stroke-width="${Math.max(3, r * 0.1)}"/><circle r="${r * 0.78}" fill="none" stroke="#b8860b" stroke-width="${r * 0.06}"/>${r > 30 ? `<text class="hand" x="0" y="${r * 0.22}" font-size="${r * 0.55}" text-anchor="middle" fill="#5a3d00">${label}</text>` : ""}</g>`;
function deskScroll(t, q = {}) {
  let w = roomBg(0.5, 0.2) + clockAt(1560, 250, 900 + t * 30);
  w += josephFront(t, Object.assign({ desk: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true } }, q));
  return cam(960, 560, 1.3, w, 1150);
}
// 60-minute clock: slices of 5 min (30°)
function clock60(cx, cy, r, slices, t) {
  let o = `<circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="#12151c" stroke="#000" stroke-width="8"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#e8e2d6" stroke="#000" stroke-width="6"/>`;
  slices.forEach(([i, k]) => {
    if (k <= 0) return;
    const a0 = i * 30 * D2R, a1 = (i * 30 + 30 * k) * D2R;
    o += `<path d="M ${cx} ${cy} L ${cx + Math.sin(a0) * r} ${cy - Math.cos(a0) * r} A ${r} ${r} 0 0 1 ${cx + Math.sin(a1) * r} ${cy - Math.cos(a1) * r} Z" fill="${TIME}" stroke="#000" stroke-width="4"/>`;
  });
  for (let i = 0; i < 12; i++) { const a = i * 30 * D2R; o += `<line x1="${cx + Math.sin(a) * r * 0.86}" y1="${cy - Math.cos(a) * r * 0.86}" x2="${cx + Math.sin(a) * r}" y2="${cy - Math.cos(a) * r}" stroke="#000" stroke-width="6"/>`; }
  const m = (t * 40) % 360 * D2R;
  o += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(m) * r * 0.8}" y2="${cy - Math.cos(m) * r * 0.8}" stroke="#000" stroke-width="9" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="12" fill="#000"/>`;
  return o;
}
// big sack (screen space) with fill 0..1
function sack(x, y, s, fill, t) {
  let o = `<g transform="translate(${x} ${y}) scale(${s * (1 + 0.25 * fill)})"><path d="M -110 -60 Q -150 120 -50 160 Q 60 180 110 110 Q 140 -40 0 -80 Z" fill="#4a4258" stroke="#000" stroke-width="8"/>`;
  o += `<path d="M -30 -80 Q 0 -110 30 -80" fill="none" stroke="#000" stroke-width="8"/>`;
  for (let i = 0; i < Math.round(10 * fill); i++) o += coin(-60 + (i % 4) * 40, -70 - Math.floor(i / 4) * 26 + Math.sin(t * 3 + i) * 2, 22);
  return o + `</g>`;
}
function phoneUI(t, a) {
  const k = seg(t, a, a + 0.4);
  let o = `<g opacity="${k}" transform="translate(540 820)"><rect x="-300" y="-520" width="600" height="1040" rx="70" fill="#14161a" stroke="#000" stroke-width="10"/><rect x="-270" y="-480" width="540" height="960" rx="44" fill="#f2f2f5"/>`;
  o += `<text class="sans" x="-230" y="-400" font-size="40" font-weight="800" fill="#1c1c22">Tempo de uso</text><text class="sans" x="-230" y="-350" font-size="28" fill="#5a5a66">Hoje</text>`;
  const hrs = 4 * seg(t, a + 0.6, a + 2.0), mins = Math.floor((hrs % 1) * 60);
  o += `<text class="sans" x="-230" y="-260" font-size="92" font-weight="800" fill="#1c1c22">${Math.floor(hrs)}h ${String(mins).padStart(2, "0")}min</text>`;
  const apps = [["Vídeos curtos", 1.7, "#e93d82"], ["Rede social", 1.2, "#3e63dd"], ["Mensagens", 0.7, GREEN], ["Jogos", 0.4, "#ff9f1c"]];
  apps.forEach(([n, h, c], i) => {
    const y = -150 + i * 120, w = 440 * (h / 1.7) * seg(t, a + 1.0 + i * 0.2, a + 1.6 + i * 0.2);
    o += `<rect x="-230" y="${y}" width="68" height="68" rx="16" fill="${c}"/><text class="sans" x="-145" y="${y + 28}" font-size="30" font-weight="700" fill="#1c1c22">${n}</text><rect x="-145" y="${y + 44}" width="${w}" height="16" rx="8" fill="${c}"/><text class="sans" x="230" y="${y + 28}" font-size="26" text-anchor="end" fill="#5a5a66">${Math.floor(h)}h${String(Math.round((h % 1) * 60)).padStart(2, "0")}</text>`;
  });
  return o + `</g>`;
}

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  const c3 = chunksOf(window.TL.lines.find(l => l.id === 3));
  const grabs = [S(3), S(3) + (E(3) - S(3)) * 0.38, S(3) + (E(3) - S(3)) * 0.68];
  if (t < S(3) - 0.1) {
    o += deskScroll(t, { face: { look: [0, 9], lid: 0.25, smile: 4, bags: 0.4 } });
    const sneak = seg(t, S(2), E(2));
    o += thief(lerp(250, 300, sneak), 600 + Math.sin(t * 2) * 6, 1.0, 1, 0.85 + 0.15 * Math.sin(t * 4), t, { sack: 0, look: 8, grin: 1 });
    if (t < S(2) - 0.1) {
      o += `<g transform="translate(540 380) scale(${pop(t, 0.2)})">${txt("SEU DINHEIRO", 0, 0, 90, "#8f99a3")}<line x1="-290" y1="0" x2="${-290 + 580 * seg(t, 1.6, 2.0)}" y2="0" stroke="${REDC}" stroke-width="14" stroke-linecap="round"/></g>`;
      o += txt("SEU TEMPO", 540, 520, 130, TIME, 1, pop(t, 2.6));
    } else o += `<g transform="translate(300 330) scale(${pop(t, S(2))})"><rect x="-240" y="-40" width="480" height="80" rx="40" fill="#12151c" stroke="${PURPLE}" stroke-width="5"/>${txt("LADRÃO DO TEMPO", 0, 0, 50, PURPLE)}</g>`;
  } else if (t < S(6) - 0.1) {
    // 5 minutes at a time
    const labels = ["NA FILA", "NO BANHEIRO", "ANTES DE DORMIR"];
    const sl = grabs.map((a, i) => [i * 2, seg(t, a, a + 0.5)]);
    if (t > S(4)) [1, 3, 5, 6, 7, 8, 9, 10, 11].forEach((idx, j) => sl.push([idx, seg(t, S(4) + j * 0.25, S(4) + 0.3 + j * 0.25)]));
    o += clock60(400, 780, 250, sl, t);
    grabs.forEach((a, i) => { if (t > a && t < S(4)) o += txt(labels[i], 400, 440, 70, CREAM, seg(t, a, a + 0.2) * (1 - seg(t, (grabs[i + 1] || S(4)) - 0.2, grabs[i + 1] || S(4))), pop(t, a)); });
    const fill = cl((t - S(3)) / (S(5) - S(3)) * 0.6 + seg(t, S(5), S(5) + 1.2) * 0.4);
    o += thief(850, 720, 0.9, -1, 1, t, { reach: grabs.some(a => inR(t, a, a + 0.6)) ? 0.8 : 0, sack: Math.round(fill * 6), loot: TIME, grin: 1 });
    grabs.forEach(a => { if (inR(t, a + 0.2, a + 0.8)) { const k = (t - a - 0.2) / 0.6; o += coin(lerp(400, 790, k), lerp(600, 690, k), 40); } });
    if (inR(t, S(4) - 0.1, S(5) - 0.1)) o += txt("só 5 minutinhos...", 540, 1140, 72, "#cfd8e3", seg(t, S(4) + 0.6, S(4) + 1.0));
    if (t > S(5) - 0.1) {
      o += `<rect width="${SW}" height="${SH}" fill="#000" opacity="${0.6 * seg(t, S(5), S(5) + 0.4)}"/>`;
      o += sack(540, 820, 1.4, fill, t) + txt("4 HORAS", 540, 1180, 150, TIME, 1, pop(t, S(5) + 2.4)) + txt("por dia", 540, 1300, 64, CREAM, seg(t, S(5) + 2.8, S(5) + 3.1));
      o += txt("NO FIM DO DIA:", 540, 420, 80, CREAM, 1, pop(t, S(5)));
    }
  } else if (t < S(7) - 0.1) {
    // a year: 365 squares, 60 turn red
    o += txt("1 ANO", 540, 400, 110, CREAM, 1, pop(t, S(6)));
    const cols = 19, sz = 44, x0 = 540 - (cols * sz) / 2, y0 = 500;
    const nRed = Math.round(60 * seg(t, S(6) + 1.6, S(6) + 3.6));
    for (let i = 0; i < 365; i++) {
      const x = x0 + (i % cols) * sz, y = y0 + Math.floor(i / cols) * sz, red = i >= 365 - nRed;
      o += `<rect x="${x + 3}" y="${y + 3}" width="${sz - 6}" height="${sz - 6}" rx="6" fill="${red ? REDC : "#2a3140"}"/>`;
    }
    o += `<rect x="70" y="1000" width="940" height="200" rx="40" fill="#07080b" opacity="${0.85 * seg(t, S(6) + 3.4, S(6) + 3.8)}"/>`;
    o += txt("60 DIAS", 540, 1060, 110, REDC, 1, pop(t, S(6) + 3.4)) + txt("= 2 MESES NA TELA", 540, 1160, 64, CREAM, seg(t, S(6) + 4.0, S(6) + 4.4));
  } else if (t < S(8) - 0.1) {
    // what is in the sack
    o += sack(540, 1080, 1.2, 1, t);
    const items = [[S(7) + 1.0, "o livro que você não leu", ICON.book("#8c4a2f")], [S(7) + 2.8, "o treino que não fez", `<g transform="scale(0.55)"><path d="M -120 -40 L -40 -40 Q -20 -90 30 -90 L 50 -40 Q 120 -30 140 10 Q 150 40 120 40 L -130 40 Q -140 0 -120 -40 Z" fill="#eee" stroke="#000" stroke-width="10"/></g>`], [S(7) + 4.2, "o projeto pra depois", `<rect x="-60" y="-45" width="120" height="80" rx="8" fill="#3b4049" stroke="#000" stroke-width="7"/><rect x="-75" y="35" width="150" height="12" rx="4" fill="#2a2e35" stroke="#000" stroke-width="4"/>`]];
    items.forEach(([a, s, ic], i) => {
      const k = seg(t, a, a + 0.6); if (k <= 0) return;
      const y = lerp(1000, 420 + i * 170, sm(k));
      o += `<g transform="translate(${lerp(540, 220, sm(k))} ${y}) scale(${0.4 + 0.6 * k})">${ic}</g>` + txt(s, 640, y, 52, CREAM, k);
    });
  } else if (t < S(9) - 0.1) {
    o += sack(540, 900, 1.4, 1, t) + thief(820, 760, 0.9, -1, 1, t, { sack: 6, loot: TIME, look: -6 });
    const mx = 470 + Math.sin(t * 2) * 30, k = pop(t, S(8) + 1.0);
    o += `<g transform="translate(${mx} 840) scale(${k})"><circle r="120" fill="#cfe8f5" opacity="0.25" stroke="#000" stroke-width="16"/><circle r="120" fill="none" stroke="${CREAM}" stroke-width="8"/><line x1="85" y1="85" x2="190" y2="190" stroke="#000" stroke-width="40" stroke-linecap="round"/><line x1="85" y1="85" x2="190" y2="190" stroke="#8c4a2f" stroke-width="26" stroke-linecap="round"/></g>`;
    o += txt("O QUE ELE LEVOU?", 540, 420, 90, TIME, 1, pop(t, S(8)));
  } else if (t < S(10) - 0.1) {
    o += phoneUI(t, S(9));
    o += txt("Ajustes → Tempo de uso", 540, 1440 - 80, 0, CREAM, 0);
  } else if (t < S(11) - 0.1) {
    // app limit then lock
    const k = seg(t, S(10) + 0.5, S(10) + 2.6), locked = t > E(10) - 1.6;
    o += txt("LIMITE NOS APPS", 540, 420, 96, CREAM, 1, pop(t, S(10)));
    o += `<g transform="translate(540 820) scale(${pop(t, S(10) + 0.3)})"><rect x="-170" y="-170" width="340" height="340" rx="80" fill="#e93d82" stroke="#000" stroke-width="10"/><path d="M -50 -70 L 80 0 L -50 70 Z" fill="#fff"/>`;
    o += `<g transform="translate(150 -150)"><circle r="70" fill="#12151c" stroke="${TIME}" stroke-width="8"/>${txt(`${Math.round(30 * (1 - k))}`, 0, -6, 56, TIME)}<text class="hand" x="0" y="40" font-size="26" text-anchor="middle" fill="#cfd8e3">min</text></g>`;
    if (locked) o += `<rect x="-170" y="-170" width="340" height="340" rx="80" fill="#000" opacity="${0.7 * seg(t, E(10) - 1.6, E(10) - 1.3)}"/><g transform="scale(${pop(t, E(10) - 1.5)})"><rect x="-55" y="-20" width="110" height="90" rx="14" fill="${TIME}" stroke="#000" stroke-width="7"/><path d="M -35 -20 v -30 a 35 35 0 0 1 70 0 v 30" fill="none" stroke="${TIME}" stroke-width="14"/></g>`;
    o += `</g>`;
    if (locked) o += txt("TEMPO ESGOTADO", 540, 1150, 84, REDC, 1, pop(t, E(10) - 1.4));
  } else if (t < S(12) - 0.1) {
    // hours come back
    let w = roomBg(0.95, 0.5) + josephFront(t, { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], face: { smile: 11, look: [0, 8], lid: blink(t, 0.05) } });
    o += cam(960, 560, 1.3, w, 1150);
    for (let i = 0; i < 8; i++) { const k = seg(t, S(11) + i * 0.25, S(11) + 0.9 + i * 0.25); if (k > 0 && k < 1) o += coin(lerp(900, 540, k) + Math.sin(i) * 60, lerp(500, 900, k) - Math.sin(k * Math.PI) * 200, 34, "1h"); }
    o += thief(lerp(860, 1300, seg(t, S(11) + 1.2, S(11) + 2.6)), 520, 0.8, 1, 1, t, { sack: 0, shrug: 0.6 });
    o += txt("DEVOLVA PRA SUA VIDA", 540, 400, 76, TIME, 1, pop(t, S(11) + 0.4));
  } else {
    o += txt("PRÓXIMO LADRÃO?", 540, 400, 100, CREAM, 1, pop(t, S(12)));
    [["DA AUTOESTIMA", -200], ["DA ENERGIA", 200]].forEach(([s, dx], i) => { const p = pop(t, S(12) + 0.6 + i * 0.4); if (p <= 0) return; o += thief(540 + dx, 860, 0.95 * p, i ? -1 : 1, 0.95, t + i, { look: 4 }) + txt("?", 540 + dx, 640, 100, TIME, p) + txt(s, 540 + dx, 1130, 52, PURPLE, p); });
    o += txt("comenta aqui 👇", 540, 1260, 64, CREAM, seg(t, S(12) + 2.0, S(12) + 2.4));
  }
  o += vignette();
  o += topTag("OS LADRÕES DO JOSEPH #2", PURPLE);
  o += capShort(t);
  o += endCard(t, E(12) + 0.3, "Segue pra ver o próximo ladrão");
  o += blackout(Math.max(1 - seg(t, 0, 0.2), seg(t, end - 0.3, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
