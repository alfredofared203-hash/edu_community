const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:      { type: String, required: true },          
    content:   { type: String, required: true },       
    relatedId: { type: mongoose.Schema.Types.ObjectId, default: null }, 
    isRead:    { type: Boolean, default: false },
  },
  { timestamps: true }
);


notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
