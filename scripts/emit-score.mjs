// Writes workflows/signal-to-outreach.json from scripts/score.mjs.
// Run after any rule change: node scripts/emit-score.mjs

import { writeFileSync } from "node:fs";
import { scoreJs } from "./score.mjs";

const workflow = {
  name: "Signal to outreach",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "signal-to-outreach",
        responseMode: "responseNode",
        options: {},
      },
      id: "c33c0001-0000-4000-8000-000000000001",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [260, 300],
      webhookId: "c33c0001-0000-4000-8000-000000000011",
    },
    {
      parameters: { jsCode: scoreJs() },
      id: "c33c0001-0000-4000-8000-000000000002",
      name: "Score and draft",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [540, 300],
    },
    {
      parameters: {
        respondWith: "firstIncomingItem",
        options: {},
      },
      id: "c33c0001-0000-4000-8000-000000000003",
      name: "Respond to Webhook",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [820, 300],
    },
  ],
  connections: {
    Webhook: {
      main: [[{ node: "Score and draft", type: "main", index: 0 }]],
    },
    "Score and draft": {
      main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]],
    },
  },
  pinData: {},
  settings: { executionOrder: "v1" },
  staticData: null,
  meta: { templateCredsSetupCompleted: true },
  tags: [],
};

const out = new URL("../workflows/signal-to-outreach.json", import.meta.url);
writeFileSync(out, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`wrote ${out.pathname}`);
