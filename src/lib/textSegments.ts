/** Keep Latin words intact while allowing Chinese display text to wrap. */
export function textSegments(text: string): string[] {
  return text.split(/(\s+|[\p{Script=Han}])/u).filter(Boolean)
}
