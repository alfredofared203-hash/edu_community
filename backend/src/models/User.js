const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'teacher', 'admin', 'supervisor'],
      default: 'student',
    },
    grade: String,        
    schoolCode: String,   
    nationalId: String,   
    subject: String,
    points: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    avatarUrl: { type: String, default: '' },
    avatarPosition: { type: Number, default: 50, min: 0, max: 100 },
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      language: { type: String, enum: ['ar', 'en'], default: 'ar' },
    },
    roleSettings: {
      student: { grade: String, schoolCode: String, nationalId: String },
      teacher: { subject: String, schoolCode: String },
      admin: { schoolCode: String },
    },
  },
  { timestamps: true } 
);

 userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

 userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

 userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
