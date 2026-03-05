import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, onValue, update, remove, push } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Version: 1.0.4
console.log('🎮 Tanna\'s blocWord game.js loaded successfully');

// FIREBASE CONFIGURATION
// Your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBJ7gTfR6dtuVAymAyrPoERdMuQGluoEwQ",
    authDomain: "blocword-c882a.firebaseapp.com",
    databaseURL: "https://blocword-c882a-default-rtdb.firebaseio.com",
    projectId: "blocword-c882a",
    storageBucket: "blocword-c882a.firebasestorage.app",
    messagingSenderId: "325895402586",
    appId: "1:325895402586:web:4ea2a7be4401bae4629463"
};

let app, database, auth;
try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
} catch (error) {
    console.warn('Firebase initialization failed. Multiplayer disabled.', error);
}

let currentUser = null;
let userCoins = 0;
let dailyStreak = 0;
let userCharacters = ['😊'];
let selectedCharacter = '😊';
let userAchievements = {};

const CHARACTERS = [
    { emoji: '😊', name: 'Happy', cost: 0 },
    { emoji: '🐶', name: 'Puppy', cost: 100 },
    { emoji: '🐱', name: 'Kitty', cost: 100 },
    { emoji: '🦊', name: 'Fox', cost: 150 },
    { emoji: '🐼', name: 'Panda', cost: 150 },
    { emoji: '🦁', name: 'Lion', cost: 200 },
    { emoji: '🐯', name: 'Tiger', cost: 200 },
    { emoji: '🐸', name: 'Frog', cost: 150 },
    { emoji: '🐰', name: 'Bunny', cost: 150 },
    { emoji: '🐻', name: 'Bear', cost: 200 },
    { emoji: '🦄', name: 'Unicorn', cost: 300 },
    { emoji: '🐲', name: 'Dragon', cost: 300 },
    { emoji: '🦖', name: 'Dino', cost: 250 },
    { emoji: '🐝', name: 'Bee', cost: 100 },
    { emoji: '🐙', name: 'Octopus', cost: 200 },
    { emoji: '🦋', name: 'Butterfly', cost: 150 },
    { emoji: '🐢', name: 'Turtle', cost: 150 },
    { emoji: '🦉', name: 'Owl', cost: 200 },
    { emoji: '🐧', name: 'Penguin', cost: 200 },
    { emoji: '🦆', name: 'Duck', cost: 100 }
];

const ACHIEVEMENTS = [
    { id: 'first_word', name: 'First Word', icon: '🎯', desc: 'Spell your first word', target: 1, type: 'words' },
    { id: 'word_10', name: 'Word Master', icon: '📚', desc: 'Spell 10 words', target: 10, type: 'words' },
    { id: 'word_50', name: 'Word Expert', icon: '🏆', desc: 'Spell 50 words', target: 50, type: 'words' },
    { id: 'word_100', name: 'Word Legend', icon: '👑', desc: 'Spell 100 words', target: 100, type: 'words' },
    { id: 'score_100', name: 'Century', icon: '💯', desc: 'Score 100 in one game', target: 100, type: 'score' },
    { id: 'score_200', name: 'High Scorer', icon: '🌟', desc: 'Score 200 in one game', target: 200, type: 'score' },
    { id: 'streak_3', name: 'On Fire', icon: '🔥', desc: '3 day streak', target: 3, type: 'streak' },
    { id: 'streak_7', name: 'Week Warrior', icon: '⚡', desc: '7 day streak', target: 7, type: 'streak' },
    { id: 'games_10', name: 'Dedicated', icon: '🎮', desc: 'Play 10 games', target: 10, type: 'games' },
    { id: 'games_50', name: 'Committed', icon: '💪', desc: 'Play 50 games', target: 50, type: 'games' },
    { id: 'perfect', name: 'Perfect!', icon: '✨', desc: 'Complete all 10 words', target: 1, type: 'perfect' },
    { id: 'combo_5', name: 'Combo King', icon: '🎯', desc: '5x combo', target: 5, type: 'combo' }
];

