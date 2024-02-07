import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: [true, 'A review must have a review'],
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: [true, 'Review must belong to a book'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user'],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


const Review = mongoose.model('Review', reviewSchema);
export default Review;

