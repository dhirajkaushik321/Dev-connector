const express=require('express')
const auth=require('../../middleware/auth')
const router=express.Router()
const User=require('../../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const config=require('config')
const {check,validationResult}=require('express-validator')

//@route   GET api/auth
//@desc    Test route
//@access  Public

router.get('/',auth,async (req,res)=>{
    const {id}=req.user
    try{
        const user=await User.findById(id).select('-password')
        res.json(user)
    }catch(err){
        console.log(err.msg)
        res.status(500).send("Server error")
    }
    
})

//@route   POST api/auth
//@desc    Authenticate user and get token
//@access  Public

router.post('/',
[
check('email','Please include a valid email!').isEmail(),
check('password','Password is required!').exists()
],
async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {email,password}=req.body
    //If user exists
    try{
     let user=await User.findOne({email})
     if(!user){
         return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
     }
     const isMatch=await bcrypt.compare(password,user.password)
     if(!isMatch){
        return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
     }
     const payload={
         user:{
             id:user.id
         }
     }
     jwt.sign(payload,
        config.get('jwtSecret'),
        {expiresIn:360000},
        (err,token)=>{
            if(err) throw err
            res.send({token})

        }
        )
    }
    catch(err){
        console.error(err.msg)
        res.status(500).send("Server error")
    }
}
)
module.exports=router