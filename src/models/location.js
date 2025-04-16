// location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  district: {
    type: String,
    required: true,
    
  },
  state: {
    type: String,
    required: true,
  
  },
}, {
  timestamps: true,
});

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;
