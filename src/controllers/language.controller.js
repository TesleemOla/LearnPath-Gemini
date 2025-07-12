import { validationResult } from 'express-validator';
import Language from '../models/Language.js';
import { logger } from '../utils/logger.js';

// @desc    Get all languages
// @route   GET /api/languages
// @access  Public
export const getLanguages = async (req, res) => {
  try {
    const languages = await Language.find({ isActive: true }).sort('name');
    res.json(languages);
  } catch (error) {
    logger.error(`Error in getLanguages: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get language by ID
// @route   GET /api/languages/:id
// @access  Public
export const getLanguageById = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    res.json(language);
  } catch (error) {
    logger.error(`Error in getLanguageById: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a language
// @route   POST /api/languages
// @access  Private/Admin
export const createLanguage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      code,
      nativeName,
      flagIcon,
      difficulty,
      description,
      popularityRank,
    } = req.body;

    const languageExists = await Language.findOne({ code });

    if (languageExists) {
      return res.status(400).json({ message: 'Language already exists' });
    }

    const language = await Language.create({
      name,
      code,
      nativeName,
      flagIcon,
      difficulty,
      description,
      popularityRank,
    });

    res.status(201).json(language);
  } catch (error) {
    logger.error(`Error in createLanguage: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a language
// @route   PUT /api/languages/:id
// @access  Private/Admin
export const updateLanguage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    language.name = req.body.name || language.name;
    language.code = req.body.code || language.code;
    language.nativeName = req.body.nativeName || language.nativeName;
    language.flagIcon = req.body.flagIcon || language.flagIcon;
    language.difficulty = req.body.difficulty || language.difficulty;
    language.description = req.body.description || language.description;
    language.popularityRank = req.body.popularityRank || language.popularityRank;
    language.isActive = req.body.isActive !== undefined ? req.body.isActive : language.isActive;

    const updatedLanguage = await language.save();
    res.json(updatedLanguage);
  } catch (error) {
    logger.error(`Error in updateLanguage: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a language
// @route   DELETE /api/languages/:id
// @access  Private/Admin
export const deleteLanguage = async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);

    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    await language.deleteOne();
    res.json({ message: 'Language removed' });
  } catch (error) {
    logger.error(`Error in deleteLanguage: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};