const words = {
    easy: [
        { word: 'CAT', meaning: 'A small furry pet that says meow' },
        { word: 'DOG', meaning: 'A friendly pet that barks and wags its tail' },
        { word: 'SUN', meaning: 'The bright star in the sky that gives us light' },
        { word: 'BED', meaning: 'Where you sleep at night' },
        { word: 'CUP', meaning: 'You drink water from this' },
        { word: 'HAT', meaning: 'You wear this on your head' },
        { word: 'PEN', meaning: 'You write with this' },
        { word: 'BAG', meaning: 'You carry things in this' },
        { word: 'BOX', meaning: 'A container to put things in' },
        { word: 'TOY', meaning: 'Something fun to play with' },
        { word: 'CAR', meaning: 'A vehicle with four wheels' },
        { word: 'BUS', meaning: 'A big vehicle that carries many people' },
        { word: 'ANT', meaning: 'A tiny insect that works hard' },
        { word: 'BEE', meaning: 'An insect that makes honey' },
        { word: 'EGG', meaning: 'A round thing that chickens lay' },
        { word: 'FOX', meaning: 'A clever animal with a bushy tail' },
        { word: 'JAR', meaning: 'A container for storing things' },
        { word: 'KEY', meaning: 'Opens locks and doors' },
        { word: 'MAP', meaning: 'Shows you where places are' },
        { word: 'NET', meaning: 'Used to catch fish or butterflies' }
    ],
    medium: [
        { word: 'TREE', meaning: 'A tall plant with leaves and branches' },
        { word: 'FISH', meaning: 'An animal that swims in water' },
        { word: 'BIRD', meaning: 'An animal with wings that can fly' },
        { word: 'BOOK', meaning: 'Something you read with pages and stories' },
        { word: 'STAR', meaning: 'A bright light you see in the night sky' },
        { word: 'MOON', meaning: 'The round light you see at night' },
        { word: 'BALL', meaning: 'A round toy you can throw and catch' },
        { word: 'DOOR', meaning: 'You open this to enter a room' },
        { word: 'RAIN', meaning: 'Water that falls from clouds' },
        { word: 'SNOW', meaning: 'White frozen water that falls in winter' },
        { word: 'WIND', meaning: 'Moving air you can feel' },
        { word: 'FROG', meaning: 'A green animal that hops and says ribbit' },
        { word: 'DUCK', meaning: 'A bird that swims and says quack' },
        { word: 'BEAR', meaning: 'A big furry animal' },
        { word: 'CAKE', meaning: 'A sweet dessert for birthdays' },
        { word: 'MILK', meaning: 'A white drink from cows' },
        { word: 'SOCK', meaning: 'You wear this on your foot' },
        { word: 'SHOE', meaning: 'You wear this to protect your feet' },
        { word: 'HAND', meaning: 'The part of your body with fingers' },
        { word: 'NOSE', meaning: 'You smell with this part of your face' }
    ],
    hard: [
        { word: 'HOUSE', meaning: 'A building where people live' },
        { word: 'APPLE', meaning: 'A red or green fruit that is crunchy' },
        { word: 'WATER', meaning: 'A clear liquid you drink to stay healthy' },
        { word: 'CHAIR', meaning: 'Furniture you sit on' },
        { word: 'PLANT', meaning: 'A living thing that grows in soil' },
        { word: 'SMILE', meaning: 'When you are happy your mouth does this' },
        { word: 'BREAD', meaning: 'Food made from flour that you can toast' },
        { word: 'CLOUD', meaning: 'White fluffy things in the sky' },
        { word: 'TIGER', meaning: 'A big orange cat with black stripes' },
        { word: 'BEACH', meaning: 'Sandy place by the ocean' },
        { word: 'HAPPY', meaning: 'Feeling good and joyful' },
        { word: 'MUSIC', meaning: 'Sounds that are nice to listen to' },
        { word: 'DANCE', meaning: 'Moving your body to music' },
        { word: 'PIZZA', meaning: 'A round food with cheese and toppings' },
        { word: 'HORSE', meaning: 'A large animal you can ride' },
        { word: 'OCEAN', meaning: 'A very big body of salt water' },
        { word: 'LIGHT', meaning: 'Brightness that helps you see' },
        { word: 'MAGIC', meaning: 'Something amazing and mysterious' },
        { word: 'DREAM', meaning: 'Pictures in your mind when you sleep' },
        { word: 'HEART', meaning: 'The organ that pumps blood in your body' }
    ]
};

let canvas, ctx;
let spawnInterval, timerInterval;
let gameState = {
    mode: 'single',
    difficulty: 'easy',
    duration: 60,
    score: 0,
    currentWord: null,
    fallingLetters: [],
    collectedLetters: [],
    isPlaying: false,
    isPaused: false,
    isMuted: false,
    timeLeft: 60,
    roomCode: null,
    playerId: null,
    isHost: false,
    spelledWords: [],
    wordsRemaining: 10,
    letterFrequency: {},
    combo: 0,
    particles: [],
    coins: 0,
    character: {
        x: 275,
        y: 350,
        width: 50,
        height: 50,
        emoji: '😊',
        targetX: 275,
        celebrating: false
    }
};

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4 - 2;
        this.life = 1;
        this.color = color;
        this.size = Math.random() * 3 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life -= 0.02;
    }
    
    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

const sounds = {
    playPop() {
        if (gameState.isMuted) return;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
    },
    playSuccess() {
        if (gameState.isMuted) return;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    }
};

class FallingLetter {
    constructor(letter, x, difficulty) {
        this.letter = letter;
        this.x = x;
        this.y = -50;
        const speedMap = { easy: 1, medium: 1.5, hard: 2 };
        this.speed = speedMap[difficulty] || 1.5;
        this.width = 50;
        this.height = 50;
        this.collected = false;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.letter, this.x + this.width/2, this.y + this.height/2);
    }

    isClicked(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width &&
               mouseY >= this.y && mouseY <= this.y + this.height;
    }
}

window.startSinglePlayer = function() {
    gameState.mode = 'single';
    showScreen('difficulty-screen');
};

window.selectDifficulty = function(difficulty) {
    gameState.difficulty = difficulty;
    showScreen('duration-screen');
};

window.selectDuration = function(minutes) {
    gameState.duration = minutes * 60;
    gameState.timeLeft = minutes * 60;
    showScreen('game-screen');
    initGame();
};

window.showMultiplayerMenu = function() {
    resetGame();
    showScreen('multiplayer-menu');
};

window.showMainMenu = function() {
    showScreen('menu-screen');
    resetGame();
};

