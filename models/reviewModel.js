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

reviewSchema.pre(/^find/, function (next) {
    //populate is used to fill the fields of the document with the actual data from other collections 
    // this.populate({
    //     path: 'book',
    //     select: 'title',
    // }).populate({
    //     path: 'user',
    //     select: 'name',
    // });
    this.populate({
        path: 'user',
        select: 'name',
    });
    next();
}
); 

const Review = mongoose.model('Review', reviewSchema);
export default Review;

