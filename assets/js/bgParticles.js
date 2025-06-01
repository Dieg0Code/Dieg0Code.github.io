export class GeometricFlowSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.shapes = [];
    this.animationId = null;
    this.mouse = { x: 0, y: 0 };
    this.time = 0;
    this.mouseClicks = []; // Array para almacenar los clics

    this.init();
  }

  init() {
    this.createCanvas();
    this.createShapes();
    this.bindEvents();
    this.animate();
    console.log("Geometric flow system initialized");
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "geometric-flow-canvas";
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.6;
    `;

    document.body.insertBefore(this.canvas, document.body.firstChild);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
  }

  createShapes() {
    const shapeCount = Math.floor(
      (this.canvas.width * this.canvas.height) / 25000
    );

    this.shapes = [];
    for (let i = 0; i < shapeCount; i++) {
      this.shapes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 25 + 15, // Aumentar de 20+10 a 25+15
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type: Math.floor(Math.random() * 3),
        color: this.getRandomColor(),
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.8 + 0.5, // Aumentar opacidad mínima
      });
    }
  }

  getRandomColor() {
    const colors = [
      "#667eea", // Azul vibrante pero elegante
      "#764ba2", // Púrpura sofisticado
      "#f093fb", // Rosa suave
      "#4facfe", // Azul cielo
      "#43e97b", // Verde esmeralda
      "#38ef7d", // Verde menta
      "#fa709a", // Rosa coral
      "#fee140", // Amarillo dorado
      "#a8edea", // Turquesa suave
      "#667eea", // Azul (repetido para mayor probabilidad)
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());

    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Agregar evento de clic para crear ondas
    document.addEventListener("click", (e) => {
      this.createMouseWave(e.clientX, e.clientY);
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createShapes();
  }

  // Nueva función para crear ondas en el clic
  createMouseWave(x, y) {
    this.mouseClicks.push({
      x: x,
      y: y,
      radius: 0,
      maxRadius: 100,
      opacity: 1,
      speed: 3,
      time: 0,
    });

    // Limitar el número de ondas simultáneas
    if (this.mouseClicks.length > 5) {
      this.mouseClicks.shift();
    }
  }

  // Actualizar función para manejar las ondas de clic
  updateMouseWaves() {
    this.mouseClicks = this.mouseClicks.filter((wave) => {
      wave.radius += wave.speed;
      wave.time += 1;
      wave.opacity = 1 - wave.radius / wave.maxRadius;

      return wave.radius < wave.maxRadius;
    });
  }

  // Nueva función para dibujar solo las ondas de clic
  drawMouseWaves() {
    this.mouseClicks.forEach((wave) => {
      this.ctx.save();
      this.ctx.globalAlpha = wave.opacity * 0.7;
      this.ctx.strokeStyle = "#764ba2"; // Violeta vibrante
      this.ctx.lineWidth = 2.5;
      this.ctx.setLineDash([6, 3]);
      this.ctx.beginPath();
      this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();

      // Onda interior más pequeña para efecto doble
      if (wave.radius > 10) {
        this.ctx.save();
        this.ctx.globalAlpha = wave.opacity * 0.4;
        this.ctx.strokeStyle = "#43e97b";
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([3, 6]);
        this.ctx.beginPath();
        this.ctx.arc(wave.x, wave.y, wave.radius * 0.6, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }
    });
  }

  updateShape(shape) {
    shape.x += shape.vx;
    shape.y += shape.vy;
    shape.rotation += shape.rotationSpeed;
    shape.pulse += shape.pulseSpeed;

    // Efecto magnético del mouse
    const dx = this.mouse.x - shape.x;
    const dy = this.mouse.y - shape.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      const force = ((100 - distance) / 100) * 0.02;
      shape.vx += (dx / distance) * force;
      shape.vy += (dy / distance) * force;
    }

    // Mantener velocidad
    const speed = Math.sqrt(shape.vx * shape.vx + shape.vy * shape.vy);
    if (speed > 0.5) {
      shape.vx = (shape.vx / speed) * 0.5;
      shape.vy = (shape.vy / speed) * 0.5;
    }

    // Rebote en bordes
    if (shape.x < 0 || shape.x > this.canvas.width) {
      shape.vx *= -1;
      shape.x = Math.max(0, Math.min(this.canvas.width, shape.x));
    }
    if (shape.y < 0 || shape.y > this.canvas.height) {
      shape.vy *= -1;
      shape.y = Math.max(0, Math.min(this.canvas.height, shape.y));
    }
  }

  drawShape(shape) {
    const pulseSize = shape.size + Math.sin(shape.pulse) * 2;
    const pulseOpacity = shape.opacity + Math.sin(shape.pulse) * 0.2;

    this.ctx.save();
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(shape.rotation);
    this.ctx.globalAlpha = pulseOpacity;
    this.ctx.fillStyle = shape.color;
    this.ctx.strokeStyle = shape.color;
    this.ctx.lineWidth = 3; // Aumentar de 1.5 a 3 para más grosor

    // Dibujar según el tipo
    switch (shape.type) {
      case 0: // Círculo
        this.ctx.beginPath();
        this.ctx.arc(0, 0, pulseSize / 2, 0, Math.PI * 2);
        this.ctx.stroke();
        // Agregar relleno sutil para más presencia
        this.ctx.globalAlpha = pulseOpacity * 0.2;
        this.ctx.fill();
        break;

      case 1: // Triángulo
        this.ctx.beginPath();
        this.ctx.moveTo(0, -pulseSize / 2);
        this.ctx.lineTo(-pulseSize / 2, pulseSize / 2);
        this.ctx.lineTo(pulseSize / 2, pulseSize / 2);
        this.ctx.closePath();
        this.ctx.stroke();
        // Relleno sutil
        this.ctx.globalAlpha = pulseOpacity * 0.2;
        this.ctx.fill();
        break;

      case 2: // Cuadrado
        this.ctx.strokeRect(
          -pulseSize / 2,
          -pulseSize / 2,
          pulseSize,
          pulseSize
        );
        // Relleno sutil
        this.ctx.globalAlpha = pulseOpacity * 0.2;
        this.ctx.fillRect(-pulseSize / 2, -pulseSize / 2, pulseSize, pulseSize);
        break;
    }

    this.ctx.restore();
  }

  drawConnections() {
    for (let i = 0; i < this.shapes.length; i++) {
      for (let j = i + 1; j < this.shapes.length; j++) {
        const shape1 = this.shapes[i];
        const shape2 = this.shapes[j];

        const dx = shape1.x - shape2.x;
        const dy = shape1.y - shape2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = ((120 - distance) / 120) * 0.6; // Aumentar opacidad

          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = "#667eea";
          this.ctx.lineWidth = 5; // Aumentar de 1.2 a 2
          this.ctx.setLineDash([4, 6]); // Líneas punteadas más marcadas
          this.ctx.beginPath();
          this.ctx.moveTo(shape1.x, shape1.y);
          this.ctx.lineTo(shape2.x, shape2.y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  // Eliminar la función drawMouseEffect anterior y reemplazar con esto:
  drawMouseEffect() {
    // Solo dibujar un pequeño glow sutil alrededor del cursor
    this.ctx.save();
    this.ctx.globalAlpha = 0.1;
    this.ctx.fillStyle = "#f093fb";
    this.ctx.shadowColor = "#f093fb";
    this.ctx.shadowBlur = 15;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, 8, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.time++;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar conexiones primero
    this.drawConnections();

    // Actualizar y dibujar formas
    this.shapes.forEach((shape) => {
      this.updateShape(shape);
      this.drawShape(shape);
    });

    // Efecto sutil del mouse (solo glow)
    this.drawMouseEffect();

    // Actualizar y dibujar ondas de clic
    this.updateMouseWaves();
    this.drawMouseWaves();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

export function initNeuralWaves() {
  console.log(
    "Initializing geometric flow system, screen width:",
    window.innerWidth
  );
  return new GeometricFlowSystem();
}
