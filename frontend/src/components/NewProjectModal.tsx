import React, { useState } from 'react';

interface Props {
  onClose(): void;
  onCreate(name: string): void;
}

export function NewProjectModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80 z-60">
        <h2 className="text-lg font-bold mb-4">New Project</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          className="w-full mb-4 p-2 border"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1">Cancel</button>
          <button
            onClick={() => onCreate(name)}
            disabled={!name.trim()}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}