# Design: Session Language Cache

**Date:** 2025-03-17
**Status:** Approved
**Author:** AI Assistant

## Problem

The smart-title-it plugin generates titles in English even when the user writes in Italian. This happens because:

1. Language detection runs on every title update
2. The model sees mixed-language context (Italian user messages + English assistant responses)
3. The model tends to follow the dominant language in the context it sees

## Solution

Cache the detected language per session on first detection. Use that cached language for all subsequent title updates in the same session.

## Design

### Core Logic

```
Session starts
     ↓
First idle event
     ↓
Detect language from first user message
     ↓
Store: sessionLanguages[sessionId] = detectedLanguage
     ↓
All future title updates use cached language
     ↓
Session ends (language cache entry remains in memory)
```

### Data Structure

```typescript
// In-memory map: sessionId → language code
const sessionLanguages = new Map<string, string>()
```

### Modified Flow in `updateSessionTitle()`

```typescript
// Before: detected language on every call
const firstUserText = turns[0]?.user?.text || ''
const detectedLanguage = detectLanguage(firstUserText)

// After: check cache first, detect only if not cached
let detectedLanguage = sessionLanguages.get(sessionId)
if (!detectedLanguage) {
    const firstUserText = turns[0]?.user?.text || ''
    detectedLanguage = detectLanguage(firstUserText)
    sessionLanguages.set(sessionId, detectedLanguage)
}
```

### Benefits

1. **Deterministic**: Language never changes during a session
2. **Simple**: Single detection, no complex logic
3. **Predictable**: User knows what to expect
4. **No performance overhead**: Map lookup is O(1)

### Edge Cases

| Case | Behavior |
|------|----------|
| User switches language mid-session | Title stays in original detected language |
| Session restarts | Language re-detected from first message |
| First message too short (< 10 chars) | Falls back to 'en' |

## Files to Modify

| File | Change |
|------|--------|
| `index.ts` | Add `sessionLanguages` Map, modify `updateSessionTitle()` |

## Acceptance Criteria

- [ ] Language is detected once per session
- [ ] Cached language is used for all title updates in that session
- [ ] Log messages indicate when language is detected vs cached
- [ ] Plugin still works for English sessions (backwards compatible)
- [ ] Build succeeds with no errors
