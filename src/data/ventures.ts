import type { IconName } from './icons';

/**
 * LogiXhare's own products ("ventures"). Drives /ventures/, each
 * /ventures/<slug>/ page, the homepage ventures grid, the Ventures nav menu
 * and the "products that fit" blocks on industry and service pages.
 *
 * Tidegard keeps its own, much larger section at /tidegard/ — its entry here
 * sets `href` so every card links there instead of to a generated page.
 *
 * Status is shown on every card. Keep it honest: "Coming soon" means there is
 * nothing a customer can use yet.
 */

export type VentureStatus = 'Live' | 'In pilot' | 'On request' | 'Coming soon';

export interface VentureFeature {
  icon: IconName;
  title: string;
  body: string;
}

export interface Venture {
  slug: string;
  name: string;
  icon: IconName;
  status: VentureStatus;
  /** One line under the name on cards. */
  tagline: string;
  /** Short paragraph for cards and the hub. */
  summary: string;
  /** Set only when the product lives somewhere other than /ventures/<slug>/. */
  href?: string;
  /** External product site, if it has one. */
  site?: { label: string; href: string };
  /** Detail page. */
  problem: string;
  features: VentureFeature[];
  steps: { title: string; body: string }[];
  /** Industry slugs from industries.ts. */
  industries: string[];
  faqs: { q: string; a: string }[];
  /** Two-sided benefits: the business, and the business's own customers. */
  forYou?: string[];
  forCustomers?: string[];
  /** Systems it connects to. */
  integrations?: string[];
  /** How it is deployed. */
  deploy?: string;
}

