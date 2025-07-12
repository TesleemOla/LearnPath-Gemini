import express from 'express';
import {
  getLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/lesson.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { lessonValidators } from '../middleware/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lessons]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Language ID to filter by
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Level to filter by
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [vocabulary, grammar, reading, listening, speaking, writing, culture, assessment]
 *         description: Lesson type to filter by
 *     responses:
 *       200:
 *         description: A list of lessons
 */
router.get('/', getLessons);

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson details
 *       404:
 *         description: Lesson not found
 */
router.get('/:id', getLessonById);

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - language
 *               - level
 *               - type
 *               - content
 *               - aiPrompt
 *               - duration
 *               - order
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               type:
 *                 type: string
 *                 enum: [vocabulary, grammar, reading, listening, speaking, writing, culture, assessment]
 *               content:
 *                 type: string
 *               aiPrompt:
 *                 type: string
 *               duration:
 *                 type: number
 *               order:
 *                 type: number
 *               resources:
 *                 type: array
 *                 items:
 *                   type: object
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, admin, lessonValidators.create, createLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lesson ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               type:
 *                 type: string
 *                 enum: [vocabulary, grammar, reading, listening, speaking, writing, culture, assessment]
 *               content:
 *                 type: string
 *               aiPrompt:
 *                 type: string
 *               duration:
 *                 type: number
 *               order:
 *                 type: number
 *               resources:
 *                 type: array
 *                 items:
 *                   type: object
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Lesson not found
 */
router.put('/:id', protect, admin, updateLesson);

/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson removed
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Lesson not found
 */
router.delete('/:id', protect, admin, deleteLesson);

export default router;