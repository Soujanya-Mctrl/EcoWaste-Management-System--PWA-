import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    points: number;
    role: 'user' | 'green_champion' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    role: {
        type: String,
        enum: ['user', 'green_champion', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

const userModel = mongoose.model<IUser>("users", userSchema);

export default userModel;
