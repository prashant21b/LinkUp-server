import express from 'express';

import { currentUser, forgotPassword, login, profileUpdate, register,findPeople,userFollow,userFollowing,userunfollow,getFollower,getReceiver} from '../controllers/auth';
import { addFollower, requireSingIn,removeFollower } from '../middleware/auth';
const router=express.Router();

router.post('/register',register)
router.post('/login',login)
router.get("/current-user",requireSingIn,currentUser)
router.post('/forgot-password',forgotPassword)
router.put('/profile-update',requireSingIn,profileUpdate)
router.get('/find-people',requireSingIn,findPeople)
router.put('/user-follow',requireSingIn,addFollower,userFollow)
router.get('/user-following',requireSingIn,userFollowing)
router.put('/user-unfollow',requireSingIn,removeFollower,userunfollow)
router.get('/user-follower',requireSingIn,getFollower)
router.put('/user-remove',requireSingIn,removeFollower,userunfollow)
router.get('/get-receiver/:_id',requireSingIn,getReceiver)
module.exports=router;