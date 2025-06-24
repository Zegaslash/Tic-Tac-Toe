import './style.css'

// Tic-Tac-Toe Game
console.log("Tic-Tac-Toe game is loading...");

// Audio context for sound effects
let audioContext;
let sounds = {};

// Initialize audio
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createSounds();
    } catch (error) {
        console.log('Audio not supported in this browser');
    }
}

// Create sound effects
function createSounds() {
    // Click sound
    sounds.click = createTone(800, 0.1, 'sawtooth');
    
    // Win sound
    sounds.win = createTone(523, 0.3, 'square'); // C5 note
    
    // Draw sound
    sounds.draw = createTone(440, 0.2, 'sine'); // A4 note
    
    // Switch player sound
    sounds.switch = createTone(600, 0.1, 'sawtooth');
}

// Create a simple tone
function createTone(frequency, duration, type) {
    return function() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    };
}

// Game state variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameStats = {
    xWins: 0,
    oWins: 0,
    draws: 0,
    totalGames: 0
};

// AI opponent settings
let aiEnabled = false;
let aiDifficulty = 'easy'; // 'easy', 'medium', 'hard'

// Get the main container
const app = document.getElementById('app');

// Create the game title with animation
const title = document.createElement('h1');
title.textContent = 'Tic-Tac-Toe';
title.className = 'game-title animated-title';
app.appendChild(title);

// Create game statistics display
const statsDisplay = document.createElement('div');
statsDisplay.className = 'game-stats';
app.appendChild(statsDisplay);

// Create game mode selector
const gameModeSelector = document.createElement('div');
gameModeSelector.className = 'game-mode-selector';
gameModeSelector.innerHTML = `
    <h3>Game Mode</h3>
    <div class="mode-buttons">
        <button class="mode-btn active" data-mode="pvp">Player vs Player</button>
        <button class="mode-btn" data-mode="ai">Player vs AI</button>
    </div>
    <div class="ai-settings" style="display: none;">
        <h4>AI Difficulty</h4>
        <select id="ai-difficulty">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
        </select>
    </div>
`;
app.appendChild(gameModeSelector);

// Create player status display
const playerStatus = document.createElement('div');
playerStatus.className = 'player-status';
playerStatus.textContent = `Player ${currentPlayer}'s turn`;
app.appendChild(playerStatus);

// Create the game board with enhanced styling
const gameBoardElement = document.createElement('div');
gameBoardElement.className = 'game-board';
app.appendChild(gameBoardElement);

// Create the 9 cells with enhanced interactions
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    
    // Add enhanced event listeners
    cell.addEventListener('click', handleCellClick);
    cell.addEventListener('mouseenter', handleCellHover);
    cell.addEventListener('mouseleave', handleCellLeave);
    
    gameBoardElement.appendChild(cell);
}

// Create reset button with enhanced styling
const resetButton = document.createElement('button');
resetButton.className = 'reset-button';
resetButton.innerHTML = '<span>🔄</span> New Game';
resetButton.addEventListener('click', resetGame);
app.appendChild(resetButton);

// Create game history section
const historySection = document.createElement('div');
historySection.className = 'game-history';
historySection.innerHTML = `
    <h3>Recent Games</h3>
    <div class="history-list"></div>
    <button class="clear-history-btn">Clear History</button>
`;
app.appendChild(historySection);

// Function to update history display
function updateHistoryDisplay() {
    const history = loadGameHistory();
    const historyList = historySection.querySelector('.history-list');
    
    if (history.length === 0) {
        historyList.innerHTML = '<div class="no-history">No games played yet</div>';
        return;
    }
    
    historyList.innerHTML = history.slice(-10).reverse().map(game => `
        <div class="history-item">
            <span class="history-result ${game.result}">${game.result.toUpperCase()}</span>
            <span class="history-player">${game.winner || 'Draw'}</span>
            <span class="history-date">${new Date(game.timestamp).toLocaleDateString()}</span>
        </div>
    `).join('');
}

// Clear history button
const clearHistoryBtn = historySection.querySelector('.clear-history-btn');
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all game history?')) {
        localStorage.removeItem('ticTacToeHistory');
        updateHistoryDisplay();
    }
});

// Initialize audio when user first interacts
document.addEventListener('click', function initAudioOnFirstClick() {
    initAudio();
    document.removeEventListener('click', initAudioOnFirstClick);
});

// Enhanced cell hover effects
function handleCellHover(event) {
    if (!gameActive) return;
    
    const cell = event.target;
    if (cell.textContent === '') {
        cell.classList.add('hover-preview');
        cell.textContent = currentPlayer;
        cell.style.opacity = '0.5';
    }
}

function handleCellLeave(event) {
    const cell = event.target;
    if (cell.textContent === currentPlayer && cell.style.opacity === '0.5') {
        cell.textContent = '';
        cell.style.opacity = '1';
    }
    cell.classList.remove('hover-preview');
}

