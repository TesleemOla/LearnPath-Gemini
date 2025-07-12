import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Language from '../models/Language.js';
import LearningPath from '../models/LearningPath.js';
import Lesson from '../models/Lesson.js';
import { connectDB } from '../config/db.js';

dotenv.config();

// Connect to database
connectDB();

// Sample admin user
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    nativeLanguage: 'English',
  },
];

// Sample languages
const languages = [
  {
    name: 'Spanish',
    code: 'es',
    nativeName: 'Español',
    flagIcon: '🇪🇸',
    difficulty: 'easy',
    description:
      'Spanish is the second most spoken language in the world. It\'s known for its clear pronunciation and similar structure to English.',
    popularityRank: 1,
    isActive: true,
  },
  {
    name: 'French',
    code: 'fr',
    nativeName: 'Français',
    flagIcon: '🇫🇷',
    difficulty: 'medium',
    description:
      'French is a beautiful language spoken worldwide. It has a rich cultural heritage and is considered the language of love and cuisine.',
    popularityRank: 2,
    isActive: true,
  },
  {
    name: 'Japanese',
    code: 'ja',
    nativeName: '日本語',
    flagIcon: '🇯🇵',
    difficulty: 'hard',
    description:
      'Japanese features three writing systems and a completely different sentence structure from English. It\'s a fascinating language with rich cultural connections.',
    popularityRank: 3,
    isActive: true,
  },
];

// Sample learning paths
const createLearningPaths = (languageIds) => {
  return [
    {
      language: languageIds[0], // Spanish
      level: 'beginner',
      title: 'Spanish for Beginners: 8-Week Journey',
      description:
        'Start your Spanish journey with this comprehensive 8-week course designed for complete beginners.',
      duration: 8,
      coverImage: 'https://example.com/images/spanish-beginner.jpg',
      objectives: [
        'Learn basic Spanish greetings and introductions',
        'Master essential vocabulary for everyday situations',
        'Understand present tense verbs',
        'Hold basic conversations in Spanish',
      ],
      prerequisites: [],
      weeks: [
        {
          weekNumber: 1,
          title: 'Greetings and Introductions',
          description: 'Learn how to introduce yourself and greet others in Spanish.',
          lessons: [],
        },
        {
          weekNumber: 2,
          title: 'Numbers, Colors, and Basic Nouns',
          description: 'Master essential vocabulary for describing objects around you.',
          lessons: [],
        },
      ],
      isPublished: true,
    },
    {
      language: languageIds[1], // French
      level: 'beginner',
      title: 'French from Zero to Conversation',
      description:
        'Learn French from scratch with this structured 8-week program that will have you speaking with confidence.',
      duration: 8,
      coverImage: 'https://example.com/images/french-beginner.jpg',
      objectives: [
        'Master French pronunciation and accent',
        'Learn essential vocabulary for daily life',
        'Understand basic French grammar structures',
        'Build confidence in speaking French',
      ],
      prerequisites: [],
      weeks: [
        {
          weekNumber: 1,
          title: 'French Sounds and Greetings',
          description: 'Learn the basics of French pronunciation and essential greetings.',
          lessons: [],
        },
        {
          weekNumber: 2,
          title: 'Introducing Yourself in French',
          description: 'Master the art of French introductions and small talk.',
          lessons: [],
        },
      ],
      isPublished: true,
    },
  ];
};

// Sample lessons
const createLessons = (languageIds) => {
  return [
    {
      title: 'Spanish Greetings and Introductions',
      description: 'Learn how to say hello and introduce yourself in Spanish.',
      language: languageIds[0], // Spanish
      level: 'beginner',
      type: 'vocabulary',
      content: '# Spanish Greetings\n\n- Hola = Hello\n- Buenos días = Good morning\n- Buenas tardes = Good afternoon\n- Buenas noches = Good evening/night\n\n# Introductions\n\n- Me llamo... = My name is...\n- ¿Cómo te llamas? = What is your name?\n- Mucho gusto = Nice to meet you',
      aiPrompt: 'Create a beginner-friendly lesson on Spanish greetings and introductions with example dialogues.',
      duration: 30,
      order: 1,
      resources: [
        {
          title: 'Spanish Greetings Video',
          type: 'video',
          url: 'https://example.com/videos/spanish-greetings.mp4',
        },
      ],
      exercises: [
        {
          question: 'How do you say "Good afternoon" in Spanish?',
          options: ['Buenos días', 'Buenas tardes', 'Buenas noches', 'Hola'],
          correctAnswer: 'Buenas tardes',
          explanation: 'Buenas tardes is used in the afternoon until sunset.',
        },
      ],
      isPublished: true,
    },
    {
      title: 'French Pronunciation Basics',
      description: 'Master the fundamentals of French pronunciation and accent.',
      language: languageIds[1], // French
      level: 'beginner',
      type: 'listening',
      content: '# French Vowel Sounds\n\n- A: as in "father"\n- E: as in "may" when accented (é), or unstressed like "uh"\n- I: as in "machine"\n- O: as in "go"\n- U: no English equivalent, rounded lips saying "ee"\n\n# Nasal Sounds\n\n- AN/EN: no English equivalent\n- IN: no English equivalent\n- ON: no English equivalent\n- UN: no English equivalent',
      aiPrompt: 'Create a beginner-friendly lesson on French pronunciation focusing on vowel sounds and nasal sounds with audio examples.',
      duration: 45,
      order: 1,
      resources: [
        {
          title: 'French Pronunciation Guide',
          type: 'audio',
          url: 'https://example.com/audio/french-pronunciation.mp3',
        },
      ],
      exercises: [
        {
          question: 'Which of these is NOT a nasal sound in French?',
          options: ['AN', 'EN', 'IN', 'IL'],
          correctAnswer: 'IL',
          explanation: 'IL is not a nasal sound in French. The nasal sounds are AN/EN, IN, ON, and UN.',
        },
      ],
      isPublished: true,
    },
  ];
};

// Import data function
const importData = async () => {
  try {
    // Clear all data
    await User.deleteMany();
    await Language.deleteMany();
    await LearningPath.deleteMany();
    await Lesson.deleteMany();

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('Users imported!');

    // Create languages
    const createdLanguages = await Language.insertMany(languages);
    console.log('Languages imported!');

    // Get language IDs
    const languageIds = createdLanguages.map((lang) => lang._id);

    // Create learning paths
    const learningPaths = createLearningPaths(languageIds);
    const createdLearningPaths = await LearningPath.insertMany(learningPaths);
    console.log('Learning paths imported!');

    // Create lessons
    const lessons = createLessons(languageIds);
    const createdLessons = await Lesson.insertMany(lessons);
    console.log('Lessons imported!');

    // Add lessons to learning paths
    const spanishPath = createdLearningPaths[0];
    const frenchPath = createdLearningPaths[1];

    spanishPath.weeks[0].lessons = [createdLessons[0]._id];
    frenchPath.weeks[0].lessons = [createdLessons[1]._id];

    await spanishPath.save();
    await frenchPath.save();
    console.log('Lessons added to learning paths!');

    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data function
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Language.deleteMany();
    await LearningPath.deleteMany();
    await Lesson.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}