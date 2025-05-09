import { create } from 'zustand'
import type { Node, Edge, NodeChange, EdgeChange, CoordinateExtent } from 'react-flow-renderer';
import { applyNodeChanges, applyEdgeChanges }  from 'reactflow'
import type { ProjectOut } from '../types'

export interface Requirement {
  id: string
  title: string
  text: string
  isGroup: boolean
  category: 'region' | 'service' | 'data-layer' | 'logic-layer'
  priority: 'P0'|'P1'|'P2'|'P3'
  owner?: string
  sla?: string
  status: 'draft'|'reviewed'|'approved'
  parentGroupId?: string
}

export interface Element {
  type: string
  label: string
  x: number
  y: number
}

interface ProjectState {
  projects: ProjectOut[]
  currentProjectId: number | null

  projectName: string
  projectDescription: string

  requirements: Requirement[]

  elements: Element[]
  nodes: Node[]
  edges: Edge[]

  setProjects: (ps: ProjectOut[]) => void
  selectProject: (id: number, config: Element[], name: string) => void

  setProjectName: (n: string) => void
  setProjectDescription: (d: string) => void

  addRequirement: (req: Requirement) => void
  updateRequirement: (id: string, changes: Partial<Requirement>) => void
  removeRequirement: (id: string) => void

  setElements: (els: Element[]) => void
  addElement: (el: Element) => void

  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  addNode: (node: Node & { parentNode?: string; extent?: CoordinateExtent | 'parent' }) => void;

  addEdge: (edge: Edge) => void

  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void

  step: number
  setStep: (n: number) => void

  updateNodeSize: (id:string, width:number, height:number, x?:number, y?:number) => void
}

const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProjectId: null,

  projectName: '',
  projectDescription: '',

  requirements: [],

  elements: [],
  nodes: [],
  edges: [],

  step: 1,

  setProjects: (projects) => set({ projects }),
  selectProject: (id, config, name) => set({
    currentProjectId: id,
    projectName: name,
    // rehydrate legacy & RF from saved config
    elements: config,
    nodes: config.map((el, idx) => ({
      id: String(idx),
      type: el.type === 'region' ? 'region' : 'default',
      data: { label: el.label },
      position: { x: el.x, y: el.y },
    })),
    edges: [],
  }),

  setProjectName: (projectName) => set({ projectName }),
  setProjectDescription: (projectDescription) => set({ projectDescription }),

  updateNodeSize: (id, width, height, x, y) => {
    set(s => {
      const nodes = s.nodes.map(n => 
        n.id === id 
          ? {
              ...n,
              position: x != null && y != null ? { x, y } : n.position,
              data: { ...n.data, width, height },
            }
          : n
      )
      return { nodes }
    })
  },

  // — REQUIREMENTS now also spawn nodes & elements —
  addRequirement: (req) => {
    set(s => {
      const newReqs = [...s.requirements, req]
      const basePos = { x: 50, y: 50 }
      const node: Node = {
        id: req.id,
        type: req.isGroup ? 'group' : 'default',
        data: {
          label: req.title,
          width: req.isGroup ? 300 : undefined,
          height: req.isGroup ? 200 : undefined,
        },
        position: basePos,
        parentNode: undefined,
        extent: req.isGroup ? undefined : 'parent'
      }

      return {
        requirements: newReqs,
        nodes: [...s.nodes, node],
        elements: [...s.elements, {
          type: req.category,
          label: req.title,
          x: basePos.x,
          y: basePos.y
        }]
      }
    })
  },

  updateRequirement: (id, changes) => set((s) => ({
    requirements: s.requirements.map(r =>
      r.id === id ? { ...r, ...changes } : r
    ),
  })),

  removeRequirement: (id) => set((s) => ({
    requirements: s.requirements.filter(r => r.id !== id),
    // optionally drop from nodes/elements too
    nodes: s.nodes.filter(n => n.id !== id),
    elements: s.elements.filter((_, i) => s.nodes[i]?.id !== id),
  })),

  // — LEGACY element-only setters (unchanged) —
  setElements: (els) => set({ elements: els }),
  addElement: (el) => set((s) => ({ elements: [...s.elements, el] })),

  // — RF-only setters (unchanged) —
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) =>
    set((s) => ({
      nodes: [...s.nodes, node],
      // if you still mirror to legacy elements, do that here too
    })),
  
    addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) })),

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  setStep: (step) => set({ step }),
}))

export default useProjectStore