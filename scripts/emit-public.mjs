// Writes the four public demo workflows. Do not edit workflows/*.json by hand.

import { writeFileSync } from "node:fs";
import { weatherJs, hnJs, fxJs, rssJs } from "./public-demos.mjs";

function workflow({ name, path, url, httpName, jsCode, id, text }) {
  const http = {
    parameters: { url, options: {} },
    id: `${id}2`,
    name: httpName,
    type: "n8n-nodes-base.httpRequest",
    typeVersion: 4.2,
    position: [500, 300],
  };
  if (text) {
    http.parameters.options = { response: { response: { responseFormat: "text" } } };
  }
  return {
    name,
    nodes: [
      {
        parameters: {
          httpMethod: "POST",
          path,
          responseMode: "responseNode",
          options: {},
        },
        id: `${id}1`,
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [240, 300],
        webhookId: `${id}9`,
      },
      http,
      {
        parameters: { jsCode },
        id: `${id}3`,
        name: "Shape",
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [760, 300],
      },
      {
        parameters: { respondWith: "firstIncomingItem", options: {} },
        id: `${id}4`,
        name: "Respond to Webhook",
        type: "n8n-nodes-base.respondToWebhook",
        typeVersion: 1.1,
        position: [1020, 300],
      },
    ],
    connections: {
      Webhook: { main: [[{ node: httpName, type: "main", index: 0 }]] },
      [httpName]: { main: [[{ node: "Shape", type: "main", index: 0 }]] },
      Shape: { main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]] },
    },
    pinData: {},
    settings: { executionOrder: "v1" },
    staticData: null,
    meta: { templateCredsSetupCompleted: true },
    tags: [],
  };
}

const demos = [
  workflow({
    name: "Boston weather",
    path: "boston-weather",
    url: "https://api.open-meteo.com/v1/forecast?latitude=42.36&longitude=-71.06&current=temperature_2m,weather_code&timezone=America%2FNew_York",
    httpName: "Open-Meteo",
    jsCode: weatherJs(),
    id: "d44d0001-0000-4000-8000-00000000000",
  }),
  workflow({
    name: "HN front page",
    path: "hn-front-page",
    url: "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=5",
    httpName: "HN search",
    jsCode: hnJs(),
    id: "d44d0002-0000-4000-8000-00000000000",
  }),
  workflow({
    name: "Dollar to euro",
    path: "usd-eur",
    url: "https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR",
    httpName: "Frankfurter",
    jsCode: fxJs(),
    id: "d44d0003-0000-4000-8000-00000000000",
  }),
  workflow({
    name: "n8n blog titles",
    path: "n8n-blog-titles",
    url: "https://blog.n8n.io/rss/",
    httpName: "Blog RSS",
    jsCode: rssJs(),
    id: "d44d0004-0000-4000-8000-00000000000",
    text: true,
  }),
];

const files = [
  "boston-weather.json",
  "hn-front-page.json",
  "usd-eur.json",
  "n8n-blog-titles.json",
];

demos.forEach((item, index) => {
  const out = new URL(`../workflows/${files[index]}`, import.meta.url);
  writeFileSync(out, `${JSON.stringify(item, null, 2)}\n`);
  console.log(`wrote ${out.pathname}`);
});
