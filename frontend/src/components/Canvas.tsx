import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import useProjectStore from '../store/useProjectStore';
export default function Canvas() {
  const elements   = useProjectStore(state=>state.elements);
  const addElement = useProjectStore(state=>state.addElement);
  const [, dropConnector] = useDrop(() => ({ accept: ['EC2','S3','VPC','Lambda'], drop: (item:any,monitor) => { const offset = monitor.getClientOffset(); if(offset) addElement({ ...item,x:offset.x,y:offset.y }); }}));
  const ref = useCallback((node: HTMLDivElement | null) => { if(node) dropConnector(node); }, [dropConnector]);
  return (<div ref={ref} className="relative w-full h-full border-2 border-dashed border-gray-400">{elements.map((el,idx)=><div key={idx} style={{ position:'absolute',left:el.x,top:el.y}}><div className="p-2 bg-white shadow">{el.label}</div></div>)}</div>);
}