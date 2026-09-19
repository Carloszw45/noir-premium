(() => {
  window.addEventListener("load", () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const hero = document.querySelector(".hero");
    if (!hero) return;

    const selectors = [
      ".hero-product",
      ".hero-copy",
      ".hero-notes",
      ".hero-bottom",
      ".hero .chapter",
      ".hero-title",
      ".transition-red"
    ];

    let leftHero = false;
    let repairing = false;

    const getHeroTrigger = () => ScrollTrigger.getAll().find(trigger => {
      return trigger.trigger === hero && trigger.vars && trigger.vars.pin;
    });

    const restoreHeroBaseState = () => {
      selectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) return;
        gsap.set(element, { clearProps: "transform,opacity" });
      });

      const heroTrigger = getHeroTrigger();
      if (heroTrigger && heroTrigger.animation) {
        heroTrigger.animation.invalidate();
        heroTrigger.animation.progress(0);
      }

      ScrollTrigger.update();
    };

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 1.05) {
        leftHero = true;
      }

      if (!leftHero || repairing || window.scrollY > 2) return;

      repairing = true;
      requestAnimationFrame(() => {
        restoreHeroBaseState();
        leftHero = false;
        repairing = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pageshow", () => {
      if (window.scrollY === 0 && leftHero) restoreHeroBaseState();
    });
  });
})();
