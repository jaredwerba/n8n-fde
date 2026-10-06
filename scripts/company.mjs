// Company brief. OpenRouter shapes public web results. The key is not in this file.

export function shapeBrief(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const list = (value) => (Array.isArray(value) ? value : []).slice(0, 8).map((row) => {
    const item = row && typeof row === "object" ? row : {};
    return {
      name: String(item.name ?? "").trim(),
      title: String(item.title ?? "").trim(),
      source: String(item.source ?? "").trim(),
    };
  }).filter((row) => row.name || row.title);
  const emails = (Array.isArray(body.emails) ? body.emails : []).slice(0, 8).map((row) => {
    const item = row && typeof row === "object" ? row : {};
    return {
      address: String(item.address ?? "").trim(),
      source: String(item.source ?? "").trim(),
    };
  }).filter((row) => row.address && row.source);
  const jobs = (Array.isArray(body.jobs) ? body.jobs : []).slice(0, 8).map((row) => {
    const item = row && typeof row === "object" ? row : {};
    return {
      title: String(item.title ?? "").trim(),
      url: String(item.url ?? "").trim(),
    };
  }).filter((row) => row.title);
  return {
    ok: body.ok !== false,
    company: String(body.company ?? "").trim(),
    summary: String(body.summary ?? "").trim(),
    careers_url: String(body.careers_url ?? "").trim(),
    executives: list(body.executives),
    emails,
    jobs,
    sources: (Array.isArray(body.sources) ? body.sources : []).map(String).filter(Boolean).slice(0, 8),
    note: "Public pages only. No guessed personal emails.",
  };
}

export function companyJs() {
  return `function shapeBrief(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const list = (value) => (Array.isArray(value) ? value : []).slice(0, 8).map((row) => {
    const item = row && typeof row === "object" ? row : {};
    return { name: String(item.name || "").trim(), title: String(item.title || "").trim(), source: String(item.source || "").trim() };
  }).filter((row) => row.name || row.title);
  const emails = (Array.isArray(body.emails) ? body.emails : []).slice(0, 8).map((row) => {
    const item = row && typeof row === "object" ? row : {};
    return { address: String(item.address || "").trim(), source: String(item.source || "").trim() };
  }).filter((row) => row.address && row.source);
  const jobs = (Array.isArray(body.jobs) ? body.jobs : []).slice(0, 8).map((row) => {
    const item = row && typeof row === "object" ? row : {};
    return { title: String(item.title || "").trim(), url: String(item.url || "").trim() };
  }).filter((row) => row.title);
  return {
    ok: body.ok !== false,
    company: String(body.company || "").trim(),
    summary: String(body.summary || "").trim(),
    careers_url: String(body.careers_url || "").trim(),
    executives: list(body.executives),
    emails,
    jobs,
    sources: (Array.isArray(body.sources) ? body.sources : []).map(String).filter(Boolean).slice(0, 8),
    note: "Public pages only. No guessed personal emails.",
  };
}
function readKey() {
  try { if (typeof $vars !== "undefined" && $vars && $vars.OPENROUTER_API_KEY) return String($vars.OPENROUTER_API_KEY); } catch (error) {}
  try { if (typeof $env !== "undefined" && $env && $env.OPENROUTER_API_KEY) return String($env.OPENROUTER_API_KEY); } catch (error) {}
  return "";
}
function parseModel(text) {
  let raw = String(text || "").trim();
  if (raw.slice(0, 3) === "\`\`\`") {
    raw = raw.split("\\n").filter((line) => !line.trim().startsWith("\`\`\`")).join("\\n");
  }
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("no json");
  return JSON.parse(raw.slice(start, end + 1));
}
const item = $input.first().json;
const body = item.body && typeof item.body === "object" ? item.body : {};
const query = item.query && typeof item.query === "object" ? item.query : {};
const company = String(body.company || query.company || item.company || "").trim().slice(0, 120);
if (!company) {
  return [{ json: { ok: false, error: "missing_company", message: "Add ?company= to this URL, or send company in a JSON body." } }];
}
const key = readKey();
if (!key) {
  return [{ json: { ok: false, error: "missing_key", message: "Add OPENROUTER_API_KEY as an n8n variable. Do not put the key in the workflow file." } }];
}
const prompt = "Search public web pages for the company named: " + company + ". Return one JSON object and no markdown. Fields: company, summary, careers_url, executives [{name,title,source}], emails [{address,source}], jobs [{title,url}], sources [url]. Rules: executives must come from a public leadership or about page. emails must be addresses printed on a public page, with that page as source. If no public email is printed, return an empty emails list. Do not invent or pattern-guess personal emails. jobs must come from a public careers page. sources must be the page URLs you used.";
let response;
try {
  response = await this.helpers.httpRequest({
    method: "POST",
    url: "https://openrouter.ai/api/v1/chat/completions",
    headers: { Authorization: "Bearer " + key, "content-type": "application/json" },
    body: {
      model: "openai/gpt-4o-mini",
      max_tokens: 900,
      plugins: [{ id: "web", max_results: 4 }],
      messages: [{ role: "user", content: prompt }],
    },
    json: true,
  });
} catch (error) {
  const status = error && (error.statusCode || error.httpCode || "UNKNOWN");
  return [{ json: { ok: false, error: "openrouter_error", company, status, message: "OpenRouter rejected the call. Check the key credit and the model name." } }];
}
const message = response && response.choices && response.choices[0] && response.choices[0].message;
const text = message && message.content;
let parsed;
try {
  parsed = parseModel(text);
} catch (error) {
  return [{ json: { ok: false, error: "bad_model_json", company, message: "The model did not return JSON." } }];
}
const brief = shapeBrief(parsed);
brief.company = brief.company || company;
brief.model = "openai/gpt-4o-mini";
return [{ json: brief }];
`;
}

const isMain = process.argv[1] && process.argv[1].endsWith("/company.mjs");

if (isMain) {
  const { readFileSync } = await import("node:fs");
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node scripts/company.mjs fixtures/company-brief.json");
    process.exit(2);
  }
  const result = shapeBrief(JSON.parse(readFileSync(file, "utf8")));
  const ok = result.company === "Example Cloud" && result.executives.length === 1 && result.emails.length === 1 && result.jobs.length === 1 && result.emails[0].source.startsWith("https://");
  console.log(`${ok ? "ok" : "FAIL"}  ${file}  ${JSON.stringify(result)}`);
  if (companyJs().includes("sk-or-")) {
    console.error("FAIL  emitted code contains a key");
    process.exit(1);
  }
  process.exit(ok ? 0 : 1);
}
