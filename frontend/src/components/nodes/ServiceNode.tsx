// src/components/nodes/ServiceNode.tsx
import React from 'react'
export default function ServiceNode({ data }: { data: { label: string } }) {
  return (
    <div className="p-2 bg-green-50 border border-green-400 rounded">
      <strong>Service:</strong> {data.label}
    </div>
  )
}