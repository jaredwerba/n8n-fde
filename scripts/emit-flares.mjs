import { writeFileSync } from "node:fs";
import { flareJs } from "./flares.mjs";

const workflow = {
  name: "Solar flares",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "solar-flares",
        responseMode: "responseNode",
        options: {},
      },
      id: "b22b0001-0000-4000-8000-000000000001",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [240, 300],
      webhookId: "b22b0001-0000-4000-8000-000000000011",
    },
    {
      parameters: {
        url: "={{ 'https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR?startDate=' + $today.minus(7, 'days').toFormat('yyyy-MM-dd') + '&endDate=' + $today.toFormat('yyyy-MM-dd') }}",
        options: {},
      },
      id: "b22b0001-0000-4000-8000-000000000002",
      name: "DONKI solar flares",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 4.2,
      position: [500, 300],
    },
    {
      parameters: { jsCode: flareJs() },
      id: "b22b0001-0000-4000-8000-000000000003",
      name: "If class contains X",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [760, 300],
    },
    {
      parameters: { respondWith: "firstIncomingItem", options: {} },
      id: "b22b0001-0000-4000-8000-000000000004",
      name: "Respond to Webhook",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [1020, 300],
    },
  ],
  connections: {
    Webhook: { main: [[{ node: "DONKI solar flares", type: "main", index: 0 }]] },
    "DONKI solar flares": { main: [[{ node: "If class contains X", type: "main", index: 0 }]] },
    "If class contains X": { main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]] },
  },
  pinData: {},
  settings: { executionOrder: "v1" },
  staticData: null,
  meta: { templateCredsSetupCompleted: true },
  tags: [],
};

const out = new URL("../workflows/solar-flares.json", import.meta.url);
writeFileSync(out, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`wrote ${out.pathname}`);
