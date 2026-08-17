const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const deployEntries = [
  "assets/css",
  "assets/images",
  "assets/js",
  "blog",
  "consultoria",
  "contato",
  "destaques",
  "politica-de-privacidade",
  "sobre",
  "404.html",
  "_headers",
  "_redirects",
  "favicon.svg",
  "index.html",
  "robots.txt",
  "sitemap.xml"
];

function copyRecursive(source, target) {
  const stat = fs.statSync(source);

  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const entry of deployEntries) {
  const source = path.join(root, entry);
  if (!fs.existsSync(source)) continue;
  copyRecursive(source, path.join(dist, entry));
}

console.log(`Deploy pronto em ${path.relative(root, dist)}`);
