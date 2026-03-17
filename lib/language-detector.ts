import { detect } from 'tinyld'

const SUPPORTED_LANGUAGES = new Set([
  'en', 'it', 'es', 'fr', 'de', 'pt', 'ru', 'zh', 'ja', 'ko',
  'nl', 'pl', 'tr', 'ar', 'hi', 'vi', 'th', 'id', 'ms', 'cs',
  'sv', 'da', 'no', 'fi', 'uk', 'ro', 'hu', 'el', 'he'
])

const LANGUAGE_CORRECTIONS: Record<string, string> = {
  'la': 'it',
  'eo': 'en',
  'ia': 'en',
  'vo': 'en'
}

export function detectLanguage(text: string): string {
  if (!text || text.trim().length < 10) {
    return 'en'
  }

  try {
    const detected = detect(text)
    if (!detected || typeof detected !== 'string') {
      return 'en'
    }

    let lang = detected.toLowerCase()

    if (LANGUAGE_CORRECTIONS[lang]) {
      lang = LANGUAGE_CORRECTIONS[lang]
    }

    if (!SUPPORTED_LANGUAGES.has(lang)) {
      return 'en'
    }

    return lang
  } catch {
    return 'en'
  }
}
