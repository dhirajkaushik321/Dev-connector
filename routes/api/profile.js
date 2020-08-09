const express=require('express')
const router=express.Router()
const auth=require('../../middleware/auth')
const Profile=require('../../models/Profile')
const User=require('../../models/User')
const axios=require('axios')
const config=require('config')
const {check,validationResult}=require('express-validator')
//@route   GET api/profile/me
//@desc    GET current user profile
//@access  Private

router.get('/me',auth,async (req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
        if(!profile){
            return res.status(400).json({msg:"There is no profile for this user"})
        }
        res.json(profile)
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

//@route   POST api/profile/me
//@desc    create user profile
//@access  Private

router.post('/me',[
    auth,
    [
        check('status','Status is required')
        .not()
        .isEmpty(),
        check('skills','Skills is required')
        .not().isEmpty()
    ]
],
    async (req,res)=>{
        const err=validationResult(req)
        if(!err.isEmpty()){
            return res.status(400).json({errors:err.array()})
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        }=req.body

        // Build profile object
        const profileFields={}
        profileFields.user=req.user.id
            if(company) profileFields.company=company
            if(website) profileFields.website=website
            if(location) profileFields.location=location
            if(bio) profileFields.bio=bio
            if(status) profileFields.status=status
            if(githubusername) profileFields.githubusername=githubusername
            if(skills){
                profileFields.skills=skills.split(',').map(skill=>skill.trim())
            }

            // Build social Object
             profileFields.social={}
            if(youtube) profileFields.social.youtube=youtube
            if(facebook) profileFields.social.facebook=facebook
            if(twitter) profileFields.social.twitter=twitter
            if(linkedin) profileFields.social.linkedin=linkedin
            if(instagram) profileFields.social.instagram=instagram

            try{
                let profile=await Profile.findOne({user:req.user.id})
                if(profile){
                    //update
                 profile=await Profile.findOneAndUpdate(
                        {user:req.user.id},
                        {$set:profileFields},
                        {new:true}
                    )
                    res.json(profile);
                }
                profile=new Profile(profileFields)
                await profile.save()
                res.json(profile)
            }catch(error){
                console.error(error.message)
                res.status(500).send('server error')
            }
    })

//@route   GET api/profile
//@desc    GET all user profile
//@access  Public

router.get('/',async (req,res)=>{
    try {
        const profiles=await Profile.find().populate('user',['name','avatar'])
        res.json(profiles)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error')
    }
    
})

//@route   GET api/profile/user/:user_id
//@desc    GET  user profile with id
//@access  Public

router.get('/user/:user_id',async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
        if(!profile){
            return res.json({msg:'Profile not found'})
        }
        res.json(profile)
    } catch (error) {
        if(error.kind=='ObjectId'){
            return res.json({msg:'Profile not found'})
        }
        console.error(error.message)
        res.status(500).send('Server error')
    }
    
})

//@route   DELETE api/profile
//@desc    DELETE current user profile and posts
//@access  Private

router.delete('/',auth,async (req,res)=>{
  
    const _id=req.user.id
    try{
        //@todo-delete posts
        // delete profile
        await Profile.findOneAndRemove({user:_id})
        // delete user
        await User.findOneAndRemove({_id})
        res.send('User deleted')
      
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server error')
    }
})

//@route   PUT api/profile/experience
//@desc    Add profile experience
//@access  Private
router.put('/experience',
[auth,
    [
        check('title','Title is required').not().isEmpty(),
        check('company','Company is required').not().isEmpty(),
        check('from','From date is required').not().isEmpty()
    ]
],
async (req,res)=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    const newExp=req.body
    try{
        console.log
        const profile=await Profile.findOne({user:req.user.id})
        profile.experience.unshift(newExp)
        await profile.save()
        res.send(profile)
    }catch(error){
        console.log(error.message)
        res.status(500).send('Server error')
    }
})

//@route   DELETE api/profile/experience
//@desc    Delete profile experience
//@access  Private

router.delete('/experience/:exp_id',
auth,
async (req,res)=>{
    const _id=req.params.exp_id
    try{
        const profile=await Profile.findOne({user:req.user.id})
        const index=profile.experience.findIndex((exp)=>exp._id===_id)
        profile.experience.splice(index,1)
        await profile.save()
        res.json(profile)
    }catch(error){
        console.error(error)
        res.status(500).send('server error')
    }
})

//@route   PUT api/profile/education
//@desc    Add profile education
//@access  Private
router.put('/education',
[auth,
    [
        check('school','School is required').not().isEmpty(),
        check('degree','Company is required').not().isEmpty(),
        check('fieldofstudy','fieldofstudy is required').not().isEmpty(),
        check('from','From date is required').not().isEmpty()
    ]
],
async (req,res)=>{
    const error=validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }
    const newEdu=req.body
    try{
        const profile=await Profile.findOne({user:req.user.id})
        profile.education.unshift(newEdu)
        await profile.save()
        res.send(profile)
    }catch(error){
        console.log(error.message)
        res.status(500).send('Server error')
    }
})

//@route   DELETE api/profile/education
//@desc    Delete profile education
//@access  Private

router.delete('/education/:edu_id',
auth,
async (req,res)=>{
    const _id=req.params.edu_id
    try{
        console.log(_id)
        const profile=await Profile.findOne({user:req.user.id})
        const index=profile.education.findIndex((edu)=>edu._id==_id)
        console.log(index)
        profile.education.splice(index,1)
        await profile.save()
        res.json(profile)
    }catch(error){
        console.error(error)
        res.status(500).send('server error')
    }
})

//@route   GET api/profile/github/:username
//@desc    GET user's repo from Github   
//@access  Public

router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      console.log(uri)
      const headers = {
        'user-agent': 'node.js',
        Authorization: `token ${config.get('githubToken')}`
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });
module.exports=router