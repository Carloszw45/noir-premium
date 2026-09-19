window.addEventListener("load",()=>{
  if(typeof gsap==="undefined"||typeof ScrollTrigger==="undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduceMotion) return;

  const intro=gsap.timeline({defaults:{ease:"power4.out"}});
  intro
    .from(".nav",{opacity:0,y:-25,duration:1})
    .from(".hero .chapter",{opacity:0,y:18,duration:.8},"-=.65")
    .from(".hero-title span",{opacity:0,yPercent:120,duration:1.35,stagger:.07},"-=.65")
    .from(".hero-product",{opacity:0,y:100,scale:.7,duration:1.5,ease:"expo.out"},"-=1")
    .from(".hero-copy",{opacity:0,x:-45,duration:.9},"-=.8")
    .from(".hero-notes",{opacity:0,x:45,duration:.9},"-=.85")
    .from(".hero-bottom",{opacity:0,y:20,duration:.8},"-=.7");

  const hero=gsap.timeline({scrollTrigger:{trigger:".hero",start:"top top",end:"+=130%",pin:true,scrub:1.2,anticipatePin:1}});
  hero
    .to(".hero-product",{scale:1.4,yPercent:12,ease:"none"},0)
    .to(".hero-title",{scale:1.18,yPercent:-10,ease:"none"},0)
    .to(".hero-copy",{x:-120,opacity:0,ease:"none"},.08)
    .to(".hero-notes",{x:120,opacity:0,ease:"none"},.08)
    .to(".hero-bottom",{y:25,opacity:0,ease:"none"},.12)
    .to(".hero .chapter",{opacity:0,ease:"none"},.15)
    .to(".transition-red",{scale:12,ease:"none"},.43)
    .to(".hero-product",{yPercent:70,scale:.82,rotation:4,ease:"none"},.56);

  gsap.fromTo(".progress-line i",{scaleX:0},{scaleX:1,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"+=130%",scrub:true}});

  const night=gsap.timeline({scrollTrigger:{trigger:".night",start:"top top",end:"+=105%",pin:true,scrub:1.15,anticipatePin:1}});
  night
    .fromTo(".night-title",{yPercent:15,opacity:.35},{yPercent:-4,opacity:1,ease:"none"},0)
    .fromTo(".night-product",{yPercent:20,scale:.78,rotation:-3},{yPercent:-10,scale:1.05,rotation:3,ease:"none"},0)
    .fromTo(".night-text",{y:40,opacity:0},{y:0,opacity:1,ease:"none"},.12)
    .to(".night-circle",{rotation:150,scale:1.45,ease:"none"},0)
    .to(".night-title",{yPercent:-15,scale:1.05,ease:"none"},.5)
    .to(".night-product",{xPercent:-20,yPercent:14,scale:1.2,ease:"none"},.5)
    .to(".wipe-cream",{scaleY:1,ease:"none"},.76);

  gsap.from(".materials-title",{y:70,opacity:0,scrollTrigger:{trigger:".materials",start:"top 75%",end:"22% 50%",scrub:1}});
  gsap.fromTo(".material-one",{y:100,rotation:-3},{y:-65,rotation:1,ease:"none",scrollTrigger:{trigger:".materials",start:"top bottom",end:"bottom top",scrub:1.15}});
  gsap.fromTo(".material-two",{y:125,scale:.85},{y:-80,scale:1.05,ease:"none",scrollTrigger:{trigger:".materials",start:"top bottom",end:"bottom top",scrub:1.15}});
  gsap.fromTo(".material-three",{y:90,scale:.78},{y:-100,scale:1.12,ease:"none",scrollTrigger:{trigger:".materials",start:"top bottom",end:"bottom top",scrub:1.15}});
  gsap.to(".orbit-large",{rotation:130,scale:1.18,ease:"none",scrollTrigger:{trigger:".materials",start:"top bottom",end:"bottom top",scrub:true}});
  gsap.to(".orbit-small",{rotation:-190,scale:.78,ease:"none",scrollTrigger:{trigger:".materials",start:"top bottom",end:"bottom top",scrub:true}});
  gsap.to(".transition-black",{scale:11,ease:"none",scrollTrigger:{trigger:".materials",start:"72% 70%",end:"bottom top",scrub:1}});

  const object=gsap.timeline({scrollTrigger:{trigger:".object-scene",start:"top bottom",end:"bottom top",scrub:1.15}});
  object
    .fromTo(".object-stage",{scale:.62,rotation:-7},{scale:1.13,rotation:4,ease:"none"},0)
    .to(".oc1",{rotation:140,scale:1.34,ease:"none"},0)
    .to(".oc2",{rotation:-180,scale:.78,ease:"none"},0)
    .to(".oc3",{rotation:220,scale:1.3,ease:"none"},0)
    .fromTo(".huge-word",{xPercent:-7},{xPercent:7,ease:"none"},0)
    .fromTo(".object-copy",{opacity:0,x:-70},{opacity:1,x:0,ease:"none"},.15)
    .to(".wipe-stone",{scaleY:1,ease:"none"},.82);

  gsap.fromTo(".photo-main img",{yPercent:-7,scale:1.15},{yPercent:7,scale:1,ease:"none",scrollTrigger:{trigger:".presence",start:"top bottom",end:"bottom top",scrub:1.15}});
  gsap.fromTo(".photo-detail",{y:110},{y:-75,ease:"none",scrollTrigger:{trigger:".presence",start:"top bottom",end:"bottom top",scrub:1.2}});
  gsap.fromTo(".presence-copy",{y:70,opacity:0},{y:-10,opacity:1,ease:"none",scrollTrigger:{trigger:".presence",start:"18% 75%",end:"55% 55%",scrub:1}});
  gsap.to(".presence-word",{xPercent:-7,scale:1.06,ease:"none",scrollTrigger:{trigger:".presence",start:"top bottom",end:"bottom top",scrub:true}});
  gsap.to(".transition-manifest",{scale:11,ease:"none",scrollTrigger:{trigger:".presence",start:"75% 70%",end:"bottom top",scrub:1}});

  const manifest=gsap.timeline({scrollTrigger:{trigger:".manifesto",start:"top bottom",end:"bottom top",scrub:1.15}});
  manifest
    .fromTo(".manifest-copy",{scale:.78,opacity:.2},{scale:1.06,opacity:1,ease:"none"},0)
    .to(".mc1",{rotation:90,scale:1.4,ease:"none"},0)
    .to(".mc2",{rotation:-130,scale:.76,ease:"none"},0)
    .to(".mc3",{rotation:170,scale:1.35,ease:"none"},0)
    .to(".manifest-noir",{scale:1.16,ease:"none"},0)
    .to(".wipe-collection",{scaleY:1,ease:"none"},.82);

  const track=document.querySelector(".collection-track");
  const mm=gsap.matchMedia();

  mm.add("(min-width:651px)",()=>{
    const distance=()=>track.scrollWidth-window.innerWidth;
    const collectionTween=gsap.to(track,{x:()=>-distance(),ease:"none",scrollTrigger:{trigger:".collection",start:"top top",end:()=>`+=${distance()}`,pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
    gsap.to(".collection-heading",{opacity:0,y:-35,ease:"none",scrollTrigger:{trigger:".collection",start:"top top",end:"+=45%",scrub:true}});
    return()=>collectionTween.kill();
  });

  mm.add("(max-width:650px)",()=>{
    gsap.to(track,{x:()=>-(track.scrollWidth-window.innerWidth),ease:"none",scrollTrigger:{trigger:".collection",start:"top top",end:"+=1900",pin:true,scrub:1,anticipatePin:1}});
    gsap.to(".collection-heading",{opacity:0,y:-25,ease:"none",scrollTrigger:{trigger:".collection",start:"top top",end:"+=350",scrub:true}});
  });

  const midnight=gsap.timeline({scrollTrigger:{trigger:".midnight",start:"top top",end:"+=100%",pin:true,scrub:1.15,anticipatePin:1}});
  midnight
    .fromTo(".midnight-title",{y:80,opacity:.2},{y:-25,opacity:1,ease:"none"},0)
    .fromTo(".sun",{scale:.42,xPercent:45},{scale:1.5,xPercent:-12,ease:"none"},0)
    .to(".sun-frame",{rotation:5,scale:1.1,ease:"none"},0)
    .to(".fp1",{xPercent:45,yPercent:-35,rotation:3,ease:"none"},0)
    .to(".fp2",{xPercent:-50,yPercent:30,rotation:-4,ease:"none"},0)
    .to(".midnight-word",{xPercent:-8,ease:"none"},0)
    .to(".wipe-atelier",{scaleY:1,ease:"none"},.78);

  const atelier=gsap.timeline({scrollTrigger:{trigger:".atelier",start:"top bottom",end:"bottom top",scrub:1.15}});
  atelier
    .fromTo(".main-sheet",{y:100,rotation:-4},{y:-55,rotation:1,ease:"none"},0)
    .fromTo(".small-sheet.one",{y:65},{y:-90,rotation:13,ease:"none"},0)
    .fromTo(".small-sheet.two",{y:100},{y:-60,rotation:-5,ease:"none"},0)
    .fromTo(".atelier-product",{y:90,rotation:-4},{y:-55,rotation:4,ease:"none"},0)
    .fromTo(".atelier-copy",{y:45,opacity:.2},{y:-5,opacity:1,ease:"none"},.1)
    .to(".atelier-word",{xPercent:-7,scale:1.04,ease:"none"},0);

  gsap.to(".transition-final",{scale:12,ease:"none",scrollTrigger:{trigger:".atelier",start:"78% 70%",end:"bottom top",scrub:1}});

  const finale=gsap.timeline({scrollTrigger:{trigger:".finale",start:"top bottom",end:"bottom top",scrub:1.15}});
  finale
    .fromTo(".final-product",{yPercent:26,scale:.72,rotation:-4},{yPercent:-10,scale:1.06,rotation:2,ease:"none"},0)
    .fromTo(".final-copy",{x:-70,opacity:.15},{x:0,opacity:1,ease:"none"},.12)
    .to(".final-word",{scale:1.16,ease:"none"},0)
    .to(".final-glow",{scale:1.55,ease:"none"},0)
    .fromTo(".final-axis",{scaleX:0},{scaleX:1,ease:"none"},.2);

  if(window.matchMedia("(pointer:fine)").matches){
    const product=document.querySelector(".hero-product");
    window.addEventListener("pointermove",event=>{
      const x=(event.clientX/window.innerWidth-.5)*14;
      const y=(event.clientY/window.innerHeight-.5)*9;
      gsap.to(product,{x,y,duration:1.2,ease:"power3.out"});
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener("click",event=>{
      const target=document.querySelector(link.getAttribute("href"));
      if(!target) return;
      event.preventDefault();
      target.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });

  ScrollTrigger.refresh();
});