window.createRoom = function() {
    if (!database) {
        alert('Multiplayer unavailable. Firebase not configured.');
        return;
    }
    
    try {
        const roomCode = generateRoomCode();
        gameState.roomCode = roomCode;
        gameState.playerId = generatePlayerId();
        gameState.isHost = true;
        gameState.difficulty = 'medium';
        gameState.duration = 180;
        gameState.timeLeft = 180;
        
        const playerName = currentUser ? currentUser.name : 'Player';
        
        set(ref(database, `rooms/${roomCode}`), {
            host: gameState.playerId,
            difficulty: 'medium',
            duration: 180,
            players: {
                [gameState.playerId]: { name: playerName, score: 0, ready: true }
            },
            status: 'waiting',
            createdAt: Date.now()
        });

        showScreen('waiting-room');
        document.getElementById('display-room-code').textContent = roomCode;
        
        onValue(ref(database, `rooms/${roomCode}/players`), (snapshot) => {
            updatePlayersList(snapshot.val());
        });
    } catch (error) {
        console.error('Failed to create room:', error);
        alert('Failed to create room. Please try again.');
    }
};

window.joinRoom = function() {
    if (!database) {
        alert('Multiplayer unavailable. Firebase not configured.');
        return;
    }
    
    const roomCode = document.getElementById('room-code').value.toUpperCase();
    if (!roomCode) return alert('Please enter a room code');
    
    try {
        gameState.roomCode = roomCode;
        gameState.playerId = generatePlayerId();
        
        const roomRef = ref(database, `rooms/${roomCode}`);
        onValue(roomRef, (snapshot) => {
            if (!snapshot.exists()) {
                alert('Room not found!');
                return;
            }
            
            const room = snapshot.val();
            if (Object.keys(room.players || {}).length >= 2) {
                alert('Room is full!');
                return;
            }
            
            gameState.difficulty = room.difficulty || 'medium';
            gameState.duration = room.duration || 180;
            gameState.timeLeft = room.duration || 180;
            
            const playerName = currentUser ? currentUser.name : 'Player';
            
            update(ref(database, `rooms/${roomCode}/players/${gameState.playerId}`), {
                name: playerName,
                score: 0,
                ready: true
            });
            
            showScreen('waiting-room');
            document.getElementById('display-room-code').textContent = roomCode;
            
            onValue(ref(database, `rooms/${roomCode}/players`), (snapshot) => {
                updatePlayersList(snapshot.val());
            });

            onValue(ref(database, `rooms/${roomCode}/status`), (snapshot) => {
                if (snapshot.val() === 'playing') {
                    gameState.mode = 'multiplayer';
                    showScreen('game-screen');
                    initGame();
                    listenToOpponent();
                    syncTimer();
                }
            });
        }, { onlyOnce: true });
    } catch (error) {
        console.error('Failed to join room:', error);
        alert('Failed to join room. Please check the code and try again.');
    }
};

window.startMultiplayerGame = function() {
    if (!gameState.isHost) return;
    
    try {
        const startTime = Date.now();
        update(ref(database, `rooms/${gameState.roomCode}`), {
            status: 'playing',
            difficulty: gameState.difficulty,
            duration: gameState.duration,
            startedAt: startTime,
            timeLeft: gameState.duration
        });
        
        gameState.mode = 'multiplayer';
        showScreen('game-screen');
        initGame();
        listenToOpponent();
        syncTimer();
    } catch (error) {
        console.error('Failed to start game:', error);
        alert('Failed to start game. Please try again.');
    }
};

window.leaveRoom = function() {
    if (gameState.roomCode && gameState.playerId && database) {
        try {
            remove(ref(database, `rooms/${gameState.roomCode}/players/${gameState.playerId}`));
            if (gameState.isHost) {
                remove(ref(database, `rooms/${gameState.roomCode}`));
            }
        } catch (error) {
            console.error('Failed to leave room:', error);
        }
    }
    document.getElementById('room-code').value = '';
    showMainMenu();
};

function updatePlayersList(players) {
    const list = document.getElementById('players-list');
    list.innerHTML = '<h3>Players:</h3>';
    if (players) {
        Object.values(players).forEach(player => {
            list.innerHTML += `<p>👤 ${player.name}</p>`;
        });
        
        console.log('Players count:', Object.keys(players).length, 'isHost:', gameState.isHost);
        
        if (Object.keys(players).length === 2 && gameState.isHost) {
            console.log('Showing Start Game button');
            document.getElementById('start-game-btn').style.display = 'block';
        }
    }
}

function listenToOpponent() {
    if (!database) return;
    
    try {
        document.getElementById('opponent-section').style.display = 'block';
        
        onValue(ref(database, `rooms/${gameState.roomCode}/players`), (snapshot) => {
            const players = snapshot.val();
            if (players) {
                const opponent = Object.entries(players).find(([id]) => id !== gameState.playerId);
                if (opponent) {
                    document.getElementById('opponent-name').textContent = opponent[1].name;
                    document.getElementById('opponent-score').textContent = opponent[1].score;
                }
            }
        });
    } catch (error) {
        console.error('Failed to listen to opponent:', error);
    }
}

function syncTimer() {
    if (!database || !gameState.roomCode) return;
    
    onValue(ref(database, `rooms/${gameState.roomCode}/timeLeft`), (snapshot) => {
        const serverTime = snapshot.val();
        if (serverTime !== null && !gameState.isHost) {
            gameState.timeLeft = serverTime;
            document.getElementById('timer').textContent = gameState.timeLeft;
        }
    });
}

