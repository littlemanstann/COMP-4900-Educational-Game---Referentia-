// Game constants
const ROUNDS_PER_DIFFICULTY_TIER = 2;
const MAX_RANDOM_OFFSET = 3;
const BASE_SPELL_DAMAGE = 20;
const DAMAGE_VARIANCE = 10;
const SPELL_TIMEOUT_MS = 8000; // Time before spell times out
const PLAYER_MAX_HEALTH = 100;

// Game state
const gameState = {
    score: 0,
    health: PLAYER_MAX_HEALTH,
    round: 1,
    currentMonster: null,
    currentSpell: null,
    isPlaying: false,
    spellsForRound: [],
    spellTimer: null
};

// Spell database - various magic spells
const spells = [
    "fireball", "lightning", "freeze", "heal", "shield",
    "meteor", "tornado", "earthquake", "tsunami", "blizzard",
    "thunder", "poison", "darkness", "light", "explosion",
    "teleport", "levitate", "invisible", "strength", "speed",
    "confuse", "charm", "curse", "bless", "protect",
    "summon", "banish", "transform", "duplicate", "restore"
];

// Monster types with their properties
const monsterTypes = [
    { name: "Goblin", health: 30, damage: 5, color: "#7cb342" },
    { name: "Orc", health: 50, damage: 8, color: "#8d6e63" },
    { name: "Troll", health: 70, damage: 10, color: "#6d4c41" },
    { name: "Ogre", health: 90, damage: 12, color: "#5d4037" },
    { name: "Dragon", health: 120, damage: 15, color: "#d32f2f" },
    { name: "Demon", health: 100, damage: 13, color: "#7b1fa2" },
    { name: "Wraith", health: 80, damage: 11, color: "#455a64" },
    { name: "Vampire", health: 85, damage: 12, color: "#c62828" },
    { name: "Wyvern", health: 110, damage: 14, color: "#e64a19" },
    { name: "Basilisk", health: 95, damage: 13, color: "#558b2f" }
];

