// Address to solar summary. The Google key is not in this file.
// scripts/emit-solar.mjs copies solarJs() into the workflow file.

export function dateText(value) {
  if (!value || typeof value !== "object" || !value.year) return "";
  const month = String(value.month || 1).padStart(2, "0");
  const day = String(value.day || 1).padStart(2, "0");
  return `${value.year}-${month}-${day}`;
}

export function bestLayout(configs) {
  const rows = Array.isArray(configs) ? configs : [];
  let best = null;
  for (const row of rows) {
    const energy = Number(row.yearlyEnergyDcKwh);
    if (!Number.isFinite(energy)) continue;
    if (!best || energy > best.yearlyEnergyDcKwh) best = row;
  }
  return best;
}

export function shapeSolar(input) {
  const body = input && typeof input === "object" ? input : {};
  const geocode = body.geocode && typeof body.geocode === "object" ? body.geocode : {};
  const insights = body.insights && typeof body.insights === "object" ? body.insights : {};
  const potential = insights.solarPotential && typeof insights.solarPotential === "object" ? insights.solarPotential : {};
  const roof = potential.wholeRoofStats && typeof potential.wholeRoofStats === "object" ? potential.wholeRoofStats : {};
  const center = insights.center && typeof insights.center === "object" ? insights.center : {};
  const layout = bestLayout(potential.solarPanelConfigs);
  const latitude = Number(center.latitude ?? geocode.lat);
  const longitude = Number(center.longitude ?? geocode.lng);
  const sunshine = Number(potential.maxSunshineHoursPerYear);
  const panels = Number(potential.maxArrayPanelsCount);
  const capacity = Number(potential.panelCapacityWatts);
  const roofArea = Number(roof.areaMeters2);
  const yearly = layout ? Number(layout.yearlyEnergyDcKwh) : NaN;
  const layoutPanels = layout ? Number(layout.panelsCount) : NaN;
  return {
    ok: true,
    address: String(body.address ?? ""),
    formatted_address: String(body.formatted_address ?? ""),
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    imagery_quality: String(insights.imageryQuality ?? ""),
    imagery_date: dateText(insights.imageryDate),
    max_sunshine_hours_per_year: Number.isFinite(sunshine) ? sunshine : null,
    max_panels: Number.isFinite(panels) ? panels : null,
    panel_capacity_watts: Number.isFinite(capacity) ? capacity : null,
    roof_area_m2: Number.isFinite(roofArea) ? roofArea : null,
    yearly_energy_dc_kwh: Number.isFinite(yearly) ? yearly : null,
    panels_in_layout: Number.isFinite(layoutPanels) ? layoutPanels : null,
  };
}