// Enhanced cell click handler
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);
    
    if (gameBoard[index] === '' && gameActive) {
        // Play click sound
        if (sounds.click) sounds.click();
        
        // Place the current player's mark
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(`player-${currentPlayer.toLowerCase()}`);
        cell.style.opacity = '1';
        
        // Enhanced placement animation
        cell.style.animation = 'enhanced-pop-in 0.4s ease-out';
        
        // Check for win or draw
        if (checkWin()) {
            handleGameEnd('win');
        } else if (checkDraw()) {
            handleGameEnd('draw');
        } else {
            // Switch players with sound
            if (sounds.switch) sounds.switch();
            switchPlayer();
            
            // Make AI move if enabled
            if (aiEnabled && currentPlayer === 'O') {
                makeAIMove();
            }
        }
    }
}

// Enhanced player switching
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Animate status change
    playerStatus.style.animation = 'status-change 0.3s ease-out';
    setTimeout(() => {
        playerStatus.textContent = `Player ${currentPlayer}'s turn`;
        playerStatus.className = `player-status player-${currentPlayer.toLowerCase()}`;
        playerStatus.style.animation = '';
    }, 150);
}

// Enhanced win detection with sound
function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightWinningCells(condition);
            return true;
        }
    }
    return false;
}

// Enhanced draw detection
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// Enhanced game end handling
function handleGameEnd(result) {
    gameActive = false;
    
    // Determine winner for history
    let winner = null;
    if (result === 'win') {
        winner = currentPlayer;
        gameStats[`${currentPlayer.toLowerCase()}Wins`]++;
        playerStatus.textContent = `Player ${currentPlayer} wins! 🎉`;
        playerStatus.className = 'player-status winner';
        if (sounds.win) sounds.win();
    } else if (result === 'draw') {
        gameStats.draws++;
        playerStatus.textContent = "It's a draw! 🤝";
        playerStatus.className = 'player-status draw';
        if (sounds.draw) sounds.draw();
    }
    
    gameStats.totalGames++;
    updateStatsDisplay();
    saveGameStats(); // Save to local storage
    
    // Save game to history
    saveGameHistory({
        result: result,
        winner: winner,
        board: [...gameBoard],
        timestamp: new Date().toISOString()
    });
    
    // Update history display
    updateHistoryDisplay();
    
    // Enhanced game over animation
    gameBoardElement.classList.add('game-over');
    
    // Add confetti effect for wins
    if (result === 'win') {
        createConfetti();
    }
}

// Enhanced winning cells highlight
function highlightWinningCells(winningCells) {
    winningCells.forEach((index, i) => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('winner');
        cell.style.animationDelay = `${i * 0.1}s`;
    });
}

// Enhanced reset game
function resetGame() {
    // Play reset sound
    if (sounds.click) sounds.click();
    
    // Reset game state
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Reset visual elements with animation
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.animation = 'reset-cell 0.3s ease-out';
            setTimeout(() => {
                cell.style.animation = '';
            }, 300);
        }, index * 50);
    });
    
    // Reset status with animation
    playerStatus.style.animation = 'status-change 0.3s ease-out';
    setTimeout(() => {
        playerStatus.textContent = `Player ${currentPlayer}'s turn`;
        playerStatus.className = 'player-status player-x';
        playerStatus.style.animation = '';
    }, 150);
    
    // Remove game over state
    gameBoardElement.classList.remove('game-over');
    
    // Make AI move if it's AI's turn
    if (aiEnabled && currentPlayer === 'O') {
        setTimeout(() => makeAIMove(), 300);
    }
}

