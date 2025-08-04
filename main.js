const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let direction;
let food;
let score;
let record = localStorage.getItem('snakeRecord') || 0;
let gameStarted = false;

const menu = document.getElementById('menu');
const gameContainer = document.getElementById('gameContainer');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const recordDisplay = document.getElementById('record');

// Sons
const eatSound = new Audio('sons/eat.mp3');
const gameOverSound = new Audio('sons/gameover.mp3');

// Inicializa o jogo
function initGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    food = { x: 5, y: 5 };
    score = 0;
    scoreDisplay.textContent = "Pontuação: 0";
    recordDisplay.textContent = "Recorde: " + record;
    gameStarted = true;
    restartBtn.style.display = 'none';
    gameLoop();
}

// Loop principal do jogo
function gameLoop() {
    if (!gameStarted) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Fim de jogo
    if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
    gameOver();
    return;
    }

    snake.unshift(head);

  // Comer comida
    if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = "Pontuação: " + score;
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    } else {
    snake.pop();
    }

    drawGame();
    setTimeout(gameLoop, 100);
}

// Função de game over
function gameOver() {
    gameOverSound.play();
    gameStarted = false;
    alert("Fim de jogo! Pontuação: " + score);

    if (score > record) {
    record = score;
    localStorage.setItem('snakeRecord', record);
    recordDisplay.textContent = "Recorde: " + record;
    alert("Novo recorde! 🎉");
    }

    restartBtn.style.display = 'inline-block';
}

// Desenha o jogo
function drawGame() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    snake.forEach((part, index) => {
    if (index === 0) {
        ctx.fillStyle = '#00cc00';
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);

        ctx.fillStyle = 'white';
        const eyeSize = gridSize / 5;
        const offset = gridSize / 4;

        ctx.beginPath();
        ctx.arc(part.x * gridSize + offset, part.y * gridSize + offset, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(part.x * gridSize + gridSize - offset, part.y * gridSize + offset, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        } else {
        ctx.fillStyle = '#33ff33';
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    }
    });
}

// Controle do teclado
document.addEventListener('keydown', e => {
    if (!gameStarted) return;

    if (e.key === 'ArrowUp' && direction.y === 0) direction = { x: 0, y: -1 };
    if (e.key === 'ArrowDown' && direction.y === 0) direction = { x: 0, y: 1 };
    if (e.key === 'ArrowLeft' && direction.x === 0) direction = { x: -1, y: 0 };
    if (e.key === 'ArrowRight' && direction.x === 0) direction = { x: 1, y: 0 };
});

// Botão iniciar
startBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    initGame();
});

// Botão reiniciar
restartBtn.addEventListener('click', () => {
    restartBtn.style.display = 'none';
    initGame();
});
