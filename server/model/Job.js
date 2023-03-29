import mongoose from "mongoose"

export default mongoose.model('Job', new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Please provide company name'],
            maxlength: 50
        },
        position: {
            type: String,
            required: [true, 'Please provide position'],
            maxlength: 100
        },
        status: {
            type: String,
            enum: ['interview', 'declined', 'pending'],
            default: 'pending'
        },
        type: {
            type: String,
            enum: ['full-time', 'part-time', 'remote', 'internship'],
            default: 'full-time',
        },
        location: {
            type: String,
            default: 'my city',
            required: true,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
        }
    },
    {timestamps: true}
))