function initGame() {
    try {
        canvas = document.getElementById('game-canvas');
        const isMobile = window.innerWidth <= 768;
        canvas.width = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
        canvas.height = isMobile ? Math.min(window.innerHeight * 0.4, 300) : 400;
        ctx = canvas.getContext('2d');
        
        gameState.score = 0;
        gameState.combo = 0;
        gameState.particles = [];
        gameState.isPaused = false;
        gameState.isPlaying = true;
        gameState.fallingLetters = [];
        gameState.collectedLetters = [];
        gameState.spelledWords = [];
        gameState.wordsRemaining = 10;
        gameState.character = {
            x: 275,
            y: 350,
            width: 50,
            height: 50,
            emoji: '😊',
            targetX: 275,
            celebrating: false
        };
        
        updateScore();
        updateCombo();
        updateWordsTable();
        updateWordsRemaining();
        selectNewWord();
        
        canvas.addEventListener('click', handleCanvasClick);
        canvas.addEventListener('touchstart', handleCanvasTouch);
        
        if (spawnInterval) clearInterval(spawnInterval);
        if (timerInterval) clearInterval(timerInterval);
        spawnInterval = setInterval(spawnLetter, 1500);
        timerInterval = setInterval(updateTimer, 1000);
        gameLoop();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        alert('Failed to start game. Please refresh and try again.');
    }
}

function selectNewWord() {
    const wordList = words[gameState.difficulty];
    gameState.currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    document.getElementById('target-word').textContent = gameState.currentWord.word;
    
    gameState.letterFrequency = {};
    gameState.currentWord.word.split('').forEach(letter => {
        gameState.letterFrequency[letter] = (gameState.letterFrequency[letter] || 0) + 1;
    });
    
    createLetterSlots();
}

function createLetterSlots() {
    const slots = document.getElementById('letter-slots');
    slots.innerHTML = '';
    for (let i = 0; i < gameState.currentWord.word.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.dataset.index = i;
        slots.appendChild(slot);
    }
}

function spawnLetter() {
    if (!gameState.isPlaying) return;
    
    const letters = gameState.currentWord.word.split('');
    const collectedCount = {};
    gameState.collectedLetters.forEach(letter => {
        collectedCount[letter] = (collectedCount[letter] || 0) + 1;
    });
    
    const availableLetters = letters.filter(letter => {
        const needed = gameState.letterFrequency[letter];
        const collected = collectedCount[letter] || 0;
        return collected < needed;
    });
    
    if (availableLetters.length > 0) {
        const letter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        const x = Math.random() * (canvas.width - 50);
        gameState.fallingLetters.push(new FallingLetter(letter, x, gameState.difficulty));
    }
}

function handleCanvasClick(e) {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    console.log('Click at:', x, y, 'Letters:', gameState.fallingLetters.length);
    
    for (let i = gameState.fallingLetters.length - 1; i >= 0; i--) {
        const letter = gameState.fallingLetters[i];
        if (!letter.collected && letter.isClicked(x, y)) {
            console.log('Collected:', letter.letter);
            letter.collected = true;
            collectLetter(letter.letter, letter.x + letter.width/2, letter.y + letter.height/2);
            gameState.fallingLetters.splice(i, 1);
            return;
        }
    }
    console.log('No letter clicked');
}

function handleCanvasTouch(e) {
    e.preventDefault();
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    
    for (let i = gameState.fallingLetters.length - 1; i >= 0; i--) {
        const letter = gameState.fallingLetters[i];
        if (!letter.collected && letter.isClicked(x, y)) {
            letter.collected = true;
            collectLetter(letter.letter, letter.x + letter.width/2, letter.y + letter.height/2);
            gameState.fallingLetters.splice(i, 1);
            return;
        }
    }
}

function collectLetter(letter, x, y) {
    if (gameState.collectedLetters.length < gameState.currentWord.word.length) {
        gameState.collectedLetters.push(letter);
        sounds.playPop();
        for (let i = 0; i < 10; i++) {
            gameState.particles.push(new Particle(x, y, '#FFD700'));
        }
        updateLetterSlots();
    }
}

function updateLetterSlots() {
    const slots = document.querySelectorAll('.letter-slot');
    slots.forEach((slot, i) => {
        if (gameState.collectedLetters[i]) {
            slot.textContent = gameState.collectedLetters[i];
            slot.classList.add('filled');
        }
    });
    
    if (gameState.collectedLetters.length === gameState.currentWord.word.length) {
        setTimeout(() => submitWord(), 300);
    }
}

window.submitWord = function() {
    try {
        const userWord = gameState.collectedLetters.join('');
        if (userWord === gameState.currentWord.word) {
            gameState.combo++;
            const comboBonus = gameState.combo > 1 ? gameState.combo * 5 : 0;
            gameState.score += 10 + comboBonus;
            gameState.spelledWords.push(userWord);
            gameState.wordsRemaining--;
            
            sounds.playSuccess();
            createConfetti();
            updateScore();
            updateCombo();
            updateWordsTable();
            updateWordsRemaining();
            celebrateCharacter();
            speakWord(gameState.currentWord.word, gameState.currentWord.meaning);
            
            if (gameState.mode === 'multiplayer' && database) {
                update(ref(database, `rooms/${gameState.roomCode}/players/${gameState.playerId}`), {
                    score: gameState.score
                }).catch(error => console.error('Failed to update score:', error));
            }
            
            gameState.collectedLetters = [];
            
            if (gameState.wordsRemaining <= 0) {
                setTimeout(() => endGame(), 1000);
            } else {
                selectNewWord();
            }
        } else {
            gameState.combo = 0;
            updateCombo();
            speak('Try again!');
        }
    } catch (error) {
        console.error('Failed to submit word:', error);
    }
};

window.clearWord = function() {
    gameState.collectedLetters = [];
    createLetterSlots();
};

function updateScore() {
    document.getElementById('score').textContent = gameState.score;
}

