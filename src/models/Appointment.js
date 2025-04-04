import mongoose from 'mongoose';

const appointmentSchema = {
  // Service Details
  serviceName: {
    type: String,
    required: true
  },
  serviceGroup: {
    type: String,
    required: true,
    enum: ['E-Seva Kendra', 'RTO Services', 'CA Services', 'Legal Services', 'Banking Services', 'Online Form Filling', 'Quick Services']
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: "1 hr"
  },

  // Date and Time
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  slotType: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening'],
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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
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
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
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