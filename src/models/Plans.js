import mongoose, { models } from "mongoose"

const PlanSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    duration: { type: String, required: true },
    durationUnit: { type: String, required: true },
    services: [
      {
        name: { type: String, required: true }
      }
    ]
  });
  

module.exports= mongoose.models.Plan || mongoose.model("Plan",PlanSchema);