const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        address:{type:String,required:true},
        phone: { type: String, required: true, unique: true },
        shopName:{type:String,required:true},
        shopAddress:{type:String,required:true},
        location:{type:String},
        referralCode:{type:String},
        username:{type:String,required:true},
        password: { type: String, required: true }, 
        documents: { 
            aadharCard:{type:String,required:true},//url
            shopLicense:{type:String,required:true},//url
            ownerPhoto:{type:String,required:true},//url
            supportingDocument:{type:String},//url

         },
         purchasePlan:{type:String,default:"Basic"},
         dateOfPurchasePlan:{type:String,default:"15/03/2025"},
         paymentMethod:{type:String , default:"Bank Transfer"},
         paidAmount:{type:String,default:"1800"},
         lastRecharge:{type:String,default:"600"},
         unpaidAmount:{type:String,default:"0"},
         balance:{type:String,default:"600"},

        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Agent || mongoose.model("Agent", AgentSchema);
