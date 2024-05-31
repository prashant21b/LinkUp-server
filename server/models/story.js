import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const storySchema = new mongoose.Schema({
  image: {
        url: String,
        public_id: String
  },
  seenBy: [{
    type: ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '24h' } 
  }
}, { timestamps: true });

export default mongoose.model('Story', storySchema);
