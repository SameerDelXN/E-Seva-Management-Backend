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
         paymentMethod:{type:String , default:"NA"},
         paidAmount:{type:String,default:"0.00"},
         lastRecharge:{type:String,default:"0.00"},
         unpaidAmount:{type:String,default:"0.00"},
         balance:{type:String,default:"0.00"},

        status: { type: String,  default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Agent || mongoose.model("Agent", AgentSchema);
