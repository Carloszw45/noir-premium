(() => {
  window.addEventListener("load", () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const hero = document.querySelector(".hero");
    if (!hero) return;

    const heroTrigger = ScrollTrigger.getAll().find(trigger => {
      return trigger.trigger === hero && trigger.vars && trigger.vars.pin && trigger.animation;
    });

    if (!heroTrigger || !heroTrigger.animation) return;

    const timeline = heroTrigger.animation;

    // Rebuild only the hero scroll choreography with explicit start states.
    // This removes the cached invisible intro state and overlapping product tweens
    // that caused snapping when the user reversed scroll direction.
    timeline.clear();

    timeline
      .fromTo(
        ".hero-product",
        { opacity: 1, yPercent: 0, scale: 1, rotation: 0 },
        { opacity: 1, yPercent: 9, scale: 1.24, rotation: 0, duration: .62, ease: "none", immediateRender: false },
        0
      )
      .fromTo(
        ".hero-title",
        { yPercent: 0, scale: 1 },
        { yPercent: -6, scale: 1.1, duration: .66, ease: "none", immediateRender: false },
        0
      )
      .fromTo(
        ".hero-copy",
        { x: 0, opacity: 1 },
        { x: -72, opacity: 0, duration: .26, ease: "none", immediateRender: false },
        .46
      )
      .fromTo(
        ".hero-notes",
        { x: 0, opacity: 1 },
        { x: 72, opacity: 0, duration: .26, ease: "none", immediateRender: false },
        .46
      )
      .fromTo(
        ".hero-bottom",
        { y: 0, opacity: 1 },
        { y: 18, opacity: 0, duration: .24, ease: "none", immediateRender: false },
        .5
      )
      .fromTo(
        ".hero .chapter",
        { opacity: 1 },
        { opacity: 0, duration: .2, ease: "none", immediateRender: false },
        .54
      )
      .to(
        ".hero-product",
        { yPercent: 27, scale: 1.13, rotation: 1.2, duration: .2, ease: "none" },
        .62
      )
      .fromTo(
        ".transition-red",
        { scale: 1 },
        { scale: 12, duration: .24, ease: "none", immediateRender: false },
        .72
      )
      .to(
        ".hero-product",
        { opacity: .18, yPercent: 46, scale: 1.07, rotation: 1.8, duration: .18, ease: "none" },
        .82
      );

    timeline.invalidate();
    timeline.progress(heroTrigger.progress, false);

    // Numeric scrub is useful, but 1.15s was visibly laggy when reversing direction.
    // Tune the scrub tween whenever GSAP creates/refreshes it.
    const tuneScrub = () => {
      const scrubTween = heroTrigger.getTween && heroTrigger.getTween();
      if (scrubTween) scrubTween.duration(.52);
    };

    tuneScrub();
    ScrollTrigger.addEventListener("refresh", tuneScrub);
    window.addEventListener("scroll", tuneScrub, { passive: true });

    // Keep exact visual base state at the top without a hard reset animation.
    const syncTop = () => {
      if (window.scrollY > 1) return;
      timeline.progress(0, false);
      gsap.set(".hero-product", { opacity: 1, yPercent: 0, scale: 1, rotation: 0 });
      gsap.set(".hero-copy", { opacity: 1, x: 0 });
      gsap.set(".hero-notes", { opacity: 1, x: 0 });
      gsap.set(".hero-bottom", { opacity: 1, y: 0 });
      gsap.set(".hero .chapter", { opacity: 1 });
      gsap.set(".hero-title", { yPercent: 0, scale: 1 });
      gsap.set(".transition-red", { scale: 1 });
    };

    window.addEventListener("scrollend", syncTop, { passive: true });
    window.addEventListener("pageshow", syncTop);
  });
})();
