# Project 3. Advanced

Name: Intake triage
Level: advanced
Source: the decision workflow already in this repository
Status: the four fixtures pass. The n8n cloud instance does not host this workflow yet.

## What this project does

A customer ask comes in on a webhook.
The workflow does not start a build.
It first selects one of four decisions:

- incomplete: the ask is missing a required field.
- push-back: the ask is too large for a short engagement.
- simplify: the ask fights its own constraint, or it is not a slice yet.
- build: the ask has a trigger, an owner, a constraint, and a number.

The workflow returns the decision, the reason, and the first slice.
The customer still owns the workflow after you leave.

## Why this is the advanced project

The other two projects transform data.
This project decides whether you should build.
That decision is the FDE job.
A workflow that runs is not a success if the ask was unbounded.

The push-back case is the example to learn.
The ask is: sync every field into Slack in real time.
The system is Salesforce.
The decision is push-back.
The first slice is one object, two fields, and a 5-minute schedule.

## Files

- `scripts/triage.mjs` holds the decision.
- `scripts/emit-workflow.mjs` writes the workflow file.
- `workflows/intake-triage.json` is the import file.
- `fixtures/incomplete.json` expects incomplete.
- `fixtures/push-back.json` expects push-back.
- `fixtures/simplify.json` expects simplify.
- `fixtures/build.json` expects build.

Do not edit `workflows/intake-triage.json` by hand.
Change `scripts/triage.mjs`. Then emit the file again.

## How to check the rule without n8n

1. Open a terminal in this repository.
2. Run `node scripts/triage.mjs fixtures/incomplete.json fixtures/push-back.json fixtures/simplify.json fixtures/build.json`.
3. Confirm that each line starts with `ok`.
4. Read the reason on the push-back line out loud.
5. If you cannot say why push-back is not build, stop here.

## How to import the workflow

1. Open your n8n instance.
2. Select Import from File.
3. Select `workflows/intake-triage.json`.
4. Read the webhook path. The path is `intake-triage`.
5. Send the `request` object from `fixtures/build.json`.
6. Send the `request` object from `fixtures/push-back.json`.
7. Send the `request` object from `fixtures/incomplete.json`.
8. Do not activate the workflow until those three calls match the script.

## A known defect

The incomplete decision sets `http_status` to 400.
The HTTP response is still 200.
The status is only a field in the JSON.
This is a defect. Do not hide it in an interview.

The correction belongs in the editor, not in a hand edit of the JSON.

1. Import the workflow.
2. Add a second Respond to Webhook node.
3. Set the response code of that node to 400.
4. Send the incomplete decision to that node.
5. Export the workflow.
6. Replace `workflows/intake-triage.json` with the export.
7. Run the fixture command again.

## Limits

This workflow does not create a customer workflow.
It only classifies the ask.
Do not add a Salesforce credential to prove the push-back case.
The push-back case is correct before any node connects to Salesforce.
A custom node is out of scope.
The simplify fixture exists to show that case.
