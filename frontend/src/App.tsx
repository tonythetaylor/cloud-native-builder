// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectsGrid from './components/ProjectsGrid'
import Dashboard    from './components/Dashboard'
import Login        from './components/Login'
import Register     from './components/Register'

export default function App() {
  return (
      <Routes>
        {/* public auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* project list */}
        <Route path="/" element={<ProjectsGrid />} />

        {/* the actual builder UI */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  )
}