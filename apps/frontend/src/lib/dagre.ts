import { QuestionNodeUnion } from '@/app/painel-administrador/abordagens/[abordagemId]/eixos/[eixoId]/page'
import { Edge } from '@xyflow/react'
import dagre from 'dagre'

// export interface BaseNodeData {
//   title?: string
//   isLeaf?: boolean
//   parentId?: string
//   childrenIds?: string[]
//   parentTransitionId?: string
// }

// export interface BaseNode {
//   id: string
//   type: string
//   data: BaseNodeData
//   position: { x: number; y: number }
// }

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

const nodeWidth = 600
const nodeHeight = 300
const ghostNodeWidth = 600
const ghostNodeHeight = 300

export function getLayoutedElements(nodes: QuestionNodeUnion[], edges: Edge[]) {
  dagreGraph.setGraph({ rankdir: 'TB' })

  nodes.forEach((node) => {
    const width = node.type === 'ghostNode' ? ghostNodeWidth : nodeWidth
    const height = node.type === 'ghostNode' ? ghostNodeHeight : nodeHeight
    dagreGraph.setNode(node.id, { width, height })
  })

  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target))

  dagre.layout(dagreGraph)

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    const width = node.type === 'ghostNode' ? ghostNodeWidth : nodeWidth
    const height = node.type === 'ghostNode' ? ghostNodeHeight : nodeHeight

    node.position = {
      x: nodeWithPosition.x - width / 2,
      y: nodeWithPosition.y - height / 2,
    }
    return node
  })

  return { nodes: layoutedNodes, edges }
}
