import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // To avoid warnings in console
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB");
    } catch(err){
        console.log(err);
    }
};

export default connectDB;