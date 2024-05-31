import express from 'express';
import formidable from 'express-formidable'
import { requireSingIn } from '../middleware/auth';
import { createPost, updatePost, uploadImage, userPost, userPostById,deletePost,likePost,DisLikePost,addComment, addStory,getAllStories } from '../controllers/post';
const router = express.Router();

router.post('/create-post', requireSingIn, createPost)
router.post('/upload-image', requireSingIn,
    formidable({ maxFileSize: 10 * 1024 * 1024 })
    ,
    uploadImage)
router.get("/user-post", requireSingIn, userPost)
router.get("/user-post/:_id",requireSingIn,userPostById)
router.put('/update-post/:_id',requireSingIn,updatePost)
router.delete('/delete-post/:_id',requireSingIn,deletePost)
router.put('/like',requireSingIn,likePost)
router.put('/dislike',requireSingIn,DisLikePost)
router.put('/comment',requireSingIn,addComment)
router.post('/add-story',requireSingIn,addStory)
router.get('/all-stories',requireSingIn,getAllStories)
module.exports = router;