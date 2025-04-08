import mongoose from 'mongoose';

const appointmentSchema = {
  
  serviceName: {
    type: String,
    required: true
  },
  serviceGroup: {
    type: String,
    required: true,
   
  },
  price: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: "1 hr"
  },

  // Date and Time
  appointmentDate: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
 

  // Basic Details
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
   
  },
  phone: {
    type: String,
    required: true,
   
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },

  // Status and Tracking
  status: {
    type: String,
 
    default: 'Pending'
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
}

const AppointmentSchema = new mongoose.Schema(appointmentSchema);

// Fix default export issue
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
export { Appointment };  // 👈 Export as named export