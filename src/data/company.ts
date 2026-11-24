import type { IconName } from './icons';

/** How a project runs — shared by industry, service and How we work pages. */
export const deliverySteps = [
  { title: 'Understand', body: 'We sit with the people who will use the system and write down how the work really happens today.' },
  { title: 'Plan & quote', body: 'A written scope, a timeline and a fixed price or a monthly fee — no open-ended estimates.' },
  { title: 'Build in steps', body: 'Work is shown every week on a test copy, so you see progress and correct course early.' },
  { title: 'Launch & support', body: 'We move your data, train your team, go live with you and stay on support afterwards.' },
];

/** Ways to work with us. */
export const engagementModels: { icon: IconName; title: string; body: string }[] = [
  { icon: 'clipboard', title: 'Fixed-scope project', body: 'A defined system for a fixed price and date — best when you know what you need.' },
  { icon: 'box', title: 'Ready product, set up for you', body: 'One of our ventures, configured, imported and supported — the fastest way to start.' },
  { icon: 'users', title: 'Dedicated team', body: 'Engineers working on your roadmap month by month, as an extension of your team.' },
  { icon: 'clock', title: 'Managed service', body: 'We run and look after it under a written SLA, with a monthly report of what was done.' },
];

/** What we promise on every project. */
export const promises = [
  'A weekly demo on a test copy — you see the real thing, not a status report.',
  'One named person who answers for the project.',
  'Your data, your source code and your passwords are yours, handed over in writing.',
  'Plain-language documentation your own staff can use.',
];

/** Ready product or custom build — the question buyers ask first. */
export const buildVsBuy = {
  ready: [
    'Live in weeks rather than months',
    'Lower starting cost',
    'Already proven in daily use',
    'Best when your process is close to the common one',
  ],
  custom: [
    'Follows your process exactly',
    'Connects to the systems you already run',
    'You own the code',
    'Best when your process is your advantage',
  ],
};

/** Technologies we actually work with — kept to what the team uses. */
export const technologyGroups: { title: string; items: string[] }[] = [
  { title: 'Web & apps', items: ['Astro', 'React', 'Laravel / PHP', 'Python', 'Node.js', 'Android'] },
  { title: 'Data', items: ['PostgreSQL', 'MariaDB / MySQL', 'ClickHouse', 'Redis'] },
  { title: 'AI', items: ['Large language models', 'Bangla speech-to-text', 'Bangla text-to-speech', 'Retrieval over your documents'] },
  { title: 'Infrastructure', items: ['Linux (Ubuntu, Debian)', 'Docker', 'Proxmox VE', 'VMware ESXi', 'Nginx & Caddy', 'HestiaCP'] },
  { title: 'Networking', items: ['MikroTik RouterOS', 'BGP', 'FreeRADIUS', 'WireGuard', 'IPFIX / sFlow', 'SNMP monitoring'] },
  { title: 'Cloud & edge', items: ['Cloudflare', 'Microsoft Azure', 'AWS', 'Let’s Encrypt'] },
];
