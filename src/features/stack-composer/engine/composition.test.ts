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
    expect(resolveComposition(['typescript', 'react'])).toMatchObject({ kind: 'project', label: 'Blueprint Editor' })
    expect(resolveComposition(['ai', 'nodejs'])).toMatchObject({ kind: 'concept', label: 'Experimental Concept' })
  })

  it('derives only results backed by existing edges', () => {
    const edge = { id: 'one', source: 'tech:vue', target: 'tech:esp32' }
    const results = deriveResultNodes(initialTechNodes, [edge], {})
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({ id: 'result:esp32+vue', type: 'project', connectable: false })
    expect(deriveResultNodes(initialTechNodes, [], {})).toEqual([])
  })
})
