import type { IconName } from './icons';

/**
 * Industries LogiXhare builds for. Drives /industries/, each
 * /industries/<slug>/ page, the homepage industry grid and the Industries
 * nav menu.
 *
 * These are sectors whose systems genuinely differ — not a claim about who we
 * have already invoiced. Never add client names, logos or numbers here
 * without the client's written OK.
 *
 * `services` are category ids from nav.ts; `ventures` are slugs from
 * ventures.ts. Both are checked at build time by the pages that read them.
 */

export interface Industry {
  slug: string;
  title: string;
  icon: IconName;
  /** One line for cards and the menu. */
  short: string;
  /** Opening paragraph of the detail page. */
  intro: string;
  /** What goes wrong today, in the customer's words. */
  challenges: string[];
  /** What we build for it. */
  solutions: { icon: IconName; title: string; body: string }[];
  services: string[];
  ventures: string[];
  /** Kinds of organisation inside the industry. */
  segments: string[];
  faqs: { q: string; a: string }[];
}

export const industries: Industry[] = [
  {
    slug: 'isp-telecom',
    title: 'ISPs & telecom',
    icon: 'network',
    short: 'Billing, RADIUS, NOC monitoring and DDoS protection for internet providers.',
    intro:
      'An ISP is a network business and a billing business at the same time, and most tools only understand one of them. We work on both sides — routers and BGP on one, subscribers and collections on the other — so the systems we build for ISPs fit how an ISP actually runs.',
    challenges: [
      'Payments, RADIUS and routers live in separate tools, so paid customers stay cut off and unpaid ones stay online.',
      'Resellers and zones each keep their own numbers, and head office cannot see the real picture.',
      'An outage or a DDoS is found by customers calling, not by the NOC.',
      'Support staff spend the day answering “what is my bill?” and “when does my line expire?”.',
    ],
    solutions: [
      { icon: 'network', title: 'Billing, RADIUS & MikroTik in one', body: 'Subscribers enabled on payment and cut at expiry automatically, with zones and resellers on the same system.' },
      { icon: 'chart', title: 'NOC monitoring', body: 'Every router, OLT and switch checked each minute, with SMS alerts to the engineer on duty.' },
      { icon: 'shield', title: 'DDoS detection & mitigation', body: 'Tidegard reads your flow data, catches attacks and mitigates over BGP with your approval.' },
      { icon: 'zap', title: 'Support bot & voice reminders', body: 'Customers check bills and expiry on WhatsApp; Amar Voice calls them before the line is cut.' },
      { icon: 'wrench', title: 'Network engineering', body: 'Design, automation and hardening done the way carrier networks are run.' },
    ],
    services: ['network', 'security', 'datacenter'],
    ventures: ['isp-billing', 'tidegard', 'industry-chatbots', 'amar-voice'],
    segments: ['Local and area ISPs', 'Nationwide ISPs (NISP)', 'Resellers & zone operators', 'IIG / IXP / data centres', 'Corporate connectivity providers'],
    faqs: [
      { q: 'Can you work with our existing billing data?', a: 'Yes. We import customers, packages and dues from your current system or spreadsheets, and run both side by side until the numbers match.' },
      { q: 'Do you only sell software?', a: 'No. We also design and fix the network itself — routing, BGP, MikroTik and monitoring — which is why the software fits the network.' },
    ],
  },
  {
    slug: 'retail-ecommerce',
    title: 'Retail & eCommerce',
    icon: 'cart',
    short: 'POS, stock, online stores and order bots for shops and showrooms.',
    intro:
      'A shop needs the counter, the stock room and the online store to agree with each other. We connect them — point of sale, inventory, website and customer messages — on hosting sized for a sale day, not an average one.',
    challenges: [
      'Stock is counted from memory, and losses show up only at the month end.',
      'Branches cannot see each other’s stock, so one sells out while another overflows.',
      'The online store and the shop keep different prices and different stock.',
      'Customers ask about orders on Messenger and wait hours for a reply.',
    ],
    solutions: [
      { icon: 'cart', title: 'POS & inventory', body: 'Fast billing, stock by branch, purchases and dues, with the owner’s numbers on their phone.' },
      { icon: 'globe', title: 'eCommerce websites', body: 'Online stores tied to the same stock and prices as the counter.' },
      { icon: 'zap', title: 'Order & product chatbot', body: 'Prices, order status and delivery updates on WhatsApp and Messenger, day and night.' },
      { icon: 'chart', title: 'Digital marketing', body: 'Search, social and analytics, measured against sales rather than likes.' },
    ],
    services: ['web', 'software', 'growth'],
    ventures: ['pos', 'industry-chatbots', 'amar-voice'],
    segments: ['Single shops & showrooms', 'Multi-branch retail chains', 'Pharmacies', 'Online & Facebook sellers', 'Wholesale & distributors'],
    faqs: [
      { q: 'Can the online store share stock with the shop?', a: 'Yes. The website and the POS read the same stock and prices.' },
      { q: 'Do you handle Facebook-only sellers?', a: 'Yes — an order bot on Messenger and WhatsApp plus a simple order and stock system is often the right first step.' },
    ],
  },
  {
    slug: 'manufacturing-rmg',
    title: 'Manufacturing & RMG',
    icon: 'box',
    short: 'RMG ERP, production and store flows, and factory networks.',
    intro:
      'Garment and manufacturing businesses run on orders, materials, production lines and buyers’ deadlines. We build ERP that follows the factory floor as it really works, and the networks and cameras underneath it.',
    challenges: [
      'Order, store and production data live in spreadsheets that never quite agree.',
      'Costing is done after the fact, so the real margin of an order is a guess.',
      'Attendance and overtime are entered by hand, and payroll takes days.',
      'The factory network and CCTV were installed piece by piece and nobody owns them.',
    ],
    solutions: [
      { icon: 'database', title: 'RMG ERP', body: 'Order, merchandising, store, production and costing modelled on your floor.' },
      { icon: 'users', title: 'HRM & payroll', body: 'Attendance devices, shifts, overtime and payroll with your own rules.' },
      { icon: 'wifi', title: 'Factory networks & CCTV', body: 'Structured cabling, Wi-Fi across the floor, cameras and access control.' },
      { icon: 'chart', title: 'Management dashboards', body: 'Line output, shipment status and costs on one screen for the owners.' },
    ],
    services: ['software', 'network', 'datacenter'],
    ventures: ['pos', 'syncgpt'],
    segments: ['Garment factories', 'Buying houses', 'Textile & accessories', 'Light manufacturing', 'Packaging & printing'],
    faqs: [
      { q: 'Will the ERP follow our process or force a new one?', a: 'It follows yours. We model your order, store and production flow first, then build around it.' },
      { q: 'Can it work with our attendance machines?', a: 'Common attendance devices can be connected; tell us the model and we will confirm.' },
    ],
  },
  {
    slug: 'healthcare',
    title: 'Healthcare & hospitals',
    icon: 'heart',
    short: 'Hospital systems, appointment bots and the uptime clinical work needs.',
    intro:
      'Clinics and hospitals need patient records that are private, appointment systems that do not double-book, and networks that do not go down during a shift. We build and run all three.',
    challenges: [
      'Phones ring all day with “is the doctor in today?” and serial bookings.',
      'Patient records are on paper or spread across machines with no backup.',
      'Billing, pharmacy and lab do not talk to each other.',
      'A network or server failure stops reception and the lab together.',
    ],
    solutions: [
      { icon: 'clipboard', title: 'Hospital management system', body: 'Registration, appointments, billing, pharmacy and lab on one system.' },
      { icon: 'zap', title: 'Appointment & report bot', body: 'Doctor schedules, serial booking and report-ready messages on WhatsApp.' },
      { icon: 'phone', title: 'Reminder calls', body: 'Amar Voice confirms appointments by phone in Bangla, the day before.' },
      { icon: 'lock', title: 'Secure records & backup', body: 'Access control, encryption and backups that are actually tested.' },
    ],
    services: ['software', 'security', 'hosting'],
    ventures: ['industry-chatbots', 'amar-voice', 'pos'],
    segments: ['Hospitals', 'Clinics & chambers', 'Diagnostic centres', 'Pharmacies', 'Dental & eye care'],
    faqs: [
      { q: 'Is patient data kept private?', a: 'Access is limited by role, data is encrypted in transit and backed up, and we document who can see what.' },
      { q: 'Can patients book on WhatsApp?', a: 'Yes. The appointment bot books serials on WhatsApp and the website, into the same schedule your reception uses.' },
    ],
  },
  {
    slug: 'education',
    title: 'Education & eLearning',
    icon: 'book',
    short: 'School and campus systems, admission bots and reliable lab networks.',
    intro:
      'Schools, colleges, universities and coaching centres juggle admissions, fees, results and notices for thousands of students and guardians. We build the systems that handle it and the networks a full computer lab needs.',
    challenges: [
      'Admission season floods the office with the same questions.',
      'Fees, results and attendance are kept in different places.',
      'Guardians hear about notices late, or not at all.',
      'The campus Wi-Fi gives up as soon as a full class connects.',
    ],
    solutions: [
      { icon: 'clipboard', title: 'School & campus management', body: 'Admissions, fees, attendance, exams and results in one system.' },
      { icon: 'zap', title: 'Admission chatbot', body: 'Dates, fees, seats and results answered on the website and WhatsApp.' },
      { icon: 'chat', title: 'SMS & notices', body: 'Notices, results and fee reminders sent to guardians automatically.' },
      { icon: 'wifi', title: 'Campus networks', body: 'Wi-Fi and lab networks designed for a full room of students.' },
    ],
    services: ['software', 'network', 'web'],
    ventures: ['industry-chatbots', 'syncgpt', 'amar-voice'],
    segments: ['Schools & madrasas', 'Colleges & universities', 'Coaching centres', 'Training institutes', 'eLearning platforms'],
    faqs: [
      { q: 'Can guardians get results and notices by SMS?', a: 'Yes, sent automatically from the same system that stores them.' },
      { q: 'Can you fix our computer lab network?', a: 'Yes — we design Wi-Fi and lab networks for a full room of students, and monitor them.' },
    ],
  },
  {
    slug: 'banking-finance',
    title: 'Banking & financial services',
    icon: 'lock',
    short: 'Hardened infrastructure, security testing and compliance evidence.',
    intro:
      'Banks, insurers and financial companies are judged on security and audit evidence as much as on features. We harden, test and monitor the infrastructure, and write down what we did in a form an auditor can use.',
    challenges: [
      'Audits ask for evidence that nobody has collected.',
      'Branch networks and VPNs grew over years without a design.',
      'Staff use personal AI tools with customer data.',
      'An attack on the public website is noticed only when customers complain.',
    ],
    solutions: [
      { icon: 'shield', title: 'VAPT & hardening', body: 'Penetration tests, fixes and re-tests, with reports written for auditors.' },
      { icon: 'network', title: 'Branch networks & SD-WAN', body: 'Secure, documented connectivity between head office and branches.' },
      { icon: 'chart', title: 'Monitoring & DDoS protection', body: 'Traffic monitoring and attack detection on your own infrastructure.' },
      { icon: 'chat', title: 'A controlled AI workspace', body: 'SyncGPT accounts under your control instead of personal AI subscriptions.' },
    ],
    services: ['security', 'network', 'datacenter'],
    ventures: ['tidegard', 'syncgpt'],
    segments: ['Banks', 'Insurance companies', 'Fintech & payment firms', 'Brokerage houses', 'Leasing & finance companies'],
    faqs: [
      { q: 'Do you provide reports an auditor can use?', a: 'Yes. Testing and hardening work is delivered with written evidence in a form auditors expect.' },
      { q: 'Can systems stay on our own premises?', a: 'Yes. Monitoring, AI and other tools can be deployed on your own servers.' },
    ],
  },
  {
    slug: 'government',
    title: 'Government & public sector',
    icon: 'building',
    short: 'Auditable systems, in-country infrastructure and procurement-ready documents.',
    intro:
      'Public bodies need systems that are documented, auditable and hosted in the country, delivered through a procurement process. We build to that standard and hand over the paperwork with the system.',
    challenges: [
      'Systems arrive without documentation, so nobody can maintain them later.',
      'Data must stay in Bangladesh.',
      'Citizens wait in queues for information that could be online.',
      'Ageing servers and networks with no monitoring.',
    ],
    solutions: [
      { icon: 'clipboard', title: 'Service portals', body: 'Online applications, tracking and notices for citizens.' },
      { icon: 'server', title: 'In-country hosting & data centre', body: 'Servers, storage and backup kept inside Bangladesh.' },
      { icon: 'shield', title: 'Security & audit', body: 'Hardening, testing and the written evidence procurement asks for.' },
      { icon: 'chart', title: 'Network monitoring', body: 'Uptime and traffic visibility across offices.' },
    ],
    services: ['datacenter', 'security', 'web'],
    ventures: ['tidegard', 'syncgpt'],
    segments: ['Ministries & directorates', 'Local government', 'Public universities', 'Autonomous bodies', 'Projects & programmes'],
    faqs: [
      { q: 'Do you work through tenders?', a: 'Yes. We prepare the technical documentation procurement asks for.' },
      { q: 'Where is the data hosted?', a: 'Inside Bangladesh, on our infrastructure or yours.' },
    ],
  },
  {
    slug: 'real-estate',
    title: 'Real estate & construction',
    icon: 'pin',
    short: 'Project and property systems, sales bots, and site connectivity.',
    intro:
      'Developers and construction firms sell flats and run sites at the same time. We build the property and project systems for the office, and the connectivity and cameras for the sites.',
    challenges: [
      'Leads from Facebook and calls are lost between sales staff.',
      'Instalment schedules and dues are tracked in spreadsheets.',
      'Site progress is reported by phone call and photos in chat groups.',
      'Sites have no reliable internet or camera coverage.',
    ],
    solutions: [
      { icon: 'users', title: 'Sales CRM', body: 'Every lead, visit and follow-up in one place.' },
      { icon: 'clipboard', title: 'Property & instalment system', body: 'Units, bookings, instalments and dues per customer.' },
      { icon: 'zap', title: 'Project chatbot', body: 'Project details, availability and site-visit booking, any time.' },
      { icon: 'camera', title: 'Site connectivity & CCTV', body: 'Internet and cameras on site, viewable from the office.' },
    ],
    services: ['software', 'network', 'growth'],
    ventures: ['industry-chatbots', 'amar-voice'],
    segments: ['Developers', 'Construction companies', 'Property management', 'Housing projects', 'Building materials sellers'],
    faqs: [
      { q: 'Can leads from Facebook go straight into the CRM?', a: 'Yes. Leads from your page, website and calls land in one list with an owner and a follow-up date.' },
      { q: 'Can we watch the site from the office?', a: 'Yes, with on-site internet and cameras you can view remotely.' },
    ],
  },
  {
    slug: 'restaurants-hospitality',
    title: 'Restaurants & hospitality',
    icon: 'users',
    short: 'Restaurant POS, online ordering, bookings and guest Wi-Fi.',
    intro:
      'Restaurants, cafés and hotels live on fast service and repeat guests. We set up the counter, the kitchen orders, online ordering and the guest Wi-Fi so the team can focus on the guests.',
    challenges: [
      'Orders get lost between the counter and the kitchen at rush hour.',
      'Ingredient stock and wastage are not tracked.',
      'Bookings and delivery orders come in on five different apps and phones.',
      'Guest Wi-Fi is slow and shares the network with the billing PC.',
    ],
    solutions: [
      { icon: 'cart', title: 'Restaurant POS', body: 'Table and takeaway orders, kitchen tickets, VAT and daily closing.' },
      { icon: 'box', title: 'Stock & recipes', body: 'Ingredient stock used per dish, with wastage and purchase tracking.' },
      { icon: 'zap', title: 'Booking & order bot', body: 'Table bookings and orders taken on WhatsApp and Messenger.' },
      { icon: 'wifi', title: 'Guest Wi-Fi', body: 'Fast guest Wi-Fi, kept apart from your business network.' },
    ],
    services: ['software', 'network', 'web'],
    ventures: ['pos', 'industry-chatbots', 'onekle'],
    segments: ['Restaurants & cafés', 'Food chains & cloud kitchens', 'Hotels & resorts', 'Bakeries & sweet shops', 'Catering'],
    faqs: [
      { q: 'Does the POS print kitchen tickets?', a: 'Yes, to a kitchen printer, separated by section if you need it.' },
      { q: 'Can guest Wi-Fi be kept apart from our billing computers?', a: 'Yes. Guest Wi-Fi runs on its own network so guests never see your business devices.' },
    ],
  },
  {
    slug: 'ngo-microfinance',
    title: 'NGOs & microfinance',
    icon: 'compass',
    short: 'Member, loan and field systems, and calls that reach members.',
    intro:
      'NGOs and microfinance institutions work through field officers and thousands of members, often far from good internet. We build member and loan systems that field teams can use, and reminders that reach members in Bangla.',
    challenges: [
      'Collections are written in field books and entered days later.',
      'Donor reports take weeks to put together.',
      'Members miss instalment dates because nobody reminded them.',
      'Branch offices have weak connections and no IT staff.',
    ],
    solutions: [
      { icon: 'database', title: 'Member & loan system', body: 'Members, savings, loans and collections by branch and field officer.' },
      { icon: 'phone', title: 'Bangla reminder calls', body: 'Amar Voice reminds members of instalments and meetings by phone.' },
      { icon: 'chart', title: 'Donor & management reports', body: 'Reports generated from live data instead of assembled by hand.' },
      { icon: 'wifi', title: 'Branch connectivity', body: 'Reliable connections and remote support for branch offices.' },
    ],
    services: ['software', 'network', 'consulting'],
    ventures: ['amar-voice', 'syncgpt'],
    segments: ['Microfinance institutions', 'NGOs & INGO projects', 'Cooperatives & samities', 'Social enterprises', 'Foundations'],
    faqs: [
      { q: 'Can field officers use it with weak internet?', a: 'We design the field side for the connections your officers actually have, and test it there.' },
      { q: 'Can the reminder calls speak local Bangla?', a: 'Amar Voice speaks everyday Bangla; scripts are written with your team.' },
    ],
  },
  {
    slug: 'corporate',
    title: 'Corporate & SMEs',
    icon: 'monitor',
    short: 'Managed IT, business email, ERP and an AI workspace for growing companies.',
    intro:
      'Growing companies need email that works, files that are backed up, a network that stays up and software that fits the business — without hiring a full IT department. We become that department.',
    challenges: [
      'IT is “whoever knows computers” in the office.',
      'Email, files and passwords are spread across personal accounts.',
      'Accounts, HR and sales each use a different spreadsheet.',
      'No backups until the day they are needed.',
    ],
    solutions: [
      { icon: 'wrench', title: 'Managed IT support', body: 'A team that looks after your computers, network and accounts.' },
      { icon: 'mail', title: 'Business email & hosting', body: 'Professional email, website and backups on our own platform.' },
      { icon: 'database', title: 'ERP, HRM & CRM', body: 'Business software modelled on your own process.' },
      { icon: 'chat', title: 'AI for your team', body: 'A SyncGPT workspace for writing, translating and finding answers.' },
    ],
    services: ['consulting', 'hosting', 'software'],
    ventures: ['syncgpt', 'industry-chatbots'],
    segments: ['SMEs', 'Corporate offices', 'Trading companies', 'Agencies & consultancies', 'Startups'],
    faqs: [
      { q: 'Can you be our whole IT department?', a: 'Yes. Managed IT covers your computers, network, email, backups and accounts under one agreement.' },
      { q: 'We have no IT staff — is that a problem?', a: 'No. That is exactly who managed IT is for.' },
    ],
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
