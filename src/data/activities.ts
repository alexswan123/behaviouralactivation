import type { CatalogueActivity } from '../lib/types';

export const activities: CatalogueActivity[] = [
  // PLEASURE — Creative
  { id: 'p-1', name: 'Draw or doodle', description: 'Sketch freely without any goal or pressure', category: 'pleasure', group: 'Creative' },
  { id: 'p-2', name: 'Creative writing', description: 'Write a short story, poem, or journal entry', category: 'pleasure', group: 'Creative' },
  { id: 'p-3', name: 'Photography walk', description: 'Take a stroll and capture things that catch your eye', category: 'pleasure', group: 'Creative' },
  { id: 'p-4', name: 'Bake something', description: 'Make something delicious to enjoy or share', category: 'pleasure', group: 'Creative' },

  // PLEASURE — Nature & Outdoors
  { id: 'p-5', name: 'Garden or tend plants', description: 'Nurture something living — indoors or out', category: 'pleasure', group: 'Nature' },
  { id: 'p-6', name: 'Visit a café', description: 'Sit with a drink, watch the world go by', category: 'pleasure', group: 'Nature' },

  // PLEASURE — Entertainment
  { id: 'p-7', name: 'Listen to music', description: 'Put on an album you love or discover something new', category: 'pleasure', group: 'Entertainment' },
  { id: 'p-8', name: 'Watch a film', description: 'Choose something you\'ve been meaning to watch', category: 'pleasure', group: 'Entertainment' },
  { id: 'p-9', name: 'Read a book', description: 'Fiction, non-fiction — whatever calls to you', category: 'pleasure', group: 'Entertainment' },
  { id: 'p-10', name: 'Play a video game', description: 'Engage in some digital fun and exploration', category: 'pleasure', group: 'Entertainment' },
  { id: 'p-11', name: 'Do a puzzle', description: 'Jigsaw, crossword, or any puzzle you enjoy', category: 'pleasure', group: 'Entertainment' },
  { id: 'p-12', name: 'Watch comedy', description: 'A funny show, stand-up, or clips that make you laugh', category: 'pleasure', group: 'Entertainment' },
  { id: 'p-13', name: 'Browse a bookshop', description: 'Wander the shelves with no particular agenda', category: 'pleasure', group: 'Entertainment' },

  // PLEASURE — Food & Pampering
  { id: 'p-14', name: 'Cook a new recipe', description: 'Try something you\'ve never made before', category: 'pleasure', group: 'Food & Pampering' },
  { id: 'p-15', name: 'Do nails/self-care', description: 'A small act of care for your body', category: 'pleasure', group: 'Food & Pampering' },
  { id: 'p-16', name: 'Visit a gallery or museum', description: 'Wander through art, history, or science', category: 'pleasure', group: 'Food & Pampering' },

  // SOCIAL — One-to-one
  { id: 's-1', name: 'Call a friend', description: 'Pick up the phone and have a real conversation', category: 'social', group: 'One-to-one' },
  { id: 's-2', name: 'Text someone you\'ve been meaning to reach out to', description: 'Send that message you\'ve been putting off', category: 'social', group: 'One-to-one' },
  { id: 's-3', name: 'Meet someone for coffee', description: 'Arrange to sit down with someone you like', category: 'social', group: 'One-to-one' },
  { id: 's-4', name: 'Video call a family member', description: 'Connect face-to-face over the screen', category: 'social', group: 'One-to-one' },
  { id: 's-5', name: 'Write a letter or card', description: 'Send something handwritten — surprisingly powerful', category: 'social', group: 'One-to-one' },
  { id: 's-6', name: 'Walk with a friend', description: 'Move and talk at the same time', category: 'social', group: 'One-to-one' },
  { id: 's-7', name: 'Message a friend a funny meme', description: 'Share something light and playful', category: 'social', group: 'One-to-one' },
  { id: 's-8', name: 'Have a proper conversation with a neighbour', description: 'A brief but genuine human connection', category: 'social', group: 'One-to-one' },

  // SOCIAL — Group & Community
  { id: 's-9', name: 'Cook a meal for someone', description: 'Show care through food', category: 'social', group: 'Group & Community' },
  { id: 's-10', name: 'Join a local class or group', description: 'Find others who share an interest', category: 'social', group: 'Group & Community' },
  { id: 's-11', name: 'Play a board game with others', description: 'Friendly competition and shared laughter', category: 'social', group: 'Group & Community' },
  { id: 's-12', name: 'Volunteer for something', description: 'Give your time to something that matters', category: 'social', group: 'Group & Community' },
  { id: 's-13', name: 'Attend a community event', description: 'Be part of something local and shared', category: 'social', group: 'Group & Community' },
  { id: 's-14', name: 'Pet an animal', description: 'Time with animals can be wonderfully grounding', category: 'social', group: 'Group & Community' },
  { id: 's-15', name: 'Plan a trip with someone', description: 'Looking forward to something together boosts mood', category: 'social', group: 'Group & Community' },
  { id: 's-16', name: 'Join an online community', description: 'Find your people in a forum, group, or server', category: 'social', group: 'Group & Community' },

  // ACHIEVEMENT — Home & Admin
  { id: 'a-1', name: 'Tidy one room', description: 'Not the whole house — just one space', category: 'achievement', group: 'Home & Admin' },
  { id: 'a-2', name: 'Do a load of laundry', description: 'A simple task that genuinely feels good when done', category: 'achievement', group: 'Home & Admin' },
  { id: 'a-3', name: 'Pay a bill or admin task', description: 'Clear that thing that\'s been sitting on the list', category: 'achievement', group: 'Home & Admin' },
  { id: 'a-4', name: 'Organise a drawer or shelf', description: 'Small space, satisfying result', category: 'achievement', group: 'Home & Admin' },
  { id: 'a-5', name: 'Fix something that\'s been broken', description: 'Repair something you\'ve been living around', category: 'achievement', group: 'Home & Admin' },
  { id: 'a-6', name: 'Declutter a bag or wardrobe section', description: 'Let go of things you no longer need', category: 'achievement', group: 'Home & Admin' },
  { id: 'a-7', name: 'Make your bed', description: 'Start or end the day with one completed act', category: 'achievement', group: 'Home & Admin' },

  // ACHIEVEMENT — Learning & Work
  { id: 'a-8', name: 'Read something educational', description: 'An article, chapter, or video that teaches you something', category: 'achievement', group: 'Learning & Work' },
  { id: 'a-9', name: 'Complete a work task', description: 'Tick off one thing that has been lingering', category: 'achievement', group: 'Learning & Work' },
  { id: 'a-10', name: 'Learn something new', description: 'A YouTube tutorial, podcast, or short course', category: 'achievement', group: 'Learning & Work' },
  { id: 'a-11', name: 'Make a to-do list and tick one thing off', description: 'Get clear on what\'s needed, then do one thing', category: 'achievement', group: 'Learning & Work' },
  { id: 'a-12', name: 'Write in a journal', description: 'Put your thoughts somewhere outside your head', category: 'achievement', group: 'Learning & Work' },

  // ACHIEVEMENT — Physical
  { id: 'a-13', name: 'Go for a walk', description: 'Even 10 minutes outside counts', category: 'achievement', group: 'Physical' },
  { id: 'a-14', name: 'Exercise for 20 minutes', description: 'Any movement that gets your heart going', category: 'achievement', group: 'Physical' },
  { id: 'a-15', name: 'Attend an appointment', description: 'Medical, therapy, or any commitment you\'ve been putting off', category: 'achievement', group: 'Physical' },
  { id: 'a-16', name: 'Prepare a healthy meal', description: 'Cook something nourishing for yourself', category: 'achievement', group: 'Physical' },

  // BODY — Sleep & Rest
  { id: 'b-1', name: 'Go to bed at a consistent time', description: 'Anchor your sleep rhythm with a regular bedtime', category: 'body', group: 'Sleep & Rest' },
  { id: 'b-2', name: 'Rest without screens for 30 minutes', description: 'Give your nervous system a genuine break', category: 'body', group: 'Sleep & Rest' },

  // BODY — Movement
  { id: 'b-3', name: 'Stretch for 10 minutes', description: 'Gentle movement to release tension in your body', category: 'body', group: 'Movement' },
  { id: 'b-4', name: 'Take a short walk outside', description: 'Fresh air and light movement, even briefly', category: 'body', group: 'Movement' },
  { id: 'b-5', name: 'Do yoga or gentle movement', description: 'Connect with your body at whatever pace feels right', category: 'body', group: 'Movement' },
  { id: 'b-6', name: 'Go for a swim', description: 'Water has a uniquely calming effect on the body', category: 'body', group: 'Movement' },

  // BODY — Nourishment
  { id: 'b-7', name: 'Drink enough water today', description: 'Set a small intention to stay hydrated', category: 'body', group: 'Nourishment' },
  { id: 'b-8', name: 'Cook a nutritious meal', description: 'Prepare something that genuinely nourishes you', category: 'body', group: 'Nourishment' },
  { id: 'b-9', name: 'Take your medication / vitamins', description: 'A small, consistent act of self-care', category: 'body', group: 'Nourishment' },

  // BODY — Sensory
  { id: 'b-10', name: 'Take a relaxing bath or shower', description: 'Use warmth and sensation to soothe your body', category: 'body', group: 'Sensory' },
  { id: 'b-11', name: 'Spend time in natural light', description: 'Step outside or sit near a window in daylight', category: 'body', group: 'Sensory' },
  { id: 'b-12', name: 'Do a breathing exercise', description: 'A few minutes of intentional breath to calm the nervous system', category: 'body', group: 'Sensory' },
];

export const categoryLabels: Record<string, string> = {
  pleasure: 'Pleasure',
  social: 'Social',
  achievement: 'Achievement',
  body: 'Body',
};

export const categoryColours: Record<string, { bg: string; text: string; border: string }> = {
  pleasure:    { bg: '#FDE8E8', text: '#9B3A45', border: '#F5B8BE' },
  social:      { bg: '#D8EDD8', text: '#2D5A3A', border: '#A8CCA8' },
  achievement: { bg: '#FFF0DC', text: '#7B4A10', border: '#F5D4A0' },
  body:        { bg: '#DCE8F5', text: '#1A3A6B', border: '#A8C4E8' },
};
