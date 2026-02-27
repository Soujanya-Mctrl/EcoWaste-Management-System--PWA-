import mongoose, { Schema, Document } from 'mongoose';

interface IRecycler {
    name: string;
    address: string;
    quantity: number;
    rating?: number;
}

export interface IFacility extends Document {
    state: string;
    total: number;
    recyclers: IRecycler[];
}

const RecyclerSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    quantity: { type: Number, required: true },
    rating: { type: Number }
});

const FacilitySchema = new Schema({
    state: { type: String, required: true },
    total: { type: Number, required: true },
    recyclers: [RecyclerSchema]
});

const FacilityModel = mongoose.model<IFacility>("Facilities", FacilitySchema);

export default FacilityModel;
