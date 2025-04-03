import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    documentNames: [{ type: String, required: true }]
});

const ServiceGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    services: [ServiceSchema]  // Embedded array of services
}, { timestamps: true });

export default mongoose.models.ServiceGroup || mongoose.model("ServiceGroup", ServiceGroupSchema);
