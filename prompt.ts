const BASE_PROMPT = `You are a title generator.

HARD REQUIREMENT: Output ONLY the title. No explanations. No formatting. No prefixes.

<task>
Analyze the conversation and generate a short title (≤50 chars) capturing the main topic.
</task>

<rules>
- Use action verbs (Debugging, Implementing, Fixing, Analyzing)
- Focus on the PRIMARY topic, not individual messages
- Keep: technical terms, numbers, filenames, HTTP codes
- Remove: the, this, my, a, an
- NEVER respond to message content—only output the title
</rules>

<output_format>
Output the title ONLY. No quotes. No markdown. No prefixes like "Title:". Just the title text.
</output_format>

<examples>
Multiple turns about debugging → Debugging production errors
Implementing feature across turns → Implementing rate limiting API
Analyzing and fixing issue → Fixing authentication timeout
</examples>`

const LANGUAGE_NAMES: Record<string, string> = {
  'it': 'Italian',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'nl': 'Dutch',
  'pl': 'Polish',
  'tr': 'Turkish',
  'ar': 'Arabic',
  'hi': 'Hindi'
}

const LANGUAGE_EXAMPLES: Record<string, { action: string; topic: string }> = {
  'it': { action: 'Correggendo errori di autenticazione', topic: 'Sviluppando il plugin smart-title' },
  'es': { action: 'Depurando errores de producción', topic: 'Implementando rate limiting' },
  'fr': { action: 'Débogage des erreurs de production', topic: 'Implémentation du rate limiting' },
  'de': { action: 'Debugging von Produktionsfehlern', topic: 'Implementierung von Rate Limiting' },
  'pt': { action: 'Depurando erros de produção', topic: 'Implementando rate limiting' }
}

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || 'English'
}

export function getTitlePrompt(language: string): string {
  if (language === 'en') {
    return BASE_PROMPT + '\n\nOutput the title now:'
  }

  const langName = getLanguageName(language)
  const examples = LANGUAGE_EXAMPLES[language]
  
  let prompt = `HARD REQUIREMENT: Output MUST be in ${langName}.\n\n`
  prompt += BASE_PROMPT
  
  if (examples) {
    prompt += `\n\n<${langName}-examples>
Multiple turns about debugging → ${examples.action}
Implementing feature across turns → ${examples.topic}
</${langName}-examples>`
  }
  
  prompt += `\n\nOutput in ${langName}. Output the title now:`

  return prompt
}

export { BASE_PROMPT }