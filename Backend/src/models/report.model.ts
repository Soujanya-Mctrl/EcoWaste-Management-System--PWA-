import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
    user: mongoose.Types.ObjectId;
    username: string;
    title: string;
    description: string;
    location: string;
    category: 'illegal_dumping' | 'overflowing_bins' | 'missed_collection' | 'other';
    image: string;
    content: string; // AI classification result
    points: number;
    status: 'pending' | 'investigating' | 'resolved' | 'verified';
    priority: 'low' | 'medium' | 'high';
    votes: number;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['illegal_dumping', 'overflowing_bins', 'missed_collection', 'other'],
        default: 'other'
    },
    image: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    points: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'investigating', 'resolved', 'verified'],
        default: 'pending',
        index: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    votes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Compound index for sorting by status and date
ReportSchema.index({ status: 1, createdAt: -1 });

const ReportModel = mongoose.model<IReport>("report", ReportSchema);

export default ReportModel;
