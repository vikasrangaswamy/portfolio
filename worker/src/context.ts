/**
 * The assistant's grounding context, ASSEMBLED FROM THE SITE CONTENT so the bot
 * can never drift from the website. Everything here is derived from the same
 * modules the site renders (`src/content/*`) — do not hand-write facts. Add or
 * change information in those content files; the worker (auto-deployed in CI)
 * picks it up on the next deploy.
 */
import { profile } from '../../src/content/profile'
import { experience } from '../../src/content/experience'
import { skills } from '../../src/content/skills'
import { projectsMeta } from '../../src/content/projects/meta'
import { systemDesignMeta } from '../../src/content/learnings/system-design/meta'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function fmt(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number)
  if (!y || !m) return yyyymm
  return `${MONTHS[m - 1]} ${y}`
}

/** Surfaced in the system prompt so the bot can route unanswerable questions here. */
export const CONTACT = {
  email: profile.email,
  linkedin: profile.linkedin,
  github: profile.github,
}

const experienceBlock = experience
  .map((r) => {
    const end = r.end === 'Present' ? 'Present' : fmt(r.end)
    const loc = r.location ? `, ${r.location}` : ''
    const area = r.area ? `\n  Focus: ${r.area}` : ''
    const tech = r.tech?.length ? `\n  Tech: ${r.tech.join(', ')}` : ''
    return `- ${r.title} — ${r.company} (${fmt(r.start)} – ${end})${loc}${area}${tech}`
  })
  .join('\n')

const skillsBlock = skills.map((c) => `- ${c.category}: ${c.skills.join(', ')}`).join('\n')

const projectsBlock = projectsMeta
  .map((p) => `- ${p.title}: ${p.summary} (Tech: ${p.tech.join(', ')})`)
  .join('\n')

const learningBlock = systemDesignMeta.map((t) => `- ${t.title}: ${t.summary}`).join('\n')

export const CONTEXT = `
# About ${profile.name}
${profile.name} — ${profile.role} at ${profile.company}, based in ${profile.location}.
${profile.tagline}
Currently: ${profile.now}.

${profile.about.join('\n\n')}

# Experience
${experienceBlock}

# Skills
${skillsBlock}

# Personal projects
${projectsBlock}

# System design studies
${learningBlock}

# Contact
Email: ${CONTACT.email}
LinkedIn: ${CONTACT.linkedin}
GitHub: ${CONTACT.github}
`.trim()
