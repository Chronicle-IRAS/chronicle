import { describe, expect, it } from 'vitest'
import { initialTechNodes } from '../data/initialNodes'
import { deriveResultNodes, normalizeComposition, resolveComposition } from './composition'

describe('composition engine', () => {
  it('treats ingredients as an unordered pair', () => {
    expect(normalizeComposition(['vue', 'esp32'])).toBe('esp32+vue')
    expect(normalizeComposition(['esp32', 'vue'])).toBe('esp32+vue')
  })

  it('resolves recipes and falls back to a concept', () => {
    expect(resolveComposition(['vue', 'esp32'])).toMatchObject({ kind: 'project', label: 'ESP32 Monitor' })
    expect(resolveComposition(['qt', 'cpp'])).toMatchObject({ kind: 'project', label: 'Qt Blueprint Generator' })
    expect(resolveComposition(['ai', 'nodejs'])).toMatchObject({ kind: 'concept', label: 'A new possibility' })
    expect(resolveComposition(['typescript', 'react']).kind).toBe('concept')
    expect(resolveComposition(['typescript', 'react']).href).toBeUndefined()
  })

  it.each([
    { pair: ['vue', 'esp32'], path: 'monitor' },
    { pair: ['qt', 'cpp'], path: 'qt-blueprint-generator' },
    { pair: ['typescript', 'ai'], path: 'palm-netlify-proxy' },
  ])('opens the verified repository for $path regardless of connection direction', ({ pair, path }) => {
    const href = `https://github.com/Chronicle-IRAS/${path}`
    expect(resolveComposition(pair).href).toBe(href)
    expect(resolveComposition([...pair].reverse()).href).toBe(href)
    const results = deriveResultNodes(initialTechNodes, [{ id: 'link', source: `tech:${pair[0]}`, target: `tech:${pair[1]}` }], {})
    expect(results[0].data.href).toBe(href)
    expect(results[0].connectable).toBe(false)
    expect(deriveResultNodes(initialTechNodes, [], {})).toHaveLength(0)
  })

  it('derives only results backed by existing edges', () => {
    const edge = { id: 'one', source: 'tech:vue', target: 'tech:esp32' }
    const results = deriveResultNodes(initialTechNodes, [edge], {})
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ id: 'result:esp32+vue', type: 'project', connectable: false })
    expect(deriveResultNodes(initialTechNodes, [], {})).toEqual([])
  })
  it('places new results clear of technology cards and earlier results', () => {
    const edges = [
      { id: 'a', source: 'tech:react', target: 'tech:typescript' },
      { id: 'b', source: 'tech:vue', target: 'tech:esp32' },
    ]
    const results = deriveResultNodes(initialTechNodes, edges, {})
    expect(results[0].position.y).toBeGreaterThan(205 + 130)
    expect(results[1].position.y).toBeGreaterThan(results[0].position.y + 130)
    expect(deriveResultNodes(initialTechNodes, edges, { 'result:react+typescript': { x: 12, y: 34 } })[0].position).toEqual({ x: 12, y: 34 })
  })
})
