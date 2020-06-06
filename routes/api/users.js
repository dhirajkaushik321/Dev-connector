const express=require('express')
const router=express.Router()
const {check,validationResult}=require('express-validator')
const gravatar=require('gravatar')
const bcrypt=require('bcryptjs')
const User=require('../../models/User')
const jwt=require('jsonwebtoken')
const config=require('config')

//@route   POST api/users
//@desc    Register User
//@access  Public

router.post('/',
[
check('name','Name is required!').not().isEmpty(),
check('email','Please include a valid email!').isEmail(),
check('password','Password must contains minimum 6 character!').isLength({min:6})
],
async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password}=req.body
    //If user exists
    try{
     let user=await User.findOne({email})
     if(user){
         return res.status(400).json({errors:[{msg:"User already exists"}]})
     }
    //Get users gravatar
     const avatar=gravatar.url(email,
        {
            s:'200',
            r:'pg',
            d:'mm'
        }
        )
     user=new User({
         name,
         email,
         password,
         avatar
     })
     //Encrypt password
     const salt=await bcrypt.genSalt(10)
     user.password=await bcrypt.hash(password,salt)
     await user.save()
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