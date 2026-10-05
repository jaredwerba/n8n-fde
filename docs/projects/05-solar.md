# Address solar

A user sends an address. The workflow returns a short solar summary for the nearest building.

The Google call is `buildingInsights:findClosest`.
Docs: https://developers.google.com/maps/documentation/solar/building-insights

The Solar API takes a latitude and a longitude. It does not take a street address.
This project geocodes the address first, then asks for the closest building.

## What you send

POST JSON to the webhook path `solar-address`.

```
{ "address": "1600 Amphitheatre Parkway, Mountain View, CA" }
```

## What you get

The response keeps a small set of fields:

1. The formatted address and the point used.
2. Imagery quality and imagery date.
3. Max sunshine hours per year.
4. Max panel count and panel capacity in watts.
5. Roof area in square meters.
6. Yearly energy for the layout with the highest `yearlyEnergyDcKwh`.

A missing building is a result. Google returns `NOT_FOUND` when no building is within about 50 meters.
An empty address is a result. The workflow does not invent a point.

## Key

This file does not contain a Google API key.
The workflow reads `GOOGLE_SOLAR_API_KEY` from an n8n variable, then from an environment variable.
Add that variable in the n8n UI. Enable the Geocoding API and the Solar API on that key.
Do not paste the key into the workflow JSON or into git.

`requiredQuality` is `BASE`. A HIGH-only request returns 404 when the imagery is lower quality.

## How to check the rule without Google

1. Open a terminal in this repository.
2. Run `node scripts/solar.mjs fixtures/solar-building.json`.
3. Confirm that the line starts with `ok`.
4. Run `node scripts/emit-solar.mjs` after a rule change.

Do not edit `workflows/address-solar.json` by hand.

## Limits

The webhook has no authentication. A caller can spend your Google quota.
Do not send a private key in the request body.
This project does not return GeoTIFF layers or a bill estimate.
Coverage is not worldwide. A valid address can still return `no_building`.