// Enhanced statistics display
function updateStatsDisplay() {
    statsDisplay.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">X Wins:</span>
            <span class="stat-value">${gameStats.xWins}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">O Wins:</span>
            <span class="stat-value">${gameStats.oWins}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Draws:</span>
            <span class="stat-value">${gameStats.draws}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Games:</span>
            <span class="stat-value">${gameStats.totalGames}</span>
        </div>
    `;
    
    // Animate stat changes
    const statValues = statsDisplay.querySelectorAll('.stat-value');
    statValues.forEach(value => {
        value.style.animation = 'stat-update 0.5s ease-out';
        setTimeout(() => {
            value.style.animation = '';
        }, 500);
    });
}

// Confetti effect for wins
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)];
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// AI move selection
function getAIMove() {
    if (aiDifficulty === 'easy') {
        return Math.random() < 0.3 ? getRandomMove() : getSmartMove();
    } else if (aiDifficulty === 'medium') {
        return Math.random() < 0.7 ? getSmartMove() : getRandomMove();
    } else {
        return getSmartMove();
    }
}

// Get a random available move
function getRandomMove() {
    const availableMoves = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return null;
}

// Get a smart move (try to win or block)
function getSmartMove() {
    // First, try to win
    const winningMove = findWinningMove('O');
    if (winningMove !== null) return winningMove;
    
    // Second, block opponent's win
    const blockingMove = findWinningMove('X');
    if (blockingMove !== null) return blockingMove;

    // Third, Stop Trap
    if (gameBoard[0] === 'X' && gameBoard[8] === 'X') return 5;
    if (gameBoard[2] === 'X' && gameBoard[6] === 'X') return 3;
    if (gameBoard[5] === 'X' && gameBoard[7] === 'X') return 8;
    if (gameBoard[1] === 'X' && gameBoard[3] === 'X') return 0;
    if (gameBoard[1] === 'X' && gameBoard[5] === 'X') return 2;
    if (gameBoard[7] === 'X' && gameBoard[3] === 'X') return 6;
    if (gameBoard[8] === 'X' && gameBoard[1] === 'X') return 2;
    if (gameBoard[6] === 'X' && gameBoard[1] === 'X') return 0;
    if (gameBoard[0] === 'X' && gameBoard[7] === 'X') return 6;
    if (gameBoard[2] === 'X' && gameBoard[7] === 'X') return 8;

    // Fourth, take center if available
    if (gameBoard[0] === 'X' && gameBoard[4] === '') return 4;
    if (gameBoard[2] === 'X' && gameBoard[4] === '') return 4;
    if (gameBoard[6] === 'X' && gameBoard[4] === '') return 4;
    if (gameBoard[8] === 'X' && gameBoard[4] === '') return 4;

    // Fifth, Respond to Side
    if (gameBoard[1] === 'X' && gameBoard[4] === '') return 7;
    if (gameBoard[3] === 'X' && gameBoard[4] === '') return 5;
    if (gameBoard[5] === 'X' && gameBoard[4] === '') return 3;
    if (gameBoard[7] === 'X' && gameBoard[4] === '') return 1;

    // Finally, take any available move
    return getRandomMove();
}

// Find a winning move for a player
function findWinningMove(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        const cells = [gameBoard[a], gameBoard[b], gameBoard[c]];
        const playerCount = cells.filter(cell => cell === player).length;
        const emptyCount = cells.filter(cell => cell === '').length;
        
        if (playerCount === 2 && emptyCount === 1) {
            // Find the empty cell
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    return null;
}

// Make AI move
function makeAIMove() {
    if (!aiEnabled || !gameActive || currentPlayer !== 'O') return;
    
    setTimeout(() => {
        const aiMove = getAIMove();
        if (aiMove !== null) {
            const cell = document.querySelector(`[data-index="${aiMove}"]`);
            cell.click();
        }
    }, 500); // Small delay to make it feel more natural
}

// Local storage functions
function saveGameStats() {
    localStorage.setItem('ticTacToeStats', JSON.stringify(gameStats));
}

function loadGameStats() {
    const saved = localStorage.getItem('ticTacToeStats');
    if (saved) {
        gameStats = JSON.parse(saved);
        updateStatsDisplay();
    }
}

function saveGameHistory(move) {
    let history = JSON.parse(localStorage.getItem('ticTacToeHistory') || '[]');
    history.push({
        ...move,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 games
    if (history.length > 10) {
        history = history.slice(-10);
    }
    
    localStorage.setItem('ticTacToeHistory', JSON.stringify(history));
}

function loadGameHistory() {
    return JSON.parse(localStorage.getItem('ticTacToeHistory') || '[]');
}

function saveSettings() {
    const settings = {
        aiEnabled,
        aiDifficulty,
        soundEnabled: true // You can add sound toggle later
    };
    localStorage.setItem('ticTacToeSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('ticTacToeSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        aiEnabled = settings.aiEnabled;
        aiDifficulty = settings.aiDifficulty;
        
        // Update UI to reflect loaded settings
        updateGameModeUI();
    }
}

// Function to update game mode UI based on loaded settings
function updateGameModeUI() {
    const modeButtons = gameModeSelector.querySelectorAll('.mode-btn');
    const aiSettings = gameModeSelector.querySelector('.ai-settings');
    const aiDifficultySelect = document.getElementById('ai-difficulty');
    
    // Update mode buttons
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if ((btn.dataset.mode === 'ai' && aiEnabled) || (btn.dataset.mode === 'pvp' && !aiEnabled)) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide AI settings
    aiSettings.style.display = aiEnabled ? 'block' : 'none';
    
    // Update difficulty selector
    if (aiDifficultySelect) {
        aiDifficultySelect.value = aiDifficulty;
    }
}

// Add event listeners for mode selection
const modeButtons = gameModeSelector.querySelectorAll('.mode-btn');
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.mode;
        aiEnabled = mode === 'ai';
        
        const aiSettings = gameModeSelector.querySelector('.ai-settings');
        aiSettings.style.display = aiEnabled ? 'block' : 'none';
        
        saveSettings(); // Save settings to local storage
        resetGame();
    });
});

// AI difficulty selector
const aiDifficultySelect = document.getElementById('ai-difficulty');
aiDifficultySelect.addEventListener('change', (e) => {
    aiDifficulty = e.target.value;
    saveSettings(); // Save settings to local storage
});

// Initialize everything when page loads
function initializeGame() {
    loadGameStats();
    loadSettings();
    updateStatsDisplay();
    updateHistoryDisplay();
}

// Call initialization
initializeGame();