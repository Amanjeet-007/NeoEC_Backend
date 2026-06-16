import mongoose from "mongoose";

const connectDb = async () => {
    try {
        // await mongoose.connect(process.env.mongoDB_cloud_URI)
        await mongoose.connect(process.env.mongoDb_URI) // test
        console.log("DB is connected")
    } catch (err) {
        console.log("DB connection error :    ", err)
    }
}

export default connectDb