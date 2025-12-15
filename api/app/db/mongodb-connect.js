import mongoose from "mongoose";

const dbConnect = async() => {
    const uri = process.env.MONGO_URI
    try {
        if(!uri) throw new Error("MongoDB connection URI is not defined in environment variables");
        await mongoose.connect(uri);
        return console.log({status: 200, message: "MongoDB connected"});
    } catch (err) {
        return console.log({status: 500, message: err.message});
    }
}

export default dbConnect;