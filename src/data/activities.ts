import type { CatalogueActivity, Context, Effort } from '../lib/types';

export const activities: CatalogueActivity[] = [
  // PLEASURE — Creative
  { id: 'p-1', name: 'Draw or doodle', description: 'Sketch freely without any goal or pressure', category: 'pleasure', group: 'Creative', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 'p-2', name: 'Creative writing', description: 'Write a short story, poem, or journal entry', category: 'pleasure', group: 'Creative', context: 'anywhere', effort: 'medium', durationMinutes: 30 },
  { id: 'p-3', name: 'Photography walk', description: 'Take a stroll and capture things that catch your eye', category: 'pleasure', group: 'Creative', context: 'outdoors', effort: 'medium', durationMinutes: 30 },
  { id: 'p-4', name: 'Bake something', description: 'Make something delicious to enjoy or share', category: 'pleasure', group: 'Creative', context: 'home', effort: 'medium', durationMinutes: 60 },
  { id: 'p-17', name: 'Colour in a colouring book', description: 'Simple, repetitive, oddly calming', category: 'pleasure', group: 'Creative', context: 'anywhere', effort: 'low', durationMinutes: 15 },
  { id: 'p-18', name: 'Play a musical instrument', description: 'Even a few minutes of noodling counts', category: 'pleasure', group: 'Creative', context: 'home', effort: 'medium', durationMinutes: 15 },
  { id: 'p-19', name: 'Sing along to music', description: 'Belt out a favourite song — no audience needed', category: 'pleasure', group: 'Creative', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'p-20', name: 'Make a playlist', description: 'Curate songs for a mood, memory, or moment', category: 'pleasure', group: 'Creative', context: 'anywhere', effort: 'low', durationMinutes: 10 },
  { id: 'p-21', name: 'Try hand lettering or calligraphy', description: 'Slow, intentional writing as a creative act', category: 'pleasure', group: 'Creative', context: 'home', effort: 'low', durationMinutes: 15 },

  // PLEASURE — Nature & Outdoors
  { id: 'p-5', name: 'Garden or tend plants', description: 'Nurture something living — indoors or out', category: 'pleasure', group: 'Nature', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 'p-6', name: 'Visit a cafe', description: 'Sit with a drink, watch the world go by', category: 'pleasure', group: 'Nature', context: 'outdoors', effort: 'low', durationMinutes: 30 },
  { id: 'p-22', name: 'Watch the sunset or sunrise', description: 'Step outside and take in the sky for a few minutes', category: 'pleasure', group: 'Nature', context: 'outdoors', effort: 'low', durationMinutes: 5 },
  { id: 'p-23', name: 'Sit in a park', description: 'Find a bench and just be somewhere green', category: 'pleasure', group: 'Nature', context: 'outdoors', effort: 'low', durationMinutes: 15 },
  { id: 'p-24', name: 'Watch birds or clouds', description: 'Look up and notice what\'s happening above', category: 'pleasure', group: 'Nature', context: 'outdoors', effort: 'low', durationMinutes: 5 },
  { id: 'p-25', name: 'Smell flowers or herbs', description: 'Engage your senses with something fragrant', category: 'pleasure', group: 'Nature', context: 'outdoors', effort: 'low', durationMinutes: 5 },
  { id: 'p-26', name: 'Visit a farmers market', description: 'Browse seasonal produce and local goods', category: 'pleasure', group: 'Nature', context: 'outdoors', effort: 'medium', durationMinutes: 30 },

  // PLEASURE — Entertainment
  { id: 'p-7', name: 'Listen to music', description: 'Put on an album you love or discover something new', category: 'pleasure', group: 'Entertainment', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'p-8', name: 'Watch a film', description: 'Choose something you\'ve been meaning to watch', category: 'pleasure', group: 'Entertainment', context: 'home', effort: 'low', durationMinutes: 120 },
  { id: 'p-9', name: 'Read a book', description: 'Fiction, non-fiction — whatever calls to you', category: 'pleasure', group: 'Entertainment', context: 'anywhere', effort: 'low', durationMinutes: 30 },
  { id: 'p-10', name: 'Play a video game', description: 'Engage in some digital fun and exploration', category: 'pleasure', group: 'Entertainment', context: 'home', effort: 'low', durationMinutes: 30 },
  { id: 'p-11', name: 'Do a puzzle', description: 'Jigsaw, crossword, or any puzzle you enjoy', category: 'pleasure', group: 'Entertainment', context: 'home', effort: 'low', durationMinutes: 20 },
  { id: 'p-12', name: 'Watch comedy', description: 'A funny show, stand-up, or clips that make you laugh', category: 'pleasure', group: 'Entertainment', context: 'home', effort: 'low', durationMinutes: 30 },
  { id: 'p-13', name: 'Browse a bookshop', description: 'Wander the shelves with no particular agenda', category: 'pleasure', group: 'Entertainment', context: 'outdoors', effort: 'medium', durationMinutes: 30 },
  { id: 'p-27', name: 'Listen to a podcast', description: 'Pick an episode on something you\'re curious about', category: 'pleasure', group: 'Entertainment', context: 'anywhere', effort: 'low', durationMinutes: 20 },
  { id: 'p-28', name: 'Watch a short YouTube video', description: 'Something funny, interesting, or comforting', category: 'pleasure', group: 'Entertainment', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'p-29', name: 'Look through old photos', description: 'Revisit happy memories on your phone or in an album', category: 'pleasure', group: 'Entertainment', context: 'anywhere', effort: 'low', durationMinutes: 10 },
  { id: 'p-30', name: 'Play a card game', description: 'Solitaire or patience — just you and the cards', category: 'pleasure', group: 'Entertainment', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 'p-31', name: 'Go to the cinema', description: 'The big screen makes an ordinary film feel like an event', category: 'pleasure', group: 'Entertainment', context: 'outdoors', effort: 'high', durationMinutes: 120 },

  // PLEASURE — Food & Pampering
  { id: 'p-14', name: 'Cook a new recipe', description: 'Try something you\'ve never made before', category: 'pleasure', group: 'Food & Pampering', context: 'home', effort: 'medium', durationMinutes: 60 },
  { id: 'p-15', name: 'Do nails/self-care', description: 'A small act of care for your body', category: 'pleasure', group: 'Food & Pampering', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 'p-16', name: 'Visit a gallery or museum', description: 'Wander through art, history, or science', category: 'pleasure', group: 'Food & Pampering', context: 'outdoors', effort: 'high', durationMinutes: 90 },
  { id: 'p-32', name: 'Make a nice cup of tea or coffee', description: 'Slow down and enjoy the ritual of preparing a drink', category: 'pleasure', group: 'Food & Pampering', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'p-33', name: 'Light a candle', description: 'A small sensory act that changes the mood of a room', category: 'pleasure', group: 'Food & Pampering', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'p-34', name: 'Give yourself a face mask', description: 'A few minutes of doing something kind for your skin', category: 'pleasure', group: 'Food & Pampering', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 'p-35', name: 'Eat a meal slowly and mindfully', description: 'Focus on taste and texture instead of rushing', category: 'pleasure', group: 'Food & Pampering', context: 'anywhere', effort: 'low', durationMinutes: 15 },
  { id: 'p-36', name: 'Buy yourself flowers', description: 'A small gift to yourself that brightens the room', category: 'pleasure', group: 'Food & Pampering', context: 'outdoors', effort: 'low', durationMinutes: 10 },

  // SOCIAL — One-to-one
  { id: 's-1', name: 'Call a friend', description: 'Pick up the phone and have a real conversation', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'medium' },
  { id: 's-2', name: 'Text someone you\'ve been meaning to reach out to', description: 'Send that message you\'ve been putting off', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-3', name: 'Meet someone for coffee', description: 'Arrange to sit down with someone you like', category: 'social', group: 'One-to-one', context: 'social', effort: 'high' },
  { id: 's-4', name: 'Video call a family member', description: 'Connect face-to-face over the screen', category: 'social', group: 'One-to-one', context: 'home', effort: 'medium' },
  { id: 's-5', name: 'Write a letter or card', description: 'Send something handwritten — surprisingly powerful', category: 'social', group: 'One-to-one', context: 'home', effort: 'medium', durationMinutes: 20 },
  { id: 's-6', name: 'Walk with a friend', description: 'Move and talk at the same time', category: 'social', group: 'One-to-one', context: 'social', effort: 'medium' },
  { id: 's-7', name: 'Message a friend a funny meme', description: 'Share something light and playful', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-8', name: 'Have a proper conversation with a neighbour', description: 'A brief but genuine human connection', category: 'social', group: 'One-to-one', context: 'outdoors', effort: 'medium', durationMinutes: 10 },
  { id: 's-17', name: 'Send a voice message to someone', description: 'More personal than text, easier than a call', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-18', name: 'Reply to a message you\'ve been putting off', description: 'Clear that social backlog — even one reply counts', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-19', name: 'Phone call to a friend about nothing', description: 'No agenda, just catching up for a few minutes', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-20', name: 'Say hi to someone at the shops', description: 'A small, friendly interaction with a stranger', category: 'social', group: 'One-to-one', context: 'outdoors', effort: 'low', durationMinutes: 5 },
  { id: 's-21', name: 'Compliment someone', description: 'Tell someone something genuine you appreciate about them', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-22', name: 'Ask someone how their day is going', description: 'Show interest in someone else\'s experience', category: 'social', group: 'One-to-one', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-23', name: 'Share a meal with someone', description: 'Eat together — even takeaway on the couch', category: 'social', group: 'One-to-one', context: 'social', effort: 'low', durationMinutes: 30 },
  { id: 's-24', name: 'Watch something together', description: 'Sit with someone and share a show or movie', category: 'social', group: 'One-to-one', context: 'social', effort: 'low', durationMinutes: 30 },
  { id: 's-25', name: 'Sit with someone in comfortable silence', description: 'You don\'t always need to talk to connect', category: 'social', group: 'One-to-one', context: 'social', effort: 'low', durationMinutes: 10 },

  // SOCIAL — Group & Community
  { id: 's-9', name: 'Cook a meal for someone', description: 'Show care through food', category: 'social', group: 'Group & Community', context: 'home', effort: 'medium', durationMinutes: 60 },
  { id: 's-10', name: 'Join a local class or group', description: 'Find others who share an interest', category: 'social', group: 'Group & Community', context: 'social', effort: 'high' },
  { id: 's-11', name: 'Play a board game with others', description: 'Friendly competition and shared laughter', category: 'social', group: 'Group & Community', context: 'social', effort: 'medium' },
  { id: 's-12', name: 'Volunteer for something', description: 'Give your time to something that matters', category: 'social', group: 'Group & Community', context: 'social', effort: 'high' },
  { id: 's-13', name: 'Attend a community event', description: 'Be part of something local and shared', category: 'social', group: 'Group & Community', context: 'social', effort: 'high' },
  { id: 's-14', name: 'Pet an animal', description: 'Time with animals can be wonderfully grounding', category: 'social', group: 'Group & Community', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 's-15', name: 'Plan a trip with someone', description: 'Looking forward to something together boosts mood', category: 'social', group: 'Group & Community', context: 'anywhere', effort: 'medium' },
  { id: 's-16', name: 'Join an online community', description: 'Find your people in a forum, group, or server', category: 'social', group: 'Group & Community', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 's-26', name: 'Go to a dog park', description: 'Dogs and their humans are an easy social setting', category: 'social', group: 'Group & Community', context: 'outdoors', effort: 'low', durationMinutes: 20 },
  { id: 's-27', name: 'Take a group fitness class', description: 'Move your body in the company of others', category: 'social', group: 'Group & Community', context: 'social', effort: 'high', durationMinutes: 45 },
  { id: 's-28', name: 'Visit a library', description: 'A quiet, shared space with no pressure to interact', category: 'social', group: 'Group & Community', context: 'outdoors', effort: 'low', durationMinutes: 30 },
  { id: 's-29', name: 'Do a favour for someone', description: 'Help with a small task — it benefits you both', category: 'social', group: 'Group & Community', context: 'anywhere', effort: 'low', durationMinutes: 10 },

  // ACHIEVEMENT — Home & Admin
  { id: 'a-1', name: 'Tidy one room', description: 'Not the whole house — just one space', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'medium', durationMinutes: 20 },
  { id: 'a-2', name: 'Do a load of laundry', description: 'A simple task that genuinely feels good when done', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 10 },
  { id: 'a-3', name: 'Pay a bill or admin task', description: 'Clear that thing that\'s been sitting on the list', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 10 },
  { id: 'a-4', name: 'Organise a drawer or shelf', description: 'Small space, satisfying result', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 'a-5', name: 'Fix something that\'s been broken', description: 'Repair something you\'ve been living around', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'medium' },
  { id: 'a-6', name: 'Declutter a bag or wardrobe section', description: 'Let go of things you no longer need', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'medium', durationMinutes: 20 },
  { id: 'a-7', name: 'Make your bed', description: 'Start or end the day with one completed act', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'a-17', name: 'Wash the dishes', description: 'Clear the sink — a small reset for the kitchen', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 10 },
  { id: 'a-18', name: 'Take out the rubbish', description: 'A quick task that makes the house feel fresher', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'a-19', name: 'Water the plants', description: 'A small act of care for your space', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'a-20', name: 'Wipe down the kitchen bench', description: 'A clean surface can shift how a room feels', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'a-21', name: 'Unsubscribe from 5 emails', description: 'Digital declutter — a few taps, instant relief', category: 'achievement', group: 'Home & Admin', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'a-22', name: 'Sort the mail', description: 'Open, file, or toss whatever\'s piling up', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'a-23', name: 'Book an appointment you\'ve been putting off', description: 'Make the call or fill in the form — just the booking', category: 'achievement', group: 'Home & Admin', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'a-24', name: 'Put clothes away', description: 'From the chair, the dryer, or the pile — find their home', category: 'achievement', group: 'Home & Admin', context: 'home', effort: 'low', durationMinutes: 10 },
  { id: 'a-25', name: 'Run an errand', description: 'Pick up something from the shops, post a letter', category: 'achievement', group: 'Home & Admin', context: 'outdoors', effort: 'medium', durationMinutes: 20 },

  // ACHIEVEMENT — Learning & Work
  { id: 'a-8', name: 'Read something educational', description: 'An article, chapter, or video that teaches you something', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'medium', durationMinutes: 20 },
  { id: 'a-9', name: 'Complete a work task', description: 'Tick off one thing that has been lingering', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'medium' },
  { id: 'a-10', name: 'Learn something new', description: 'A YouTube tutorial, podcast, or short course', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'medium', durationMinutes: 30 },
  { id: 'a-11', name: 'Make a to-do list and tick one thing off', description: 'Get clear on what\'s needed, then do one thing', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'low', durationMinutes: 10 },
  { id: 'a-12', name: 'Write in a journal', description: 'Put your thoughts somewhere outside your head', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'low', durationMinutes: 10 },
  { id: 'a-26', name: 'Set a goal for the week', description: 'Write down one thing you want to accomplish', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'a-27', name: 'Organise your phone apps', description: 'Delete what you don\'t use, tidy the rest', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'low', durationMinutes: 10 },
  { id: 'a-28', name: 'Write down three things you did today', description: 'Acknowledge what you actually accomplished', category: 'achievement', group: 'Learning & Work', context: 'anywhere', effort: 'low', durationMinutes: 5 },

  // ACHIEVEMENT — Physical
  { id: 'a-13', name: 'Go for a walk', description: 'Even 10 minutes outside counts', category: 'achievement', group: 'Physical', context: 'outdoors', effort: 'low', durationMinutes: 10 },
  { id: 'a-14', name: 'Exercise for 20 minutes', description: 'Any movement that gets your heart going', category: 'achievement', group: 'Physical', context: 'anywhere', effort: 'medium', durationMinutes: 20 },
  { id: 'a-15', name: 'Attend an appointment', description: 'Medical, therapy, or any commitment you\'ve been putting off', category: 'achievement', group: 'Physical', context: 'outdoors', effort: 'high' },
  { id: 'a-16', name: 'Prepare a healthy meal', description: 'Cook something nourishing for yourself', category: 'achievement', group: 'Physical', context: 'home', effort: 'medium', durationMinutes: 30 },
  { id: 'a-29', name: 'Do 10 push-ups or sit-ups', description: 'A quick burst of effort — done in under a minute', category: 'achievement', group: 'Physical', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'a-30', name: 'Walk to the shops instead of driving', description: 'Build movement into something you\'re already doing', category: 'achievement', group: 'Physical', context: 'outdoors', effort: 'medium', durationMinutes: 20 },
  { id: 'a-31', name: 'Get dressed and leave the house', description: 'Sometimes the hardest step is the first one out the door', category: 'achievement', group: 'Physical', context: 'outdoors', effort: 'low', durationMinutes: 5 },

  // BODY — Sleep & Rest
  { id: 'b-1', name: 'Go to bed at a consistent time', description: 'Anchor your sleep rhythm with a regular bedtime', category: 'body', group: 'Sleep & Rest', context: 'home', effort: 'low' },
  { id: 'b-2', name: 'Rest without screens for 30 minutes', description: 'Give your nervous system a genuine break', category: 'body', group: 'Sleep & Rest', context: 'home', effort: 'low', durationMinutes: 30 },
  { id: 'b-13', name: 'Take a 20-minute nap', description: 'A short rest to recharge — set an alarm so you don\'t worry', category: 'body', group: 'Sleep & Rest', context: 'home', effort: 'low', durationMinutes: 20 },
  { id: 'b-14', name: 'Put your phone in another room before bed', description: 'Remove the temptation and help your brain wind down', category: 'body', group: 'Sleep & Rest', context: 'home', effort: 'low', durationMinutes: 5 },

  // BODY — Movement
  { id: 'b-3', name: 'Stretch for 10 minutes', description: 'Gentle movement to release tension in your body', category: 'body', group: 'Movement', context: 'home', effort: 'low', durationMinutes: 10 },
  { id: 'b-4', name: 'Step outside for fresh air', description: 'Stand on the porch, walk to the letterbox — just be outside briefly', category: 'body', group: 'Movement', context: 'outdoors', effort: 'low', durationMinutes: 5 },
  { id: 'b-5', name: 'Do yoga or gentle movement', description: 'Connect with your body at whatever pace feels right', category: 'body', group: 'Movement', context: 'home', effort: 'medium', durationMinutes: 20 },
  { id: 'b-6', name: 'Go for a swim', description: 'Water has a uniquely calming effect on the body', category: 'body', group: 'Movement', context: 'outdoors', effort: 'high', durationMinutes: 45 },
  { id: 'b-15', name: 'Dance to one song', description: 'Put on a track and let your body move', category: 'body', group: 'Movement', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'b-16', name: 'Walk barefoot on grass', description: 'A brief sensory grounding exercise', category: 'body', group: 'Movement', context: 'outdoors', effort: 'low', durationMinutes: 5 },
  { id: 'b-17', name: 'Shake your body for 30 seconds', description: 'Tension release — shake hands, arms, shoulders, legs', category: 'body', group: 'Movement', context: 'anywhere', effort: 'low', durationMinutes: 5 },

  // BODY — Nourishment
  { id: 'b-7', name: 'Drink enough water today', description: 'Set a small intention to stay hydrated', category: 'body', group: 'Nourishment', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'b-8', name: 'Cook a nutritious meal', description: 'Prepare something that genuinely nourishes you', category: 'body', group: 'Nourishment', context: 'home', effort: 'medium', durationMinutes: 30 },
  { id: 'b-9', name: 'Take your medication / vitamins', description: 'A small, consistent act of self-care', category: 'body', group: 'Nourishment', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'b-18', name: 'Eat breakfast', description: 'Even something small — toast, fruit, a smoothie', category: 'body', group: 'Nourishment', context: 'home', effort: 'low', durationMinutes: 10 },
  { id: 'b-19', name: 'Have a glass of water right now', description: 'Not later — right now, while you\'re thinking about it', category: 'body', group: 'Nourishment', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'b-20', name: 'Eat a piece of fruit', description: 'Something fresh and simple', category: 'body', group: 'Nourishment', context: 'anywhere', effort: 'low', durationMinutes: 5 },

  // BODY — Sensory
  { id: 'b-10', name: 'Take a relaxing bath or shower', description: 'Use warmth and sensation to soothe your body', category: 'body', group: 'Sensory', context: 'home', effort: 'low', durationMinutes: 15 },
  { id: 'b-11', name: 'Spend time in natural light', description: 'Step outside or sit near a window in daylight', category: 'body', group: 'Sensory', context: 'outdoors', effort: 'low', durationMinutes: 10 },
  { id: 'b-12', name: 'Do a breathing exercise', description: 'A few minutes of intentional breath to calm the nervous system', category: 'body', group: 'Sensory', context: 'anywhere', effort: 'low', durationMinutes: 5 },
  { id: 'b-21', name: 'Apply body lotion or hand cream', description: 'A small act of physical care that engages touch', category: 'body', group: 'Sensory', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'b-22', name: 'Hold something warm', description: 'A mug, a heat pack, a warm towel — comfort through temperature', category: 'body', group: 'Sensory', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'b-23', name: 'Brush your teeth mindfully', description: 'Turn an automatic habit into a moment of presence', category: 'body', group: 'Sensory', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'b-24', name: 'Change into clean clothes', description: 'A fresh outfit can shift how you feel physically', category: 'body', group: 'Sensory', context: 'home', effort: 'low', durationMinutes: 5 },
  { id: 'b-25', name: 'Open the curtains or blinds', description: 'Let light in — a tiny reset for the room and for you', category: 'body', group: 'Sensory', context: 'home', effort: 'low', durationMinutes: 5 },
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

export const contextLabels: Record<Context, string> = {
  home: 'At Home',
  outdoors: 'Outside',
  social: 'With Others',
  anywhere: 'Anywhere',
};

export const contextColours: Record<Context, { bg: string; text: string; border: string }> = {
  home:     { bg: '#FFF5E6', text: '#8B6914', border: '#E8D4A0' },
  outdoors: { bg: '#E8F5E8', text: '#2D6B2D', border: '#B4D8B4' },
  social:   { bg: '#E0ECFF', text: '#2D4A8B', border: '#A0C0E8' },
  anywhere: { bg: '#F0E8FF', text: '#5A3D8B', border: '#C8B4E8' },
};

export const effortLabels: Record<Effort, string> = {
  low: 'Low effort',
  medium: 'Medium effort',
  high: 'High effort',
};