// DOM elements
const elements = {
    score: document.getElementById('score'),
    health: document.getElementById('health'),
    round: document.getElementById('round'),
    monsterImage: document.getElementById('monster-image'),
    monsterName: document.getElementById('monster-name'),
    monsterHealthFill: document.getElementById('monster-health-fill'),
    currentSpell: document.getElementById('current-spell'),
    spellInput: document.getElementById('spell-input'),
    feedback: document.getElementById('feedback'),
    startBtn: document.getElementById('start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    gameOver: document.getElementById('game-over'),
    gameOverTitle: document.getElementById('game-over-title'),
    gameOverMessage: document.getElementById('game-over-message'),
    finalScore: document.getElementById('final-score')
};

// Initialize the game
function init() {
    elements.startBtn.addEventListener('click', startGame);
    elements.restartBtn.addEventListener('click', resetGame);
    elements.spellInput.addEventListener('input', checkSpell);
    elements.spellInput.addEventListener('keypress', handleKeyPress);
}

// Start the game
function startGame() {
    gameState.isPlaying = true;
    gameState.score = 0;
    gameState.health = PLAYER_MAX_HEALTH;
    gameState.round = 1;
    
    updateUI();
    elements.startBtn.style.display = 'none';
    elements.restartBtn.style.display = 'inline-block';
    elements.gameOver.style.display = 'none';
    elements.spellInput.disabled = false;
    elements.spellInput.value = '';
    elements.spellInput.focus();
    
    nextRound();
}

// Reset the game
function resetGame() {
    gameState.isPlaying = false;
    elements.startBtn.style.display = 'inline-block';
    elements.restartBtn.style.display = 'none';
    elements.spellInput.disabled = true;
    elements.spellInput.value = '';
    elements.currentSpell.textContent = '';
    elements.feedback.textContent = '';
    elements.monsterImage.src = '';
    elements.monsterName.textContent = '';
    elements.gameOver.style.display = 'none';
    
    startGame();
}

// Start a new round
function nextRound() {
    if (!gameState.isPlaying) return;
    
    // Select a monster based on round difficulty
    const monsterIndex = Math.min(Math.floor(gameState.round / ROUNDS_PER_DIFFICULTY_TIER), monsterTypes.length - 1);
    const randomOffset = Math.floor(Math.random() * MAX_RANDOM_OFFSET) - 1;
    const finalIndex = Math.max(0, Math.min(monsterTypes.length - 1, monsterIndex + randomOffset));
    const monsterType = monsterTypes[finalIndex];
    
    // Create new monster with scaling health
    gameState.currentMonster = {
        ...monsterType,
        maxHealth: monsterType.health + (gameState.round - 1) * 10,
        currentHealth: monsterType.health + (gameState.round - 1) * 10
    };
    
    // Generate monster image using colored emoji representation
    createMonsterImage();
    
    elements.monsterName.textContent = gameState.currentMonster.name;
    updateMonsterHealth();
    
    // Generate spells for this round (3-5 spells per monster)
    const spellCount = 3 + Math.floor(Math.random() * 3);
    gameState.spellsForRound = [];
    for (let i = 0; i < spellCount; i++) {
        const spell = spells[Math.floor(Math.random() * spells.length)];
        gameState.spellsForRound.push(spell);
    }
    
    nextSpell();
}

// Create a visual representation of the monster
function createMonsterImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw monster based on type
    ctx.fillStyle = gameState.currentMonster.color;
    
    // Body
    ctx.beginPath();
    ctx.ellipse(100, 130, 60, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Head
    ctx.beginPath();
    ctx.arc(100, 70, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(85, 65, 8, 0, Math.PI * 2);
    ctx.arc(115, 65, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(85, 65, 4, 0, Math.PI * 2);
    ctx.arc(115, 65, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth (angry)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(100, 80, 15, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();
    
    // Arms
    ctx.fillStyle = gameState.currentMonster.color;
    ctx.beginPath();
    ctx.ellipse(50, 130, 15, 40, -0.3, 0, Math.PI * 2);
    ctx.ellipse(150, 130, 15, 40, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Convert canvas to data URL
    elements.monsterImage.src = canvas.toDataURL();
}

// Load next spell
function nextSpell() {
    if (!gameState.isPlaying) return;
    
    if (gameState.spellsForRound.length === 0) {
        // Monster defeated
        monsterDefeated();
        return;
    }
    
    gameState.currentSpell = gameState.spellsForRound.shift();
    elements.currentSpell.textContent = gameState.currentSpell;
    elements.spellInput.value = '';
    elements.feedback.textContent = '';
    elements.spellInput.focus();
    
    // Start timer for spell timeout
    if (gameState.spellTimer) {
        clearTimeout(gameState.spellTimer);
    }
    gameState.spellTimer = setTimeout(spellTimeout, SPELL_TIMEOUT_MS);
}

// Handle spell timeout (player takes damage)
function spellTimeout() {
    if (!gameState.isPlaying || !gameState.currentSpell) return;
    
    // Player takes damage
    const damage = gameState.currentMonster.damage;
    gameState.health -= damage;
    updateUI();
    
    elements.feedback.textContent = `⚠️ Too Slow! -${damage} Health`;
    elements.feedback.className = 'feedback-wrong';
    
    // Check if player is defeated
    if (gameState.health <= 0) {
        gameState.health = 0;
        updateUI();
        setTimeout(() => gameOver(false), 1000);
        return;
    }
    
    // Move to next spell
    setTimeout(nextSpell, 1000);
}

// Validate if typed spell matches target
function validateSpell(typedText) {
    if (!gameState.currentSpell) return false;
    return typedText.toLowerCase().trim() === gameState.currentSpell.toLowerCase();
}

// Check if the typed spell matches
function checkSpell(e) {
    if (!gameState.isPlaying || !gameState.currentSpell) return;
    
    if (validateSpell(e.target.value)) {
        castSpell();
    }
}

// Handle key press for Enter
function handleKeyPress(e) {
    if (e.key === 'Enter' && validateSpell(e.target.value)) {
        castSpell();
    }
}

// Cast the spell (correct input)
function castSpell() {
    if (!gameState.isPlaying) return;
    
    // Clear spell timer
    if (gameState.spellTimer) {
        clearTimeout(gameState.spellTimer);
        gameState.spellTimer = null;
    }
    
    // Show success feedback
    elements.feedback.textContent = '✨ Spell Cast! ✨';
    elements.feedback.className = 'feedback-correct';
    
    // Damage the monster
    const damage = BASE_SPELL_DAMAGE + Math.floor(Math.random() * DAMAGE_VARIANCE);
    gameState.currentMonster.currentHealth -= damage;
    gameState.score += 10;
    
    updateUI();
    updateMonsterHealth();
    
    // Check if monster is defeated
    if (gameState.currentMonster.currentHealth <= 0) {
        gameState.currentMonster.currentHealth = 0;
        updateMonsterHealth();
        setTimeout(monsterDefeated, 500);
    } else {
        // Next spell
        setTimeout(nextSpell, 500);
    }
}

// Monster is defeated
function monsterDefeated() {
    gameState.score += 50 + (gameState.round * 10);
    gameState.round++;
    updateUI();
    
    elements.feedback.textContent = '🎉 Monster Defeated! 🎉';
    elements.feedback.className = 'feedback-correct';
    
    setTimeout(() => {
        nextRound();
    }, 1500);
}

// Update monster health bar
function updateMonsterHealth() {
    const percentage = (gameState.currentMonster.currentHealth / gameState.currentMonster.maxHealth) * 100;
    elements.monsterHealthFill.style.width = percentage + '%';
}

// Update UI
function updateUI() {
    elements.score.textContent = gameState.score;
    elements.health.textContent = gameState.health;
    elements.round.textContent = gameState.round;
}

// Game over
function gameOver(isVictory = false) {
    gameState.isPlaying = false;
    elements.spellInput.disabled = true;
    elements.gameOver.style.display = 'block';
    
    if (isVictory) {
        elements.gameOverTitle.textContent = '🎊 Victory! 🎊';
        elements.gameOverMessage.textContent = 'You have defeated all the monsters!';
    } else {
        elements.gameOverTitle.textContent = '💀 Game Over 💀';
        elements.gameOverMessage.textContent = 'You have been defeated...';
    }
    
    elements.finalScore.textContent = `Final Score: ${gameState.score} | Rounds Completed: ${gameState.round - 1}`;
}

// Initialize the game when page loads
init();
