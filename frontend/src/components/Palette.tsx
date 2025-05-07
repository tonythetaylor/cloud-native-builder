// src/components/Palette.tsx
import React, { useCallback } from 'react';
import { useDrag } from 'react-dnd';

const items = [
  { type: 'EC2',    label: 'EC2 Instance' },
  { type: 'S3',     label: 'S3 Bucket' },
  { type: 'VPC',    label: 'VPC' },
  { type: 'Lambda', label: 'Lambda Function' }
];

function Palette() {
  return (
    <div>
      <h2 className="text-lg mb-2">Components</h2>
      {items.map(item => <DraggableItem key={item.type} item={item} />)}
    </div>
  );
}

function DraggableItem({ item }: { item: { type: string; label: string } }) {
  // pull out the drag connector
  const [, dragConnector] = useDrag(() => ({
    type: item.type,
    item
  }));

  // wrap it so it returns void
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) dragConnector(node);
  }, [dragConnector]);

  return (
    <div
      ref={ref}
      className="p-2 mb-2 bg-gray-700 rounded cursor-move text-white"
    >
      {item.label}
    </div>
  );
}

export default Palette;