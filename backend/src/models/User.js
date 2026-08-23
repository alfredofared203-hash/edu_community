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
    points: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
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
