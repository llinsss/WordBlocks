# Word Blocks - Kids Learning Game

A fun educational word game where kids catch falling letter blocks and spell words. Features single-player and multiplayer modes with text-to-speech pronunciation!

## Features

- 🎮 **Single Player Mode** - Practice spelling words at your own pace
- 👥 **Multiplayer Mode** - Play with friends/parents online via room codes
- 🎯 **Three Difficulty Levels**
  - Easy: 3-letter words, slow blocks
  - Medium: 4-letter words, normal speed
  - Hard: 5-letter words, fast blocks
- ⏱️ **Customizable Game Duration** - Choose 1, 3, 5, or 10 minute sessions
- 🔊 **Text-to-Speech** - Hear word pronunciation and meanings
- 📊 **Live Progress Tracking** - See spelled words and points in real-time sidebar
- ✨ **Auto-Submit** - Words automatically submit when complete
- 🎯 **10 Words Per Session** - Clear goal for each game
- 🧠 **Smart Letter Spawning** - Prioritizes letters you haven't collected yet

## Game Modes

### Single Player
1. Select difficulty (Easy/Medium/Hard)
2. Choose game duration (1/3/5/10 minutes)
3. Click falling letters to collect them
4. Spell the target word
5. Complete 10 words or run out of time

### Multiplayer
1. Host creates a room and shares the 6-character code
2. Friend joins using the room code
3. Host starts the game
4. Race to spell words correctly - highest score wins!

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
cd word-blocks-game
python3 -m http.server 8000
```
Then open: http://localhost:8000

#### Option B: Node.js HTTP Server
```bash
npm install -g http-server
cd word-blocks-game
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

### Controls
- **Click** falling letter blocks to collect them
- **Submit Word** button to check your answer (or auto-submits when complete)
- **Clear** button to reset collected letters

### Scoring
- Each correctly spelled word: +10 points
- Track your progress in the sidebar
- Game ends after 10 words or when time expires

## Customization

### Add More Words
Edit the `words` object in `game.js` (lines 18-50):

```javascript
const words = {
    easy: [
        { word: 'NEW', meaning: 'Your definition here' },
        // Add more easy words
    ],
    medium: [
        { word: 'WORD', meaning: 'Your definition here' },
        // Add more medium words
    ],
    hard: [
        { word: 'HARDER', meaning: 'Your definition here' },
        // Add more hard words
    ]
};
```

### Adjust Difficulty
In `game.js`, FallingLetter constructor (line 55):
- Easy speed: 0.3-0.6 pixels/frame
- Medium speed: 0.5-0.8 pixels/frame
- Hard speed: 0.7-1.0 pixels/frame

### Change Spawn Rate
In `game.js`, initGame function (line 235):
```javascript
setInterval(spawnLetter, 1500); // Change 1500 to adjust milliseconds
```

## Technical Details

### Technologies Used
- HTML5 Canvas for game rendering
- Vanilla JavaScript (ES6+)
- Firebase Realtime Database for multiplayer
- Web Speech API for text-to-speech
- CSS3 for styling and animations

### Browser Compatibility
- Chrome 90+ (desktop & mobile)
- Firefox 88+ (desktop & mobile)
- Safari 14+ (desktop & mobile)
- Edge 90+ (desktop)

### File Structure
```
word-blocks-game/
├── index.html          # Main HTML structure
├── style.css           # All styling
├── game.js             # Game logic & Firebase integration
├── README.md           # This file
└── PRD.md              # Product Requirements Document
```

## Troubleshooting

**Multiplayer not working?**
- Check Firebase config is correct in game.js
- Ensure Realtime Database is enabled
- Check browser console for errors
- Verify you're not using demo Firebase credentials

**No sound?**
- Check browser allows autoplay
- Ensure volume is on
- Some browsers require user interaction first
- Speech synthesis may not be available in all browsers

**Letters falling too fast/slow?**
- Select a different difficulty level
- Or adjust speed in FallingLetter class (game.js line 55)

**Game not loading?**
- Make sure you're running a local server (not opening file:// directly)
- Check browser console for errors
- Verify all files are in the same directory

## Features Breakdown

### Difficulty Levels
- **Easy**: 3-letter words (CAT, DOG, SUN, etc.) with slow-falling blocks
- **Medium**: 4-letter words (TREE, FISH, BIRD, etc.) with normal speed
- **Hard**: 5-letter words (HOUSE, APPLE, WATER, etc.) with fast blocks

### Time Options
- **1 Minute**: Quick practice session
- **3 Minutes**: Short learning session
- **5 Minutes**: Standard game length
- **10 Minutes**: Extended practice

### Smart Features
- Auto-submit when word is complete (300ms delay)
- Smart letter spawning prioritizes uncollected letters
- Real-time progress sidebar showing all spelled words
- Comprehensive error handling for network issues
- Graceful degradation if speech synthesis unavailable

## Contributing

Feel free to fork this project and add your own features! Some ideas:
- More word categories (animals, colors, etc.)
- Sound effects for letter collection
- Animations for correct/incorrect answers
- Power-ups and bonuses
- Achievement system
- Persistent high scores

## License

Free to use for educational purposes!

## Credits

Built with ❤️ for kids learning to spell and read.
