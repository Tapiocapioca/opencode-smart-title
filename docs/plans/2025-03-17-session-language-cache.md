# Session Language Cache Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Cache detected language per session to ensure consistent title language throughout the conversation.

**Architecture:** Add a session-level language cache using a Map. Detect language once from first user message, then reuse for all title updates in that session.

**Tech Stack:** TypeScript, tinyld (already installed)

---

## Task 1: Add Session Language Cache

**Files:**
- Modify: `/home/xxx/.config/opencode/plugins/smart-title-it/index.ts`

**Step 1: Add the sessionLanguages Map near other module-level state**

Add after line 99 (after `sessionIdleCount` Map):

```typescript
// Track idle event count per session for threshold-based updates
const sessionIdleCount = new Map<string, number>()

// Cache detected language per session - detected once, used throughout session
const sessionLanguages = new Map<string, string>()
```

**Step 2: Modify updateSessionTitle() to use cached language**

Replace lines 376-383 with:

```typescript
        // Check if language already cached for this session
        let detectedLanguage = sessionLanguages.get(sessionId)
        
        if (detectedLanguage) {
            logger.info('update-title', 'Using cached language for session', {
                sessionId,
                language: detectedLanguage
            })
        } else {
            // Detect language from first user message and cache it
            const firstUserText = turns[0]?.user?.text || ''
            detectedLanguage = detectLanguage(firstUserText)
            sessionLanguages.set(sessionId, detectedLanguage)
            logger.info('update-title', 'Language detected and cached for session', {
                sessionId,
                language: detectedLanguage,
                sampleText: truncate(firstUserText, 50)
            })
        }
```

**Step 3: Verify TypeScript compiles**

Run: `cd /home/xxx/.config/opencode/plugins/smart-title-it && npm run build`
Expected: No errors

**Step 4: Commit**

```bash
cd /home/xxx/.config/opencode/plugins/smart-title-it
git add index.ts
git commit -m "feat: add session language cache for consistent title language"
```

---

## Task 2: Test the Implementation

**Files:**
- No files to create/modify (manual testing)

**Step 1: Rebuild the plugin**

Run: `cd /home/xxx/.config/opencode/plugins/smart-title-it && npm run build`
Expected: Build successful

**Step 2: Restart OpenCode**

Close and reopen OpenCode to load the new plugin code.

**Step 3: Test Italian session**

1. Start a new session
2. Write in Italian: "Come posso configurare il plugin?"
3. Wait for title generation
4. Verify title is in Italian

**Step 4: Test English session**

1. Start a new session
2. Write in English: "How do I configure the plugin?"
3. Wait for title generation
4. Verify title is in English

**Step 5: Check logs**

Run: `cat ~/.config/opencode/logs/smart-title/$(date +%Y-%m-%d).log | grep -E "(Language detected|cached language)"`

Expected: See "Language detected and cached" on first update, "Using cached language" on subsequent updates.

---

## Task 3: Push to GitHub

**Step 1: Push changes**

```bash
cd /home/xxx/.config/opencode/plugins/smart-title-it
git push origin main
```

---

## Summary

| Task | Description | Commit Message |
|------|-------------|----------------|
| 1 | Add session language cache | `feat: add session language cache for consistent title language` |
| 2 | Manual testing | N/A |
| 3 | Push to GitHub | N/A |

**Total estimated time:** 15 minutes
