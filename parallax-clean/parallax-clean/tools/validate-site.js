const fs = require("fs");
const path = require("path");

const root = path.resolve(process.cwd(), process.argv[2] || ".");
const htmlFiles = [];
const errors = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === root && ["dist", "node_modules"].includes(entry.name)) continue;
      walk(file);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(file);
    }
  }
}

function isExternal(url) {
  return /^(https?:|mailto:|tel:|#)/.test(url);
}

function resolveTarget(file, url) {
  const cleanUrl = url.split("#")[0].split("?")[0];
  if (!cleanUrl) return null;

  const base = path.dirname(file);
  const candidate = path.resolve(base, cleanUrl);
  if (url.endsWith("/")) return path.join(candidate, "index.html");
  return candidate;
}

walk(root);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(root, file);

  if (html.includes("\uFFFD")) {
    errors.push(`${relativeFile}: contem caractere de substituicao de encoding`);
  }

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const url = match[1];
    if (isExternal(url) || url.startsWith("data:")) continue;
    if (url.startsWith("/")) {
      errors.push(`${relativeFile}: caminho absoluto local nao permitido: ${url}`);
      continue;
    }

    const target = resolveTarget(file, url);
    if (target && !fs.existsSync(target)) {
      errors.push(`${relativeFile}: arquivo nao encontrado: ${url}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`OK: ${htmlFiles.length} paginas HTML validadas em ${path.relative(process.cwd(), root) || "."}`);
