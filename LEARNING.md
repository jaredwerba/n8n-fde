# Learning path

Order matters. Do not skip to a custom node.

1. Run `node scripts/triage.mjs fixtures/*.json`. Read the four whys out loud. If you cannot say why push-back is not build, stop here.
2. Change one phrase in `scripts/triage.mjs`. Re-run the fixtures. Run `node scripts/emit-workflow.mjs`. Confirm the JSON changed and the fixtures still match.
3. Start the local instance. Import the workflow. Do not activate it until you have looked at the webhook path.
4. POST `fixtures/build.json`'s `request` object. Then push-back. Then incomplete. The incomplete case still returns HTTP 200. That is the bug to fix in the editor: a second Respond to Webhook node with response code 400. Export and replace `workflows/intake-triage.json`.
5. Only after that, split Decide into a Switch on the canvas so the three outcomes are visible without opening the Code node. Export again.
6. Custom node is not this project. The simplify fixture exists to show the case where a custom node is the wrong answer.

Docs used for the compose file: n8n stable 2.41.7 (2026-10-05), and `n8n-io/n8n-hosting` `docker-compose/withPostgres`. The full sandbox stack (n8n Assistant, privileged runner) is out of scope.
