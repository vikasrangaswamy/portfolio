import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { MotionConfig } from 'framer-motion'
import './styles/reset.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/mechanical.css'
// React Flow base stylesheet — needs to be a top-level global import so it
// isn't tree-shaken when FlowDiagram lands on an MDX chunk boundary. The
// stylesheet sets `position: absolute` on .react-flow__handle and similar,
// without which edges render at zero size.
import '@xyflow/react/dist/style.css'
import App from './App.tsx'
import { mdxComponents } from './lib/mdx-components'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    {/* Motion animates via inline styles on its own rAF loop, so the global
        prefers-reduced-motion rule in global.css (which only reaches CSS
        animations/transitions) can't touch it. `reducedMotion="user"` makes
        every motion component honor the OS setting: transforms are dropped,
        opacity fades still run. */}
    <MotionConfig reducedMotion="user">
      <MDXProvider components={mdxComponents}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </MDXProvider>
    </MotionConfig>
  </StrictMode>,
)
