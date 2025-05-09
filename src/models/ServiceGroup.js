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