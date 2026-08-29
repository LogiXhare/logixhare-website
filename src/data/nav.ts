import type { IconName } from './icons';

/**
 * Single source of truth for the services mega-menu and the services page.
 * Header, mobile nav and Footer all read from here so they can never drift.
 *
 * Every item listed is something LogixHare actually delivers — this list is
 * deliberately narrower than a generic agency menu.
 */

export interface ServiceItem {
  label: string;
  href: string;
  icon: IconName;
  /** One-line label used in the mega-menu. */
  blurb: string;
  /** Full paragraph used on the services page. */
  detail: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: IconName;
  summary: string;
  items: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'hosting',
    label: 'Hosting & Infrastructure',
    icon: 'server',
    summary: 'Where your site, mail and data actually live — run on our own managed infrastructure.',
    items: [
      {
        label: 'Web Hosting',
        href: '/services/#web-hosting',
        icon: 'server',
        blurb: 'NVMe-backed shared hosting across four tiers.',
        detail:
          "Shared hosting on our own NVMe-backed infrastructure, across four tiers that step up in disk, bandwidth, databases and mailboxes as a site grows. Accounts are isolated from each other with hard quotas, and everything is provisioned through our billing portal — sign-up and upgrades are self-service, no quote required.",
      },
      {
        label: 'Email Hosting',
        href: '/services/#email-hosting',
        icon: 'mail',
        blurb: 'Business mailboxes on your own domain.',
        detail:
          "Business mailboxes on your own domain, with webmail, IMAP/SMTP for Outlook and phones, spam filtering, and the SPF and DKIM records set correctly so your mail actually lands. Included on every hosting plan rather than sold as an extra.",
      },
      {
        label: 'Domains & DNS',
        href: '/services/#domains-dns',
        icon: 'globe',
        blurb: 'Domain setup and DNS records managed for you.',
        detail:
          "Domain registration and transfer, plus DNS hosting and record management — A, CNAME, MX, TXT — handled for you. If you would rather keep DNS with Cloudflare or your existing registrar, we will work with that instead of insisting you move.",
      },
      {
        label: 'Server Management',
        href: '/services/#server-management',
        icon: 'cloud',
        blurb: 'Day-to-day admin of your VPS or dedicated box.',
        detail:
          "Day-to-day administration of a VPS or dedicated server you already own: OS and package updates, web and database server configuration, firewall rules, backup jobs, and troubleshooting when something misbehaves. You keep the server; we keep it healthy.",
      },
      {
        label: 'Backups & Recovery',
        href: '/services/#backups',
        icon: 'refresh',
        blurb: 'Scheduled backups with tested restores.',
        detail:
          "Scheduled backups of files, databases and mail, kept to a retention policy we agree in advance. Just as importantly, a restore path that has actually been tested — an untested backup is a guess, not a safety net.",
      },
      {
        label: 'SSL & Certificates',
        href: '/services/#ssl',
        icon: 'lock',
        blurb: 'HTTPS issued, installed and auto-renewed.',
        detail:
          "HTTPS on every domain, issued through Let's Encrypt, installed, and renewed automatically. Commercial certificates are available where a specific vendor or warranty is required.",
      },
    ],
  },
  {
    id: 'web',
    label: 'Web & Software',
    icon: 'code',
    summary: 'Sites and applications designed around how your business actually works.',
    items: [
      {
        label: 'Website Design & Development',
        href: '/services/#web-development',
        icon: 'code',
        blurb: 'Custom marketing and corporate websites.',
        detail:
          "Custom marketing and corporate websites — designed, written and built to fit how your business actually presents itself, then handed over on hosting we run. No page-builder template with your logo dropped into it.",
      },
      {
        label: 'Web Application Development',
        href: '/services/#web-apps',
        icon: 'layers',
        blurb: 'Internal tools and customer-facing apps.',
        detail:
          "Internal tools and customer-facing applications: dashboards, portals, booking and record systems. Built with a real backend, sensible data modelling, and access control that holds up — not a spreadsheet with a login page.",
      },
      {
        label: 'eCommerce Websites',
        href: '/services/#ecommerce',
        icon: 'cart',
        blurb: 'Online stores with payments and delivery wired up.',
        detail:
          "Online stores with product management, local payment gateways, delivery options and order handling wired up properly, on hosting sized for the traffic a store actually gets.",
      },
      {
        label: 'CMS & WordPress',
        href: '/services/#cms',
        icon: 'monitor',
        blurb: 'Sites your own team can edit without us.',
        detail:
          "WordPress and other content systems set up so your own team can publish and edit without calling us for every change — with the hosting, security and updates still handled on our side.",
      },
      {
        label: 'Maintenance & Support',
        href: '/services/#maintenance',
        icon: 'wrench',
        blurb: 'Updates, fixes and small changes, on an agreement.',
        detail:
          "An ongoing agreement covering updates, security patches, backups, uptime checks and a monthly allowance for small changes. Predictable cost, and someone who already knows your setup when something breaks.",
      },
    ],
  },
  {
    id: 'network',
    label: 'Networks & Security',
    icon: 'network',
    summary: 'The infrastructure work we do day to day for ISPs and offices.',
    items: [
      {
        label: 'Network Design & Setup',
        href: '/services/#network-consulting',
        icon: 'network',
        blurb: 'Office and multi-site network build-outs.',
        detail:
          "Office and multi-site network design and build-out: addressing, switching, routing, VLAN segmentation, VPN links between sites, and documentation you can hand to whoever comes next.",
      },
      {
        label: 'Network Automation',
        href: '/services/#network-automation',
        icon: 'refresh',
        blurb: 'Repeatable, reviewed changes instead of manual CLI.',
        detail:
          "Configuration managed as reviewed, repeatable code rather than typed live into a device. Changes are dry-run first, applied in a controlled window, and shipped with a rollback — the discipline carrier networks use, available at any size.",
      },
      {
        label: 'Security Hardening',
        href: '/services/#security',
        icon: 'shield',
        blurb: 'Baseline hardening for servers and network gear.',
        detail:
          "A baseline security pass across servers and network gear: SSH and access hardening, firewall policy, brute-force protection, service exposure review, and credential hygiene. This is solid foundational work — it is not a full security operations centre, and we will say so.",
      },
      {
        label: 'Monitoring & Alerting',
        href: '/services/#monitoring',
        icon: 'chart',
        blurb: 'Know a service is down before your customers do.',
        detail:
          "Host, service and network monitoring with alerting that reaches a human, so an outage is something you are told about rather than something a customer reports to you.",
      },
      {
        label: 'Managed Wi-Fi',
        href: '/services/#wifi',
        icon: 'wifi',
        blurb: 'Coverage planning and managed access points.',
        detail:
          "Coverage planning, access point selection and placement, segregated guest networks, and ongoing management of the controller — for offices, campuses and public areas.",
      },
    ],
  },
  {
    id: 'growth',
    label: 'Growth & Visibility',
    icon: 'search',
    summary: 'Getting the site you paid for actually found by the right people.',
    items: [
      {
        label: 'Search Engine Optimisation',
        href: '/services/#seo',
        icon: 'search',
        blurb: 'Technical SEO and on-page fundamentals.',
        detail:
          "Technical SEO done first — site speed, crawlability, structure, metadata, mobile behaviour — then on-page work on the content that actually drives enquiries. Reported honestly, including when a keyword is not worth chasing.",
      },
      {
        label: 'Digital Marketing',
        href: '/services/#marketing',
        icon: 'chart',
        blurb: 'Campaign setup and ongoing management.',
        detail:
          "Campaign setup and ongoing management across search and social, with budgets and targeting matched to what you are actually selling and to whom.",
      },
      {
        label: 'Analytics & Reporting',
        href: '/services/#analytics',
        icon: 'monitor',
        blurb: 'Measurement that answers a real question.',
        detail:
          "Analytics and conversion tracking configured so the numbers answer a real business question, and reporting that says what changed and why rather than dumping a dashboard on you.",
      },
    ],
  },
];

export interface NavLink {
  href: string;
  label: string;
  mega?: boolean;
  external?: boolean;
}

export const navItems: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/services/', label: 'Services', mega: true },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];
