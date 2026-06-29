(function () {
  class CelebrationFX {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: true });
      this.fast = Boolean(options.fast);
      this.reduced = this.fast;
      this.paused = false;
      this.frameInterval = this.fast ? 1000 / 24 : 1000 / 34;
      this.lastFrame = 0;
      this.dpr = this.fast ? 1 : Math.min(window.devicePixelRatio || 1, 1.35);
      this.width = 0;
      this.height = 0;
      this.running = false;
      this.celebrating = false;
      this.particles = [];
      this.confetti = [];
      this.balloons = [];
      this.sparkles = [];
      this.shootingStars = [];
      this.lastFirework = 0;
      this.lastBalloon = 0;
      this.lastShootingStar = 0;
      this.pointer = { x: 0, y: 0 };
      this.palette = ['#ff6bd6', '#ffd76d', '#69ddff', '#9c6bff', '#ffffff', '#ff9aba'];
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });
      window.addEventListener('mousemove', (event) => this.handlePointer(event.clientX, event.clientY), { passive: true });
      window.addEventListener('touchmove', (event) => {
        const touch = event.touches[0];
        if (touch) this.handlePointer(touch.clientX, touch.clientY);
      }, { passive: true });
      window.addEventListener('pointerdown', (event) => {
        if (!this.celebrating || this.reduced) return;
        this.createFirework(event.clientX, event.clientY, this.fast ? 18 : 36);
      }, { passive: true });
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    start() {
      if (this.running) return;
      this.running = true;
      this.loop(0);
    }

    setPaused(value) {
      this.paused = Boolean(value);
    }

    setReduced(value) {
      this.reduced = Boolean(value);
      if (this.reduced) {
        this.particles.length = Math.min(this.particles.length, 24);
        this.confetti.length = Math.min(this.confetti.length, 30);
        this.balloons.length = Math.min(this.balloons.length, 5);
        this.sparkles.length = Math.min(this.sparkles.length, 18);
        this.shootingStars.length = Math.min(this.shootingStars.length, 1);
      }
    }

    startCelebration() {
      this.celebrating = true;
      if (this.reduced) return;
      const bursts = this.fast ? 4 : 6;
      const particles = this.fast ? 32 : 48;
      for (let i = 0; i < bursts; i += 1) {
        setTimeout(() => this.createFirework(Math.random() * this.width, this.height * (0.16 + Math.random() * 0.42), particles), i * 360);
      }
      this.confettiBurst();
      for (let i = 0; i < (this.fast ? 8 : 12); i += 1) this.spawnBalloon(true);
    }

    handlePointer(x, y) {
      this.pointer.x = x;
      this.pointer.y = y;
      if (this.reduced) return;
      if (Math.random() > (this.fast ? 0.88 : 0.76)) this.addSparkle(x, y, 1 + Math.random() * 1.2);
    }

    addSparkle(x, y, power = 1) {
      this.sparkles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2 * power,
        vy: (Math.random() - 0.5) * 1.2 * power,
        life: 1,
        decay: 0.025 + Math.random() * 0.03,
        size: 1.2 + Math.random() * 3.4,
        color: this.palette[Math.floor(Math.random() * this.palette.length)],
      });
    }

    createFirework(x, y, count = 48) {
      if (this.reduced && this.particles.length > 80) return;
      if (this.particles.length > (this.fast ? 220 : 420)) this.particles.splice(0, Math.floor(this.particles.length * 0.35));
      count = Math.min(count, this.reduced ? 20 : (this.fast ? 36 : 52));
      const hueColor = this.palette[Math.floor(Math.random() * this.palette.length)];
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.12;
        const speed = 1.8 + Math.random() * 5.4;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.035 + Math.random() * 0.028,
          friction: 0.986,
          life: 1,
          decay: 0.008 + Math.random() * 0.015,
          size: 1.5 + Math.random() * 2.8,
          color: Math.random() > 0.42 ? hueColor : this.palette[Math.floor(Math.random() * this.palette.length)],
          trail: [],
        });
      }
    }

    confettiBurst() {
      const total = this.fast ? 90 : 150;
      for (let i = 0; i < total; i += 1) {
        this.confetti.push({
          x: Math.random() * this.width,
          y: -20 - Math.random() * this.height * 0.35,
          vx: (Math.random() - 0.5) * 3.2,
          vy: 1.2 + Math.random() * 3.6,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.22,
          width: 5 + Math.random() * 10,
          height: 8 + Math.random() * 16,
          life: 1,
          color: this.palette[Math.floor(Math.random() * this.palette.length)],
        });
      }
    }

    spawnBalloon(initial = false) {
      const size = 24 + Math.random() * 34;
      this.balloons.push({
        x: Math.random() * this.width,
        y: initial ? this.height + Math.random() * this.height : this.height + 80,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.45 + Math.random() * 0.75),
        size,
        wobble: Math.random() * Math.PI * 2,
        color: this.palette[Math.floor(Math.random() * 4)],
      });
    }

    spawnShootingStar() {
      if (this.reduced || this.shootingStars.length > 2) return;
      this.shootingStars.push({
        x: Math.random() * this.width * 0.75,
        y: Math.random() * this.height * 0.32,
        vx: 8 + Math.random() * 7,
        vy: 3 + Math.random() * 2,
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        length: 130 + Math.random() * 120,
      });
    }

    drawParticle(particle) {
      const ctx = this.ctx;
      particle.trail.push({ x: particle.x, y: particle.y });
      if (particle.trail.length > 6) particle.trail.shift();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < particle.trail.length; i += 1) {
        const point = particle.trail[i];
        const alpha = (i / particle.trail.length) * particle.life * 0.38;
        ctx.fillStyle = this.hexToRgba(particle.color, alpha);
        ctx.beginPath();
        ctx.arc(point.x, point.y, particle.size * (i / particle.trail.length), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = this.hexToRgba(particle.color, particle.life);
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = this.fast || this.reduced ? 8 : 14;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawConfetti(piece) {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = piece.life;
      ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      ctx.restore();
    }

    drawBalloon(balloon) {
      const ctx = this.ctx;
      const wobbleX = Math.sin(balloon.wobble) * 9;
      ctx.save();
      ctx.translate(balloon.x + wobbleX, balloon.y);
      ctx.globalAlpha = 0.86;
      ctx.fillStyle = balloon.color;
      ctx.shadowColor = balloon.color;
      ctx.shadowBlur = this.fast || this.reduced ? 8 : 14;
      ctx.beginPath();
      ctx.ellipse(0, 0, balloon.size * 0.68, balloon.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.ellipse(-balloon.size * 0.18, -balloon.size * 0.28, balloon.size * 0.16, balloon.size * 0.28, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.34)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, balloon.size * 0.94);
      ctx.bezierCurveTo(10, balloon.size * 1.4, -12, balloon.size * 1.8, 0, balloon.size * 2.28);
      ctx.stroke();
      ctx.restore();
    }

    drawSparkle(sparkle) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(sparkle.x, sparkle.y);
      ctx.strokeStyle = this.hexToRgba(sparkle.color, sparkle.life);
      ctx.lineWidth = 1.4;
      ctx.shadowColor = sparkle.color;
      ctx.shadowBlur = this.fast || this.reduced ? 5 : 8;
      const size = sparkle.size * (0.6 + sparkle.life);
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.restore();
    }

    drawShootingStar(star) {
      const ctx = this.ctx;
      const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.length, star.y - star.length * 0.38);
      gradient.addColorStop(0, `rgba(255,255,255,${star.life})`);
      gradient.addColorStop(0.42, `rgba(105,221,255,${star.life * 0.52})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#69ddff';
      ctx.shadowBlur = this.fast || this.reduced ? 8 : 14;
      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(star.x - star.length, star.y - star.length * 0.38);
      ctx.stroke();
      ctx.restore();
    }

    updateCollection(collection, updater) {
      for (let i = collection.length - 1; i >= 0; i -= 1) {
        const item = collection[i];
        updater(item, i);
        if (item.life !== undefined && item.life <= 0) collection.splice(i, 1);
        if (item.y && item.y < -180 && item.vy < 0) collection.splice(i, 1);
        if (item.y && item.y > this.height + 240 && item.vy > 0) collection.splice(i, 1);
      }
    }

    loop(time) {
      if (!this.running) return;
      requestAnimationFrame((nextTime) => this.loop(nextTime));
      if (this.paused) return;
      if (time - this.lastFrame < this.frameInterval) return;
      this.lastFrame = time;

      this.ctx.clearRect(0, 0, this.width, this.height);

      if (!this.reduced && time - this.lastShootingStar > 5200 + Math.random() * 2800) {
        this.spawnShootingStar();
        this.lastShootingStar = time;
      }

      if (this.celebrating) {
        if (!this.reduced && time - this.lastFirework > (this.fast ? 1800 : 1250) + Math.random() * 850) {
          this.createFirework(Math.random() * this.width, this.height * (0.14 + Math.random() * 0.45), this.fast ? 28 : 42);
          this.lastFirework = time;
        }
        if (!this.reduced && time - this.lastBalloon > (this.fast ? 1600 : 1150)) {
          this.spawnBalloon();
          this.lastBalloon = time;
        }
        if (!this.reduced && Math.random() > (this.fast ? 0.985 : 0.965)) {
          this.addSparkle(Math.random() * this.width, Math.random() * this.height, 2.3);
        }
      }

      this.updateCollection(this.shootingStars, (star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.life -= star.decay;
        this.drawShootingStar(star);
      });

      this.updateCollection(this.particles, (particle) => {
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        this.drawParticle(particle);
      });

      this.updateCollection(this.confetti, (piece) => {
        piece.vy += 0.012;
        piece.x += piece.vx + Math.sin(piece.y * 0.02) * 0.7;
        piece.y += piece.vy;
        piece.rotation += piece.spin;
        piece.life -= 0.0019;
        this.drawConfetti(piece);
      });

      for (let i = this.balloons.length - 1; i >= 0; i -= 1) {
        const balloon = this.balloons[i];
        balloon.x += balloon.vx;
        balloon.y += balloon.vy;
        balloon.wobble += 0.025;
        this.drawBalloon(balloon);
        if (balloon.y < -180) this.balloons.splice(i, 1);
      }

      this.updateCollection(this.sparkles, (sparkle) => {
        sparkle.x += sparkle.vx;
        sparkle.y += sparkle.vy;
        sparkle.life -= sparkle.decay;
        this.drawSparkle(sparkle);
      });

    }

    hexToRgba(hex, alpha) {
      const clean = hex.replace('#', '');
      const bigint = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
    }
  }

  window.CelebrationFX = CelebrationFX;
})();
