window.addEventListener("load", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* INTERNAL LINKS — keep navigation usable with or without motion. */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const selector = link.getAttribute("href");
      const target = selector ? document.querySelector(selector) : null;
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  if (reduceMotion) return;

  /* INTRO
     Only children are animated here. ScrollTrigger owns the parent transforms,
     so the intro and scroll never compete for the same GSAP properties. */
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".nav", { opacity: 0, y: -18, duration: .8 })
    .from(".hero-title span", { opacity: 0, yPercent: 105, duration: 1.1, stagger: .055 }, "-=.52")
    .from(".hero-product .bottle, .hero-product .shadow", { opacity: 0, duration: 1.05, stagger: .08 }, "-=.78")
    .from(".hero-copy p", { opacity: 0, duration: .72 }, "-=.62")
    .from(".hero-notes span", { opacity: 0, duration: .55, stagger: .06 }, "-=.5")
    .from(".hero-bottom > *", { opacity: 0, duration: .55, stagger: .08 }, "-=.45");

  /* HERO — one continuous transform path, fully reversible. */
  const hero = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * 1.25, 880)}`,
      pin: true,
      scrub: .5,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  hero
    .fromTo(
      ".hero-product",
      { y: 0, scale: 1, rotation: 0, opacity: 1 },
      {
        y: () => Math.min(window.innerHeight * .15, 135),
        scale: 1.16,
        rotation: 1.1,
        opacity: 1,
        duration: 1,
        ease: "none",
        immediateRender: false
      },
      0
    )
    .fromTo(
      ".hero-title",
      { y: 0, scale: 1 },
      { y: -48, scale: 1.08, duration: .82, ease: "none", immediateRender: false },
      0
    )
    .fromTo(
      ".hero-copy",
      { x: 0, opacity: 1 },
      { x: -68, opacity: 0, duration: .28, ease: "none", immediateRender: false },
      .43
    )
    .fromTo(
      ".hero-notes",
      { x: 0, opacity: 1 },
      { x: 68, opacity: 0, duration: .28, ease: "none", immediateRender: false },
      .43
    )
    .fromTo(
      ".hero-bottom",
      { y: 0, opacity: 1 },
      { y: 16, opacity: 0, duration: .25, ease: "none", immediateRender: false },
      .49
    )
    .fromTo(
      ".hero .chapter",
      { opacity: 1 },
      { opacity: 0, duration: .2, ease: "none", immediateRender: false },
      .54
    )
    .fromTo(
      ".transition-red",
      { scale: .08 },
      { scale: 12, duration: .14, ease: "none", immediateRender: false },
      .86
    )
    .to(".hero-product", { opacity: .18, duration: .07, ease: "none" }, .94);

  gsap.fromTo(
    ".progress-line i",
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: () => `+=${Math.max(window.innerHeight * 1.25, 880)}`,
        scrub: .3,
        invalidateOnRefresh: true
      }
    }
  );

  /* NIGHT */
  const night = gsap.timeline({
    scrollTrigger: {
      trigger: ".night",
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * .95, 720)}`,
      pin: true,
      scrub: .65,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  night
    .fromTo(".night-title", { y: 0, scale: 1 }, { y: -34, scale: 1.025, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".night-product", { x: 28, y: 24, scale: .96, rotation: -1.2 }, { x: -32, y: -18, scale: 1.07, rotation: 2.2, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".night-text", { y: 16 }, { y: -10, duration: .66, ease: "none", immediateRender: false }, .04)
    .fromTo(".night-circle", { rotation: 0, scale: 1 }, { rotation: 135, scale: 1.3, duration: .72, ease: "none", immediateRender: false }, 0)
    .to([".night-title", ".night-product", ".night-text", ".night-small"], { opacity: 0, y: -20, duration: .09, ease: "none" }, .91)
    .fromTo(".wipe-cream", { scaleY: .02 }, { scaleY: 1, duration: .13, ease: "none", immediateRender: false }, .87);

  /* MATERIALS */
  gsap.fromTo(".materials-title", { y: 38, opacity: 0 }, {
    y: 0,
    opacity: 1,
    ease: "none",
    immediateRender: false,
    scrollTrigger: { trigger: ".materials", start: "top 80%", end: "18% 52%", scrub: .65 }
  });

  gsap.fromTo(".material-one", { y: 64, rotation: -3 }, { y: -40, rotation: 1, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: .75 } });
  gsap.fromTo(".material-two", { y: 76, scale: .92 }, { y: -48, scale: 1.03, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: .75 } });
  gsap.fromTo(".material-three", { y: 60, scale: .86 }, { y: -58, scale: 1.07, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: .75 } });
  gsap.fromTo(".orbit-large", { rotation: 0, scale: 1 }, { rotation: 125, scale: 1.12, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: .7 } });
  gsap.fromTo(".orbit-small", { rotation: 0, scale: 1 }, { rotation: -165, scale: .86, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".materials", start: "top bottom", end: "bottom top", scrub: .7 } });
  gsap.fromTo(".transition-black", { scale: .08 }, { scale: 11, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".materials", start: "88% 70%", end: "bottom 8%", scrub: .5 } });

  /* OBJECT */
  const object = gsap.timeline({
    scrollTrigger: { trigger: ".object-scene", start: "top bottom", end: "bottom top", scrub: .75 }
  });

  object
    .fromTo(".object-stage", { scale: .78, rotation: -3 }, { scale: 1.05, rotation: 2, ease: "none", immediateRender: false }, 0)
    .fromTo(".oc1", { rotation: 0, scale: 1 }, { rotation: 120, scale: 1.24, ease: "none", immediateRender: false }, 0)
    .fromTo(".oc2", { rotation: 0, scale: 1 }, { rotation: -155, scale: .86, ease: "none", immediateRender: false }, 0)
    .fromTo(".oc3", { rotation: 0, scale: 1 }, { rotation: 190, scale: 1.2, ease: "none", immediateRender: false }, 0)
    .fromTo(".huge-word", { xPercent: -4 }, { xPercent: 5, ease: "none", immediateRender: false }, 0)
    .fromTo(".object-copy", { opacity: .3, x: -34 }, { opacity: 1, x: 0, ease: "none", immediateRender: false }, .1)
    .to([".object-copy", ".object-stage", ".huge-word"], { opacity: 0, duration: .08, ease: "none" }, .92)
    .fromTo(".wipe-stone", { scaleY: .02 }, { scaleY: 1, duration: .12, ease: "none", immediateRender: false }, .88);

  /* PRESENCE */
  gsap.fromTo(".photo-main img", { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".presence", start: "top bottom", end: "bottom top", scrub: .75 } });
  gsap.fromTo(".photo-detail", { y: 78 }, { y: -52, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".presence", start: "top bottom", end: "bottom top", scrub: .8 } });
  gsap.fromTo(".presence-copy", { y: 38, opacity: .35 }, { y: -4, opacity: 1, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".presence", start: "15% 78%", end: "48% 55%", scrub: .65 } });
  gsap.fromTo(".presence-word", { xPercent: 0, scale: 1 }, { xPercent: -5, scale: 1.04, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".presence", start: "top bottom", end: "bottom top", scrub: .7 } });
  gsap.fromTo(".transition-manifest", { scale: .08 }, { scale: 11, ease: "none", immediateRender: false, scrollTrigger: { trigger: ".presence", start: "90% 70%", end: "bottom 8%", scrub: .5 } });

  /* MANIFEST */
  const manifest = gsap.timeline({
    scrollTrigger: {
      trigger: ".manifesto",
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * .86, 680)}`,
      pin: true,
      scrub: .65,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  manifest
    .fromTo(".manifest-copy", { scale: .93, opacity: .72 }, { scale: 1.015, opacity: 1, duration: .6, ease: "none", immediateRender: false }, 0)
    .fromTo(".mc1", { rotation: 0, scale: 1 }, { rotation: 78, scale: 1.3, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".mc2", { rotation: 0, scale: 1 }, { rotation: -112, scale: .84, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".mc3", { rotation: 0, scale: 1 }, { rotation: 150, scale: 1.24, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".manifest-noir", { scale: 1 }, { scale: 1.1, duration: .72, ease: "none", immediateRender: false }, 0)
    .to([".manifest-copy", ".manifest-bottom", ".manifesto .chapter", ".manifest-noir"], { opacity: 0, y: -18, duration: .08, ease: "none" }, .9)
    .fromTo(".wipe-collection", { scaleY: .02 }, { scaleY: 1, duration: .1, ease: "none", immediateRender: false }, .88);

  /* COLLECTION */
  const track = document.querySelector(".collection-track");
  const mm = gsap.matchMedia();

  if (track) {
    const buildCollection = isMobile => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const travel = () => distance() + window.innerHeight * (isMobile ? .72 : .4);

      const collection = gsap.timeline({
        scrollTrigger: {
          trigger: ".collection",
          start: "top top",
          end: () => `+=${Math.max(travel(), window.innerHeight)}`,
          pin: true,
          scrub: .6,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      collection
        .fromTo(track, { x: 0 }, { x: () => -distance(), duration: 1, ease: "none", immediateRender: false }, 0)
        .to(".collection-heading", { opacity: 0, y: -24, duration: .13, ease: "none" }, .06);

      return () => {
        collection.scrollTrigger?.kill();
        collection.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    };

    mm.add("(min-width: 651px)", () => buildCollection(false));
    mm.add("(max-width: 650px)", () => buildCollection(true));
  }

  /* MIDNIGHT */
  const midnight = gsap.timeline({
    scrollTrigger: {
      trigger: ".midnight",
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * .94, 720)}`,
      pin: true,
      scrub: .65,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  midnight
    .fromTo(".midnight-title", { y: 0, scale: 1 }, { y: -30, scale: 1.02, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".sun", { x: 36, scale: .68 }, { x: -18, scale: 1.28, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".sun-frame", { rotation: 0, scale: 1 }, { rotation: 3, scale: 1.06, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".fp1", { x: 0, y: 0, rotation: -5 }, { x: 70, y: -34, rotation: -2, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".fp2", { x: 0, y: 0, rotation: 6 }, { x: -58, y: 28, rotation: 3, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".midnight-word", { xPercent: 0 }, { xPercent: -6, duration: .72, ease: "none", immediateRender: false }, 0)
    .fromTo(".wipe-atelier", { scaleY: .02 }, { scaleY: 1, duration: .12, ease: "none", immediateRender: false }, .88)
    .to([".midnight-title", ".sun", ".sun-frame", ".fp1", ".fp2", ".coordinates", ".midnight .chapter"], { opacity: 0, y: -10, duration: .08, ease: "none" }, .91);

  /* ATELIER */
  const atelier = gsap.timeline({
    scrollTrigger: {
      trigger: ".atelier",
      start: "top top",
      end: () => `+=${Math.max(window.innerHeight * .9, 720)}`,
      pin: true,
      scrub: .65,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  atelier
    .fromTo(".main-sheet", { y: 34 }, { y: -24, duration: .66, ease: "none", immediateRender: false }, 0)
    .fromTo(".small-sheet.one", { y: 26 }, { y: -42, duration: .66, ease: "none", immediateRender: false }, 0)
    .fromTo(".small-sheet.two", { y: 38 }, { y: -30, duration: .66, ease: "none", immediateRender: false }, 0)
    .fromTo(".atelier-product", { y: 32, rotation: -2 }, { y: -24, rotation: 2, duration: .67, ease: "none", immediateRender: false }, 0)
    .fromTo(".atelier-copy", { y: 18, opacity: .72 }, { y: -2, opacity: 1, duration: .52, ease: "none", immediateRender: false }, .05)
    .fromTo(".atelier-word", { xPercent: 0, scale: 1 }, { xPercent: -5, scale: 1.025, duration: .66, ease: "none", immediateRender: false }, 0)
    .fromTo(".transition-final", { scale: .08 }, { scale: 12, duration: .12, ease: "none", immediateRender: false }, .88)
    .to([".main-sheet", ".small-sheet", ".atelier-product", ".atelier-copy", ".atelier .chapter"], { opacity: 0, y: -12, duration: .08, ease: "none" }, .92);

  /* FINAL */
  const finale = gsap.timeline({
    scrollTrigger: {
      trigger: ".finale",
      start: "top 88%",
      end: "bottom top",
      scrub: .7,
      invalidateOnRefresh: true
    }
  });

  finale
    .fromTo(".final-product", { y: 46, scale: .9, rotation: -2 }, { y: -18, scale: 1.04, rotation: 1.5, ease: "none", immediateRender: false }, 0)
    .fromTo(".final-copy", { x: -34, opacity: .55 }, { x: 0, opacity: 1, ease: "none", immediateRender: false }, .08)
    .fromTo(".final-word", { scale: 1 }, { scale: 1.1, ease: "none", immediateRender: false }, 0)
    .fromTo(".final-glow", { scale: 1 }, { scale: 1.35, ease: "none", immediateRender: false }, 0)
    .fromTo(".final-axis", { scaleX: 0 }, { scaleX: 1, ease: "none", immediateRender: false }, .16);

  /* POINTER DEPTH
     Never move the perfume here; ScrollTrigger owns it. */
  if (window.matchMedia("(pointer: fine)").matches) {
    const moveAX = gsap.quickTo(".ambient-a", "x", { duration: .75, ease: "power3.out" });
    const moveAY = gsap.quickTo(".ambient-a", "y", { duration: .75, ease: "power3.out" });
    const moveBX = gsap.quickTo(".ambient-b", "x", { duration: .9, ease: "power3.out" });
    const moveBY = gsap.quickTo(".ambient-b", "y", { duration: .9, ease: "power3.out" });

    window.addEventListener("pointermove", event => {
      const nx = event.clientX / window.innerWidth - .5;
      const ny = event.clientY / window.innerHeight - .5;
      moveAX(nx * 20);
      moveAY(ny * 14);
      moveBX(nx * -16);
      moveBY(ny * -12);
    }, { passive: true });
  }

  ScrollTrigger.refresh();
  document.fonts?.ready?.then(() => ScrollTrigger.refresh());
});
