import React, { useRef, useEffect } from 'react'
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'react-flow-renderer'
import { Resizable } from 're-resizable'

export default function GroupNode({ id, data, selected }: NodeProps) {
  const updateNodeInternals = useUpdateNodeInternals()
  const ref = useRef<any>(null)

  // whenever we resize, tell RF to recalc internals
  useEffect(() => {
    updateNodeInternals(id)
  }, [data.width, data.height, id, updateNodeInternals])

  return (
    <Resizable
      size={{ width: data.width, height: data.height }}
      onResizeStop={(_e, _dir, _ref, d) => {
        data.onResize(id, data.width + d.width, data.height + d.height)
      }}
      style={{
        border: selected ? '2px solid #007ACC' : '2px dashed #AAA',
        background: '#F9F9F9',
        padding: 8,
        position: 'relative',
      }}
      ref={ref}
    >
      <div style={{ pointerEvents: 'none', fontWeight: 'bold' }}>{data.label}</div>
      {/* source/sink handles if you want to connect groups themselves */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Resizable>
  )
}