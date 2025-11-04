// ============================================
// LEVEL CONFIGURATION - MODIFY THIS SECTION
// ============================================
const levelData = {
    monsterSprite: "monster.png",
    solution: "fireball",
    background: "background.png"
};
// ============================================

// Start game transition
function startGame() {
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    
    // Hide start screen
    startScreen.classList.add('hidden');
    
    // Show game container after start screen fades
    setTimeout(() => {
        startScreen.style.display = 'none';
        gameContainer.classList.add('visible');
        initializeLevel();
        // Focus on input after transition
        document.getElementById('answer-input').focus();
    }, 500);
}

// Initialize game with level data
function initializeLevel() {
    const backgroundImg = document.getElementById('background');
    const monsterImg = document.getElementById('monster');

    // Set background
    backgroundImg.src = levelData.background;
    backgroundImg.onerror = function() {
        this.classList.add('placeholder');
        this.alt = 'Background Placeholder';
    };

    // Set monster sprite
    monsterImg.src = levelData.monsterSprite;
    monsterImg.onerror = function() {
        this.classList.add('placeholder');
        this.alt = 'Monster Placeholder';
    };
}

// Callback function for correct answer
function onCorrectAnswer() {
    console.log("success");
    // Add your success logic here (animations, level progression, etc.)
}

// Callback function for incorrect answer
function onIncorrectAnswer() {
    console.log("failure");
    // Add your failure logic here (shake animation, lives reduction, etc.)
}

// Validate user input - IMPLEMENT YOUR VALIDATION LOGIC HERE
function validateAnswer(userInput) {
    // TODO: Add your validation logic here
    // This is where you'll check the answer against levelData.solution
    // Example implementation (remove/modify as needed):
    
    // if (userInput.toLowerCase() === levelData.solution.toLowerCase()) {
    //     onCorrectAnswer();
    // } else {
    //     onIncorrectAnswer();
    // }
}

// Handle form submission
function handleSubmit() {
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim();
    
    if (userAnswer) {
        validateAnswer(userAnswer);
        // Optionally clear input after submission
        // input.value = '';
    }
}

// Event listeners
document.getElementById('play-button').addEventListener('click', startGame);

document.getElementById('submit-button').addEventListener('click', handleSubmit);

document.getElementById('answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSubmit();
    }
});