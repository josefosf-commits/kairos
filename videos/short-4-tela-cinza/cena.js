// SHORT 4 — TELA CINZA
const REDC = "#e5484d";
const APPC = ["#e5484d", "#ff9f1c", "#ffc53d", "#30a46c", "#4fd1ff", "#8e4ec6", "#e93d82", "#3e63dd"];
const PX = 540, PY = 860, PW = 600, PH = 1060;

function glyph(i) {
  switch (i % 4) {
    case 0: return `<path d="M -22 -26 L 30 0 L -22 26 Z" fill="#fff"/>`;
    case 1: return `<path d="M 0 22 C -40 -6 -18 -40 0 -18 C 18 -40 40 -6 0 22 Z" fill="#fff"/>`;
    case 2: return `<circle r="24" fill="none" stroke="#fff" stroke-width="9"/><circle cx="20" cy="-20" r="7" fill="#fff"/>`;
    default: return `<rect x="-26" y="-20" width="52" height="40" rx="8" fill="none" stroke="#fff" stroke-width="8"/><circle r="9" fill="#fff"/>`;
  }
}
// content of the screen, in local coords (0,0 = top-left of the screen)
function screenIcons(t, a, badgesFrom, pulse) {
  let o = "";
  const badges = [[1, "3"], [6, "12"], [9, "99+"], [14, "7"], [4, "1"], [11, "24"]];
  for (let i = 0; i < 20; i++) {
    const c = i % 4, r = Math.floor(i / 4), x = 90 + c * 140, y = 130 + r * 200;
    const s = 1 + (pulse ? 0.06 * Math.sin(t * 6 + i) : 0);
    o += `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-52" y="-52" width="104" height="104" rx="26" fill="${APPC[(i * 3) % 8]}" stroke="#000" stroke-width="5"/>${glyph(i)}</g>`;
  }
  badges.forEach(([i, n], k) => {
    const p = pop(t, badgesFrom + k * 0.45);
    if (p <= 0) return;
    const c = i % 4, r = Math.floor(i / 4), x = 90 + c * 140 + 46, y = 130 + r * 200 - 46;
    o += `<g transform="translate(${x} ${y}) scale(${p})"><circle r="${n.length > 2 ? 34 : 28}" fill="${REDC}" stroke="#fff" stroke-width="5"/><text class="sans" x="0" y="11" font-size="${n.length > 2 ? 24 : 30}" font-weight="800" text-anchor="middle" fill="#fff">${n}</text></g>`;
  });
  return o;
}
function screenFeed(t) {
  let o = "";
  const off = (t * 260) % 330;
  for (let i = -1; i < 5; i++) {
    const y = i * 330 - off + 40, idx = Math.floor(t * 260 / 330) + i;
    o += `<rect x="30" y="${y}" width="${PW - 100}" height="290" rx="24" fill="${APPC[((idx % 8) + 8) % 8]}" stroke="#000" stroke-width="4"/><circle cx="90" cy="${y + 60}" r="30" fill="#fff" opacity="0.8"/><rect x="140" y="${y + 45}" width="200" height="26" rx="13" fill="#fff" opacity="0.7"/>`;
  }
  return o;
}
function screenSettings(t, a) {
  const rows = [["Configurações", 0], ["Acessibilidade", a + 1.0], ["Filtro de cor", a + 2.6], ["Escala de cinza", a + 3.4]];
  let o = `<rect width="${PW - 40}" height="${PH - 80}" fill="#f2f2f5"/>`;
  rows.forEach(([lab, s], i) => {
    const on = t > s, y = 120 + i * 180;
    const act = i === rows.length - 1 ? 0 : (t > s && (i + 1 >= rows.length || t < rows[i + 1][1])) ? 1 : 0;
    o += `<g opacity="${on ? 1 : 0.25}"><rect x="30" y="${y - 70}" width="${PW - 100}" height="140" rx="24" fill="${act ? "#dfe9ff" : "#fff"}" stroke="${act ? "#3e63dd" : "#c9c9d0"}" stroke-width="5"/>`;
    o += `<text class="sans" x="70" y="${y + 14}" font-size="40" font-weight="${i ? 600 : 800}" fill="#1c1c22">${lab}</text>`;
    if (i === rows.length - 1) { const k = seg(t, s + 0.6, s + 1.0); o += `<rect x="${PW - 200}" y="${y - 30}" width="110" height="60" rx="30" fill="${mixc("#c9c9d0", "#30a46c", k)}"/><circle cx="${PW - 170 + 50 * k}" cy="${y}" r="24" fill="#fff"/>`; }
    else o += `<path d="M ${PW - 140} ${y - 20} L ${PW - 120} ${y} L ${PW - 140} ${y + 20}" fill="none" stroke="#8a8a95" stroke-width="7" stroke-linecap="round"/>`;
    o += `</g>`;
  });
  return o;
}
// big phone in screen space. gray: 0..1 (wipe from the top), content: svg string
function bigPhone(content, gray, sc = 1, hooks = 0, t = 0) {
  const x0 = -PW / 2 + 20, y0 = -PH / 2 + 40, w = PW - 40, h = PH - 80;
  let o = `<g transform="translate(${PX} ${PY}) scale(${sc})"><rect x="${-PW / 2}" y="${-PH / 2}" width="${PW}" height="${PH}" rx="70" fill="#14161a" stroke="#000" stroke-width="10"/>`;
  o += `<clipPath id="scr"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="44"/></clipPath>`;
  o += `<g clip-path="url(#scr)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#0f141c"/><g transform="translate(${x0} ${y0})">${content}</g></g>`;
  if (gray > 0) {
    o += `<clipPath id="scrG"><rect x="${x0}" y="${y0}" width="${w}" height="${h * gray}"/></clipPath>`;
    o += `<g clip-path="url(#scr)"><g clip-path="url(#scrG)" style="filter:grayscale(1) brightness(0.85)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#0f141c"/><g transform="translate(${x0} ${y0})">${content}</g></g></g>`;
    if (gray < 1) o += `<line x1="${x0}" y1="${y0 + h * gray}" x2="${x0 + w}" y2="${y0 + h * gray}" stroke="#fff" stroke-width="6"/>`;
  }
  o += `<rect x="-60" y="${-PH / 2 + 14}" width="120" height="18" rx="9" fill="#000"/></g>`;
  if (hooks > 0) for (let i = 0; i < 3; i++) {
    const [ci, ri] = [[0, 1], [2, 2], [3, 0]][i];
    const hx = PX + sc * (-PW / 2 + 20 + 90 + ci * 140) + 30, hy = lerp(300, PY + sc * (-PH / 2 + 40 + 130 + ri * 200 - 60), hooks) + Math.sin(t * 2 + i) * 8;
    o += `<line x1="${hx}" y1="290" x2="${hx}" y2="${hy - 40}" stroke="#cfd8e3" stroke-width="5"/><path d="M ${hx} ${hy - 40} L ${hx} ${hy + 20} A 30 30 0 0 1 ${hx - 60} ${hy + 20} L ${hx - 60} ${hy}" fill="none" stroke="#cfd8e3" stroke-width="10" stroke-linecap="round"/>`;
  }
  return o;
}
const desk = (t, q, day = 0.8, sy = 1150, s = 1.3) => cam(960, 560, s, roomBg(day, 0.3) + clockAt(1560, 250, 600 + t * 3) + josephFront(t, q), sy);

