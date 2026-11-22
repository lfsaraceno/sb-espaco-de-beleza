// Movimento do site: scroll suave (Lenis), abertura (lírio 3D ou desenhado) e cenas de scroll (GSAP).
(() => {
  const root = document.documentElement;
  const { gsap, ScrollTrigger, DrawSVGPlugin, Lenis } = window;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noGL = new URLSearchParams(location.search).has('nogl');

  // sem animação: mostra tudo parado, com o lírio em SVG
  if (reduce || !gsap || !ScrollTrigger || !DrawSVGPlugin) { root.classList.remove('js'); return; }
  window.SB_READY = true;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  if (Lenis) {
    const lenis = new Lenis({ anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const q = (s) => document.querySelector(s);
  const canvas = q('.hero-gl');
  const group = q('#lirio');

  scrollScenes();
  loadLirio3D().then(intro3D, introDesenho);

  // carrega o bundle do 3D; desiste em 3 s ou sem WebGL
  function loadLirio3D() {
    return new Promise((resolve, reject) => {
      if (noGL || !webglOK()) return reject(new Error('sem WebGL'));
      const s = document.createElement('script');
      s.src = 'assets/lirio3d.js';
      const timer = setTimeout(() => reject(new Error('3D demorou')), 3000);
      s.onload = () => {
        clearTimeout(timer);
        try {
          root.classList.add('is-3d'); // antes do start: o canvas precisa ter tamanho
          resolve(window.Lirio3D.start(canvas, group));
        } catch (e) { root.classList.remove('is-3d'); reject(e); }
      };
      s.onerror = () => { clearTimeout(timer); reject(new Error('3D não carregou')); };
      document.head.appendChild(s);
    });
  }

  function webglOK() {
    try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
  }

  function intro3D(gl) {
    const tl = gsap.timeline();
    tl.to(gl.uniforms.uProgress, { value: 1, duration: 3.4, ease: 'none' });
    revealMarca(tl);
    // a abertura se desfaz com o scroll: as partículas se espalham
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to(gl.uniforms.uScatter, { value: 1, ease: 'none' }, 0)
      .to(canvas, { yPercent: -30, autoAlpha: 0, ease: 'none' }, 0);
  }

  function introDesenho(err) {
    if (err) console.info('Lírio 3D indisponível, usando o desenho:', err.message);
    const tl = gsap.timeline();
    gsap.set('#lirio .petala, #lirio .estame', { drawSVG: '0%' });
    gsap.set('#lirio .antera ellipse', { scale: 0, transformOrigin: '50% 50%' });
    tl.set('.hero .lirio', { opacity: 1 })
      .to('#lirio .petala', { drawSVG: '100%', duration: 1.5, stagger: 0.14, ease: 'power2.inOut' })
      .to('#lirio .estame', { drawSVG: '100%', duration: 0.7, stagger: 0.07, ease: 'power2.out' }, '-=0.5')
      .to('#lirio .antera ellipse', { scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(3)' }, '-=0.3');
    revealMarca(tl);
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to('.hero .lirio', { yPercent: -40, scale: 0.6, autoAlpha: 0, ease: 'none' }, 0);
  }

  // vinho se abre do centro e o nome da marca entra
  function revealMarca(tl) {
    tl.to('.hero-bloom', { clipPath: 'circle(85% at 50% 42%)', duration: 1.8, ease: 'expo.inOut' }, '-=0.7')
      .fromTo('.marca .sb', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.9')
      .to('.marca .rule', { scaleY: 1, duration: 0.8, ease: 'expo.out' }, '-=0.8')
      .fromTo('.marca .nome', { opacity: 0, letterSpacing: '0.7em' }, { opacity: 1, letterSpacing: '0.32em', duration: 1.3, ease: 'power3.out' }, '<')
      .fromTo('.tagline', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to('.scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.4');
  }

  function scrollScenes() {
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to('.marca', { yPercent: -60, autoAlpha: 0, ease: 'none' }, 0)
      .to('.hero-bloom', { scale: 1.25, opacity: 0.35, ease: 'none' }, 0)
      .to('.scroll-hint', { autoAlpha: 0, duration: 0.1 }, 0);

    // o lírio vira o logo pequeno do topo quando a abertura sai
    ScrollTrigger.create({
      trigger: '.hero', start: 'bottom 30%',
      onEnter: () => gsap.to('.mini-logo', { opacity: 1, duration: 0.5 }),
      onLeaveBack: () => gsap.to('.mini-logo', { opacity: 0, duration: 0.3 }),
    });

    gsap.from('.historia .big', { yPercent: 30, autoAlpha: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.historia', start: 'top 70%' } });
    gsap.utils.toArray('.historia .kicker, .historia .citacao, .historia .fatos').forEach((el) =>
      gsap.from(el, { y: 40, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));

    gsap.from('.unidades .kicker, .unidades h2, .unidades .sub', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.unidades', start: 'top 75%' } });
    gsap.from('.unidade', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.lista', start: 'top 85%' } });
  }
})();
