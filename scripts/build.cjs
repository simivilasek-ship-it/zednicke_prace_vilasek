const fs = require("fs");
const path = require("path");

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/ ?([{}:;,+>]) ?/g, "$1")
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/\s+\/\/[^\n]*/g, "")
    .replace(/\s+/g, " ")
    .replace(/ ?([{}();,:+\-/*=<>]) ?/g, "$1")
    .trim();
}

const assets = [
  { src: "style.css", dest: "style.min.css", minifier: minifyCss },
  { src: "templatemo-amber-script.js", dest: "templatemo-amber-script.min.js", minifier: minifyJs },
];

assets.forEach(({ src, dest, minifier }) => {
  const inputPath = path.join(__dirname, "..", src);
  const outputPath = path.join(__dirname, "..", dest);
  const contents = fs.readFileSync(inputPath, "utf8");
  fs.writeFileSync(outputPath, minifier(contents), "utf8");
  console.log(`Created ${dest}`);
});
