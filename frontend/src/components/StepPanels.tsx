import React, { useState } from 'react'
import useProjectStore, { Requirement } from '../store/useProjectStore'
import { v4 as uuid } from 'uuid'
import DesignPanel from './DesignPanel'
import ExportPanel from './ExportPanel'
import RequirementsPanel from './RequirementsPanel'

export default function StepPanels() {
  const step = useProjectStore(s => s.step)
  if (step === 1) return <RequirementsPanel />
  if (step === 2) return <DesignPanel />
  if (step === 3) return <ExportPanel />
  return null
}