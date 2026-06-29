(() => {
  'use strict';

  const CONFIG = {
    recipientName: 'Isha Ishrat',
    targetPakistanTimeLabel: '30 June 2026 · 12:00:01 AM Pakistan Standard Time',
    targetUtcTimestamp: Date.UTC(2026, 5, 28, 19, 0, 1, 0),
    birthdayLetter: `Dear Isha,

Happy Birthday, Alhamdulillah for another year of your life. May Allah bless you with a long life filled with iman, taqwa, barakah, good health, halal rizq, and endless happiness.

May Allah forgive your shortcomings, accept your duas, protect you from every hardship, and guide you to what is best in this life and the Hereafter. May He grant you success in all your goals, keep your heart at peace, surround you with sincere people, and make you among those who earn His mercy and Jannah.

May every new year of your life bring you closer to Allah, increase you in wisdom and gratitude, and fill your days with love, joy, and beautiful memories.

Happy Birthday once again!

May Allah bless you always. Ameen. 🤍

With lots of duas and warm wishes,
From ...`,
  };

  const PERF = (() => {
    const dpr = window.devicePixelRatio || 1;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.innerWidth < 760;
    const lowCpu = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
    const touchDevice = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const fast = true;

    return {
      fast,
      reducedMotion,
      pixelRatio: fast ? Math.min(dpr, 1) : Math.min(dpr, 1.35),
      starCount: fast ? 620 : 1350,
      distantStarCount: fast ? 220 : 520,
      nebulaCount: fast ? 95 : 220,
      crystalCount: fast ? 6 : 12,
      frameInterval: fast ? 1000 / 24 : 1000 / 36,
      cursorGlow: !fast && !(window.matchMedia && window.matchMedia('(pointer: coarse)').matches),
    };
  })();

  document.documentElement.classList.add('performance-mode');

  const state = {
    unlocked: false,
    typewriterStarted: false,
    sceneReady: false,
    cursor: { x: 0, y: 0, targetX: -1000, targetY: -1000 },
    parallax: { x: 0, y: 0, targetX: 0, targetY: 0 },
    pageVisible: true,
    effectsReduced: true,
  };

  const els = {};
  let fx;
  let threeScene;

  document.addEventListener('DOMContentLoaded', () => {
    if (window.gsap && PERF.fast) gsap.ticker.fps(28);
    cacheElements();
    initPreloader();
    initVisibilityPause();
    if (PERF.cursorGlow) initCursorGlow();
    initCanvasEffects();
    initThreeExperience();
    initCountdown();
    initScrollReveal();
  });

  function cacheElements() {
    els.body = document.body;
    els.preloader = document.getElementById('preloader');
    els.progressBar = document.getElementById('progressBar');
    els.progressText = document.getElementById('progressText');
    els.countdownSection = document.getElementById('countdownSection');
    els.momentSection = document.getElementById('momentSection');
    els.days = document.getElementById('days');
    els.hours = document.getElementById('hours');
    els.minutes = document.getElementById('minutes');
    els.seconds = document.getElementById('seconds');
    els.milliseconds = document.getElementById('milliseconds');
    els.webglCanvas = document.getElementById('webgl-background');
    els.fxCanvas = document.getElementById('fx-canvas');
    els.cursorGlow = document.getElementById('cursorGlow');
    els.toast = document.getElementById('toast');
    els.typewriterText = document.getElementById('typewriterText');
    els.cssGift = document.getElementById('cssGift');
    els.finalMessage = document.getElementById('finalMessage');
  }

  function initPreloader() {
    const start = performance.now();
    const minimumDuration = 1200;
    let loaded = false;
    let progress = 0;

    window.addEventListener('load', () => {
      loaded = true;
    });

    const timer = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const softTarget = loaded && elapsed > minimumDuration ? 100 : Math.min(96, progress + 6 + Math.random() * 11);
      progress = Math.min(100, softTarget);
      els.progressBar.style.width = `${progress}%`;
      els.progressText.textContent = `${Math.round(progress)}%`;

      if (progress >= 100) {
        window.clearInterval(timer);
        hidePreloader();
      }
    }, 90);

    window.setTimeout(() => {
      loaded = true;
    }, 1600);
  }

  function hidePreloader() {
    if (window.gsap) {
      gsap.to(els.preloader, {
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => els.preloader.classList.add('hidden'),
      });
    } else {
      els.preloader.classList.add('hidden');
      els.preloader.style.display = 'none';
    }
  }

  function initVisibilityPause() {
    const apply = () => {
      state.pageVisible = !document.hidden;
      if (fx && typeof fx.setPaused === 'function') fx.setPaused(!state.pageVisible);
    };
    document.addEventListener('visibilitychange', apply, { passive: true });
    apply();
  }

  function initCursorGlow() {
    const updatePointer = (x, y) => {
      state.cursor.targetX = x;
      state.cursor.targetY = y;
      if (els.cursorGlow) els.cursorGlow.style.opacity = '1';
    };

    window.addEventListener('mousemove', (event) => updatePointer(event.clientX, event.clientY), { passive: true });
    window.addEventListener('touchmove', (event) => {
      const touch = event.touches[0];
      if (touch) updatePointer(touch.clientX, touch.clientY);
    }, { passive: true });

    const render = () => {
      state.cursor.x += (state.cursor.targetX - state.cursor.x) * 0.16;
      state.cursor.y += (state.cursor.targetY - state.cursor.y) * 0.16;
      if (els.cursorGlow && state.pageVisible) {
        els.cursorGlow.style.transform = `translate3d(${state.cursor.x}px, ${state.cursor.y}px, 0)`;
      }
      requestAnimationFrame(render);
    };
    render();
  }

  function initCanvasEffects() {
    if (!window.CelebrationFX) return;
    fx = new window.CelebrationFX(els.fxCanvas, { fast: PERF.fast });
    if (typeof fx.setReduced === 'function') fx.setReduced(state.effectsReduced);
    fx.start();
  }

  function initCountdown() {
    const tick = () => {
      const now = Date.now();
      const diff = CONFIG.targetUtcTimestamp - now;

      if (diff <= 0) {
        updateCountdownDisplay(0);
        if (!state.unlocked) unlockBirthdayExperience();
        return;
      }

      updateCountdownDisplay(diff);
      window.setTimeout(tick, PERF.fast ? 80 : 45);
    };
    tick();
  }

  function updateCountdownDisplay(diff) {
    const day = 86_400_000;
    const hour = 3_600_000;
    const minute = 60_000;
    const second = 1_000;

    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const minutes = Math.floor((diff % hour) / minute);
    const seconds = Math.floor((diff % minute) / second);
    const milliseconds = Math.floor(diff % second);

    setTextWithPop(els.days, pad(days, 2));
    setTextWithPop(els.hours, pad(hours, 2));
    setTextWithPop(els.minutes, pad(minutes, 2));
    setTextWithPop(els.seconds, pad(seconds, 2));
    els.milliseconds.textContent = pad(milliseconds, 3);
  }

  function setTextWithPop(element, value) {
    if (element.textContent === value) return;
    element.textContent = value;
    if (window.gsap) {
      gsap.fromTo(element, { y: 9, scale: 0.96, opacity: 0.75 }, { y: 0, scale: 1, opacity: 1, duration: 0.28, ease: 'power2.out' });
    }
  }

  function pad(value, length) {
    return String(Math.max(0, value)).padStart(length, '0');
  }

  async function unlockBirthdayExperience() {
    state.unlocked = true;
    els.body.classList.add('unlocked');

    if (fx) fx.startCelebration();
    revealThreeObjects();

    const reveal = () => {
      els.momentSection.classList.remove('hidden');
      els.momentSection.classList.add('visible');
      startTypewriterLetter();
      animateFinalGift();
      revealScrollItems();
      showToast('Happy Birthday Isha Ishrat! The wish is unlocked ✨');
    };

    if (window.gsap) {
      gsap.timeline()
        .to(els.countdownSection, { autoAlpha: 0, y: -26, scale: 0.96, duration: 0.9, ease: 'power3.inOut' })
        .set(els.countdownSection, { display: 'none' })
        .add(reveal)
        .fromTo(els.momentSection, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'power2.out' })
        .fromTo('.birthday-heading span', { filter: 'blur(16px)', y: 18, opacity: 0 }, { filter: 'blur(0px)', y: 0, opacity: 1, duration: 1.15, ease: 'power3.out' }, '-=0.38');
    } else {
      els.countdownSection.style.display = 'none';
      reveal();
    }
  }

  function startTypewriterLetter() {
    if (state.typewriterStarted) return;
    state.typewriterStarted = true;
    const text = CONFIG.birthdayLetter;
    let index = 0;
    const type = () => {
      if (index > text.length) return;
      const step = PERF.fast ? 3 : 1;
      els.typewriterText.textContent = text.slice(0, index);
      index += step;
      const current = text[index - 1];
      const delay = PERF.fast ? 18 : (current === '\n' ? 260 : current === '.' || current === ',' ? 58 : 21 + Math.random() * 22);
      window.setTimeout(type, delay);
    };
    window.setTimeout(type, 900);
  }

  function animateFinalGift() {
    if (!window.gsap) {
      els.finalMessage.style.opacity = '1';
      return;
    }

    gsap.set('.gift-lid', { xPercent: -50, transformOrigin: '50% 100%' });
    gsap.set('.gift-box', { xPercent: -50 });
    gsap.set('.gift-ribbon-v', { xPercent: -50 });
    gsap.set('.gift-ribbon-h', { xPercent: -50 });

    gsap.timeline({ delay: 5.5 })
      .to(els.cssGift, { rotateY: 10, rotateX: -5, duration: 0.8, ease: 'sine.inOut' })
      .to('.gift-lid', { y: -78, rotation: -8, rotationX: -68, duration: 1.1, ease: 'back.out(1.7)' })
      .to('.gift-ribbon-h', { scaleX: 0.82, opacity: 0.7, duration: 0.5, ease: 'power2.out' }, '-=0.9')
      .to('.gift-glow', { scale: 1.7, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.7')
      .to(els.finalMessage, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.25');
  }

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (window.gsap) {
          gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        } else {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal-item').forEach((item) => observer.observe(item));
  }

  function revealScrollItems() {
    if (!window.gsap) {
      document.querySelectorAll('.reveal-item').forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      });
      return;
    }
    gsap.to('.reveal-item', {
      opacity: 1,
      y: 0,
      duration: 0.95,
      stagger: 0.14,
      ease: 'power3.out',
      delay: 0.15,
    });
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => els.toast.classList.remove('show'), 4200);
  }

  function initThreeExperience() {
    if (!window.THREE) {
      showToast('Three.js could not load. The page will still show the birthday design, but WebGL objects are unavailable.');
      return;
    }

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 150);
    const renderer = new THREE.WebGLRenderer({ canvas: els.webglCanvas, antialias: !PERF.fast, alpha: true, powerPreference: PERF.fast ? 'low-power' : 'high-performance' });
    renderer.setPixelRatio(PERF.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    camera.position.set(0, 1.1, window.innerWidth < 760 ? 10.4 : 8.3);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xff7be8, 2.2, 35);
    keyLight.position.set(-3.8, 4.8, 5.2);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x69ddff, 1.6, 38);
    rimLight.position.set(4.2, 3.2, -2.4);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xffd76d, 2.1, 28);
    goldLight.position.set(0.2, 2.7, 3.4);
    scene.add(goldLight);

    const starField = createStarField(THREE, PERF.starCount, 46, 0xffffff, 0.78, PERF.fast ? 0.028 : 0.02);
    scene.add(starField);

    const distantStars = createStarField(THREE, PERF.distantStarCount, 78, 0x9cc8ff, 0.4, PERF.fast ? 0.034 : 0.027);
    scene.add(distantStars);

    const nebulaPink = createNebula(THREE, 0xff6bd6, -8.6, 2.8, -12.5, 10.5);
    const nebulaBlue = createNebula(THREE, 0x69ddff, 8.5, -1.7, -15.5, 13);
    const nebulaGold = createNebula(THREE, 0xffd76d, -0.5, -4.6, -18, 15);
    scene.add(nebulaPink, nebulaBlue, nebulaGold);

    const aurora = createAurora(THREE);
    scene.add(aurora);

    const cakeGroup = createCake(THREE);
    cakeGroup.position.set(0, -1.5, 0);
    cakeGroup.scale.setScalar(0.86);
    cakeGroup.visible = false;
    scene.add(cakeGroup);

    const giftGroup = createGiftBox3D(THREE);
    giftGroup.position.set(2.8, -1.48, 0.2);
    giftGroup.scale.setScalar(0.7);
    giftGroup.visible = false;
    scene.add(giftGroup);

    const floatingCrystals = createFloatingCrystals(THREE);
    scene.add(floatingCrystals);

    threeScene = { THREE, scene, camera, renderer, starField, distantStars, nebulaPink, nebulaBlue, nebulaGold, aurora, cakeGroup, giftGroup, floatingCrystals };
    state.sceneReady = true;

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.position.z = window.innerWidth < 760 ? 10.4 : 8.3;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(PERF.pixelRatio);
    }, { passive: true });

    window.addEventListener('mousemove', (event) => {
      state.parallax.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      state.parallax.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const clock = new THREE.Clock();
    let lastRender = 0;
    const render = (time = 0) => {
      requestAnimationFrame(render);
      if (!state.pageVisible) return;

      const interval = state.effectsReduced ? 1000 / 18 : PERF.frameInterval;
      if (time - lastRender < interval) return;
      lastRender = time;

      const elapsed = clock.getElapsedTime();
      state.parallax.x += (state.parallax.targetX - state.parallax.x) * 0.045;
      state.parallax.y += (state.parallax.targetY - state.parallax.y) * 0.045;

      starField.rotation.y = elapsed * 0.012;
      starField.rotation.x = Math.sin(elapsed * 0.12) * 0.018;
      distantStars.rotation.y = -elapsed * 0.007;

      if (!state.effectsReduced) {
        nebulaPink.rotation.z = elapsed * 0.012;
        nebulaBlue.rotation.z = -elapsed * 0.01;
        nebulaGold.rotation.z = elapsed * 0.007;
        aurora.children.forEach((plane, index) => {
          plane.position.y = Math.sin(elapsed * 0.32 + index) * 0.09 + plane.userData.baseY;
          plane.material.opacity = plane.userData.opacity + Math.sin(elapsed * 0.42 + index) * 0.025;
        });
        floatingCrystals.children.forEach((crystal, index) => {
          crystal.rotation.x += 0.003 + index * 0.00025;
          crystal.rotation.y += 0.004 + index * 0.0002;
          crystal.position.y = crystal.userData.baseY + Math.sin(elapsed * 0.7 + index) * 0.16;
        });
      }

      if (state.unlocked) {
        cakeGroup.rotation.y = elapsed * 0.32;
        cakeGroup.position.y = -1.5 + Math.sin(elapsed * 1.0) * 0.045;
        giftGroup.rotation.y = Math.sin(elapsed * 0.7) * 0.14 - 0.4;
        giftGroup.position.y = -1.48 + Math.sin(elapsed * 1.0 + 1) * 0.04;
        const flames = cakeGroup.userData.flames || [];
        if (!state.effectsReduced || Math.floor(time / 160) % 2 === 0) {
          flames.forEach((flame, index) => {
            const flicker = 0.9 + Math.sin(elapsed * 7 + index) * 0.08;
            flame.scale.set(flicker, 1.08 + flicker * 0.08, flicker);
          });
        }
      }

      camera.position.x = state.parallax.x * (state.effectsReduced ? 0.16 : 0.3);
      camera.position.y = 1.1 - state.parallax.y * (state.effectsReduced ? 0.1 : 0.2);
      camera.lookAt(0, -0.15, 0);

      renderer.render(scene, camera);
    };

    requestAnimationFrame(render);
  }

  function revealThreeObjects() {
    if (!state.sceneReady || !threeScene) return;
    const { cakeGroup, giftGroup } = threeScene;
    cakeGroup.visible = true;
    giftGroup.visible = true;

    if (window.gsap) {
      cakeGroup.scale.setScalar(0.1);
      giftGroup.scale.setScalar(0.1);
      gsap.to(cakeGroup.scale, { x: 0.86, y: 0.86, z: 0.86, duration: 1.5, ease: 'elastic.out(1, 0.65)', delay: 0.6 });
      gsap.to(cakeGroup.position, { y: -1.5, duration: 1.2, ease: 'power3.out', delay: 0.6 });
      gsap.to(giftGroup.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 1.4, ease: 'back.out(1.7)', delay: 1.25 });
      openThreeGiftBox(6.2);
    }
  }

  function openThreeGiftBox(delay = 0) {
    if (!threeScene || !threeScene.giftGroup || !window.gsap) return;
    const lid = threeScene.giftGroup.userData.lid;
    const glow = threeScene.giftGroup.userData.glow;
    if (!lid) return;
    gsap.timeline({ delay })
      .to(lid.position, { y: 1.08, z: -0.18, duration: 1.15, ease: 'back.out(1.8)' })
      .to(lid.rotation, { x: -1.05, z: -0.18, duration: 1.15, ease: 'back.out(1.8)' }, '<')
      .to(glow.material, { opacity: 0.85, duration: 0.8, ease: 'power2.out' }, '-=0.65');
  }

  function createStarField(THREE, count, radius, color, opacity, size) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const r = radius * (0.25 + Math.random() * 0.75);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi) - 8;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color, size, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
    return new THREE.Points(geometry, material);
  }

  function createNebula(THREE, color, x, y, z, spread) {
    const count = PERF.nebulaCount;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.58;
      positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.44;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color, size: 0.09, opacity: 0.28, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(geometry, material);
    points.position.set(x, y, z);
    return points;
  }

  function createAurora(THREE) {
    const group = new THREE.Group();
    const colors = [0xff6bd6, 0x69ddff, 0x9c6bff];
    colors.forEach((color, index) => {
      const texture = createAuroraTexture(THREE, color, index);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.23 - index * 0.035, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(18, 6, 16, 1), material);
      plane.position.set((index - 1) * 2.4, 2.5 + index * 0.34, -10 - index * 2.2);
      plane.rotation.z = (index - 1) * 0.08;
      plane.userData.baseY = plane.position.y;
      plane.userData.opacity = material.opacity;
      group.add(plane);
    });
    return group;
  }

  function createAuroraTexture(THREE, color, index) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    const cssColor = `#${color.toString(16).padStart(6, '0')}`;
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.18, `${cssColor}33`);
    gradient.addColorStop(0.48, `${cssColor}aa`);
    gradient.addColorStop(0.78, `${cssColor}22`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 110 + index * 10);
    for (let x = 0; x <= canvas.width; x += 32) {
      ctx.lineTo(x, 80 + Math.sin(x * 0.025 + index) * 28 + Math.cos(x * 0.011) * 15);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function createCake(THREE) {
    const group = new THREE.Group();
    const flames = [];
    const cakePink = new THREE.MeshStandardMaterial({ color: 0xff8acb, roughness: 0.42, metalness: 0.04, emissive: 0x4a0a24, emissiveIntensity: 0.18 });
    const frosting = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.33, metalness: 0.02, emissive: 0x331122, emissiveIntensity: 0.06 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xffd76d, roughness: 0.3, metalness: 0.48, emissive: 0x5f3500, emissiveIntensity: 0.12 });
    const candleMat = new THREE.MeshStandardMaterial({ color: 0xffedf8, roughness: 0.35, emissive: 0x221122, emissiveIntensity: 0.1 });
    const flameMat = new THREE.MeshStandardMaterial({ color: 0xffb24d, emissive: 0xff7a00, emissiveIntensity: 2.4, roughness: 0.16 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.05, 0.72, PERF.fast ? 48 : 72), cakePink);
    base.position.y = -0.35;
    base.castShadow = true;
    group.add(base);

    const middle = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.55, 0.64, PERF.fast ? 48 : 72), cakePink);
    middle.position.y = 0.28;
    group.add(middle);

    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.16, 0.5, PERF.fast ? 48 : 72), cakePink);
    top.position.y = 0.83;
    group.add(top);

    const rings = [
      { r: 2.07, y: 0.02 },
      { r: 1.56, y: 0.6 },
      { r: 1.18, y: 1.08 },
    ];
    rings.forEach(({ r, y }) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.055, PERF.fast ? 10 : 14, PERF.fast ? 64 : 96), frosting);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      group.add(ring);
    });

    for (let i = 0; i < 32; i += 1) {
      const angle = (i / 32) * Math.PI * 2;
      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.05, PERF.fast ? 8 : 12, PERF.fast ? 8 : 12), i % 3 === 0 ? gold : frosting);
      pearl.position.set(Math.cos(angle) * 1.96, 0.04 + Math.sin(i) * 0.015, Math.sin(angle) * 1.96);
      group.add(pearl);
    }

    const candlePositions = [
      [0, 1.28, 0],
      [0.48, 1.2, 0.32],
      [-0.48, 1.2, 0.32],
      [0.42, 1.2, -0.38],
      [-0.42, 1.2, -0.38],
    ];

    candlePositions.forEach(([x, y, z], index) => {
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.58, PERF.fast ? 12 : 18), candleMat);
      candle.position.set(x, y, z);
      group.add(candle);

      const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.056, 0.008, 6, PERF.fast ? 12 : 18), gold);
      stripe.rotation.x = Math.PI / 2;
      stripe.position.set(x, y + 0.1, z);
      group.add(stripe);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, PERF.fast ? 12 : 18), flameMat);
      flame.position.set(x, y + 0.4, z);
      flame.rotation.y = index * 0.2;
      flames.push(flame);
      group.add(flame);

      const flameLight = new THREE.PointLight(0xff9a3c, 0.28, 1.7);
      flameLight.position.set(x, y + 0.43, z);
      group.add(flameLight);
    });

    const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.25, 0.08, PERF.fast ? 64 : 96), new THREE.MeshStandardMaterial({ color: 0xf7e8ff, roughness: 0.24, metalness: 0.18 }));
    plate.position.y = -0.75;
    group.add(plate);

    group.userData.flames = flames;
    return group;
  }

  function createGiftBox3D(THREE) {
    const group = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x985dff, roughness: 0.36, metalness: 0.08, emissive: 0x1d0735, emissiveIntensity: 0.18 });
    const lidMat = new THREE.MeshStandardMaterial({ color: 0xff6bd6, roughness: 0.34, metalness: 0.1, emissive: 0x330016, emissiveIntensity: 0.2 });
    const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xffd76d, roughness: 0.25, metalness: 0.46, emissive: 0x4f3200, emissiveIntensity: 0.18 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(1.32, 1.05, 1.32), boxMat);
    base.position.y = -0.1;
    group.add(base);

    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.27, 1.52), lidMat);
    lid.position.y = 0.58;
    group.add(lid);

    const ribbonV = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.13, 1.36), ribbonMat);
    ribbonV.position.y = -0.08;
    group.add(ribbonV);

    const ribbonH = new THREE.Mesh(new THREE.BoxGeometry(1.38, 1.14, 0.18), ribbonMat);
    ribbonH.position.y = -0.08;
    group.add(ribbonH);

    const lidRibbonA = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.29, 1.58), ribbonMat);
    lidRibbonA.position.y = 0.59;
    group.add(lidRibbonA);

    const lidRibbonB = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.29, 0.2), ribbonMat);
    lidRibbonB.position.y = 0.59;
    group.add(lidRibbonB);

    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffd76d, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.82, PERF.fast ? 16 : 24, PERF.fast ? 16 : 24), glowMat);
    glow.position.y = 0.38;
    group.add(glow);

    group.userData.lid = lid;
    group.userData.glow = glow;
    return group;
  }

  function createFloatingCrystals(THREE) {
    const group = new THREE.Group();
    const materialOptions = [
      { color: 0xff6bd6, emissive: 0x631747 },
      { color: 0x69ddff, emissive: 0x123b52 },
      { color: 0xffd76d, emissive: 0x554006 },
      { color: 0x9c6bff, emissive: 0x27185e },
    ];
    for (let i = 0; i < PERF.crystalCount; i += 1) {
      const options = materialOptions[i % materialOptions.length];
      const material = new THREE.MeshStandardMaterial({ ...options, roughness: 0.22, metalness: 0.22, transparent: true, opacity: 0.72 });
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.09 + Math.random() * 0.09, 0), material);
      crystal.position.set((Math.random() - 0.5) * 9.5, (Math.random() - 0.5) * 5.6, -1 - Math.random() * 8);
      crystal.userData.baseY = crystal.position.y;
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      group.add(crystal);
    }
    return group;
  }
})();
