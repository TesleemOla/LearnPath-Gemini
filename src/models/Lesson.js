import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the lesson'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
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
    type: {
      type: String,
      enum: [
        'vocabulary',
        'grammar',
        'reading',
        'listening',
        'speaking',
        'writing',
        'culture',
        'assessment',
      ],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    aiPrompt: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    resources: [
      {
        title: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['article', 'video', 'audio', 'exercise', 'quiz'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    exercises: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
          },
        ],
        correctAnswer: {
          type: String,
          required: true,
        },
        explanation: {
          type: String,
        },
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

const Lesson = mongoose.model('Lesson', LessonSchema);

export default Lesson;