// SHORT 3 — O CELULAR NO QUARTO
const REDC = "#e5484d";

function bed(t, q, dark, warm = 0, sy = 1120, s = 1.3) {
  let w = roomBg(warm > 0 ? 1 : 0.15, warm) + josephFront(t, Object.assign({ blanket: true }, q));
  w += `<rect x="-600" y="-400" width="3120" height="1900" fill="#000" opacity="${dark}"/>`;
  if (warm > 0) w += `<ellipse cx="700" cy="430" rx="700" ry="520" fill="url(#gWarm)" opacity="${0.25 * warm}" style="mix-blend-mode:screen"/>`;
  return cam(960, 560, s, w, sy);
}
const phoneInBed = (t, on = true) => ({ ...HOLD, phone: { pc: HOLD.pc, held: 1, on, mode: "feed" } });

function thought(t, a, inner) {
  const k = pop(t, a);
  if (k <= 0) return "";
  let o = `<g transform="translate(700 560) scale(${k})"><circle cx="-210" cy="250" r="16" fill="#f4efe6" stroke="#000" stroke-width="5"/><circle cx="-160" cy="190" r="26" fill="#f4efe6" stroke="#000" stroke-width="5"/>`;
  o += `<ellipse cx="0" cy="0" rx="240" ry="170" fill="#f4efe6" stroke="#000" stroke-width="8"/>${inner}</g>`;
  return o;
}
function chargingTable(x, y, s, t) {
  let o = `<g transform="translate(${x} ${y}) scale(${s})">`;
  o += `<rect x="-300" y="0" width="600" height="34" rx="6" fill="#6b4a33" stroke="#000" stroke-width="7"/><rect x="-270" y="34" width="26" height="200" fill="#5a3d2a" stroke="#000" stroke-width="6"/><rect x="244" y="34" width="26" height="200" fill="#5a3d2a" stroke="#000" stroke-width="6"/>`;
  o += `<rect x="-90" y="-22" width="180" height="24" rx="10" fill="#14161a" stroke="#000" stroke-width="6"/>`;
  o += `<path d="M 90 -10 C 180 -10 200 60 330 60 L 330 -120" fill="none" stroke="#e8e2d6" stroke-width="7"/><rect x="310" y="-170" width="44" height="60" rx="8" fill="#e8e2d6" stroke="#000" stroke-width="5"/>`;
  const p = 0.6 + 0.4 * Math.sin(t * 4);
  o += `<path d="M 10 -120 L -30 -50 L 0 -50 L -20 10 L 40 -80 L 10 -80 L 30 -120 Z" fill="${GOLD}" stroke="#000" stroke-width="5" opacity="${p}" transform="translate(0 -40)"/>`;
  return o + `</g>`;
}
function phoneSleeping(t, a) {
  let o = chargingTable(540, 980, 1.3, t);
  for (let i = 0; i < 3; i++) { const k = ((t - a) * 0.5 + i / 3) % 1; o += txt("z", 640 + k * 120, 820 - k * 220, 50 + k * 50, "#cfd8e3", (1 - k) * seg(t, a, a + 0.5)); }
  return o;
}

