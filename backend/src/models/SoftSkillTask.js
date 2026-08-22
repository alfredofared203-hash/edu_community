const mongoose = require('mongoose');

const softSkillTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },

    description: {
      type: String,
      default: '',
    },

    grade: {
      type: String,
      required: [true, 'grade is required'],
    },

    subject: {
      type: String,
      required: [true, 'the subject is required'],
    },

    type: {
      type: String,
      enum: ['pdf', 'video', 'graphic'],
      required: [true, 'the type is required'],
    },

    fileUrl: {
      type: String,
      default: '',
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    deadline: {
      type: Date,
    },

    isNextGrade: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SoftSkillTask ||
  mongoose.model('SoftSkillTask', softSkillTaskSchema);