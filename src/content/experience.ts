export type Role = {
  company: string
  title: string
  start: string // YYYY-MM
  end: string | 'Present'
  location?: string
  bullets: readonly string[]
  tech?: readonly string[]
}

// DUMMY — see NEEDS-FROM-USER.md item #2 for replacement plan
export const experience: readonly Role[] = [
  {
    company: 'Contentstack',
    title: 'Software Engineer',
    start: '2023-01',
    end: 'Present',
    location: 'Bangalore, India',
    bullets: [
      'Built and maintained features across the headless CMS platform.',
      'Worked on automations and integrations connecting Contentstack to third-party services.',
      'Collaborated with product and design to ship customer-facing improvements.',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    company: 'Previous Company',
    title: 'Software Engineer',
    start: '2020-06',
    end: '2022-12',
    location: 'Bangalore, India',
    bullets: [
      'Placeholder bullet — replace with real previous-role highlights.',
      'Placeholder bullet — replace with real previous-role highlights.',
    ],
    tech: ['JavaScript', 'React', 'Node.js'],
  },
]
