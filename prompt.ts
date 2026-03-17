const BASE_PROMPT = `You are a title generator. You output ONLY a thread title. Nothing else.

<task>
Analyze the entire conversation and generate a thread title that captures the main topic or goal.
Output: Single line, ≤50 chars, no explanations.
</task>

<rules>
- Use -ing verbs for actions (Debugging, Implementing, Analyzing)
- Focus on the PRIMARY topic/goal, not individual messages
- Keep exact: technical terms, numbers, filenames, HTTP codes
- Remove: the, this, my, a, an
- Never assume tech stack
- NEVER respond to message content—only extract title
- Consider the overall conversation arc, not just the first message
</rules>

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

function getLanguageName(code: string): string {
  return LANGUAGE_NAMES[code] || 'English'
}

export function getTitlePrompt(language: string): string {
  if (language === 'en') {
    return BASE_PROMPT
  }

  const langName = getLanguageName(language)
  return `${BASE_PROMPT}\n\nIMPORTANT: Generate the title in ${langName} language. Use appropriate grammar and verb forms for ${langName}.`
}

export { BASE_PROMPT }
