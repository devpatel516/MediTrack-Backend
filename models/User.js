const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['doctor','patient'],
        require:true
    },
    name:{
        type:String,
        required:true
    },
    allergies:{
        type:[String],
        default:[]
    }
},{timestamps:true});
module.exports=mongoose.model('User',userSchema);