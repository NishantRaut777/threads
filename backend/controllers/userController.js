import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

// SIGN UP USER
const signupUser = async(req,res) => {
    try{
        const {name, email, username, password} = req.body;
        const user = await User.findOne({ $or:[{email},{username}] });

        if(user){
            return res.status(400).json({ message: "User already exists" });
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
                username: newUser.username
            });
        } else{
            res.status(400).json({ message: "Invalid User Data" });
        }

    } catch(err){
        res.status(500).json({ message: err.message });
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
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
        });
    } catch(err){
        res.status(500).json({ message: err.message });
        console.log("Error in loginUser: ", err.message);
    }
};


// LOGOUT USER
const logoutUser = (req,res) => {
    try{
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch(err) {
        res.status(500).json({ message: err.message });
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
            return res.status(400).json({ message: "User not found" });
        }

        // check if user to followed id and follower id is same 
        // toString coverts object into string
        if(id === req.user._id.toString()){
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
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
        res.status(500).json({ message: err.message });
        console.log("Error in FollowUnfollowUSER: ", err.message);
    }
};


const updateUser = async(req,res) => {
    try {
        const { name, email, username, password, profilePic, bio} = req.body;
        // getting the userId from middleware function
        const userId = req.user._id;

        let user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({ message: "User not found"});
        }

        // check if parameter passed in request matches with logged in user Id or not

        if (req.params.id !== userId.toString()){
            return res.status(400).json({ message: "You cannot update other user's profile." });
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        // assigning values
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        // saving new user
        user = await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });

    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log("Error in updateUSER: ", err.message);
    }
};


export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUser };