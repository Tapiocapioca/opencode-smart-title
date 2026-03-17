# Smart Title Plugin

Auto-generates meaningful session titles for your OpenCode conversations using AI — **in your language**.

> **Fork of:** [tarquinen/opencode-smart-title](https://github.com/tarquinen/opencode-smart-title)

## What's Different from Original

This fork adds **automatic language detection** and **multilingual title generation**:

| Feature | Description |
|---------|-------------|
| **Language Detection** | Uses [tinyld](https://github.com/kom-senap/tinyld) to detect the user's language from the first message |
| **Session Language Cache** | Detected language is cached for the entire session — ensures consistent titles |
| **Smart Corrections** | Handles false positives (e.g., Latin text detected as Italian) |
| **Dynamic Prompts** | Generates titles in the detected language, not hardcoded English |

### Supported Languages

29 languages supported: English, Italian, Spanish, French, German, Portuguese, Russian, Chinese, Japanese, Korean, Dutch, Polish, Turkish, Arabic, Hindi, Vietnamese, Thai, Indonesian, Malay, Czech, Swedish, Danish, Norwegian, Finnish, Ukrainian, Romanian, Hungarian, Greek, Hebrew.

## How It Works

1. **First message detection** — When you start a session, the plugin detects your language from your first message
2. **Language caching** — That language is stored for the entire session
3. **Title generation** — All subsequent titles are generated in that language
4. **Consistent experience** — Even if the assistant replies in English, your titles stay in your language

## What It Does

- Watches your conversation and generates short, descriptive titles
- Updates automatically when the session becomes idle (you stop typing)
- Uses OpenCode's unified auth — no API keys needed
- Works with any authenticated AI provider

## Installation

```bash
npm install @tapiocapioca/opencode-smart-title
```

Add to `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["@tapiocapioca/opencode-smart-title"]
}
```

## Configuration

The plugin supports both global and project-level configuration:

- **Global:** `~/.config/opencode/smart-title.jsonc` — Applies to all sessions
- **Project:** `.opencode/smart-title.jsonc` — Overrides global config

The plugin creates a default global config on first run.

```jsonc
{
  // Enable or disable the plugin
  "enabled": true,

  // Enable debug logging
  "debug": false,

  // Optional: Use a specific model (otherwise uses smart fallbacks)
  // "model": "anthropic/claude-haiku-4-5",

  // Update title every N idle events (1 = every time you pause)
  "updateThreshold": 1
}
```

## Debugging

Enable `debug: true` in your config to see logs at:

```
~/.config/opencode/logs/smart-title/YYYY-MM-DD.log
```

Look for:
- `Language detected and cached for session` — First detection
- `Using cached language for session` — Subsequent updates

## License

MIT
