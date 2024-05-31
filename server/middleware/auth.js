import { expressjwt } from "express-jwt";
import User from '../models/user'
require("dotenv").config();
export const requireSingIn=expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:["HS256"],
});


export const addFollower=async(req,res,next)=>{
    try{
        
    const user=await User.findByIdAndUpdate(req.body._id,{
        $addToSet:{followers:req.auth._id}
    });
    next();
      
    }
    catch(error){
console.log(error)
    }
}
export const removeFollower=async(req,res,next)=>{

    try{
        
        const user=await User.findByIdAndUpdate(req.body._id,{
        $pull:{follower:req.auth._id}
       })

        next()
    }
    catch(error){
        console.log(error)
    }
}