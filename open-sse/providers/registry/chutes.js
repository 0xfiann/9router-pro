export default {
  id: "chutes",
  priority: 70,
  alias: "chutes",
  aliases: [
    "ch",
  ],
  uiAlias: "ch",
  display: {
    name: "Chutes AI",
    icon: "water_drop",
    color: "#ffffffff",
    textIcon: "CH",
    website: "https://chutes.ai",
    notice: {
      apiKeyUrl: "https://chutes.ai/app/api",
    },
  },
  category: "apikey",
  transport: {
    baseUrl: "https://llm.chutes.ai/v1/chat/completions",
    validateUrl: "https://llm.chutes.ai/v1/models",
  },
  // Seed snapshot from the live public catalog (llm.chutes.ai/v1/models,
  // 2026-11-23). The full catalog is fetched via modelsFetcher; any other
  // id is accepted via passthroughModels.
  models: [
    { id: "deepseek-ai/DeepSeek-V4-Pro-0813", name: "DeepSeek V4 Pro" },
    { id: "deepseek-ai/DeepSeek-V4.1-Flash-1017", name: "DeepSeek V4.1 Flash" },
    { id: "Qwen/Qwen4-Max", name: "Qwen4 Max" },
    { id: "Qwen/Qwen3.8-Max-0902", name: "Qwen3.8 Max" },
    { id: "zai-org/GLM-5.3", name: "GLM 5.3" },
    { id: "moonshotai/Kimi-K2.7-Code", name: "Kimi K2.7 Code" },
  ],
  // Chutes serves a plain OpenAI-shape /v1/models list; "opencode-go" is
  // the generic filter that passes every id through (there is no "openai"
  // filter entry — see the suggested-models FILTERS map).
  modelsFetcher: { url: "https://llm.chutes.ai/v1/models", type: "opencode-go" },
  passthroughModels: true,
};
