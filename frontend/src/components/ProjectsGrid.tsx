// src/components/ProjectsGrid.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import useProjectStore, { Element } from '../store/useProjectStore'
import { NewProjectModal } from './NewProjectModal'

export default function ProjectsGrid() {
  const navigate = useNavigate()
  const projects      = useProjectStore((s) => s.projects)
  const selectProject = useProjectStore((s) => s.selectProject)
  const setProjects   = useProjectStore((s) => s.setProjects)
  const [showNew, setShowNew] = useState(false)

  // Fetch projects on mount
  useEffect(() => {
    api.get('/projects')
      .then((res) => setProjects(res.data))
      .catch(console.error)
  }, [setProjects])

  // When a project is selected, load into store and navigate to the builder
  const handleSelect = (proj: { id: number; name: string; config: { elements: Element[] } }) => {
    selectProject(proj.id, proj.config.elements, proj.name)
    navigate('/dashboard')
  }

  // Create a new project and select it immediately
  const handleCreate = (name: string) => {
    api.post('/projects', { name, config: { elements: [] } })
      .then((res) => {
        setProjects([...projects, res.data])
        selectProject(res.data.id, [], res.data.name)
        setShowNew(false)
        navigate('/dashboard')
      })
      .catch(console.error)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Your Projects</h1>
      <div className="grid grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            onClick={() => handleSelect(proj)}
            className="h-40 border rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:shadow-lg"
          >
            <span className="font-bold text-lg">{proj.name}</span>
            <span className="text-sm text-gray-500">ID: {proj.id}</span>
          </div>
        ))}

        {/* New project card */}
        <div
          onClick={() => setShowNew(true)}
          className="h-40 border-2 border-dashed rounded-lg flex items-center justify-center text-4xl text-gray-400 cursor-pointer hover:bg-gray-50"
        >
          +
        </div>
      </div>

      {showNew && (
        <NewProjectModal
          onClose={() => setShowNew(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}