export class ConwayGameOfLife {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.lastResize = 0;
    this.isResizing = false;

    // Configuración optimizada
    this.cellSize = this.getCellSize();
    this.cols = 0;
    this.rows = 0;
    this.grid = [];
    this.nextGrid = [];

    // Control de animación más fluido
    this.frameCount = 0;
    this.updateInterval = this.getUpdateInterval();

    // Solo trackear células activas
    this.activeCells = new Set();
    this.cellStates = new Map();

    // Para mantener vida constante
    this.generationCount = 0;
    this.lastPopulation = 0;

    this.colors = {
      alive: "#8B7CAE", // Tu violeta original
      birthing: "#A08DC4", // Violeta balanceado para transición suave
      dying: "#C9BFD8", // Violeta desaturado para desaparición elegante
      background: "#F3F3F3",
    };

    this.init();
  }

  getCellSize() {
    const isMobile = window.innerWidth < 768;
    return isMobile ? 16 : 13; // Celdas más grandes para mejor rendimiento
  }

  getUpdateInterval() {
    const isMobile = window.innerWidth < 768;
    return isMobile ? 30 : 26; // Más rápido para que se vea fluido
  }

  init() {
    this.createCanvas();
    this.initializeGrid();
    this.populateGrid();
    this.bindEvents();
    this.animate();
    console.log("Conway's Game of Life initialized");
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "conway-canvas";
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.7;
    `;

    document.body.insertBefore(this.canvas, document.body.firstChild);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
  }

  initializeGrid() {
    this.cols = Math.floor(this.canvas.width / this.cellSize);
    this.rows = Math.floor(this.canvas.height / this.cellSize);

    this.grid = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(0));
    this.nextGrid = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(0));

    this.activeCells.clear();
    this.cellStates.clear();
  }

  populateGrid() {
    // Densidad inicial más alta pero controlada
    const density = 0.08; // 8% de células vivas

    // Agregar patrones estables distribuidos
    this.addStablePatterns();

    // Rellenar con células aleatorias
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (Math.random() < density && this.grid[row][col] === 0) {
          this.grid[row][col] = 1;
          const key = `${row}-${col}`;
          this.activeCells.add(key);
          this.cellStates.set(key, {
            current: 1,
            target: 1,
            opacity: 1,
          });
        }
      }
    }
  }

  addStablePatterns() {
    // Agregar algunos patrones estables distribuidos por la pantalla
    const patterns = [
      // Bloque 2x2
      [
        [1, 1],
        [1, 1],
      ],
      // Colmena
      [
        [0, 1, 1, 0],
        [1, 0, 0, 1],
        [0, 1, 1, 0],
      ],
      // Barco
      [
        [1, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ],
    ];

    const numPatterns = Math.floor((this.rows * this.cols) / 2000); // Más patrones

    for (let p = 0; p < numPatterns; p++) {
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      const startRow = Math.floor(Math.random() * (this.rows - pattern.length));
      const startCol = Math.floor(
        Math.random() * (this.cols - pattern[0].length)
      );

      for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
          if (pattern[i][j] === 1) {
            const row = startRow + i;
            const col = startCol + j;
            this.grid[row][col] = 1;
            const key = `${row}-${col}`;
            this.activeCells.add(key);
            this.cellStates.set(key, {
              current: 1,
              target: 1,
              opacity: 1,
            });
          }
        }
      }
    }
  }

  bindEvents() {
    window.addEventListener("resize", this.throttledResize.bind(this));

    window.addEventListener("orientationchange", () => {
      setTimeout(() => this.resize(), 100);
    });

    document.addEventListener("click", (e) => {
      this.addInteractivePattern(e.clientX, e.clientY);
    });

    document.addEventListener("touchstart", (e) => {
      if (e.touches.length > 0) {
        this.addInteractivePattern(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
  }

  throttledResize() {
    const now = Date.now();
    if (now - this.lastResize < 300) return;

    this.lastResize = now;
    if (this.isResizing) return;

    this.isResizing = true;
    setTimeout(() => {
      this.resize();
      this.isResizing = false;
    }, 100);
  }

  resize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (
      Math.abs(this.canvas.width - newWidth) > 50 ||
      Math.abs(this.canvas.height - newHeight) > 50
    ) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;

      this.cellSize = this.getCellSize();
      this.updateInterval = this.getUpdateInterval();

      this.initializeGrid();
      this.populateGrid();
    }
  }

  addInteractivePattern(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    // Patrones más interesantes
    const patterns = [
      // Glider
      [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ],
      // Pequeño oscilador
      [[1, 1, 1]],
      // Bloque
      [
        [1, 1],
        [1, 1],
      ],
    ];

    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        const newRow = row + i;
        const newCol = col + j;

        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols
        ) {
          if (pattern[i][j] === 1) {
            this.grid[newRow][newCol] = 1;
            const key = `${newRow}-${newCol}`;
            this.activeCells.add(key);
            this.cellStates.set(key, {
              current: 0,
              target: 1,
              opacity: 0,
            });
          }
        }
      }
    }
  }

  countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newRow = row + i;
        const newCol = col + j;

        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols
        ) {
          count += this.grid[newRow][newCol];
        }
      }
    }
    return count;
  }

  updateGame() {
    const cellsToCheck = new Set();

    // Solo verificar células activas y sus vecinos
    for (const cellKey of this.activeCells) {
      const [row, col] = cellKey.split("-").map(Number);

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;

          if (
            newRow >= 0 &&
            newRow < this.rows &&
            newCol >= 0 &&
            newCol < this.cols
          ) {
            cellsToCheck.add(`${newRow}-${newCol}`);
          }
        }
      }
    }

    this.activeCells.clear();

    for (const cellKey of cellsToCheck) {
      const [row, col] = cellKey.split("-").map(Number);
      const neighbors = this.countNeighbors(row, col);
      const currentState = this.grid[row][col];

      let newState = 0;
      if (currentState === 1) {
        if (neighbors === 2 || neighbors === 3) {
          newState = 1;
        }
      } else {
        if (neighbors === 3) {
          newState = 1;
        }
      }

      this.nextGrid[row][col] = newState;

      if (newState === 1) {
        this.activeCells.add(cellKey);
      }

      if (currentState !== newState) {
        this.cellStates.set(cellKey, {
          current: currentState,
          target: newState,
          opacity: currentState,
        });
      }
    }

    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];

    // Limpiar nextGrid más eficientemente
    for (const cellKey of cellsToCheck) {
      const [row, col] = cellKey.split("-").map(Number);
      this.nextGrid[row][col] = 0;
    }

    this.generationCount++;

    // Verificar si necesitamos agregar vida
    if (this.activeCells.size < 20 || this.generationCount % 100 === 0) {
      this.maintainLife();
    }
  }

  maintainLife() {
    // Agregar vida de manera más inteligente
    const targetPopulation = Math.floor(this.rows * this.cols * 0.03); // 3% objetivo
    const currentPopulation = this.activeCells.size;

    if (currentPopulation < targetPopulation) {
      const toAdd = Math.min(10, targetPopulation - currentPopulation);

      for (let i = 0; i < toAdd; i++) {
        // Encontrar un lugar vacío cerca de células existentes
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 20) {
          let row, col;

          if (this.activeCells.size > 0 && Math.random() < 0.7) {
            // 70% del tiempo, colocar cerca de células existentes
            const randomCell = Array.from(this.activeCells)[
              Math.floor(Math.random() * this.activeCells.size)
            ];
            const [baseRow, baseCol] = randomCell.split("-").map(Number);
            row = Math.max(
              0,
              Math.min(
                this.rows - 1,
                baseRow + Math.floor(Math.random() * 6) - 3
              )
            );
            col = Math.max(
              0,
              Math.min(
                this.cols - 1,
                baseCol + Math.floor(Math.random() * 6) - 3
              )
            );
          } else {
            // 30% del tiempo, colocar aleatoriamente
            row = Math.floor(Math.random() * this.rows);
            col = Math.floor(Math.random() * this.cols);
          }

          if (this.grid[row][col] === 0) {
            this.grid[row][col] = 1;
            const key = `${row}-${col}`;
            this.activeCells.add(key);
            this.cellStates.set(key, {
              current: 0,
              target: 1,
              opacity: 0,
            });
            placed = true;
          }
          attempts++;
        }
      }
    }
  }

  updateCellStates() {
    const keysToRemove = [];

    for (const [key, state] of this.cellStates) {
      const diff = state.target - state.current;
      state.current += diff * 0.15; // Más rápido

      if (state.target === 1) {
        state.opacity = Math.min(1, state.opacity + 0.1);
      } else {
        state.opacity = Math.max(0, state.opacity - 0.05);
      }

      if (Math.abs(diff) < 0.01 && state.opacity < 0.01) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => this.cellStates.delete(key));
  }

  draw() {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar todas las células con estado
    for (const [cellKey, state] of this.cellStates) {
      if (state.opacity > 0.01) {
        const [row, col] = cellKey.split("-").map(Number);
        this.drawCell(row, col, state);
      }
    }

    // Dibujar células activas sin estado de transición
    for (const cellKey of this.activeCells) {
      if (!this.cellStates.has(cellKey)) {
        const [row, col] = cellKey.split("-").map(Number);
        this.drawCell(row, col, { opacity: 1, current: 1 });
      }
    }
  }

  drawCell(row, col, state) {
    if (state.opacity < 0.01) return;

    const x = col * this.cellSize;
    const y = row * this.cellSize;

    this.ctx.globalAlpha = state.opacity * 0.9;
    this.ctx.fillStyle = this.colors.alive;

    const centerX = x + this.cellSize / 2;
    const centerY = y + this.cellSize / 2;
    const radius = (this.cellSize - 2) / 2;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fill();

    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.frameCount++;

    if (this.frameCount % this.updateInterval === 0) {
      this.updateGame();
    }

    this.updateCellStates();
    this.draw();

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
    "Initializing Conway's Game of Life, screen width:",
    window.innerWidth
  );
  return new ConwayGameOfLife();
}
