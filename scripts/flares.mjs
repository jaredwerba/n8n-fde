// Entry-level project from https://docs.n8n.io/build-your-first-workflow
// If classType contains "X", it is the true branch. The message text matches the tutorial.

const isMain = process.argv[1] && process.argv[1].endsWith("/flares.mjs");

export function splitFlares(items) {
  const x_class = [];
  const smaller = [];
  const classes = [];
  for (const item of items) {
    const classType = String(item.classType ?? "").trim();
    if (!classType) continue;
    classes.push(classType);
    const row = {
      classType,
      beginTime: String(item.beginTime ?? ""),
      message: `There was a solar flare of class ${classType}`,
    };
    if (classType.includes("X")) x_class.push(row);
    else smaller.push(row);
  }
  return { total: x_class.length + smaller.length, x_class, smaller, classes };
}

export function flareJs() {
  return `function splitFlares(items) {
  const x_class = [];
  const smaller = [];
  const classes = [];
  for (const item of items) {
    const classType = String(item.classType ?? "").trim();
    if (!classType) continue;
    classes.push(classType);
    const row = {
      classType,
      beginTime: String(item.beginTime ?? ""),
      message: "There was a solar flare of class " + classType,
    };
    if (classType.includes("X")) x_class.push(row);
    else smaller.push(row);
  }
  return { total: x_class.length + smaller.length, x_class, smaller, classes };
}

const raw = $input.all().map((item) => item.json);
let flares = raw;
if (raw.length === 1 && Array.isArray(raw[0])) flares = raw[0];
const report = splitFlares(flares);
return [{ json: report }];
`;
}

if (isMain) {
  const { readFileSync } = await import("node:fs");
  const file = process.argv[2];
  if (!file) {
    console.error("usage: node scripts/flares.mjs fixtures/flares-7d.json");
    process.exit(2);
  }
  const items = JSON.parse(readFileSync(file, "utf8"));
  const report = splitFlares(items);
  console.log(JSON.stringify(report, null, 2));
  if (report.x_class.length !== 0) {
    console.error("expected no X-class flares in the fixture");
    process.exit(1);
  }
  if (report.smaller.length !== 4) {
    console.error(`expected 4 smaller flares, got ${report.smaller.length}`);
    process.exit(1);
  }
  console.log("ok");
}
