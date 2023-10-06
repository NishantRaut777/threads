import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async(req,res,next) => {
    try{
        const token = req.cookies.jwt;

        if (!token){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // token has userId key
        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        // pass the req.user to followUser function
        next();
    } catch(err){
        res.status(500).json({ message: err.message });
        console.log("Error in FollowUSER: ", err.message);
    }
};

export default protectRoute;