function updateTimer() {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    gameState.timeLeft--;
    document.getElementById('timer').textContent = gameState.timeLeft;
    
    // Sync timer to Firebase for multiplayer (host only)
    if (gameState.mode === 'multiplayer' && gameState.isHost && database) {
        update(ref(database, `rooms/${gameState.roomCode}`), {
            timeLeft: gameState.timeLeft
        }).catch(err => console.error('Timer sync failed:', err));
    }
    
    if (gameState.timeLeft <= 0) {
        endGame();
    }
}

window.endGame = function() {
    gameState.isPlaying = false;
    if (spawnInterval) clearInterval(spawnInterval);
    if (timerInterval) clearInterval(timerInterval);
    
    try {
        if (gameState.mode === 'multiplayer' && gameState.roomCode && database) {
            update(ref(database, `rooms/${gameState.roomCode}/players/${gameState.playerId}`), {
                score: gameState.score
            }).then(() => {
                setTimeout(() => {
                    onValue(ref(database, `rooms/${gameState.roomCode}/players`), (snapshot) => {
                        const players = snapshot.val();
                        if (players) {
                            const playersList = Object.entries(players);
                            const myPlayer = playersList.find(([id]) => id === gameState.playerId);
                            const opponentPlayer = playersList.find(([id]) => id !== gameState.playerId);
                            
                            const myScore = myPlayer ? myPlayer[1].score : gameState.score;
                            const opponentScore = opponentPlayer ? opponentPlayer[1].score : 0;
                            const opponentName = opponentPlayer ? opponentPlayer[1].name : 'Opponent';
                            
                            let title, message;
                            if (myScore > opponentScore) {
                                title = '🎉 Congratulations!';
                                message = `You won against ${opponentName}!`;
                            } else if (myScore < opponentScore) {
                                title = '😢 You Lost';
                                message = `Sorry, you lost to ${opponentName}`;
                            } else {
                                title = '🤝 It\'s a Tie!';
                                message = `You tied with ${opponentName}`;
                            }
                            
                            showResult(title, myScore, opponentScore, message);
                        } else {
                            showResult('Game Over!', gameState.score);
                        }
                    }, { onlyOnce: true });
                }, 500);
            }).catch(error => {
                console.error('Failed to update final score:', error);
                showResult('Game Over!', gameState.score);
            });
            
            setTimeout(() => {
                if (gameState.isHost && database) {
                    remove(ref(database, `rooms/${gameState.roomCode}`)).catch(error => 
                        console.error('Failed to delete room:', error)
                    );
                }
            }, 2000);
        } else {
            showResult('Game Over!', gameState.score);
        }
    } catch (error) {
        console.error('Failed to end game:', error);
        showResult('Game Over!', gameState.score);
    }
};

function showResult(title, score, opponentScore = null, customMessage = null) {
    showScreen('result-screen');
    document.getElementById('result-title').textContent = title;
    
    const coinsEarned = 10 + score;
    awardCoins(coinsEarned);
    updateLeaderboard(score);
    
    const wordsCompleted = gameState.spelledWords.length;
    const stars = getStarRating(score, wordsCompleted);
    const isNewHighScore = saveHighScore();
    const highScore = getHighScore();
    
    let message;
    if (customMessage) {
        message = customMessage;
    } else if (opponentScore !== null) {
        message = `Your Score: ${score} | Opponent: ${opponentScore}`;
    } else {
        message = `You spelled ${wordsCompleted} words correctly!`;
    }
    
    if (isNewHighScore && opponentScore === null) {
        message += ' 🏆 NEW HIGH SCORE!';
    }
    
    document.getElementById('result-message').textContent = message;
    document.getElementById('final-score').innerHTML = `
        <div>Final Score: ${score}</div>
        <div class="stars">${'⭐'.repeat(stars)}${'\u2606'.repeat(3-stars)}</div>
        ${opponentScore === null ? `<div class="high-score">High Score: ${highScore}</div>` : ''}
    `;
}

function gameLoop() {
    if (!gameState.isPlaying) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState.character) {
        if (!gameState.isPaused) updateCharacter();
        drawCharacter();
    }
    
    for (let i = gameState.fallingLetters.length - 1; i >= 0; i--) {
        const letter = gameState.fallingLetters[i];
        if (!gameState.isPaused) letter.update();
        letter.draw();
        
        if (letter.y > canvas.height) {
            gameState.fallingLetters.splice(i, 1);
        }
    }
    
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const particle = gameState.particles[i];
        particle.update();
        particle.draw();
        if (particle.life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(gameLoop);
}

function speakWord(word, meaning) {
    speak(`${word}. ${meaning}`);
}

function speak(text) {
    try {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    } catch (error) {
        console.warn('Speech synthesis failed:', error);
    }
}

function updateWordsTable() {
    const table = document.getElementById('words-table');
    table.innerHTML = '<h3>Words Spelled</h3>';
    gameState.spelledWords.forEach((word, index) => {
        const row = document.createElement('div');
        row.className = 'word-row';
        row.innerHTML = `<span class="word-number">${index + 1}.</span> <span class="word-text">${word}</span> <span class="word-points">+10</span>`;
        table.appendChild(row);
    });
}

function updateWordsRemaining() {
    document.getElementById('words-remaining').textContent = gameState.wordsRemaining;
}

