import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mjsFile = path.resolve(__dirname, "../node_modules/kaplay/dist/kaplay.mjs");
const viteDir = path.resolve(__dirname, "../node_modules/.vite");

function patchContent(content) {
  let modified = false;

  // 1. Clear font atlas cache on kaplay init
  if (
    content.includes("ic=(t={tagsAsComponents:!0})=>{") &&
    !content.includes("ic=(t={tagsAsComponents:!0})=>{Xr={};")
  ) {
    content = content.replace(
      "ic=(t={tagsAsComponents:!0})=>{",
      "ic=(t={tagsAsComponents:!0})=>{Xr={};",
    );
    modified = true;
  }

  // 2. Clear font atlas cache on kaplay quit
  if (
    content.includes("function pr(){") &&
    !content.includes("function pr(){Xr={};")
  ) {
    content = content.replace("function pr(){", "function pr(){Xr={};");
    modified = true;
  }

  // 3. Self-healing failsafe in formatText: if an existing atlas texture belongs to a dead/different WebGL context, delete it
  const targetAtlas =
    "{let A=e instanceof At?e.fontface.family:e,R=e instanceof At?{outline:e.outline,filter:e.filter}:{outline:null,filter:Zt},V=Xr[A]??{font:{tex:new Ve(a.gfx.ggl,2048,2048,{filter:R.filter}),map:{},size:64},cursor:new E(0),maxHeight:0,outline:R.outline};";
  const patchedAtlas =
    "{let A=e instanceof At?e.fontface.family:e,R=e instanceof At?{outline:e.outline,filter:e.filter}:{outline:null,filter:Zt};if(Xr[A]&&Xr[A].font&&Xr[A].font.tex&&Xr[A].font.tex.ctx!==a.gfx.ggl){delete Xr[A];}let V=Xr[A]??{font:{tex:new Ve(a.gfx.ggl,2048,2048,{filter:R.filter}),map:{},size:64},cursor:new E(0),maxHeight:0,outline:R.outline};";

  if (content.includes(targetAtlas)) {
    content = content.replace(targetAtlas, patchedAtlas);
    modified = true;
  }

  // 4. Expose window.__kaplayClearFontCache helper
  const targetVar = "var Xr={};";
  const patchedVar =
    'var Xr={};if(typeof window!=="undefined"){window.__kaplayClearFontCache=()=>{Xr={};};}';
  if (
    content.includes(targetVar) &&
    !content.includes("window.__kaplayClearFontCache")
  ) {
    content = content.replace(targetVar, patchedVar);
    modified = true;
  }

  return { content, modified };
}

if (fs.existsSync(mjsFile)) {
  const original = fs.readFileSync(mjsFile, "utf8");
  const { content, modified } = patchContent(original);
  if (modified) {
    fs.writeFileSync(mjsFile, content, "utf8");
    console.log(
      "[patch-kaplay] Fixed Kaplay font atlas cache WebGL context leak in kaplay.mjs.",
    );
  } else {
    console.log("[patch-kaplay] kaplay.mjs already up to date.");
  }
}

// Invalidate Vite dependency cache so Vite is forced to pre-bundle the patched kaplay
if (fs.existsSync(viteDir)) {
  fs.rmSync(viteDir, { recursive: true, force: true });
  console.log("[patch-kaplay] Removed stale .vite cache directory.");
}
