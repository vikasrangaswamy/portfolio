export type Project = {
  slug: string
  title: string
  summary: string
  tech: readonly string[]
  repoUrl: string
  demoUrl?: string
  featured?: boolean
}

export const projects: readonly Project[] = []
