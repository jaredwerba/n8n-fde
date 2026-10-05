// Source of truth for the intake decision.
// scripts/emit-workflow.mjs copies decide() into the n8n Code node.
// Do not edit the copy in workflows/intake-triage.json by hand.

const REQUIRED = ["request_id", "system", "ask", "owner", "constraint", "success"];

const UNBOUNDED = [
  "every field",
  "all fields",
  "all objects",
  "every record",
  "real time",
  "realtime",
  "immediately",
];

const SYSTEMS_OF_RECORD = ["salesforce", "sap", "netsuite", "workday"];

export function decide(raw) {
  const body = raw && typeof raw === "object" ? raw : {};
  const missing = REQUIRED.filter((key) => !String(body[key] ?? "").trim());
  if (missing.length) {
    return {
      decision: "incomplete",
      http_status: 400,
      why: `Missing ${missing.join(", ")}. Do not start a build on a partial ask.`,
      first_slice: null,
      customer_owns: ["the request", "the reason it stopped"],
    };
  }

  const ask = String(body.ask).toLowerCase();
  const system = String(body.system).toLowerCase();
  const constraint = String(body.constraint).toLowerCase();
  const success = String(body.success).toLowerCase();
  const unbounded = UNBOUNDED.some((phrase) => ask.includes(phrase) || success.includes(phrase));
  const systemOfRecord = SYSTEMS_OF_RECORD.some((name) => system.includes(name));

  if (unbounded && systemOfRecord) {
    return {
      decision: "push-back",
      http_status: 200,
      why: "Unbounded sync against a system of record. That is a product, not a 5-day engagement.",
      first_slice: "One object, two fields, a 5-minute schedule, one destination. Write the rest as out of scope.",
      customer_owns: ["the narrower workflow", "the out-of-scope list"],
    };
  }

  const wantsCustom = ["custom node", "custom code", "community node"].some((phrase) => ask.includes(phrase));
  const forbidsCustom = ["no custom code", "no custom node", "existing n8n nodes only", "existing nodes only"].some(
    (phrase) => constraint.includes(phrase),
  );

  if (wantsCustom && forbidsCustom) {
    return {
      decision: "simplify",
      http_status: 200,
      why: "The ask wants a custom node and the constraint forbids custom code. Use the HTTP Request node.",
      first_slice: "One documented endpoint, on a schedule, writing the one status field the owner named.",
      customer_owns: ["the HTTP Request workflow", "the credential in their n8n"],
    };
  }

  const measurable = /\d+\s*(minute|minutes|hour|hours|day|days)/i.test(String(body.success));
  const namedTrigger = ask.startsWith("when ") || ask.includes(" when ");

  if (measurable && namedTrigger) {
    return {
      decision: "build",
      http_status: 200,
      why: "Named trigger, named owner, a constraint they can operate, and a success line with a number.",
      first_slice: String(body.ask).trim(),
      customer_owns: ["the workflow", "the credential", "the success check"],
    };
  }

  return {
    decision: "simplify",
    http_status: 200,
    why: "The ask is valid and not yet a slice. Narrow it before opening the editor.",
    first_slice: "Rewrite as one trigger, one destination, and a success line with a number.",
    customer_owns: ["the rewritten ask"],
  };
}

const isMain = process.argv[1] && process.argv[1].endsWith("triage.mjs");

if (isMain) {
  const { readFileSync } = await import("node:fs");
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("usage: node scripts/triage.mjs fixtures/*.json");
    process.exit(2);
  }
  let failed = 0;
  for (const file of files) {
    const fixture = JSON.parse(readFileSync(file, "utf8"));
    const result = decide(fixture.request);
    const ok = result.decision === fixture.expect;
    if (!ok) failed += 1;
    console.log(`${ok ? "ok" : "FAIL"}  ${file}  ${result.decision}  ${result.why}`);
  }
  process.exit(failed ? 1 : 0);
}
