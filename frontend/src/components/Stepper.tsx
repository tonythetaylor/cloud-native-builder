// src/components/Stepper.tsx
import React from 'react'

export interface StepperProps {
  currentStep: number
  onSelect: (step: number) => void
  className?: string
}

export default function Stepper({
  currentStep,
  onSelect,
  className = '',
}: StepperProps) {
  const steps = [
    { id: 1, label: 'Requirements' },
    { id: 2, label: 'Design' },
    { id: 3, label: 'Export' },
  ]

  return (
    <nav className={`flex ${className}`}>
      {steps.map((step) => (
        <button
          key={step.id}
          onClick={() => onSelect(step.id)}
          className={`flex-1 text-center px-4 py-2 ${
            currentStep === step.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600'
          }`}
        >
          {step.label}
        </button>
      ))}
    </nav>
  )
}