// Intermediate project. Same word list and points as n8n-demo lib/score.ts.
// scripts/emit-score.mjs copies scoreAccount() into the n8n Code node.
// Do not edit the copy in workflows/signal-to-outreach.json by hand.

const RULES = [
  [["gpu", "h100", "a100", "a10", "inference"], 18, "Mentions GPU or inference capacity"],
  [["kubernetes", "k8s", "platform"], 12, "Platform or Kubernetes footprint"],
  [["hiring", "opened", "role", "headcount"], 10, "Hiring signal"],
  [["oci", "aws", "azure", "gcp", "neocloud"], 12, "Cloud buyer language"],
  [["evaluat", "rfp", "shortlist", "comparing", "versus"], 14, "Active evaluation"],
  [["this quarter", "this month", "urgent"], 8, "Near-term timeline"],
  [["cashier", "bakery", "restaurant", "retail", "salon"], -35, "Looks like a local consumer business"],
];

export function scoreAccount(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const company = String(body.company ?? "").trim();
  const signal = String(body.signal ?? "").trim();
  const contact = String(body.contact ?? "").trim();
  const blob = `${company}\n${signal}`.toLowerCase();

  let score = 22;
  const reasons = ["+22 Baseline: unknown account, not yet disqualified"];
  for (const [words, points, reason] of RULES) {
    if (!words.some((word) => blob.includes(word))) continue;
    score += points;
    reasons.push(`${points > 0 ? "+" : ""}${points} ${reason}`);
  }

  score = Math.max(0, Math.min(100, score));
  const band = score >= 70 ? "pursue" : score >= 45 ? "nurture" : "pass";
  const action = band === "pursue" ? "send" : band === "nurture" ? "hold" : "do-not-send";
  const who = contact.split(",")[0]?.trim() || "there";
  let short = signal.replace(/\s+/g, " ").replace(/\.$/, "");
  if (short.length > 140) short = `${short.slice(0, 137)}...`;

  let draft;
  if (band === "pursue") {
    draft = `Hi ${who}. Noticed ${company}: ${short}. If GPU capacity is actually on the table, I can send a one-page fit note. Worth 15 minutes?`;
  } else if (band === "nurture") {
    draft = `Hi ${who}. Noted ${company}: ${short}. Not asking for a meeting yet. I can send a one-pager if it is useful.`;
  } else {
    draft = `Do not send. ${company} scored ${score}/100 and sits outside this ICP. Park it.`;
  }

  return {
    company,
    contact,
    signal,
    score,
    band,
    reasons,
    action,
    draft,
    steps: [
      { name: "Receive signal", detail: company },
      { name: "Score ICP fit", detail: `${score}/100 · ${band}` },
      { name: "Draft or decline", detail: action },
      { name: "Return JSON", detail: "Response ready" },
    ],
  };
}

export function scoreJs() {
  return `const rules = [
  [['gpu', 'h100', 'a100', 'a10', 'inference'], 18, 'Mentions GPU or inference capacity'],
  [['kubernetes', 'k8s', 'platform'], 12, 'Platform or Kubernetes footprint'],
  [['hiring', 'opened', 'role', 'headcount'], 10, 'Hiring signal'],
  [['oci', 'aws', 'azure', 'gcp', 'neocloud'], 12, 'Cloud buyer language'],
  [['evaluat', 'rfp', 'shortlist', 'comparing', 'versus'], 14, 'Active evaluation'],
  [['this quarter', 'this month', 'urgent'], 8, 'Near-term timeline'],
  [['cashier', 'bakery', 'restaurant', 'retail', 'salon'], -35, 'Looks like a local consumer business'],
];

function scoreAccount(raw) {
  const body = raw && typeof raw === 'object' ? raw : {};
  const company = String(body.company ?? '').trim();
  const signal = String(body.signal ?? '').trim();
  const contact = String(body.contact ?? '').trim();
  const blob = (company + '\\n' + signal).toLowerCase();
  let score = 22;
  const reasons = ['+22 Baseline: unknown account, not yet disqualified'];
  for (const [words, points, reason] of rules) {
    if (!words.some((word) => blob.includes(word))) continue;
    score += points;
    reasons.push((points > 0 ? '+' : '') + points + ' ' + reason);
  }
  score = Math.max(0, Math.min(100, score));
  const band = score >= 70 ? 'pursue' : score >= 45 ? 'nurture' : 'pass';
  const action = band === 'pursue' ? 'send' : band === 'nurture' ? 'hold' : 'do-not-send';
  const who = (contact.split(',')[0] || '').trim() || 'there';
  let short = signal.replace(/\\s+/g, ' ').replace(/\\.$/, '');
  if (short.length > 140) short = short.slice(0, 137) + '...';
  let draft;
  if (band === 'pursue') {
    draft = 'Hi ' + who + '. Noticed ' + company + ': ' + short + '. If GPU capacity is actually on the table, I can send a one-page fit note. Worth 15 minutes?';
  } else if (band === 'nurture') {
    draft = 'Hi ' + who + '. Noted ' + company + ': ' + short + '. Not asking for a meeting yet. I can send a one-pager if it is useful.';
  } else {
    draft = 'Do not send. ' + company + ' scored ' + score + '/100 and sits outside this ICP. Park it.';
  }
  return {
    company,
    contact,
    signal,
    score,
    band,
    reasons,
    action,
    draft,
    steps: [
      { name: 'Receive signal', detail: company },
      { name: 'Score ICP fit', detail: score + '/100 · ' + band },
      { name: 'Draft or decline', detail: action },
      { name: 'Return JSON', detail: 'Response ready' },
    ],
  };
}

const item = $input.first().json;
const body = item.body && typeof item.body === 'object' ? item.body : item;
return [{ json: scoreAccount(body) }];
`;
}

const isMain = process.argv[1] && process.argv[1].endsWith("/score.mjs");

if (isMain) {
  const { readFileSync } = await import("node:fs");
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("usage: node scripts/score.mjs fixtures/signal-*.json");
    process.exit(2);
  }
  let failed = 0;
  for (const file of files) {
    const fixture = JSON.parse(readFileSync(file, "utf8"));
    const result = scoreAccount(fixture.request);
    const ok = result.band === fixture.expect && result.action === fixture.expect_action;
    if (!ok) failed += 1;
    console.log(`${ok ? "ok" : "FAIL"}  ${file}  ${result.score}  ${result.band}  ${result.action}`);
  }
  process.exit(failed ? 1 : 0);
}
