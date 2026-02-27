# Product Requirements Document (PRD)
# Word Blocks - Educational Word Game for Kids

**Version:** 1.0  
**Last Updated:** 2024  
**Product Owner:** TBD  
**Target Audience:** Children ages 5-10  

---

## 1. Executive Summary

### 1.1 Product Overview
Word Blocks is a web-based educational game designed to teach children spelling, vocabulary, and word recognition through interactive gameplay. Players catch falling letter blocks and arrange them to spell words, receiving audio feedback with pronunciation and definitions.

### 1.2 Product Vision
Create an engaging, accessible learning tool that makes spelling practice fun while supporting both independent learning and social play with parents or peers.

### 1.3 Success Metrics
- Average session duration: 10+ minutes
- Word completion rate: 70%+
- Multiplayer adoption: 30% of sessions
- User retention: 50% return within 7 days

---

## 2. Product Goals & Objectives

### 2.1 Primary Goals
1. Teach children correct spelling through interactive gameplay
2. Reinforce learning with audio pronunciation and definitions
3. Enable social learning through multiplayer functionality
4. Provide accessible, browser-based gameplay requiring no installation

### 2.2 Non-Goals (Out of Scope for v1.0)
- User accounts and persistent profiles
- Progress tracking across sessions
- Leaderboards or achievements
- Custom word list uploads
- Mobile native apps
- Offline mode
- Multiple language support

---

## 3. User Personas

### 3.1 Primary Persona: Young Learner (Age 5-10)
- **Needs:** Fun, visual learning; immediate feedback; simple controls
- **Behaviors:** Short attention span; prefers colorful, animated interfaces
- **Technical Skills:** Basic mouse/touch interaction
- **Goals:** Learn new words; have fun; compete with friends

### 3.2 Secondary Persona: Parent/Guardian
- **Needs:** Educational value; safe content; easy setup
- **Behaviors:** Supervises gameplay; plays alongside child
- **Technical Skills:** Moderate; can share links
- **Goals:** Support child's learning; quality time together

### 3.3 Tertiary Persona: Educator
- **Needs:** Classroom-ready tool; no complex setup
- **Behaviors:** Uses during learning time; facilitates peer play
- **Technical Skills:** Basic to moderate
- **Goals:** Supplement curriculum; engage students

---

## 4. Functional Requirements

### 4.1 Game Modes

#### 4.1.1 Single Player Mode
**Priority:** P0 (Must Have)

**Description:** Solo practice mode where player spells words against a timer.

**User Flow:**
1. User clicks "Single Player" from main menu
2. Game screen loads with canvas, timer (60s), score (0), and target word
3. Letter blocks begin falling from top of canvas at random intervals
4. User clicks falling letters to collect them
5. Collected letters appear in answer slots below canvas
6. User clicks "Submit Word" to check answer
7. If correct: score increases, audio plays pronunciation + meaning, new word loads
8. If incorrect: audio says "Try again", letters remain collected
9. User can click "Clear" to reset collected letters
10. Game ends when timer reaches 0
11. Results screen shows final score and word count

**Acceptance Criteria:**
- Timer counts down from 60 seconds
- Letters fall at variable speeds (1-2 pixels per frame)
- New letter spawns every 2 seconds
- Letters spawn at random X positions within canvas bounds
- Only letters from current target word spawn
- Score increases by 10 points per correct word
- Audio plays within 500ms of correct submission
- Minimum 10 words in word bank

#### 4.1.2 Multiplayer Mode
**Priority:** P0 (Must Have)

**Description:** Real-time competitive mode where two players race to spell words.

**User Flow - Host:**
1. User clicks "Multiplayer" from main menu
2. User clicks "Create Room"
3. System generates 6-character alphanumeric room code
4. Waiting room displays with room code prominently shown
5. Host sees "Share this code with your friend!" message
6. When second player joins, host sees both players listed
7. "Start Game" button becomes visible
8. Host clicks "Start Game"
9. Both players enter game screen simultaneously
10. Gameplay identical to single player, but opponent's score visible
11. Game ends when timer reaches 0 for both players
12. Results screen shows winner based on higher score

