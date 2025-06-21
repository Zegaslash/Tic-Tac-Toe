# Lesson 4: Game Logic & Winning Conditions 🏆

## 🎯 Lesson Goals
- Implement advanced game logic and algorithms
- Understand arrays, loops, and conditional statements
- Create robust win detection and draw handling
- Add game statistics and scoring
- Think like a programmer with algorithm design

---

## 🧠 Algorithm Thinking

Before we dive into coding, let's understand what an **algorithm** is:

**Algorithm** = A step-by-step process to solve a problem

Think of it like a recipe:
1. Gather ingredients (get data)
2. Follow steps in order (process data)
3. Check if it's done (evaluate result)
4. Serve the dish (return result)

Today we'll build algorithms to detect wins, handle draws, and manage game flow!

---

## 🎮 Let's Enhance Our Game Logic!

### Step 1: Improve Win Detection Algorithm

Let's make our win detection more robust and add some cool features. Update your `src/main.js` file:

```javascript
// Tic-Tac-Toe Game
console.log("Tic-Tac-Toe game is loading...");

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

// Get the main container
const app = document.getElementById('app');

// Create the game title
const title = document.createElement('h1');
title.textContent = 'Tic-Tac-Toe';
title.className = 'game-title';
app.appendChild(title);

// Create game statistics display
const statsDisplay = document.createElement('div');
statsDisplay.className = 'game-stats';
updateStatsDisplay();
app.appendChild(statsDisplay);

// Create player status display
const playerStatus = document.createElement('div');
playerStatus.className = 'player-status';
playerStatus.textContent = `Player ${currentPlayer}'s turn`;
app.appendChild(playerStatus);

// Create the game board
const gameBoardElement = document.createElement('div');
gameBoardElement.className = 'game-board';
app.appendChild(gameBoardElement);

// Create the 9 cells (3x3 grid)
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    gameBoardElement.appendChild(cell);
}

// Create reset button
const resetButton = document.createElement('button');
resetButton.className = 'reset-button';
resetButton.textContent = 'New Game';
resetButton.addEventListener('click', resetGame);
app.appendChild(resetButton);

// Function to handle cell clicks
function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.dataset.index);
    
    if (gameBoard[index] === '' && gameActive) {
        // Place the current player's mark
        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(`player-${currentPlayer.toLowerCase()}`);
        
        // Add placement animation
        cell.style.animation = 'pop-in 0.3s ease-out';
        
        // Check for win or draw
        if (checkWin()) {
            handleGameEnd('win');
        } else if (checkDraw()) {
            handleGameEnd('draw');
        } else {
            // Switch players
            switchPlayer();
        }
    }
}

// Function to switch players
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerStatus.textContent = `Player ${currentPlayer}'s turn`;
    
    // Add visual indicator for current player
    playerStatus.className = `player-status player-${currentPlayer.toLowerCase()}`;
}

// Enhanced win detection algorithm
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
    // Check if all cells are filled
    return gameBoard.every(cell => cell !== '');
}

// Function to handle game end
function handleGameEnd(result) {
    gameActive = false;
    
    if (result === 'win') {
        gameStats[`${currentPlayer.toLowerCase()}Wins`]++;
        playerStatus.textContent = `Player ${currentPlayer} wins! 🎉`;
        playerStatus.className = 'player-status winner';
    } else if (result === 'draw') {
        gameStats.draws++;
        playerStatus.textContent = "It's a draw! 🤝";
        playerStatus.className = 'player-status draw';
    }
    
    gameStats.totalGames++;
    updateStatsDisplay();
    
    // Add game over animation
    gameBoardElement.classList.add('game-over');
}

// Function to highlight winning cells
function highlightWinningCells(winningCells) {
    winningCells.forEach((index, i) => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.classList.add('winner');
        // Stagger the animation
        cell.style.animationDelay = `${i * 0.1}s`;
    });
}

// Function to reset the game
function resetGame() {
    // Reset game state
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Reset visual elements
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
        cell.style.animation = '';
    });
    
    // Reset status
    playerStatus.textContent = `Player ${currentPlayer}'s turn`;
    playerStatus.className = 'player-status player-x';
    
    // Remove game over state
    gameBoardElement.classList.remove('game-over');
}

// Function to update statistics display
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
}
```

### Step 2: Add Enhanced Styling

Update your `src/style.css` file with these new styles:

```css
/* Game statistics */
.game-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: white;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
    font-weight: bold;
    color: #666;
}

.stat-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
}

/* Player status enhancements */
.player-status.player-x {
    background: #fdf2f2;
    color: #e74c3c;
    border-left: 5px solid #e74c3c;
}

