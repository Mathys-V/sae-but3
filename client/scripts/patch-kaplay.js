import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mjsFile = path.resolve(__dirname, "../node_modules/kaplay/dist/kaplay.mjs");

if (fs.existsSync(mjsFile)) {
  let content = fs.readFileSync(mjsFile, "utf8");
  let modified = false;

  if (content.includes("ic=(t={tagsAsComponents:!0})=>{") && !content.includes("ic=(t={tagsAsComponents:!0})=>{Xr={};")) {
    content = content.replace("ic=(t={tagsAsComponents:!0})=>{", "ic=(t={tagsAsComponents:!0})=>{Xr={};");
    modified = true;
  }
  if (content.includes("function pr(){") && !content.includes("function pr(){Xr={};")) {
    content = content.replace("function pr(){", "function pr(){Xr={};");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(mjsFile, content, "utf8");
    console.log("[patch-kaplay] Fixed Kaplay font atlas cache WebGL context leak.");
  }
}
