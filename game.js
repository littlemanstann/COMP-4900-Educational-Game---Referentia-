// ============================================
// LEVEL CONFIGURATION - MODIFY THIS SECTION
// ============================================
import { levels } from './level-database.js';

let currLevel = 0; // Current level number
let currLevelData = levels[currLevel]; // Load current level from database
// Audio player for level music
let currentAudio = null;
// Audio for the main menu
let menuAudio = null;
// Persisted mute flag
let audioMuted = false;

// Play the music assigned to the current level. Stops previous audio first.
function playLevelMusic() {
    // If there's already an Audio object created for the same music file and it's playing,
    // keep it running and just re-apply volume/muted settings.
    if (currentAudio && currLevelData && currLevelData.music && currentAudio._src === currLevelData.music && !currentAudio.paused) {
        applyAudioSettingsToCurrent();
        return; // already playing this level's music
    }
    if (currentAudio) {
        try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        } catch (e) {
            console.warn('Error stopping previous audio', e);
        }
        currentAudio = null;
    }

    if (!currLevelData || !currLevelData.music) return;

    currentAudio = new Audio(currLevelData.music);
    // store the original path we used so we can compare later without dealing with
    // resolved absolute URLs or URL-encoding differences
    currentAudio._src = currLevelData.music;
    currentAudio.loop = true;
    // apply persisted volume and muted state (managed by audio controls)
    currentAudio.volume = audioVolume;
    currentAudio.muted = audioMuted;

    // Handle load/play errors (autoplay may be blocked until user interaction)
    currentAudio.addEventListener('error', () => {
        console.warn('Failed to load audio:', currLevelData.music);
        currentAudio = null;
    });

    const playPromise = currentAudio.play();
    if (playPromise !== undefined) {
        playPromise.catch((err) => {
            console.warn('Audio playback prevented (user gesture required):', err);
        });
    }
}

// --- Audio controls state and handlers ---
// Persisted values
let audioVolume = 0.5;

function loadAudioSettings() {
    const storedVol = localStorage.getItem('referentiaVolume');
    const storedMuted = localStorage.getItem('referentiaMuted');
    if (storedVol !== null) {
        const v = parseFloat(storedVol);
        if (!Number.isNaN(v)) audioVolume = v;
    }
    if (storedMuted !== null) {
        audioMuted = storedMuted === 'true';
    }
}

function saveAudioSettings() {
    localStorage.setItem('referentiaVolume', String(audioVolume));
    localStorage.setItem('referentiaMuted', String(audioMuted));
}

function applyAudioSettingsToCurrent() {
    if (!currentAudio) return;
    try {
        currentAudio.volume = audioVolume;
        currentAudio.muted = audioMuted;
    } catch (e) {
        console.warn('Failed to apply audio settings to current audio', e);
    }
}

function initAudioControls() {
    loadAudioSettings();

    const toggle = document.getElementById('audio-toggle');
    const slider = document.getElementById('volume-slider');
    if (!toggle || !slider) return;

    // initialize UI
    slider.value = String(audioVolume);
    if (audioMuted) toggle.classList.add('muted'); else toggle.classList.remove('muted');

    // Toggle mute on click
    toggle.addEventListener('click', () => {
        audioMuted = !audioMuted;
        if (audioMuted) toggle.classList.add('muted'); else toggle.classList.remove('muted');
        applyAudioSettingsToCurrent();
        saveAudioSettings();
    });

    // Volume slider
    slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!Number.isNaN(val)) {
            audioVolume = val;
            // If slider moved to 0, consider it muted visually
            if (audioVolume === 0) {
                audioMuted = true;
                toggle.classList.add('muted');
            } else {
                audioMuted = false;
                toggle.classList.remove('muted');
            }
            applyAudioSettingsToCurrent();
            saveAudioSettings();
        }
    });
}

