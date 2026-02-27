# Word Blocks - Kids Learning Game

A fun educational word game where kids catch falling letter blocks and spell words. Features single-player and multiplayer modes!

## Features

- 🎮 Single Player Mode - Practice spelling words
- 👥 Multiplayer Mode - Play with friends/parents online
- 🔊 Text-to-Speech - Hear word pronunciation and meanings
- 🎯 Interactive Gameplay - Click falling letters to collect them
- 🏆 Score Tracking - Compete for the highest score

## Setup Instructions

### 1. Firebase Setup (Required for Multiplayer)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Realtime Database:
   - Go to Build > Realtime Database
   - Click "Create Database"
   - Start in "Test Mode" (for development)
4. Get your config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (</>)
   - Copy the firebaseConfig object
5. Replace the config in `game.js` (lines 4-12) with your actual Firebase config

### 2. Running the Game

#### Option A: Simple HTTP Server (Python)
```bash
cd word-game
python3 -m http.server 8000
```
Then open: http://localhost:8000

#### Option B: Node.js HTTP Server
```bash
npm install -g http-server
cd word-game
http-server
```

#### Option C: VS Code Live Server
- Install "Live Server" extension
- Right-click `index.html`
- Select "Open with Live Server"

### 3. Firebase Security Rules (Production)

For production, update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["createdAt"]
      }
    }
  }
}
```

## How to Play

### Single Player
1. Click "Single Player"
2. Watch for falling letter blocks
3. Click letters to collect them
4. Arrange letters to spell the target word
5. Click "Submit Word" to check your answer
6. Hear the pronunciation and meaning!

### Multiplayer
1. Click "Multiplayer"
2. Host: Click "Create Room" and share the code
3. Friend: Enter the room code and click "Join Room"
4. Host clicks "Start Game" when ready
5. Race to spell words correctly - highest score wins!

## Customization

### Add More Words
Edit the `words` array in `game.js` (lines 18-29):

```javascript
const words = [
    { word: 'APPLE', meaning: 'A red or green fruit' },
    { word: 'HOUSE', meaning: 'A place where people live' },
    // Add more words here
];
```

### Adjust Difficulty
In `game.js`:
- Change `timeLeft: 60` (line 47) for game duration
- Modify `this.speed = 1 + Math.random()` (line 37) for letter falling speed
- Adjust `setInterval(spawnLetter, 2000)` (line 186) for letter spawn rate

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Supported (touch events work)

## Troubleshooting

**Multiplayer not working?**
- Check Firebase config is correct
- Ensure Realtime Database is enabled
- Check browser console for errors

**No sound?**
- Check browser allows autoplay
- Ensure volume is on
- Some browsers require user interaction first

**Letters falling too fast/slow?**
- Adjust speed in FallingLetter class (line 37)

## License

Free to use for educational purposes!
