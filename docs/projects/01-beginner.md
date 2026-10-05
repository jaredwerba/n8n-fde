# Project 1. Beginner

Name: Solar flares
Level: beginner
Source: the official n8n guide "Build your first workflow"
Source URL: https://docs.n8n.io/build-your-first-workflow
Status: the rule runs. The n8n cloud instance does not host this workflow yet.

## What this project does

The workflow gets solar-flare reports for the last seven days.
It reads the field `classType`.
If that field contains the letter X, the flare is an X-class flare.
All other flares go to the other branch.
The tutorial message is: "There was a solar flare of class" plus the class.

## Why this is the beginner project

This is the first workflow in the n8n docs.
It teaches a trigger, a data call, a condition, and an output.
It does not need a paid account.
It does not need a private credential if you use the public DONKI URL below.

## The NASA URL change

The tutorial tells you to use `api.nasa.gov`.
That host no longer returns flare data.
On 2026-09-30 the host started a redirect.
The live URL is:

https://ccmc.gsfc.nasa.gov/DONKI-API/get/FLR

The workflow file uses this URL.
The official canvas file still shows the old NASA node.
Do not run the official canvas file against the old URL.

## Files

- `scripts/flares.mjs` holds the split rule.
- `scripts/emit-flares.mjs` writes the workflow file.
- `workflows/solar-flares.json` is the file that you import.
- `workflows/tutorial-first-workflow.json` is the official canvas.
- `fixtures/flares-7d.json` is a saved response from 2026-10-05.

Do not edit `workflows/solar-flares.json` by hand.
Change the script. Then run the emit command again.

## How to check the rule without n8n

1. Open a terminal in this repository.
2. Run `node scripts/flares.mjs fixtures/flares-7d.json`.
3. Read the result.
4. Confirm that the X-class list is empty.
5. Confirm that the other list has four flares.

The four classes in that fixture are C8.6, B3.2, B9.3, and M1.0.
An empty X-class list is a correct result for that week.
The n8n docs say the same thing.
If the week has no X-class flare, the true branch is empty.

## How to import the workflow

1. Open your n8n instance.
2. Select Create Workflow.
3. Open the workflow menu.
4. Select Import from File.
5. Select `workflows/solar-flares.json`.
6. Do not add a credential. This file does not use one.
7. Read the webhook path. The path is `solar-flares`.
8. Do not activate the workflow until you have read the path.

## What already runs

The same split runs on the Vercel page:

https://n8n-demo-three.vercel.app/flares

A check on 2026-10-05 returned four flares and zero X-class flares.
The page badge said "Local rules".
That badge means the page did not call n8n.
Set `N8N_FLARES_WEBHOOK_URL` only after the workflow is active in n8n.

## Limits

The import file uses a Code node for the split.
One response can then hold both branches.
The official If node is in the tutorial canvas file.
Use that file when you want to see the two canvas branches.
An empty true branch can stop a Merge node.
Do not add a Merge node until you have tested an empty week.
