import { Routes, Route } from 'react-router-dom'
import { PageShell } from './components/layout/PageShell'
import Home from './routes/Home'
import About from './routes/About'
import Experience from './routes/Experience'
import Projects from './routes/Projects'
import ProjectDetail from './routes/ProjectDetail'
import Learnings from './routes/Learnings'
import { SystemDesignIndex, SystemDesignTopicPage } from './routes/SystemDesign'
import LeetCodeStats from './routes/LeetCodeStats'
import Colophon from './routes/Colophon'
import ColophonDetail from './routes/ColophonDetail'
import NotFound from './routes/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<PageShell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="experience" element={<Experience />} />
        <Route path="projects">
          <Route index element={<Projects />} />
          <Route path=":slug" element={<ProjectDetail />} />
        </Route>
        <Route path="learnings">
          <Route index element={<Learnings />} />
          <Route path="system-design">
            <Route index element={<SystemDesignIndex />} />
            <Route path=":slug" element={<SystemDesignTopicPage />} />
          </Route>
          <Route path="leetcode" element={<LeetCodeStats />} />
        </Route>
        <Route path="colophon">
          <Route index element={<Colophon />} />
          <Route path=":slug" element={<ColophonDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
