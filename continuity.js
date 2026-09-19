window.addEventListener("load", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const layer = document.createElement("div");
  layer.className = "continuity-layer";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `<div class="continuity-wash"></div><div class="continuity-orb"></div><div class="continuity-plane"></div><div class="continuity-axis"></div>`;
  document.body.appendChild(layer);

  const wash = layer.querySelector(".continuity-wash");
  const orb = layer.querySelector(".continuity-orb");
  const plane = layer.querySelector(".continuity-plane");
  const axis = layer.querySelector(".continuity-axis");

  const bridges = [
    { trigger: "#s2", from: "#ebe4d9", to: "#68190f", shape: "circle", x: 50, y: 88, scale: 7.2 },
    { trigger: "#s3", from: "#68190f", to: "#f3eee6", shape: "plane", x: 50, y: 78, scale: 1 },
    { trigger: "#s4", from: "#f3eee6", to: "#080808", shape: "circle", x: 52, y: 72, scale: 7.6 },
    { trigger: "#s5", from: "#080808", to: "#d9d0c3", shape: "plane", x: 50, y: 76, scale: 1 },
    { trigger: "#s6", from: "#d9d0c3", to: "#68190f", shape: "circle", x: 68, y: 58, scale: 7.2 },
    { trigger: "#s7", from: "#68190f", to: "#f3eee6", shape: "plane", x: 50, y: 76, scale: 1 },
    { trigger: "#s8", from: "#b06c1b", to: "#d08920", shape: "gold", x: 72, y: 54, scale: 3 },
    { trigger: "#s9", from: "#d08920", to: "#d7cdbf", shape: "paper", x: 70, y: 53, scale: 3.3 },
    { trigger: "#s10", from: "#d7cdbf", to: "#100403", shape: "circle", x: 68, y: 48, scale: 7.2 }
  ];

  const resetShape = config => {
    gsap.set(layer, { autoAlpha: 1 });
    gsap.set(wash, { opacity: 0, backgroundColor: config.from });
    gsap.set([orb, plane, axis], { opacity: 0 });
    gsap.set(orb, {
      left: `${config.x}%`,
      top: `${config.y}%`,
      width: config.shape === "paper" ? "22vw" : "24vmax",
      height: config.shape === "paper" ? "30vh" : "24vmax",
      borderRadius: config.shape === "paper" ? "8px" : "50%",
      backgroundColor: config.to,
      scale: config.shape === "gold" ? .34 : .12,
      rotation: config.shape === "paper" ? -8 : 0
    });
    gsap.set(plane, { backgroundColor: config.to, scaleY: .05, opacity: 0 });
    gsap.set(axis, { opacity: 0, scaleY: .3 });
  };

  bridges.forEach(config => {
    const scene = document.querySelector(config.trigger);
    if (!scene) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: "top 106%",
        end: "top 52%",
        scrub: .34,
        invalidateOnRefresh: true,
        onLeave: () => gsap.set(layer, { autoAlpha: 0 }),
        onLeaveBack: () => gsap.set(layer, { autoAlpha: 0 })
      }
    });

    timeline.call(() => resetShape(config), null, 0)
      .fromTo(wash,
        { opacity: 0, backgroundColor: config.from },
        { opacity: .22, backgroundColor: config.to, duration: .58, ease: "none", immediateRender: false }, 0);

    if (config.shape === "plane") {
      timeline.fromTo(plane,
        { opacity: 0, scaleY: .05 },
        { opacity: .72, scaleY: 1.42, duration: .7, ease: "none", immediateRender: false }, .02);
    } else {
      timeline.fromTo(orb,
        { opacity: 0, scale: config.shape === "gold" ? .34 : .12 },
        { opacity: config.shape === "gold" ? .76 : .82, scale: config.scale, borderRadius: config.shape === "paper" ? "2px" : "50%", rotation: 0, duration: .7, ease: "none", immediateRender: false }, .02);
    }

    timeline.fromTo(axis,
      { opacity: 0, scaleY: .3 },
      { opacity: .12, scaleY: 1, duration: .4, ease: "none", immediateRender: false }, .1)
      .to([wash, orb, plane, axis], { opacity: 0, duration: .2, ease: "none" }, .7)
      .to(layer, { autoAlpha: 0, duration: .01 }, .99);
  });

  ScrollTrigger.refresh();
});
