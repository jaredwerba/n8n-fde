// Four public demos. No credentials.
// scripts/emit-public.mjs copies the *Js() strings into the workflow files.

export function shapeWeather(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const current = body.current && typeof body.current === "object" ? body.current : {};
  const temperature = Number(current.temperature_2m);
  return {
    place: "Boston",
    time: String(current.time ?? ""),
    temperature_c: Number.isFinite(temperature) ? temperature : null,
    weather_code: current.weather_code ?? null,
  };
}

export function weatherJs() {
  return `function shapeWeather(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const current = body.current && typeof body.current === "object" ? body.current : {};
  const temperature = Number(current.temperature_2m);
  return {
    place: "Boston",
    time: String(current.time || ""),
    temperature_c: Number.isFinite(temperature) ? temperature : null,
    weather_code: current.weather_code == null ? null : current.weather_code,
  };
}
const item = $input.first().json;
const body = item.body && typeof item.body === "object" ? item.body : item;
return [{ json: shapeWeather(body) }];
`;
}

export function frontPage(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const hits = Array.isArray(body.hits) ? body.hits : [];
  const titles = hits.map((hit) => String(hit.title ?? "").trim()).filter(Boolean).slice(0, 5);
  return { source: "Hacker News", total: titles.length, titles };
}

export function hnJs() {
  return `function frontPage(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const hits = Array.isArray(body.hits) ? body.hits : [];
  const titles = hits.map((hit) => String(hit.title || "").trim()).filter(Boolean).slice(0, 5);
  return { source: "Hacker News", total: titles.length, titles };
}
const item = $input.first().json;
const body = item.body && typeof item.body === "object" ? item.body : item;
return [{ json: frontPage(body) }];
`;
}

export function usdEur(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const rates = body.rates && typeof body.rates === "object" ? body.rates : {};
  const rate = Number(rates.EUR);
  return {
    base: "USD",
    quote: "EUR",
    date: String(body.date ?? ""),
    rate: Number.isFinite(rate) ? rate : null,
  };
}

export function fxJs() {
  return `function usdEur(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const rates = body.rates && typeof body.rates === "object" ? body.rates : {};
  const rate = Number(rates.EUR);
  return {
    base: "USD",
    quote: "EUR",
    date: String(body.date || ""),
    rate: Number.isFinite(rate) ? rate : null,
  };
}
const item = $input.first().json;
const body = item.body && typeof item.body === "object" ? item.body : item;
return [{ json: usdEur(body) }];
`;
}

export function rssTitles(raw) {
  const titles = [];
  function add(value) {
    const title = String(value ?? "").replace(/\s+/g, " ").trim();
    if (!title || title === "n8n Blog" || titles.includes(title)) return;
    titles.push(title);
  }
  function walk(node) {
    if (node == null || titles.length >= 5) return;
    if (typeof node === "string") {
      if (!node.includes("<title>")) return;
      const re = /<title>(?:<!\[CDATA\[)?([^<]+?)(?:\]\]>)?<\/title>/gi;
      let match;
      while ((match = re.exec(node)) && titles.length < 5) add(match[1]);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node === "object") {
      if (typeof node.title === "string") add(node.title);
      for (const value of Object.values(node)) walk(value);
    }
  }
  walk(raw);
  return { source: "n8n Blog", total: titles.length, titles: titles.slice(0, 5) };
}

export function rssJs() {
  return `function rssTitles(raw) {
  const titles = [];
  function add(value) {
    const title = String(value || "").replace(/\\s+/g, " ").trim();
    if (!title || title === "n8n Blog" || titles.includes(title)) return;
    titles.push(title);
  }
  function walk(node) {
    if (node == null || titles.length >= 5) return;
    if (typeof node === "string") {
      if (!node.includes("<title>")) return;
      const re = /<title>(?:<!\\[CDATA\\[)?([^<]+?)(?:\\]\\]>)?<\\/title>/gi;
      let match;
      while ((match = re.exec(node)) && titles.length < 5) add(match[1]);
      return;
    }
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node === "object") {
      if (typeof node.title === "string") add(node.title);
      for (const value of Object.values(node)) walk(value);
    }
  }
  walk(raw);
  return { source: "n8n Blog", total: titles.length, titles: titles.slice(0, 5) };
}
const item = $input.first().json;
return [{ json: rssTitles(item) }];
`;
}

const checks = {
  "fixtures/weather-boston.json": (file, result) => result.temperature_c === 18.2 && result.place === "Boston",
  "fixtures/hn-front.json": (file, result) => result.total === 2 && result.titles[0] === "Example one",
  "fixtures/usd-eur.json": (file, result) => result.rate === 0.89254 && result.quote === "EUR",
  "fixtures/n8n-blog.xml": (file, result) => result.total === 2 && result.titles[1] === "Second post",
};

const runners = {
  "fixtures/weather-boston.json": shapeWeather,
  "fixtures/hn-front.json": frontPage,
  "fixtures/usd-eur.json": usdEur,
  "fixtures/n8n-blog.xml": (raw) => rssTitles(raw),
};

const isMain = process.argv[1] && process.argv[1].endsWith("/public-demos.mjs");

if (isMain) {
  const { readFileSync } = await import("node:fs");
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("usage: node scripts/public-demos.mjs fixtures/weather-boston.json ...");
    process.exit(2);
  }
  let failed = 0;
  for (const file of files) {
    const runner = runners[file];
    const check = checks[file];
    if (!runner || !check) {
      console.error(`no check for ${file}`);
      failed += 1;
      continue;
    }
    const raw = file.endsWith(".xml") ? readFileSync(file, "utf8") : JSON.parse(readFileSync(file, "utf8"));
    const result = runner(raw);
    const ok = check(file, result);
    if (!ok) failed += 1;
    console.log(`${ok ? "ok" : "FAIL"}  ${file}  ${JSON.stringify(result)}`);
  }
  process.exit(failed ? 1 : 0);
}
