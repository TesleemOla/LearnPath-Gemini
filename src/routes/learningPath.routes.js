import express from 'express';
import {
  getLearningPaths,
  getLearningPathById,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
} from '../controllers/learningPath.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { learningPathValidators } from '../middleware/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/learning-paths:
 *   get:
 *     summary: Get all learning paths
 *     tags: [Learning Paths]
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
 *     responses:
 *       200:
 *         description: A list of learning paths
 */
router.get('/', getLearningPaths);

/**
 * @swagger
 * /api/learning-paths/{id}:
 *   get:
 *     summary: Get learning path by ID
 *     tags: [Learning Paths]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Learning path ID
 *     responses:
 *       200:
 *         description: Learning path details
 *       404:
 *         description: Learning path not found
 */
router.get('/:id', getLearningPathById);

/**
 * @swagger
 * /api/learning-paths:
 *   post:
 *     summary: Create a learning path
 *     tags: [Learning Paths]
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
 *               - title
 *               - description
 *             properties:
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               coverImage:
 *                 type: string
 *               objectives:
 *                 type: array
 *                 items:
 *                   type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *               weeks:
 *                 type: array
 *                 items:
 *                   type: object
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Learning path created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.post(
  '/',
  protect,
  admin,
  learningPathValidators.create,
  createLearningPath
);

/**
 * @swagger
 * /api/learning-paths/{id}:
 *   put:
 *     summary: Update a learning path
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Learning path ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               coverImage:
 *                 type: string
 *               objectives:
 *                 type: array
 *                 items:
 *                   type: string
 *               prerequisites:
 *                 type: array
 *                 items:
 *                   type: string
 *               weeks:
 *                 type: array
 *                 items:
 *                   type: object
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Learning path updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Learning path not found
 */
router.put('/:id', protect, admin, updateLearningPath);

/**
 * @swagger
 * /api/learning-paths/{id}:
 *   delete:
 *     summary: Delete a learning path
 *     tags: [Learning Paths]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Learning path ID
 *     responses:
 *       200:
 *         description: Learning path removed
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Learning path not found
 */
router.delete('/:id', protect, admin, deleteLearningPath);

export default router;