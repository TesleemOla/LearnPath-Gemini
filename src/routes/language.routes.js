import express from 'express';
import {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
} from '../controllers/language.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { languageValidators } from '../middleware/validators.js';

const router = express.Router();

/**
 * @swagger
 * /api/languages:
 *   get:
 *     summary: Get all languages
 *     tags: [Languages]
 *     responses:
 *       200:
 *         description: A list of languages
 */
router.get('/', getLanguages);

/**
 * @swagger
 * /api/languages/{id}:
 *   get:
 *     summary: Get language by ID
 *     tags: [Languages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Language details
 *       404:
 *         description: Language not found
 */
router.get('/:id', getLanguageById);

/**
 * @swagger
 * /api/languages:
 *   post:
 *     summary: Create a language
 *     tags: [Languages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - nativeName
 *               - difficulty
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               nativeName:
 *                 type: string
 *               flagIcon:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard, very hard]
 *               description:
 *                 type: string
 *               popularityRank:
 *                 type: number
 *     responses:
 *       201:
 *         description: Language created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, admin, languageValidators.create, createLanguage);

/**
 * @swagger
 * /api/languages/{id}:
 *   put:
 *     summary: Update a language
 *     tags: [Languages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Language ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               nativeName:
 *                 type: string
 *               flagIcon:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard, very hard]
 *               description:
 *                 type: string
 *               popularityRank:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Language updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Language not found
 */
router.put('/:id', protect, admin, updateLanguage);

/**
 * @swagger
 * /api/languages/{id}:
 *   delete:
 *     summary: Delete a language
 *     tags: [Languages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Language ID
 *     responses:
 *       200:
 *         description: Language removed
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Language not found
 */
router.delete('/:id', protect, admin, deleteLanguage);

export default router;