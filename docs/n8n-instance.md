# n8n instance check

Check date: 2026-10-05
Instance name: jaredwerba
Instance URL: https://jaredwerba.app.n8n.cloud
Result: six workflows are hosted. Five returned data. Address solar is active and waits for a key.

## What is hosted

Name: Solar flares
Id: 4hBDxRr0V6CUM28B
State: active
Editor: https://jaredwerba.app.n8n.cloud/workflow/4hBDxRr0V6CUM28B
Webhook: https://jaredwerba.app.n8n.cloud/webhook/solar-flares

A POST to that webhook on 2026-10-05 returned HTTP 200.
The body had four flares and an empty X-class list.
The classes were C8.6, B3.2, B9.3, and M1.0.

Four public demos were added on the same date.
Each one is active. A POST to each webhook returned HTTP 200.

| Name | Id | Webhook path | Live result |
| --- | --- | --- | --- |
| Boston weather | CEEYwAhzIj73eIph | `boston-weather` | Boston, 18.2 C |
| HN front page | lYpeTaWAFDYUTFJi | `hn-front-page` | five titles |
| Dollar to euro | NHACtZUIRDl9oC90 | `usd-eur` | 0.89254 |
| n8n blog titles | PKb7BuLsrVQnkuMC | `n8n-blog-titles` | five titles |
| Address solar | cgpi9Yf605PkqnBL | `solar-address` | hosted. A live solar result needs `GOOGLE_SOLAR_API_KEY` in n8n. |
| Company brief | JTXCpQ19WzI8Hhqd | `company-brief` | active. A Cloudflare POST returned executives, one printed IR email, and job titles. |

Signal to outreach and Intake triage are not on the instance yet.

## What you do next

1. Open an editor link from the table above.
2. Read the nodes before you change them.
3. Import the other two files only when you want them on this instance.
4. Do not add a credential to these workflows. They do not use one.

The webhooks have no authentication. Anyone with the URL can run them.
Do not send private data to them.

