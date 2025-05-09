// src/components/RequirementsPanel.tsx
import React, { useState } from "react";
import useProjectStore, { Requirement } from "../store/useProjectStore";
import { v4 as uuid } from "uuid";

export default function RequirementsPanel() {
  const requirements = useProjectStore((s) => s.requirements);
  const addReq = useProjectStore((s) => s.addRequirement);

  // form state
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [category, setCategory] = useState<Requirement["category"]>("region");
  const [parentGroupId, setParent] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const groups = requirements.filter((r) => r.isGroup);

  const onAdd = () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    addReq({
      id: uuid(),
      title: trimmed,
      text: text.trim(),
      isGroup,
      category,
      priority: "P1",
      status: "draft",
      owner: undefined,
      sla: undefined,
      parentGroupId: isGroup ? undefined : parentGroupId || undefined,
    });

    // reset
    setTitle("");
    setText("");
    setParent("");
  };

  return (
    <aside className="flex flex-col h-full bg-white border-r">
      {/* header + toggles */}
      <header className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Capture Requirements</h2>
          <p className="text-sm text-gray-600">Define groups & items.</p>
        </div>
        <div className="space-x-2">
          <button
            onClick={() => setViewMode((m) => (m === "list" ? "grid" : "list"))}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            {viewMode === "list" ? "Grid View" : "List View"}
          </button>
          <label className="ml-4">
            <input
              type="radio"
              checked={!isGroup}
              onChange={() => setIsGroup(false)}
            />{" "}
            Item
          </label>
          <label className="ml-2">
            <input
              type="radio"
              checked={isGroup}
              onChange={() => setIsGroup(true)}
            />{" "}
            Group
          </label>
        </div>
      </header>

      {/* existing */}
      <section className="p-4 flex-1 overflow-auto">
        {requirements.length === 0 ? (
          <p className="text-gray-500">No requirements yet.</p>
        ) : viewMode === "list" ? (
          /* —— LIST VIEW —— */
          <ul className="space-y-2">
            {requirements.map((r) => (
              <li
                key={r.id}
                className={`p-2 border rounded ${
                  r.isGroup ? "bg-yellow-50" : "bg-gray-50"
                }`}
              >
                <strong>{r.isGroup ? "[Group] " : "[Item] "}</strong>
                {r.title}
                {r.parentGroupId && (
                  <span className="text-xs text-gray-500 ml-2">
                    (in {r.parentGroupId})
                  </span>
                )}
                {r.text && <p className="text-sm mt-1">{r.text}</p>}
              </li>
            ))}
          </ul>
        ) : (
          /* —— GRID VIEW —— */
          <div className="space-y-6">
            {/* groups with their items */}
            <div className="grid grid-cols-2 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border rounded-lg p-4 bg-yellow-50"
                >
                  <h3 className="font-bold mb-2">[Group] {group.title}</h3>
                  <div className="space-y-2">
                    {requirements
                      .filter(
                        (item) =>
                          !item.isGroup && item.parentGroupId === group.id
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-2 border rounded bg-white"
                        >
                          <strong>{item.title}</strong>
                          {item.text && <p className="text-sm">{item.text}</p>}
                        </div>
                      ))}
                    {/* empty placeholder */}
                    {requirements.every(
                      (item) => item.parentGroupId !== group.id
                    ) && (
                      <p className="text-sm italic text-gray-500">
                        No items yet
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* un‑grouped items */}
            {requirements.some((r) => !r.isGroup && !r.parentGroupId) && (
              <>
                <h4 className="text-lg font-semibold">Ungrouped Items</h4>
                <div className="grid grid-cols-2 gap-4">
                  {requirements
                    .filter((item) => !item.isGroup && !item.parentGroupId)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded bg-white"
                      >
                        <strong>{item.title}</strong>
                        {item.text && <p className="text-sm">{item.text}</p>}
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* add new */}
      <footer className="p-4 border-t space-y-2">
        {/* wrap them in a flex div, align to the left */}
        <div className="mt-2 flex items-center space-x-4">
          <span className="font-medium">Type:</span>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={!isGroup}
              onChange={() => setIsGroup(false)}
              className="form-radio"
            />
            <span>Item</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={isGroup}
              onChange={() => setIsGroup(true)}
              className="form-radio"
            />
            <span>Group</span>
          </label>
        </div>

        <input
          className="w-full border px-2 py-1"
          placeholder={isGroup ? "Group name" : "Item title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border px-2 py-1"
          placeholder="Description"
          rows={isGroup ? 1 : 2}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* only for items */}
        {!isGroup && (
          <select
            className="w-full border px-2 py-1"
            value={parentGroupId}
            onChange={(e) => setParent(e.target.value)}
          >
            <option value="">(no group)</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={onAdd}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Add {isGroup ? "Group" : "Item"}
        </button>
      </footer>
    </aside>
  );
}
