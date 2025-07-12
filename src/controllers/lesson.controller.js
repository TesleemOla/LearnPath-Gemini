import { validationResult } from 'express-validator';
import Lesson from '../models/Lesson.js';
import LearningPath from '../models/LearningPath.js';
import { logger } from '../utils/logger.js';

// @desc    Get all lessons
// @route   GET /api/lessons
// @access  Public
export const getLessons = async (req, res) => {
  try {
    const { language, level, type } = req.query;
    
    const filter = { isPublished: true };
    
    if (language) {
      filter.language = language;
    }
    
    if (level) {
      filter.level = level;
    }
    
    if (type) {
      filter.type = type;
    }
    
    const lessons = await Lesson.find(filter)
      .populate('language', 'name code')
      .sort('order');
      
    res.json(lessons);
  } catch (error) {
    logger.error(`Error in getLessons: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get lesson by ID
// @route   GET /api/lessons/:id
// @access  Public
export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('language', 'name code nativeName');

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    logger.error(`Error in getLessonById: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a lesson
// @route   POST /api/lessons
// @access  Private/Admin
export const createLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      language,
      level,
      type,
      content,
      aiPrompt,
      duration,
      order,
      resources,
      exercises,
      isPublished,
    } = req.body;

    const lesson = await Lesson.create({
      title,
      description,
      language,
      level,
      type,
      content,
      aiPrompt,
      duration,
      order,
      resources,
      exercises,
      isPublished,
    });

    res.status(201).json(lesson);
  } catch (error) {
    logger.error(`Error in createLesson: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private/Admin
export const updateLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    lesson.title = req.body.title || lesson.title;
    lesson.description = req.body.description || lesson.description;
    lesson.language = req.body.language || lesson.language;
    lesson.level = req.body.level || lesson.level;
    lesson.type = req.body.type || lesson.type;
    lesson.content = req.body.content || lesson.content;
    lesson.aiPrompt = req.body.aiPrompt || lesson.aiPrompt;
    lesson.duration = req.body.duration || lesson.duration;
    lesson.order = req.body.order || lesson.order;
    lesson.resources = req.body.resources || lesson.resources;
    lesson.exercises = req.body.exercises || lesson.exercises;
    lesson.isPublished = req.body.isPublished !== undefined 
      ? req.body.isPublished 
      : lesson.isPublished;

    const updatedLesson = await lesson.save();
    res.json(updatedLesson);
  } catch (error) {
    logger.error(`Error in updateLesson: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Admin
export const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Remove lesson from any learning paths that include it
    const learningPaths = await LearningPath.find({
      'weeks.lessons': lesson._id,
    });

    for (const path of learningPaths) {
      for (const week of path.weeks) {
        week.lessons = week.lessons.filter(
          (lessonId) => lessonId.toString() !== lesson._id.toString()
        );
      }
      await path.save();
    }

    await lesson.deleteOne();
    res.json({ message: 'Lesson removed' });
  } catch (error) {
    logger.error(`Error in deleteLesson: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};