export default function DesignPanel() {
    return (
      <div className="p-4">
        <h3 className="font-bold">Design Step</h3>
        <p>Drag items onto the canvas and connect them.</p>
        <p>Select a node on the canvas to edit its properties here.</p>
        {/* Later: show InspectorPanel for selected node */}
      </div>
    )
  }