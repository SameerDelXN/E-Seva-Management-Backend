import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    serviceId:{type:String},
    name: { type: String, unique: true },
    documentNames: [{ type: String }],
    planPrices: [{ 
        planName: { type: String },
        price: { type: Number, default: 0 } 
    }]
});

const ServiceGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    services: [ServiceSchema]  // Embedded array of services with planPrices
}, { timestamps: true });

delete mongoose.models.ServiceGroup;
export default mongoose.models.ServiceGroup || mongoose.model("ServiceGroup", ServiceGroupSchema);