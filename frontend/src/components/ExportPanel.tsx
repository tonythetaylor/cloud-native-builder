import useProjectStore from "../store/useProjectStore"

export default function ExportPanel() {
    const elements = useProjectStore(s => s.elements)
    const projectName = useProjectStore(s => s.projectName)
  
    const handleExport = () => {
      // call your /export/terraform here…
    }
  
    return (
      <div className="p-4">
        <h3 className="font-bold mb-2">Review & Export</h3>
        <p className="mb-2">Preview your elements:</p>
        <ul className="list-disc pl-5 mb-4">
          {elements.map((el, i) => (
            <li key={i}>{el.type} “{el.label}” @ ({Math.round(el.x)},{Math.round(el.y)})</li>
          ))}
        </ul>
  
        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export Terraform
        </button>
      </div>
    )
  }