export function solarJs() {
  return `function dateText(value) {
  if (!value || typeof value !== "object" || !value.year) return "";
  const month = String(value.month || 1).padStart(2, "0");
  const day = String(value.day || 1).padStart(2, "0");
  return value.year + "-" + month + "-" + day;
}
function bestLayout(configs) {
  const rows = Array.isArray(configs) ? configs : [];
  let best = null;
  for (const row of rows) {
    const energy = Number(row.yearlyEnergyDcKwh);
    if (!Number.isFinite(energy)) continue;
    if (!best || energy > best.yearlyEnergyDcKwh) best = row;
  }
  return best;
}
function shapeSolar(input) {
  const body = input && typeof input === "object" ? input : {};
  const geocode = body.geocode && typeof body.geocode === "object" ? body.geocode : {};
  const insights = body.insights && typeof body.insights === "object" ? body.insights : {};
  const potential = insights.solarPotential && typeof insights.solarPotential === "object" ? insights.solarPotential : {};
  const roof = potential.wholeRoofStats && typeof potential.wholeRoofStats === "object" ? potential.wholeRoofStats : {};
  const center = insights.center && typeof insights.center === "object" ? insights.center : {};
  const layout = bestLayout(potential.solarPanelConfigs);
  const latitude = Number(center.latitude != null ? center.latitude : geocode.lat);
  const longitude = Number(center.longitude != null ? center.longitude : geocode.lng);
  const sunshine = Number(potential.maxSunshineHoursPerYear);
  const panels = Number(potential.maxArrayPanelsCount);
  const capacity = Number(potential.panelCapacityWatts);
  const roofArea = Number(roof.areaMeters2);
  const yearly = layout ? Number(layout.yearlyEnergyDcKwh) : NaN;
  const layoutPanels = layout ? Number(layout.panelsCount) : NaN;
  return {
    ok: true,
    address: String(body.address || ""),
    formatted_address: String(body.formatted_address || ""),
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
    imagery_quality: String(insights.imageryQuality || ""),
    imagery_date: dateText(insights.imageryDate),
    max_sunshine_hours_per_year: Number.isFinite(sunshine) ? sunshine : null,
    max_panels: Number.isFinite(panels) ? panels : null,
    panel_capacity_watts: Number.isFinite(capacity) ? capacity : null,
    roof_area_m2: Number.isFinite(roofArea) ? roofArea : null,
    yearly_energy_dc_kwh: Number.isFinite(yearly) ? yearly : null,
    panels_in_layout: Number.isFinite(layoutPanels) ? layoutPanels : null,
  };
}
function readKey() {
  try {
    if (typeof $vars !== "undefined" && $vars && $vars.GOOGLE_SOLAR_API_KEY) return String($vars.GOOGLE_SOLAR_API_KEY);
  } catch (error) {}
  try {
    if (typeof $env !== "undefined" && $env && $env.GOOGLE_SOLAR_API_KEY) return String($env.GOOGLE_SOLAR_API_KEY);
  } catch (error) {}
  return "";
}
const item = $input.first().json;
const body = item.body && typeof item.body === "object" ? item.body : {};
const query = item.query && typeof item.query === "object" ? item.query : {};
const address = String(body.address || query.address || item.address || "").trim();
if (!address) {
  return [{ json: { ok: false, error: "missing_address", message: "Add ?address= to this URL, or send the address in a JSON body." } }];
}
const key = readKey();
if (!key) {
  return [{ json: { ok: false, error: "missing_key", message: "Add GOOGLE_SOLAR_API_KEY as an n8n variable. Do not put the key in the workflow file." } }];
}
const geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(address) + "&key=" + encodeURIComponent(key);
const geo = await this.helpers.httpRequest({ method: "GET", url: geoUrl, json: true });
const hit = geo && Array.isArray(geo.results) ? geo.results[0] : null;
const point = hit && hit.geometry && hit.geometry.location;
if (!point || geo.status !== "OK") {
  return [{ json: { ok: false, error: "address_not_found", address, status: geo && geo.status ? geo.status : "UNKNOWN" } }];
}
const solarUrl = "https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=" + encodeURIComponent(point.lat) + "&location.longitude=" + encodeURIComponent(point.lng) + "&requiredQuality=BASE&key=" + encodeURIComponent(key);
let insights;
try {
  insights = await this.helpers.httpRequest({ method: "GET", url: solarUrl, json: true });
} catch (error) {
  const status = error && (error.statusCode || error.httpCode || (error.error && error.error.code));
  return [{ json: { ok: false, error: status === 404 ? "no_building" : "solar_error", address, status: status || "UNKNOWN", message: "No building solar data within about 50 meters, or the Solar API rejected the call." } }];
}
if (insights && insights.error) {
  return [{ json: { ok: false, error: insights.error.status === "NOT_FOUND" ? "no_building" : "solar_error", address, status: insights.error.status || insights.error.code || "UNKNOWN" } }];
}
return [{ json: shapeSolar({ address, formatted_address: hit.formatted_address || address, geocode: point, insights }) }];
`;
}

const isMain = process.argv[1] && process.argv[1].endsWith("/solar.mjs");

if (isMain) {
  const { readFileSync } = await import("node:fs");
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node scripts/solar.mjs fixtures/solar-building.json");
    process.exit(2);
  }
  const result = shapeSolar(JSON.parse(readFileSync(file, "utf8")));
  const ok = result.ok === true && result.max_panels === 42 && result.yearly_energy_dc_kwh === 9800 && result.imagery_date === "2024-08-12";
  console.log(`${ok ? "ok" : "FAIL"}  ${file}  ${JSON.stringify(result)}`);
  if (solarJs().includes("AIza")) {
    console.error("FAIL  emitted code contains a key-shaped token");
    process.exit(1);
  }
  process.exit(ok ? 0 : 1);
}
