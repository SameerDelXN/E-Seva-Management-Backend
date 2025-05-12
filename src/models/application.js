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





// const RemarkSchema = new mongoose.Schema({
//   text: { type: String, required: true },
//   addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // assuming a User model exists
//   addedAt: { type: Date, default: Date.now }
// });
// const applicationSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone:{type:Number},
//   provider: { type: String, required: true },
//   date: { type: Date },
//   delivery: { type: String },
//   // Keep original status field for backward compatibility
//   status:  [
//     {
//       name: { type: String },
//       hexcode: { type: String },
//       askreason: { type: Boolean }
//     }
//   ],
  
//   // Updated service field to properly reference NewService
//   service: {
//     id: { type: mongoose.Schema.Types.ObjectId, ref: "NewService" },
//     name: { type: String },
//     // Array of possible statuses for this service
//     status: [{
//       name: { type: String, default: "created" },
//       hexcode: { type: String, default: "#34fc23" },
//       askreason: { type: Boolean, default: false }
//     }]
//   },
  
//   // Add new field to track current status with more details
//   initialStatus: [
//     {
//       name: { type: String },
//       hexcode: { type: String },
//       askreason: { type: Boolean }
//     }
//   ],
  
//   // Track status history
 
//    remark: { type: String ,default:""}, // current or latest remark
//   remarkHistory: [RemarkSchema] ,// history of all remarks with metadata,
//   staff: { type: String },
//   amount: { type: Number, required: true },
//   document: [{ type: String, default: null }],
//   receipt: [{ type: String, default: null }]
// }, { timestamps: true });

// delete mongoose.models.Application;
// const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

// export default Application;



const RemarkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now }
});

const DocumentSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  view: { type: String, default: "" },
  remark:{type:String,default:""}
});

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number },
  provider: [{
    id:{type:String},
    name:{type:String}
  }],
  date: { type: Date },
  delivery: { type: String },
  location:{type:String},
  status: [
    {
      name: { type: String },
      hexcode: { type: String },
      askreason: { type: Boolean }
    }
  ],

  service: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "NewService" },
    name: { type: String },
    status: [{
      name: { type: String, default: "created" },
      hexcode: { type: String, default: "#34fc23" },
      askreason: { type: Boolean, default: false }
    }]
  },

  initialStatus: [
    {
      name: { type: String },
      hexcode: { type: String },
      askreason: { type: Boolean },
      reason:{type:String}
    }
  ],

  remark: { type: String, default: "" },
  remarkHistory: [RemarkSchema],

  staff: [
    {
      name:{type:String},
      id:{type:String}
    }
  ],
  amount: { type: Number, required: true },

  document: [DocumentSchema],
  receipt: [{ type: String, default: "" }],
  additional:[
    {
      inputType:{type:String},
      label:{type:String},
      value:{type:String}
    }
  ]
}, { timestamps: true });

delete mongoose.models.Application;
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;  

//  name remark url for document 