function updateCharacter() {
    const char = gameState.character;
    
    if (char.celebrating) return;
    
    let nearestLetter = null;
    let minDistance = Infinity;
    
    gameState.fallingLetters.forEach(letter => {
        if (letter.y > canvas.height - 100 && !letter.collected) {
            const distance = Math.abs(letter.x + letter.width/2 - (char.x + char.width/2));
            if (distance < minDistance) {
                minDistance = distance;
                nearestLetter = letter;
            }
        }
    });
    
    if (nearestLetter) {
        const letterCenter = nearestLetter.x + nearestLetter.width/2;
        const charCenter = char.x + char.width/2;
        
        if (Math.abs(letterCenter - charCenter) > 30) {
            char.targetX = letterCenter < charCenter ? char.x - 60 : char.x + 60;
            char.targetX = Math.max(0, Math.min(canvas.width - char.width, char.targetX));
        }
    }
    
    if (char.x < char.targetX) {
        char.x = Math.min(char.x + 2, char.targetX);
    } else if (char.x > char.targetX) {
        char.x = Math.max(char.x - 2, char.targetX);
    }
}

function drawCharacter() {
    const char = gameState.character;
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char.emoji, char.x + char.width/2, char.y + char.height/2);
}

function celebrateCharacter() {
    const char = gameState.character;
    char.celebrating = true;
    char.emoji = '🎉';
    
    let jumpCount = 0;
    const originalY = char.y;
    const jumpInterval = setInterval(() => {
        if (jumpCount % 2 === 0) {
            char.y = originalY - 20;
        } else {
            char.y = originalY;
        }
        jumpCount++;
        
        if (jumpCount >= 4) {
            clearInterval(jumpInterval);
            char.y = originalY;
            char.emoji = '😊';
            char.celebrating = false;
        }
    }, 150);
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6BCF7F', '#C77DFF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        gameState.particles.push(new Particle(
            canvas.width / 2,
            canvas.height / 2,
            color
        ));
    }
}

function updateCombo() {
    const comboEl = document.getElementById('combo-display');
    if (gameState.combo > 1) {
        comboEl.textContent = `🔥 ${gameState.combo}x COMBO!`;
        comboEl.style.display = 'block';
    } else {
        comboEl.style.display = 'none';
    }
}

window.togglePause = function() {
    gameState.isPaused = !gameState.isPaused;
    document.getElementById('pause-btn').textContent = gameState.isPaused ? '▶️' : '⏸️';
};

window.toggleMute = function() {
    gameState.isMuted = !gameState.isMuted;
    document.getElementById('mute-btn').textContent = gameState.isMuted ? '🔇' : '🔊';
};

function saveHighScore() {
    try {
        const key = `highScore_${gameState.difficulty}`;
        const current = localStorage.getItem(key) || 0;
        if (gameState.score > current) {
            localStorage.setItem(key, gameState.score);
            return true;
        }
    } catch (e) {
        console.warn('LocalStorage not available');
    }
    return false;
}

function getHighScore() {
    try {
        const key = `highScore_${gameState.difficulty}`;
        return localStorage.getItem(key) || 0;
    } catch (e) {
        return 0;
    }
}

function getStarRating(score, wordsCompleted) {
    if (wordsCompleted >= 10) return 3;
    if (wordsCompleted >= 7) return 2;
    if (wordsCompleted >= 4) return 1;
    return 0;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substring(2, 15);
}

function resetGame() {
    gameState.isPlaying = false;
    if (spawnInterval) clearInterval(spawnInterval);
    if (timerInterval) clearInterval(timerInterval);
    gameState.roomCode = null;
    gameState.playerId = null;
    gameState.isHost = false;
    gameState.spelledWords = [];
    gameState.mode = 'single';
    gameState.difficulty = 'easy';
    gameState.duration = 60;
    gameState.timeLeft = 60;
    if (document.getElementById('opponent-section')) {
        document.getElementById('opponent-section').style.display = 'none';
    }
}


// Authentication Functions
window.showSignup = function() {
    showScreen('signup-screen');
};

window.showLogin = function() {
    showScreen('login-screen');
};

window.signup = async function() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        currentUser = { name, email };
        showScreen('menu-screen');
        updateWelcomeMessage();
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            alert('Email already in use. Please login instead.');
        } else if (error.code === 'auth/invalid-email') {
            alert('Invalid email address');
        } else {
            alert('Signup failed: ' + error.message);
        }
    }
};

window.login = async function() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        currentUser = { 
            name: userCredential.user.displayName || 'Player',
            email: userCredential.user.email 
        };
        showScreen('menu-screen');
        updateWelcomeMessage();
    } catch (error) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            alert('Invalid email or password. Please check your credentials and try again.');
        } else if (error.code === 'auth/invalid-email') {
            alert('Invalid email format');
        } else if (error.code === 'auth/too-many-requests') {
            alert('Too many failed login attempts. Please try again later.');
        } else {
            alert('Login failed: ' + error.message);
        }
        console.error('Login error:', error.code, error.message);
    }
};

window.logout = function() {
    signOut(auth).then(() => {
        currentUser = null;
        showScreen('landing-screen');
    }).catch((error) => {
        console.error('Logout failed:', error);
    });
};

function updateWelcomeMessage() {
    const welcomeEl = document.getElementById('welcome-message');
    if (welcomeEl && currentUser) {
        welcomeEl.textContent = `Welcome, ${currentUser.name}! 👋`;
    }
    loadUserCoins();
    checkDailyStreak();
}

// Check auth state on load
if (auth) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = { 
                name: user.displayName || 'Player',
                email: user.email 
            };
            showScreen('menu-screen');
            updateWelcomeMessage();
        } else {
            currentUser = null;
            showScreen('landing-screen');
        }
    });
} else {
    console.error('Firebase Auth not initialized');
    showScreen('landing-screen');
}

// Ensure all functions are available
console.log('Game loaded. Functions available:', {
    showSignup: typeof window.showSignup,
    showLogin: typeof window.showLogin,
    signup: typeof window.signup,
    login: typeof window.login,
    logout: typeof window.logout
});

