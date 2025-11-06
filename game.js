// ============================================
// LEVEL CONFIGURATION - MODIFY THIS SECTION
// ============================================
import { levels } from './level-database.js';

let currLevel = 0; // Current level number
let currLevelData = levels[currLevel]; // Load current level from database

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

    if(document.getElementById('switch').checked){
        const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.classList.add('tutorial-overlay');
    document.body.appendChild(overlay);

    // Tutorial messages
    const messages = [
        "Welcome to Referentia! Click to continue.",
        "In this game you play as a mage apprentice navigating the fantasy world with your trusty spell book. Cast the right spell to defeat the monster infornt of you.",
        "But how will you know which spell to use? Well you're also equipped with a monster encyclopedia use that to research and find the monster weakness",
        "Use the monster's appearance and it's envirnoment to gather clues on what you're up against. Once you're sure type out the name of the spell you want to use. Good luck!"

    ];

    let currentMessage = 0;
    const textBox = document.createElement('div');
    textBox.classList.add('tutorial-text');
    textBox.textContent = messages[currentMessage];
    overlay.appendChild(textBox);

    overlay.addEventListener('click', () => {
        currentMessage++;
        if (currentMessage < messages.length) {
            textBox.textContent = messages[currentMessage];
        } else {
            // End tutorial
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.remove();
                // Resume game
                initializeLevel();
                document.getElementById('answer-input').focus();
            }, 400);
        }
    });
    }
}

// Initialize game with level data
function initializeLevel() {
    const backgroundImg = document.getElementById('background');
    const monsterImg = document.getElementById('monster');

    // Set background
    backgroundImg.src = currLevelData.background;
    backgroundImg.onerror = function() {
        this.classList.add('placeholder');
        this.alt = 'Background Placeholder';
    };

    // Set monster sprite
    monsterImg.src = currLevelData.monsterSprite;
    monsterImg.onerror = function() {
        this.classList.add('placeholder');
        this.alt = 'Monster Placeholder';
    };
}

// Callback function for correct answer
function onCorrectAnswer() {
    console.log("success");
    // Add your success logic here (animations, level progression, etc.)
    // Transition to the next level
    currLevel++;
    currLevelData = levels[currLevel]; // Load next level from database
    // document.getElementById('success-message').classList.remove('hidden').textContent = "Correct! Moving to next level.";
    initializeLevel();
}

// Callback function for incorrect answer
function onIncorrectAnswer() {
    console.log("failure");
    // Add your failure logic here (shake animation, lives reduction, etc.)
    // document.getElementById('success-message').classList.remove('hidden').textContent = "Incorrect! Try again.";
}

// Validate user input - IMPLEMENT YOUR VALIDATION LOGIC HERE
function validateAnswer(userInput) {
    // Example implementation (remove/modify as needed):
    if (userInput.toLowerCase() === currLevelData.solution.toLowerCase()) {
        showSuccess();
    } else {
        showFailure();
        onIncorrectAnswer();
    }
}

function showSuccess() {
  const popup = document.getElementById('popup');
  popup.style.display = 'block';
  popup.classList.remove('success-popup'); // restart animation
  void popup.offsetWidth; // trigger reflow
  popup.classList.add('success-popup');

  setTimeout(() =>{popup.style.display = 'none'; onCorrectAnswer()} , 2000 ); // match animation duration
}

function showFailure() {
  const popup = document.getElementById('popup2');
  popup.style.display = 'block';
  popup.classList.remove('failure-popup'); // restart animation
  void popup.offsetWidth; // trigger reflow
  popup.classList.add('failure-popup');

  setTimeout(() =>{popup.style.display = 'none'} , 2000 ); 
}

// Handle form submission
function handleSubmit() {
    const input = document.getElementById('answer-input');
    const userAnswer = input.value.trim();
    
    if (userAnswer) {
        validateAnswer(userAnswer);
        input.value = '';
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