const mongoose = require('mongoose');
<<<<<<< HEAD

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
=======
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'The name is required'], 
      trim: true 
    },
    email: {
      type: String,
      required: [true, 'The email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { 
      type: String, 
      required: [true, 'The password is required'], 
      minlength: 6, 
      select: false 
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'admin', 'supervisor'],
      default: 'student',
    },
    grade: { type: String, default: null },
    schoolCode: { type: String, default: null },
    nationalId: { type: String, default: null },
    points: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
>>>>>>> backend2
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

<<<<<<< HEAD
 userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

 userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret._id;
    delete ret.__v;
=======
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
>>>>>>> backend2
    return ret;
  },
});

<<<<<<< HEAD
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
=======
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
>>>>>>> backend2
