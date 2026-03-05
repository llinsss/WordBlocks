// Characters, Power-ups, and Achievements System
export const CHARACTERS = [
    { emoji: '😊', name: 'Happy', cost: 0, unlocked: true },
    { emoji: '🐶', name: 'Puppy', cost: 100, unlocked: false },
    { emoji: '🐱', name: 'Kitty', cost: 100, unlocked: false },
    { emoji: '🦊', name: 'Fox', cost: 150, unlocked: false },
    { emoji: '🐼', name: 'Panda', cost: 150, unlocked: false },
    { emoji: '🦁', name: 'Lion', cost: 200, unlocked: false },
    { emoji: '🐯', name: 'Tiger', cost: 200, unlocked: false },
    { emoji: '🐸', name: 'Frog', cost: 150, unlocked: false },
    { emoji: '🐰', name: 'Bunny', cost: 150, unlocked: false },
    { emoji: '🐻', name: 'Bear', cost: 200, unlocked: false },
    { emoji: '🦄', name: 'Unicorn', cost: 300, unlocked: false },
    { emoji: '🐲', name: 'Dragon', cost: 300, unlocked: false },
    { emoji: '🦖', name: 'Dino', cost: 250, unlocked: false },
    { emoji: '🐝', name: 'Bee', cost: 100, unlocked: false },
    { emoji: '🐙', name: 'Octopus', cost: 200, unlocked: false },
    { emoji: '🦋', name: 'Butterfly', cost: 150, unlocked: false },
    { emoji: '🐢', name: 'Turtle', cost: 150, unlocked: false },
    { emoji: '🦉', name: 'Owl', cost: 200, unlocked: false },
    { emoji: '🐧', name: 'Penguin', cost: 200, unlocked: false },
    { emoji: '🦆', name: 'Duck', cost: 100, unlocked: false }
];

export const POWERUPS = [
    { id: 'freeze', name: 'Time Freeze', icon: '❄️', cost: 50, desc: 'Stop letters for 5s' },
    { id: 'magnet', name: 'Letter Magnet', icon: '🧲', cost: 30, desc: 'Auto-collect nearby' },
    { id: 'double', name: 'Double Points', icon: '⭐', cost: 40, desc: '2x score for 10s' },
    { id: 'hint', name: 'Hint', icon: '💡', cost: 20, desc: 'Highlight next letter' }
];

export const ACHIEVEMENTS = [
    { id: 'first_word', name: 'First Word', icon: '🎯', desc: 'Spell your first word', target: 1, type: 'words' },
    { id: 'word_master_10', name: 'Word Master', icon: '📚', desc: 'Spell 10 words', target: 10, type: 'words' },
    { id: 'word_master_50', name: 'Word Expert', icon: '🏆', desc: 'Spell 50 words', target: 50, type: 'words' },
    { id: 'word_master_100', name: 'Word Legend', icon: '👑', desc: 'Spell 100 words', target: 100, type: 'words' },
    { id: 'score_100', name: 'Century', icon: '💯', desc: 'Score 100 points', target: 100, type: 'score' },
    { id: 'score_500', name: 'High Scorer', icon: '🌟', desc: 'Score 500 points', target: 500, type: 'score' },
    { id: 'streak_3', name: 'On Fire', icon: '🔥', desc: '3 day streak', target: 3, type: 'streak' },
    { id: 'streak_7', name: 'Week Warrior', icon: '⚡', desc: '7 day streak', target: 7, type: 'streak' },
    { id: 'games_10', name: 'Dedicated', icon: '🎮', desc: 'Play 10 games', target: 10, type: 'games' },
    { id: 'games_50', name: 'Committed', icon: '💪', desc: 'Play 50 games', target: 50, type: 'games' },
    { id: 'perfect_game', name: 'Perfect!', icon: '✨', desc: 'Complete 10 words', target: 1, type: 'perfect' },
    { id: 'combo_5', name: 'Combo King', icon: '🎯', desc: '5x combo', target: 5, type: 'combo' }
];
