import User from "../models/user";
import Message from "../models/message";

export const getAllMessage=async(req,res)=>{
    try{
        const senderId=req.auth._id
        const receiverId=req.params._id
        const messages = await Message.find({
            $or: [
              { sender: senderId, receiver: receiverId },
              { sender: receiverId, receiver: senderId }
            ]
          }).populate('receiver','_id name username image')
          .sort({ createdAt: 1 });
          res.json(messages);
    }
    catch(error){
        console.log("Error in sending message",error)
        return res.json({
            error:"error in getting message"
        })
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const {sender,receiver,message}=req.body
        const newMessage=new Message({
            sender,
            receiver,
            message
        })
        
     await newMessage.save()
     return res.json(newMessage)
    }
    catch(error){
        console.log("Error in sending message",error)
        return res.json({
            error:"error in sending message"
        })
    }
}