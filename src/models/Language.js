import mongoose from 'mongoose';

const LanguageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a language name'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide a language code'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    nativeName: {
      type: String,
      required: [true, 'Please provide the native name of the language'],
    },
    flagIcon: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'very hard'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    popularityRank: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Language = mongoose.model('Language', LanguageSchema);

export default Language;