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

  // 2. Make font atlas per-instance on a.gfx._fontAtlas instead of global module variable
  const targetAtlas1 =
    "{let A=e instanceof At?e.fontface.family:e,R=e instanceof At?{outline:e.outline,filter:e.filter}:{outline:null,filter:Zt};if(Xr[A]&&Xr[A].font&&Xr[A].font.tex&&Xr[A].font.tex.ctx!==a.gfx.ggl){delete Xr[A];}let V=Xr[A]??{font:{tex:new Ve(a.gfx.ggl,2048,2048,{filter:R.filter}),map:{},size:64},cursor:new E(0),maxHeight:0,outline:R.outline};Xr[A]||(Xr[A]=V),";
  const targetAtlas2 =
    "{let A=e instanceof At?e.fontface.family:e,R=e instanceof At?{outline:e.outline,filter:e.filter}:{outline:null,filter:Zt},V=Xr[A]??{font:{tex:new Ve(a.gfx.ggl,2048,2048,{filter:R.filter}),map:{},size:64},cursor:new E(0),maxHeight:0,outline:R.outline};Xr[A]||(Xr[A]=V),";
  const perInstanceAtlas =
    "{let A=e instanceof At?e.fontface.family:e,R=e instanceof At?{outline:e.outline,filter:e.filter}:{outline:null,filter:Zt};let _atlases=(a.gfx._fontAtlas=a.gfx._fontAtlas||{});let V=_atlases[A]??{font:{tex:new Ve(a.gfx.ggl,2048,2048,{filter:R.filter}),map:{},size:64},cursor:new E(0),maxHeight:0,outline:R.outline};_atlases[A]=V,";

  if (content.includes(targetAtlas1)) {
    content = content.replace(targetAtlas1, perInstanceAtlas);
    modified = true;
  } else if (content.includes(targetAtlas2)) {
    content = content.replace(targetAtlas2, perInstanceAtlas);
    modified = true;
  }

  // 3. Make k.quit() teardown synchronous and reset a.k
  const targetPr =
    'function pr(){Xr={};y.events.onOnce("frameEnd",()=>{c.quit(),l.clear(l.COLOR_BUFFER_BIT|l.DEPTH_BUFFER_BIT|l.STENCIL_BUFFER_BIT);let F=l.getParameter(l.MAX_TEXTURE_IMAGE_UNITS);for(let N=0;N<F;N++)l.activeTexture(l.TEXTURE0+N),l.bindTexture(l.TEXTURE_2D,null),l.bindTexture(l.TEXTURE_CUBE_MAP,null);l.bindBuffer(l.ARRAY_BUFFER,null),l.bindBuffer(l.ELEMENT_ARRAY_BUFFER,null),l.bindRenderbuffer(l.RENDERBUFFER,null),l.bindFramebuffer(l.FRAMEBUFFER,null),h.destroy(),p.forEach(N=>N())})}';
  const syncPr =
    'function pr(){Xr={};try{c.quit();}catch{}try{l.clear(l.COLOR_BUFFER_BIT|l.DEPTH_BUFFER_BIT|l.STENCIL_BUFFER_BIT);let F=l.getParameter(l.MAX_TEXTURE_IMAGE_UNITS);for(let N=0;N<F;N++)l.activeTexture(l.TEXTURE0+N),l.bindTexture(l.TEXTURE_2D,null),l.bindTexture(l.TEXTURE_CUBE_MAP,null);l.bindBuffer(l.ARRAY_BUFFER,null),l.bindBuffer(l.ELEMENT_ARRAY_BUFFER,null),l.bindRenderbuffer(l.RENDERBUFFER,null),l.bindFramebuffer(l.FRAMEBUFFER,null);h.destroy();p.forEach(N=>N());}catch{}a.k=null;}';

  if (content.includes(targetPr)) {
    content = content.replace(targetPr, syncPr);
    modified = true;
  }

  // 4. Expose window.__kaplayClearFontCache helper
  const targetVar =
    'var Xr={};if(typeof window!=="undefined"){window.__kaplayClearFontCache=()=>{Xr={};};}';
  const patchedVar =
    'var Xr={};if(typeof window!=="undefined"){window.__kaplayClearFontCache=()=>{Xr={};if(typeof a!=="undefined"&&a&&a.gfx){a.gfx._fontAtlas={};}};}';
  if (content.includes(targetVar)) {
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
