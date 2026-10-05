# Three projects

These three projects are the interview set.
Each one has a rule that runs without n8n.
Each one has an import file.
None of them is active on the n8n cloud instance yet.
Read `docs/n8n-instance.md` for that check.

| Level | Name | Import file | Check command |
| --- | --- | --- | --- |
| Beginner | Solar flares | `workflows/solar-flares.json` | `node scripts/flares.mjs fixtures/flares-7d.json` |
| Intermediate | Signal to outreach | `workflows/signal-to-outreach.json` | `node scripts/score.mjs fixtures/signal-*.json` |
| Advanced | Intake triage | `workflows/intake-triage.json` | `node scripts/triage.mjs fixtures/incomplete.json fixtures/push-back.json fixtures/simplify.json fixtures/build.json` |

The writing in these files follows ASD-STE100.
The rule list is in `docs/STE.md`.
The specification itself is not in this repository.

## Where the prototypes came from

1. Beginner. The official n8n guide "Build your first workflow". The live DONKI URL replaced the retired NASA URL. The Vercel page `/flares` already runs this split.
2. Intermediate. The signal-to-outreach demo that already runs at https://n8n-demo-three.vercel.app/. The rule was copied from `lib/score.ts` in that project.
3. Advanced. The intake decision that was the first commit in this repository. The four fixtures already pass.

Do not start a fourth project until these three import into n8n and match the local checks.
