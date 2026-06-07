import { profile } from '../content/profile'
import { skills } from '../content/skills'
import { experience } from '../content/experience'
import { projects } from '../content/projects'
import { systemDesignTopics } from '../content/learnings/system-design'
import { colophonTopics } from '../content/colophon'

export type SearchKind = 'Page' | 'Project' | 'Experience' | 'Topic' | 'Skill' | 'Action' | 'External'

export type SearchRecord = {
  id: string
  kind: SearchKind
  title: string
  /** Secondary line shown under the title in results. */
  subtitle?: string
  /** Extra terms folded into matching (tech tags, bullets, synonyms). */
  keywords: string
  /** Internal route for navigation, OR external URL for kind === 'External'. */
  to: string
}

/**
 * Build the searchable record set from the structured content. This is what
 * powers "where has he actually used X?" — a query for a technology surfaces
 * every project / role / topic / skill that touches it.
 *
 * Built once at module load (content is static).
 */
function buildRecords(): SearchRecord[] {
  const records: SearchRecord[] = []

  // Sections / pages
  const pages: Array<[string, string, string]> = [
    ['About', '/about', 'bio profile contact location'],
    ['Experience', '/experience', 'work history jobs roles career'],
    ['Projects', '/projects', 'work portfolio'],
    ['Learnings', '/learnings', 'notes study'],
    ['System Design', '/learnings/system-design', 'architecture infrastructure'],
    ['LeetCode', '/learnings/leetcode', 'dsa algorithms problems stats heatmap'],
    ['Colophon', '/colophon', 'how this site is built meta'],
  ]
  for (const [title, to, keywords] of pages) {
    records.push({ id: `page:${to}`, kind: 'Page', title, keywords, to })
  }

  // Projects
  for (const p of projects) {
    records.push({
      id: `project:${p.slug}`,
      kind: 'Project',
      title: p.title,
      subtitle: p.summary,
      keywords: [...p.tech, p.summary].join(' '),
      to: `/projects/${p.slug}`,
    })
  }

  // Experience roles — title + company + bullets + tech all searchable.
  for (const role of experience) {
    records.push({
      id: `exp:${role.company}:${role.start}`,
      kind: 'Experience',
      title: role.title,
      subtitle: `${role.company} · ${role.start.split('-')[0]}`,
      keywords: [role.company, ...(role.tech ?? []), ...role.bullets].join(' '),
      to: '/experience',
    })
  }

  // Learning topics (system design + colophon)
  for (const t of systemDesignTopics) {
    records.push({
      id: `sd:${t.slug}`,
      kind: 'Topic',
      title: t.title,
      subtitle: t.summary,
      keywords: [...t.tech, t.summary, 'system design'].join(' '),
      to: `/learnings/system-design/${t.slug}`,
    })
  }
  for (const t of colophonTopics) {
    records.push({
      id: `colo:${t.slug}`,
      kind: 'Topic',
      title: t.title,
      subtitle: t.summary,
      keywords: [...t.tech, t.summary, 'colophon how it works'].join(' '),
      to: `/colophon/${t.slug}`,
    })
  }

  // Skills — each skill is its own entry so "AWS" / "GraphQL" / "Remix"
  // resolve directly. They point at the About page where skills live.
  for (const cat of skills) {
    for (const skill of cat.skills) {
      records.push({
        id: `skill:${cat.category}:${skill}`,
        kind: 'Skill',
        title: skill,
        subtitle: cat.category,
        keywords: cat.category,
        to: '/about',
      })
    }
  }

  // External
  records.push({ id: 'ext:github', kind: 'External', title: 'GitHub', keywords: 'code repos source', to: profile.github })
  if (profile.linkedin) {
    records.push({ id: 'ext:linkedin', kind: 'External', title: 'LinkedIn', keywords: 'contact connect hire', to: profile.linkedin })
  }

  return records
}

export const searchRecords: SearchRecord[] = buildRecords()
