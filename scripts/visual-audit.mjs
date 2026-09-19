import { chromium } from "playwright";
import fs from "node:fs/promises";

const OUT = "visual-audit";
const SCENES = Array.from({ length: 10 }, (_, index) => `#s${index + 1}`);

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
let failed = false;

async function audit(label, viewport, captureRatios) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", msg => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", error => pageErrors.push(error.message));

  await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => {
      if (image.complete) return Promise.resolve();
      return new Promise(resolve => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }));
  });
  await page.waitForTimeout(2400);

  const base = await page.evaluate(selectors => {
    const stage = document.querySelector(".experience-stage");
    const stageRect = stage?.getBoundingClientRect();
    const sceneMetrics = selectors.map(selector => {
      const element = document.querySelector(selector);
      if (!element) return { selector, exists: false };
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        selector,
        exists: true,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        position: style.position,
        visibility: style.visibility
      };
    });

    const invalidTransforms = [...document.querySelectorAll(".scene *")]
      .filter(element => /NaN|undefined/i.test(getComputedStyle(element).transform))
      .map(element => element.className || element.tagName)
      .slice(0, 20);

    return {
      stageExists: Boolean(stage),
      stage: stageRect ? { width: stageRect.width, height: stageRect.height, top: stageRect.top } : null,
      scrollHeight: document.documentElement.scrollHeight,
      viewportHeight: innerHeight,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      sceneMetrics,
      invalidTransforms
    };
  }, SCENES);

  const scenesLayered = base.stageExists && base.sceneMetrics.every(scene =>
    scene.exists &&
    scene.position === "absolute" &&
    Math.abs(scene.width - viewport.width) <= 4 &&
    Math.abs(scene.height - base.stage.height) <= 4 &&
    Math.abs(scene.top - base.stage.top) <= 4
  );

  const layoutValid = scenesLayered && base.overflowX <= 3 && base.invalidTransforms.length === 0 && base.scrollHeight > viewport.height * 8;
  const maxScroll = Math.max(0, base.scrollHeight - viewport.height);

  async function scrollToRatio(ratio, settle = 650) {
    const y = maxScroll * ratio;
    await page.evaluate(pos => {
      window.scrollTo(0, pos);
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    }, Math.round(y));
    await page.waitForTimeout(900);
    const started = Date.now();
    const maxWait = Math.max(settle, 5500);
    let previous = "";
    let stableSince = 0;
    while (Date.now() - started < maxWait) {
      const snapshot = await page.evaluate(() => [...document.querySelectorAll(".scene")]
        .map(scene => {
          const style = getComputedStyle(scene);
          return [style.clipPath, style.transform, style.opacity].join("/");
        })
        .join("|"));
      if (snapshot === previous) {
        if (!stableSince) stableSince = Date.now();
        if (Date.now() - stableSince >= 700) break;
      } else {
        previous = snapshot;
        stableSince = 0;
      }
      await page.waitForTimeout(160);
    }
    return y;
  }

  async function readTimelineState(ratio) {
    // The master timeline intentionally uses a non-zero scrub value. Give it
    // enough time to converge before comparing down-scroll and up-scroll states.
    await scrollToRatio(ratio, 1000);
    return page.evaluate(selectors => {
      const round = value => Math.round(value * 1000) / 1000;
      return selectors.map(selector => {
        const element = document.querySelector(selector);
        const style = getComputedStyle(element);
        return {
          selector,
          opacity: round(Number.parseFloat(style.opacity || "0")),
          visibility: style.visibility,
          clipPath: style.clipPath,
          transform: style.transform
        };
      });
    }, SCENES);
  }

  const reverseRatios = [0, .045, .095, .16, .235, .315, .40, .49, .61, .73, .84, .94];
  const downStates = [];
  const upStates = [];

  for (const ratio of reverseRatios) downStates.push(await readTimelineState(ratio));
  for (const ratio of [...reverseRatios].reverse()) upStates.unshift(await readTimelineState(ratio));

  const normalize = value => String(value || "").replace(/\s+/g, " ").trim();
  const clipPathMatches = (left, right) => {
    const leftText = normalize(left);
    const rightText = normalize(right);
    if (leftText === rightText) return true;
    const expandInset = value => {
      const match = value.match(/^inset\(([^)]+)\)$/i);
      if (!match) return value;
      const values = (match[1].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
      if (values.length === 1) return [values[0], values[0], values[0], values[0]];
      if (values.length === 2) return [values[0], values[1], values[0], values[1]];
      if (values.length === 3) return [values[0], values[1], values[2], values[1]];
      return values.slice(0, 4);
    };
    const leftNumbers = expandInset(leftText);
    const rightNumbers = expandInset(rightText);
    if (Array.isArray(leftNumbers) && Array.isArray(rightNumbers)) {
      return leftNumbers.length === rightNumbers.length &&
        leftNumbers.every((value, index) => Math.abs(value - rightNumbers[index]) <= 3.5);
    }
    const leftValues = (leftText.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    const rightValues = (rightText.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    return leftValues.length === rightValues.length &&
      leftValues.every((value, index) => Math.abs(value - rightValues[index]) <= 3.5);
  };
  const stateMatches = (down, up) => down.every((scene, index) => {
    const other = up[index];
    return other &&
      Math.abs(scene.opacity - other.opacity) <= .055 &&
      scene.visibility === other.visibility &&
      clipPathMatches(scene.clipPath, other.clipPath) &&
      normalize(scene.transform) === normalize(other.transform);
  });
  const bidirectionalStable = downStates.every((state, index) => stateMatches(state, upStates[index]));

  await scrollToRatio(0, 900);
  const heroReturn = await page.evaluate(() => {
    const visible = selector => {
      const el = document.querySelector(selector);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return Number.parseFloat(style.opacity || "0") > .75 && style.visibility !== "hidden" && rect.bottom > 0 && rect.top < innerHeight;
    };
    return {
      product: visible(".hero-product"),
      copy: visible(".hero-copy"),
      notes: visible(".hero-notes")
    };
  });

  for (let i = 0; i < captureRatios.length; i++) {
    const ratio = captureRatios[i];
    await scrollToRatio(ratio, 700);
    await page.screenshot({
      path: `${OUT}/${label}-${String(i + 1).padStart(2, "0")}-${Math.round(ratio * 100)}.png`,
      fullPage: false
    });
  }

  await scrollToRatio(0, 800);
  await page.screenshot({ path: `${OUT}/${label}-return-top.png`, fullPage: false });

  const actionableConsoleErrors = consoleErrors.filter(message => !/Failed to load resource|ERR_BLOCKED_BY_CLIENT/i.test(message));
  const runtimeValid = pageErrors.length === 0 && actionableConsoleErrors.length === 0;
  const heroReturnPassed = heroReturn.product && heroReturn.copy && (heroReturn.notes || viewport.width <= 650);
  const passed = layoutValid && runtimeValid && heroReturnPassed && bidirectionalStable;
  if (!passed) failed = true;

  await fs.writeFile(`${OUT}/${label}-meta.json`, JSON.stringify({
    viewport,
    base,
    scenesLayered,
    layoutValid,
    runtimeValid,
    heroReturn,
    heroReturnPassed,
    bidirectionalStable,
    consoleErrors,
    actionableConsoleErrors,
    pageErrors,
    reverseRatios,
    downStates,
    upStates,
    passed
  }, null, 2));

  await context.close();
}

await audit("desktop", { width: 1440, height: 900 }, [0, .04, .08, .12, .17, .22, .28, .34, .40, .47, .54, .61, .68, .75, .82, .89, .95, 1]);
await audit("mobile", { width: 390, height: 844 }, [0, .06, .12, .18, .24, .31, .38, .45, .52, .60, .68, .76, .84, .92, 1]);

await browser.close();

if (failed) {
  console.error("NOIR layered audit failed. Inspect visual-audit metadata and screenshots.");
  process.exitCode = 1;
} else {
  console.log("NOIR layered audit passed: scenes share one stage and reverse-scroll states are deterministic.");
}
