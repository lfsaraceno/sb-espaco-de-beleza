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
    // chevron da abertura: rolagem lenta, para a cena do lírio acompanhar como num scroll de verdade
    document.querySelector('.scroll-hint')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // o Lenis (anchors) não pega este clique
      lenis.scrollTo('#historia', { duration: 2.4, easing: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2) });
    });
    gsap.ticker.lagSmoothing(0);
  }

  const q = (s) => document.querySelector(s);
  const canvas = q('.hero-gl');
  const group = q('#lirio');
  const hero = q('.hero'), fig = q('.hero-figura'), lirio = q('.hero .lirio'), bloom = q('.hero-bloom');

  // a abertura começa com lírio e marca no centro; depois eles vão para o lugar e o texto entra
  const bloomEm = () => {
    const h = hero.getBoundingClientRect(), r = lirio.getBoundingClientRect();
    return { '--bx': ((r.left + r.width / 2 - h.left) / h.width) * 100 + '%', '--by': ((r.top + r.height / 2 - h.top) / h.height) * 100 + '%' };
  };
  const bloomFinal = bloomEm();
  const h0 = hero.getBoundingClientRect(), f0 = fig.getBoundingClientRect();
  gsap.set(fig, { x: h0.left + h0.width / 2 - (f0.left + f0.width / 2), y: h0.top + h0.height / 2 - (f0.top + f0.height / 2) });
  gsap.set(bloom, bloomEm());
  gsap.set('.hero-texto > *', { y: 24 });

  scrollScenes();
  carrossel();
  loadLirio3D().then(intro3D, introDesenho);

  // carrega o bundle do 3D; desiste em 3 s ou sem WebGL
  function loadLirio3D() {
    return new Promise((resolve, reject) => {
      if (noGL || !webglOK()) return reject(new Error('sem WebGL'));
      const s = document.createElement('script');
      s.src = 'assets/lirio3d.js';
      let late = false; // se o 3D chegar depois do prazo, o lírio desenhado já está na tela: ignora
      const timer = setTimeout(() => { late = true; reject(new Error('3D demorou')); }, 3000);
      s.onload = () => {
        clearTimeout(timer);
        if (late) return;
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
      .to(canvas, { autoAlpha: 0, ease: 'none' }, 0);
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
      .to('.hero .lirio', { scale: 0.7, autoAlpha: 0, ease: 'none' }, 0);
  }

  // vinho se abre do centro e o nome da marca entra
  function revealMarca(tl) {
    tl.to('.hero-bloom', { clipPath: 'circle(85% at 50% 42%)', duration: 1.8, ease: 'expo.inOut' }, '-=0.7')
      .fromTo('.marca .sb', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, '-=0.9')
      .to('.marca .rule', { scaleY: 1, duration: 0.8, ease: 'expo.out' }, '-=0.8')
      .fromTo('.marca .nome', { opacity: 0, letterSpacing: '0.7em' }, { opacity: 1, letterSpacing: '0.32em', duration: 1.3, ease: 'power3.out' }, '<')
      // pronta a marca, espera 2 s e abre espaço para o texto
      .to(fig, { x: 0, y: 0, duration: 1.6, ease: 'expo.inOut' }, '+=2')
      .to(bloom, { ...bloomFinal, duration: 1.6, ease: 'expo.inOut' }, '<')
      .to('.hero-texto > *', { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, '<0.8')
      .to('.scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.4');
  }

  // fotos vêm de trás, ficam nítidas no centro e voltam; troca sozinho a cada 3 s
  function carrossel() {
    const box = q('.carrossel');
    const slides = [...box.querySelectorAll('.slide')], n = slides.length;
    const atual = box.querySelector('.atual'), pausa = box.querySelector('.pausa');
    // roda sempre que está na tela; só o botão "Pausar" para (é o controle de pausa da WCAG 2.2.2)
    let i = 0, timer, pausado = false, visivel = false, x0 = null, arrastou = false;
    box.classList.add('vivo');

    const mostrar = (k) => {
      i = (k + n) % n;
      slides.forEach((s, j) => {
        let d = j - i;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        s.style.setProperty('--d', d);
        s.style.setProperty('--ad', Math.abs(d));
        s.classList.toggle('ativo', d === 0);
        s.setAttribute('aria-hidden', String(d !== 0));
        const a = s.querySelector('a'); // HTML antigo em cache pode vir sem o link
        if (a) a.tabIndex = d === 0 ? 0 : -1; // Tab só alcança o post do centro
      });
      atual.textContent = String(i + 1);
    };
    const tocar = () => {
      clearInterval(timer);
      if (!pausado && visivel) timer = setInterval(() => mostrar(i + 1), 3000);
    };
    const ir = (k) => { mostrar(k); tocar(); };

    box.addEventListener('click', (e) => {
      const s = e.target.closest('.slide');
      // card do lado ou arrasto: só gira o carrossel; o post abre só no card do centro
      if (arrastou || (s && !s.classList.contains('ativo'))) e.preventDefault();
      if (arrastou) return;
      const b = e.target.closest('[data-ir]');
      if (b) return ir(i + Number(b.dataset.ir));
      if (s && !s.classList.contains('ativo')) ir(slides.indexOf(s));
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') ir(i + 1);
      if (e.key === 'ArrowLeft') ir(i - 1);
    });
    pausa.addEventListener('click', () => {
      pausado = !pausado;
      pausa.setAttribute('aria-pressed', String(pausado));
      pausa.textContent = pausado ? 'Continuar' : 'Pausar';
      tocar();
    });
    // arrastar para os lados no celular
    const palco = box.querySelector('.palco');
    palco.addEventListener('pointerdown', (e) => { x0 = e.clientX; arrastou = false; });
    palco.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) { arrastou = true; ir(i + (dx < 0 ? 1 : -1)); setTimeout(() => { arrastou = false; }, 0); }
    });
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; tocar(); }).observe(box);
    mostrar(0);
  }

  function scrollScenes() {
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 } })
      .to('.hero-figura, .hero-texto', { yPercent: -18, opacity: 0, ease: 'none' }, 0)
      .to('.hero-bloom', { scale: 1.25, opacity: 0.35, ease: 'none' }, 0)
      .to('.scroll-hint', { autoAlpha: 0, duration: 0.1 }, 0);

    // o lírio vira o logo pequeno do topo quando a abertura sai; o botão do topo entra junto
    ScrollTrigger.create({
      trigger: '.hero', start: 'bottom 30%', end: 'max',
      toggleClass: { targets: '.topbar', className: 'solid' },
      onEnter: () => gsap.to('.mini-logo, .topbar .cta', { autoAlpha: 1, duration: 0.5 }),
      onLeaveBack: () => gsap.to('.mini-logo, .topbar .cta', { autoAlpha: 0, duration: 0.3 }),
    });

    gsap.from('.historia .big', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.historia', start: 'top 70%' } });
    gsap.utils.toArray('.historia .kicker, .historia .citacao, .historia .fatos').forEach((el) =>
      gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));

    gsap.from('.trabalhos-topo > *', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.trabalhos', start: 'top 75%' } });
    gsap.from('.carrossel', { y: 60, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.carrossel', start: 'top 85%' } });

    gsap.from('.unidades .kicker, .unidades h2, .unidades .sub', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.unidades', start: 'top 75%' } });
    // cada unidade entra quando chega na tela: a fachada abre como cortina e o texto sobe
    gsap.utils.toArray('.unidade').forEach((row) => {
      gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 82%' } })
        .from(row.querySelector('.foto'), { clipPath: 'inset(0 100% 0 0)', scale: 1.12, duration: 1.3, ease: 'expo.out' })
        .from(row.querySelectorAll('.info > *'), { y: 28, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.25);
    });
  }
})();