.player-status.player-o {
    background: #f0f8ff;
    color: #3498db;
    border-left: 5px solid #3498db;
}

.player-status.winner {
    background: #d4edda;
    color: #155724;
    border-left: 5px solid #28a745;
    animation: winner-glow 2s infinite;
}

.player-status.draw {
    background: #fff3cd;
    color: #856404;
    border-left: 5px solid #ffc107;
}

/* Reset button */
.reset-button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.reset-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.reset-button:active {
    transform: translateY(0);
}

/* Enhanced animations */
@keyframes pop-in {
    0% { 
        transform: scale(0) rotate(180deg);
        opacity: 0;
    }
    70% { 
        transform: scale(1.1) rotate(0deg);
        opacity: 1;
    }
    100% { 
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

@keyframes winner-glow {
    0%, 100% { box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
    50% { box-shadow: 0 2px 20px rgba(40, 167, 69, 0.3); }
}

/* Game over state */
.game-board.game-over .cell:not(.winner) {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Enhanced winning cells */
.cell.winner {
    background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
    color: white !important;
    animation: winner-pulse 1s infinite;
    box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
}

@keyframes winner-pulse {
    0% { 
        transform: scale(1);
        box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
    }
    50% { 
        transform: scale(1.05);
        box-shadow: 0 0 30px rgba(46, 204, 113, 0.8);
    }
    100% { 
        transform: scale(1);
        box-shadow: 0 0 20px rgba(46, 204, 113, 0.5);
    }
}
```

---

## 🧠 Understanding the Algorithms

### Win Detection Algorithm
```javascript
function checkWin() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}
```

**How it works:**
1. Define all possible winning combinations
2. Loop through each combination
3. Check if all three cells have the same value
4. Return true if a win is found, false otherwise

### Draw Detection Algorithm
```javascript
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}
```

**How it works:**
1. Use the `every()` method to check all cells
2. Return true only if every cell is filled
3. Simple but effective!

---

## 🎯 Test Your Enhanced Game!

Try these scenarios:
1. **Win Detection**: Get three X's or O's in a row
2. **Draw Detection**: Fill the entire board without a winner
3. **Statistics**: Play multiple games and watch the stats update
4. **Reset Function**: Use the "New Game" button to start fresh
5. **Animations**: Watch the smooth animations and effects

---

## 🧠 Key Concepts You Learned

1. **Algorithm Design**: Step-by-step problem solving
2. **Array Methods**: `every()`, `forEach()`, loops
3. **Conditional Logic**: Complex decision making
4. **State Management**: Tracking multiple game variables
5. **Event Handling**: Responding to user actions
6. **Animation**: Making interfaces feel responsive

---

## 🎨 Advanced Customization Challenge

**Try these advanced features:**

1. **AI Opponent**: Add a simple computer player
2. **Game History**: Show the last few moves
3. **Undo Move**: Allow players to undo their last move
4. **Custom Themes**: Let players choose different color schemes

Example AI opponent:
```javascript
function makeAIMove() {
    const emptyCells = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cell = document.querySelector(`[data-index="${randomIndex}"]`);
        cell.click();
    }
}
```

---

## 🔧 Debugging Tips

**When things go wrong:**

1. **Console Logging**: Add `console.log()` to see what's happening
2. **Step-by-Step Testing**: Test each function individually
3. **Visual Debugging**: Use browser dev tools to inspect elements
4. **Error Handling**: Add try/catch blocks for robustness

---

## 🎯 What's Working Now

✅ **Advanced Win Detection**: Robust algorithm for all winning combinations  
✅ **Draw Detection**: Knows when the game is a tie  
✅ **Game Statistics**: Tracks wins, losses, and draws  
✅ **Reset Functionality**: Start new games easily  
✅ **Enhanced Animations**: Smooth, professional feel  
✅ **Visual Feedback**: Clear indication of game state  

---

## 🚀 What's Next?

In **Lesson 5**, we'll add:
- Sound effects and audio feedback
- Local storage for persistent statistics
- Advanced animations and effects
- Mobile optimization

---

## 💡 Pro Tips

- **Think algorithmically**: Break complex problems into simple steps
- **Test edge cases**: What happens in unusual situations?
- **Optimize for performance**: Make your code efficient
- **Plan for expansion**: Design code that's easy to extend

---

## 🎉 Algorithm Master!

You've successfully:
- ✅ Built complex game logic from scratch
- ✅ Implemented robust win/draw detection
- ✅ Created a complete game statistics system
- ✅ Added professional animations and effects
- ✅ Thought like a programmer with algorithm design

**You're now an algorithm expert!** 🧠✨

---

**Ready for Lesson 5? Let's add some polish and advanced features! ✨** 