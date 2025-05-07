import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import useProjectStore, { Element } from '../store/useProjectStore';

export default function Canvas() {
  const elements = useProjectStore((s) => s.elements);
  const selectedIndex = useProjectStore((s) => s.selectedIndex);
  const addElement = useProjectStore((s) => s.addElement);
  const selectElement = useProjectStore((s) => s.selectElement);

  const [, dropConnector] = useDrop(() => ({
    accept: ['EC2', 'S3', 'VPC', 'Lambda'],
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) addElement({ ...item, x: offset.x, y: offset.y });
    },
  }));

  const dropRef = useCallback((node: HTMLDivElement | null) => {
    if (node) dropConnector(node);
  }, [dropConnector]);

  return (
    <div ref={dropRef} className="relative w-full h-full border-2 border-dashed border-gray-400">
      {elements.map((el: Element, idx: number) => (
        <div
          key={idx}
          onClick={() => selectElement(idx)}
          style={{ position: 'absolute', left: el.x, top: el.y, cursor: 'pointer' }}
        >
          <div
            className={`p-2 bg-white shadow ${selectedIndex === idx ? 'ring-2 ring-blue-500' : ''}`}
          >
            {el.label}
          </div>
        </div>
      ))}
    </div>
  );
}

