import { body } from 'express-validator';

export const userValidators = {
  register: [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('nativeLanguage').notEmpty().withMessage('Native language is required'),
  ],
  login: [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
};

export const languageValidators = {
  create: [
    body('name').notEmpty().withMessage('Language name is required'),
    body('code').notEmpty().withMessage('Language code is required'),
    body('nativeName').notEmpty().withMessage('Native name is required'),
    body('difficulty')
      .isIn(['easy', 'medium', 'hard', 'very hard'])
      .withMessage('Valid difficulty level is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
};

export const learningPathValidators = {
  create: [
    body('language').notEmpty().withMessage('Language ID is required'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Valid level is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
};

export const lessonValidators = {
  create: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('language').notEmpty().withMessage('Language ID is required'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Valid level is required'),
    body('type')
      .isIn([
        'vocabulary',
        'grammar',
        'reading',
        'listening',
        'speaking',
        'writing',
        'culture',
        'assessment',
      ])
      .withMessage('Valid lesson type is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('aiPrompt').notEmpty().withMessage('AI prompt is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('order').isNumeric().withMessage('Order must be a number'),
  ],
};

export const progressValidators = {
  completeLesson: [
    body('learningPathId').notEmpty().withMessage('Learning path ID is required'),
    body('lessonId').notEmpty().withMessage('Lesson ID is required'),
  ],
  weeklyAssessment: [
    body('learningPathId').notEmpty().withMessage('Learning path ID is required'),
    body('week').isNumeric().withMessage('Week must be a number'),
    body('score')
      .isNumeric()
      .isInt({ min: 0, max: 100 })
      .withMessage('Score must be a number between 0 and 100'),
  ],
  vocabulary: [
    body('learningPathId').notEmpty().withMessage('Learning path ID is required'),
    body('word').notEmpty().withMessage('Word is required'),
    body('translation').notEmpty().withMessage('Translation is required'),
  ],
};

export const aiValidators = {
  generate: [
    body('prompt').notEmpty().withMessage('Prompt is required'),
    body('language').notEmpty().withMessage('Language is required'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Valid level is required'),
    body('contextType')
      .isIn(['vocabulary', 'grammar', 'conversation', 'culture', 'reading', 'exercises'])
      .withMessage('Valid context type is required'),
  ],
  conversation: [
    body('language').notEmpty().withMessage('Language is required'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Valid level is required'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('userMessage').notEmpty().withMessage('User message is required'),
  ],
  feedback: [
    body('language').notEmpty().withMessage('Language is required'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Valid level is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('contentType')
      .isIn(['writing', 'speaking'])
      .withMessage('Content type must be writing or speaking'),
  ],
  assessment: [
    body('language').notEmpty().withMessage('Language is required'),
    body('level')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Valid level is required'),
    body('week').isNumeric().withMessage('Week must be a number'),
    body('topics').isArray().withMessage('Topics must be an array'),
  ],
};