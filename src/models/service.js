import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  services: { type: [String], required: true },
  status: { type: Boolean, default: true }
});

// Prevents model re-compilation issue in Next.js API routes
export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
