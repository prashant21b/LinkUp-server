
import Post from "../models/post"
import cloudinary from 'cloudinary'
import Story from "../models/story";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_secret,
  });
  
export const createPost=async(req,res)=>{
    console.log(req.body)
    try{
        const {content,image}=req.body;
        if(!content.length){
            return res.json({
                error:'Content is required'
            })
        }
       const post=new Post({content,image,postedBY:req.auth._id});
       post.save()
       return res.json(post)
    }
    catch(error){
     console.log("Error in post creation",error)
     return res.send(400)
    }
}

export const uploadImage=async(req,res)=>{
    try{
      // console.log(req.files.images.path)
       const result=await cloudinary.uploader.upload(req.files.images.path)
       console.log("result->",result)
       res.json({
        url:result.secure_url,
        public_id:result.public_id
       })
    }
    catch(error){

    }
}
export const userPost=async(req,res)=>{
    try{
        console.log(req.auth._id)
        // const posts=await Post.find({postedBY:req.auth._id}).populate('postedBY','_id name image').sort({createdAt:-1})
        // .limit(10)
        // console.log(posts)
        // res.json(posts)
        const posts=await Post.find().
        populate('postedBY','_id name username image').
        populate('comments.postedBY','_id name username image')
        .sort({createdAt:-1})
        .limit(10)
        console.log(posts)
        res.json(posts)
    }
    catch(error){
        console.log("Error in fetching user post->",error)
        return res.status(400).send("Error in fetching user post")
    }
}
    
export const userPostById=async(req,res)=>{
    try{
       
        const post=await Post.findById(req.params._id).populate('postedBY','_id name username').
         populate('comments.postedBY','_id name username image')
        console.log("post69->",post)
      // console.log()
        return res.json(post)
    }
    catch(error){
        console.log("Error in fetching post data")
        return res.json({
            error:"Error in fetching post"
        })
    }
}
export const updatePost=async(req,res)=>{
    try{
      //  console.log(req.params._id)
        const post =await Post.findByIdAndUpdate(req.params._id,req.body,{
            new:true,
        })
       // console.log(post)
        res.json(post)

    }
    catch(error){
        console.log("Error in post updation",error)
       return res.json({
            error:"Some thing went wrong try again !"
        })

    }
}

export const deletePost=async(req,res)=>{
    try{
        //console.log(req.params._id)
        const post=await Post.findByIdAndDelete(req.params._id)
        if(post.image && post.image.public_id){
            const response=await cloudinary.uploader.destroy(post.image.public_id)
        }
        res.json({
           ok:true
        })
    }
    catch(error){
     console.log("Error in post deletion",error)
     return res.json({
        error:"Error in post deletion"
     })
    }
}

export const likePost=async(req,res)=>{
    try{
        const post=await Post.findByIdAndUpdate(req.body._id,{$addToSet:{likes:req.auth._id}})
        console.log(post)
        res.json(post)
      
    }
    catch(error){
        console.log(error)
    }
}

export const DisLikePost=async(req,res)=>{
    try{
        const post=await Post.findByIdAndUpdate(req.body._id,{$pull:{likes:req.auth._id}})
        console.log(post)
        res.json(post)
    }
    catch(error){
        console.log(error)
    }
}
export const addComment=async(req,res)=>{
    try{
        const{_id,text}=req.body
       // console.log(_id,text)
       const post=await Post.findByIdAndUpdate(_id,{$push:{comments:{text:text,postedBY:req.auth._id}}}).
       populate('postedBY','_id name username image').
       populate('comments.postedBY','_id name username image')
       res.json({ok:true})
    }
    catch(error){
        console.log(error)
    }
}

export const addStory=async(req,res)=>{
    try{
        const {image}=req.body
        const newStory=new Story({
            image:image,
            createdBy:req.auth._id

        })
        newStory.save()
        return res.json(newStory)
    }
    catch(error){
   return res.json({
    error:"Something went wrong in adding story"
   })
    }
}

export const getAllStories=async(req,res)=>{
    try{
        const stories=await Story.find().populate('createdBy','_id name username image').
        populate('seenBy','_id name username image')
        return res.json(stories)
    }
    catch(error){
        return res.json({
            error:"Something went wrong in fetching story"
           })
    }
}