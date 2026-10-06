# Company brief

A user sends a company name. n8n asks OpenRouter to search public pages. The model returns a short brief. This site does not guess a personal email.

## What you send

POST JSON to `company-brief`, or open the URL with `?company=`.

```
{ "company": "Cloudflare" }
```

## What n8n does

1. The webhook reads the company name.
2. The Code node reads `OPENROUTER_API_KEY` from an n8n variable.
3. n8n posts to `https://openrouter.ai/api/v1/chat/completions`.
4. The model is `openai/gpt-4o-mini` with the web plugin, four results.
5. The Code node keeps only a short JSON brief.
6. The Respond node returns that brief.

## What the brief may contain

1. A one-line summary.
2. Executives named on a public leadership page, with the page URL.
3. Email addresses that are printed on a public page, with that page URL.
4. A careers URL and job titles from that public page.
5. The source URLs the model used.

An empty email list is a result. The workflow must not invent `first.last@company.com`.

## Key

This file does not contain an OpenRouter key.
Add `OPENROUTER_API_KEY` in the n8n UI.
Do not paste the key into git or into the workflow JSON.

The webhook has no authentication. A caller can spend the key credit.
Cap the key in OpenRouter. Do not send a private key in the request body.

## How to check the rule without OpenRouter

1. Open a terminal in this repository.
2. Run `node scripts/company.mjs fixtures/company-brief.json`.
3. Confirm that the line starts with `ok`.
4. Run `node scripts/emit-company.mjs` after a rule change.

Do not edit `workflows/company-brief.json` by hand.
