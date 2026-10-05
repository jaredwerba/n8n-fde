# n8n FDE

Small n8n project staged for a Forward Deployed Engineer conversation.

The artifact is an intake workflow: a request comes in, and the workflow says build, simplify, or push back before anyone opens the editor. That is the job. A 5-day engagement that ships an unbounded sync is a failure even if the nodes run.

This repo does not claim a production deployment. The rules run today without n8n. The editor is the next step.

## What is here

- `scripts/triage.mjs` is the decision. Four fixtures cover the branches.
- `workflows/intake-triage.json` is the same function, emitted into an importable workflow. Do not edit that file by hand.
- `docker-compose.yml` is a local n8n 2.41.7 plus Postgres, adapted from the official `n8n-hosting` withPostgres example. It is not a customer deploy.

## Run the decision without n8n

```bash
node scripts/triage.mjs fixtures/*.json
node scripts/emit-workflow.mjs
```

Node 20 or newer. No install.

## Run n8n locally

This machine's user cannot talk to the Docker socket yet. Fix that before the compose command, or run compose with whatever rights you use for Docker.

```bash
cp .env.example .env
# replace every change-me value
docker compose up -d
```

Open http://localhost:5678. Import `workflows/intake-triage.json`. The webhook path is `intake-triage`, response mode "Using Respond to Webhook node". Activate it, then POST a fixture `request` object at the production URL.

No credentials are in this repo. Do not add any.

## Known limits

The Respond node returns the decision JSON. `http_status` is a field, not the HTTP status code. Splitting incomplete onto its own Respond node, with status 400, is the first edit to make inside the editor and re-export. Hand-writing a Switch node into the JSON is how imports break.
