import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    serviceId:{type:String},
    name: { type: String, },
    documentNames: [{ type: String }],
    price:{type:Number},
    status: [
      {
        name: { type: String },
        hexcode: { type: String },
        askreason: { type: Boolean }
      }
    ],
    planPrices: [
        {
          district: { type: String, },
          state: { type: String, },
          plans: [
            {
              plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
              planName:{type:String},
              price: { type: Number, default: 0 }
            }
          ]
        }
      ],
});

const ServiceGroupSchema = new mongoose.Schema({
    name: { type: String, required: true,},
    image: { type: String, required: true },
    services: [ServiceSchema]  // Embedded array of services with planPrices
}, { timestamps: true });

delete mongoose.models.ServiceGroup;
export default mongoose.models.ServiceGroup || mongoose.model("ServiceGroup", ServiceGroupSchema);