const express=require('express')
const {check,validationResult}=require('express-validator')
const Post=require('../../models/Post')
const auth=require('../../middleware/auth')
const User=require('../../models/User')
const Profile=require('../../models/Profile')
const { findById } = require('../../models/Post')

const router=express.Router()
//@route   POST api/posts
//@desc    Create a post
//@access  Private

router.post('/',[
    auth,
    check('text','Text is required').not().isEmpty()
],
async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const user=await User.findById(req.user.id).select('-password')
        const newPost={
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        }
        const post=new Post(newPost)
        await post.save()
        res.json(post)
    }catch(error){
        console.error(error.message)
        res.status(500).send('Server error')
    }
})
//@route   GET api/posts
//@desc    GET all  post
//@access  Private
router.get('/',auth,async (req,res)=>{
    try{
        const posts=await Post.find().sort({date:-1})
        res.json(posts)
    }catch(error){
        console.error(error.message)
        res.status(500).send('Server error')
    }

})

//@route   GET api/posts/:id
//@desc    GET a  post by id
//@access  Private
router.get('/:id',auth,async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        res.json(post)
    }catch(error){
        if(error.kind==='ObjectId'){
            return res.status(404).json({msg:"post not found"})
        }
        console.error(error.message)
        res.status(500).send('Server error')
    }

})

//@route   DELETE api/posts/:id
//@desc    Delete a  post by id
//@access  Private
router.delete('/:id',auth,async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:"user is not authorized"})
        }
        await post.remove()
        res.json({msg:"Post removed"})
    }catch(error){
        if(error.kind==='ObjectId'){
            return res.status(404).json({msg:"post not found"})
        }
        console.error(error.message)
        res.status(500).send('Server error')
    }

})

//@route   PUT api/posts/like/:id
//@desc    Like a  post 
//@access  Private
router.put('/like/:id',auth,async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        // check if the post has already been liked
        const already=post.likes.filter(like=>like.user.toString()===req.user.id)
        if(already.length>0){
            return res.status(400).json({msg:"Post alreday liked"})
        }
        post.likes.unshift({
            user:req.user.id
        })
        await post.save()
        res.json(post.likes)
    }catch(error){
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

//@route   PUT api/posts/unlike/:id
//@desc    Unlike a  post 
//@access  Private
router.put('/unlike/:id',auth,async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        // check if the post has already been liked
        const already=post.likes.filter(like=>like.user.toString()===req.user.id)
        if(already.length===0){
            return res.status(400).json({msg:"Post has not yet been liked"})
        }
        // Get remove index
        const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex,1)
        await post.save()
        res.json(post.likes)
    }catch(error){
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

//@route   POST api/posts/comment/:id
//@desc    Comment a post
//@access  Private

router.post('/comment/:id',[
    auth,
    check('text','Text is required').not().isEmpty()
],
async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const post=await Post.findById(req.params.id)
        const user=await User.findById(req.user.id).select('-password')
        const newComment={
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        }
        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)
    }catch(error){
        console.error(error.message)
        res.status(500).send('Server error')
    }
})

//@route   DELETE api/posts/comment/:id/:comment_id
//@desc    Delete a  post by id
//@access  Private
router.delete('/comment/:id/:comment_id',auth,async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)        
        // check user
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({msg:"user is not authorized"})
        }
        //pull out comment index
        const commentIndex=post.comments.map(comment=>comment._id).indexOf(req.params.comment_id)
        if(commentIndex===-1){
            return res.status(404).json({msg:"Comment does not exist"})
        }
        post.comments.splice(commentIndex,1)
        await post.save()
        res.json({msg:"Comment removed"})
    }catch(error){
        if(error.kind==='ObjectId'){
            return res.status(404).json({msg:"post not found"})
        }
        console.error(error.message)
        res.status(500).send('Server error')
    }

})

module.exports=router