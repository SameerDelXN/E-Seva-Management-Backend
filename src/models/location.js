// location.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  subdistrict: {
    type: String,
    required: true,
    
  },
  district: {
    type: String,
    required: true,
  
  },
}, {
  timestamps: true,
});

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;
