export type SkillCategory = {
  category: string
  skills: readonly string[]
}

// DUMMY — see NEEDS-FROM-USER.md item #3
export const skills: readonly SkillCategory[] = [
  {
    category: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python'],
  },
  {
    category: 'Frameworks',
    skills: ['React', 'Node.js', 'Express', 'Redux Saga'],
  },
  {
    category: 'Infrastructure',
    skills: ['AWS Lambda', 'AWS Batch', 'Docker', 'Redis'],
  },
  {
    category: 'Tools',
    skills: ['Git', 'Vite', 'GitHub Actions'],
  },
]
