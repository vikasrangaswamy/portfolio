export type SkillCategory = {
  category: string
  skills: readonly string[]
}

export const skills: readonly SkillCategory[] = [
  {
    category: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C'],
  },
  {
    category: 'Frontend',
    skills: ['React', 'Remix', 'Shopify Polaris'],
  },
  {
    category: 'Backend & APIs',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST', 'GraphQL', 'Webhooks', 'OAuth 2.0'],
  },
  {
    category: 'Cloud & AWS',
    skills: ['Lambda', 'KMS', 'Batch', 'EFS', 'S3'],
  },
  {
    category: 'Platforms & Integrations',
    skills: ['Contentstack', 'Shopify (embedded apps, Admin GraphQL)', 'MetaTrader 5'],
  },
  {
    category: 'AI & Automation',
    skills: ['Contentstack Automate', 'n8n'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'GitHub', 'Jira', 'Chrome DevTools'],
  },
]