function render(t) {
  const end = window.TL.duration;
  let o = plainBg();
  if (t < S(2) - 0.1) {
    o += desk(t, { desk: true, ...HOLD, phone: { pc: HOLD.pc, held: 1, on: true }, face: { look: [0, 9], lid: 0.15, smile: 4, browUp: 4 } }, 0.5);
    o += txt("1 TRUQUE", 540, 470, 150, GOLD, 1, pop(t, 0.3));
    o += txt("sem força de vontade", 540, 620, 64, CREAM, seg(t, 2.6, 2.9));
  } else if (t < S(3) - 0.1) {
    o += bigPhone(screenIcons(t, 0, 99, false), seg(t, S(2) + 0.3, E(2)), 0.95);
  } else if (t < S(5) - 0.1) {
    const hooks = seg(t, S(4) + 3.6, S(4) + 4.4);
    o += bigPhone(screenIcons(t, 0, S(4) + 0.2, true), 0, 0.95, hooks, t);
  } else if (t < S(6) - 0.1) {
    o += bigPhone(screenFeed(t), seg(t, S(5) - 0.1, S(5) + 0.9), 0.95);
  } else if (t < S(7) - 0.1) {
    // opens, looks, puts it down
    const up = seg(t, S(6), S(6) + 0.6) * (1 - seg(t, S(6) + 1.7, S(6) + 2.3));
    const pc = lerp2([1200, 632], HOLD.pc, up), hR = lerp2([1150, 640], HOLD.hR, up);
    o += desk(t, { desk: true, hR, hL: up > 0.5 ? HOLD.hL : [880, 640], phone: { pc, held: up, on: up > 0.3, gray: true }, face: { look: up > 0.5 ? [0, 9] : [6, 4], lid: blink(t, 0.1), smile: up > 0.5 ? -1 : 6, browUp: up > 0.5 ? 0 : 4 } }, 0.8);
    const lab = t < S(6) + 0.7 ? "ABRE" : t < S(6) + 1.7 ? "OLHA" : "FECHA";
    o += txt(lab, 540, 480, 130, lab === "FECHA" ? GREEN : CREAM, 1, pop(t, lab === "ABRE" ? S(6) : lab === "OLHA" ? S(6) + 0.7 : S(6) + 1.7));
  } else if (t < S(8) - 0.1) {
    o += bigPhone(screenSettings(t, S(7)), seg(t, S(7) + 4.5, S(7) + 5.0), 0.95);
  } else if (t < S(9) - 0.1) {
    o += txt("7 DIAS", 540, 560, 140, GOLD, 1, pop(t, S(8)));
    const d = ["S", "T", "Q", "Q", "S", "S", "D"];
    d.forEach((l, i) => {
      const x = 120 + i * 140, p = pop(t, S(8) + 0.3 + i * 0.18);
      o += `<g transform="translate(${x} 860)"><rect x="-58" y="-70" width="116" height="140" rx="20" fill="#12151c" stroke="#3a4150" stroke-width="5"/>${txt(l, 0, -20, 48, "#cfd8e3")}<g transform="translate(0 30) scale(${0.5 * p})">${ICON.check(GREEN)}</g></g>`;
    });
  } else if (t < S(10) - 0.1) {
    o += desk(t, { desk: true, plant: true, book: [960, 600], hR: [1040, 610], hL: [880, 610], phone: { pc: [1200, 632], held: 0, on: false }, face: { smile: 9, look: [0, 8], lid: blink(t, 0.05) } }, 1);
    o += `<g transform="translate(540 460) scale(${pop(t, S(9) + 0.3)})"><rect x="-260" y="-60" width="520" height="120" rx="60" fill="#12151c" stroke="${GREEN}" stroke-width="6"/>${txt("ÚTIL ✓", 0, 0, 70, GREEN)}</g>`;
    o += `<g transform="translate(540 620) scale(${pop(t, S(9) + 1.9)})"><rect x="-320" y="-60" width="640" height="120" rx="60" fill="#12151c" stroke="${REDC}" stroke-width="6"/>${txt("IRRESISTÍVEL ✗", 0, 0, 66, REDC)}</g>`;
  } else {
    o += bigPhone(screenFeed(t), 1, 0.95);
  }
  o += vignette();
  o += topTag("TELA CINZA", "#8f99a3");
  o += capShort(t);
  o += endCard(t, S(10) - 0.1, "Segue pra mais truques assim");
  o += blackout(Math.max(1 - seg(t, 0, 0.3), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
window.render = render;
