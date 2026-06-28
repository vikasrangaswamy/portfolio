import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
const SystemDesignIndex = lazy(() =>
  import('./routes/SystemDesign').then((m) => ({ default: m.SystemDesignIndex })),
)
const SystemDesignTopicPage = lazy(() =>
  import('./routes/SystemDesign').then((m) => ({ default: m.SystemDesignTopicPage })),
)
const Stats = lazy(() => import('./routes/Stats'))
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
        <Route
          path="stats"
          element={
            <Suspense fallback={<RouteFallback />}>
              <Stats />
            </Suspense>
          }
        />
        {/* "Learnings" was replaced by the Stats page. The old index and the
            LeetCode page redirect there; System Design routes stay reachable by
            URL (currently unlinked) until they're given a new home. */}
        <Route path="learnings">
          <Route index element={<Navigate to="/stats" replace />} />
          <Route path="leetcode" element={<Navigate to="/stats" replace />} />
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
