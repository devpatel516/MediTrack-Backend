const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

const registerUser=async(req,res)=>{
    try{
        const {email,password,role,name}=req.body;

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({error:'Email already exists'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('heareag;vdfg');
        const user = new User({ email,password:hashedPassword,role,name });
        await user.save();
        console.log("clicked");
        res.status(201).json({ message: 'User registered successfully' });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

const loginUser=async(req,res)=>{
    try {const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({error:'Invalid email or password'});
    }

    const validPassword=await bcrypt.compare(password,user.password);
    if(!validPassword){
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token=jwt.sign(
        {id:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    )
    res.json({ token, role: user.role, userId: user._id, name: user.name });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}
module.exports={registerUser,loginUser};
