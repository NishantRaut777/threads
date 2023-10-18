import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

// GET USER BY USERNAME
const getUserProfile = async(req,res) => {
    // Fetch user either with username or userID
    const { query } = req.params;

    try {
        let user;

        // check if query is valid or not i.e value passed in query exist or not
        // query is userId
        if( mongoose.Types.ObjectId.isValid(query) ){
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        } else {
            // query is username
            user = await User.findOne({ username : query }).select("-password").select("-updatedAt");
        }

        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in GetUser: ", err.message);
    }
};


// SIGN UP USER
const signupUser = async(req,res) => {
    try{
        const {name, email, username, password} = req.body;
        const user = await User.findOne({ $or:[{email},{username}] });

        if(user){
            return res.status(400).json({ error: "User already exists" });
        }

        if(!email.includes("@")){
            return res.status(400).json({ error: "Enter Valid EmailID" });
        }

        if(password.length < 6){
            return res.status(400).json({ error: "Password too short." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: hashedPassword
        });
        
        await newUser.save();

        if(newUser){
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            });
        } else{
            res.status(400).json({ error: "Invalid User Data" });
        }

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("Error in signupUser: ", err.message);
    }
};


// LOGIN USER
const loginUser = async(req,res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        // this condition is used because bcrypt gives error for undefined value
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect){
            return res.status(400).json({ error: "Invalid Username or Password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        });
    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("Error in loginUser: ", err.message);
    }
};


// LOGOUT USER
const logoutUser = (req,res) => {
    try{
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch(err) {
        res.status(500).json({ error: err.message });
        console.log("Error in logoutUser: ", err.message);
    }
};


// FOLLOW UNFOLLOW USER
const followUnfollowUser = async(req,res) => {
    try{
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        // check if user to followed id and follower id is same 
        // toString coverts object into string
        if(id === req.user._id.toString()){
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        // check if user already follows person
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing){
            // unfollow user

            // remove from followers array
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

            // remove from following array
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

            res.status(200).json({ message: "User unfollowed successfully" });
        } else{
            // follow user

            // Add in followers array
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

            // Add in following array
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            res.status(200).json({ message: "User followed successfully" });
        }

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("Error in FollowUnfollowUSER: ", err.message);
    }
};


// UPDATE USER
const updateUser = async(req,res) => {
    try {
        const { name, email, username, password, bio} = req.body;

        // profilePic is declared with let because it will be modified here
        let { profilePic } = req.body;

        // getting the userId from middleware function
        const userId = req.user._id;

        let user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({ error: "User not found"});
        }

        // check if parameter passed in request matches with logged in user Id or not

        if (req.params.id !== userId.toString()){
            return res.status(400).json({ error: "You cannot update other user's profile." });
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        // if profilePic is passed then upload that image in cloudinary and assign url of it to the variable
        if(profilePic){
            // if user already has profilePic then remove that profilePic first from cloudinary
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        // assigning values
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        // saving new user
        user = await user.save();

        // find all posts that user replied and update username and userProfilePic fields
        await Post.updateMany(
            { "replies.userId" : userId},
            {
                $set: {
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic
                }
            },
            { arrayFilters: [{ "reply.userId": userId }] }
        );

        user.password = null;

        res.status(200).json( user );

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in updateUSER: ", err.message);
    }
};


export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile };