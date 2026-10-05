# n8n FDE

Small n8n project for a Forward Deployed Engineer conversation.

The built entry-level project is n8n's own first workflow: fetch the last seven days of solar flares, then split on whether `classType` contains `X`. Docs: https://docs.n8n.io/build-your-first-workflow

`api.nasa.gov/DONKI` redirects as of 2026-09-30. The runnable workflow calls `https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR` instead. Checked live on 2026-10-05: four flares, none of them X-class. An empty true branch is a result.

## What is here

- `workflows/solar-flares.json` is the importable workflow. Webhook path `solar-flares`. Do not edit it by hand. Regenerate with `node scripts/emit-flares.mjs`.
- `workflows/tutorial-first-workflow.json` is the official docs canvas (Schedule, NASA node, If, PostBin) with the sample credential removed. The NASA node still points at the retired URL.
- `scripts/flares.mjs` is the split. `fixtures/flares-7d.json` is the live pull from that day.
- `workflows/intake-triage.json` is a separate staged decision workflow, not this project.

The screen-share page is on the Vercel project, at `/flares`. It runs this same split until `N8N_FLARES_WEBHOOK_URL` is set.

## Run the split without n8n

```bash
node scripts/flares.mjs fixtures/flares-7d.json
node scripts/emit-flares.mjs
```

## Run n8n locally

This machine's user cannot talk to the Docker socket yet.

```bash
cp .env.example .env
# replace every change-me value
docker compose up -d
```

Open http://localhost:5678. Import `workflows/solar-flares.json`. The webhook path is `solar-flares`.

No credentials are in this repo. Do not add any.

## Known limits

The hosted page and `solar-flares.json` use a Code node for the If, so one webhook response can carry both branches. An empty true branch would hang a Merge node. The official If node is in `tutorial-first-workflow.json` for the editor. The NASA node in that file still calls the retired URL.

