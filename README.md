# n8n FDE

Three small n8n projects for a Forward Deployed Engineer conversation.
The writing in `docs/` follows ASD-STE100. The rule list is `docs/STE.md`.

| Level | Project | Check |
| --- | --- | --- |
| Beginner | Solar flares | `node scripts/flares.mjs fixtures/flares-7d.json` |
| Intermediate | Signal to outreach | `node scripts/score.mjs fixtures/signal-*.json` |
| Advanced | Intake triage | `node scripts/triage.mjs fixtures/incomplete.json fixtures/push-back.json fixtures/simplify.json fixtures/build.json` |

Read `docs/projects/README.md` before you import a file.
Read `docs/n8n-instance.md` for the cloud check.
The instance is `jaredwerba`. Solar flares is active there and a live webhook call returned four flares.

## Beginner

The official first workflow gets the last seven days of solar flares.
It splits on whether `classType` contains `X`.
Docs: https://docs.n8n.io/build-your-first-workflow

`api.nasa.gov/DONKI` redirects as of 2026-09-30.
The runnable file calls `https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR`.
A live check on 2026-10-05 returned four flares and no X-class flare.
An empty true branch is a result.

The screen-share page is https://n8n-demo-three.vercel.app/flares.
It runs the same split until `N8N_FLARES_WEBHOOK_URL` is set.

## Intermediate

A signal comes in. The workflow scores the account and drafts a note, or it declines.
The first working copy is the Vercel page https://n8n-demo-three.vercel.app/.
This repository holds the same rule so the interview set is in one place.
The workflow does not send email.

## Advanced

An ask comes in. The workflow says build, simplify, push back, or incomplete.
It does not start a build.
The push-back fixture is the one to read out loud.

## Import

```bash
node scripts/emit-flares.mjs
node scripts/emit-score.mjs
node scripts/emit-workflow.mjs
```

Do not edit the files in `workflows/` by hand.
Open http://localhost:5678 after `docker compose up -d`, or open the cloud instance when it finishes launching.
Import the three JSON files. Read each webhook path before you activate it.

This machine cannot talk to the Docker socket yet.
No credentials are in this repository. Do not add any.

## Known limits

The beginner import file uses a Code node so one response can hold both branches.
The official If node is in `workflows/tutorial-first-workflow.json`.
The NASA node in that file still calls the retired URL.
The incomplete decision sets `http_status` to 400, but the HTTP response is still 200.
Fix that in the editor, then export. Do not hand-edit the JSON.
