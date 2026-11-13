import { describe, expect, it } from 'vitest'
import { readLanguage, translate } from './siteLanguage'

describe('production language preference', () => {
  it('defaults to English without storage access', () => {
    expect(readLanguage()).toBe('en')
    expect(readLanguage({ getItem: () => { throw new Error('blocked') } })).toBe('en')
  })
  it('retains an explicit Chinese preference', () => {
    expect(readLanguage({ getItem: () => 'zh-CN' })).toBe('zh-CN')
    expect(readLanguage({ getItem: () => 'invalid' })).toBe('en')
  })
  it('translates navigation and the existing Chinese introduction', () => {
    expect(translate('Work', 'zh-CN')).toBe('作品')
    expect(translate('在代码与想象之间，', 'en')).toBe('Between code and imagination,')
  })
  it('localizes dynamic fusion feedback while retaining technology names', () => {
    expect(translate('Vue + ESP32 = ESP32 Monitor. Open its repository.', 'zh-CN')).toBe('Vue + ESP32 = ESP32 Monitor。可打开项目仓库。')
  })
  it('leaves technical identifiers and filing information intact', () => {
    for (const text of ['TypeScript', '黑ICP备2026013426号-1', '黑公网安备23023002230262号']) {
      expect(translate(text, 'en')).toBe(text)
      expect(translate(text, 'zh-CN')).toBe(text)
    }
  })
})
