import {
  NOUS_AGENT_KEY_URL,
  NOUS_CHAT_COMPLETIONS_URL,
  NOUS_DEVICE_CODE_URL,
  NOUS_MODELS_URL,
  NOUS_OAUTH_CLIENT_ID,
  NOUS_OAUTH_SCOPE,
  NOUS_PORTAL_BASE_URL,
  NOUS_TOKEN_URL,
} from "../../services/nous.js";

const nous = {
  id: "nous",
  priority: 65,
  hasFree: true,
  alias: "nous",
  aliases: ["nous-portal", "nous-research", "ns"],
  uiAlias: "nous",
  display: {
    name: "Nous Research",
    icon: "psychology",
    color: "#7C3AED",
    textIcon: "NR",
    website: "https://nousresearch.com",
    notice: {
      text: "Connect with OAuth Device Code (free account, no payment required) or a Nous Portal API key.",
      signupUrl: "https://portal.nousresearch.com",
      apiKeyUrl: "https://portal.nousresearch.com/api-keys",
    },
  },
  category: "freeTier",
  authType: "oauth",
  authModes: ["oauth", "apikey"],
  hasOAuth: true,
  transport: {
    baseUrl: NOUS_CHAT_COMPLETIONS_URL,
    format: "openai",
    auth: {
      combined: true,
      header: "Authorization",
      scheme: "bearer",
    },
  },
  oauth: {
    clientId: NOUS_OAUTH_CLIENT_ID,
    portalBaseUrl: NOUS_PORTAL_BASE_URL,
    deviceCodeUrl: NOUS_DEVICE_CODE_URL,
    tokenUrl: NOUS_TOKEN_URL,
    agentKeyUrl: NOUS_AGENT_KEY_URL,
    scope: NOUS_OAUTH_SCOPE,
  },
  // Live free-tier models, verified against
  // https://inference-api.nousresearch.com/v1/models on 2026-11-23.
  // Nous delists free models without notice; refresh this list when a
  // model starts 404ing.
  models: [
    {
      id: "meituan/longcat-2.5:free",
      name: "Meituan: LongCat 2.5",
      contextLength: 1048576,
      maxOutputTokens: 131072,
    },
    {
      id: "qwen/qwen4-max:free",
      name: "Qwen: Qwen4 Max",
      contextLength: 1000000,
      maxOutputTokens: 131072,
    },
    {
      id: "tencent/hy4-flash:free",
      name: "Tencent: Hy4 Flash",
      contextLength: 1048576,
      maxOutputTokens: 65536,
    },
    {
      id: "upstage/solar-mini4:free",
      name: "Upstage: Solar Mini 4",
      contextLength: 524288,
      maxOutputTokens: 131072,
    },
    {
      id: "stepfun/step-3.7-flash:free",
      name: "StepFun: Step 3.7 Flash",
      contextLength: 256000,
      maxOutputTokens: 230400,
    },
  ],
  serviceKinds: ["llm", "imageToText"],
  modelsFetcher: { url: NOUS_MODELS_URL, type: "nous-free" },
  passthroughModels: true,
};

export default nous;
