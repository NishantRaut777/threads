import User from "../models/userModel.js";
import Post from "../models/postModel.js";


// CREATE POST
const createPost = async(req,res) => {
    try {
        const { postedBy, text, img } = req.body;

        if(!postedBy || !text){
            return res.status(400).json({ error: "PostedBy and Text fields are required." });
        }

        const user = await User.findById(postedBy);
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        // check if above user is same as user got from middleware
        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: "Unauthorised to create post" });
        }

        const maxLength = 500;
        if(text.length > maxLength){
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
        }

        // create post
        const newPost = new Post({ postedBy, text, img });
        await newPost.save();

        res.status(201).json({ message: "Post created successfully", newPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in createPOST: ", err.message);
    }
};


// GET POST
const getPost = async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ error: "Post not found"})
        }

        res.status(200).json({ message: "Post found", post });
    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("Error in getPOST: ", err.message);
    }
};


// DELETE POST
const deletePost = async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }

        // check if post belongs to user or not
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: "Unauthorized to delete post" });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("Error in deletePOST: ", err.message);
    }
};


// LIKE POST
const likeUnlikePost = async(req,res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        // Check if user liked the post already or not
        if(userLikedPost){
            // Unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "Post unliked successfully" });
        } else{
            // Like Post
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "Post liked successfully" });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in likeUnlikePOST: ", err.message);
    }
};


// REPLY POST
const replyToPost = async(req,res) => {
    try{
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        // If no comment provided give error
        if(!text){
            return res.status(400).json({ error: "Text Field is required." });
        }

        // Check if that post exist or not
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({ error: "Post not found" });
        }

        // because reply array in post accept data in this form
        const reply = { userId: userId, text: text, userProfilePic: userProfilePic, username: username };

        post.replies.push(reply);
        await post.save();

        res.status(200).json({ message: "Reply Added Successfully.", post });
        
    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("Error in replyPOST: ", err.message);
    }
};


const getFeedPosts = async(req,res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        // get users followed by loggedIn user.
        const following = user.following;
        
        // get posts of followed users in reverse order
        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

        res.status(200).json({ feedPosts });

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in feedPOSTS: ", err.message);
    }
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };