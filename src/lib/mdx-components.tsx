import type { ComponentPropsWithoutRef } from 'react'
import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from './CodeBlock'

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      style={{
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: '-0.025em',
        margin: '0 0 var(--sp-4)',
        color: 'var(--slate)',
      }}
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      style={{
        fontSize: 21,
        fontWeight: 600,
        letterSpacing: '-0.015em',
        margin: 'var(--sp-6) 0 var(--sp-3)',
        color: 'var(--slate)',
      }}
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      style={{
        fontSize: 16,
        fontWeight: 600,
        margin: 'var(--sp-5) 0 var(--sp-2)',
        color: 'var(--slate)',
      }}
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p
      style={{
        fontSize: 15,
        lineHeight: 1.7,
        color: 'var(--gray-700)',
        margin: '0 0 var(--sp-4)',
      }}
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      style={{
        listStyle: 'disc',
        paddingLeft: 'var(--sp-5)',
        margin: '0 0 var(--sp-4)',
        color: 'var(--gray-700)',
        fontSize: 15,
        lineHeight: 1.7,
      }}
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      style={{
        listStyle: 'decimal',
        paddingLeft: 'var(--sp-5)',
        margin: '0 0 var(--sp-4)',
        color: 'var(--gray-700)',
        fontSize: 15,
        lineHeight: 1.7,
      }}
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => (
    <li style={{ marginBottom: 'var(--sp-1)' }} {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a style={{ color: 'var(--clay)', textDecoration: 'underline' }} {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      style={{
        borderLeft: '3px solid var(--clay)',
        paddingLeft: 'var(--sp-4)',
        margin: 'var(--sp-4) 0',
        color: 'var(--gray-700)',
        fontStyle: 'italic',
      }}
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 14,
        background: 'var(--oat)',
        padding: '2px 6px',
        borderRadius: 4,
        color: 'var(--slate)',
      }}
      {...props}
    />
  ),
  // Docs-style code block: dark surface with a header bar (language label +
  // copy button) regardless of site theme. Syntax highlighting comes from
  // rehype-pretty-code (Shiki, github-dark-dimmed) via vite.config.
  pre: CodeBlock,
  hr: () => <hr style={{ border: 0, borderTop: '1px solid var(--oat)', margin: 'var(--sp-6) 0' }} />,
}
