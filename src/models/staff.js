const mongoose =require('mongoose');


const StaffSchema = new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true, unique: true },
    contactNo:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    location:{type:String,required:true},
    ServiceGroup:{type:String,required:true},

},
{ timestamps: true }
)
module.exports=mongoose.models.Staff || mongoose.model("Staff",StaffSchema);