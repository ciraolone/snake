// Inizializzazione delle variabili
let canvas, ctx;
let snake = [];
let food = {};
let direction = null;  // Inizialmente nessuna direzione
let score = 0;
let gridSize = 20;
let tileCount = { x: 20, y: 20 };  // Inizializziamo con valori di default
let gameOver = false;
let gameOverText = '';
let highScore = 0;

// Funzione di inizializzazione
function init() {
    canvas = document.getElementById('game-board');
    ctx = canvas.getContext('2d');
    
    // Imposta le dimensioni del canvas
    resizeCanvas();

    // Crea il serpente iniziale (un singolo quadratino al centro)
    let centerX = Math.floor(tileCount.x / 2);
    let centerY = Math.floor(tileCount.y / 2);
    snake = [{ x: centerX, y: centerY }];

    // Genera il primo cibo
    generateFood();

    // Avvia il gioco
    draw();  // Disegna la situazione iniziale
    document.addEventListener('keydown', startGameOnFirstKeyPress);

    // Aggiungi l'event listener per il ridimensionamento della finestra
    window.addEventListener('resize', resizeCanvas);

    // Inizializza i punteggi solo se gli elementi esistono
    const highScoreElement = document.getElementById('high-score-value');
    if (highScoreElement) {
        highScoreElement.textContent = highScore;
    }
    const scoreElement = document.getElementById('score-value');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

// Funzione per avviare il gioco alla prima pressione di un tasto
function startGameOnFirstKeyPress(event) {
    changeDirection(event);
    if (direction !== null) {
        document.removeEventListener('keydown', startGameOnFirstKeyPress);
        document.addEventListener('keydown', changeDirection);
        gameLoop();
    }
}

// Funzione per ridimensionare il canvas
function resizeCanvas() {
    let containerWidth = document.getElementById('game-container').offsetWidth;
    let containerHeight = document.getElementById('game-container').offsetHeight;
    
    // Calcoliamo il numero di celle in base alle dimensioni del container
    let cellSize = Math.min(Math.floor(containerWidth / 30), Math.floor(containerHeight / 20));
    
    // Aggiungiamo un margine di una cella su tutti i lati
    tileCount = {
        x: Math.floor((containerWidth - cellSize * 2) / cellSize),
        y: Math.floor((containerHeight - cellSize * 2) / cellSize)
    };
    
    // Impostiamo le dimensioni del canvas per adattarsi esattamente alla griglia
    canvas.width = tileCount.x * cellSize;
    canvas.height = tileCount.y * cellSize;
    
    gridSize = cellSize;
}

// Funzione principale del gioco
function gameLoop() {
    if (!gameOver) {
        moveSnake();
        if (checkCollision()) {
            gameOver = true;
            gameOverText = 'Game Over! Punteggio: ' + score;
            draw(); // Disegna l'ultima posizione del serpente
            document.addEventListener('keydown', restartGame);
            return;
        }
        draw();
        setTimeout(gameLoop, 100);
    }
}

// Funzione per muovere il serpente
function moveSnake() {
    let head = {x: snake[0].x, y: snake[0].y};
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    snake.unshift(head);
    if (head.x !== food.x || head.y !== food.y) {
        snake.pop();
    } else {
        score++;
        // Aggiorna il punteggio più alto se necessario
        if (score > highScore) {
            highScore = score;
            const highScoreElement = document.getElementById('high-score-value');
            if (highScoreElement) {
                highScoreElement.textContent = highScore;
            }
        }
        const scoreElement = document.getElementById('score-value');
        if (scoreElement) {
            scoreElement.textContent = score;
        }
        generateFood();
    }
}

// Funzione per controllare le collisioni
function checkCollision() {
    let head = snake[0];
    return (
        head.x < 0 || head.x >= tileCount.x ||
        head.y < 0 || head.y >= tileCount.y ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

// Funzione per generare il cibo
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount.x),
        y: Math.floor(Math.random() * tileCount.y)
    };
}

// Funzione per cambiare direzione
function changeDirection(event) {
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;

    switch(event.keyCode) {
        case KEY_LEFT:
            if (direction !== 'right') direction = 'left';
            break;
        case KEY_UP:
            if (direction !== 'down') direction = 'up';
            break;
        case KEY_RIGHT:
            if (direction !== 'left') direction = 'right';
            break;
        case KEY_DOWN:
            if (direction !== 'up') direction = 'down';
            break;
    }
}

// Funzione per disegnare il gioco
function draw() {
    // Pulisci il canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Disegna il bordo del gioco
    ctx.strokeStyle = '#2c2c2c';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Disegna il serpente e il cibo con lo stesso colore grigino scuro vintage
    ctx.fillStyle = '#4a4a4a'; // Colore grigino scuro vintage
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Disegna il cibo
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Se il gioco è finito, mostra il testo di Game Over
    if (gameOver) {
        ctx.fillStyle = '#4a4a4a'; // Stesso colore grigino scuro vintage
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(gameOverText, canvas.width / 2, canvas.height / 2);
    }
}

// Funzione per riavviare il gioco
function restartGame(event) {
    if (gameOver) {
        gameOver = false;
        score = 0;
        document.getElementById('score-value').textContent = score;
        // Non resettare highScore qui
        snake = [{ x: Math.floor(tileCount.x / 2), y: Math.floor(tileCount.y / 2) }];
        direction = null;
        generateFood();
        document.removeEventListener('keydown', restartGame);
        document.addEventListener('keydown', startGameOnFirstKeyPress);
        draw();
    }
}

// Avvia il gioco
window.onload = init;
