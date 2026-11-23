export default {
  id: "anthropic",
  priority: 30,
  alias: "anthropic",
  display: {
    name: "Anthropic",
    icon: "smart_toy",
    color: "#D97757",
    textIcon: "AN",
    website: "https://console.anthropic.com",
    notice: {
      apiKeyUrl: "https://console.anthropic.com/settings/keys",
    },
  },
  category: "apikey",
  transport: {
    baseUrl: "https://api.anthropic.com/v1/messages",
    format: "claude",
    headers: {
      "anthropic-version": "2023-06-01",
      "Anthropic-Beta": "claude-code-20250219,interleaved-thinking-2025-05-14",
    },
  },
  // Refreshed 2026-11-23 from the Anthropic models overview
  // (platform.claude.com/docs/en/models/overview): the 5.x family is
  // current; the 4.x dated snapshots stay because the docs still list
  // Opus 4 / Sonnet 4 as available. Claude 3.5 Sonnet dropped — no longer
  // in the docs' model table.
  models: [
    { id: "claude-fable-5-2", name: "Claude Fable 5.2" },
    { id: "claude-opus-5-5", name: "Claude Opus 5.5" },
    { id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5" },
    { id: "claude-haiku-5-5", name: "Claude Haiku 5.5" },
    { id: "claude-opus-5", name: "Claude Opus 5" },
    { id: "claude-fable-5", name: "Claude Fable 5" },
    { id: "claude-sonnet-5", name: "Claude Sonnet 5" },
    { id: "claude-haiku-4-5-20251001", name: "Claude 4.5 Haiku" },
    { id: "claude-opus-4-20250514", name: "Claude Opus 4" },
    { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
  ],
  serviceKinds: ["llm","imageToText"],
};
