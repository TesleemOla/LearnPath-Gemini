import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learningPath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath',
      required: true,
    },
    currentWeek: {
      type: Number,
      default: 1,
    },
    lessonsCompleted: [
      {
        lesson: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        score: {
          type: Number,
          min: 0,
          max: 100,
        },
        timeSpent: {
          type: Number, // in minutes
        },
        notes: {
          type: String,
        },
      },
    ],
    weeklyAssessments: [
      {
        week: {
          type: Number,
          required: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 100,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        feedback: {
          type: String,
        },
        strengths: [
          {
            type: String,
          },
        ],
        areasToImprove: [
          {
            type: String,
          },
        ],
      },
    ],
    vocabularyMastered: [
      {
        word: {
          type: String,
          required: true,
        },
        translation: {
          type: String,
          required: true,
        },
        mastered: {
          type: Boolean,
          default: false,
        },
        lastReviewed: {
          type: Date,
        },
        nextReviewDate: {
          type: Date,
        },
        repetitionCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalTimeSpent: {
      type: Number, // in minutes
      default: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Progress = mongoose.model('Progress', ProgressSchema);

export default Progress;