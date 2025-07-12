import { validationResult } from 'express-validator';
import LearningPath from '../models/LearningPath.js';
import { logger } from '../utils/logger.js';

// @desc    Get all learning paths
// @route   GET /api/learning-paths
// @access  Public
export const getLearningPaths = async (req, res) => {
  try {
    const { language, level } = req.query;
    
    const filter = { isPublished: true };
    
    if (language) {
      filter.language = language;
    }
    
    if (level) {
      filter.level = level;
    }
    
    const learningPaths = await LearningPath.find(filter)
      .populate('language', 'name code nativeName')
      .sort('title');
      
    res.json(learningPaths);
  } catch (error) {
    logger.error(`Error in getLearningPaths: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get learning path by ID
// @route   GET /api/learning-paths/:id
// @access  Public
export const getLearningPathById = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id)
      .populate('language', 'name code nativeName')
      .populate({
        path: 'weeks.lessons',
        select: 'title description type duration order',
      });

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    res.json(learningPath);
  } catch (error) {
    logger.error(`Error in getLearningPathById: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a learning path
// @route   POST /api/learning-paths
// @access  Private/Admin
export const createLearningPath = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      language,
      level,
      title,
      description,
      duration,
      coverImage,
      objectives,
      prerequisites,
      weeks,
      isPublished,
    } = req.body;

    const learningPath = await LearningPath.create({
      language,
      level,
      title,
      description,
      duration,
      coverImage,
      objectives,
      prerequisites,
      weeks,
      isPublished,
    });

    res.status(201).json(learningPath);
  } catch (error) {
    logger.error(`Error in createLearningPath: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a learning path
// @route   PUT /api/learning-paths/:id
// @access  Private/Admin
export const updateLearningPath = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const learningPath = await LearningPath.findById(req.params.id);

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    learningPath.language = req.body.language || learningPath.language;
    learningPath.level = req.body.level || learningPath.level;
    learningPath.title = req.body.title || learningPath.title;
    learningPath.description = req.body.description || learningPath.description;
    learningPath.duration = req.body.duration || learningPath.duration;
    learningPath.coverImage = req.body.coverImage || learningPath.coverImage;
    learningPath.objectives = req.body.objectives || learningPath.objectives;
    learningPath.prerequisites = req.body.prerequisites || learningPath.prerequisites;
    learningPath.weeks = req.body.weeks || learningPath.weeks;
    learningPath.isPublished = req.body.isPublished !== undefined 
      ? req.body.isPublished 
      : learningPath.isPublished;

    const updatedLearningPath = await learningPath.save();
    res.json(updatedLearningPath);
  } catch (error) {
    logger.error(`Error in updateLearningPath: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a learning path
// @route   DELETE /api/learning-paths/:id
// @access  Private/Admin
export const deleteLearningPath = async (req, res) => {
  try {
    const learningPath = await LearningPath.findById(req.params.id);

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    await learningPath.deleteOne();
    res.json({ message: 'Learning path removed' });
  } catch (error) {
    logger.error(`Error in deleteLearningPath: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};