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
        { word: 'TOY', meaning: 'Something fun to play with' }
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
        { word: 'SNOW', meaning: 'White frozen water that falls in winter' }
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
        { word: 'BEACH', meaning: 'Sandy place by the ocean' }
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
    timeLeft: 60,
    roomCode: null,
    playerId: null,
    isHost: false,
    spelledWords: [],
    wordsRemaining: 10,
    letterFrequency: {}
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
        gameState.isPlaying = true;
        gameState.fallingLetters = [];
        gameState.collectedLetters = [];
        gameState.spelledWords = [];
        gameState.wordsRemaining = 10;
        
        updateScore();
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
            collectLetter(letter.letter);
            gameState.fallingLetters.splice(i, 1);
            break;
        }
    }
}

function collectLetter(letter) {
    if (gameState.collectedLetters.length < gameState.currentWord.word.length) {
        gameState.collectedLetters.push(letter);
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
            gameState.score += 10;
            gameState.spelledWords.push(userWord);
            gameState.wordsRemaining--;
            updateScore();
            updateWordsTable();
            updateWordsRemaining();
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
    if (!gameState.isPlaying) return;
    
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
    document.getElementById('result-message').textContent = opponentScore !== null 
        ? `Your Score: ${score} | Opponent: ${opponentScore}`
        : `You spelled ${Math.floor(score/10)} words correctly!`;
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
}

function gameLoop() {
    if (!gameState.isPlaying) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = gameState.fallingLetters.length - 1; i >= 0; i--) {
        const letter = gameState.fallingLetters[i];
        letter.update();
        letter.draw();
        
        if (letter.y > canvas.height) {
            gameState.fallingLetters.splice(i, 1);
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
