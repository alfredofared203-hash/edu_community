const mongoose = require('mongoose');

<<<<<<< HEAD
const softSkillSubmissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoftSkillTask',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  presentationUrl: {
    type: String,
    required: true  
  },
  grade: {
    type: Number,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Submitted', 'Graded'],
    default: 'Submitted'
  }
}, { timestamps: true });

module.exports = mongoose.model('SoftSkillSubmission', softSkillSubmissionSchema);
=======
const submissionSchema = new mongoose.Schema(
  {
    skill:       { type: mongoose.Schema.Types.ObjectId, ref: 'SoftSkill', required: true },
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl:     { type: String, required: true },
    grade:       { type: Number, default: null },
    feedback:    { type: String, default: '' },
    gradedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

submissionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => { ret.id = ret._id; delete ret._id; return ret; },
});

module.exports = mongoose.models.SoftSkillSubmission ||
  mongoose.model('SoftSkillSubmission', submissionSchema);
>>>>>>> backend2
