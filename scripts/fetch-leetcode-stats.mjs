#!/usr/bin/env node
/**
 * Fetches LeetCode public stats + submission calendar via the public GraphQL API
 * and writes them to public/data/leetcode.json. Intended to be run by a GitHub
 * Actions cron job (and locally on demand).
 *
 * The build never *requires* this file — if fetch fails, the existing JSON on
 * disk is kept and the page degrades to whatever was last committed.
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = resolve(__dirname, '..', 'public', 'data', 'leetcode.json')
const USERNAME = process.env.LEETCODE_USERNAME ?? 'VIKAS_RANGASWAMY'

const STATS_QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        userAvatar
        realName
        countryName
      }
      submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
      }
      languageProblemCount {
        languageName
        problemsSolved
      }
    }
    allQuestionsCount { difficulty count }
  }
`

const CALENDAR_QUERY = `
  query userCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`

async function leetcode(query, variables) {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: `https://leetcode.com/${variables.username}/`,
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`LeetCode GraphQL ${res.status}: ${await res.text()}`)
  const json = await res.json()
  if (json.errors) throw new Error(`LeetCode GraphQL errors: ${JSON.stringify(json.errors)}`)
  return json.data
}

function ensureDir(filePath) {
  const dir = dirname(filePath)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

async function main() {
  console.log(`Fetching LeetCode stats for "${USERNAME}"…`)
  const now = new Date()
  const year = now.getUTCFullYear()

  // Stats + current-year calendar
  const [statsData, calendarThis] = await Promise.all([
    leetcode(STATS_QUERY, { username: USERNAME }),
    leetcode(CALENDAR_QUERY, { username: USERNAME, year }),
  ])

  const user = statsData.matchedUser
  if (!user) throw new Error(`LeetCode user "${USERNAME}" not found`)

  // Merge previous-year submissions too, so the rolling 365-day heatmap is complete
  const calendarPrev = await leetcode(CALENDAR_QUERY, {
    username: USERNAME,
    year: year - 1,
  })

  const submissionCalendar = mergeCalendars([
    calendarPrev.matchedUser?.userCalendar?.submissionCalendar,
    calendarThis.matchedUser?.userCalendar?.submissionCalendar,
  ])

  const out = {
    username: user.username,
    realName: user.profile?.realName ?? null,
    avatar: user.profile?.userAvatar ?? null,
    country: user.profile?.countryName ?? null,
    ranking: user.profile?.ranking ?? null,
    totals: normalizeTotals(user.submitStatsGlobal?.acSubmissionNum ?? []),
    questionTotals: normalizeTotals(statsData.allQuestionsCount ?? []),
    languages: normalizeLanguages(user.languageProblemCount ?? []),
    calendar: {
      streak: calendarThis.matchedUser?.userCalendar?.streak ?? 0,
      totalActiveDays: calendarThis.matchedUser?.userCalendar?.totalActiveDays ?? 0,
      submissionCalendar,
    },
    fetchedAt: now.toISOString(),
  }

  ensureDir(OUT_PATH)
  const next = JSON.stringify(out, null, 2) + '\n'
  const prev = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, 'utf8') : ''
  if (prev === next) {
    console.log('No changes.')
  } else {
    writeFileSync(OUT_PATH, next)
    console.log(`Wrote ${OUT_PATH}`)
  }
}

function normalizeTotals(arr) {
  const out = { All: 0, Easy: 0, Medium: 0, Hard: 0 }
  for (const row of arr) {
    if (row?.difficulty && row.difficulty in out) out[row.difficulty] = row.count
  }
  return out
}

/**
 * LeetCode returns one row per language *per submission language tag*, which
 * can include near-duplicates and zero-count rows. Collapse to a clean
 * { languageName, problemsSolved } list sorted by count desc, dropping zeros.
 */
function normalizeLanguages(arr) {
  return arr
    .filter((row) => row?.languageName && (row.problemsSolved ?? 0) > 0)
    .map((row) => ({ languageName: row.languageName, problemsSolved: row.problemsSolved }))
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
}

function mergeCalendars(stringArr) {
  const merged = {}
  for (const s of stringArr) {
    if (!s) continue
    try {
      const obj = JSON.parse(s)
      for (const [ts, count] of Object.entries(obj)) {
        merged[ts] = (merged[ts] ?? 0) + Number(count)
      }
    } catch {
      // skip malformed
    }
  }
  return merged
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
