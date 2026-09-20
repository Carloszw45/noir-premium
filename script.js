window.addEventListener("load", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileDevice = window.matchMedia("(max-width: 650px)").matches;
  const stage = document.querySelector(".experience-stage");
  const sceneElements = [...document.querySelectorAll(".experience-stage .scene")];
  const sceneLabels = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"];

  /* Mobile scenes beyond the opening pair use dormant picture sources. They
     are activated a few scenes ahead of the scrub, keeping the first render
     light without allowing a transition to arrive before its artwork. */
  const activateMobileSceneImages = sceneIndex => {
    if (!mobileDevice) return;
    const scene = sceneElements[sceneIndex];
    if (!scene) return;

    scene.querySelectorAll("picture").forEach(picture => {
      const source = picture.querySelector("source[data-srcset]");
      if (source && !source.srcset) source.srcset = source.dataset.srcset;

      const image = picture.querySelector("img[data-src]");
      if (!image || image.dataset.mobileLoaded === "true") return;
      image.dataset.mobileLoaded = "true";
      image.loading = "eager";
      image.src = image.dataset.src;
    });
  };

  const preloadMobileSceneWindow = activeIndex => {
    if (!mobileDevice) return;
    const first = Math.max(0, activeIndex - 1);
    const last = Math.min(sceneElements.length - 1, activeIndex + 3);
    for (let index = first; index <= last; index += 1) activateMobileSceneImages(index);
  };

  const nativeLinks = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", event => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      });
    });
  };

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    document.documentElement.classList.add("no-gsap");
    if (mobileDevice) sceneElements.forEach((_, index) => activateMobileSceneImages(index));
    nativeLinks();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  const scenes = gsap.utils.toArray(sceneElements);

  if (!stage || scenes.length !== 10 || reduceMotion) {
    if (mobileDevice) scenes.forEach((_, index) => activateMobileSceneImages(index));
    nativeLinks();
    return;
  }

  const circleRevealDefinitions = {
    s2: { sceneSelector: "#s2", discSelector: ".night-transition-disc", contentSelector: ".night-transition-content", origin: "50% 78%" },
    s4: { sceneSelector: "#s4", discSelector: ".object-transition-disc", contentSelector: ".object-transition-content", origin: "54% 48%" },
    s6: { sceneSelector: "#s6", discSelector: ".manifest-transition-disc", contentSelector: ".manifest-transition-content", origin: "70% 55%" },
    s8: { sceneSelector: "#s8", discSelector: ".midnight-transition-disc", contentSelector: ".midnight-content", origin: "50% 52%" },
    s10: { sceneSelector: "#s10", discSelector: ".final-transition-disc", contentSelector: ".final-transition-content", origin: "68% 50%" }
  };

  Object.values(circleRevealDefinitions).forEach(definition => {
    definition.scene = document.querySelector(definition.sceneSelector);
    definition.disc = document.querySelector(definition.discSelector);
    definition.content = document.querySelector(definition.contentSelector);
    definition.active = !mobileDevice && Boolean(definition.scene && definition.disc && definition.content);
    if (definition.active) definition.scene.classList.add("circle-reveal-active");
  });

  const circleRevealTarget = sceneKey => {
    const definition = circleRevealDefinitions[sceneKey];
    return definition.active ? definition.disc : definition.scene;
  };

  /* One viewport, ten stacked scenes. Scroll controls one timeline in both directions. */
  scenes.forEach((scene, index) => {
    gsap.set(scene, {
      zIndex: 20 + index,
      visibility: mobileDevice ? (index < 2 ? "visible" : "hidden") : "visible",
      opacity: 1
    });
  });

  preloadMobileSceneWindow(0);

  gsap.set("#s1", { clipPath: "inset(0% 0% 0% 0%)" });
  gsap.set("#s3", { clipPath: "inset(100% 0% 0% 0%)" });
  gsap.set("#s5", { clipPath: "inset(50% 0% 50% 0%)" });
  gsap.set("#s7", { clipPath: "inset(0% 0% 0% 100%)" });
  gsap.set("#s9", { clipPath: "inset(100% 0% 0% 0%)" });

  Object.values(circleRevealDefinitions).forEach(definition => {
    const closedCircle = `circle(0% at ${definition.origin})`;
    if (definition.active) {
      gsap.set(definition.scene, { clipPath: "none" });
      gsap.set(definition.disc, { clipPath: closedCircle });
      gsap.set(definition.content, { opacity: 0 });
      return;
    }
    gsap.set(definition.scene, { clipPath: closedCircle });
  });

  /* Initial poses for the incoming layers. All are deterministic and reversible. */
  gsap.set(".hero-background-layer", { scale: 1.03, x: 0, y: 0, opacity: .98 });
  gsap.set(".hero-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .92 });
  gsap.set(".hero-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .86 });
  gsap.set(".hero-reflection", { x: 0, y: 0, scale: 1, opacity: .78 });

  gsap.set(".night-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .96 });
  gsap.set(".night-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .92 });
  gsap.set(".night-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .78 });
  gsap.set(".night-bottle-asset", { scale: 1, opacity: 1 });

  gsap.set(".materials-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".materials-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .82 });
  gsap.set(".materials-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .58 });
  gsap.set([".material-wood-asset", ".material-rose-asset", ".material-amber-asset"], { scale: 1, opacity: 1 });

  gsap.set(".object-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".object-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .85 });
  gsap.set(".object-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .58 });
  gsap.set(".object-bottle-asset", { scale: 1, opacity: 1 });

  gsap.set(".presence-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".presence-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .74 });
  gsap.set(".presence-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .52 });

  gsap.set(".manifest-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".manifest-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .78 });
  gsap.set(".manifest-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .56 });

  gsap.set(".collection-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".collection-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .72 });
  gsap.set(".collection-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .52 });
  gsap.set(".collection-bottle-asset", { scale: .96, opacity: 1 });

  gsap.set(".midnight-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".midnight-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .78 });
  gsap.set(".midnight-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .54 });
  gsap.set(".midnight-sun-asset", { scale: 1, opacity: 1 });

  gsap.set(".atelier-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".atelier-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .76 });
  gsap.set(".atelier-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .52 });
  gsap.set(".atelier-bottle-asset", { scale: .96, opacity: 1 });

  gsap.set(".final-background-layer", { x: 0, y: 0, scale: 1.04, opacity: .98 });
  gsap.set(".final-atmosphere-a", { x: 0, y: 0, scale: 1, opacity: .78 });
  gsap.set(".final-atmosphere-b", { x: 0, y: 0, scale: 1, opacity: .54 });
  gsap.set(".final-bottle-asset", { scale: .96, opacity: 1 });

  gsap.set(".night-title", { x: -90 });
  gsap.set(".night-product", { x: 95, scale: .9 });
  gsap.set(".night-text", { y: 60, opacity: .35 });
  gsap.set(".night-circle", { scale: .65, rotation: -45, opacity: .35 });

  gsap.set(".materials-title", { y: 100, opacity: .25 });
  gsap.set([".material-one", ".material-two", ".material-three"], { y: 90, scale: .9, opacity: .35 });
  gsap.set(".orbit-large", { scale: .7, rotation: -50, opacity: .25 });
  gsap.set(".orbit-small", { scale: 1.25, rotation: 50, opacity: .25 });

  gsap.set(".object-stage", { scale: .72, rotation: -5 });
  gsap.set(".object-copy", { x: -90, opacity: .2 });
  gsap.set(".huge-word", { xPercent: -8, opacity: .25 });

  gsap.set(".photo-main", { scale: 1.08, x: -45 });
  gsap.set(".photo-detail", { scale: .9, x: 60, y: 55 });
  gsap.set(".presence-copy", { x: 90, opacity: .15 });
  gsap.set(".presence-word", { scale: .9, opacity: .25 });

  gsap.set(".manifest-copy", { scale: .84, opacity: .2 });
  gsap.set(".manifest-noir", { scale: 1.22, opacity: .12 });
  gsap.set([".mc1", ".mc2", ".mc3"], { scale: .55, opacity: .18 });

  gsap.set(".collection-heading", { x: 70, opacity: 0 });
  gsap.set(".collection-track", { x: 0 });

  gsap.set(".midnight-title", { x: -70, opacity: .2 });
  gsap.set(".sun", { scale: .28, opacity: .45 });
  gsap.set(".sun-frame", { scale: .75, rotation: -8, opacity: .35 });
  gsap.set([".fp1", ".fp2"], { y: 70, opacity: .2 });

  gsap.set(".main-sheet", { y: 120, rotation: -3, opacity: .25 });
  gsap.set(".small-sheet.one", { x: -90, y: 90, opacity: .2 });
  gsap.set(".small-sheet.two", { x: 80, y: 120, opacity: .2 });
  gsap.set(".atelier-product", { x: 90, y: 50, scale: .88, opacity: .25 });
  gsap.set(".atelier-copy", { y: 70, opacity: .15 });

  gsap.set(".final-product", { x: 60, y: 60, scale: .82, opacity: .4 });
  gsap.set(".final-copy", { x: -90, opacity: .15 });
  gsap.set(".final-word", { scale: .88, opacity: .2 });
  gsap.set(".final-glow", { scale: .7, opacity: .25 });

  const master = gsap.timeline({ defaults: { ease: "none" } });

  master.addLabel("s1", 0);

  /* 01 -> 02: the red world grows through the hero instead of replacing it. */
  master
    .to(".hero-background-layer", { x: -28, y: -18, scale: 1.10, duration: 1.05 }, .35)
    .to(".hero-atmosphere-a", { x: 44, y: -24, scale: 1.16, opacity: .12, duration: 1.05 }, .35)
    .to(".hero-atmosphere-b", { x: -38, y: -18, scale: 1.22, opacity: .08, duration: 1.05 }, .35)
    .to(".hero-reflection", { x: -32, y: -22, scale: 1.18, opacity: .10, duration: 1.05 }, .35)
    .to(".hero-bottle-asset", { scale: 1.035, duration: 1.05 }, .35)
    .to(".hero-product", { y: -35, scale: 1.08, rotation: .8, duration: 1.05 }, .35)
    .to(".hero-title", { y: -44, scale: 1.06, duration: 1.05 }, .35)
    .to([".hero-copy", ".hero-notes", ".hero-bottom"], { opacity: .18, duration: .55 }, .55)
    .to(".night-background-layer", { x: -8, y: -6, scale: 1.07, opacity: 1, duration: 1.05 }, .72)
    .to(".night-atmosphere-a", { x: -24, y: -12, scale: 1.12, opacity: 1, duration: 1.05 }, .72)
    .to(".night-atmosphere-b", { x: 20, y: 10, scale: 1.10, opacity: .88, duration: 1.05 }, .72)
    .to(circleRevealTarget("s2"), { clipPath: "circle(150% at 50% 78%)", duration: 1.12 }, .72)
    .to(".night-title", { x: 0, duration: .9 }, .84)
    .to(".night-product", { x: 0, scale: 1, duration: .92 }, .84)
    .to(".night-bottle-asset", { scale: 1.02, duration: .92 }, .84)
    .to(".night-text", { y: 0, opacity: 1, duration: .82 }, .9)
    .to(".night-circle", { scale: 1, rotation: 0, opacity: 1, duration: .88 }, .9)
    .addLabel("s2", 1.62);

  if (circleRevealDefinitions.s2.active) {
    master.to(circleRevealDefinitions.s2.content, { opacity: 1, duration: .34 }, 1.5);
  }

  /* 02 -> 03: ivory rises while the night remains visible underneath. */
  master
    .to(".night-background-layer", { x: -34, y: -22, scale: 1.12, opacity: .34, duration: .7 }, 1.8)
    .to(".night-atmosphere-a", { x: 28, y: -20, scale: 1.22, opacity: .18, duration: .7 }, 1.8)
    .to(".night-atmosphere-b", { x: -24, y: -14, scale: 1.24, opacity: .12, duration: .7 }, 1.8)
    .to(".night-title", { y: -45, scale: 1.03, duration: .7 }, 1.8)
    .to(".night-product", { x: -35, y: -20, scale: 1.05, duration: .7 }, 1.8)
    .to(".night-bottle-asset", { scale: 1.08, duration: .7 }, 1.8)
    .to("#s3", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05 }, 2.05)
    .to(".materials-background-layer", { x: -12, y: -8, scale: 1.08, opacity: 1, duration: .82 }, 2.05)
    .to(".materials-atmosphere-a", { x: 28, y: -16, scale: 1.12, opacity: .96, duration: .82 }, 2.05)
    .to(".materials-atmosphere-b", { x: -24, y: 12, scale: 1.08, opacity: .72, duration: .82 }, 2.05)
    .to(".materials-title", { y: 0, opacity: 1, duration: .78 }, 2.18)
    .to([".material-one", ".material-two", ".material-three"], { y: 0, scale: 1, opacity: 1, stagger: .07, duration: .72 }, 2.2)
    .to([".material-wood-asset", ".material-rose-asset", ".material-amber-asset"], { scale: 1.035, duration: .72, stagger: .07 }, 2.2)
    .to(".orbit-large", { scale: 1, rotation: 35, opacity: 1, duration: .82 }, 2.2)
    .to(".orbit-small", { scale: 1, rotation: -45, opacity: 1, duration: .82 }, 2.2)
    .addLabel("s3", 2.95)
    .to(".material-one", { y: -26, rotation: 1.5, duration: .58 }, 3.0)
    .to(".material-two", { y: -36, scale: 1.03, duration: .58 }, 3.0)
    .to(".material-three", { y: -20, scale: 1.05, duration: .58 }, 3.0)
    .to(".orbit-large", { rotation: 105, duration: .58 }, 3.0)
    .to(".orbit-small", { rotation: -115, duration: .58 }, 3.0);

  /* 03 -> 04: the amber/material field collapses into the black object world. */
  master
    .to(".materials-background-layer", { x: -38, y: -20, scale: 1.13, opacity: .38, duration: .78 }, 3.45)
    .to(".materials-atmosphere-a", { x: 42, y: -28, scale: 1.18, opacity: .14, duration: .78 }, 3.45)
    .to(".materials-atmosphere-b", { x: -36, y: -18, scale: 1.16, opacity: .10, duration: .78 }, 3.45)
    .to([".material-wood-asset", ".material-rose-asset", ".material-amber-asset"], { scale: 1.08, duration: .72, stagger: .06 }, 3.45)
    .to(".object-background-layer", { x: -18, y: -14, scale: 1.10, opacity: 1, duration: .86 }, 3.45)
    .to(".object-atmosphere-a", { x: 28, y: -20, scale: 1.16, opacity: .96, duration: .86 }, 3.45)
    .to(".object-atmosphere-b", { x: -30, y: 12, scale: 1.12, opacity: .72, duration: .86 }, 3.45)
    .to(circleRevealTarget("s4"), { clipPath: "circle(150% at 54% 48%)", duration: 1.02 }, 3.45)
    .to(".object-stage", { scale: 1, rotation: 0, duration: .86 }, 3.58)
    .to(".object-bottle-asset", { scale: 1.035, duration: .86 }, 3.58)
    .to(".object-copy", { x: 0, opacity: 1, duration: .78 }, 3.68)
    .to(".huge-word", { xPercent: 0, opacity: 1, duration: .82 }, 3.58)
    .to(".oc1", { rotation: 55, duration: .72 }, 3.7)
    .to(".oc2", { rotation: -70, duration: .72 }, 3.7)
    .to(".oc3", { rotation: 95, duration: .72 }, 3.7)
    .addLabel("s4", 4.32);

  if (circleRevealDefinitions.s4.active) {
    master.to(circleRevealDefinitions.s4.content, { opacity: 1, duration: .34 }, 4.1);
  }

  /* 04 -> 05: the black object opens through the middle into the campaign image. */
  master
    .to(".object-background-layer", { x: -48, y: -22, scale: 1.16, opacity: .28, duration: .68 }, 4.48)
    .to(".object-atmosphere-a", { x: 40, y: -24, scale: 1.22, opacity: .12, duration: .68 }, 4.48)
    .to(".object-atmosphere-b", { x: -42, y: -16, scale: 1.18, opacity: .08, duration: .68 }, 4.48)
    .to(".object-bottle-asset", { scale: 1.09, duration: .68 }, 4.48)
    .to(".object-stage", { scale: 1.08, rotation: 2, duration: .68 }, 4.48)
    .to(".huge-word", { xPercent: 4, duration: .68 }, 4.48)
    .to(".presence-background-layer", { x: -16, y: -10, scale: 1.08, opacity: 1, duration: .86 }, 4.62)
    .to(".presence-atmosphere-a", { x: 30, y: -18, scale: 1.12, opacity: .9, duration: .86 }, 4.62)
    .to(".presence-atmosphere-b", { x: -24, y: 12, scale: 1.1, opacity: .68, duration: .86 }, 4.62)
    .to("#s5", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05 }, 4.72)
    .to(".photo-main", { scale: 1, x: 0, duration: .88 }, 4.82)
    .to(".photo-detail", { scale: 1, x: 0, y: 0, duration: .88 }, 4.86)
    .to(".presence-copy", { x: 0, opacity: 1, duration: .82 }, 4.9)
    .to(".presence-word", { scale: 1, opacity: 1, duration: .82 }, 4.85)
    .addLabel("s5", 5.62)
    .to(".photo-main img", { yPercent: 5, scale: 1.02, duration: .6 }, 5.65)
    .to(".photo-detail", { y: -22, duration: .6 }, 5.65);

  /* 05 -> 06: the editorial composition becomes the red manifesto through one expanding circle. */
  master
    .to(circleRevealTarget("s6"), { clipPath: "circle(150% at 70% 55%)", duration: 1.04 }, 6.02)
    .to(".presence-background-layer", { x: -42, y: -22, scale: 1.14, opacity: .24, duration: .72 }, 6.02)
    .to(".presence-atmosphere-a", { x: 44, y: -24, scale: 1.2, opacity: .12, duration: .72 }, 6.02)
    .to(".presence-atmosphere-b", { x: -38, y: -16, scale: 1.16, opacity: .08, duration: .72 }, 6.02)
    .to(".manifest-background-layer", { x: -12, y: -8, scale: 1.08, opacity: 1, duration: .86 }, 6.02)
    .to(".manifest-atmosphere-a", { x: 28, y: -18, scale: 1.12, opacity: .96, duration: .86 }, 6.02)
    .to(".manifest-atmosphere-b", { x: -24, y: 10, scale: 1.10, opacity: .72, duration: .86 }, 6.02)
    .to(".manifest-copy", { scale: 1, opacity: 1, duration: .86 }, 6.14)
    .to(".manifest-noir", { scale: 1, opacity: 1, duration: .88 }, 6.12)
    .to([".mc1", ".mc2", ".mc3"], { scale: 1, opacity: 1, stagger: .05, duration: .82 }, 6.14)
    .addLabel("s6", 6.92)
    .to(".mc1", { rotation: 70, scale: 1.22, duration: .62 }, 6.95)
    .to(".mc2", { rotation: -95, scale: .88, duration: .62 }, 6.95)
    .to(".mc3", { rotation: 120, scale: 1.15, duration: .62 }, 6.95);

  if (circleRevealDefinitions.s6.active) {
    master.to(circleRevealDefinitions.s6.content, { opacity: 1, duration: .34 }, 6.67);
  }

  /* 06 -> 07: collection slides over the manifesto and continues horizontally in the same master timeline. */
  master
    .to("#s7", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05 }, 7.38)
    .to(".manifest-background-layer", { x: -38, y: -18, scale: 1.14, opacity: .28, duration: .76 }, 7.38)
    .to(".manifest-atmosphere-a", { x: 42, y: -24, scale: 1.18, opacity: .12, duration: .76 }, 7.38)
    .to(".manifest-atmosphere-b", { x: -34, y: -14, scale: 1.16, opacity: .08, duration: .76 }, 7.38)
    .to(".collection-background-layer", { x: -12, y: -8, scale: 1.08, opacity: 1, duration: .86 }, 7.38)
    .to(".collection-atmosphere-a", { x: 26, y: -16, scale: 1.12, opacity: .92, duration: .86 }, 7.38)
    .to(".collection-atmosphere-b", { x: -22, y: 12, scale: 1.10, opacity: .68, duration: .86 }, 7.38)
    .to(".collection-heading", { x: 0, opacity: 1, duration: .78 }, 7.48)
    .to(".collection-bottle-asset", { scale: 1, duration: .78, stagger: .06 }, 7.52)
    .addLabel("s7", 8.12)
    .to(".collection-heading", { opacity: 0, y: -24, duration: .35 }, 8.42)
    .to(".collection-track", {
      x: () => -Math.max(0, document.querySelector(".collection-track").scrollWidth - window.innerWidth),
      duration: 2.45,
      ease: "none"
    }, 8.2)
    .addLabel("s8-pre", 10.48);

  /* 07 -> 08: ABSOLU hands its gold directly to APRÈS MINUIT. */
  master
    .to(".collection-background-layer", { x: -42, y: -22, scale: 1.14, opacity: .22, duration: .72 }, 10.48)
    .to(".collection-atmosphere-a", { x: 42, y: -24, scale: 1.18, opacity: .10, duration: .72 }, 10.48)
    .to(".collection-atmosphere-b", { x: -34, y: -14, scale: 1.16, opacity: .06, duration: .72 }, 10.48)
    .to(".midnight-background-layer", { x: -14, y: -8, scale: 1.08, opacity: 1, duration: .88 }, 10.48)
    .to(".midnight-atmosphere-a", { x: 28, y: -18, scale: 1.12, opacity: .96, duration: .88 }, 10.48)
    .to(".midnight-atmosphere-b", { x: -22, y: 10, scale: 1.10, opacity: .70, duration: .88 }, 10.48)
    .to(circleRevealTarget("s8"), { clipPath: "circle(150% at 50% 52%)", duration: 1.02 }, 10.48)
    .to(".midnight-title", { x: 0, opacity: 1, duration: .8 }, 10.58)
    .to(".sun", { scale: 1, opacity: 1, duration: .88 }, 10.55)
    .to(".midnight-sun-asset", { scale: 1.04, duration: .88 }, 10.55)
    .to(".sun-frame", { scale: 1, rotation: 0, opacity: 1, duration: .86 }, 10.6)
    .to([".fp1", ".fp2"], { y: 0, opacity: 1, stagger: .06, duration: .8 }, 10.62)
    .addLabel("s8", 11.34)
    .to(".sun", { scale: 1.24, x: -20, duration: .62 }, 11.38)
    .to(".midnight-word", { xPercent: -5, duration: .62 }, 11.38);

  if (circleRevealDefinitions.s8.active) {
    master.to(circleRevealDefinitions.s8.content, { opacity: 1, duration: .34 }, 11.12);
  }

  /* 08 -> 09: the gold disc becomes a sheet/formula field rising from below. */
  master
    .to(".sun", { scale: 2.05, opacity: .45, duration: .62 }, 11.82)
    .to(".midnight-background-layer", { x: -46, y: -24, scale: 1.16, opacity: .28, duration: .62 }, 11.82)
    .to(".midnight-atmosphere-a", { x: 44, y: -24, scale: 1.18, opacity: .12, duration: .62 }, 11.82)
    .to(".midnight-atmosphere-b", { x: -38, y: -16, scale: 1.16, opacity: .08, duration: .62 }, 11.82)
    .to(".atelier-background-layer", { x: -12, y: -8, scale: 1.08, opacity: 1, duration: .86 }, 11.94)
    .to(".atelier-atmosphere-a", { x: 28, y: -18, scale: 1.12, opacity: .94, duration: .86 }, 11.94)
    .to(".atelier-atmosphere-b", { x: -24, y: 10, scale: 1.10, opacity: .68, duration: .86 }, 11.94)
    .to("#s9", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.02 }, 11.94)
    .to(".main-sheet", { y: 0, rotation: 0, opacity: 1, duration: .82 }, 12.06)
    .to(".small-sheet.one", { x: 0, y: 0, opacity: 1, duration: .78 }, 12.1)
    .to(".small-sheet.two", { x: 0, y: 0, opacity: 1, duration: .78 }, 12.14)
    .to(".atelier-product", { x: 0, y: 0, scale: 1, opacity: 1, duration: .84 }, 12.08)
    .to(".atelier-bottle-asset", { scale: 1, duration: .84 }, 12.08)
    .to(".atelier-copy", { y: 0, opacity: 1, duration: .82 }, 12.15)
    .addLabel("s9", 12.88)
    .to(".main-sheet", { y: -24, duration: .55 }, 12.92)
    .to(".atelier-product", { y: -18, rotation: 1.5, duration: .55 }, 12.92);

  /* 09 -> 10: the atelier bottle travels into the final dark field. */
  master
    .to(".atelier-background-layer", { x: -42, y: -22, scale: 1.14, opacity: .24, duration: .72 }, 13.32)
    .to(".atelier-atmosphere-a", { x: 42, y: -24, scale: 1.18, opacity: .10, duration: .72 }, 13.32)
    .to(".atelier-atmosphere-b", { x: -36, y: -14, scale: 1.16, opacity: .08, duration: .72 }, 13.32)
    .to(".final-background-layer", { x: -14, y: -8, scale: 1.08, opacity: 1, duration: .90 }, 13.5)
    .to(".final-atmosphere-a", { x: 28, y: -18, scale: 1.12, opacity: .96, duration: .90 }, 13.5)
    .to(".final-atmosphere-b", { x: -24, y: 10, scale: 1.10, opacity: .70, duration: .90 }, 13.5)
    .to(".atelier-product", { x: 65, y: -30, scale: 1.08, duration: .68 }, 13.32)
    .to(circleRevealTarget("s10"), { clipPath: "circle(150% at 68% 50%)", duration: 1.05 }, 13.5)
    .to(".final-product", { x: 0, y: 0, scale: 1, opacity: 1, duration: .92 }, 13.52)
    .to(".final-bottle-asset", { scale: 1.035, duration: .92 }, 13.52)
    .to(".final-copy", { x: 0, opacity: 1, duration: .82 }, 13.68)
    .to(".final-word", { scale: 1, opacity: 1, duration: .84 }, 13.62)
    .to(".final-glow", { scale: 1, opacity: 1, duration: .84 }, 13.62)
    .fromTo(".final-axis", { scaleX: 0 }, { scaleX: 1, duration: .65 }, 13.78)
    .addLabel("s10", 14.36)
    .to(".final-product", { y: -16, scale: 1.025, duration: .55 }, 14.4)
    .to(".final-glow", { scale: 1.16, duration: .55 }, 14.4);

  if (circleRevealDefinitions.s10.active) {
    master.to(circleRevealDefinitions.s10.content, { opacity: 1, duration: .34 }, 14.17);
  }

  const scrollDistance = () => Math.max(window.innerHeight * 14.8, 9800);
  const masterTrigger = ScrollTrigger.create({
    trigger: stage,
    start: "top top",
    end: () => `+=${scrollDistance()}`,
    pin: true,
    pinSpacing: true,
    animation: master,
    scrub: .18,
    anticipatePin: 1,
    invalidateOnRefresh: true
  });

  /* The hero progress line belongs to the master timeline, not a competing trigger. */
  gsap.set(".progress-line i", { scaleX: 0 });
  master.to(".progress-line i", { scaleX: 1, duration: 1.2 }, .25);

  /* Mobile CSS intentionally hides atmospheric decoration. Remove its timeline
     work too, so hidden blur/orbit layers do not consume scroll-frame updates. */
  if (mobileDevice) {
    master.getChildren(true, true, false).forEach(tween => {
      const targets = typeof tween.targets === "function" ? tween.targets() : [];
      const hiddenOnly = targets.length > 0 && targets.every(target =>
        target && target.nodeType === 1 && getComputedStyle(target).display === "none"
      );
      if (hiddenOnly) {
        master.remove(tween);
        tween.kill();
      }
    });

    /* Keep only the current scene and its immediate neighbours composited.
       The complete film remains in one reversible master timeline; distant
       scenes simply stop painting until the scrub reaches them. */
    let visibleStart = -1;
    let visibleEnd = -1;
    const syncMobileSceneWindow = () => {
      const time = master.time();
      let activeIndex = 0;

      sceneLabels.forEach((label, index) => {
        if (master.labels[label] <= time + 0.001) activeIndex = index;
      });

      const nextStart = Math.max(0, activeIndex - 1);
      const nextEnd = Math.min(scenes.length - 1, activeIndex + 1);
      preloadMobileSceneWindow(activeIndex);
      if (nextStart === visibleStart && nextEnd === visibleEnd) return;

      visibleStart = nextStart;
      visibleEnd = nextEnd;
      scenes.forEach((scene, index) => {
        const visibility = index >= visibleStart && index <= visibleEnd ? "visible" : "hidden";
        if (scene.style.visibility !== visibility) scene.style.visibility = visibility;
      });
    };

    master.eventCallback("onUpdate", syncMobileSceneWindow);
    syncMobileSceneWindow();
  }

  const sceneLabel = {
    s1: "s1", s2: "s2", s3: "s3", s4: "s4", s5: "s5",
    s6: "s6", s7: "s7", s8: "s8", s9: "s9", s10: "s10"
  };

  /* Anchors navigate to the corresponding point of the scroll-driven film. */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href").slice(1);
      const label = sceneLabel[id];
      if (!label || master.labels[label] == null) return;
      event.preventDefault();
      const progress = master.labels[label] / master.duration();
      const top = masterTrigger.start + (masterTrigger.end - masterTrigger.start) * progress;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* Intro is deliberately independent of layout transforms. */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".nav", { opacity: 0, y: -16, duration: .7 })
    .from(".hero-title span", { opacity: 0, yPercent: 100, duration: .95, stagger: .045 }, "-=.42")
    .from(".hero-bottle-asset, .hero-label-overlay, .hero-product .shadow", { opacity: 0, duration: .9, stagger: .06 }, "-=.66")
    .from(".hero-copy p", { opacity: 0, duration: .55 }, "-=.5")
    .from(".hero-notes span", { opacity: 0, duration: .45, stagger: .05 }, "-=.38");

  /* Pointer depth stays decorative; it never controls a scroll-owned object. */
  if (window.matchMedia("(pointer: fine)").matches) {
    const moveAX = gsap.quickTo(".ambient-a", "x", { duration: .7, ease: "power3.out" });
    const moveAY = gsap.quickTo(".ambient-a", "y", { duration: .7, ease: "power3.out" });
    const moveBX = gsap.quickTo(".ambient-b", "x", { duration: .85, ease: "power3.out" });
    const moveBY = gsap.quickTo(".ambient-b", "y", { duration: .85, ease: "power3.out" });

    window.addEventListener("pointermove", event => {
      const nx = event.clientX / window.innerWidth - .5;
      const ny = event.clientY / window.innerHeight - .5;
      moveAX(nx * 18);
      moveAY(ny * 12);
      moveBX(nx * -14);
      moveBY(ny * -10);
    }, { passive: true });
  }

  ScrollTrigger.refresh();
  document.fonts?.ready?.then(() => ScrollTrigger.refresh());
});
