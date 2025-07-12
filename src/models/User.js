import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    nativeLanguage: {
      type: String,
      required: [true, 'Please provide your native language'],
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    lastStreak: {
      type: Date,
      default: Date.now()
    },
    learningLanguages: [
      {
        language: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Language',
        },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced'],
          default: 'beginner',
        },
        startedAt: {
          type: Date,
          default: Date.now,
        }
      },
    ],
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 250,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.pre("findOne", async function(next){
  const now = new Date();
  const diffInMs = Math.abs(now - this.lastStreak); // difference in milliseconds
  const hoursDifference = diffInMs / (1000 * 60 * 60); // convert milliseconds to hours
 if(hoursDifference < 24){
  this.streakDays++
 }else{
  this.streakDays = 0
 }

})

// Match entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;