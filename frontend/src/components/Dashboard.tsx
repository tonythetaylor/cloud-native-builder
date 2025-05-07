import React from 'react';
import TopBar from './TopBar';
import Palette from './Palette';
import Canvas from './Canvas';
import useProjectStore from '../store/useProjectStore';

export default function Dashboard() {
  const elements = useProjectStore(state=>state.elements);
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white p-4">
          <Palette />
        </aside>
        <main className="flex-1 bg-gray-100 p-4">
          <Canvas />
        </main>
      </div>
    </div>
  );
}
