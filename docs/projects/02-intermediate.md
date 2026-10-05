# Project 2. Intermediate

Name: Signal to outreach
Level: intermediate
Source: the Vercel demo that already runs
Demo URL: https://n8n-demo-three.vercel.app/
Status: the rule runs on Vercel. The n8n cloud instance does not host this workflow yet.

## What this project does

A short account signal comes in on a webhook.
The workflow scores the account from 0 to 100.
The score selects one of three bands: pursue, nurture, or pass.
Pursue means send a short note.
Nurture means hold the note.
Pass means do not send the note.
The workflow returns JSON. It does not send email.

## Why this is the intermediate project

The beginner project uses one condition.
This project uses many rules, a number, and three outcomes.
It also returns a draft that a person can read.
It still uses only nodes that ship with n8n.
It does not call a model and it does not store a credential.

## Where the working copy lives

The first working copy is in the Vercel project `n8n-demo`.

- The page is https://n8n-demo-three.vercel.app/.
- The rule file in that project is `lib/score.ts`.
- The import file on that host is `/workflows/signal-to-outreach.json`.

This repository keeps a copy so the interview set is in one place.

- `scripts/score.mjs` is the rule.
- `scripts/emit-score.mjs` writes the workflow file.
- `workflows/signal-to-outreach.json` is the import file.
- `fixtures/signal-pursue.json` expects pursue.
- `fixtures/signal-nurture.json` expects nurture.
- `fixtures/signal-pass.json` expects pass.

The word lists in `scripts/score.mjs` match `lib/score.ts`.
If you change a word or a point value, change both files.
Then run `node scripts/emit-score.mjs`.

## How to check the rule without n8n

1. Open a terminal in this repository.
2. Run `node scripts/score.mjs fixtures/signal-*.json`.
3. Confirm that each line starts with `ok`.
4. Read the band and the action on each line.

The pass fixture is a local bakery.
A low score is the correct result.
Do not "fix" the fixture so that the bakery gets a meeting.

## How to import the workflow

1. Open your n8n instance.
2. Select Import from File.
3. Select `workflows/signal-to-outreach.json`.
4. Read the webhook path. The path is `signal-to-outreach`.
5. Send one fixture in the request body.
6. Compare the JSON with the local script result.
7. Activate the workflow only after that comparison matches.

## Limits

The draft is a suggestion. The workflow does not send it.
Do not connect Gmail or Slack until a person has read the draft.
The score is a teaching score. It is not a forecast.
Do not put a customer name from a real deal into the public demo.
