(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "v5.css?v=5";
  document.head.appendChild(link);
})();

window.addEventListener("load", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  /* INTRO */
  const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
  intro
    .from(".nav", { opacity: 0, y: -25, duration: 1 })
    .from(".hero .chapter", { opacity: 0, y: 18, duration: .8 }, "-=.65")
    .from(".hero-title span", { opacity: 0, yPercent: 120, duration: 1.35, stagger: .07 }, "-=.65")
    .from(".hero-product", { opacity: 0, y: 100, scale: .7, duration: 1.5, ease: "expo.out" }, "-=1")
    .from(".hero-copy", { opacity: 0, x: -45, duration: .9 }, "-=.8")
    .from(".hero-notes", { opacity: 0, x: 45, duration: .9 }, "-=.85")
    .from(".hero-bottom", { opacity: 0, y: 20, duration: .8 }, "-=.7");

  /* HERO — keep the composition alive until the final transition */
  const hero = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=125%",
      pin: true,
      scrub: 1.15,
      anticipatePin: 1
    }
  });

  hero
    .to(".hero-product", { scale: 1.34, yPercent: 8, duration: .7, ease: "none" }, 0)
    .to(".hero-title", { scale: 1.14, yPercent: -7, duration: .7, ease: "none" }, 0)
    .to(".hero-copy", { x: -90, opacity: 0, duration: .24, ease: "none" }, .48)
    .to(".hero-notes", { x: 90, opacity: 0, duration: .24, ease: "none" }, .48)
    .to(".hero-bottom", { y: 20, opacity: 0, duration: .22, ease: "none" }, .53)
    .to(".hero .chapter", { opacity: 0, duration: .18, ease: "none" }, .56)
    .to(".hero-product", { yPercent: 35, scale: 1.08, rotation: 2, duration: .25, ease: "none" }, .66)
    .to(".transition-red", { scale: 12, duration: .24, ease: "none" }, .74)
    .to(".hero-product", { opacity: .15, yPercent: 55, duration: .16, ease: "none" }, .82);

  gsap.fromTo(
    ".progress-line i",
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "+=125%", scrub: true }
    }
  );

  /* NIGHT — enter as a complete frame, never as a blank red screen */
  gsap.set([".night-title", ".night-product", ".night-text", ".night-circle"], { opacity: 1 });

  const night = gsap.timeline({
    scrollTrigger: {
      trigger: ".night",
      start: "top top",
      end: "+=95%",
      pin: true,
      scrub: 1.1,
      anticipatePin: 1
    }
  });

  night
    .fromTo(".night-title", { yPercent: 4, scale: .96 }, { yPercent: -6, scale: 1.03, duration: .68, ease: "none" }, 0)
    .fromTo(".night-product", { xPercent: 8, yPercent: 7, scale: .94, rotation: -2 }, { xPercent: -8, yPercent: -5, scale: 1.08, rotation: 3, duration: .7, ease: "none" }, 0)
    .fromTo(".night-text", { y: 22 }, { y: -12, duration: .62, ease: "none" }, .05)
    .to(".night-circle", { rotation: 145, scale: 1.35, duration: .72, ease: "none" }, 0)
    .to([".night-title", ".night-product", ".night-text", ".night-small"], { opacity: 0, y: -28, duration: .18, ease: "none" }, .73)
    .to(".wipe-cream", { scaleY: 1, duration: .22, ease: "none" }, .79);

  /* MATERIALS */
  gsap.from(".materials-title", {
    y: 45,
    opacity: 0,
    scrollTrigger: { trigger: ".materials", start: "top 80%", end: "18% 52%", scrub: 1 }
  });

  gsap.fromTo(".material-one", { y: 75, rotation: -3 }, { y: -45, rotation: 1, ease: "none", scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: 1.1 } });
  gsap.fromTo(".material-two", { y: 90, scale: .9 }, { y: -55, scale: 1.04, ease: "none", scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: 1.1 } });
  gsap.fromTo(".material-three", { y: 70, scale: .82 }, { y: -70, scale: 1.1, ease: "none", scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: 1.1 } });
  gsap.to(".orbit-large", { rotation: 130, scale: 1.15, ease: "none", scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".orbit-small", { rotation: -180, scale: .82, ease: "none", scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".transition-black", { scale: 11, ease: "none", scrollTrigger: { trigger: ".materials", start: "76% 72%", end: "bottom top", scrub: 1 } });

  /* OBJECT */
  const object = gsap.timeline({
    scrollTrigger: { trigger: ".object-scene", start: "top bottom", end: "bottom top", scrub: 1.1 }
  });

  object
    .fromTo(".object-stage", { scale: .72, rotation: -5 }, { scale: 1.08, rotation: 3, ease: "none" }, 0)
    .to(".oc1", { rotation: 130, scale: 1.28, ease: "none" }, 0)
    .to(".oc2", { rotation: -175, scale: .82, ease: "none" }, 0)
    .to(".oc3", { rotation: 210, scale: 1.24, ease: "none" }, 0)
    .fromTo(".huge-word", { xPercent: -5 }, { xPercent: 6, ease: "none" }, 0)
    .fromTo(".object-copy", { opacity: .25, x: -45 }, { opacity: 1, x: 0, ease: "none" }, .12)
    .to([".object-copy", ".object-stage", ".huge-word"], { opacity: 0, duration: .12, ease: "none" }, .83)
    .to(".wipe-stone", { scaleY: 1, duration: .18, ease: "none" }, .84);

  /* PRESENCE */
  gsap.fromTo(".photo-main img", { yPercent: -7, scale: 1.14 }, { yPercent: 7, scale: 1, ease: "none", scrollTrigger: { trigger: ".presence", start: "top bottom", end: "bottom top", scrub: 1.1 } });
  gsap.fromTo(".photo-detail", { y: 95 }, { y: -65, ease: "none", scrollTrigger: { trigger: ".presence", start: "top bottom", end: "bottom top", scrub: 1.15 } });
  gsap.fromTo(".presence-copy", { y: 48, opacity: .2 }, { y: -5, opacity: 1, ease: "none", scrollTrigger: { trigger: ".presence", start: "15% 78%", end: "48% 55%", scrub: 1 } });
  gsap.to(".presence-word", { xPercent: -6, scale: 1.05, ease: "none", scrollTrigger: { trigger: ".presence", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".transition-manifest", { scale: 11, ease: "none", scrollTrigger: { trigger: ".presence", start: "78% 72%", end: "bottom top", scrub: 1 } });

  /* MANIFEST — pinned and centered, then fully cleared before collection */
  const manifest = gsap.timeline({
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top top",
      end: "+=85%",
      pin: true,
      scrub: 1.1,
      anticipatePin: 1
    }
  });

  manifest
    .fromTo(".manifest-copy", { scale: .9, opacity: .65 }, { scale: 1.02, opacity: 1, duration: .58, ease: "none" }, 0)
    .to(".mc1", { rotation: 85, scale: 1.35, duration: .72, ease: "none" }, 0)
    .to(".mc2", { rotation: -125, scale: .8, duration: .72, ease: "none" }, 0)
    .to(".mc3", { rotation: 165, scale: 1.3, duration: .72, ease: "none" }, 0)
    .to(".manifest-noir", { scale: 1.12, duration: .72, ease: "none" }, 0)
    .to([".manifest-copy", ".manifest-bottom", ".manifesto .chapter", ".manifest-noir"], { opacity: 0, y: -24, duration: .16, ease: "none" }, .7)
    .to(".wipe-collection", { scaleY: 1, duration: .2, ease: "none" }, .78);

  /* COLLECTION — horizontal act with a clean exit */
  const track = document.querySelector(".collection-track");
  const mm = gsap.matchMedia();

  mm.add("(min-width:651px)", () => {
    const distance = () => track.scrollWidth - window.innerWidth;
    const travel = () => distance() + window.innerWidth * .32;

    const collection = gsap.timeline({
      scrollTrigger: {
        trigger: ".collection",
        start: "top top",
        end: () => `+=${travel()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    collection
      .to(track, { x: () => -distance(), duration: .86, ease: "none" }, 0)
      .to(".collection-heading", { opacity: 0, y: -30, duration: .14, ease: "none" }, .03)
      .to(".cp3 .collection-product, .cp3 .collection-copy, .cp3 .panel-ghost, .cp3 .panel-counter", { opacity: 0, y: -25, duration: .09, ease: "none" }, .89);

    return () => collection.kill();
  });

  mm.add("(max-width:650px)", () => {
    const collection = gsap.timeline({
      scrollTrigger: {
        trigger: ".collection",
        start: "top top",
        end: "+=2050",
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    collection
      .to(track, { x: () => -(track.scrollWidth - window.innerWidth), duration: .86, ease: "none" }, 0)
      .to(".collection-heading", { opacity: 0, y: -22, duration: .14, ease: "none" }, .03)
      .to(".cp3 .collection-product, .cp3 .collection-copy, .cp3 .panel-ghost, .cp3 .panel-counter", { opacity: 0, y: -20, duration: .09, ease: "none" }, .89);

    return () => collection.kill();
  });

  /* MIDNIGHT — full scene, then cleared before atelier */
  const midnight = gsap.timeline({
    scrollTrigger: {
      trigger: ".midnight",
      start: "top top",
      end: "+=92%",
      pin: true,
      scrub: 1.1,
      anticipatePin: 1
    }
  });

  midnight
    .fromTo(".midnight-title", { y: 28, scale: .96 }, { y: -18, scale: 1.02, duration: .66, ease: "none" }, 0)
    .fromTo(".sun", { scale: .58, xPercent: 30 }, { scale: 1.38, xPercent: -10, duration: .7, ease: "none" }, 0)
    .to(".sun-frame", { rotation: 4, scale: 1.08, duration: .7, ease: "none" }, 0)
    .to(".fp1", { xPercent: 40, yPercent: -30, rotation: 2, duration: .7, ease: "none" }, 0)
    .to(".fp2", { xPercent: -45, yPercent: 25, rotation: -3, duration: .7, ease: "none" }, 0)
    .to(".midnight-word", { xPercent: -7, duration: .7, ease: "none" }, 0)
    .to([".midnight-title", ".sun", ".sun-frame", ".fp1", ".fp2", ".coordinates", ".midnight .chapter"], { opacity: 0, y: -18, duration: .14, ease: "none" }, .72)
    .to(".wipe-atelier", { scaleY: 1, duration: .19, ease: "none" }, .79);

  /* ATELIER — pin this scene so the formula can actually be read */
  const atelier = gsap.timeline({
    scrollTrigger: {
      trigger: ".atelier",
      start: "top top",
      end: "+=88%",
      pin: true,
      scrub: 1.08,
      anticipatePin: 1
    }
  });

  atelier
    .fromTo(".main-sheet", { y: 45, rotation: -3 }, { y: -28, rotation: 1, duration: .65, ease: "none" }, 0)
    .fromTo(".small-sheet.one", { y: 32 }, { y: -55, rotation: 12, duration: .65, ease: "none" }, 0)
    .fromTo(".small-sheet.two", { y: 50 }, { y: -34, rotation: -5, duration: .65, ease: "none" }, 0)
    .fromTo(".atelier-product", { y: 42, rotation: -3 }, { y: -30, rotation: 3, duration: .66, ease: "none" }, 0)
    .fromTo(".atelier-copy", { y: 24, opacity: .65 }, { y: -4, opacity: 1, duration: .5, ease: "none" }, .06)
    .to(".atelier-word", { xPercent: -6, scale: 1.03, duration: .65, ease: "none" }, 0)
    .to([".main-sheet", ".small-sheet", ".atelier-product", ".atelier-copy", ".atelier .chapter"], { opacity: 0, y: -24, duration: .15, ease: "none" }, .72)
    .to(".transition-final", { scale: 12, duration: .2, ease: "none" }, .79);

  /* FINAL */
  const finale = gsap.timeline({
    scrollTrigger: { trigger: ".finale", start: "top bottom", end: "bottom top", scrub: 1.1 }
  });

  finale
    .fromTo(".final-product", { yPercent: 18, scale: .78, rotation: -3 }, { yPercent: -8, scale: 1.05, rotation: 2, ease: "none" }, 0)
    .fromTo(".final-copy", { x: -55, opacity: .25 }, { x: 0, opacity: 1, ease: "none" }, .1)
    .to(".final-word", { scale: 1.14, ease: "none" }, 0)
    .to(".final-glow", { scale: 1.48, ease: "none" }, 0)
    .fromTo(".final-axis", { scaleX: 0 }, { scaleX: 1, ease: "none" }, .18);

  /* POINTER DEPTH */
  if (window.matchMedia("(pointer:fine)").matches) {
    const product = document.querySelector(".hero-product");
    window.addEventListener("pointermove", event => {
      const x = (event.clientX / window.innerWidth - .5) * 12;
      const y = (event.clientY / window.innerHeight - .5) * 8;
      gsap.to(product, { x, y, duration: 1.1, ease: "power3.out" });
    });
  }

  /* INTERNAL LINKS */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  ScrollTrigger.refresh();
});
