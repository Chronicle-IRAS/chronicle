import { describe, expect, it } from 'vitest'
import { createRenderBudget } from './renderBudget'

describe('black hole render budget', () => {
  it('lowers resolution when consecutive visible frames stall for over 200ms', () => {
    const budget = createRenderBudget(640)
    budget.sample(1)
    budget.sample(301)
    expect(budget.resolution).toBe(640)
    budget.sample(601)
    expect(budget.resolution).toBeLessThan(640)
    for (let now = 901; now < 6000; now += 300) budget.sample(now)
    expect(budget.resolution).toBe(320)
  })
  it('does not mistake separate pauses or a resumed scene for sustained pressure', () => {
    const budget = createRenderBudget(640)
    budget.sample(1)
    budget.sample(501)
    budget.sample(517)
    budget.sample(1017)
    expect(budget.resolution).toBe(640)
    budget.reset()
    budget.sample(2001)
    budget.sample(2017)
    expect(budget.resolution).toBe(640)
  })
  it('reduces resolution under sustained pressure and keeps its minimum', () => {
    const budget = createRenderBudget(640)
    for (let now = 1; now < 15000; now += 34) budget.sample(now)
    expect(budget.resolution).toBe(320)
  })
  it('ignores isolated pauses and recovers only after sustained smooth frames', () => {
    const budget = createRenderBudget(640)
    let now = 1
    for (; now < 1500; now += 34) budget.sample(now)
    const reduced = budget.resolution
    expect(reduced).toBeLessThan(640)
    budget.reset()
    now += 5000
    budget.sample(now)
    expect(budget.resolution).toBe(reduced)
    const start = now
    for (; now < start + 3000; now += 16) budget.sample(now)
    expect(budget.resolution).toBe(reduced)
    for (; now < start + 5000; now += 16) budget.sample(now)
    expect(budget.resolution).toBe(reduced + 32)
    for (; now < start + 35000; now += 16) budget.sample(now)
    expect(budget.resolution).toBe(640)
  })
})
