export type Role = {
  company: string
  title: string
  start: string
  end: string | 'Present'
  location?: string
  bullets: readonly string[]
  tech?: readonly string[]
}

export const experience: readonly Role[] = [
  {
    company: 'Contentstack',
    title: 'Software Engineer I',
    start: '2025-03',
    end: 'Present',
    location: 'Bangalore, India',
    bullets: [
      'Sole developer of the Marketplace XTM App connecting Contentstack with XTM Cloud for translation management — adopted by 20+ enterprise clients.',
      'Built the full stack: React UI, Node.js API, Contentstack + XTM Cloud integrations, and AWS infrastructure.',
      'Designed a serverless API with encrypted credentials, async callback handling, and rate limiting to keep translations reliable under bursty load.',
    ],
    tech: ['React', 'Node.js', 'TypeScript', 'AWS Lambda', 'KMS', 'Contentstack', 'XTM Cloud'],
  },
  {
    company: 'Contentstack',
    title: 'Associate Software Engineer',
    start: '2023-07',
    end: '2025-03',
    location: 'Bangalore, India',
    bullets: [
      'Owned key features of the Shopify ↔ Contentstack integration app, syncing CMS content into Shopify metafields and metaobjects on Remix.',
      'Built the Contentstack OAuth flow, merchant-facing connect/sync UI in Shopify Polaris, and the webhook handling layer.',
      'Implemented the initial bulk sync pipeline and MongoDB session storage that the app still runs on.',
    ],
    tech: ['Remix', 'React', 'Node.js', 'MongoDB', 'Shopify Polaris', 'OAuth 2.0', 'Webhooks'],
  },
  {
    company: 'Contentstack',
    title: 'Associate Software Engineer Intern',
    start: '2023-01',
    end: '2023-07',
    location: 'Bangalore, India',
    bullets: [
      'Built a Custom Reference Field Marketplace app from scratch, letting content authors attach and manage reference entries directly inside Contentstack entries.',
    ],
    tech: ['React', 'TypeScript', 'Contentstack Marketplace SDK'],
  },
  {
    company: 'IIT Madras — 5G Testbed',
    title: 'Project Associate',
    start: '2022-07',
    end: '2022-09',
    location: 'Chennai, India',
    bullets: [
      'Led software integration for custom User Equipment using a Telit FN980 cellular modem with Raspberry Pi.',
      'Implemented PCIe communication and AT-command control for modem interactions in a 5G environment.',
    ],
    tech: ['Python', 'C', 'Linux', 'PCIe', 'AT commands'],
  },
]
