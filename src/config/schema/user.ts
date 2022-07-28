import mongoose from 'mongoose';

export interface user {
    _id?: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    userName: string;
    createdTime: Date;
}

const userSchema = {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
    createdTime: Date,
};

export default userSchema;
