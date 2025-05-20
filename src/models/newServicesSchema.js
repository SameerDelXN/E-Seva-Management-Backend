const mongoose = require("mongoose");
const newServicesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document: [{ type: String, required: true }],
  visibility: { type: String, required: true, default: "both" },
  availablity: { type: String,  },
  price: {
    commissionFee : {type:Number},
    governmentFee : {type:Number},
    TotalFee : {type:Number}
   },
  
  // Add reference to service group
  serviceGroup: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceGroup" },
    name: { type: String }
  },
  ExpectedDays:{type:Number},
  // Prices for each plan in each location
  planPrices: [
    {
      subdistrict: { type: String },
      district: { type: String },
      plans: [
        {
          plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
          planName: { type: String },
          price: {
    commissionFee : {type:Number,default:0},
    governmentFee : {type:Number,default:0},
    TotalFee : {type:Number,default:0},
   },
        }
      ]
    }
  ],
  
  status: [
    {
      name: { type: String },
      hexcode: { type: String },
      askreason: { type: Boolean },
      priority: { type: Number, default: 0 }
    }
  ],
  
  // Form data configuration
  formData: [
    {
      inputType: { 
        type: String, 
        enum: ["text", "number", "textarea", "select", "checkbox", "radio", "date", "email", "password", "file"]
      },
      label: { 
        type: String, 
      },
      name: {
        type: String,
      },
      placeholder: { 
        type: String,
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      defaultValue: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      price:{
        type:Number,
        default:0
      },
      // Options for select, radio, or checkbox inputs
      options: [
        {
          label: { type: String },
          value: { type: mongoose.Schema.Types.Mixed }
        }
      ],
      // Validation rules
      validation: {
        minLength: { type: Number },
        maxLength: { type: Number },
        min: { type: Number }, // For number inputs
        max: { type: Number }, // For number inputs
        pattern: { type: String } // Regex pattern
      },
      // Additional metadata
      metadata: {
        description: { type: String },
        helpText: { type: String }
      }
    }
  ]
});

delete mongoose.models.NewService;
module.exports = mongoose.models.NewService || mongoose.model("NewService", newServicesSchema);