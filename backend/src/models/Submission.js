const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'معرف الطالب مطلوب'],
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SoftSkillTask',
      required: [true, 'معرف المهمة مطلوب'],
    },

    fileUrl: {
      type: String,
      required: [true, 'ملف التسليم مطلوب'],
    },

    grade: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Submission ||
  mongoose.model('Submission', submissionSchema);