// Add event listeners for auth buttons
document.addEventListener('DOMContentLoaded', () => {
    const signupBtn = document.getElementById('signup-btn');
    const loginBtn = document.getElementById('login-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const showSignupBtn = document.getElementById('show-signup-btn');
    
    if (signupBtn) signupBtn.addEventListener('click', window.signup);
    if (loginBtn) loginBtn.addEventListener('click', window.login);
    if (showLoginBtn) showLoginBtn.addEventListener('click', window.showLogin);
    if (showSignupBtn) showSignupBtn.addEventListener('click', window.showSignup);
    
    // Enter key support
    const signupPassword = document.getElementById('signup-password');
    const loginPassword = document.getElementById('login-password');
    if (signupPassword) signupPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.signup();
    });
    if (loginPassword) loginPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.login();
    });
});




// Global Leaderboard
async function loadLeaderboard() {
    const leaderboardEl = document.getElementById('leaderboard-list');
    
    try {
        const leaderboardRef = ref(database, 'leaderboard');
        onValue(leaderboardRef, (snapshot) => {
            const data = snapshot.val();
            
            if (!data) {
                leaderboardEl.innerHTML = '<div class="loading">No players yet. Be the first!</div>';
                return;
            }
            
            const players = Object.entries(data)
                .map(([id, player]) => ({ id, ...player }))
                .sort((a, b) => b.totalScore - a.totalScore)
                .slice(0, 10);
            
            leaderboardEl.innerHTML = players.map((player, index) => {
                const rank = index + 1;
                const rankClass = rank === 1 ? 'top1' : rank === 2 ? 'top2' : rank === 3 ? 'top3' : '';
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
                
                return `
                    <div class="leaderboard-item">
                        <div class="leaderboard-rank ${rankClass}">${medal || rank}</div>
                        <div class="leaderboard-name">${player.name}</div>
                        <div class="leaderboard-score">${player.totalScore}</div>
                    </div>
                `;
            }).join('');
        });
    } catch (error) {
        console.error('Failed to load leaderboard:', error);
        leaderboardEl.innerHTML = '<div class="loading">Failed to load leaderboard</div>';
    }
}

async function updateLeaderboard(score) {
    if (!currentUser || !database) return;
    
    try {
        const userId = currentUser.email.replace(/[.@]/g, '_');
        const userRef = ref(database, `leaderboard/${userId}`);
        
        onValue(userRef, (snapshot) => {
            const current = snapshot.val();
            const newTotal = (current?.totalScore || 0) + score;
            const gamesPlayed = (current?.gamesPlayed || 0) + 1;
            
            update(userRef, {
                name: currentUser.name,
                totalScore: newTotal,
                gamesPlayed: gamesPlayed,
                lastPlayed: Date.now()
            });
        }, { onlyOnce: true });
    } catch (error) {
        console.error('Failed to update leaderboard:', error);
    }
}

// Load leaderboard on landing page
if (document.getElementById('landing-screen')?.classList.contains('active')) {
    loadLeaderboard();
}

// Coins & Streaks System
async function loadUserCoins() {
    if (!currentUser || !database) return;
    
    try {
        const userId = currentUser.email.replace(/[.@]/g, '_');
        const userRef = ref(database, `users/${userId}`);
        
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            userCoins = data?.coins || 0;
            dailyStreak = data?.streak || 0;
            updateCoinsDisplay();
        });
    } catch (error) {
        console.error('Failed to load coins:', error);
    }
}

async function awardCoins(amount) {
    if (!currentUser || !database) return;
    
    try {
        const userId = currentUser.email.replace(/[.@]/g, '_');
        const userRef = ref(database, `users/${userId}`);
        
        onValue(userRef, (snapshot) => {
            const current = snapshot.val();
            const newTotal = (current?.coins || 0) + amount;
            
            update(userRef, {
                coins: newTotal,
                lastPlayed: Date.now()
            });
            
            userCoins = newTotal;
            updateCoinsDisplay();
            showCoinsEarned(amount);
        }, { onlyOnce: true });
    } catch (error) {
        console.error('Failed to award coins:', error);
    }
}

async function checkDailyStreak() {
    if (!currentUser || !database) return;
    
    try {
        const userId = currentUser.email.replace(/[.@]/g, '_');
        const userRef = ref(database, `users/${userId}`);
        
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            const lastLogin = data?.lastLogin || 0;
            const now = Date.now();
            const oneDayMs = 24 * 60 * 60 * 1000;
            const daysSince = Math.floor((now - lastLogin) / oneDayMs);
            
            let newStreak = data?.streak || 0;
            let dailyReward = 0;
            
            if (daysSince === 1) {
                newStreak++;
                dailyReward = Math.min(10 + (newStreak - 1) * 10, 100);
            } else if (daysSince > 1) {
                newStreak = 1;
                dailyReward = 10;
            } else if (daysSince === 0 && !data?.claimedToday) {
                dailyReward = Math.min(10 + newStreak * 10, 100);
            }
            
            if (dailyReward > 0) {
                const newCoins = (data?.coins || 0) + dailyReward;
                update(userRef, {
                    coins: newCoins,
                    streak: newStreak,
                    lastLogin: now,
                    claimedToday: true
                });
                
                dailyStreak = newStreak;
                userCoins = newCoins;
                showDailyReward(dailyReward, newStreak);
            } else {
                update(userRef, { lastLogin: now });
            }
        }, { onlyOnce: true });
    } catch (error) {
        console.error('Failed to check streak:', error);
    }
}

