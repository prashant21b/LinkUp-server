
import User from "../models/user"
import jwt from 'jsonwebtoken'
import { nanoid } from "nanoid";
import { comparePassword, hashPassword } from "../utils/auth";
export const register = async (req, res) => {
    try {
        // console.log(req.body)
        const { name, email, password, secret } = req.body;
        if (!name) return res.status(400).send('Name is required')

        if (!password || password.length < 6) return res.status(400).send("Password is required of min length 6")
        if (!secret) return res.status(400).send('Answer is required')
        const isUserExist = await User.findOne({ email })
        if (isUserExist) {
            return res.status(400).send("Email already exist")
        }
        const hashedPassword = await hashPassword(password)
        const user = new User({
            name,
            email,
            password: hashedPassword,
            secret,
            username: nanoid(6),
            
        })
        await user.save();
        console.log(user);
        return res.json({ ok: true })

    }

    catch (error) {
        console.log("Registration failed", error)
        return res.status(400).send("Error, try again")
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body)
       const user=await User.findOne({email})
       if(!user){
        return res.status(400).send("User does not exist")
       }
       const match=await comparePassword(password,user.password)
       if(!match){
        return res.status(400).send("Incorrect Password")
       }
       const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
       user.password=undefined;
       user.secret=undefined;
       res.json({
        token,
        user
       })
    }
    catch (error) {
        console.log("Error in Login", error)
        return res.status(400).send("Error !Try again")
    }
}

export const currentUser=async(req,res)=>{
   // console.log(req.auth)
   try{
    const user=await User.findById(req.auth._id)
    res.json({ok:true})

   }
   catch(error){
    console.log("Error while verifying token",error)
    res.sendStatus(400)
   }
}

export const forgotPassword=async(req,res)=>{
    try{
    const {email,newpassword,secret}=req.body

    if(!newpassword || newpassword.length<6){
        return res.json({
            error:"New password field is required whose minimum length is 6"
        })
    }
    if(!secret){
        return res.json({
            error:"secret is required"
        })
    }
    const user=await User.findOne({email,secret})
    if(!user){
        return res.json({
            error:"You are not a valid user"
        })
    }
    const hashedPassword=await hashPassword(newpassword)
    await User.findByIdAndUpdate(user._id,{password:hashedPassword})
  return res.json({
    success:"Now you can login with new pasword"
  })
    }
    catch(error){
  console.log("Error in password reset",error)
  return res.json({
    error:"something is wrong try again"
  })
    }
}

export const profileUpdate=async(req,res)=>{
    try{

      const data={};
      console.log(req.body.username)
      if(req.body.username){
        data.username=req.body.username
      }
      if(req.body.about){
        data.about=req.body.about
      }
      if(req.body.name){
        data.usename=req.body.name
      }
      if(req.body.password){
         if(req.body.password<6){
            return res.json({
                error:"password is required and should be min of 6 chr long"
            })
         }
         else{
            data.password=req.body.password
         }
        
      }
      if(req.body.secret){
        data.secret=req.body.secret
      }
      if(req.body.image){
        data.image=req.body.image
      }
      let user=await User.findByIdAndUpdate(req.auth._id,data,{new:true})
        user.password= undefined;
        user.secret= undefined;
        res.json(user)
    }
    catch(error){
     if(error.code==11000){
        return res.json({
            error:"User name already exist"
        })
     }
     console.log("Enter in profile update",error)
    }
}



export const findPeople=async(req,res)=>{
    try{
        const user=await User.findById(req.auth._id)
        let following=user.following
        following.push(user._id)
        
        const people=await User.find({_id:{$nin:following}}).limit(10)
        res.json(people)
        
    }
    catch(error){
       console.log(error)
       return res.json({
        error:"Error in finding user"
       })
    }
}

export const userFollow=async(req,res)=>{
    try{
        
     const user=await User.findByIdAndUpdate(req.auth._id,{
        $addToSet:{following:req.body._id}
     },{new:true}
    )
    res.json(user)
    }
    catch(error){
        console.log(error)
        return res.json({
            error:"Error in follow"
        })
    }
}

export const userFollowing=async(req,res)=>{
    try{
        const user=await User.findById(req.auth._id)
        const following=await User.find({_id:user.following})

        res.json(following)

    }
    catch(error){
        console.log(error)
    }
}

export const userunfollow=async(req,res)=>{
    try{
          const user=await User.findByIdAndUpdate(req.auth._id,{
            $pull:{following:req.body._id}
          },
          {new:true}
        )
        res.json(user)
    }
    catch(error){
        console.log(error)
    }
}

export const getFollower=async(req,res)=>{
    try{
        const user=await User.findById(req.auth._id)
        console.log(user)
        const follower=await User.find({_id:user.followers})
        console.log("216",follower)
        res.json(follower)

    }
    catch(error){
        console.log(error)

    }
}

export const getReceiver=async(req,res)=>{
    try{
        const _id=req.params._id
        const user=await User.findById(_id)
        return res.json(user)

    }
    catch(error){
        console.log(error)
        res.json({
            error:"Error in getting reciver"
        })
    }
}