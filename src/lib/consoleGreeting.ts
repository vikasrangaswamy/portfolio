import { profile } from '../content/profile'

/**
 * A note for anyone who opens DevTools — which, on a portfolio like this, is a
 * decent share of the audience. Kept factual rather than jokey, and it's the one
 * place that advertises the `?q=` deep link (see AskTerminal).
 */
export function logConsoleGreeting() {
  const heading = 'color:#EF4444;font-weight:600;font-size:13px'
  const body = 'color:#8E8E93;font-size:12px;line-height:1.5'

  console.log(
    `%c${profile.name}%c\n${profile.role} · ${profile.company} — automation, AI connectors, agentic systems.\n\n` +
      `Ask the assistant anything: press ⌘K (or /), or append ?q=your+question to any URL.\n` +
      `Source: ${profile.github}/portfolio\n` +
      `Say hello: ${profile.email}`,
    heading,
    body,
  )
}
