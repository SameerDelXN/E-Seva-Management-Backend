const mongoose =require('mongoose');


const StaffSchema = new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true, unique: true },
    contactNo:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    location:{type:String,required:true},
    serviceGroups: [
        {
          serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'NewService' // Reference to the service collection
          },
          serviceName: { type: String, required: true }
        }
      ]

},
{ timestamps: true }
)
delete mongoose.models.Staff;
module.exports=mongoose.models.Staff || mongoose.model("Staff",StaffSchema);