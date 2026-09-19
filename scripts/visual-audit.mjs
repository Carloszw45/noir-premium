import { chromium } from "playwright";
import fs from "node:fs/promises";

const OUT = "visual-audit";
await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function audit(label, viewport, steps) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", err => consoleErrors.push(err.message));

  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  const metrics = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewport: window.innerHeight
  }));

  const maxScroll = Math.max(0, metrics.height - metrics.viewport);

  for (let i = 0; i < steps.length; i++) {
    const ratio = steps[i];
    const y = Math.round(maxScroll * ratio);
    await page.evaluate(yPos => window.scrollTo(0, yPos), y);
    await page.waitForTimeout(850);
    await page.screenshot({
      path: `${OUT}/${label}-${String(i + 1).padStart(2, "0")}-${Math.round(ratio * 100)}.png`,
      fullPage: false
    });
  }

  await fs.writeFile(
    `${OUT}/${label}-meta.json`,
    JSON.stringify({ viewport, metrics, consoleErrors }, null, 2)
  );

  await context.close();
}

await audit(
  "desktop",
  { width: 1440, height: 900 },
  [0, 0.055, 0.11, 0.17, 0.23, 0.3, 0.37, 0.44, 0.51, 0.58, 0.65, 0.72, 0.79, 0.86, 0.93, 1]
);

await audit(
  "mobile",
  { width: 390, height: 844 },
  [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88, 0.96, 1]
);

await browser.close();
console.log("Visual audit screenshots created.");
