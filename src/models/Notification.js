// File: models/Notification.js
import mongoose from 'mongoose';
//sample
const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  message: {
    type: String,
  },
  recipientId: {
    type: String,
    // Not required if sending to a role
  },
  recipientRole: {
    type: String,
    // Not required if sending to specific user
  },
  read: {
    type: Boolean,
    default: false,
  },
  playSound: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
delete mongoose.models.Notification
export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);