// Play the main menu theme. Attempts audible play; if blocked, resumes on first user gesture.
function playMenuMusic() {
    if (menuAudio && !menuAudio.paused) return;
    const menuPath = 'src/music/Style of Concentration.mp3';
    menuAudio = new Audio(menuPath);
    menuAudio.loop = true;
    menuAudio.volume = audioVolume;
    menuAudio.muted = audioMuted;

    menuAudio.addEventListener('error', () => {
        console.warn('Failed to load menu audio:', menuPath);
        menuAudio = null;
    });

    const p = menuAudio.play();
    if (p !== undefined) p.catch((err) => {
        // Autoplay blocked; resume on first pointer or key event
        console.warn('Menu audio autoplay prevented:', err);
        const resume = () => {
            if (menuAudio) menuAudio.play().catch(()=>{});
            document.removeEventListener('pointerdown', resume);
            document.removeEventListener('keydown', resume);
        };
        document.addEventListener('pointerdown', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
    });
}

function stopMenuMusic() {
    if (!menuAudio) return;
    try { menuAudio.pause(); menuAudio.currentTime = 0; } catch (e) {}
    menuAudio = null;
}

// Start game transition
function startGame() {
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    
    // Hide start screen
    startScreen.classList.add('hidden');
    // Stop menu music immediately when Play is pressed so level music can start
    stopMenuMusic();
    
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
    const singleplayer_messages = [
        "Welcome to Referentia! Click to continue.",
        "In this game you play as a mage apprentice navigating the fantasy world with your trusty spell book. Cast the right spell to defeat the monster infornt of you.",
        "But how will you know which spell to use? Well you're also equipped with a monster encyclopedia use that to research and find the monster weakness",
        "Use the monster's appearance and it's envirnoment to gather clues on what you're up against. Once you're sure type out the name of the spell you want to use. Good luck!"

    ];

    const multiplayer_messages = [
        "Welcome to Referentia! Click to continue.",
        "In this game, one player will be the apprentice adventurer and the other will be the Mage",
        "The adventurer must cast the right spell to defeat the monster infront of them.",
        "But how will they know which spell to use? The Mage will have access to the Monster Encylopedia, but only they can see it: You both may only communicate via Orb",
        "The adventurer must describe the monster's appearance and it's envirnoment, and the Mage will gather clues on what you're up against. Once you're both sure of the best course of action, type out the name of the spell you want to use. Good luck!"

    ];

    const messages = document.getElementById('mp_switch').checked ? multiplayer_messages : singleplayer_messages

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
    // If the level intentionally has no monster sprite (null or "NONE"), hide the <img>
    if (!currLevelData.monsterSprite || currLevelData.monsterSprite === "NONE") {
        // Hide the image element so the browser won't show a broken image icon
        monsterImg.style.display = 'none';
        monsterImg.src = '';
        monsterImg.alt = '';
        monsterImg.classList.remove('placeholder');
    } else {
        // Ensure the image is visible and set its source
        monsterImg.style.display = '';
        monsterImg.classList.remove('placeholder');
        monsterImg.src = currLevelData.monsterSprite;
        monsterImg.onerror = function() {
            // Show a clean placeholder styling (no browser broken-icon)
            this.classList.add('placeholder');
            this.alt = 'Monster Placeholder';
            this.style.background = 'transparent'; // force alpha
        };
    }

    // Start music for this level (stops any previous music)
    playLevelMusic();
}

// Callback function for correct answer
function onCorrectAnswer() {
    console.log("success");
    // Add your success logic here (animations, level progression, etc.)
    // Transition to the next level
    currLevel++;
    // Guard against running past the last level
    if (currLevel >= levels.length) {
        console.log('All levels completed — restarting from level 0');
        currLevel = 0; // or implement end-of-game screen
    }
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

// Validate user input
function validateAnswer(userInput) {
    if(userInput.toLowerCase() === "cheat"){
        showSuccess();
        return;
    }

    // Check against all possible solutions
    for (let i = 0; i < currLevelData.solution.length; i++) {
        if (userInput.toLowerCase() === currLevelData.solution[i].toLowerCase()) {
            showSuccess();
            return;
        }
    }
    // If no match found:
    showFailure();
    onIncorrectAnswer();
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

  // Reset text
  popup.innerText = "Ineffective Cast!";

  popup.classList.remove('failure-popup'); // restart animation
  popup.classList.remove('hint-popup'); // remove hint style if previously added
  void popup.offsetWidth; // trigger reflow

  // Provide hint if available
  if (currLevelData.hint != null) {
    popup.innerText+= "\n" + currLevelData.hint;
    popup.classList.add('hint-popup');
  }
  else
    popup.classList.add('failure-popup');

  setTimeout(() =>{popup.style.display = 'none'} , 6000 ); 
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

// Initialize audio controls after DOM is ready. Show a welcome overlay first.
document.addEventListener('DOMContentLoaded', () => {
    initAudioControls();

    // If the welcome overlay exists, wait for the user to click it before starting menu music.
    const welcome = document.getElementById('welcome-overlay');
    const startMenu = () => {
        // start menu music now that user has interacted
        playMenuMusic();
    };

    if (welcome) {
        // When overlay is clicked, fade it out and start menu audio
        const onClickOverlay = () => {
            welcome.classList.add('fade-out');
            // give the CSS fade a moment then remove from layout
            setTimeout(() => { welcome.style.display = 'none'; }, 350);
            // start menu music after user gesture
            startMenu();
            welcome.removeEventListener('click', onClickOverlay);
        };

        // Attach the click handler once. Also listen for keydown (space/enter) to be accessible.
        welcome.addEventListener('click', onClickOverlay, { once: true });
        welcome.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                onClickOverlay();
            }
        }, { once: true });

        // Make overlay focusable so keyboard users can dismiss it
        welcome.tabIndex = 0;
        welcome.focus();
    } else {
        // No overlay present — fall back to best-effort autoplay/resume behavior
        startMenu();
    }
});