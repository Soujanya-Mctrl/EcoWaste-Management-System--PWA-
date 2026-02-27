import mongoose from 'mongoose';

function connectDB(): void {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not defined in .env");
        return;
    }
    mongoose.connect(uri)
        .then(() => {
            console.log("Connected to DB")
        })
        .catch(err => {
            console.log(err)
        })
}

export default connectDB;
