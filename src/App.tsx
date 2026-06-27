import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageShell } from './components/layout/PageShell'
// Home is the landing page — keep it eager so first paint has no loading flash.
import Home from './routes/Home'

// Every other route is code-split: its JS (and anything heavy it pulls in, like
// React Flow + dagre on the project/system-design writeups) loads only when the
// route is visited, keeping the initial bundle small.
const About = lazy(() => import('./routes/About'))
const Experience = lazy(() => import('./routes/Experience'))
const Projects = lazy(() => import('./routes/Projects'))
const ProjectDetail = lazy(() => import('./routes/ProjectDetail'))
const Learnings = lazy(() => import('./routes/Learnings'))
const SystemDesignIndex = lazy(() =>
  import('./routes/SystemDesign').then((m) => ({ default: m.SystemDesignIndex })),
)
const SystemDesignTopicPage = lazy(() =>
  import('./routes/SystemDesign').then((m) => ({ default: m.SystemDesignTopicPage })),
)
const LeetCodeStats = lazy(() => import('./routes/LeetCodeStats'))
const Colophon = lazy(() => import('./routes/Colophon'))
const ColophonDetail = lazy(() => import('./routes/ColophonDetail'))
const NotFound = lazy(() => import('./routes/NotFound'))

/** Minimal, layout-stable fallback while a route chunk loads. */
function RouteFallback() {
  return <div style={{ minHeight: '60vh' }} aria-busy="true" aria-live="polite" />
}

export default function App() {
  return (
    <Routes>
      <Route element={<PageShell />}>
        <Route index element={<Home />} />
        <Route
          path="about"
          element={
            <Suspense fallback={<RouteFallback />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="experience"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Experience />
            </Suspense>
          }
        />
        <Route path="projects">
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <Projects />
              </Suspense>
            }
          />
          <Route
            path=":slug"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ProjectDetail />
              </Suspense>
            }
          />
        </Route>
        <Route path="learnings">
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <Learnings />
              </Suspense>
            }
          />
          <Route path="system-design">
            <Route
              index
              element={
                <Suspense fallback={<RouteFallback />}>
                  <SystemDesignIndex />
                </Suspense>
              }
            />
            <Route
              path=":slug"
              element={
                <Suspense fallback={<RouteFallback />}>
                  <SystemDesignTopicPage />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="leetcode"
            element={
              <Suspense fallback={<RouteFallback />}>
                <LeetCodeStats />
              </Suspense>
            }
          />
        </Route>
        <Route path="colophon">
          <Route
            index
            element={
              <Suspense fallback={<RouteFallback />}>
                <Colophon />
              </Suspense>
            }
          />
          <Route
            path=":slug"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ColophonDetail />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
