// Writes workflows/intake-triage.json from scripts/triage.mjs.
// Run after any rule change: node scripts/emit-workflow.mjs

import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("./triage.mjs", import.meta.url), "utf8");
const start = source.indexOf("export function decide");
const end = source.indexOf("const isMain");
if (start < 0 || end < 0) {
  throw new Error("triage.mjs markers missing");
}

const fn = source.slice(start, end).replace("export function decide", "function decide");
const jsCode = `${fn}
const item = $input.first().json;
const body = item.body && typeof item.body === "object" ? item.body : item;
return [{ json: decide(body) }];
`;

const workflow = {
  name: "Intake triage",
  nodes: [
    {
      parameters: {
        httpMethod: "POST",
        path: "intake-triage",
        responseMode: "responseNode",
        options: {},
      },
      id: "a11a0001-0000-4000-8000-000000000001",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [260, 300],
      webhookId: "a11a0001-0000-4000-8000-000000000011",
    },
    {
      parameters: { jsCode },
      id: "a11a0001-0000-4000-8000-000000000002",
      name: "Decide",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [540, 300],
    },
    {
      parameters: {
        respondWith: "firstIncomingItem",
        options: {},
      },
      id: "a11a0001-0000-4000-8000-000000000003",
      name: "Respond to Webhook",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [820, 300],
    },
  ],
  connections: {
    Webhook: {
      main: [[{ node: "Decide", type: "main", index: 0 }]],
    },
    Decide: {
      main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]],
    },
  },
  pinData: {},
  settings: { executionOrder: "v1" },
  staticData: null,
  meta: { templateCredsSetupCompleted: true },
  tags: [],
};

const out = new URL("../workflows/intake-triage.json", import.meta.url);
writeFileSync(out, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`wrote ${out.pathname}`);
