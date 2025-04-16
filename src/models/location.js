// location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;
