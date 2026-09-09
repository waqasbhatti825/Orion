(() => {
  const nav = document.querySelector('#nav');
  const menu = document.querySelector('.mobile-menu');
  const toggle = document.querySelector('.menu-toggle');
  const note = document.querySelector('#downloadNote');

  // Lenis smooth scrolling
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.085 });
    lenis.on('scroll', () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Navigation state
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // Smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -75 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // GSAP
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.hero-logo', { y: -8, rotation: 1, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: .85, ease: 'power3.out',
        delay: parseFloat(getComputedStyle(el).animationDelay) || 0
      });
    });

    gsap.utils.toArray('.cap-card, .step, .install-step, .timeline article').forEach((el, i) => {
      gsap.from(el, {
        y: 35, opacity: 0, duration: .75, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
        delay: (i % 5) * .04
      });
    });

    gsap.utils.toArray('.word-stack span').forEach((el, i) => {
      gsap.from(el, {
        y: 15, opacity: 0, duration: .5,
        scrollTrigger: { trigger: '.word-stack', start: 'top 82%', once: true },
        delay: i * .08
      });
    });

    gsap.to('.final-ring', {
      rotation: 360, duration: 35, repeat: -1, ease: 'none'
    });

    gsap.to('.orbit-dot', {
      motionPath: { path: '.orbit-1', align: '.orbit-1', autoRotate: false, alignOrigin: [0.5, 0.5] },
      duration: 8, repeat: -1, ease: 'none'
    });
  }

  // Terminal typewriter
  const terminal = document.querySelector('#terminalText');
  const lines = [
    ['> Initializing ORION...', false],
    ['> Loading assistant modules...', false],
    ['> Checking local environment...', false],
    ['> Voice interface ready.', true],
    ['> System ready.', true],
    ['> ORION is online.', true]
  ];
  let started = false;

  function typeTerminal() {
    if (started) return;
    started = true;
    let line = 0;
    const nextLine = () => {
      if (line >= lines.length) {
        terminal.insertAdjacentHTML('beforeend', '<span class="cursor"></span>');
        return;
      }
      const [text, ok] = lines[line];
      const row = document.createElement('div');
      if (ok) row.className = 'ok';
      terminal.appendChild(row);
      let char = 0;
      const timer = setInterval(() => {
        row.textContent = text.slice(0, ++char);
        if (char >= text.length) {
          clearInterval(timer);
          line++;
          setTimeout(nextLine, 230);
        }
      }, 24);
    };
    nextLine();
  }

  const terminalSection = document.querySelector('.terminal');
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) typeTerminal();
  }, { threshold: .35 });
  observer.observe(terminalSection);

  // Download feedback
  document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      note.textContent = 'Download started. Extract ORION.zip and run the included launcher.';
      setTimeout(() => note.textContent = 'After downloading, extract the package and run the included launcher.', 5000);
    });
  });
})();