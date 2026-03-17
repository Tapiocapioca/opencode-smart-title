import { detect } from 'tinyld'

export function detectLanguage(text: string): string {
  if (!text || text.trim().length < 10) {
    return 'en'
  }

  try {
    const result = detect(text)
    if (result && typeof result === 'string') {
      return result
    }
    return 'en'
  } catch {
    return 'en'
  }
}
