import mongoose from 'mongoose';

const FieldBoySchema= new mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:String,required:true,unique:true},
    aadharNo:{type:String,required:true,unique:true},
    pancardNo:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    location:{type:String,required:true},
    
})

module.exports=mongoose.models.FieldBoy || mongoose.model("FieldBoy",FieldBoySchema)