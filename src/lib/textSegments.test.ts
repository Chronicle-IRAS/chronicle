import { describe, expect, it } from 'vitest'
import { textSegments } from './textSegments'

describe('animated heading line wrapping', () => {
  it('allows narrow Chinese headings to break between characters', () => {
    expect(textSegments('值得留下的东西。')).toEqual(['值', '得', '留', '下', '的', '东', '西', '。'])
  })
  it('keeps English words and original spacing intact', () => {
    expect(textSegments('Selected  obsessions.')).toEqual(['Selected', '  ', 'obsessions.'])
  })
  it('preserves mixed technology names and punctuation', () => {
    const text = '用 TypeScript 创造，继续探索。'
    const segments = textSegments(text)
    expect(segments).toContain('TypeScript')
    expect(segments.join('')).toBe(text)
  })
})
