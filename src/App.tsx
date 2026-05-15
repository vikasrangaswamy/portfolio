import { Routes, Route } from 'react-router-dom'
import { PageShell } from './components/layout/PageShell'
import Home from './routes/Home'
import About from './routes/About'
import Experience from './routes/Experience'
import Projects from './routes/Projects'
import Learnings from './routes/Learnings'
import { SystemDesignIndex, SystemDesignTopicPage } from './routes/SystemDesign'
import { FrontendIndex, FrontendTopicPage } from './routes/Frontend'
import { DsaIndex, DsaTopicPage } from './routes/Dsa'
import { LeetCodeIndex, LeetCodeCategoryPage, LeetCodeProblemPage } from './routes/LeetCode'
import NotFound from './routes/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<PageShell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="experience" element={<Experience />} />
        <Route path="projects" element={<Projects />} />
        <Route path="learnings">
          <Route index element={<Learnings />} />
          <Route path="system-design">
            <Route index element={<SystemDesignIndex />} />
            <Route path=":slug" element={<SystemDesignTopicPage />} />
          </Route>
          <Route path="frontend">
            <Route index element={<FrontendIndex />} />
            <Route path=":slug" element={<FrontendTopicPage />} />
          </Route>
          <Route path="dsa">
            <Route index element={<DsaIndex />} />
            <Route path=":slug" element={<DsaTopicPage />} />
          </Route>
          <Route path="leetcode">
            <Route index element={<LeetCodeIndex />} />
            <Route path="problem/:slug" element={<LeetCodeProblemPage />} />
            <Route path=":slug" element={<LeetCodeCategoryPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
