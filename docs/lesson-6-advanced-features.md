# Lesson 6: Advanced Features 🚀

## 🎯 Lesson Goals
- Add local storage for persistent game data
- Implement a simple AI opponent
- Create game history and replay features
- Add advanced game modes and settings
- Learn about data persistence and state management

---

## 💾 What We're Building Today

Today we'll add some really cool advanced features that will make your Tic-Tac-Toe game feel like a professional application!

**By the end of this lesson, you'll have:**
- Persistent game statistics that survive browser refreshes
- A simple AI opponent to play against
- Game history with move tracking
- Advanced settings and game modes
- Professional data management

---

## 🧠 Understanding Local Storage

**Local Storage** is like a permanent notebook for your browser. It can remember information even after you close the browser and come back later.

### How Local Storage Works
```javascript
// Save data
localStorage.setItem('key', 'value');

// Get data
const data = localStorage.getItem('key');

// Remove data
localStorage.removeItem('key');

// Clear all data
localStorage.clear();
```

### What We'll Store
- Game statistics (wins, losses, draws)
- Game history (moves made)
- Player preferences (AI difficulty, sound settings)
- High scores and achievements

---

## 🤖 Let's Add an AI Opponent!

### Step 1: Add AI Logic

Add this AI functionality to your `src/main.js` file:

```javascript
// AI opponent settings
let aiEnabled = false;
let aiDifficulty = 'easy'; // 'easy', 'medium', 'hard'

// AI move selection
function getAIMove() {
    if (aiDifficulty === 'easy') {
        return getRandomMove();
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
    
    // Third, take center if available
    if (gameBoard[4] === '') return 4;
    
    // Fourth, take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => gameBoard[index] === '');
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
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
```

### Step 2: Add Game Mode Selection

Add this UI for game modes:

```javascript
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
app.insertBefore(gameModeSelector, playerStatus);

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
        
        resetGame();
    });
});

// AI difficulty selector
const aiDifficultySelect = document.getElementById('ai-difficulty');
aiDifficultySelect.addEventListener('change', (e) => {
    aiDifficulty = e.target.value;
});
```

### Step 3: Update the Click Handler

Modify your `handleCellClick` function to include AI moves:

```javascript
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
```

---

## 💾 Add Local Storage for Persistence

### Step 1: Create Storage Functions

Add these functions to manage local storage:

```javascript
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
    
    // Keep only last 50 games
    if (history.length > 50) {
        history = history.slice(-50);
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
```

### Step 2: Update Game Functions

Modify your existing functions to use local storage:

```javascript
// Enhanced game end handling
function handleGameEnd(result) {
    gameActive = false;
    
    if (result === 'win') {
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
    
    // Enhanced game over animation
    gameBoardElement.classList.add('game-over');
    
    // Add confetti effect for wins
    if (result === 'win') {
        createConfetti();
    }
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
```

### Step 3: Initialize on Page Load

Add this to the end of your main code:

```javascript
// Initialize everything when page loads
function initializeGame() {
    loadGameStats();
    loadSettings();
    updateGameModeUI();
}

// Call initialization
initializeGame();
```

---

## 🎮 Add Game History Feature

### Step 1: Create History Display

Add this HTML structure:

```javascript
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
```

---

## 🎨 Add CSS for New Features

Add these styles to your `src/style.css`:

```css
/* Game mode selector */
.game-mode-selector {
    margin-bottom: 1rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.game-mode-selector h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.2rem;
}

.mode-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.mode-btn {
    padding: 0.5rem 1rem;
    border: 2px solid #667eea;
    background: white;
    color: #667eea;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
}

.mode-btn.active {
    background: #667eea;
    color: white;
}

.mode-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.ai-settings {
    padding: 1rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-settings h4 {
    margin-bottom: 0.5rem;
    color: #333;
}

#ai-difficulty {
    padding: 0.5rem;
    border: 2px solid #667eea;
    border-radius: 8px;
    background: white;
    color: #333;
    font-weight: bold;
}

/* Game history */
.game-history {
    margin-top: 2rem;
    padding: 1rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.game-history h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.2rem;
}

.history-list {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 1rem;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-result {
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
}

.history-result.win {
    background: #d4edda;
    color: #155724;
}

.history-result.draw {
    background: #fff3cd;
    color: #856404;
}

.history-player {
    font-weight: bold;
    color: #333;
}

.history-date {
    color: #666;
    font-size: 0.9rem;
}

.clear-history-btn {
    padding: 0.5rem 1rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: bold;
}

.clear-history-btn:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}
```

---

## 🧠 Key Concepts You Learned

1. **Local Storage**: Persistent data storage in the browser
2. **AI Algorithms**: Simple game AI with different difficulty levels
3. **State Management**: Managing complex game state
4. **Data Persistence**: Saving and loading user data
5. **Game History**: Tracking and displaying past games
6. **Settings Management**: User preferences and configuration

---

## 🎯 Test Your Advanced Features!

Try these new features:
1. **AI Opponent**: Switch to "Player vs AI" mode and play against the computer
2. **Different Difficulties**: Try Easy, Medium, and Hard AI
3. **Persistent Stats**: Refresh the page and see your stats are saved
4. **Game History**: View your recent games and results
5. **Settings Persistence**: Your game mode and AI difficulty are remembered

---

## 🚀 What's Next?

In **Lesson 7**, we'll add:
- Debugging tools and error handling
- Performance optimization
- Code refactoring and best practices
- Testing strategies

---

## 💡 Pro Tips

- **Test AI thoroughly**: Try different scenarios to see how the AI behaves
- **Check browser compatibility**: Local storage works in all modern browsers
- **Consider user experience**: AI moves should have a natural delay
- **Plan for expansion**: Design your code to easily add more features

---

## 🎉 Advanced Features Master!

You've successfully:
- ✅ Added a functional AI opponent with multiple difficulty levels
- ✅ Implemented persistent data storage with local storage
- ✅ Created game history tracking and display
- ✅ Built advanced game modes and settings
- ✅ Made your game feel like a professional application

**Your Tic-Tac-Toe game is now feature-complete!** 🎮✨

---

**Ready for Lesson 7? Let's polish and optimize your code! 🔧** 