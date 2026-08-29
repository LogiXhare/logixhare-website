/**
 * Hand-drawn line icon set — 24x24, stroke-based, currentColor.
 * Kept as a local set (no icon library) so the mark language stays
 * consistent and the page ships no extra weight.
 *
 * Values are the inner markup of a shared <svg> wrapper defined in
 * Icon.astro. Lives in a .ts file rather than the component so data
 * modules can reference icon names in a type-safe way.
 */
export const iconPaths = {
  server:
    '<rect x="3.5" y="3.5" width="17" height="6" rx="1.4"/><rect x="3.5" y="14.5" width="17" height="6" rx="1.4"/><circle cx="7" cy="6.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="7" cy="17.5" r="0.9" fill="currentColor" stroke="none"/><line x1="10.5" y1="6.5" x2="16.5" y2="6.5"/><line x1="10.5" y1="17.5" x2="16.5" y2="17.5"/>',
  code: '<polyline points="8.5 8 4.5 12 8.5 16"/><polyline points="15.5 8 19.5 12 15.5 16"/><line x1="13.2" y1="5.5" x2="10.8" y2="18.5"/>',
  network:
    '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><line x1="12" y1="7" x2="6.2" y2="16.3"/><line x1="12" y1="7" x2="17.8" y2="16.3"/><line x1="7" y1="18" x2="17" y2="18"/>',
  cloud: '<path d="M7.5 17.5h9a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.5-1.8A3.5 3.5 0 0 0 7.5 17.5Z"/>',
  shield:
    '<path d="M12 3.5 19 6v5.5c0 4.2-2.9 7-7 9-4.1-2-7-4.8-7-9V6l7-2.5Z"/><polyline points="9 12 11.2 14.2 15.2 10"/>',
  chart: '<polyline points="4 16 9.5 10.5 13.5 14.5 20 7"/><polyline points="14.5 7 20 7 20 12.5"/>',
  database:
    '<ellipse cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6"/><path d="M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8"/>',
  globe:
    '<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="3.6" ry="8.5"/><line x1="3.6" y1="9.5" x2="20.4" y2="9.5"/><line x1="3.6" y1="14.5" x2="20.4" y2="14.5"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="9.5" rx="2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/><circle cx="12" cy="15.2" r="1.2" fill="currentColor" stroke="none"/>',
  wifi: '<path d="M3.5 9.2a13 13 0 0 1 17 0"/><path d="M6.6 12.6a8.4 8.4 0 0 1 10.8 0"/><path d="M9.7 16a4 4 0 0 1 4.6 0"/><circle cx="12" cy="19.2" r="1.1" fill="currentColor" stroke="none"/>',
  refresh:
    '<path d="M4.5 12a7.5 7.5 0 0 1 12.9-5.2l2.1 2.1"/><polyline points="19.5 4.5 19.5 9 15 9"/><path d="M19.5 12a7.5 7.5 0 0 1-12.9 5.2L4.5 15.1"/><polyline points="4.5 19.5 4.5 15 9 15"/>',
  layers:
    '<polygon points="12 3.5 21 8 12 12.5 3 8"/><polyline points="3 12.4 12 16.9 21 12.4"/><polyline points="3 16.4 12 20.9 21 16.4"/>',
  mobile: '<rect x="7" y="3" width="10" height="18" rx="2.2"/><line x1="10.5" y1="18" x2="13.5" y2="18"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><line x1="15.4" y1="15.4" x2="20" y2="20"/>',
  monitor:
    '<rect x="3" y="4.5" width="18" height="12" rx="1.8"/><line x1="8.5" y1="20" x2="15.5" y2="20"/><line x1="12" y1="16.5" x2="12" y2="20"/>',
  cart: '<circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/><path d="M3 4h2.2l2.4 11.2h10.6l1.8-7.6H6.2"/>',
  wrench:
    '<path d="M15.6 4.4a5 5 0 0 0-6.2 6.2l-5.2 5.2a2 2 0 0 0 0 2.8l1.2 1.2a2 2 0 0 0 2.8 0l5.2-5.2a5 5 0 0 0 6.2-6.2l-2.9 2.9-2.9-.6-.6-2.9Z"/>',
  check: '<polyline points="4.5 12.5 9.5 17.5 19.5 6.5" stroke-width="1.9"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="1.6"/><polyline points="4.5 7 12 12.5 19.5 7"/>',
  phone:
    '<path d="M6.2 4.5h2.9l1.3 3.6-1.9 1.7a11.4 11.4 0 0 0 5.7 5.7l1.7-1.9 3.6 1.3v2.9c0 1-1 1.7-2 1.5-4-1-9.6-6.6-10.6-10.6-.2-1 .5-2 1.3-2.2Z"/>',
  pin: '<path d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><polyline points="12 7 12 12 15.5 14"/>',
  menu: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>',
  close: '<line x1="5.5" y1="5.5" x2="18.5" y2="18.5"/><line x1="18.5" y1="5.5" x2="5.5" y2="18.5"/>',
  'arrow-right': '<line x1="4.5" y1="12" x2="18" y2="12"/><polyline points="12.5 6.5 18 12 12.5 17.5"/>',
  'chevron-down': '<polyline points="6.5 9.5 12 15 17.5 9.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2.8" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21.2"/><line x1="2.8" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21.2" y2="12"/><line x1="5.5" y1="5.5" x2="7.1" y2="7.1"/><line x1="16.9" y1="16.9" x2="18.5" y2="18.5"/><line x1="5.5" y1="18.5" x2="7.1" y2="16.9"/><line x1="16.9" y1="7.1" x2="18.5" y2="5.5"/>',
  moon: '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z"/>',
} as const;

export type IconName = keyof typeof iconPaths;
