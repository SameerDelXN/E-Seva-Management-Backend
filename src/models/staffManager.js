import mongoose from "mongoose";

const StaffManagerSchema= new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true}
});

module.exports=mongoose.models.StaffManager || mongoose.model("StaffManager",StaffManagerSchema)