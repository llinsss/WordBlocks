import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, onValue, update, remove, push } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyDemoKey-ReplaceWithYourKey",
    authDomain: "word-game-demo.firebaseapp.com",
    databaseURL: "https://word-game-demo-default-rtdb.firebaseio.com",
    projectId: "word-game-demo",
    storageBucket: "word-game-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

let app, database;
try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
} catch (error) {
    console.warn('Firebase initialization failed. Multiplayer disabled.', error);
}

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
        const speedMap = { easy: 0.3, medium: 0.5, hard: 0.7 };
        const baseSpeed = speedMap[difficulty] || 0.5;
        this.speed = baseSpeed + Math.random() * 0.3;
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
        
        set(ref(database, `rooms/${roomCode}`), {
            host: gameState.playerId,
            players: {
                [gameState.playerId]: { name: 'Player 1', score: 0, ready: true }
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
            
            update(ref(database, `rooms/${roomCode}/players/${gameState.playerId}`), {
                name: 'Player 2',
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
        update(ref(database, `rooms/${gameState.roomCode}`), {
            status: 'playing',
            startedAt: Date.now()
        });
        
        gameState.mode = 'multiplayer';
        showScreen('game-screen');
        initGame();
        listenToOpponent();
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
    showMainMenu();
};

function updatePlayersList(players) {
    const list = document.getElementById('players-list');
    list.innerHTML = '<h3>Players:</h3>';
    if (players) {
        Object.values(players).forEach(player => {
            list.innerHTML += `<p>👤 ${player.name}</p>`;
        });
        
        if (Object.keys(players).length === 2 && gameState.isHost) {
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
                    document.getElementById('opponent-score').textContent = opponent[1].score;
                }
            }
        });
    } catch (error) {
        console.error('Failed to listen to opponent:', error);
    }
}

function initGame() {
    try {
        canvas = document.getElementById('game-canvas');
        canvas.width = 600;
        canvas.height = 400;
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
        
        setInterval(spawnLetter, 1500);
        setInterval(updateTimer, 1000);
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
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = gameState.fallingLetters.length - 1; i >= 0; i--) {
        const letter = gameState.fallingLetters[i];
        if (!letter.collected && letter.isClicked(x, y)) {
            letter.collected = true;
            collectLetter(letter.letter, letter.x + letter.width/2, letter.y + letter.height/2);
            gameState.fallingLetters.splice(i, 1);
            break;
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
            speak(userWord);
            setTimeout(() => speakWord(gameState.currentWord.word, gameState.currentWord.meaning), 800);
            
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
    
    if (gameState.timeLeft <= 0) {
        endGame();
    }
}

window.endGame = function() {
    gameState.isPlaying = false;
    
    try {
        if (gameState.mode === 'multiplayer' && gameState.roomCode && database) {
            onValue(ref(database, `rooms/${gameState.roomCode}/players`), (snapshot) => {
                const players = snapshot.val();
                if (players) {
                    const scores = Object.values(players).map(p => p.score);
                    const myScore = gameState.score;
                    const opponentScore = scores.find(s => s !== myScore) || 0;
                    
                    showResult(myScore > opponentScore ? 'You Win!' : myScore < opponentScore ? 'You Lose!' : 'Tie!', myScore, opponentScore);
                }
            }, { onlyOnce: true });
            
            if (gameState.isHost) {
                remove(ref(database, `rooms/${gameState.roomCode}`)).catch(error => 
                    console.error('Failed to delete room:', error)
                );
            }
        } else {
            showResult('Game Over!', gameState.score);
        }
    } catch (error) {
        console.error('Failed to end game:', error);
        showResult('Game Over!', gameState.score);
    }
};

function showResult(title, score, opponentScore = null) {
    showScreen('result-screen');
    document.getElementById('result-title').textContent = title;
    
    const wordsCompleted = gameState.spelledWords.length;
    const stars = getStarRating(score, wordsCompleted);
    const isNewHighScore = saveHighScore();
    const highScore = getHighScore();
    
    let message = opponentScore !== null 
        ? `Your Score: ${score} | Opponent: ${opponentScore}`
        : `You spelled ${wordsCompleted} words correctly!`;
    
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
    gameState.roomCode = null;
    gameState.playerId = null;
    gameState.isHost = false;
    gameState.spelledWords = [];
}
