# Auto Language Detection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add automatic language detection to generate session titles in the user's language.

**Architecture:** Use `tinyld` library to detect language from first user message. Modify prompt system to accept language parameter. Default to English if detection fails.

**Tech Stack:** TypeScript, tinyld, existing plugin infrastructure

---

## Task 1: Add tinyld Dependency

**Files:**
- Modify: `package.json`

**Step 1: Add tinyld to dependencies**

In `package.json`, add to dependencies:

```json
"tinyld": "^1.3.4"
```

**Step 2: Install dependency**

Run: `npm install`
Expected: tinyld installed successfully

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add tinyld for language detection"
```

---

## Task 2: Create Language Detector Module

**Files:**
- Create: `lib/language-detector.ts`

**Step 1: Write the module**

Create `lib/language-detector.ts`:

```typescript
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
```

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/language-detector.ts
git commit -m "feat: add language detection module"
```

---

## Task 3: Update Prompt Module

**Files:**
- Modify: `prompt.ts`

**Step 1: Replace static prompt with function**

Replace entire `prompt.ts` content:

```typescript
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
```

**Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add prompt.ts
git commit -m "feat: make prompt dynamic with language support"
```

---

## Task 4: Integrate Language Detection in Main Plugin

**Files:**
- Modify: `index.ts`

**Step 1: Add import for language detector**

At line 18, after `import { TITLE_PROMPT } from "./prompt.js"`, replace with:

```typescript
import { getTitlePrompt } from "./prompt.js"
import { detectLanguage } from "./lib/language-detector.js"
```

**Step 2: Add language detection before title generation**

In `generateTitleFromContext` function (around line 267), add language parameter:

Change function signature from:
```typescript
async function generateTitleFromContext(
    context: string,
    configModel: string | undefined,
    logger: Logger,
    client: OpenCodeClient
): Promise<string | null>
```

To:
```typescript
async function generateTitleFromContext(
    context: string,
    language: string,
    configModel: string | undefined,
    logger: Logger,
    client: OpenCodeClient
): Promise<string | null>
```

**Step 3: Use dynamic prompt in generateText call**

Replace line 323:
```typescript
content: `${TITLE_PROMPT}\n\n<conversation>\n${context}\n</conversation>\n\nOutput the title now:`
```

With:
```typescript
content: `${getTitlePrompt(language)}\n\n<conversation>\n${context}\n</conversation>\n\nOutput the title now:`
```

**Step 4: Detect language in updateSessionTitle**

In `updateSessionTitle` function, add language detection after extracting turns (around line 360):

After:
```typescript
const turns = await extractSmartContext(client, sessionId, logger)

if (turns.length === 0) {
    logger.warn('update-title', 'No conversation turns found', { sessionId })
    return
}
```

Add:
```typescript
// Detect language from first user message
const firstUserText = turns[0]?.user?.text || ''
const detectedLanguage = detectLanguage(firstUserText)
logger.info('update-title', 'Language detected', {
    sessionId,
    language: detectedLanguage,
    sampleText: truncate(firstUserText, 50)
})
```

**Step 5: Pass language to generateTitleFromContext**

Update the call (around line 385) from:
```typescript
const newTitle = await generateTitleFromContext(
    context,
    config.model,
    logger,
    client
)
```

To:
```typescript
const newTitle = await generateTitleFromContext(
    context,
    detectedLanguage,
    config.model,
    logger,
    client
)
```

**Step 6: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 7: Commit**

```bash
git add index.ts
git commit -m "feat: integrate automatic language detection"
```

---

## Task 5: Build and Test

**Files:**
- Build output: `dist/`

**Step 1: Build the plugin**

Run: `npm run build`
Expected: Build successful, no errors

**Step 2: Verify dist output**

Run: `ls -la dist/`
Expected: `index.js`, `lib/` directory with compiled files

**Step 3: Commit build artifacts**

```bash
git add dist/
git commit -m "build: compile with language detection"
```

---

## Task 6: Push Changes

**Step 1: Push to remote**

Run: `git push origin master`
Expected: Changes pushed to GitHub

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Add tinyld dependency | `package.json` |
| 2 | Create language detector | `lib/language-detector.ts` |
| 3 | Make prompt dynamic | `prompt.ts` |
| 4 | Integrate detection | `index.ts` |
| 5 | Build plugin | `dist/` |
| 6 | Push to remote | - |

**Testing:** Restart OpenCode and start a conversation in Italian. The session title should be generated in Italian.
