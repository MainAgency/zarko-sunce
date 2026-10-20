// Renders index.html to a 1080×1920 / 30 fps H.264 MP4, frame by frame.
//
//   node render.mjs                         → out/zarko-sunce-reel-9x16.mp4
//   node render.mjs --stills 1,4,7.2 [dir]  → one JPEG per time, for checking
//
// Needs ffmpeg on PATH and Google Chrome installed (driven through the
// playwright-core copy in ../../cms/node_modules).
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, "../../cms/package.json"));
const { chromium } = require("playwright-core");

const FPS = 30;
const args = process.argv.slice(2);
const stillsAt = args[0] === "--stills" ? args[1].split(",").map(Number) : null;
const outDir = (stillsAt ? args[2] : null) || join(here, "out");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("console", (m) => m.type() === "error" && console.error("[page]", m.text()));
await page.goto(pathToFileURL(join(here, "index.html")).href);
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
const stage = page.locator("#stage");

const frameAt = async (t) => {
  await page.evaluate((t) => window.seek(t), t);
  return stage.screenshot({ type: "jpeg", quality: 95, animations: "disabled", caret: "hide" });
};

if (stillsAt) {
  const { writeFile } = await import("node:fs/promises");
  for (const t of stillsAt) await writeFile(join(outDir, `t${t.toFixed(2)}.jpg`), await frameAt(t));
  console.log(`stills → ${outDir}`);
} else {
  const out = join(outDir, "zarko-sunce-reel-9x16.mp4");
  // A silent stereo track is included: some upload flows reject or mishandle
  // video-only files, and the platforms let you lay music over it anyway.
  const ff = spawn(
    "ffmpeg",
    [
      "-y", "-loglevel", "error",
      "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
      "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
      "-map", "0:v", "-map", "1:a", "-shortest",
      // Screenshots are full-range BT.601 JPEGs; phones expect limited-range BT.709.
      "-vf", "scale=in_range=pc:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709,format=yuv420p",
      "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
      "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high", "-level", "4.2",
      "-r", String(FPS), "-g", String(FPS * 2),
      "-c:a", "aac", "-b:a", "128k",
      "-movflags", "+faststart",
      out,
    ],
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const total = Math.round(duration * FPS);
  for (let i = 0; i < total; i++) {
    const buf = await frameAt(i / FPS);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % FPS === 0) process.stdout.write(`\r${Math.round((i / total) * 100)}%`);
  }
  ff.stdin.end();
  await new Promise((resolve, reject) => ff.on("close", (code) => (code ? reject(new Error(`ffmpeg ${code}`)) : resolve())));
  console.log(`\r100% → ${out}`);
}

await browser.close();
