import { validationResult } from 'express-validator';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import LearningPath from '../models/LearningPath.js';
import { logger } from '../utils/logger.js';

// @desc    Get user's progress for all learning paths
// @route   GET /api/progress
// @access  Private
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('learningPath', 'title level')
      .populate({
        path: 'lessonsCompleted.lesson',
        select: 'title type',
      });

    res.json(progress);
  } catch (error) {
    logger.error(`Error in getUserProgress: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user's progress for a specific learning path
// @route   GET /api/progress/:learningPathId
// @access  Private
export const getProgressByLearningPath = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      learningPath: req.params.learningPathId,
    })
      .populate('learningPath', 'title level weeks')
      .populate({
        path: 'lessonsCompleted.lesson',
        select: 'title type duration',
      });

    if (!progress) {
      return res.status(404).json({
        message: 'No progress found for this learning path',
      });
    }

    res.json(progress);
  } catch (error) {
    logger.error(`Error in getProgressByLearningPath: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Start a new learning path
// @route   POST /api/progress/start/:learningPathId
// @access  Private
export const startLearningPath = async (req, res) => {
  try {
    // Check if learning path exists
    const learningPath = await LearningPath.findById(req.params.learningPathId);
    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    // Check if user already has progress for this learning path
    const existingProgress = await Progress.findOne({
      user: req.user.id,
      learningPath: req.params.learningPathId,
    });

    if (existingProgress) {
      return res.status(400).json({
        message: 'You have already started this learning path',
      });
    }

    // Add language to user's learning languages if not already added
    const user = await User.findById(req.user.id);
    const alreadyLearning = user.learningLanguages.some(
      (lang) => lang.language.toString() === learningPath.language.toString()
    );

    if (!alreadyLearning) {
      user.learningLanguages.push({
        language: learningPath.language,
        level: learningPath.level,
      });
      await user.save();
    }

    // Create new progress
    const progress = await Progress.create({
      user: req.user.id,
      learningPath: req.params.learningPathId,
      currentWeek: 1,
      lessonsCompleted: [],
      weeklyAssessments: [],
      vocabularyMastered: [],
      totalTimeSpent: 0,
      streakDays: 0,
      lastActiveDate: new Date(),
    });

    res.status(201).json(progress);
  } catch (error) {
    logger.error(`Error in startLearningPath: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Complete a lesson
// @route   POST /api/progress/complete-lesson
// @access  Private
export const completeLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { learningPathId, lessonId, score, timeSpent, notes } = req.body;

    // Find the user's progress for this learning path
    let progress = await Progress.findOne({
      user: req.user.id,
      learningPath: learningPathId,
    });

    if (!progress) {
      return res.status(404).json({
        message: 'No progress found for this learning path',
      });
    }

    // Check if lesson is already completed
    const lessonCompleted = progress.lessonsCompleted.find(
      (item) => item.lesson.toString() === lessonId
    );

    if (lessonCompleted) {
      // Update existing completion record
      lessonCompleted.completedAt = new Date();
      lessonCompleted.score = score || lessonCompleted.score;
      lessonCompleted.timeSpent = timeSpent || lessonCompleted.timeSpent;
      lessonCompleted.notes = notes || lessonCompleted.notes;
    } else {
      // Add new lesson completion
      progress.lessonsCompleted.push({
        lesson: lessonId,
        completedAt: new Date(),
        score,
        timeSpent,
        notes,
      });
    }

    // Update total time spent
    if (timeSpent) {
      progress.totalTimeSpent += timeSpent;
    }

    // Update last active date and streak
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = new Date(progress.lastActiveDate).setHours(0, 0, 0, 0);
    
    if (today > lastActive) {
      // If it's a new day
      const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive day, increase streak
        progress.streakDays += 1;
      } else if (dayDiff > 1) {
        // Streak broken, reset to 1
        progress.streakDays = 1;
      }
      
      progress.lastActiveDate = new Date();
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    logger.error(`Error in completeLesson: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Submit weekly assessment
// @route   POST /api/progress/weekly-assessment
// @access  Private
export const submitWeeklyAssessment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      learningPathId,
      week,
      score,
      feedback,
      strengths,
      areasToImprove,
    } = req.body;

    // Find the user's progress for this learning path
    let progress = await Progress.findOne({
      user: req.user.id,
      learningPath: learningPathId,
    });

    if (!progress) {
      return res.status(404).json({
        message: 'No progress found for this learning path',
      });
    }

    // Check if assessment for this week already exists
    const existingAssessment = progress.weeklyAssessments.find(
      (assessment) => assessment.week === week
    );

    if (existingAssessment) {
      // Update existing assessment
      existingAssessment.score = score;
      existingAssessment.completedAt = new Date();
      existingAssessment.feedback = feedback || existingAssessment.feedback;
      existingAssessment.strengths = strengths || existingAssessment.strengths;
      existingAssessment.areasToImprove = areasToImprove || existingAssessment.areasToImprove;
    } else {
      // Add new assessment
      progress.weeklyAssessments.push({
        week,
        score,
        completedAt: new Date(),
        feedback,
        strengths,
        areasToImprove,
      });
    }

    // If current week is completed, move to next week
    if (progress.currentWeek === week) {
      const learningPath = await LearningPath.findById(learningPathId);
      if (week < learningPath.duration) {
        progress.currentWeek = week + 1;
      } else {
        // Learning path completed
        progress.isCompleted = true;
        progress.completedAt = new Date();
      }
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    logger.error(`Error in submitWeeklyAssessment: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add vocabulary word to user's mastered list
// @route   POST /api/progress/vocabulary
// @access  Private
export const addVocabularyWord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { learningPathId, word, translation, mastered } = req.body;

    // Find the user's progress for this learning path
    let progress = await Progress.findOne({
      user: req.user.id,
      learningPath: learningPathId,
    });

    if (!progress) {
      return res.status(404).json({
        message: 'No progress found for this learning path',
      });
    }

    // Check if word already exists
    const existingWord = progress.vocabularyMastered.find(
      (item) => item.word === word
    );

    if (existingWord) {
      // Update existing word
      existingWord.translation = translation || existingWord.translation;
      existingWord.mastered = mastered !== undefined ? mastered : existingWord.mastered;
      existingWord.lastReviewed = new Date();
      existingWord.repetitionCount += 1;
      
      // Calculate next review date using spaced repetition
      const daysToAdd = Math.pow(2, existingWord.repetitionCount);
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + daysToAdd);
      existingWord.nextReviewDate = nextReview;
    } else {
      // Add new word
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + 1); // First review after 1 day
      
      progress.vocabularyMastered.push({
        word,
        translation,
        mastered: mastered || false,
        lastReviewed: new Date(),
        nextReviewDate: nextReview,
        repetitionCount: 0,
      });
    }

    await progress.save();
    res.json(progress.vocabularyMastered);
  } catch (error) {
    logger.error(`Error in addVocabularyWord: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
};