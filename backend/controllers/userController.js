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


export { signupUser, loginUser };