# n8n instance check

Check date: 2026-10-05
Result: no workflow is hosted on the n8n cloud instance.

## What the check found

The account exists. The workspace does not.

Chromium on this machine still shows the title "Launching workspace - n8n.cloud".
The last account URL in the browser history is `https://app.n8n.cloud/account/launching`.
That visit was at 19:49 UTC on 2026-10-05.
Earlier the same hour the browser opened the register page, a magic link, and the invite page.

A second browser, with a copy of the local profile, opened `https://app.n8n.cloud/dashboard`.
n8n sent that browser to the sign-in page.
The sign-in page asks for an instance name.
No instance name is on record in this repository.

The public API also needs an instance name.
The base URL is `https://<instance>.app.n8n.cloud/api/v1`.
Without that name, a workflow list call cannot start.

## What is not a hosted n8n workflow

These systems run. They are not the n8n instance.

- https://n8n-demo-three.vercel.app/flares runs the beginner split in the Vercel app.
- https://n8n-demo-three.vercel.app/ runs the intermediate score in the Vercel app.
- `node scripts/triage.mjs` runs the advanced decision on this machine.

The Vercel badge "Local rules" means the page did not call n8n.

## What you do when the workspace opens

1. Copy the instance name from the browser address bar.
2. Write the name in this file. Do not write a password or an API key.
3. In n8n, select Import from File.
4. Import `workflows/solar-flares.json`.
5. Import `workflows/signal-to-outreach.json`.
6. Import `workflows/intake-triage.json`.
7. Run one fixture for each workflow.
8. Compare each result with the local script.
9. Activate a workflow only after that comparison matches.
10. Update the status line in each project file.

Do not click the Chromium window that is still on the launch page.
That window belongs to the operator.
If the launch page does not finish, open n8n in a new tab and sign in there.
