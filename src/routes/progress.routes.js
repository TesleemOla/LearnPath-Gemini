import express from 'express';
import {
  getUserProgress,
  getProgressByLearningPath,
  startLearningPath,
  completeLesson,
  submitWeeklyAssessment,
  addVocabularyWord,
} from '../controllers/progress.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { progressValidators } from '../middleware/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Get user's progress for all learning paths
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User progress data
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getUserProgress);

/**
 * @swagger
 * /api/progress/{learningPathId}:
 *   get:
 *     summary: Get user's progress for a specific learning path
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: learningPathId
 *         schema:
 *           type: string
 *         required: true
 *         description: Learning path ID
 *     responses:
 *       200:
 *         description: User progress data for specific learning path
 *       401:
 *         description: Not authorized
 *       404:
 *         description: No progress found
 */
router.get('/:learningPathId', protect, getProgressByLearningPath);

/**
 * @swagger
 * /api/progress/start/{learningPathId}:
 *   post:
 *     summary: Start a new learning path
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: learningPathId
 *         schema:
 *           type: string
 *         required: true
 *         description: Learning path ID
 *     responses:
 *       201:
 *         description: Learning path started successfully
 *       400:
 *         description: Already started or invalid
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Learning path not found
 */
router.post('/start/:learningPathId', protect, startLearningPath);

/**
 * @swagger
 * /api/progress/complete-lesson:
 *   post:
 *     summary: Complete a lesson
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learningPathId
 *               - lessonId
 *             properties:
 *               learningPathId:
 *                 type: string
 *               lessonId:
 *                 type: string
 *               score:
 *                 type: number
 *               timeSpent:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson completed successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: No progress found
 */
router.post(
  '/complete-lesson',
  protect,
  progressValidators.completeLesson,
  completeLesson
);

/**
 * @swagger
 * /api/progress/weekly-assessment:
 *   post:
 *     summary: Submit weekly assessment
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learningPathId
 *               - week
 *               - score
 *             properties:
 *               learningPathId:
 *                 type: string
 *               week:
 *                 type: number
 *               score:
 *                 type: number
 *               feedback:
 *                 type: string
 *               strengths:
 *                 type: array
 *                 items:
 *                   type: string
 *               areasToImprove:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Assessment submitted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: No progress found
 */
router.post(
  '/weekly-assessment',
  protect,
  progressValidators.weeklyAssessment,
  submitWeeklyAssessment
);

/**
 * @swagger
 * /api/progress/vocabulary:
 *   post:
 *     summary: Add vocabulary word to user's mastered list
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learningPathId
 *               - word
 *               - translation
 *             properties:
 *               learningPathId:
 *                 type: string
 *               word:
 *                 type: string
 *               translation:
 *                 type: string
 *               mastered:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Vocabulary word added successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: No progress found
 */
router.post(
  '/vocabulary',
  protect,
  progressValidators.vocabulary,
  addVocabularyWord
);

export default router;