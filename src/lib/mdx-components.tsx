import type { ComponentPropsWithoutRef } from 'react'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      style={{
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: '-0.01em',
        margin: '0 0 var(--sp-4)',
        color: 'var(--slate)',
      }}
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      style={{
        fontSize: 20,
        fontWeight: 500,
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
        fontWeight: 500,
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
  // Sketch-y code block: paper-cream background, hand-drawn-feel border with
  // an offset clay shadow so it reads as a deliberate object on the page,
  // not a corporate console window.
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      style={{
        background: 'var(--ivory)',
        color: 'var(--slate)',
        padding: 'var(--sp-5)',
        border: '1.5px solid var(--slate)',
        borderRadius: 'var(--r-md)',
        boxShadow: '4px 4px 0 0 var(--clay)',
        overflowX: 'auto',
        fontSize: 14,
        lineHeight: 1.6,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        margin: 'var(--sp-5) 0',
      }}
      {...props}
    />
  ),
  hr: () => <hr style={{ border: 0, borderTop: '1px solid var(--oat)', margin: 'var(--sp-6) 0' }} />,
}
