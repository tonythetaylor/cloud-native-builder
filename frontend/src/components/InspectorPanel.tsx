import React from 'react';
import useProjectStore, { Element } from '../store/useProjectStore';

export default function InspectorPanel() {
  const selectedIndex = useProjectStore((s) => s.selectedIndex);
  const element = useProjectStore((s) => selectedIndex !== null ? s.elements[selectedIndex] : null);
  const updateElement = useProjectStore((s) => s.updateElement);

  if (selectedIndex === null || !element) return null;

  const handlePropChange = (key: keyof Element, value: any) => {
    updateElement(selectedIndex, { [key]: value });
  };

  return (
    <aside className="w-64 bg-white p-4 border-l">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Label</label>
          <input
            type="text"
            value={element.label}
            onChange={(e) => handlePropChange('label', e.target.value)}
            className="w-full p-1 border"
          />
        </div>

        {/* Example for EC2 type */}
        {element.type === 'EC2' && (
          <div>
            <label className="block text-sm font-medium">Instance Type</label>
            <select
              value={element.instanceType || 't2.micro'}
              onChange={(e) => handlePropChange('instanceType', e.target.value)}
              className="w-full p-1 border"
            >
              <option value="t2.micro">t2.micro</option>
              <option value="t3.medium">t3.medium</option>
              <option value="m5.large">m5.large</option>
            </select>
          </div>
        )}

        {/* Example for S3 type */}
        {element.type === 'S3' && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={element.encryptionEnabled || false}
              onChange={(e) => handlePropChange('encryptionEnabled', e.target.checked)}
            />
            <label className="ml-2">Enable Encryption</label>
          </div>
        )}

        <button
          onClick={() => useProjectStore.getState().selectElement(null)}
          className="mt-4 px-3 py-1 bg-red-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </aside>
  );
}