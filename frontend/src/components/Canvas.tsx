// src/components/Canvas.tsx
import React, { useRef } from 'react'
import { ReactFlowProvider } from 'react-flow-renderer'
import InnerCanvas from './InnerCanvas'

export default function Canvas() {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <div ref={wrapperRef} className="w-full h-full">
          <InnerCanvas wrapperRef={wrapperRef} />
        </div>
      </ReactFlowProvider>
    </div>
  )
}