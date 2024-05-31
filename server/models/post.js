import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema
const postSchemas = new mongoose.Schema({
    content: {
        type: {},
        require: true,
    },
    postedBY: {
        type: ObjectId,
        ref: "User",
        require:true
    },
    image: {
        url: String,
        public_id: String
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments:
        [
            {
                text:String,
                created:{type:Date,default:Date.now},
                postedBY: {
                    type: ObjectId,
                    ref: "User"
                },
            }

        ]
},{timestamps:true})

export default mongoose.model("Post",postSchemas)
