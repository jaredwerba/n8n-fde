# Projects

The first three projects are the interview set.
The next four are public demos from common n8n patterns.
Address solar is a Google Solar API project. It needs a key in n8n, not in git.
Each one has a rule that runs without n8n.
Each one has an import file.
Read `docs/n8n-instance.md` for what is active on the instance.

| Level | Name | Import file | Check command |
| --- | --- | --- | --- |
| Beginner | Solar flares | `workflows/solar-flares.json` | `node scripts/flares.mjs fixtures/flares-7d.json` |
| Intermediate | Signal to outreach | `workflows/signal-to-outreach.json` | `node scripts/score.mjs fixtures/signal-*.json` |
| Advanced | Intake triage | `workflows/intake-triage.json` | `node scripts/triage.mjs fixtures/incomplete.json fixtures/push-back.json fixtures/simplify.json fixtures/build.json` |
| Public demo | Boston weather | `workflows/boston-weather.json` | `node scripts/public-demos.mjs fixtures/weather-boston.json` |
| Public demo | HN front page | `workflows/hn-front-page.json` | `node scripts/public-demos.mjs fixtures/hn-front.json` |
| Public demo | Dollar to euro | `workflows/usd-eur.json` | `node scripts/public-demos.mjs fixtures/usd-eur.json` |
| Public demo | n8n blog titles | `workflows/n8n-blog-titles.json` | `node scripts/public-demos.mjs fixtures/n8n-blog.xml` |
| Google Solar | Address solar | `workflows/address-solar.json` | `node scripts/solar.mjs fixtures/solar-building.json` |
| OpenRouter | Company brief | `workflows/company-brief.json` | `node scripts/company.mjs fixtures/company-brief.json` |

The writing in these files follows ASD-STE100.
The rule list is in `docs/STE.md`.
The specification itself is not in this repository.

## Where the prototypes came from

1. Beginner. The official n8n guide "Build your first workflow". The live DONKI URL replaced the retired NASA URL.
2. Intermediate. The signal-to-outreach demo that already runs at https://n8n-demo-three.vercel.app/.
3. Advanced. The intake decision that was the first commit in this repository.
4. Public demos. Common no-key patterns: Open-Meteo, Hacker News, Frankfurter, and an RSS title list. Read `docs/projects/04-public-demos.md`.
5. Address solar. Google `buildingInsights:findClosest` after a geocode. Read `docs/projects/05-solar.md`. The key is an n8n variable named `GOOGLE_SOLAR_API_KEY`.
6. Company brief. n8n calls OpenRouter with web search. Read `docs/projects/06-company.md`. The key is an n8n variable named `OPENROUTER_API_KEY`.

Do not add a template that needs a private credential until the owner adds that credential in n8n.