function updateCoinsDisplay() {
    const coinsEl = document.getElementById('coins-display');
    const streakEl = document.getElementById('streak-display');
    
    if (coinsEl) coinsEl.textContent = userCoins;
    if (streakEl && dailyStreak > 0) {
        streakEl.textContent = `🔥 ${dailyStreak} day streak!`;
        streakEl.style.display = 'block';
    }
}

function showDailyReward(coins, streak) {
    const msg = `🎉 Daily Login Bonus!\n+${coins} coins\n🔥 ${streak} day streak!`;
    setTimeout(() => alert(msg), 500);
}

function showCoinsEarned(amount) {
    const resultMsg = document.getElementById('result-message');
    if (resultMsg) {
        resultMsg.textContent += `\n💰 +${amount} coins earned!`;
    }
}

// Play Again Function
window.playAgain = function() {
    resetGame();
    showScreen('game-screen');
    initGame();
};

// Shop & Achievements System
window.showShop = function() {
    showScreen('shop-screen');
    showShopTab('characters');
};

window.showAchievements = function() {
    showScreen('achievements-screen');
    loadAchievements();
};

window.showShopTab = function(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    
    if (tab === 'characters') {
        loadCharactersShop();
    }
};

function loadCharactersShop() {
    const content = document.getElementById('shop-content');
    content.innerHTML = CHARACTERS.map(char => {
        const owned = userCharacters.includes(char.emoji);
        const selected = selectedCharacter === char.emoji;
        const canBuy = userCoins >= char.cost;
        
        return `
            <div class="shop-item ${owned ? '' : 'locked'} ${selected ? 'selected' : ''}" 
                 onclick="handleCharacterClick('${char.emoji}', ${char.cost}, ${owned})">
                <div class="item-icon">${char.emoji}</div>
                <div class="item-name">${char.name}</div>
                <div class="item-cost">${owned ? (selected ? '✓ Selected' : 'Select') : `💰 ${char.cost}`}</div>
            </div>
        `;
    }).join('');
}

window.handleCharacterClick = async function(emoji, cost, owned) {
    if (owned) {
        selectedCharacter = emoji;
        gameState.character.emoji = emoji;
        if (currentUser && database) {
            const userId = currentUser.email.replace(/[.@]/g, '_');
            await update(ref(database, `users/${userId}`), { selectedCharacter: emoji });
        }
        loadCharactersShop();
    } else if (userCoins >= cost) {
        if (confirm(`Buy ${emoji} for ${cost} coins?`)) {
            userCharacters.push(emoji);
            userCoins -= cost;
            selectedCharacter = emoji;
            gameState.character.emoji = emoji;
            
            if (currentUser && database) {
                const userId = currentUser.email.replace(/[.@]/g, '_');
                await update(ref(database, `users/${userId}`), {
                    coins: userCoins,
                    characters: userCharacters,
                    selectedCharacter: emoji
                });
            }
            updateCoinsDisplay();
            loadCharactersShop();
        }
    } else {
        alert(`Not enough coins! You need ${cost - userCoins} more coins.`);
    }
};

function loadAchievements() {
    const list = document.getElementById('achievements-list');
    
    if (!currentUser || !database) {
        list.innerHTML = '<p>Login to track achievements!</p>';
        return;
    }
    
    const userId = currentUser.email.replace(/[.@]/g, '_');
    onValue(ref(database, `users/${userId}/stats`), (snapshot) => {
        const stats = snapshot.val() || {};
        
        list.innerHTML = ACHIEVEMENTS.map(ach => {
            const progress = stats[ach.type] || 0;
            const unlocked = progress >= ach.target;
            const percent = Math.min((progress / ach.target) * 100, 100);
            
            return `
                <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
                    <div class="item-icon">${ach.icon}</div>
                    <div class="item-name">${ach.name}</div>
                    <div class="item-cost">${ach.desc}</div>
                    <div class="achievement-progress">${progress}/${ach.target} ${unlocked ? '✓' : ''}</div>
                </div>
            `;
        }).join('');
    }, { onlyOnce: true });
}

async function trackAchievement(type, value) {
    if (!currentUser || !database) return;
    
    const userId = currentUser.email.replace(/[.@]/g, '_');
    const statsRef = ref(database, `users/${userId}/stats`);
    
    onValue(statsRef, (snapshot) => {
        const stats = snapshot.val() || {};
        const newValue = type === 'score' || type === 'combo' ? Math.max(stats[type] || 0, value) : (stats[type] || 0) + value;
        
        update(statsRef, { [type]: newValue });
        
        // Check for new achievements
        ACHIEVEMENTS.forEach(ach => {
            if (ach.type === type && newValue >= ach.target && (!stats[ach.type] || stats[ach.type] < ach.target)) {
                showAchievementUnlocked(ach);
            }
        });
    }, { onlyOnce: true });
}

function showAchievementUnlocked(achievement) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <h2>🎉 Achievement Unlocked!</h2>
        <div style="font-size: 3em; margin: 10px 0;">${achievement.icon}</div>
        <h3>${achievement.name}</h3>
        <p>${achievement.desc}</p>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 3000);
}

// Track achievements after game
const originalEndGame = window.endGame;
window.endGame = function() {
    if (gameState.mode === 'single') {
        trackAchievement('words', gameState.spelledWords.length);
        trackAchievement('score', gameState.score);
        trackAchievement('combo', gameState.combo);
        trackAchievement('games', 1);
        if (gameState.wordsRemaining === 0) trackAchievement('perfect', 1);
    }
    originalEndGame();
};
