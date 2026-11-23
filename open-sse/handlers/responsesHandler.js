// 9router_Pro: responsesHandler removed as dead code (2026-11-23).
// handleResponsesCore had zero importers anywhere in the repo (no static
// or dynamic import, no re-export, no config reference); /v1/responses is
// served by handleChat in src/sse/handlers/chat.js via
// src/app/api/v1/responses/route.js. This stub stays in place so the fork
// and the sandbox tree remain identical (the push procedure cannot delete
// files). No exports.
