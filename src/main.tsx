import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import './styles/reset.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'
import { mdxComponents } from './lib/mdx-components'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

createRoot(rootEl).render(
  <StrictMode>
    <MDXProvider components={mdxComponents}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </MDXProvider>
  </StrictMode>,
)
