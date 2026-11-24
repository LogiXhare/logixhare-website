import type { IconName } from './icons';

/**
 * Single source of truth for the services mega-menu and the services page.
 * Header, mobile nav and Footer all read from here so they can never drift.
 *
 * Anchors are load-bearing: index.astro links directly at several of these
 * (#web-hosting, #web-development, #network-consulting, #security, #erp,
 * #virtualisation, #seo, #managed-support), so renaming one silently breaks
 * a homepage card rather than failing the build.
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
  /**
   * Artwork for this category, as a path under public/. To swap in a real
   * photograph later, drop the file into public/services/ and point this at
   * it — nothing else needs to change, and the extension does not have to
   * stay .svg. Anything placed here must be committed: the production deploy
   * runs `mirror --delete`, so a file only uploaded to the server is removed
   * on the next release.
   *
   * It renders inside an always-dark panel, so artwork should read on a dark
   * ground (a photo will be fine; light-background artwork will not).
   */
  image: string;
  /** Alt text for that artwork. Replace it when the image is replaced. */
  imageAlt: string;
  items: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'hosting',
    label: 'Hosting & infrastructure',
    icon: 'server',
    summary: 'Where your site, mail and data actually live — run on our own managed infrastructure.',
    image: '/services/hosting.svg',
    imageAlt:
      'Three stacked server units with drive bays and status lights, linked out to a globe',
    items: [
      {
        label: 'Web hosting',
        href: '/services/#web-hosting',
        icon: 'server',
        blurb: 'NVMe-backed shared hosting across four tiers.',
        detail:
          "Shared hosting on our own NVMe-backed infrastructure, across four tiers that step up in disk, bandwidth, databases and mailboxes as a site grows. Accounts are isolated from each other with hard quotas, and everything is provisioned through our billing portal — sign-up and upgrades are self-service, no quote required.",
      },
      {
        label: 'Email hosting',
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
        label: 'Server setup & management',
        href: '/services/#server-management',
        icon: 'cloud',
        blurb: 'Installation, configuration and day-to-day admin.',
        detail:
          "Server installation and configuration from bare OS upwards — web, database, mail and application services — and the day-to-day administration that follows: package updates, firewall rules, backup jobs, performance tuning and troubleshooting when something misbehaves. Works on a box you already own, whether it sits in your office, a data centre or a cloud provider.",
      },
      {
        label: 'Backups & recovery',
        href: '/services/#backups',
        icon: 'refresh',
        blurb: 'Scheduled backups with tested restores.',
        detail:
          "Scheduled backups of files, databases and mail, kept to a retention policy we agree in advance. Just as importantly, a restore path that has actually been tested — an untested backup is a guess, not a safety net.",
      },
      {
        label: 'SSL & certificates',
        href: '/services/#ssl',
        icon: 'lock',
        blurb: 'HTTPS issued, installed and auto-renewed.',
        detail:
          "HTTPS on every domain, issued through Let's Encrypt, installed, and renewed automatically. Commercial certificates are available where a specific vendor or warranty is required.",
      },
      {
        label: 'File & media servers',
        href: '/services/#media-servers',
        icon: 'box',
        blurb: 'FTP, file sharing and media streaming servers.',
        detail:
          "FTP and SFTP servers for teams that move large files, internal file sharing with per-user access control, and media servers such as Plex configured for streaming across a home or office network. Set up with sensible permissions and remote access that is not simply left open.",
      },
    ],
  },
  {
    id: 'web',
    label: 'Web & eCommerce',
    icon: 'code',
    summary: 'Corporate sites, online stores and the web platforms behind them.',
    image: '/services/web.svg',
    imageAlt:
      'A browser window with a product grid and checkout, beside a phone showing the same layout',
    items: [
      {
        label: 'Website design & development',
        href: '/services/#web-development',
        icon: 'code',
        blurb: 'Custom corporate sites with original UI/UX.',
        detail:
          "Custom corporate and marketing websites — the interface designed for your content rather than picked from a catalogue, then written and built to fit how your business actually presents itself, and handed over on hosting we run. No page-builder template with your logo dropped into it.",
      },
      {
        label: 'eCommerce websites',
        href: '/services/#ecommerce',
        icon: 'cart',
        blurb: 'SEO-ready stores with payments and delivery wired up.',
        detail:
          "Online stores with product management, local payment gateways, delivery options and order handling wired up properly. Built search-friendly from the start — clean URLs, product markup, fast pages — on hosting sized for the traffic a store actually gets.",
      },
      {
        label: 'CMS platforms',
        href: '/services/#cms',
        icon: 'monitor',
        blurb: 'WordPress and Joomla your own team can edit.',
        detail:
          "WordPress, Joomla and other content systems set up so your own team can publish and edit without calling us for every change — with the hosting, security and updates still handled on our side.",
      },
      {
        label: 'Web application development',
        href: '/services/#web-apps',
        icon: 'layers',
        blurb: 'Internal tools and customer-facing apps.',
        detail:
          "Internal tools and customer-facing applications: dashboards, portals, booking and record systems. Built with a real backend, sensible data modelling, and access control that holds up — not a spreadsheet with a login page.",
      },
      {
        label: 'Maintenance & backup',
        href: '/services/#maintenance',
        icon: 'wrench',
        blurb: 'Updates, fixes and small changes, on an agreement.',
        detail:
          "An ongoing agreement covering updates, security patches, backups, uptime checks and a monthly allowance for small changes. Predictable cost, and someone who already knows your setup when something breaks.",
      },
    ],
  },
  {
    id: 'software',
    label: 'Software development',
    icon: 'database',
    summary:
      'Business systems built around your process — ERP, CRM, billing and industry-specific platforms.',
    image: '/services/software.svg',
    imageAlt:
      'Business modules feeding a central database, with a reporting panel drawn from it',
    items: [
      {
        label: 'ERP systems',
        href: '/services/#erp',
        icon: 'database',
        blurb: 'Laravel-based ERP, including RMG ERP.',
        detail:
          "Enterprise resource planning built on Laravel and customised to the way your organisation actually runs, rather than forcing your process into someone else's module structure. Includes RMG ERP for garment manufacturing — order, production, store and costing flows modelled for how a factory floor genuinely works. Existing ERP platforms can be implemented and customised instead, where that is the better answer.",
      },
      {
        label: 'HRM & payroll',
        href: '/services/#hrm',
        icon: 'users',
        blurb: 'Employee records, attendance and payroll.',
        detail:
          "Human resource management covering employee records, attendance and leave, shift handling and payroll processing, with the salary rules and deductions of your organisation configured rather than assumed. Integrates with ERP and accounting where you already have them.",
      },
      {
        label: 'CRM & admin systems',
        href: '/services/#crm',
        icon: 'clipboard',
        blurb: 'Customer pipelines and internal admin panels.',
        detail:
          "Customer relationship management — leads, pipelines, follow-ups and history in one place instead of scattered across spreadsheets and phones — plus the internal admin panels your team uses daily. Implementation and customisation of an existing CRM is equally on the table where it fits better than building new.",
      },
      {
        label: 'ISP & billing software',
        href: '/services/#isp-billing',
        icon: 'network',
        blurb: 'Subscriber, package and billing management for ISPs.',
        detail:
          "Subscriber management, package and bandwidth plans, invoicing, payment collection and expiry handling for internet service providers — built by people who also work on the network side of ISPs, so the billing system and the network it bills for are not designed in isolation from each other.",
      },
      {
        label: 'Accounting & billing',
        href: '/services/#accounting',
        icon: 'chart',
        blurb: 'Invoicing, ledgers and financial reporting.',
        detail:
          "Invoicing, receipts, ledgers, expense tracking and the financial reports your accountant actually asks for. Built to match local practice around VAT and documentation, and to export cleanly into whatever your auditor uses.",
      },
      {
        label: 'POS, inventory & warehouse',
        href: '/services/#pos-inventory',
        icon: 'cart',
        blurb: 'Point of sale with stock and warehouse control.',
        detail:
          "Point-of-sale software with real stock control behind it: multi-location inventory, purchase and transfer handling, batch and expiry where the goods need it, and warehouse management for businesses moving volume rather than single items over a counter.",
      },
      {
        label: 'Industry management systems',
        href: '/services/#industry-systems',
        icon: 'building',
        blurb: 'Hospital, school, real estate and garage systems.',
        detail:
          "Sector-specific platforms where a generic tool never quite fits: hospital and clinic management, school and campus administration, real estate and property management, and garage or service-centre systems. Each is a different workflow, and each gets modelled properly rather than relabelled from the last one.",
      },
      {
        label: 'Mobile app development',
        href: '/services/#mobile-apps',
        icon: 'mobile',
        blurb: 'Android and iOS apps tied to your systems.',
        detail:
          "Mobile applications for Android and iOS, usually as the field-facing half of a system we also build the backend for — so the app, the API and the database are designed together rather than bolted on afterwards.",
      },
      {
        label: 'Job portals & marketplaces',
        href: '/services/#job-portal',
        icon: 'search',
        blurb: 'Listing, application and matching platforms.',
        detail:
          "Job portals and listing marketplaces: employer and candidate accounts, posting and application flows, search and filtering that works at volume, and the moderation tools someone has to use every day once the site is busy.",
      },
      {
        label: 'Customer support & live chat',
        href: '/services/#live-chat',
        icon: 'chat',
        blurb: 'Ticketing and live chat on your own site.',
        detail:
          "Helpdesk ticketing and live chat running on your own infrastructure, so customer conversations and their history stay yours. Set up with the routing, canned replies and reporting a support team needs rather than a bare chat widget.",
      },
      {
        label: 'Booking, SMS & email tools',
        href: '/services/#booking-messaging',
        icon: 'mail',
        blurb: 'Online booking and bulk messaging systems.',
        detail:
          "Online booking and appointment systems, plus SMS and email campaign tools wired to local gateways — with sending practices, opt-outs and delivery reporting set up so your messages reach inboxes instead of spam folders.",
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI & automation',
    icon: 'zap',
    summary: 'Chatbots, voice agents and AI built into the software you already use — in Bangla and English.',
    image: '/services/software.svg',
    imageAlt:
      'Business modules feeding a central database, with a reporting panel drawn from it',
    items: [
      {
        label: 'AI chatbots',
        href: '/services/#ai-chatbots',
        icon: 'chat',
        blurb: 'Bangla & English bots for web, WhatsApp, Messenger.',
        detail:
          "Chatbots that answer your customers in Bangla, English or Banglish on your website, WhatsApp and Facebook Messenger — connected to your own billing, booking or product data so the answers are real, and handing over to a person with the full conversation when needed.",
      },
      {
        label: 'Voice AI agents',
        href: '/services/#voice-ai',
        icon: 'phone',
        blurb: 'AI that makes and takes calls in Bangla.',
        detail:
          "Voice agents that hold a phone or WhatsApp call in everyday Bangla for reminders, confirmations and simple support, and write a summary of every call. Built on our Amar Voice platform, scripted with your team, and piloted on a small list before anything scales.",
      },
      {
        label: 'Private AI workspaces',
        href: '/services/#ai-workspace',
        icon: 'lock',
        blurb: 'An AI assistant your organisation controls.',
        detail:
          "A shared AI assistant for your staff — drafting, translating, summarising and answering from your own documents — under accounts your organisation controls, instead of company data going into personal subscriptions. Available on SyncGPT or deployed on your own servers.",
      },
      {
        label: 'AI in your software',
        href: '/services/#ai-integration',
        icon: 'code',
        blurb: 'AI features added to your existing systems.',
        detail:
          "Search that understands questions, automatic summaries, smart replies, classification and forecasting added to the ERP, CRM or portal you already run — scoped to one measurable job at a time rather than “AI everywhere”.",
      },
      {
        label: 'Document & data automation',
        href: '/services/#document-ai',
        icon: 'clipboard',
        blurb: 'Read forms, invoices and IDs automatically.',
        detail:
          "Extracting data from forms, invoices, receipts and scanned documents into your system, with a person checking anything the software is not sure about — so data entry shrinks instead of moving to a different desk.",
      },
      {
        label: 'Workflow & WhatsApp automation',
        href: '/services/#workflow-automation',
        icon: 'refresh',
        blurb: 'Routine work and messages that run themselves.',
        detail:
          "Approvals, reminders, reports and customer messages that run on a schedule or on an event — a payment, an order, an expiry — across email, SMS and WhatsApp, so routine follow-up stops depending on someone remembering it.",
      },
    ],
  },
  {
    id: 'network',
    label: 'IT & networking',
    icon: 'network',
    summary: 'The infrastructure work we do day to day for ISPs, offices and campuses.',
    image: '/services/network.svg',
    imageAlt:
      'A network topology: an edge router feeding two switches, which fan out to endpoints and an access point',
    items: [
      {
        label: 'Network design & setup',
        href: '/services/#network-consulting',
        icon: 'network',
        blurb: 'LAN and WAN design, build-out and maintenance.',
        detail:
          "Office and multi-site LAN and WAN design and build-out: addressing, switching, routing, VLAN segmentation, links between sites, and documentation you can hand to whoever comes next. Ongoing maintenance available so the network does not quietly drift away from its own diagram.",
      },
      {
        label: 'Structured cabling',
        href: '/services/#cabling',
        icon: 'wrench',
        blurb: 'Structured LAN and WAN cabling, done to standard.',
        detail:
          "Structured cabling for offices, factories and campuses — routing, trunking, patch panels, racks and labelling done to standard and recorded, so the next fault is traced from documentation rather than by pulling ceiling tiles.",
      },
      {
        label: 'VPN & SD-WAN',
        href: '/services/#vpn-sdwan',
        icon: 'globe',
        blurb: 'Secure links between sites and remote staff.',
        detail:
          "Site-to-site VPN links between branches, remote-access VPN for staff working away from the office, and SD-WAN where multiple internet connections need to be used intelligently rather than as a manual failover someone has to remember to flip.",
      },
      {
        label: 'Firewall & security appliances',
        href: '/services/#firewall',
        icon: 'shield',
        blurb: 'Fortinet and MikroTik firewall deployment.',
        detail:
          "Firewall deployment and policy design on Fortinet and MikroTik platforms — segmentation, rule sets that can be read and audited six months later, NAT and publishing rules, and content or application control where you need it. Existing devices reviewed and tightened, not just replaced.",
      },
      {
        label: 'Network automation',
        href: '/services/#network-automation',
        icon: 'refresh',
        blurb: 'Repeatable, reviewed changes instead of manual CLI.',
        detail:
          "Configuration managed as reviewed, repeatable code rather than typed live into a device. Changes are dry-run first, applied in a controlled window, and shipped with a rollback — the discipline carrier networks use, available at any size.",
      },
      {
        label: 'Managed Wi-Fi',
        href: '/services/#wifi',
        icon: 'wifi',
        blurb: 'Coverage planning and managed access points.',
        detail:
          "Coverage planning, access point selection and placement, segregated guest networks, and ongoing management of the controller — for offices, campuses and public areas.",
      },
      {
        label: 'Monitoring & alerting',
        href: '/services/#monitoring',
        icon: 'chart',
        blurb: 'Know a service is down before your customers do.',
        detail:
          "Host, service and network monitoring with alerting that reaches a human, so an outage is something you are told about rather than something a customer reports to you.",
      },
      {
        label: 'CCTV & access control',
        href: '/services/#cctv',
        icon: 'camera',
        blurb: 'Surveillance and door access, on a network built for it.',
        detail:
          "IP surveillance and door access control, planned alongside the network they run on — camera placement and storage sizing worked out in advance, recorders on a segmented VLAN rather than sharing the office LAN, and remote viewing that does not mean exposing a recorder to the open internet.",
      },
      {
        label: 'IP telephony & PABX',
        href: '/services/#telephony',
        icon: 'phone',
        blurb: 'IP PABX systems and extension management.',
        detail:
          "IP telephony and PABX deployment: extensions, IVR menus, call groups, recording and call reporting, with trunks connected to your provider. Built on open platforms you are not locked into, and with the call quality treated as a network problem — because it usually is.",
      },
    ],
  },
  {
    id: 'datacenter',
    label: 'Cloud & data center',
    icon: 'cloud',
    summary:
      'Virtualisation, storage, colocation and the operational discipline that keeps them running.',
    image: '/services/datacenter.svg',
    imageAlt:
      'Two equipment racks with cold-aisle airflow between them, linked upward to cloud capacity',
    items: [
      {
        label: 'Server virtualisation',
        href: '/services/#virtualisation',
        icon: 'layers',
        blurb: 'VMware, Hyper-V and Proxmox environments.',
        detail:
          "Physical and virtual server management, and the virtualisation layer under it — VMware, Hyper-V or Proxmox — sized, built and maintained. Includes consolidating existing physical machines onto a hypervisor without turning a hardware failure into a single point of failure for everything at once.",
      },
      {
        label: 'SAN & NAS storage',
        href: '/services/#storage',
        icon: 'database',
        blurb: 'Shared block and file storage, sized properly.',
        detail:
          "Shared storage design and deployment — SAN for block storage behind a virtualisation cluster, NAS for file shares and archives — with capacity, redundancy and growth headroom worked out from your actual data rather than from a vendor's default configuration.",
      },
      {
        label: 'Cloud migration & storage',
        href: '/services/#cloud-migration',
        icon: 'cloud',
        blurb: 'AWS, Azure and GCP adoption and migration.',
        detail:
          "Moving workloads to AWS, Azure or Google Cloud, or to a hybrid of cloud and your own hardware. We will tell you plainly which workloads are worth moving and which are cheaper and simpler where they are — a migration that raises your monthly bill for no operational gain is not a win.",
      },
      {
        label: 'Containers & DevOps',
        href: '/services/#containers',
        icon: 'box',
        blurb: 'Docker and Kubernetes, with deployment pipelines.',
        detail:
          "Containerising applications with Docker and running them under Kubernetes where the scale justifies it, plus the build and deployment pipelines around them so releases are repeatable rather than a manual ritual. Where Kubernetes would be more complexity than you need, we will say so.",
      },
      {
        label: 'Colocation & DC design',
        href: '/services/#colocation',
        icon: 'building',
        blurb: 'Rack, room and tiered data centre planning.',
        detail:
          "Colocation placement and rack planning, through to full room design against Tier I–IV expectations — layout, containment, cable management, capacity planning and the documentation that makes the room auditable rather than just tidy.",
      },
      {
        label: 'Power, cooling & energy',
        href: '/services/#power-cooling',
        icon: 'zap',
        blurb: 'UPS, PDUs, cooling and energy management.',
        detail:
          "UPS and generator planning, PDU layout, cooling design and airflow containment, and energy management so the room's power draw is measured and understood rather than discovered when a breaker trips.",
      },
      {
        label: 'Disaster recovery & BCP',
        href: '/services/#disaster-recovery',
        icon: 'refresh',
        blurb: 'DRaaS and business continuity you have rehearsed.',
        detail:
          "Disaster recovery and business continuity planning, including disaster-recovery-as-a-service replication to a second site. Defined recovery point and recovery time targets, written procedures, and — the part most plans skip — an actual rehearsal, because a DR plan nobody has tested is a document, not a capability.",
      },
      {
        label: 'Data center monitoring',
        href: '/services/#dcim',
        icon: 'monitor',
        blurb: 'DCIM, Zabbix and PRTG with automated response.',
        detail:
          "Infrastructure monitoring across the facility — DCIM for the room itself, Zabbix or PRTG for hosts and services — with dashboards that mean something and alerting that reaches the right person. Routine, well-understood conditions can be handled by automated responses so a human is only pulled in when judgement is genuinely needed.",
      },
    ],
  },
  {
    id: 'security',
    label: 'Cyber security',
    icon: 'shield',
    summary: 'Finding what is exposed, hardening what is weak, and being able to prove it.',
    image: '/services/security.svg',
    imageAlt:
      'A shield over a scanning sweep, with traffic passing on one side and being dropped on the other',
    items: [
      {
        label: 'Penetration testing (VAPT)',
        href: '/services/#vapt',
        icon: 'search',
        blurb: 'Vulnerability assessment and penetration testing.',
        detail:
          "Vulnerability assessment and penetration testing against your applications, servers and network, carried out under a scope agreed in writing. You get findings ranked by real exploitability with reproduction steps and fixes — not a raw scanner export with every informational notice inflated into a finding.",
      },
      {
        label: 'Security hardening',
        href: '/services/#security',
        icon: 'shield',
        blurb: 'Baseline hardening for servers and network gear.',
        detail:
          "A baseline security pass across servers and network gear: SSH and access hardening, firewall policy, brute-force protection, service exposure review, and credential hygiene. This is solid foundational work — it is not a full security operations centre, and we will say so.",
      },
      {
        label: 'Endpoint & ransomware protection',
        href: '/services/#endpoint',
        icon: 'lock',
        blurb: 'Protection for the laptops and desktops people use.',
        detail:
          "Endpoint protection deployed and actually managed — policies, update compliance and alert review — plus the layer ransomware defence really depends on: isolated, offline-capable backups and a restore procedure that has been tested, so an infection is an inconvenience rather than an extinction event.",
      },
      {
        label: 'Secure email & encryption',
        href: '/services/#encryption',
        icon: 'mail',
        blurb: 'Mail authentication and data encryption.',
        detail:
          "Securing mail properly: SPF, DKIM and DMARC set and enforced so your domain cannot be trivially spoofed, transport encryption confirmed, and gateway filtering tuned. Alongside it, encryption for data at rest on servers, backups and portable devices.",
      },
      {
        label: 'Audits & compliance',
        href: '/services/#compliance',
        icon: 'clipboard',
        blurb: 'ISO 27001, PCI-DSS and GDPR readiness.',
        detail:
          "Security audits mapped against ISO 27001, PCI-DSS or GDPR, showing where you stand today, what the gaps are, and what closing each one actually involves. We prepare and evidence the technical controls; formal certification is issued by an accredited body, not by us.",
      },
      {
        label: 'DDoS & threat protection',
        href: '/services/#ddos',
        icon: 'zap',
        blurb: 'NGFW, IPS and DDoS mitigation.',
        detail:
          "Next-generation firewall and intrusion prevention deployment, and DDoS mitigation planned before you need it — upstream scrubbing arrangements, rate limiting and traffic profiles established while the link is healthy, because an attack in progress is a bad time to start designing the response.",
      },
    ],
  },
  {
    id: 'growth',
    label: 'Digital & media',
    icon: 'search',
    summary: 'Getting found by the right people — and looking right when they arrive.',
    image: '/services/growth.svg',
    imageAlt:
      'A rising traffic chart under a magnifier, with a search result list and social reach nodes',
    items: [
      {
        label: 'Search engine optimisation',
        href: '/services/#seo',
        icon: 'search',
        blurb: 'Technical SEO and on-page fundamentals.',
        detail:
          "Technical SEO done first — site speed, crawlability, structure, metadata, mobile behaviour — then on-page work on the content that actually drives enquiries. Reported honestly, including when a keyword is not worth chasing.",
      },
      {
        label: 'Social media marketing',
        href: '/services/#social-media',
        icon: 'chat',
        blurb: 'Page management and paid social campaigns.',
        detail:
          "Social media presence run as a working channel rather than a posting quota: page setup and management, a content plan tied to what you actually sell, and paid campaigns with targeting and budget matched to the audience you are trying to reach.",
      },
      {
        label: 'Digital marketing',
        href: '/services/#marketing',
        icon: 'chart',
        blurb: 'Campaign setup and ongoing management.',
        detail:
          "Campaign setup and ongoing management across search and social, with budgets and targeting matched to what you are actually selling and to whom.",
      },
      {
        label: 'Analytics & reporting',
        href: '/services/#analytics',
        icon: 'monitor',
        blurb: 'Measurement that answers a real question.',
        detail:
          "Analytics and conversion tracking configured so the numbers answer a real business question, and reporting that says what changed and why rather than dumping a dashboard on you.",
      },
      {
        label: 'Branding & graphic design',
        href: '/services/#branding',
        icon: 'palette',
        blurb: 'Logo, identity, packaging and print.',
        detail:
          "Logo and brand identity work, and the material that carries it: packaging, posters, brochures, profiles and social templates. Delivered with the source files and a short usage guide, so your identity stays consistent whoever produces the next piece.",
      },
      {
        label: 'Video & motion graphics',
        href: '/services/#video',
        icon: 'video',
        blurb: 'Pre-production through to final revision.',
        detail:
          "Video production end to end — concept and pre-production, filming, editing, colour and sound, then a review and revision round before delivery — plus motion graphics and animated explainers where a camera is not the right tool for the job.",
      },
    ],
  },
  {
    id: 'consulting',
    label: 'IT consultancy & managed services',
    icon: 'compass',
    summary: 'For teams that need capacity and direction rather than a single project.',
    image: '/services/consulting.svg',
    imageAlt:
      'A staged roadmap with milestone markers, a compass, and an SLA response-time panel',
    items: [
      {
        label: 'IT planning & gap analysis',
        href: '/services/#it-planning',
        icon: 'compass',
        blurb: 'Where you are, where you need to be, what it costs.',
        detail:
          "A structured look at the systems you run today against what the business actually needs — the gaps, the risks, the things quietly costing you money — written up as a prioritised roadmap with indicative costs, so you can decide what to do in what order instead of reacting to whatever breaks next.",
      },
      {
        label: 'Managed IT support',
        href: '/services/#managed-support',
        icon: 'clock',
        blurb: 'SLA-based support for your whole IT estate.',
        detail:
          "Ongoing IT support under a written SLA: defined response times, an agreed scope, proactive maintenance and monitoring rather than purely reactive call-outs, and monthly reporting on what was actually done. Your IT department, or the part of it you do not want to staff internally.",
      },
      {
        label: 'Remote support & outsourcing',
        href: '/services/#remote-support',
        icon: 'monitor',
        blurb: 'Remote helpdesk and outsourced engineering.',
        detail:
          "Remote helpdesk for staff and outsourced engineering capacity for organisations without a full in-house team — covering servers, networks and end-user support, with on-site attendance arranged when a problem genuinely needs hands on hardware.",
      },
      {
        label: 'Training & knowledge transfer',
        href: '/services/#training',
        icon: 'book',
        blurb: 'Handover that leaves your team able to run it.',
        detail:
          "Practical training and structured handover for your own team — on the systems we built, or on the technology generally. The goal is a team that can run and extend the thing without calling us for every change, and documentation they will actually use.",
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
  { href: '/industries/', label: 'Industries' },
  { href: '/ventures/', label: 'Ventures' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];
