// src/components/InnerCanvas.tsx
import React, { useCallback } from 'react';
import ReactFlow, {
  useReactFlow,
  Node,
  Connection,
  Background,
  Controls,
  MiniMap,
} from 'react-flow-renderer';
import useProjectStore, { Element as LegacyElement } from '../store/useProjectStore';
import RegionNode from './nodes/RegionNode';
import ServiceNode from './nodes/ServiceNode';
import ResizableGroupNode from './nodes/ResizableGroupNode';

export const nodeTypes = {
  region: RegionNode,
  service: ServiceNode,
  group: ResizableGroupNode,
};

export default function InnerCanvas({ wrapperRef }: { wrapperRef: React.RefObject<HTMLDivElement | null> }) {
  const { project, getNodes } = useReactFlow();
  const nodes        = useProjectStore(s => s.nodes);
  const addNode      = useProjectStore(s => s.addNode);
  const addElement   = useProjectStore(s => s.addElement);
  const onNodesChange = useProjectStore(s => s.onNodesChange);
  const onEdgesChange = useProjectStore(s => s.onEdgesChange);
  const addEdge      = useProjectStore(s => s.addEdge);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type  = event.dataTransfer.getData('application/reactflow');
    const label = event.dataTransfer.getData('text/plain');
    if (!type || !wrapperRef.current) return;
    
    const { clientX, clientY } = event;
    const bounds = wrapperRef.current.getBoundingClientRect();
    const flowPos = project({
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    });

    // 1) Find the group node under this drop, if any
    let parentId: string | undefined;
    for (const n of getNodes()) {
      if (n.type === 'group') {
        const { x: gx, y: gy } = n.position;
        const { width = 0, height = 0 } = n.data;    // assume your ResizableGroupNode writes its size into n.data
        if (
          flowPos.x >= gx &&
          flowPos.x <= gx + width &&
          flowPos.y >= gy &&
          flowPos.y <= gy + height
        ) {
          parentId = n.id;
          break;
        }
      }
    }

    // 2) Create a flow node, with parentNode & extent if inside a group
    const newNode: Node = {
      id: `${nodes.length}`,
      type: type.toLowerCase(),           // e.g. 'service' or 'group'
      data: { label, width: 300, height: 200 }, // your group node must report its size here
      position: flowPos,
      ...(parentId
        ? { parentNode: parentId, extent: 'parent' as const }
        : {}),
    };

    addNode(newNode);

    // 3) Mirror into legacy store for export
    addElement({ type, label, x: flowPos.x, y: flowPos.y });
  }, [project, getNodes, nodes.length, wrapperRef, addNode, addElement]);

  const onDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), []);
  const onConnect  = useCallback((c: Connection) => addEdge({
    id: `${c.source}-${c.target}`,
    source: c.source!,
    target: c.target!,
  }), [addEdge]);

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={useProjectStore.getState().edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}