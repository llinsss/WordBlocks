// Progressive Rounds System
export const ROUNDS = [
    {
        id: 1,
        name: 'Beginner Beach',
        icon: '🏖️',
        description: 'Start your word adventure!',
        difficulty: 'easy',
        wordsToComplete: 5,
        timeLimit: 120,
        letterSpeed: 0.8,
        unlocked: true,
        reward: 50
    },
    {
        id: 2,
        name: 'Forest Trail',
        icon: '🌲',
        description: 'Words get trickier!',
        difficulty: 'easy',
        wordsToComplete: 7,
        timeLimit: 150,
        letterSpeed: 1.0,
        unlocked: false,
        reward: 75
    },
    {
        id: 3,
        name: 'Mountain Path',
        icon: '⛰️',
        description: 'Climb higher!',
        difficulty: 'medium',
        wordsToComplete: 8,
        timeLimit: 180,
        letterSpeed: 1.2,
        unlocked: false,
        reward: 100
    },
    {
        id: 4,
        name: 'Desert Dunes',
        icon: '🏜️',
        description: 'Hot challenge ahead!',
        difficulty: 'medium',
        wordsToComplete: 10,
        timeLimit: 180,
        letterSpeed: 1.4,
        unlocked: false,
        reward: 125
    },
    {
        id: 5,
        name: 'Snowy Peak',
        icon: '🏔️',
        description: 'Freezing difficulty!',
        difficulty: 'hard',
        wordsToComplete: 10,
        timeLimit: 150,
        letterSpeed: 1.6,
        unlocked: false,
        reward: 150
    },
    {
        id: 6,
        name: 'Volcano Crater',
        icon: '🌋',
        description: 'Extreme heat!',
        difficulty: 'hard',
        wordsToComplete: 12,
        timeLimit: 150,
        letterSpeed: 1.8,
        unlocked: false,
        reward: 200
    },
    {
        id: 7,
        name: 'Space Station',
        icon: '🚀',
        description: 'Out of this world!',
        difficulty: 'hard',
        wordsToComplete: 15,
        timeLimit: 180,
        letterSpeed: 2.0,
        unlocked: false,
        reward: 250
    },
    {
        id: 8,
        name: 'Dragon\'s Lair',
        icon: '🐉',
        description: 'Face the ultimate challenge!',
        difficulty: 'hard',
        wordsToComplete: 20,
        timeLimit: 240,
        letterSpeed: 2.2,
        unlocked: false,
        reward: 500
    }
];

// Word categories for different rounds
export const WORD_CATEGORIES = {
    animals: {
        easy: [
            { word: 'CAT', meaning: 'A small furry pet that says meow' },
            { word: 'DOG', meaning: 'A friendly pet that barks' },
            { word: 'BEE', meaning: 'An insect that makes honey' },
            { word: 'ANT', meaning: 'A tiny insect that works hard' },
            { word: 'FOX', meaning: 'A clever animal with a bushy tail' }
        ],
        medium: [
            { word: 'FISH', meaning: 'An animal that swims in water' },
            { word: 'BIRD', meaning: 'An animal with wings that can fly' },
            { word: 'FROG', meaning: 'A green animal that hops' },
            { word: 'DUCK', meaning: 'A bird that swims and says quack' },
            { word: 'BEAR', meaning: 'A big furry animal' }
        ],
        hard: [
            { word: 'TIGER', meaning: 'A big orange cat with black stripes' },
            { word: 'HORSE', meaning: 'A large animal you can ride' },
            { word: 'SHARK', meaning: 'A big fish with sharp teeth' },
            { word: 'EAGLE', meaning: 'A large bird that flies high' },
            { word: 'WHALE', meaning: 'The biggest animal in the ocean' }
        ]
    },
    food: {
        easy: [
            { word: 'CUP', meaning: 'You drink water from this' },
            { word: 'EGG', meaning: 'A round thing that chickens lay' },
            { word: 'PIE', meaning: 'A sweet dessert' },
            { word: 'JAM', meaning: 'Sweet spread for bread' },
            { word: 'TEA', meaning: 'A hot drink' }
        ],
        medium: [
            { word: 'CAKE', meaning: 'A sweet dessert for birthdays' },
            { word: 'MILK', meaning: 'A white drink from cows' },
            { word: 'RICE', meaning: 'Small white grains you eat' },
            { word: 'SOUP', meaning: 'A hot liquid meal' },
            { word: 'CORN', meaning: 'Yellow vegetable on a cob' }
        ],
        hard: [
            { word: 'APPLE', meaning: 'A red or green fruit' },
            { word: 'BREAD', meaning: 'Food made from flour' },
            { word: 'PIZZA', meaning: 'Round food with cheese' },
            { word: 'SALAD', meaning: 'Healthy mix of vegetables' },
            { word: 'PASTA', meaning: 'Italian noodles' }
        ]
    },
    nature: {
        easy: [
            { word: 'SUN', meaning: 'The bright star in the sky' },
            { word: 'SKY', meaning: 'The blue space above us' },
            { word: 'SEA', meaning: 'Large body of salt water' },
            { word: 'ICE', meaning: 'Frozen water' },
            { word: 'MUD', meaning: 'Wet dirt' }
        ],
        medium: [
            { word: 'TREE', meaning: 'A tall plant with leaves' },
            { word: 'STAR', meaning: 'A bright light in the night sky' },
            { word: 'MOON', meaning: 'The round light you see at night' },
            { word: 'RAIN', meaning: 'Water that falls from clouds' },
            { word: 'SNOW', meaning: 'White frozen water' }
        ],
        hard: [
            { word: 'CLOUD', meaning: 'White fluffy things in the sky' },
            { word: 'BEACH', meaning: 'Sandy place by the ocean' },
            { word: 'OCEAN', meaning: 'A very big body of salt water' },
            { word: 'RIVER', meaning: 'Water that flows to the sea' },
            { word: 'STORM', meaning: 'Bad weather with wind and rain' }
        ]
    },
    things: {
        easy: [
            { word: 'HAT', meaning: 'You wear this on your head' },
            { word: 'PEN', meaning: 'You write with this' },
            { word: 'BAG', meaning: 'You carry things in this' },
            { word: 'BOX', meaning: 'A container to put things in' },
            { word: 'TOY', meaning: 'Something fun to play with' }
        ],
        medium: [
            { word: 'BOOK', meaning: 'Something you read' },
            { word: 'BALL', meaning: 'A round toy you can throw' },
            { word: 'DOOR', meaning: 'You open this to enter a room' },
            { word: 'SOCK', meaning: 'You wear this on your foot' },
            { word: 'SHOE', meaning: 'You wear this to protect your feet' }
        ],
        hard: [
            { word: 'HOUSE', meaning: 'A building where people live' },
            { word: 'CHAIR', meaning: 'Furniture you sit on' },
            { word: 'TABLE', meaning: 'Furniture you eat on' },
            { word: 'PHONE', meaning: 'Device to call people' },
            { word: 'CLOCK', meaning: 'Shows you the time' }
        ]
    }
};
