#!/usr/bin/env node
/**
 * Fetches the GitHub contribution calendar for a user via the GitHub GraphQL
 * API and writes it to public/data/github.json. Mirrors the LeetCode sync: run
 * by a GitHub Actions cron (and locally on demand). The build never *requires*
 * this — if the fetch fails, the last committed JSON is kept and the Stats page
 * degrades to whatever was there.
 *
 * Requires GITHUB_TOKEN in the environment (the Actions-provided token works;
 * the contribution calendar is public data readable with any valid token).
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = resolve(__dirname, '..', 'public', 'data', 'github.json')
const USERNAME = process.env.GITHUB_USERNAME ?? 'vikasrangaswamy'
const TOKEN = process.env.GITHUB_TOKEN

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`

async function main() {
  if (!TOKEN) throw new Error('GITHUB_TOKEN env var is required')

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': `${USERNAME}-portfolio-sync`,
    },
    body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
  })
  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}: ${await res.text()}`)
  const json = await res.json()
  if (json.errors) throw new Error(`GitHub GraphQL errors: ${JSON.stringify(json.errors)}`)

  const cal = json.data?.user?.contributionsCollection?.contributionCalendar
  if (!cal) throw new Error('No contribution calendar in response')

  // Keep only active days (count > 0) keyed by ISO date — the page fills zeros.
  const days = {}
  for (const week of cal.weeks) {
    for (const d of week.contributionDays) {
      if (d.contributionCount > 0) days[d.date] = d.contributionCount
    }
  }

  const out = {
    username: USERNAME,
    fetchedAt: new Date().toISOString(),
    totalLastYear: cal.totalContributions,
    days,
  }

  if (!existsSync(dirname(OUT_PATH))) mkdirSync(dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2))
  console.log(
    `Wrote ${Object.keys(days).length} active days, ${cal.totalContributions} contributions for "${USERNAME}".`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
