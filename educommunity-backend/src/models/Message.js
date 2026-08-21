const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade:     { type: String },          
    content:   { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
  },
  { timestamps: true }
);


messageSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
