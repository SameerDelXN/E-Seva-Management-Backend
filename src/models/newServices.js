const mongoose = require("mongoose");

const newServicesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  document: [{ type: String, required: true }],
  visibility: { type: String, required: true, default: "both" },
  availablity: { type: String, required: true, default: "subscription" },
  price: { type: Number, required: true, default: 0 },

  // Prices for each plan in each location
  planPrices: [
    {
      location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
      plans: [
        {
          plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" }, // Fixed here
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
module.exports = mongoose.models.NewService || mongoose.model("NewService", newServicesSchema);

