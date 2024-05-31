import mongoose from 'mongoose';
import { type } from 'os';

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        maxlength: 64,
    },
    secret: {
        type: String,
        required: true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    about: {
        type: String, 
    },
    // image: {
    //     type: String, 
    // },
    image: {
        url: String,
        public_id: String
    },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
}, { timestamps: true });

export default mongoose.model('User', userSchema);
