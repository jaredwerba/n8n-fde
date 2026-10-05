# Four public demos

These four projects copy popular n8n patterns.
They do not copy a template that needs a private credential.
Gmail, Slack, Stripe, and Sheets templates are common.
They are not in this set, because a credential is not in this repository.

Each file uses the same shape as the official "Creating an API endpoint" template.
A webhook receives a POST.
An HTTP node reads a public URL.
A Code node shapes the JSON.
A Respond node returns that JSON.

| Name | Public source | Import file | Webhook path |
| --- | --- | --- | --- |
| Boston weather | Open-Meteo | `workflows/boston-weather.json` | `boston-weather` |
| HN front page | Hacker News search | `workflows/hn-front-page.json` | `hn-front-page` |
| Dollar to euro | Frankfurter | `workflows/usd-eur.json` | `usd-eur` |
| n8n blog titles | n8n Blog RSS | `workflows/n8n-blog-titles.json` | `n8n-blog-titles` |

## Why these four

1. HTTP Request is the most common node in public n8n template lists.
2. RSS Read is a common node. This set uses the n8n blog feed.
3. A currency rate is a common finance demo. Frankfurter does not need a key. The old `api.frankfurter.app` URL now redirects. The workflow uses `api.frankfurter.dev`.
4. A front-page list is a common no-key API demo. This one uses the Hacker News search API.

## How to check the rules without n8n

1. Open a terminal in this repository.
2. Run `node scripts/public-demos.mjs fixtures/weather-boston.json fixtures/hn-front.json fixtures/usd-eur.json fixtures/n8n-blog.xml`.
3. Confirm that each line starts with `ok`.
4. Run `node scripts/emit-public.mjs` after a rule change.

Do not edit the JSON files by hand.

## Limits

The weather place is Boston. It is not a city picker.
The front page returns five titles. It does not open the articles.
The rate is one pair, USD to EUR. It is not a trading workflow.
The blog parser reads plain title tags and CDATA title tags. It skips the feed name "n8n Blog".
None of these workflows sends mail or writes to a third-party account.
