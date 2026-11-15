// Série OS LADRÕES DO JOSEPH: o ladrão de sombra (mesmo desenho de O LADRÃO DAS 2 DA MANHÃ).
const THIEF_EYE = "#ffd27a", THIEF_PURPLE = "#8b6ad8";
// ---------- the thief (same design as O LADRÃO DAS 2 DA MANHÃ) ----------
function thief(x, y, sc, dir, alpha, t, opts = {}) {
  if (alpha <= 0) return "";
  const bob = Math.sin(t * 3) * 6;
  let o = `<g opacity="${alpha}" transform="translate(${x} ${y + bob}) scale(${sc * dir} ${sc})">`;
  o += `<ellipse cx="0" cy="40" rx="160" ry="200" fill="#6b4fa0" opacity="0.2" style="mix-blend-mode:screen"/>`;
  const fill = opts.sack || 0;
  o += `<g transform="translate(-70 -20) rotate(-12)"><path d="M -50 -40 Q -70 60 -20 80 Q 40 90 50 30 Q 40 -40 0 -50 Z" fill="#4a4258" stroke="${INK}" stroke-width="6"/>`;
  for (let i = 0; i < fill; i++) o += `<circle cx="${-14 + (i % 3) * 16}" cy="${10 + Math.floor(i / 3) * 20}" r="10" fill="${opts.loot || '#4fd1ff'}" opacity="0.85"/>`;
  o += `<path d="M -10 -50 L 10 -70" stroke="${INK}" stroke-width="6"/></g>`;
  o += `<path d="M -20 90 Q -30 140 -18 180" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M -20 90 Q -30 140 -18 180" fill="none" stroke="#241c3a" stroke-width="14" stroke-linecap="round"/>`;
  o += `<path d="M 22 90 Q 30 140 34 176" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 22 90 Q 30 140 34 176" fill="none" stroke="#241c3a" stroke-width="14" stroke-linecap="round"/>`;
  o += `<path d="M -60 100 C -70 0 -50 -70 0 -80 C 50 -70 70 0 60 100 Z" fill="#241c3a" stroke="${INK}" stroke-width="7"/>`;
  const reach = opts.reach || 0, hx = lerp(55, 150, reach), hy = lerp(30, -110, reach);
  o += `<path d="M 40 -30 Q ${lerp(90, 110, reach)} ${lerp(20, -60, reach)} ${hx} ${hy}" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 40 -30 Q ${lerp(90, 110, reach)} ${lerp(20, -60, reach)} ${hx} ${hy}" fill="none" stroke="#241c3a" stroke-width="14" stroke-linecap="round"/>`;
  o += `<circle cx="${hx}" cy="${hy}" r="14" fill="#241c3a" stroke="${INK}" stroke-width="5"/>`;
  o += `<circle cx="0" cy="-120" r="62" fill="#241c3a" stroke="${INK}" stroke-width="7"/>`;
  o += `<path d="M -64 -134 Q 0 -150 64 -134 L 64 -106 Q 0 -120 -64 -106 Z" fill="${opts.mask || '#6b4fa0'}" stroke="${INK}" stroke-width="5"/>`;
  const look = opts.look || 0, sh = opts.shrug || 0;
  o += `<ellipse cx="${-22 + look}" cy="-122" rx="10" ry="${8 - 4 * sh}" fill="${THIEF_EYE}"/><ellipse cx="${22 + look}" cy="-122" rx="10" ry="${8 - 4 * sh}" fill="${THIEF_EYE}"/>`;
  o += `<ellipse cx="${-22 + look}" cy="-122" rx="22" ry="18" fill="${THIEF_EYE}" opacity="0.25" style="mix-blend-mode:screen"/><ellipse cx="${22 + look}" cy="-122" rx="22" ry="18" fill="${THIEF_EYE}" opacity="0.25" style="mix-blend-mode:screen"/>`;
  if (opts.grin) o += `<path d="M -26 -90 Q 0 -74 26 -90" fill="none" stroke="${THIEF_EYE}" stroke-width="5" stroke-linecap="round"/>`;
  if (sh > 0) o += `<path d="M -30 -84 Q 0 ${-84 + 10 * sh} 30 -84" fill="none" stroke="${THIEF_EYE}" stroke-width="5" stroke-linecap="round"/>`;
  return o + `</g>`;
}

