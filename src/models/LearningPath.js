import mongoose from 'mongoose';

const LearningPathSchema = new mongoose.Schema(
  {
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Language',
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title for the learning path'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    duration: {
      type: Number,
      default: 8, // 8 weeks by default
    },
    coverImage: {
      type: String,
    },
    objectives: [
      {
        type: String,
      },
    ],
    prerequisites: [
      {
        type: String,
      },
    ],
    weeks: [
      {
        weekNumber: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        lessons: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',
          },
        ],
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const LearningPath = mongoose.model('LearningPath', LearningPathSchema);

export default LearningPath;