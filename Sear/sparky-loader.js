/* =================================
   Modul 2: sparky-loader.js
   Steuert die generative 'Sparky' / 'Weaving'-Animation
   auf dem Canvas-Element '#sparky-loader-canvas'.
   Inspiriert von 'Blitz ausm Wedding'.
   ================================= */

// Event-Listener, der wartet, bis das DOM geladen ist.
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('sparky-loader-canvas');
  if (!canvas) {
    console.error('Sparky-Loader: Canvas-Element nicht gefunden.');
    return;
  }
  const ctx = canvas.getContext('2d');

  let particles =;
  let animationFrameId;

  // Stellt sicher, dass das Canvas die richtige Größe hat
  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // --- Die Particle-Klasse ---
  // Jedes "fluide" oder "blitzende" Element ist ein Partikel
  class Particle {
    constructor(x, y, isBlitz) {
      this.x = x;
      this.y = y;
      // 'Fluid'-Bewegung: Leicht nach oben und zur Seite
      this.vx = (Math.random() - 0.5) * 1;
      this.vy = (Math.random() * -1) - 0.5;

      this.radius = Math.random() * 2 + 1;
      this.alpha = 1; // 'Gasförmig' (startet voll sichtbar)
      this.life = Math.random() * 80 + 40; // Lebensdauer

      if (isBlitz) {
        // 'Blitz'-Partikel sind schneller und heller
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() * -2) - 1;
        this.color = '#ffffff'; // Helle Blitzfarbe
        this.radius = Math.random() * 3 + 2;
        this.life = Math.random() * 40 + 20; // Kürzeres, intensives Leben
      } else {
        // Standard 'Weaving'-Farben (Purpur, Türkis)
        this.color = Math.random() > 0.5? '#d946ef' : '#22d3ee';
      }
    }

    // Partikel-Position und Leben aktualisieren
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 1;
      // 'Gasförmig': Verblassen am Ende des Lebens
      if (this.life < 20) {
        this.alpha = this.life / 20;
      }
    }

    // Partikel auf das Canvas zeichnen
    draw(context) {
      context.save();
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.globalAlpha = this.alpha;
      context.fill();
      context.restore();
    }
  }

  // --- Die Haupt-Animationsschleife ---
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren

    // Neue Partikel generieren
    // Wir erzeugen 2 neue Partikel pro Frame
    for (let i = 0; i < 2; i++) {
      let isBlitz = false;
      ctx.filter = 'none'; // Filter standardmäßig zurücksetzen

      // IMPLEMENTIERUNG: 'Blitz ausm Wedding'
      // Mit einer kleinen Wahrscheinlichkeit (2%) einen 'Blitz' auslösen
      if (Math.random() > 0.98) {
        isBlitz = true;
        // Setzt den 'drop-shadow'-Filter, wie in  spezifiziert
        ctx.filter = 'drop-shadow(0 0 5px #ff00ff) drop-shadow(0 0 10px #00ffff)';
      }

      const x = canvas.width / 2; // Startet in der Mitte
      const y = canvas.height * 0.8; // Startet unten
      particles.push(new Particle(x, y, isBlitz));
    }

    // Alle Partikel aktualisieren und zeichnen
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);

      // Partikel entfernen, wenn sie 'gestorben' sind
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Filter zurücksetzen, damit er nicht auf dem ganzen Canvas bleibt
    ctx.filter = 'none';

    animationFrameId = requestAnimationFrame(animate);
  }

  // --- Globale Steuerung ---
  // Diese Funktionen werden von sear-measuring.js aufgerufen

  window.startSparkyLoader = () => {
    if (!animationFrameId) {
      canvas.classList.add('active'); // Canvas sichtbar machen
      animate();
    }
  };

  window.stopSparkyLoader = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
      particles =; // Partikel zurücksetzen
      canvas.classList.remove('active'); // Canvas verbergen
    }
  };

  // Initial stoppen, bis eine Suche gestartet wird
  stopSparkyLoader();
});