function render(t) {
  const end = window.TL.duration;
  let o = plainBg("#0b1020", "#07080b");
  if (t < S(4) - 0.1) {
    o += bed(t, { ...phoneInBed(t), face: { lid: 0.35, bags: 0.6, look: [0, 9], smile: 0 } }, 0.4);
    if (t < S(2) - 0.1) o += `<g transform="translate(540 500) scale(${pop(t, 0.4)})"><path d="M 0 -120 L 120 90 L -120 90 Z" fill="${GOLD}" stroke="#000" stroke-width="10" stroke-linejoin="round"/>${txt("!", 0, 30, 150, "#07080b")}</g>`;
    else if (t < S(3) - 0.1) o += `<g transform="translate(540 500) scale(${pop(t, S(2))})"><rect x="-280" y="-110" width="560" height="220" rx="30" fill="#07080b" stroke="${REDC}" stroke-width="8"/><text class="sans" x="0" y="55" font-size="160" font-weight="800" text-anchor="middle" fill="${REDC}">02:13</text></g>`;
    else o += thought(t, S(3) + 0.3, `<g transform="translate(-125 0) scale(0.95)">${ICON.sun(GOLD)}</g>${txt("É DIA!", 75, 0, 72, "#07080b", 1, 1, 'stroke-width="0"')}`);
  } else if (t < S(5) - 0.1) {
    const tired = t > S(4) + 2.4;
    if (!tired) {
      o += txt("SONO", 540, 470, 110, CREAM, 1, pop(t, S(4)));
      const mx = lerp(300, 780, seg(t, S(4) + 0.6, S(4) + 1.8));
      o += `<g transform="translate(${mx} 820) scale(1.6)">${ICON.moon("#e8e2d6")}</g>`;
      o += `<path d="M 260 1050 L 820 1050" stroke="${REDC}" stroke-width="16" stroke-linecap="round"/><path d="M 790 1015 L 840 1050 L 790 1085" fill="none" stroke="${REDC}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
      o += txt("ATRASA", 540, 1160, 90, REDC, seg(t, S(4) + 1.2, S(4) + 1.5));
    } else {
      o += bed(t, { face: { lid: blink(t, 0.6), bags: 1, browSad: 1, smile: -6, look: [0, 4] } }, 0.1, 0);
      o += clockAtV(820, 470, 7 * 60 + 2) + txt("07:02", 820, 610, 60, REDC);
    }
  } else if (t < S(6) - 0.1) {
    const bars = [["FOCO", S(5) + 1.4], ["PACIÊNCIA", S(5) + 2.2], ["ENERGIA", S(5) + 3.1]];
    o += txt("NO DIA SEGUINTE", 540, 420, 80, GOLD, 1, pop(t, S(5)));
    bars.forEach(([lab, a], i) => {
      const lv = lerp(0.9, 0.1, seg(t, a, a + 0.8));
      o += `<g transform="translate(540 ${700 + i * 290}) scale(1.4)">${battery(0, 0, lv, lab, lv > 0.4 ? GREEN : REDC)}</g>`;
    });
  } else if (t < S(7) - 0.1) {
    o += `<rect width="${SW}" height="${SH}" fill="#07080b"/>`;
    o += txt("A SOLUÇÃO", 540, 760, 130, CREAM, 1, pop(t, S(6)));
    o += txt("é ridícula de simples", 540, 920, 70, GOLD, seg(t, S(6) + 1.0, S(6) + 1.3));
  } else if (t < S(8) - 0.1) {
    // living room (phone charging) / bedroom (alarm clock)
    o += `<rect x="0" y="290" width="${SW}" height="560" fill="#1a2030"/>` + txt("SALA", 540, 380, 80, ACC, 1, pop(t, S(7)));
    o += `<g opacity="${seg(t, S(7), S(7) + 0.3)}">${chargingTable(540, 660, 1.15, t)}</g>`;
    o += `<rect x="0" y="870" width="${SW}" height="560" fill="#141826"/>` + txt("QUARTO", 540, 960, 80, GOLD, 1, pop(t, S(7) + 2.2));
    if (t > S(7) + 2.2) o += `<g transform="translate(540 1190) scale(${1.5 * pop(t, S(7) + 2.4)})">${clockAtV(0, 0, 7 * 60)}<rect x="-140" y="90" width="280" height="30" rx="6" fill="#6b4a33" stroke="#000" stroke-width="6"/></g>`;
  } else if (t < S(9) - 0.1) {
    const n3 = t > S(8) + 2.6;
    o += bed(t, n3 ? { face: { lid: 1, zzz: true, smile: 6 } } : { face: { lid: 0, look: [Math.sin(t * 1.3) * 8, -10], browSad: 0.6, smile: -2 } }, 0.42);
    o += txt(n3 ? "NOITE 3" : "NOITE 1", 540, 480, 120, n3 ? GREEN : CREAM, 1, pop(t, n3 ? S(8) + 2.6 : S(8)));
    if (!n3) o += txt("estranha...", 540, 630, 70, "#cfd8e3", seg(t, S(8) + 1.2, S(8) + 1.5));
  } else if (t < S(10) - 0.1) {
    o += bed(t, { armsUp: seg(t, S(9) + 0.2, S(9) + 0.9), face: { happy: 1, smile: 12 } }, 0, 1);
    o += `<g transform="translate(540 460) scale(${pop(t, S(9) + 1.2)})">${battery(0, 0, seg(t, S(9) + 1.4, S(9) + 2.6) * 0.95, "RECARREGADO", GREEN)}</g>`;
  } else {
    o += `<rect x="0" y="0" width="${SW}" height="${SH}" fill="#121726"/>` + txt("BOA NOITE, CELULAR.", 540, 520, 80, CREAM, 1, pop(t, S(10) + 0.3));
    o += phoneSleeping(t, S(10) + 0.6);
  }
  o += vignette();
  o += topTag("O CELULAR NO QUARTO", ACC);
  o += capShort(t);
  o += endCard(t, E(10) + 0.6, "Segue pra dormir melhor");
  o += blackout(Math.max(1 - seg(t, 0, 0.3), seg(t, end - 0.4, end)));
  document.getElementById("frame").innerHTML = o;
}
// analog alarm clock in screen space (rig clockAt + bells)
function clockAtV(x, y, mins) {
  return `<g transform="translate(${x} ${y})"><circle cx="-60" cy="-70" r="28" fill="${REDC}" stroke="#000" stroke-width="6"/><circle cx="60" cy="-70" r="28" fill="${REDC}" stroke="#000" stroke-width="6"/>${clockAt(0, 0, mins)}<path d="M -50 70 L -70 100 M 50 70 L 70 100" stroke="#000" stroke-width="10" stroke-linecap="round"/></g>`;
}
window.render = render;
