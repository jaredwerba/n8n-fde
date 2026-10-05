// Writes workflows/address-solar.json. Do not edit that file by hand.

import { writeFileSync } from "node:fs";
import { solarJs } from "./solar.mjs";

const workflow = {
  name: "Address solar",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "solar-address",
        responseMode: "responseNode",
        options: {},
      },
      id: "d55d0001-0000-4000-8000-000000000001",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [240, 300],
      webhookId: "d55d0001-0000-4000-8000-000000000009",
    },
    {
      parameters: { jsCode: solarJs() },
      id: "d55d0001-0000-4000-8000-000000000003",
      name: "Geocode and solar",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [560, 300],
    },
    {
      parameters: { respondWith: "firstIncomingItem", options: {} },
      id: "d55d0001-0000-4000-8000-000000000004",
      name: "Respond to Webhook",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [880, 300],
    },
  ],
  connections: {
    Webhook: { main: [[{ node: "Geocode and solar", type: "main", index: 0 }]] },
    "Geocode and solar": { main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]] },
  },
  pinData: {},
  settings: { executionOrder: "v1" },
  staticData: null,
  meta: { templateCredsSetupCompleted: true },
  tags: [],
};

const out = new URL("../workflows/address-solar.json", import.meta.url);
writeFileSync(out, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`wrote ${out.pathname}`);
