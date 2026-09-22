/**
 * Isometric icon set — small depictions of the real object, drawn as solid
 * boxes with three light tones so they read with depth rather than as line
 * glyphs. Used in the large icon tiles (26px+); the stroke set in icons.ts
 * still serves nav, menus and buttons, where at 14-17px this detail would
 * collapse into mud.
 *
 * Colours are fixed rather than currentColor: three faces need three tones.
 * That is safe because .icon-tile is an always-dark chip in both themes —
 * the same reason the service artwork can be one file instead of two.
 *
 * Values are the inner markup of a shared 0 0 32 32 <svg> in IsoIcon.astro.
 */

// Face tones: top catches the light, left is mid, right falls away. Pitched
// well above the chip ground (--chip-bg) — at closer values the whole glyph
// sank into the chip and read as a blob rather than an object.
const T = '#79b2d6'; // top
const L = '#4783b0'; // left
const R = '#28597a'; // right
const A = '#2dc7c9'; // accent
const A2 = '#8ff0f1'; // bright accent

export const isoIconPaths = {
  /* --- service categories --- */

  // three stacked rack units, bays facing the light
  server:
    `<polygon points="16,2.6 27,8.9 16,15.2 5,8.9" fill="${T}"/>` +
    `<polygon points="5,8.9 16,15.2 16,19.6 5,13.3" fill="${T}"/>` +
    `<polygon points="16,15.2 27,8.9 27,13.3 16,19.6" fill="${R}"/>` +
    `<polygon points="5,14.6 16,20.9 16,25.3 5,19" fill="${L}"/>` +
    `<polygon points="16,20.9 27,14.6 27,19 16,25.3" fill="${R}"/>` +
    `<polygon points="5,20.3 16,26.6 16,31 5,24.7" fill="${L}"/>` +
    `<polygon points="16,26.6 27,20.3 27,24.7 16,31" fill="${R}"/>` +
    `<g fill="${A2}">` +
    `<circle cx="8.2" cy="14.2" r="1.3"/><circle cx="8.2" cy="19.9" r="1.3"/><circle cx="8.2" cy="25.6" r="1.3"/></g>` +
    `<g fill="${A}" opacity=".55">` +
    `<rect x="11.2" y="16.2" width="3.4" height="1.3" rx=".6"/><rect x="11.2" y="21.9" width="3.4" height="1.3" rx=".6"/></g>`,

  // a screen showing angle brackets
  code:
    `<polygon points="16,3.6 28,10.5 16,17.4 4,10.5" fill="${T}"/>` +
    `<polygon points="4,10.5 16,17.4 16,23.4 4,16.5" fill="${L}"/>` +
    `<polygon points="16,17.4 28,10.5 28,16.5 16,23.4" fill="${R}"/>` +
    `<polygon points="16,5.4 25,10.5 16,15.6 7,10.5" fill="#081826"/>` +
    `<g stroke="${A2}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    `<polyline points="13.6,8.6 10.6,10.4 13.6,12.2"/>` +
    `<polyline points="18.4,8.8 21.4,10.6 18.4,12.4"/></g>` +
    `<polygon points="14.4,23.9 17.6,23.9 17.6,26.4 14.4,26.4" fill="${R}"/>` +
    `<polygon points="11.5,26.2 20.5,26.2 20.5,27.8 11.5,27.8" fill="${L}"/>`,

  // stacked database drums
  database:
    `<path d="M7 20.5v3.6c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4v-3.6Z" fill="${R}"/>` +
    `<ellipse cx="16" cy="20.5" rx="9" ry="3.4" fill="${L}"/>` +
    `<path d="M7 14.6v3.6c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4v-3.6Z" fill="${R}"/>` +
    `<ellipse cx="16" cy="14.6" rx="9" ry="3.4" fill="${L}"/>` +
    `<path d="M7 8.7v3.6c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4V8.7Z" fill="${R}"/>` +
    `<ellipse cx="16" cy="8.7" rx="9" ry="3.4" fill="${T}"/>` +
    `<ellipse cx="16" cy="8.7" rx="5.4" ry="2" fill="${A}" opacity=".5"/>` +
    `<circle cx="10.2" cy="19.4" r="1" fill="${A}"/><circle cx="10.2" cy="25.3" r="1" fill="${A}" opacity=".7"/>`,

  // a router with antennas
  network:
    `<g stroke="${L}" stroke-width="1.6" stroke-linecap="round"><path d="M10.5 14.5V9"/><path d="M21.5 14.5V9"/></g>` +
    `<circle cx="10.5" cy="7.8" r="1.5" fill="${A}"/><circle cx="21.5" cy="7.8" r="1.5" fill="${A}" opacity=".7"/>` +
    `<polygon points="16,13 27,19.3 16,25.6 5,19.3" fill="${T}"/>` +
    `<polygon points="5,19.3 16,25.6 16,29 5,22.7" fill="${L}"/>` +
    `<polygon points="16,25.6 27,19.3 27,22.7 16,29" fill="${R}"/>` +
    `<g fill="${A}"><polygon points="9.6,20.4 12.4,22 12.4,23.4 9.6,21.8"/>` +
    `<polygon points="13.6,22.7 16.4,24.3 16.4,25.7 13.6,24.1" opacity=".6"/></g>`,

  // a cloud over a server block
  cloud:
    `<polygon points="16,15.5 25,20.7 16,25.9 7,20.7" fill="${T}"/>` +
    `<polygon points="7,20.7 16,25.9 16,29 7,23.8" fill="${L}"/>` +
    `<polygon points="16,25.9 25,20.7 25,23.8 16,29" fill="${R}"/>` +
    `<circle cx="11.6" cy="21.8" r="1" fill="${A}"/>` +
    `<path d="M10.5 14h11a3.5 3.5 0 0 0 0-7 5.2 5.2 0 0 0-9.8-1.4A3.6 3.6 0 0 0 10.5 14Z" fill="${T}"/>` +
    `<path d="M10.5 14h11a3.5 3.5 0 0 0 1.9-.6H8.8a3.5 3.5 0 0 0 1.7.6Z" fill="${L}"/>` +
    `<path d="M13.4 8.6a3.4 3.4 0 0 1 5.6 1.2" stroke="${A}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".7"/>`,

  // a standing shield
  shield:
    `<path d="M16 3.5 26 7.4v8.2c0 6.3-4.3 10.2-10 12.9-5.7-2.7-10-6.6-10-12.9V7.4Z" fill="${L}"/>` +
    `<path d="M16 3.5 26 7.4v8.2c0 6.3-4.3 10.2-10 12.9V3.5Z" fill="${R}"/>` +
    `<path d="M16 6.2 23.4 9v6.4c0 4.7-3.2 7.7-7.4 9.7-4.2-2-7.4-5-7.4-9.7V9Z" fill="${A}" opacity=".22"/>` +
    `<polyline points="12.4,15.4 15.2,18.2 20.2,12.4" fill="none" stroke="${A2}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>`,

  // a magnifier over a rising block chart
  search:
    `<polygon points="9,22 12.4,24 12.4,28 9,26" fill="${A}" opacity=".75"/>` +
    `<polygon points="12.4,24 15.8,22 15.8,26 12.4,28" fill="${A}" opacity=".45"/>` +
    `<polygon points="15.8,18 19.2,20 19.2,26 15.8,24" fill="${A}" opacity=".85"/>` +
    `<polygon points="19.2,20 22.6,18 22.6,24 19.2,26" fill="${A}" opacity=".5"/>` +
    `<circle cx="19" cy="11.5" r="7" fill="#0f2a40" stroke="${T}" stroke-width="2"/>` +
    `<circle cx="19" cy="11.5" r="4.4" fill="${A}" opacity=".2"/>` +
    `<line x1="14" y1="16.5" x2="10.5" y2="20" stroke="${T}" stroke-width="2.4" stroke-linecap="round"/>`,

  // a compass disc, needle catching the light
  compass:
    `<ellipse cx="16" cy="19.4" rx="12" ry="7" fill="${R}"/>` +
    `<ellipse cx="16" cy="17" rx="12" ry="7" fill="${T}"/>` +
    `<ellipse cx="16" cy="17" rx="8.8" ry="5.1" fill="#081826"/>` +
    `<polygon points="21.6,13.2 16,17 14.6,15.4" fill="${A2}"/>` +
    `<polygon points="10.4,20.8 16,17 17.4,18.6" fill="${A}" opacity=".75"/>` +
    `<circle cx="16" cy="17" r="1.5" fill="${T}"/>`,

  /* --- industries --- */

  // an office tower
  building:
    `<polygon points="16,2.5 26,8.3 16,14.1 6,8.3" fill="${T}"/>` +
    `<polygon points="6,8.3 16,14.1 16,29 6,23.2" fill="${L}"/>` +
    `<polygon points="16,14.1 26,8.3 26,23.2 16,29" fill="${R}"/>` +
    `<g fill="${A}"><polygon points="8.4,12.4 11.4,14.1 11.4,16.7 8.4,15" opacity=".75"/>` +
    `<polygon points="12.6,14.8 15.6,16.5 15.6,19.1 12.6,17.4" opacity=".5"/>` +
    `<polygon points="8.4,17.6 11.4,19.3 11.4,21.9 8.4,20.2" opacity=".6"/>` +
    `<polygon points="12.6,20 15.6,21.7 15.6,24.3 12.6,22.6" opacity=".4"/></g>` +
    `<g fill="${A2}" opacity=".22"><polygon points="17.4,15.6 20.4,13.9 20.4,16.5 17.4,18.2"/>` +
    `<polygon points="21.6,13.2 24.6,11.5 24.6,14.1 21.6,15.8"/></g>`,

  // a padlock
  lock:
    `<path d="M11 15v-3.6a5 5 0 0 1 10 0V15" fill="none" stroke="${T}" stroke-width="2.4" stroke-linecap="round"/>` +
    `<polygon points="16,12.5 26,18.3 16,24.1 6,18.3" fill="${T}"/>` +
    `<polygon points="6,18.3 16,24.1 16,29 6,23.2" fill="${L}"/>` +
    `<polygon points="16,24.1 26,18.3 26,23.2 16,29" fill="${R}"/>` +
    `<ellipse cx="16" cy="18.4" rx="2.6" ry="1.5" fill="${A}"/>`,

  // a medical case, cross on the lid. The cross is drawn flat rather than
  // projected onto the face: at 34px a skewed plus stops reading as a cross.
  heart:
    `<polygon points="16,8 26,13.8 16,19.6 6,13.8" fill="${T}"/>` +
    `<polygon points="6,13.8 16,19.6 16,26.6 6,20.8" fill="${L}"/>` +
    `<polygon points="16,19.6 26,13.8 26,20.8 16,26.6" fill="${R}"/>` +
    `<polygon points="14.3,10.6 17.7,10.6 17.7,12.4 21.1,12.4 21.1,15.2 17.7,15.2 17.7,17 14.3,17 14.3,15.2 10.9,15.2 10.9,12.4 14.3,12.4" fill="${A2}"/>` +
    `<rect x="9.4" y="21.4" width="4" height="1.6" rx=".8" fill="${A}" opacity=".5"/>`,

  // a closed book: covers with a bright page block between them
  book:
    `<polygon points="16,18.6 25.6,23.2 16,27.8 6.4,23.2" fill="${T}"/>` +
    `<polygon points="6.4,23.2 16,27.8 16,30 6.4,25.4" fill="${L}"/>` +
    `<polygon points="16,27.8 25.6,23.2 25.6,25.4 16,30" fill="${R}"/>` +
    `<polygon points="16,14.4 25.6,19 16,23.6 6.4,19" fill="${A2}"/>` +
    `<polygon points="6.4,19 16,23.6 16,26.4 6.4,21.8" fill="${A}"/>` +
    `<polygon points="16,23.6 25.6,19 25.6,21.8 16,26.4" fill="${A}" opacity=".6"/>` +
    `<polygon points="16,9.4 25.6,14 16,18.6 6.4,14" fill="${T}"/>` +
    `<polygon points="6.4,14 16,18.6 16,21.4 6.4,16.8" fill="${L}"/>` +
    `<polygon points="16,18.6 25.6,14 25.6,16.8 16,21.4" fill="${R}"/>` +
    `<polygon points="16,11.4 21.6,14.1 16,16.8 10.4,14.1" fill="${A}" opacity=".35"/>`,

  // a trolley with wheels
  cart:
    `<polygon points="15,10.4 27,16.3 24.4,21.2 12.4,15.3" fill="${T}"/>` +
    `<polygon points="12.4,15.3 24.4,21.2 24.4,23.4 12.4,17.5" fill="${R}"/>` +
    `<polygon points="15,10.4 12.4,15.3 12.4,17.5 15,12.6" fill="${L}"/>` +
    `<g fill="${A}" opacity=".6"><polygon points="16.4,14.2 19,15.5 19,17.4 16.4,16.1"/>` +
    `<polygon points="20.4,16.2 23,17.5 23,19.4 20.4,18.1"/></g>` +
    `<path d="M4 6.4h3.4l3.6 9.6" fill="none" stroke="${T}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<ellipse cx="15" cy="25.4" rx="2.6" ry="1.6" fill="${A2}"/>` +
    `<ellipse cx="23" cy="25.4" rx="2.6" ry="1.6" fill="${A2}"/>`,

  // a shipping crate
  box:
    `<polygon points="16,4 27,10.3 16,16.6 5,10.3" fill="${T}"/>` +
    `<polygon points="5,10.3 16,16.6 16,28 5,21.7" fill="${L}"/>` +
    `<polygon points="16,16.6 27,10.3 27,21.7 16,28" fill="${R}"/>` +
    `<polygon points="16,4 20.4,6.5 9.4,12.8 5,10.3" fill="${A}" opacity=".2"/>` +
    `<line x1="16" y1="16.6" x2="16" y2="28" stroke="${A}" stroke-width="1" opacity=".45"/>` +
    `<rect x="7.6" y="14.6" width="6" height="2" rx="1" fill="${A2}" opacity=".3" transform="skewY(30)"/>`,

  // a map pin over its ground plane
  pin:
    `<ellipse cx="16" cy="25.5" rx="8" ry="4" fill="${R}"/>` +
    `<ellipse cx="16" cy="24.6" rx="8" ry="4" fill="${L}"/>` +
    `<ellipse cx="16" cy="24.6" rx="3.4" ry="1.7" fill="#0f2a40"/>` +
    `<path d="M16 3.5a7 7 0 0 1 7 7c0 5-7 12-7 12s-7-7-7-12a7 7 0 0 1 7-7Z" fill="${T}"/>` +
    `<path d="M16 3.5a7 7 0 0 1 7 7c0 5-7 12-7 12Z" fill="${R}" opacity=".55"/>` +
    `<circle cx="16" cy="10.4" r="2.8" fill="${A}"/>`,

  /* --- the rest of the set --- */

  // a bar chart on a plinth
  chart:
    `<ellipse cx="16" cy="25" rx="11" ry="5.5" fill="${R}"/>` +
    `<ellipse cx="16" cy="24" rx="11" ry="5.5" fill="${L}"/>` +
    `<polygon points="10,18.6 12.6,20.1 12.6,25.4 10,23.9" fill="${A}" opacity=".8"/>` +
    `<polygon points="12.6,20.1 15.2,18.6 15.2,23.9 12.6,25.4" fill="${A}" opacity=".45"/>` +
    `<polygon points="16,12.4 18.6,13.9 18.6,23.2 16,21.7" fill="${A}"/>` +
    `<polygon points="18.6,13.9 21.2,12.4 21.2,21.7 18.6,23.2" fill="${A}" opacity=".5"/>` +
    `<polygon points="22,15.6 24,16.8 24,22 22,20.8" fill="${A2}" opacity=".7"/>`,

  // a globe on a stand
  globe:
    `<circle cx="16" cy="14" r="10" fill="${L}"/>` +
    `<path d="M16 4a10 10 0 0 1 0 20Z" fill="${R}"/>` +
    `<ellipse cx="16" cy="14" rx="4.4" ry="10" fill="none" stroke="${A}" stroke-width="1.1" opacity=".6"/>` +
    `<line x1="6" y1="14" x2="26" y2="14" stroke="${A}" stroke-width="1.1" opacity=".6"/>` +
    `<line x1="7.6" y1="9" x2="24.4" y2="9" stroke="${A}" stroke-width="1" opacity=".35"/>` +
    `<line x1="7.6" y1="19" x2="24.4" y2="19" stroke="${A}" stroke-width="1" opacity=".35"/>` +
    `<ellipse cx="16" cy="27.4" rx="7" ry="2.6" fill="${T}"/>`,

  // an access point radiating
  wifi:
    `<ellipse cx="16" cy="22.4" rx="9" ry="4.4" fill="${R}"/>` +
    `<ellipse cx="16" cy="21" rx="9" ry="4.4" fill="${T}"/>` +
    `<ellipse cx="16" cy="21" rx="3" ry="1.5" fill="${A}"/>` +
    `<g fill="none" stroke="${A}" stroke-width="1.8" stroke-linecap="round">` +
    `<path d="M9.4 13.6a9 9 0 0 1 13.2 0" opacity=".45"/>` +
    `<path d="M12.2 9.4a13 13 0 0 1 7.6 0" opacity=".25"/></g>`,

  // a cycle arrow orbiting a disc
  refresh:
    `<ellipse cx="16" cy="21.6" rx="10" ry="5.4" fill="${R}"/>` +
    `<ellipse cx="16" cy="19.4" rx="10" ry="5.4" fill="${L}"/>` +
    `<ellipse cx="16" cy="19.4" rx="5" ry="2.6" fill="#081826"/>` +
    `<path d="M5.6 12.4a11.4 6 0 0 1 20.4-1.4" fill="none" stroke="${A2}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<polygon points="26.8,13.4 21.8,11.4 27,8.8" fill="${A2}"/>` +
    `<path d="M26.4 5.6a11.4 6 0 0 1-17 4.4" fill="none" stroke="${A}" stroke-width="2" stroke-linecap="round" opacity=".5"/>`,

  // three stacked plates
  layers:
    `<polygon points="16,18.6 26,22.9 16,27.2 6,22.9" fill="${R}"/>` +
    `<polygon points="16,13.6 26,17.9 16,22.2 6,17.9" fill="${L}"/>` +
    `<polygon points="16,8.6 26,12.9 16,17.2 6,12.9" fill="${T}"/>` +
    `<polygon points="16,10.6 21.6,12.9 16,15.2 10.4,12.9" fill="${A}" opacity=".45"/>`,

  // a phone standing up
  mobile:
    `<polygon points="16,4 23,8 23,24 16,28 9,24 9,8" fill="${L}"/>` +
    `<polygon points="16,4 23,8 23,24 16,28" fill="${R}"/>` +
    `<polygon points="16,6.6 20.8,9.4 20.8,22.4 16,25.2 11.2,22.4 11.2,9.4" fill="#0f2a40"/>` +
    `<polygon points="16,8.8 18.8,10.4 18.8,14 16,15.6 13.2,14 13.2,10.4" fill="${A}" opacity=".6"/>` +
    `<rect x="13.6" y="17" width="4.8" height="1.4" rx=".7" fill="${A2}" opacity=".5"/>` +
    `<rect x="13.6" y="19.6" width="3.2" height="1.4" rx=".7" fill="${A2}" opacity=".35"/>`,

  // a desktop monitor
  monitor:
    `<polygon points="16,3.6 28,10.5 16,17.4 4,10.5" fill="${T}"/>` +
    `<polygon points="4,10.5 16,17.4 16,23.4 4,16.5" fill="${L}"/>` +
    `<polygon points="16,17.4 28,10.5 28,16.5 16,23.4" fill="${R}"/>` +
    `<polygon points="16,5.6 24.6,10.5 16,15.4 7.4,10.5" fill="#0f2a40"/>` +
    `<polygon points="16,7.4 21.4,10.5 16,13.6 10.6,10.5" fill="${A}" opacity=".4"/>` +
    `<polygon points="14.4,23.9 17.6,23.9 17.6,26.4 14.4,26.4" fill="${R}"/>` +
    `<polygon points="11.5,26.2 20.5,26.2 20.5,27.8 11.5,27.8" fill="${L}"/>`,

  // a spanner over a plate
  wrench:
    `<ellipse cx="16" cy="24.6" rx="10" ry="5" fill="${R}"/>` +
    `<ellipse cx="16" cy="23.4" rx="10" ry="5" fill="${L}"/>` +
    `<path d="M21.4 5.6a5.6 5.6 0 0 0-7 7l-7.2 7.2a2.2 2.2 0 0 0 0 3.2l1 1a2.2 2.2 0 0 0 3.2 0l7.2-7.2a5.6 5.6 0 0 0 7-7l-3.3 3.3-3.2-.7-.7-3.2Z" fill="${T}"/>` +
    `<path d="M14.4 12.6 7.2 19.8a2.2 2.2 0 0 0 0 3.2l.5.5 9.6-9.6a5.7 5.7 0 0 1-2.9-1.3Z" fill="${A}" opacity=".3"/>`,

  // an envelope, flap open
  mail:
    `<polygon points="5,12.4 16,18.7 27,12.4 27,21.6 16,27.9 5,21.6" fill="${R}"/>` +
    `<polygon points="5,12.4 16,18.7 16,27.9 5,21.6" fill="${L}"/>` +
    `<polygon points="16,6.1 27,12.4 16,18.7 5,12.4" fill="${T}"/>` +
    `<polygon points="16,8.4 23,12.4 16,16.4 9,12.4" fill="#081826"/>` +
    `<polyline points="7,13.6 16,18.7 25,13.6" fill="none" stroke="${A2}" stroke-width="2" stroke-linejoin="round"/>`,

  // a handset above its base
  phone:
    `<ellipse cx="16" cy="25" rx="9.4" ry="4.6" fill="${R}"/>` +
    `<ellipse cx="16" cy="23.4" rx="9.4" ry="4.6" fill="${L}"/>` +
    `<path d="M10.6 4.6h3.2l1.5 4-2.2 2a12.6 12.6 0 0 0 6.3 6.3l2-2.2 4 1.5v3.2c0 1.2-1.1 2-2.2 1.7-4.5-1.1-10.7-7.3-11.8-11.8-.3-1.1.5-2.2 1.2-2.7Z" fill="${A2}"/>`,

  // a clock face on a plinth
  clock:
    `<ellipse cx="16" cy="18.4" rx="10" ry="5" fill="${R}"/>` +
    `<ellipse cx="16" cy="17" rx="10" ry="5" fill="${T}"/>` +
    `<circle cx="16" cy="12.6" r="8" fill="${L}"/>` +
    `<circle cx="16" cy="12.6" r="6.2" fill="#0f2a40"/>` +
    `<polyline points="16,8.4 16,12.6 19.2,14.4" fill="none" stroke="${A2}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`,

  // two figures
  users:
    `<ellipse cx="16" cy="26" rx="11" ry="4" fill="${R}"/>` +
    `<circle cx="20.4" cy="11.4" r="3.4" fill="${L}"/>` +
    `<path d="M14.6 24.6a5.8 5.8 0 0 1 11.6 0Z" fill="${L}"/>` +
    `<circle cx="12.6" cy="10" r="4.2" fill="${T}"/>` +
    `<path d="M5.4 24.6a7.2 7.2 0 0 1 14.4 0Z" fill="${T}"/>` +
    `<path d="M12.6 5.8a4.2 4.2 0 0 1 0 8.4Z" fill="${A}" opacity=".3"/>`,

  // a speech bubble
  chat:
    `<path d="M16 6c6.1 0 11 3.6 11 8s-4.9 8-11 8a14 14 0 0 1-3.2-.4l-5 2 1.4-4.2C7.2 18 5 15.2 5 14c0-4.4 4.9-8 11-8Z" fill="${T}"/>` +
    `<path d="M16 6c6.1 0 11 3.6 11 8s-4.9 8-11 8Z" fill="${R}" opacity=".5"/>` +
    `<g fill="${A}"><circle cx="11.6" cy="14" r="1.4"/><circle cx="16" cy="14" r="1.4"/><circle cx="20.4" cy="14" r="1.4"/></g>`,

  // a body-and-lens camera
  camera:
    `<polygon points="16,10 27,16.3 16,22.6 5,16.3" fill="${T}"/>` +
    `<polygon points="5,16.3 16,22.6 16,27 5,20.7" fill="${L}"/>` +
    `<polygon points="16,22.6 27,16.3 27,20.7 16,27" fill="${R}"/>` +
    `<polygon points="12.6,8.4 19.4,8.4 21,11 11,11" fill="${L}"/>` +
    `<ellipse cx="16" cy="16.3" rx="4.2" ry="2.4" fill="#0f2a40"/>` +
    `<ellipse cx="16" cy="16.3" rx="2.2" ry="1.3" fill="${A}"/>`,

  // a play slate
  video:
    `<polygon points="13,9 23,14.8 13,20.6 3,14.8" fill="${T}"/>` +
    `<polygon points="3,14.8 13,20.6 13,25.4 3,19.6" fill="${L}"/>` +
    `<polygon points="13,20.6 23,14.8 23,19.6 13,25.4" fill="${R}"/>` +
    `<polygon points="11.2,13 16,15.8 11.2,18.6" fill="${A2}"/>` +
    `<polygon points="24.4,11.4 29,14 29,21 24.4,18.4" fill="${A}" opacity=".7"/>`,

  // an artist palette with a thumb hole and wells
  palette:
    `<ellipse cx="16" cy="19.6" rx="12" ry="7.6" fill="${R}"/>` +
    `<ellipse cx="16" cy="17.6" rx="12" ry="7.6" fill="${T}"/>` +
    `<ellipse cx="20.6" cy="19.4" rx="3.4" ry="2.1" fill="#081826"/>` +
    `<ellipse cx="9.6" cy="17.2" rx="2.2" ry="1.4" fill="${A2}"/>` +
    `<ellipse cx="13.6" cy="14.6" rx="2.2" ry="1.4" fill="${A}"/>` +
    `<ellipse cx="18.8" cy="14.4" rx="2.2" ry="1.4" fill="${A2}" opacity=".7"/>` +
    `<ellipse cx="23.2" cy="16.4" rx="2.2" ry="1.4" fill="${A}" opacity=".6"/>`,

  // a power bolt on a plate
  zap:
    `<ellipse cx="16" cy="25" rx="9" ry="4.4" fill="${R}"/>` +
    `<ellipse cx="16" cy="23.8" rx="9" ry="4.4" fill="${L}"/>` +
    `<polygon points="18.6,3.2 9.4,15.4 15.4,15.4 13.4,24.6 22.6,12.4 16.6,12.4" fill="${A}"/>` +
    `<polygon points="18.6,3.2 15.4,15.4 13.4,24.6 16.6,12.4" fill="${A2}" opacity=".55"/>`,

  // a clipboard with a checked line
  clipboard:
    `<polygon points="16,5 25,10.2 25,24 16,29.2 7,24 7,10.2" fill="${L}"/>` +
    `<polygon points="16,5 25,10.2 25,24 16,29.2" fill="${R}"/>` +
    `<polygon points="16,7.4 22.4,11.1 22.4,22.6 16,26.3 9.6,22.6 9.6,11.1" fill="#0f2a40"/>` +
    `<polygon points="16,3 19.6,5.1 16,7.2 12.4,5.1" fill="${T}"/>` +
    `<polyline points="12.4,15.4 14.8,17.4 19.4,12.6" fill="none" stroke="${A2}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
} as const;


/**
 * Per-icon centring, measured rather than eyeballed: each icon's rendered
 * bounding box is computed, then translated so its centre lands at 16,16 and
 * scaled toward a common optical size. Kept separate from the art above so
 * the drawings stay readable and these can be re-derived if one changes.
 * Regenerate with scratchpad/center.mjs.
 */
export const isoIconTransforms: Record<string, string> = {
  server: 'translate(1.6 0.88) scale(0.9)',
  code: 'translate(-0.53 -0.22) scale(1.033)',
  database: 'translate(-2.02 -2.47) scale(1.126)',
  network: 'translate(-1.62 -3.44) scale(1.101)',
  cloud: 'translate(0.87 0.96) scale(0.95)',
  shield: 'translate(0 0) scale(1)',
  search: 'translate(-2.62 -1.29) scale(1.064)',
  compass: 'translate(-0.67 -2.96) scale(1.042)',
  building: 'translate(0.91 1.14) scale(0.943)',
  lock: 'translate(-1.7 -3.58) scale(1.106)',
  heart: 'translate(-4 -5.63) scale(1.25)',
  book: 'translate(-3.42 -7.91) scale(1.214)',
  cart: 'translate(-0.85 -2.15) scale(1.087)',
  box: 'translate(-0.67 -0.67) scale(1.042)',
  pin: 'translate(0.62 0.13) scale(0.962)',
  chart: 'translate(-2.18 -8.37) scale(1.136)',
  globe: 'translate(0.62 -0.35) scale(0.962)',
  wifi: 'translate(-4 -6.27) scale(1.25)',
  refresh: 'translate(-3.04 -3.04) scale(1.168)',
  layers: 'translate(-4 -6.38) scale(1.25)',
  mobile: 'translate(-0.67 -0.67) scale(1.042)',
  monitor: 'translate(-0.53 -0.22) scale(1.033)',
  wrench: 'translate(-0.5 -2.02) scale(1.031)',
  mail: 'translate(-2.18 -3.32) scale(1.136)',
  phone: 'translate(0 -1.1) scale(1)',
  clock: 'translate(-4 -1.5) scale(1.25)',
  users: 'translate(-0.53 -2.49) scale(1.033)',
  chat: 'translate(-2.18 -0.82) scale(1.136)',
  camera: 'translate(-2.18 -4.11) scale(1.136)',
  video: 'translate(0.62 -0.54) scale(0.962)',
  palette: 'translate(-0.67 -3.38) scale(1.042)',
  zap: 'translate(0.73 0.45) scale(0.954)',
  clipboard: 'translate(0.73 0.64) scale(0.954)',
};

export type IsoIconName = keyof typeof isoIconPaths;
