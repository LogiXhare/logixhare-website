/**
 * The Tidegard documentation's table of contents. The sidebar, the
 * previous/next links and the docs home page all read from here, so the
 * order a reader walks through is defined once.
 *
 * `slug` is the page's folder under src/pages/tidegard/docs/ ('' is the
 * docs home). Adding a page means adding the .md file AND a line here; a
 * page missing from this list still builds but has no sidebar entry and no
 * previous/next links.
 */

export interface DocLink {
  slug: string;
  title: string;
}

export interface DocGroup {
  label: string;
  pages: DocLink[];
}

export const docGroups: DocGroup[] = [
  {
    label: 'Getting started',
    pages: [
      { slug: '', title: 'Introduction' },
      { slug: 'how-it-works', title: 'How Tidegard works' },
      { slug: 'requirements', title: 'Requirements and sizing' },
      { slug: 'installation', title: 'Installation' },
      { slug: 'quick-start', title: 'Quick start' },
    ],
  },
  {
    label: 'Collecting traffic',
    pages: [
      { slug: 'router-setup', title: 'Router setup (IPFIX)' },
      { slug: 'prefixes-and-hostgroups', title: 'Prefixes and hostgroups' },
    ],
  },
  {
    label: 'Detection and response',
    pages: [
      { slug: 'detection-policies', title: 'Detection policies' },
      { slug: 'incidents', title: 'Incidents' },
      { slug: 'notifications', title: 'Notifications' },
      { slug: 'mitigation', title: 'Mitigation overview' },
      { slug: 'rtbh', title: 'BGP blackhole (RTBH)' },
      { slug: 'flowspec', title: 'BGP FlowSpec' },
    ],
  },
  {
    label: 'Visibility',
    pages: [
      { slug: 'noc-ui', title: 'NOC web UI and roles' },
      { slug: 'dashboards', title: 'Grafana dashboards' },
    ],
  },
  {
    label: 'Integrations',
    pages: [
      { slug: 'api', title: 'REST API' },
      { slug: 'cli', title: 'Command line (tidegardctl)' },
    ],
  },
  {
    label: 'Operations',
    pages: [
      { slug: 'monitoring', title: 'Monitoring Tidegard' },
      { slug: 'backup-and-upgrade', title: 'Backup, restore and upgrade' },
      { slug: 'security', title: 'Security' },
    ],
  },
  {
    label: 'Reference',
    pages: [
      { slug: 'limitations', title: 'Known limitations' },
      { slug: 'faq', title: 'FAQ' },
    ],
  },
];

/** Every page in reading order, for previous/next links. */
export const docOrder: DocLink[] = docGroups.flatMap((g) => g.pages);

export const docPath = (slug: string) => (slug ? `/tidegard/docs/${slug}/` : '/tidegard/docs/');