export const ventures: Venture[] = [
  {
    slug: 'isp-billing',
    name: 'ISP Billing & NOC',
    icon: 'network',
    status: 'Live',
    tagline: 'Billing, RADIUS and network operations for ISPs, in one system',
    summary:
      'Subscriber billing, PPPoE/RADIUS control, MikroTik routers, resellers and zones, SMS alerts and NOC monitoring — built by people who run ISP networks, and in daily use by operators in Bangladesh.',
    problem:
      'Most ISPs in Bangladesh run billing in one tool, RADIUS in another, router changes by hand and payments in a notebook — so a customer who paid stays cut off, a customer who did not stays online, and nobody can see a zone’s real numbers. The billing system and the network it bills for were never designed together.',
    features: [
      { icon: 'users', title: 'Customers & packages', body: 'Home and corporate customers, packages and billing cycles, prorated package changes, and a clear record of every payment, discount and adjustment — each with the reason and the person who made it.' },
      { icon: 'network', title: 'RADIUS & MikroTik', body: 'PPPoE accounts are enabled the moment a payment lands and cut at the exact expiry time. Add a router and its existing users are imported automatically.' },
      { icon: 'building', title: 'Zones, resellers & POPs', body: 'POP incharges and layered zones or resellers, each seeing only their own customers, routers and collections — with rates and commissions settled up the layers.' },
      { icon: 'chat', title: 'SMS & OTP', body: 'Welcome, bill, payment, expiry and ticket messages go out automatically through your SMS gateway, and staff logins can require a one-time code.' },
      { icon: 'chart', title: 'NOC monitoring', body: 'Ping and SNMP checks across routers, OLTs and switches every minute, a live network tree, and alert SMS to the right engineer when something drops.' },
      { icon: 'clipboard', title: 'Reports & audit', body: 'Collection, due, cash-flow and return reports, plus an audit log of who changed what — so the numbers a manager sees are the numbers that happened.' },
    ],
    steps: [
      { title: 'Map your network', body: 'We list your routers, POPs, zones and packages, and how money moves today.' },
      { title: 'Import and connect', body: 'Customers and routers are imported; RADIUS is pointed at the new system alongside the old one.' },
      { title: 'Run in parallel', body: 'Both systems run side by side until the numbers match, then we switch.' },
      { title: 'Operate and grow', body: 'Your team runs it day to day; we support, update and add what you need.' },
    ],
    industries: ['isp-telecom', 'corporate'],
    forYou: ['One system for billing, RADIUS, routers and resellers', 'Lines cut and restored on time, without staff doing it by hand', 'Real collection and due figures per zone and POP', 'Alerts before customers notice an outage'],
    forCustomers: ['Service restored the moment a payment is recorded', 'SMS when a bill is due, paid or about to expire', 'Faster answers on bills and tickets'],
    integrations: ['MikroTik RouterOS', 'FreeRADIUS / PPPoE', 'SMS gateways', 'OLT & switch SNMP', 'WhatsApp'],
    deploy: 'Hosted by LogiXhare, or installed on your own server.',
    faqs: [
      { q: 'Do we have to replace our routers?', a: 'No. It works with the MikroTik routers you already run, over the connection you already have to them.' },
      { q: 'Can resellers and zone managers use it?', a: 'Yes. Each layer logs in and sees only its own customers, collections and routers.' },
      { q: 'Where does it run?', a: 'On a server we host for you, or on your own server if you prefer to keep it in-house.' },
    ],
  },
  {
    slug: 'tidegard',
    name: 'Tidegard',
    icon: 'shield',
    status: 'Live',
    href: '/tidegard/',
    tagline: 'DDoS detection and traffic monitoring for networks',
    summary:
      'Reads your routers’ IPFIX or sFlow data, catches attacks, alerts your NOC and mitigates over BGP with a NOC lead’s approval. Runs on your own server.',
    problem: '',
    features: [],
    steps: [],
    industries: ['isp-telecom', 'banking-finance', 'government'],
    faqs: [],
  },
  {
    slug: 'amar-voice',
    name: 'Amar Voice',
    icon: 'phone',
    status: 'In pilot',
    tagline: 'A Bangla AI voice agent that talks on calls',
    summary:
      'An AI that holds a real phone or WhatsApp conversation in Bangla — reminders, follow-ups, confirmations and simple support — and writes a short report after every call.',
    problem:
      'A lot of work in Bangladesh still happens by calling people one by one: bill reminders, appointment confirmations, delivery follow-ups, “is the line working now?” checks. It takes staff hours, the calls happen late or not at all, and nothing is written down afterwards.',
    features: [
      { icon: 'phone', title: 'Natural Bangla calls', body: 'Speaks and understands everyday Bangla on a live call, with short, natural replies rather than a menu of key presses.' },
      { icon: 'chat', title: 'WhatsApp calls & voice notes', body: 'Calls or sends voice notes over WhatsApp, which is where most customers in Bangladesh already are.' },
      { icon: 'clipboard', title: 'A report after every call', body: 'Each call ends with a written summary: who was called, what they said, and what needs a person’s attention.' },
      { icon: 'users', title: 'Your contacts, your script', body: 'You set who it calls and what each call is for — the greeting, the purpose and when to hand over to a human.' },
      { icon: 'mobile', title: 'Phone app', body: 'Start calls, see reports and manage contacts from an Android app or the web.' },
      { icon: 'lock', title: 'Human in charge', body: 'It never promises money, discounts or anything outside its script; those calls are passed to your team.' },
    ],
    steps: [
      { title: 'Pick one call type', body: 'Start with one repetitive call — bill reminders, appointment confirmations or follow-ups.' },
      { title: 'Write the script together', body: 'We agree what the agent says, what it must never say, and when it hands over.' },
      { title: 'Pilot on a small list', body: 'A few dozen real calls, reviewed one by one, before anything scales.' },
      { title: 'Scale what works', body: 'Add more call types once the first one is trusted.' },
    ],
    industries: ['isp-telecom', 'healthcare', 'retail-ecommerce', 'education', 'ngo-microfinance'],
    forYou: ['Hours of reminder and follow-up calls taken off staff', 'Every call summarised in writing', 'Calls made on time, every time'],
    forCustomers: ['A clear, polite call in Bangla', 'Answers to simple questions without waiting', 'A person on the line when they need one'],
    integrations: ['WhatsApp', 'Android app', 'Your contact lists'],
    deploy: 'Run by LogiXhare as a managed service during the pilot.',
    faqs: [
      { q: 'Does it sound like a robot?', a: 'It uses a natural Bangla voice and answers in short sentences. People can tell it is an assistant, and it says so.' },
      { q: 'Can it take payments?', a: 'No. It can remind and explain how to pay; money always goes through your normal channels.' },
      { q: 'Is it available now?', a: 'It is in pilot with selected businesses. Contact us to join the next pilot.' },
    ],
  },
  {
    slug: 'syncgpt',
    name: 'SyncGPT',
    icon: 'chat',
    status: 'Live',
    site: { label: 'syncmeta.ai', href: 'https://syncmeta.ai/' },
    tagline: 'An AI assistant workspace for teams',
    summary:
      'A private AI chat workspace where your team can ask, write, translate and summarise in Bangla and English — with accounts your organisation controls.',
    problem:
      'Staff are already pasting company documents into personal AI accounts. That means no shared knowledge, no control over who sees what, and no way to set the assistant up for your own business.',
    features: [
      { icon: 'chat', title: 'Chat in Bangla and English', body: 'Ask questions, draft letters and replies, translate and summarise — in either language.' },
      { icon: 'users', title: 'Team accounts', body: 'Everyone signs in with their own account under your organisation, instead of personal subscriptions.' },
      { icon: 'book', title: 'Your documents', body: 'Work over the policies, manuals and files you give it, so answers come from your material.' },
      { icon: 'lock', title: 'Access you control', body: 'You decide who has an account; remove someone and their access ends.' },
    ],
    steps: [
      { title: 'Sign in', body: 'Create an account at syncmeta.ai, or ask us to set up a workspace for your organisation.' },
      { title: 'Add your material', body: 'Bring the documents your team asks about most.' },
      { title: 'Roll out', body: 'Start with one department, then widen.' },
    ],
    industries: ['corporate', 'education', 'banking-finance', 'government'],
    forYou: ['Company knowledge in one assistant', 'Accounts you control', 'Less time drafting and translating'],
    integrations: ['Your documents', 'Your software, as a project'],
    deploy: 'Cloud at syncmeta.ai; organisation workspaces on request.',
    faqs: [
      { q: 'Where do I sign in?', a: 'At syncmeta.ai. For an organisation workspace, contact us.' },
      { q: 'Can it be connected to our own systems?', a: 'Yes, as a project — we connect it to your documents or software and set it up for your team.' },
    ],
  },
  {
    slug: 'pos',
    name: 'LogiXhare POS',
    icon: 'cart',
    status: 'On request',
    tagline: 'Point of sale and stock for Bangladeshi shops and showrooms',
    summary:
      'Sales, stock, purchases, dues and branches for shops, showrooms, pharmacies and restaurants — in taka, with VAT, barcode and receipt printing, set up for how you sell.',
    problem:
      'Many shops still sell from a cash box and count stock from memory. Dues to suppliers and from customers live in a notebook, branches cannot see each other’s stock, and the owner only finds out about a loss at the month end.',
    features: [
      { icon: 'cart', title: 'Fast billing', body: 'Barcode or search, discounts, VAT, multiple payment types and printed or SMS receipts.' },
      { icon: 'box', title: 'Stock & purchases', body: 'Stock by item and branch, purchase entries, low-stock alerts and stock transfer between branches.' },
      { icon: 'clipboard', title: 'Dues & accounts', body: 'Customer and supplier dues, daily cash closing, and profit by item, day or branch.' },
      { icon: 'building', title: 'Branches', body: 'Every branch on one system; the owner sees all of them, each manager sees their own.' },
      { icon: 'mobile', title: 'Owner on the phone', body: 'Today’s sales, cash and stock alerts from anywhere.' },
      { icon: 'chart', title: 'Reports that matter', body: 'Best sellers, slow stock, daily profit and staff-wise sales — the numbers an owner actually checks.' },
    ],
    steps: [
      { title: 'See how you sell', body: 'We visit or call, and list your items, branches and the way your counter works.' },
      { title: 'Set up and import', body: 'Items, prices and opening stock are loaded; printers and barcode scanners connected.' },
      { title: 'Train the counter', body: 'Your staff learn it on your own products, not on a demo.' },
      { title: 'Support', body: 'We stay on call and adjust it as your shop changes.' },
    ],
    industries: ['retail-ecommerce', 'restaurants-hospitality', 'healthcare', 'manufacturing-rmg'],
    forYou: ['Stock and cash you can trust', 'Every branch on one screen', 'Dues tracked, not remembered'],
    forCustomers: ['Quick billing at the counter', 'Printed or SMS receipts', 'Correct prices every time'],
    integrations: ['USB barcode scanners', 'Thermal receipt printers', 'SMS gateways'],
    deploy: 'Hosted by LogiXhare, or on a computer in your shop.',
    faqs: [
      { q: 'Does it work with our barcode scanner and printer?', a: 'Standard USB barcode scanners and thermal receipt printers work. Tell us your models and we will confirm.' },
      { q: 'Is it priced per branch?', a: 'Pricing depends on branches and setup. Contact us for a quote.' },
    ],
  },
  {
    slug: 'industry-chatbots',
    name: 'Industry Chatbots',
    icon: 'zap',
    status: 'On request',
    tagline: 'Bangla and English chatbots for websites, WhatsApp and Messenger',
    summary:
      'Ready-made chatbots for ISPs, clinics, schools, shops and real estate that answer customers day and night, connected to your own system so the answers are real.',
    problem:
      'Customers ask the same questions all day — “what is my bill?”, “is the doctor in today?”, “what are the admission dates?” — and wait for someone to reply. After office hours nobody does.',
    features: [
      { icon: 'network', title: 'ISP support bot', body: 'Bill amount, expiry date, payment confirmation and “my line is down” tickets, answered from the billing system.' },
      { icon: 'heart', title: 'Clinic & hospital bot', body: 'Doctor schedules, serial booking and report-ready messages.' },
      { icon: 'book', title: 'Admission & school bot', body: 'Admission dates, fees, results and notices for schools, colleges and coaching centres.' },
      { icon: 'cart', title: 'Shop & order bot', body: 'Product questions, prices, order status and delivery updates.' },
      { icon: 'pin', title: 'Real estate bot', body: 'Project details, availability and site-visit booking.' },
      { icon: 'users', title: 'Hand over to a person', body: 'Any conversation can pass to your staff with the history attached.' },
    ],
    steps: [
      { title: 'Choose the bot', body: 'Start from the ready-made bot for your industry.' },
      { title: 'Connect your data', body: 'We connect it to your billing, booking or product list where you want live answers.' },
      { title: 'Go live on your channels', body: 'Website chat, WhatsApp, Facebook Messenger — one bot, all channels.' },
      { title: 'Improve weekly', body: 'We review real questions it could not answer and teach it.' },
    ],
    industries: ['isp-telecom', 'healthcare', 'education', 'retail-ecommerce', 'real-estate', 'restaurants-hospitality'],
    forYou: ['Questions answered after office hours', 'Staff freed from repeat questions', 'Every conversation recorded'],
    forCustomers: ['Answers in seconds, any time', 'Bangla, English or Banglish', 'A human when they ask for one'],
    integrations: ['WhatsApp Business', 'Facebook Messenger', 'Website chat', 'Your billing or booking system'],
    deploy: 'Hosted by LogiXhare.',
    faqs: [
      { q: 'Does it understand Bangla typed in English letters?', a: 'Yes — Bangla, English and Banglish are all handled.' },
      { q: 'Do we need a WhatsApp Business account?', a: 'For WhatsApp, yes. We help you set it up.' },
    ],
  },
  {
    slug: 'onekle',
    name: 'Onekle',
    icon: 'mobile',
    status: 'Coming soon',
    tagline: 'Everything you need today. Nothing you don’t.',
    summary:
      'A super app in the making: a professional network, buy-and-sell marketplace, rides, food, home services, payments and freelance work — one app for daily life in Bangladesh.',
    problem:
      'Daily life is split across a dozen apps — one to find work, one to sell, one for a ride, one for food, one to pay. Each wants its own account and none of them talk to each other.',
    features: [
      { icon: 'users', title: 'Network', body: 'A purpose-driven professional network — no endless entertainment feed, just what you need today.' },
      { icon: 'cart', title: 'Marketplace', body: 'Buy and sell locally, with sellers and buyers on the same app.' },
      { icon: 'pin', title: 'Rides & delivery', body: 'Rides, food and parcel delivery from the same account.' },
      { icon: 'wrench', title: 'Home services', body: 'Book electricians, cleaners and other help near you.' },
      { icon: 'lock', title: 'Pay', body: 'One wallet across everything in the app.' },
      { icon: 'compass', title: 'Freelance', body: 'Find work or hire for it, in the same place.' },
    ],
    steps: [],
    industries: ['retail-ecommerce', 'restaurants-hospitality'],
    faqs: [
      { q: 'When does it launch?', a: 'Onekle is in development. Contact us to hear when the first version opens.' },
    ],
  },
];

export const ventureHref = (v: Venture) => v.href ?? `/ventures/${v.slug}/`;
export const ventureBySlug = (slug: string) => ventures.find((v) => v.slug === slug);
