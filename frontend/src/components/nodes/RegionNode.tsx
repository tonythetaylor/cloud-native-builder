// src/components/nodes/RegionNode.tsx
import React from 'react'
import { Handle, Position } from 'react-flow-renderer'

export default function RegionNode({ data }: { data: { label: string } }) {
  return (
    <div
      style={{
        minWidth: 200,
        minHeight: 150,
        padding: 12,
        border: '8px solid #2b6cb0',
        borderRadius: 4,
        background: '#ebf8ff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 8,
      }}
    >
      <strong style={{ fontSize: 14, color: '#2c5282' }}>
        {data.label}
      </strong>
      {/* You can render children or handles here if you want */}
      <Handle type="target" position={Position.Top} style={{ left: 10 }} />
      <Handle type="source" position={Position.Bottom} style={{ left: 10 }} />
    </div>
  )
}