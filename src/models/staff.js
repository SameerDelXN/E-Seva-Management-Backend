const mongoose =require('mongoose');


const StaffSchema = new mongoose.Schema({
    name:{type:String,required:true},
    userName:{type:String,required:true, unique: true },
    phone:{type:String,required:true},
    password:{type:String,required:true},
    location:{type:String,required:true},
    ServiceGroup:{type:String,required:true},

},
{ timestamps: true }
);

module.exports=mongoose.models.Staff || mongoose.model("Staff",StaffSchema);