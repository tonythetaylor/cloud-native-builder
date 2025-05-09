// src/components/Dashboard.tsx
import React from 'react'
import useProjectStore from '../store/useProjectStore'
import TopBar from './TopBar'
import Stepper from './Stepper'
import StepPanels from './StepPanels'
import Canvas from './Canvas'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const step = useProjectStore(s => s.step)
  const setStep = useProjectStore(s => s.setStep)
  const nav = useNavigate()
  return (
    <div className="h-screen flex flex-col">
      {/* TopBar always at top */}
      <TopBar onDashboard={() => nav('/')} />


      {/* Stepper strip */}
      <Stepper
        currentStep={step}
        onSelect={setStep}
        className="h-12 border-b"
      />

      {/* Below: either a full‑width panel or split panel+canvas */}
      {step === 2 ? (
        // DESIGN step: show panel on left + canvas on right
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 border-r overflow-auto">
            <StepPanels />
          </div>
          <div className="flex-1">
            <Canvas />
          </div>
        </div>
      ) : (
        // REQUIREMENTS or EXPORT: panel fills entire area
        <div className="flex-1 overflow-auto">
          <StepPanels />
        </div>
      )}
    </div>
  )
}