import express from 'express';
import {
  generateContent,
  generateConversation,
  generateFeedback,
  generateAssessment,
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { aiValidators } from '../middleware/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/ai/generate:
 *   post:
 *     summary: Generate content using Gemini AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *               - language
 *               - level
 *               - contextType
 *             properties:
 *               prompt:
 *                 type: string
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               contextType:
 *                 type: string
 *                 enum: [vocabulary, grammar, conversation, culture, reading, exercises]
 *     responses:
 *       200:
 *         description: AI generated content
 *       401:
 *         description: Not authorized
 */
router.post('/generate', protect, aiValidators.generate, generateContent);

/**
 * @swagger
 * /api/ai/conversation:
 *   post:
 *     summary: Generate conversation practice using Gemini AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *               - level
 *               - topic
 *               - userMessage
 *             properties:
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               topic:
 *                 type: string
 *               userMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: AI generated conversation
 *       401:
 *         description: Not authorized
 */
router.post(
  '/conversation',
  protect,
  aiValidators.conversation,
  generateConversation
);

/**
 * @swagger
 * /api/ai/feedback:
 *   post:
 *     summary: Generate feedback on user's writing or speaking
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *               - level
 *               - content
 *               - contentType
 *             properties:
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               content:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [writing, speaking]
 *     responses:
 *       200:
 *         description: AI generated feedback
 *       401:
 *         description: Not authorized
 */
router.post('/feedback', protect, aiValidators.feedback, generateFeedback);

/**
 * @swagger
 * /api/ai/assessment:
 *   post:
 *     summary: Generate weekly assessment for language learning
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - language
 *               - level
 *               - week
 *               - topics
 *             properties:
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               week:
 *                 type: number
 *               topics:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: AI generated assessment
 *       401:
 *         description: Not authorized
 */
router.post('/assessment', protect, aiValidators.assessment, generateAssessment);

export default router;