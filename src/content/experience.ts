export type Role = {
  company: string
  title: string
  start: string
  end: string | 'Present'
  location?: string
  /** One neutral line describing the area of work (not achievements). */
  area?: string
  tech?: readonly string[]
}

export const experience: readonly Role[] = [
  {
    company: 'Contentstack',
    title: 'Software Engineer I',
    start: '2025-03',
    end: 'Present',
    location: 'Bangalore, India',
    area: 'Automation, AI connectors & agentic systems · platform integrations',
    tech: [
      'AI connectors',
      'Automation',
      'Agentic systems',
      'LLM integrations',
      'Node.js',
      'TypeScript',
      'React',
      'AWS Lambda',
      'KMS',
      'Contentstack',
      'XTM Cloud',
    ],
  },
  {
    company: 'Contentstack',
    title: 'Associate Software Engineer',
    start: '2023-07',
    end: '2025-03',
    location: 'Bangalore, India',
    area: 'Shopify ↔ CMS integration app',
    tech: ['Remix', 'React', 'Node.js', 'MongoDB', 'Shopify Polaris', 'OAuth 2.0', 'Webhooks'],
  },
  {
    company: 'Contentstack',
    title: 'Associate Software Engineer Intern',
    start: '2023-01',
    end: '2023-07',
    location: 'Bangalore, India',
    area: 'Marketplace app development',
    tech: ['React', 'TypeScript', 'Contentstack Marketplace SDK'],
  },
  {
    company: 'IIT Madras — 5G Testbed',
    title: 'Project Associate',
    start: '2022-07',
    end: '2022-09',
    location: 'Chennai, India',
    area: '5G user-equipment integration',
    tech: ['Python', 'C', 'Linux', 'PCIe', 'AT commands'],
  },
]
