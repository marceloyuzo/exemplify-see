'use client'

import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import QuestionNode from '@/components/question/question-node'
import AddNode from '@/components/question/add-node'
import { getLayoutedElements } from '@/lib/dagre'
import { CustomEdge } from '@/components/question/custom-edge'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { findManyQuestions } from '@/api/questions/find-many-questions'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import AxisEditCard from '@/components/axis/axis-edit-card'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import { HomeIcon } from 'lucide-react'
import { useSingleParam } from '@/utils/single-param'
import { getAxis, GetAxisResponse } from '@/api/axis/get-axis'

export interface QuestionNodeData {
  title: string
  isLeaf: boolean
  parentId?: string
  childrenIds: string[]
  [key: string]: unknown
}

export interface AddQuestionNodeData {
  parentTransitionId: string
  [key: string]: unknown
}

export type QuestionNodeProps = Node<QuestionNodeData> & {
  type: 'questionNode'
}

export type AddQuestionNodeProps = Node<AddQuestionNodeData> & {
  type: 'ghostNode'
}

export type QuestionNodeUnion = QuestionNodeProps | AddQuestionNodeProps

export interface CustomEdgeData {
  label?: string
  [key: string]: unknown
}

export type CustomEdgeProps = Edge<CustomEdgeData>

export const nodeTypes = { questionNode: QuestionNode, ghostNode: AddNode }
export const edgeTypes = { custom: CustomEdge }

export default function EixoPage() {
  const router = useRouter()
  const params = useParams()
  const axisId = useSingleParam(params.eixoId)
  const approachId = useSingleParam(params.abordagemId)
  const { fitView } = useReactFlow()

  const {
    data: dataAxis,
    error: errorAxis,
    isLoading: isLoadingAxis,
    isFetching: isFetchingAxis,
  } = useQuery<GetAxisResponse>({
    queryKey: ['axis', axisId],
    queryFn: () =>
      getAxis({
        id: axisId,
      }),
  })

  const {
    data: dataQuestions,
    error: errorQuestions,
    isLoading: isLoadingQuestions,
  } = useQuery({
    queryKey: ['questions', params.eixoId],
    queryFn: () => findManyQuestions({ axisId }),
  })

  const [nodes, setNodes, onNodesChange] = useNodesState<QuestionNodeUnion>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeProps>([])

  const centerContent = () => {
    fitView({
      padding: 0.2,
      includeHiddenNodes: false,
      minZoom: 0.2,
      maxZoom: 1.5,
      duration: 150,
    })
  }

  useEffect(() => {
    const newNodes: QuestionNodeUnion[] = []
    const newEdges: CustomEdgeProps[] = []

    if (!dataQuestions || dataQuestions.length === 0) {
      const initialGhostNode: AddQuestionNodeProps = {
        id: 'ghost-initial',
        type: 'ghostNode',
        data: { parentTransitionId: 'initial-question' },
        position: { x: 0, y: 0 },
      }
      newNodes.push(initialGhostNode)

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(newNodes, newEdges)

      setNodes(layoutedNodes)
      setEdges(layoutedEdges)

      setTimeout(() => {
        const event = new CustomEvent('fitView')
        window.dispatchEvent(event)
      }, 150)

      return
    }

    dataQuestions.forEach((q, index) => {
      const parentId = q.transitionToHere?.fromQuestionId

      const childrenIds =
        q.transitionsFromHere
          ?.filter((t) => t.toQuestionId)
          .map((t) => t.toQuestionId!) || []

      const hasTransitionsWithTarget =
        q.transitionsFromHere?.some((t) => t.toQuestionId) || false
      const isLeaf = !hasTransitionsWithTarget

      const realNode: QuestionNodeProps = {
        id: q.id,
        type: 'questionNode',
        data: { title: q.title, isLeaf, parentId, childrenIds },
        position: { x: index * 250, y: 0 },
      }
      newNodes.push(realNode)

      q.transitionsFromHere?.forEach((t) => {
        if (t.toQuestionId) {
          newEdges.push({
            id: t.id,
            source: t.fromQuestionId,
            target: t.toQuestionId,
            label: t.answerValue.title,
            type: 'custom',
            data: { label: t.answerValue.title },
          })
        } else {
          const ghostNode: AddQuestionNodeProps = {
            id: `ghost-${t.id}`,
            type: 'ghostNode',
            data: { parentTransitionId: t.id },
            position: { x: index * 250 + 200, y: 100 },
          }
          newNodes.push(ghostNode)

          newEdges.push({
            id: `ghost-edge-${t.id}`,
            source: t.fromQuestionId,
            target: `ghost-${t.id}`,
            label: t.answerValue.title,
            type: 'custom',
            data: { label: t.answerValue.title },
          })
        }
      })

      if (!q.transitionsFromHere?.length) {
        console.log(`Creating ghost node for leaf question: ${q.title}`)

        const ghostNode: AddQuestionNodeProps = {
          id: `ghost-new-${q.id}`,
          type: 'ghostNode',
          data: { parentTransitionId: `new-transition-${q.id}` },
          position: { x: index * 250 + 200, y: 100 },
        }
        newNodes.push(ghostNode)

        newEdges.push({
          id: `ghost-edge-new-${q.id}`,
          source: q.id,
          target: `ghost-new-${q.id}`,
          label: 'Adicionar transição',
          type: 'custom',
          style: { strokeDasharray: '5,5', opacity: 0.6 },
          data: { label: 'Adicionar transição' },
        })
      }
    })

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      newNodes,
      newEdges,
    )
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)

    setTimeout(() => {
      const event = new CustomEvent('fitView')
      window.dispatchEvent(event)
    }, 150)
  }, [dataQuestions, setNodes, setEdges])

  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        centerContent()
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length])

  if (isLoadingAxis || isLoadingQuestions) {
    return <div>Carregando...</div>
  }

  if (errorAxis || errorQuestions) {
    return <div>Erro ao carregar os dados</div>
  }

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Painel Administrador', href: '/painel-administrador' },
    {
      label: 'Abordagens',
      href: ' /painel-administrador/abordagens/',
    },
    {
      label: `${dataAxis?.approache.title}`,
      href: `/painel-administrador/abordagens/${approachId}`,
    },
    {
      label: `${dataAxis?.title}`,
      isCurrent: true,
    },
  ]

  return (
    <div className="h-[calc(100vh-140px)] relative flex flex-col gap-4">
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() =>
            router.push(`/painel-administrador/abordagens/${approachId}`)
          }
          className="cursor-pointer"
        >
          Voltar
        </Button>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <AxisEditCard
        axisId={axisId}
        error={errorAxis}
        isFetching={isFetchingAxis}
        isLoading={isLoadingAxis}
        title={dataAxis?.title}
      />
      <div className="flex-1 relative">
        <Button
          onClick={centerContent}
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 z-10"
        >
          Centralizar
        </Button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          // @ts-expect-error node type mismatch: ReactFlow expects NodeProps but custom component uses QuestionNodeProps
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false,
            minZoom: 0.2,
            maxZoom: 1.5,
          }}
          minZoom={0.2}
          maxZoom={2}
          colorMode="light"
          onInit={centerContent}
          nodesDraggable={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}
