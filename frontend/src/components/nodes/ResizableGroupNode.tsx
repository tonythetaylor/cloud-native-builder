// src/components/nodes/ResizableGroupNode.tsx
import React, { useRef } from 'react';
import { Handle, Position, NodeProps } from 'react-flow-renderer';
import './ResizableGroupNode.css'; // new CSS file

export default function ResizableGroupNode({ data }: NodeProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="group-node nodrag">
      <strong className="group-label">{data.label}</strong>
      {/* resize handles on the edges and corners */}
      <div className="resize-handle top" />
      <div className="resize-handle right" />
      <div className="resize-handle bottom" />
      <div className="resize-handle left" />
      <div className="resize-handle top-left" />
      <div className="resize-handle top-right" />
      <div className="resize-handle bottom-right" />
      <div className="resize-handle bottom-left" />

      {/* connection handles */}
      <Handle type="target" position={Position.Top} className="nodrag" />
      <Handle type="source" position={Position.Bottom} className="nodrag" />
    </div>
  );
}