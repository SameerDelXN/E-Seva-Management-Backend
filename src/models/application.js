// // models/Application.js
 import mongoose from 'mongoose';

// // Define status options for each service type
// const serviceStatusMap = {
//   'Aadhar Card Updates (Address)': ['Initiated', 'In Progress', 'Completed', 'Rejected'],
//   'PAN Card Application': ['Initiated', 'In Progress', 'Completed', 'Rejected', 'HSM Authentication'],
//   'Police Verification': ['Initiated', 'In Progress', 'Completed', 'Rejected'],
//   'Domicile Certificate': ['Initiated', 'In Progress', 'Completed', 'Rejected'],
//   'Rashan Card Application': ['Initiated', 'In Progress', 'Completed', 'Rejected', 'HSM Authentication'],
//   'Income Certificate': ['Initiated', 'In Progress', 'Completed', 'Rejected'],
//   'Ayushman Bharat Card': ['Initiated', 'In Progress', 'Completed', 'Rejected'],
//   'Passport Application': ['Initiated', 'In Progress', 'Completed', 'Rejected', 'In Pursuit'],
//   'Aadhar Card Application': ['Initiated', 'In Progress', 'Completed', 'Rejected', 'In Pursuit']
// };

// const applicationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   provider: { type: String, required: true },
//   date: { type: Date, },
//   delivery: { type: String},
//   status: { type: String,},
//   service: {  type: String, },
//   staff: { type: String, required: true },
//   amount: { type: Number, required: true },
//   document: [{ type: String, default: null }],
//   receipt: { type: String, default: null }
// }, { timestamps: true });


// const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
// export default Application;
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  date: { type: Date },
  delivery: { type: String },
  // Keep original status field for backward compatibility
  status: { type: String, default: "Initiated" },
  
  // Updated service field to properly reference NewService
  service: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "NewService" },
    name: { type: String },
    // Array of possible statuses for this service
    status: [{
      name: { type: String, default: "created" },
      hexcode: { type: String, default: "#34fc23" },
      askreason: { type: Boolean, default: false }
    }]
  },
  
  // Add new field to track current status with more details
  currentStatus: {
    name: { type: String, default: "Initiated" },
    hexcode: { type: String, default: "#A78BFA" }, // Purple for Initiated
    askreason: { type: Boolean, default: false },
    reason: { type: String, default: "" }, // For storing rejection reasons
    updatedAt: { type: Date, default: Date.now }
  },
  
  // Track status history
  statusHistory: [{
    name: { type: String },
    hexcode: { type: String },
    reason: { type: String },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: String } // Track who changed the status
  }],
  
  staff: { type: String, required: true },
  amount: { type: Number, required: true },
  document: [{ type: String, default: null }],
  receipt: [{ type: String, default: null }]
}, { timestamps: true });

delete mongoose.models.Application;
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;