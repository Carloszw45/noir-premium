import { chromium } from "playwright";
import fs from "node:fs/promises";

const OUT = "visual-audit";
const SCENES = Array.from({ length: 10 }, (_, index) => `#s${index + 1}`);

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
let failed = false;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function audit(label, viewport, steps) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", error => pageErrors.push(error.message));

  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);

  const baseLayout = await page.evaluate(sceneSelectors => {
    const sceneMetrics = sceneSelectors.map(selector => {
      const element = document.querySelector(selector);
      if (!element) return { selector, exists: false };
      const rect = element.getBoundingClientRect();
      return {
        selector,
        exists: true,
        width: rect.width,
        height: rect.height
      };
    });

    const invalidTransforms = [...document.querySelectorAll(".scene *")]
      .filter(element => {
        const transform = getComputedStyle(element).transform;
        return /NaN|undefined/i.test(transform);
      })
      .map(element => element.className || element.tagName)
      .slice(0, 20);

    return {
      height: document.documentElement.scrollHeight,
      viewport: window.innerHeight,
      horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      sceneMetrics,
      invalidTransforms
    };
  }, SCENES);

  const scenesValid = baseLayout.sceneMetrics.every(scene => scene.exists && scene.width > 0 && scene.height > 0);
  const layoutValid = scenesValid && baseLayout.horizontalOverflow <= 3 && baseLayout.invalidTransforms.length === 0;

  async function scrollTo(y, settle = 820) {
    await page.evaluate(yPos => window.scrollTo(0, yPos), Math.max(0, Math.round(y)));
    await page.waitForTimeout(settle);
  }

  async function readHeroState(y) {
    await scrollTo(y, 900);
    return page.evaluate(() => {
      const read = selector => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          opacity: Number.parseFloat(style.opacity || "0"),
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          }
        };
      };

      return {
        scrollY: window.scrollY,
        product: read(".hero-product"),
        copy: read(".hero-copy")
      };
    });
  }

  const heroPositions = [0, viewport.height * .18, viewport.height * .36, viewport.height * .54, viewport.height * .72];
  const downStates = [];
  const upStates = [];

  for (const y of heroPositions) downStates.push(await readHeroState(y));
  for (const y of [...heroPositions].reverse()) upStates.unshift(await readHeroState(y));

  const delta = (a, b) => Math.abs((a ?? 0) - (b ?? 0));
  const stateMatches = (a, b) => {
    if (!a || !b || !a.product || !b.product || !a.copy || !b.copy) return false;
    return (
      delta(a.product.rect.top, b.product.rect.top) <= 4 &&
      delta(a.product.rect.left, b.product.rect.left) <= 4 &&
      delta(a.product.rect.width, b.product.rect.width) <= 4 &&
      delta(a.product.rect.height, b.product.rect.height) <= 4 &&
      delta(a.product.opacity, b.product.opacity) <= .05 &&
      delta(a.copy.rect.top, b.copy.rect.top) <= 4 &&
      delta(a.copy.opacity, b.copy.opacity) <= .05
    );
  };

  const heroReversible = downStates.every((state, index) => stateMatches(state, upStates[index]));

  await scrollTo(0, 1000);

  const heroReturn = await page.evaluate(() => {
    const inspect = selector => {
      const element = document.querySelector(selector);
      if (!element) return { exists: false, opacity: 0, visible: false, rect: null };
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const opacity = Number.parseFloat(style.opacity || "0");
      const visible = opacity > .8 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
      return {
        exists: true,
        opacity,
        visible,
        rect: { top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom }
      };
    };

    return {
      scrollY: window.scrollY,
      product: inspect(".hero-product"),
      copy: inspect(".hero-copy"),
      notes: inspect(".hero-notes")
    };
  });

  await page.screenshot({ path: `${OUT}/${label}-return-top.png`, fullPage: false });

  const maxScroll = Math.max(0, baseLayout.height - baseLayout.viewport);
  for (let i = 0; i < steps.length; i++) {
    const ratio = steps[i];
    await scrollTo(maxScroll * ratio, 760);
    await page.screenshot({
      path: `${OUT}/${label}-${String(i + 1).padStart(2, "0")}-${Math.round(ratio * 100)}.png`,
      fullPage: false
    });
  }

  const actionableConsoleErrors = consoleErrors.filter(message => !/Failed to load resource|ERR_BLOCKED_BY_CLIENT/i.test(message));
  const heroReturnPassed = heroReturn.product.visible && heroReturn.copy.visible;
  const runtimeValid = pageErrors.length === 0 && actionableConsoleErrors.length === 0;
  const passed = layoutValid && runtimeValid && heroReturnPassed && heroReversible;

  if (!passed) failed = true;

  await fs.writeFile(
    `${OUT}/${label}-meta.json`,
    JSON.stringify({
      viewport,
      baseLayout,
      consoleErrors,
      actionableConsoleErrors,
      pageErrors,
      heroReturn,
      heroReturnPassed,
      heroReversible,
      downStates,
      upStates,
      layoutValid,
      runtimeValid,
      passed
    }, null, 2)
  );

  await context.close();
}

await audit(
  "desktop",
  { width: 1440, height: 900 },
  [0, .055, .11, .17, .23, .30, .37, .44, .51, .58, .65, .72, .79, .86, .93, 1]
);

await audit(
  "mobile",
  { width: 390, height: 844 },
  [0, .08, .16, .24, .32, .40, .48, .56, .64, .72, .80, .88, .96, 1]
);

await browser.close();

if (failed) {
  console.error("NOIR regression audit failed. Inspect visual-audit/*-meta.json and screenshots.");
  process.exitCode = 1;
} else {
  console.log("NOIR regression audit passed: layout, runtime, hero return and reverse-scroll state are stable.");
}
