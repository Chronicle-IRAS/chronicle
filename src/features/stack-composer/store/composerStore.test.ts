import { beforeEach, expect, it } from 'vitest'
import { useComposerStore } from './composerStore'
import { deriveResultNodes } from '../engine/composition'

beforeEach(() => useComposerStore.setState({ edges: [], resultPositions: {}, resultMeasurements: {} }))

it('keeps result measurements through dragging while deriving and removing results from edges', () => {
  useComposerStore.getState().connect({ source: 'tech:vue', target: 'tech:esp32', sourceHandle: null, targetHandle: null })
  const id = 'result:esp32+vue'
  useComposerStore.getState().onNodesChange([{ id, type: 'dimensions', dimensions: { width: 180, height: 92 } }])
  useComposerStore.getState().onNodesChange([{ id, type: 'position', position: { x: 700, y: 300 } }])
  const state = useComposerStore.getState()
  expect(state.resultMeasurements[id]).toEqual({ width: 180, height: 92 })
  expect(deriveResultNodes(state.techNodes, state.edges, state.resultPositions)[0].position).toEqual({ x: 700, y: 300 })
  state.onEdgesChange([{ id: state.edges[0].id, type: 'remove' }])
  expect(deriveResultNodes(state.techNodes, useComposerStore.getState().edges, state.resultPositions)).toEqual([])
})
