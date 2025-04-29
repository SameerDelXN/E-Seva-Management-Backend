const mongoose = require("mongoose");
const newServicesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document: [{ type: String, required: true }],
  visibility: { type: String, required: true, default: "both" },
  availablity: { type: String, required: true, default: "subscription" },
  price: { type: Number, required: true, default: 0 },
  
  // Add reference to service group
  serviceGroup: { 
    id: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceGroup" },
    name: { type: String }
  },
  
  // Prices for each plan in each location
  planPrices: [
    {
      location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
      plans: [
        {
          plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
          price: { type: Number, default: 0 }
        }
      ]
    }
  ],
  
  status: [
    {
      name: { type: String },
      hexcode: { type: String },
      askreason: { type: Boolean }
    }
  ]
});
delete mongoose.models.NewService
module.exports = mongoose.models.NewService || mongoose.model("NewService", newServicesSchema);