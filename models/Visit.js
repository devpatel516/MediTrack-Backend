const mongoose=require('mongoose');

const medicineSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    timing:{
        type:String,
        required:true
    },
    schedule:{
        type:String,
        required:true
    }
},{_id:false});

const visitSchema=new mongoose.Schema({
    doctorId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    patientId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    notes:{type:String},
    medicines:[medicineSchema],
    nextVisitDate:{type:Date}
},{timestamps:true});

module.exports=mongoose.model('Visit',visitSchema);