**User Flow - Guest:**
1. User clicks "Multiplayer" from main menu
2. User enters room code in text input
3. User clicks "Join Room"
4. System validates room exists and has space
5. User enters waiting room, sees both players listed
6. User waits for host to start game
7. Game begins when host clicks "Start Game"
8. Gameplay and end flow same as host

**Acceptance Criteria:**
- Room codes are unique and 6 characters long
- Room codes are case-insensitive
- Maximum 2 players per room
- Real-time score synchronization (< 1 second latency)
- Room automatically deleted when host leaves or game ends
- Guest can see when host starts game
- Both players see same target words in same order
- Winner determined by higher score at time=0
- Tie handling: display "Tie!" message

### 4.2 Core Gameplay Mechanics

#### 4.2.1 Letter Block System
**Priority:** P0 (Must Have)

**Technical Specifications:**
- Canvas size: 600px width × 400px height
- Block size: 50px × 50px
- Block appearance: Green background (#4CAF50), white border (3px), white letter text (30px bold Arial)
- Spawn rate: 1 block every 2000ms
- Spawn position: Random X between 0 and (canvas.width - 50)
- Initial Y position: -50px (above canvas)
- Fall speed: Random between 1.0 and 2.0 pixels per frame
- Letter selection: Random letter from current target word
- Block removal: When Y > canvas.height OR when clicked

**Interaction:**
- Click detection: Mouse coordinates within block bounds
- Collection: Immediate removal from canvas, letter added to answer array
- Visual feedback: Block disappears on click
- Limit: Can only collect up to target word length

#### 4.2.2 Word Bank System
**Priority:** P0 (Must Have)

**Data Structure:**
```javascript
{
  word: String,      // Uppercase letters only, 3-5 characters
  meaning: String    // Child-friendly definition
}
```

**Default Word List (Minimum 10):**
1. CAT - "A small furry pet that says meow"
2. DOG - "A friendly pet that barks and wags its tail"
3. SUN - "The bright star in the sky that gives us light"
4. TREE - "A tall plant with leaves and branches"
5. FISH - "An animal that swims in water"
6. BIRD - "An animal with wings that can fly"
7. BOOK - "Something you read with pages and stories"
8. STAR - "A bright light you see in the night sky"
9. MOON - "The round light you see at night"
10. BALL - "A round toy you can throw and catch"

**Word Selection:**
- Random selection from word bank
- No duplicate words in same session (nice-to-have)
- New word selected immediately after correct answer

#### 4.2.3 Answer Submission System
**Priority:** P0 (Must Have)

**Validation Logic:**
- Compare collected letters (joined as string) with target word
- Case-insensitive comparison
- Exact match required (no partial credit)

**Correct Answer Flow:**
1. Add 10 points to score
2. Update score display
3. Call text-to-speech with: "{word}. {meaning}"
4. Clear collected letters array
5. Select new random word
6. Update target word display
7. Create new empty letter slots

**Incorrect Answer Flow:**
1. Call text-to-speech with: "Try again!"
2. Keep collected letters in place
3. No score change
4. No word change

#### 4.2.4 Audio System
**Priority:** P0 (Must Have)

**Technology:** Web Speech API (SpeechSynthesisUtterance)

**Configuration:**
- Speech rate: 0.8 (slower for clarity)
- Language: en-US (default)
- Voice: System default
- Volume: 1.0 (max)

**Audio Triggers:**
- Correct word: Speak word + meaning
- Incorrect word: Speak "Try again!"

**Error Handling:**
- If speech synthesis unavailable: Continue gameplay without audio
- No blocking on audio playback

### 4.3 User Interface Components

#### 4.3.1 Main Menu Screen
**Priority:** P0 (Must Have)

**Elements:**
- Title: "🎮 Word Blocks" (3em font size)
- Subtitle: "Catch the letters and spell the word!" (1.2em)
- Button: "Single Player" (green, primary style)
- Button: "Multiplayer" (blue, secondary style)

**Layout:** Centered vertically and horizontally

#### 4.3.2 Multiplayer Menu Screen
**Priority:** P0 (Must Have)

**Elements:**
- Title: "Multiplayer Mode" (2em)
- Button: "Create Room" (green, primary)
- Text input: Room code entry (6 char max, uppercase)
- Button: "Join Room" (blue, secondary)
- Button: "Back" (red, back style)

**Validation:**
- Room code input: Auto-uppercase, alphanumeric only
- Join button: Disabled if input empty

#### 4.3.3 Waiting Room Screen
**Priority:** P0 (Must Have)

**Elements:**
- Title: "Waiting Room" (2em)
- Room code display: Large, prominent (2em, letter-spaced)
- Instruction text: "Share this code with your friend!"
- Players list: Container showing connected players
- Button: "Start Game" (visible only to host, only when 2 players present)
- Button: "Leave Room" (red, back style)

**Real-time Updates:**
- Players list updates when player joins/leaves
- Start button appears when player count = 2

#### 4.3.4 Game Screen
**Priority:** P0 (Must Have)

**Layout Sections:**

**Header Bar:**
- Score display: "Score: {number}"
- Target word display: "Spell: {WORD}"
- Timer display: "Time: {seconds}s"
- Layout: Horizontal flex, space-around

**Opponent Section (Multiplayer Only):**
- Opponent name: "Opponent"
- Opponent score: Real-time updated
- Display: Hidden in single player

**Game Canvas:**
- 600×400px canvas element
- Semi-transparent white background
- Rounded corners (15px)
- Centered horizontally

**Answer Area:**
- Letter slots: Horizontal flex container
- Slot appearance: 60×60px, dashed border when empty, solid when filled
- Slot count: Matches target word length
- Submit button: "Submit Word" (orange)
- Clear button: "Clear" (gray)

**Exit Button:**
- "Exit Game" (red, back style)
- Bottom of screen

#### 4.3.5 Results Screen
**Priority:** P0 (Must Have)

**Elements:**
- Title: Dynamic based on outcome
  - Single player: "Game Over!"
  - Multiplayer win: "You Win!"
  - Multiplayer lose: "You Lose!"
  - Multiplayer tie: "Tie!"
- Score message: 
  - Single player: "You spelled {count} words correctly!"
  - Multiplayer: "Your Score: {score} | Opponent: {opponentScore}"
- Final score display: "Final Score: {score}"
- Button: "Main Menu" (green, primary)

### 4.4 Multiplayer Infrastructure

#### 4.4.1 Firebase Realtime Database Structure
**Priority:** P0 (Must Have)

**Database Schema:**
```
rooms/
  {roomCode}/
    host: String (playerId)
    status: String ("waiting" | "playing")
    createdAt: Number (timestamp)
    startedAt: Number (timestamp)
    players/
      {playerId}/
        name: String
        score: Number
        ready: Boolean
```

**Operations:**

**Create Room:**
- Generate unique 6-char room code
- Set host to creator's playerId
- Initialize with status "waiting"
- Add creator to players object
- Set createdAt timestamp

**Join Room:**
- Validate room exists
- Check player count < 2
- Add player to players object
- Listen for status changes

**Start Game:**
- Host only operation
- Update status to "playing"
- Set startedAt timestamp
- Trigger game start for all players

**Update Score:**
- Write to players/{playerId}/score
- Triggers real-time update for opponent

**Leave Room:**
- Remove player from players object
- If host leaves: Delete entire room
- If guest leaves: Host can wait for new player

#### 4.4.2 Real-time Synchronization
**Priority:** P0 (Must Have)

**Listeners:**
- Players list: Listen to `rooms/{roomCode}/players`
- Game status: Listen to `rooms/{roomCode}/status`
- Opponent score: Listen to `rooms/{roomCode}/players/{opponentId}/score`

**Update Frequency:**
- Score updates: On each correct word submission
- Player list: On join/leave events
- Status: On game start/end

**Latency Requirements:**
- Score sync: < 1 second
- Player join notification: < 2 seconds
- Game start trigger: < 1 second

---

## 5. Non-Functional Requirements

### 5.1 Performance
**Priority:** P0 (Must Have)

- Page load time: < 3 seconds on 3G connection
- Frame rate: 30+ FPS during gameplay
- Canvas rendering: No dropped frames with 10+ blocks
- Firebase read latency: < 500ms
- Firebase write latency: < 1 second

### 5.2 Browser Compatibility
**Priority:** P0 (Must Have)

**Supported Browsers:**
- Chrome 90+ (desktop & mobile)
- Firefox 88+ (desktop & mobile)
- Safari 14+ (desktop & mobile)
- Edge 90+ (desktop)

**Required APIs:**
- Canvas 2D Context
- Web Speech API (graceful degradation if unavailable)
- ES6 Modules
- Firebase SDK 10.x

### 5.3 Responsive Design
**Priority:** P1 (Should Have)

- Desktop: Optimized for 1024px+ width
- Tablet: Functional on 768px+ width
- Mobile: Functional on 375px+ width
- Touch support: Click events work with touch
- Orientation: Portrait and landscape support

### 5.4 Accessibility
**Priority:** P1 (Should Have)

- Color contrast: WCAG AA compliant
- Font sizes: Minimum 16px for body text
- Interactive elements: Minimum 44×44px touch targets
- Audio: Visual feedback accompanies audio cues
- Keyboard navigation: Not required for v1.0

### 5.5 Security
**Priority:** P0 (Must Have)

- Firebase rules: Read/write access to rooms only
- No PII collection: No user data stored
- Room codes: Non-guessable (6 alphanumeric chars = 2.1B combinations)
- Room cleanup: Auto-delete on game end
- Input sanitization: Room code validation

### 5.6 Scalability
**Priority:** P1 (Should Have)

- Concurrent rooms: Support 100+ simultaneous rooms
- Firebase free tier: Stay within limits (50K reads/day, 20K writes/day)
- Room expiration: Clean up abandoned rooms after 1 hour

---

## 6. Technical Architecture

### 6.1 Technology Stack

**Frontend:**
- HTML5
- CSS3 (Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Canvas API
- Web Speech API

**Backend:**
- Firebase Realtime Database
- Firebase Hosting (optional)

**Build Tools:**
- None required (vanilla JS)
- Optional: HTTP server for local development

### 6.2 File Structure
```
word-game/
├── index.html          # Main HTML structure
├── style.css           # All styling
├── game.js             # Game logic & Firebase integration
└── README.md           # Setup instructions
```

### 6.3 Key Classes & Functions

**Classes:**
```javascript
class FallingLetter {
  constructor(letter, x)
  update()              // Move block down
  draw()                // Render on canvas
  isClicked(x, y)       // Hit detection
}
```

**Global State:**
```javascript
gameState = {
  mode: String,              // 'single' | 'multiplayer'
  score: Number,
  currentWord: Object,       // {word, meaning}
  fallingLetters: Array,     // FallingLetter instances
  collectedLetters: Array,   // String array
  isPlaying: Boolean,
  timeLeft: Number,
  roomCode: String,
  playerId: String,
  isHost: Boolean
}
```

**Core Functions:**
- `initGame()` - Initialize game state and canvas
- `selectNewWord()` - Pick random word from bank
- `spawnLetter()` - Create new falling letter
- `handleCanvasClick(e)` - Process letter collection
- `submitWord()` - Validate and score answer
- `gameLoop()` - Main render loop (requestAnimationFrame)
- `createRoom()` - Initialize Firebase room
- `joinRoom()` - Connect to existing room
- `updateScore()` - Sync score to Firebase

### 6.4 Data Flow

**Single Player:**
1. User clicks letter → Add to collectedLetters
2. User submits → Validate against currentWord
3. If correct → Update score, speak word, load new word
4. Timer expires → Show results

**Multiplayer:**
1. Host creates room → Write to Firebase
2. Guest joins → Update Firebase players
3. Host starts → Update status to "playing"
4. Both players listen for opponent score changes
5. Game ends → Compare scores, show winner
6. Room deleted from Firebase

---

## 7. User Stories

### 7.1 Epic: Single Player Learning
- As a child, I want to practice spelling words alone so I can learn at my own pace
- As a child, I want to hear how words are pronounced so I can learn to say them correctly
- As a child, I want to know what words mean so I can expand my vocabulary
- As a parent, I want my child to have a safe solo activity so they can learn independently

### 7.2 Epic: Multiplayer Competition
- As a child, I want to play with my friend so we can learn together
- As a parent, I want to play with my child so we can bond while learning
- As a child, I want to see my friend's score so I know if I'm winning
- As a host, I want to share a simple code so my friend can join easily

### 7.3 Epic: Engaging Gameplay
- As a child, I want colorful falling blocks so the game is fun to watch
- As a child, I want to click letters so I feel in control
- As a child, I want immediate feedback so I know if I'm right
- As a child, I want a timer so I feel challenged

---

## 8. Edge Cases & Error Handling

### 8.1 Gameplay Edge Cases

**Scenario:** User collects more letters than needed
- **Handling:** Limit collection to word length

**Scenario:** User clicks same falling letter multiple times
- **Handling:** Remove on first click, ignore subsequent clicks

**Scenario:** Multiple letters overlap on canvas
- **Handling:** Click registers on topmost letter (last in array)

**Scenario:** Timer reaches 0 while user is submitting
- **Handling:** Accept submission, then end game

**Scenario:** All letters fall off screen before collection
- **Handling:** New letters continue spawning every 2 seconds

### 8.2 Multiplayer Edge Cases

**Scenario:** Guest tries to join full room
- **Handling:** Show alert "Room is full!", return to multiplayer menu

**Scenario:** Guest tries to join non-existent room
- **Handling:** Show alert "Room not found!", return to multiplayer menu

**Scenario:** Host leaves during game
- **Handling:** Delete room, guest sees "Host disconnected" and returns to menu

**Scenario:** Guest leaves during game
- **Handling:** Host continues playing, can finish game

**Scenario:** Network disconnection during game
- **Handling:** Game continues locally, multiplayer features disabled

**Scenario:** Both players submit correct word simultaneously
- **Handling:** Both get points, Firebase handles concurrent writes

**Scenario:** Room code collision (duplicate generated)
- **Handling:** Extremely unlikely (2.1B combinations), but Firebase will reject duplicate key

### 8.3 Audio Edge Cases

**Scenario:** Browser doesn't support Web Speech API
- **Handling:** Game continues without audio, no error shown

**Scenario:** User has muted browser/system
- **Handling:** No error, game continues normally

**Scenario:** Speech synthesis is speaking when new word submitted
- **Handling:** Previous speech cancelled, new speech starts

---

## 9. Testing Requirements

### 9.1 Unit Testing (Manual)

**Game Logic:**
- [ ] Word validation: Correct word increases score by 10
- [ ] Word validation: Incorrect word shows "Try again"
- [ ] Letter collection: Clicking letter adds to array
- [ ] Letter collection: Cannot collect more than word length
- [ ] Timer: Counts down from 60 to 0
- [ ] Timer: Game ends at 0
- [ ] Score: Starts at 0, increments correctly
- [ ] Word selection: Random word chosen from bank
- [ ] Letter spawning: Only letters from current word spawn

**Canvas Rendering:**
- [ ] Letters fall at consistent speed
- [ ] Letters render with correct styling
- [ ] Click detection works accurately
- [ ] Canvas clears and redraws each frame
- [ ] No memory leaks after extended play

### 9.2 Integration Testing

**Firebase:**
- [ ] Room creation: Generates unique code
- [ ] Room joining: Guest can join with code
- [ ] Score sync: Opponent sees score updates
- [ ] Game start: Both players enter game simultaneously
- [ ] Room cleanup: Room deleted after game ends
- [ ] Player list: Updates when players join/leave

**Audio:**
- [ ] Correct word: Speaks word + meaning
- [ ] Incorrect word: Speaks "Try again"
- [ ] Speech rate: Noticeably slower (0.8)
- [ ] Graceful degradation: Works without speech API

### 9.3 User Acceptance Testing

**Single Player:**
- [ ] Child can complete full game session
- [ ] Audio is clear and understandable
- [ ] Game is engaging for 5+ minutes
- [ ] Instructions are intuitive (no help needed)

**Multiplayer:**
- [ ] Two users can create and join room
- [ ] Room code sharing is straightforward
- [ ] Competitive element is clear
- [ ] Winner determination is obvious

### 9.4 Browser Testing

Test on:
- [ ] Chrome (Windows, Mac, Android)
- [ ] Firefox (Windows, Mac)
- [ ] Safari (Mac, iOS)
- [ ] Edge (Windows)

Verify:
- [ ] Layout renders correctly
- [ ] Canvas animations smooth
- [ ] Firebase connection works
- [ ] Audio plays (where supported)
- [ ] Touch events work on mobile

---

## 10. Deployment & Launch

### 10.1 Pre-Launch Checklist

**Firebase Setup:**
- [ ] Create Firebase project
- [ ] Enable Realtime Database
- [ ] Configure security rules
- [ ] Update firebaseConfig in game.js
- [ ] Test database read/write operations

**Code Quality:**
- [ ] Remove console.log statements
- [ ] Validate all functions work
- [ ] Test on multiple browsers
- [ ] Verify mobile responsiveness
- [ ] Check for JavaScript errors

**Content:**
- [ ] Verify all 10 words have meanings
- [ ] Test audio pronunciation for each word
- [ ] Ensure child-appropriate language
- [ ] Spell-check all text

### 10.2 Deployment Options

**Option 1: Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Option 2: Static Hosting (Netlify, Vercel, GitHub Pages)**
- Upload files to hosting service
- Ensure Firebase config is correct
- Test deployed version

**Option 3: Self-Hosted**
- Set up web server (Apache, Nginx)
- Upload files to server
- Configure HTTPS (recommended)

### 10.3 Post-Launch Monitoring

**Metrics to Track:**
- Daily active users
- Average session duration
- Single vs multiplayer usage ratio
- Word completion rate
- Browser/device distribution
- Firebase usage (stay within free tier)

**User Feedback:**
- Collect feedback from parents/educators
- Monitor for bug reports
- Track feature requests

---

## 11. Future Enhancements (Post v1.0)

### 11.1 Priority 1 (Next Release)
- User accounts with progress tracking
- Difficulty levels (easy/medium/hard words)
- Customizable word lists
- Sound effects for letter collection
- Animations for correct/incorrect answers
- Mobile app versions (iOS/Android)

### 11.2 Priority 2 (Future Releases)
- Achievements and badges
- Global leaderboards
- More game modes (timed challenges, endless mode)
- Multiplayer tournaments (4+ players)
- Parent dashboard with progress reports
- Multiple language support
- Offline mode with service workers

### 11.3 Priority 3 (Nice to Have)
- AI-powered difficulty adjustment
- Voice input for spelling
- Integration with school curricula
- Teacher admin panel
- Custom avatar creation
- In-game rewards/currency
- Social features (friend lists, chat)

---

## 12. Appendix

### 12.1 Glossary

- **Canvas**: HTML5 element for drawing graphics
- **Firebase**: Google's backend-as-a-service platform
- **Realtime Database**: NoSQL cloud database with real-time sync
- **Room Code**: Unique identifier for multiplayer sessions
- **Target Word**: The word player must spell in current round
- **Letter Block**: Falling visual element containing a letter
- **Answer Slot**: UI element showing collected letters

### 12.2 References

- [Web Speech API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Firebase Realtime Database Guide](https://firebase.google.com/docs/database)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### 12.3 Contact & Support

- **Technical Questions**: [Developer email/Slack]
- **Product Feedback**: [Product owner email]
- **Bug Reports**: [Issue tracker URL]

---

**Document Status:** Draft  
**Review Status:** Pending  
**Approval Status:** Pending
