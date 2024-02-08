import Review from "../models/reviewModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllReviews = catchAsync(async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({
        status: "success",
        results: reviews.length,
        data: {
            reviews,
        },
        });
    } catch (err) {
        res.status(404).json({
        status: "fail",
        message: err,
        });
    }

});
export const createReview = catchAsync(async (req, res) => {
    try {
        const newReview = await Review.create(req.body);
        res.status(201).json({
        status: "success",
        data: {
            review: newReview,
        },
        });
    } catch (err) {
        res.status(400).json({
        status: "fail",
        message: err,
        });
    }
}
);
export const getReview = catchAsync(async (req, res) => {
    try {
        const review = await Review.findById(req.params._id);
        res.status(200).json({
        status: "success",
        data: {
            review,
        },
        });
    } catch (err) {
        res.status(404).json({
        status: "fail",
        message: err,
        });
    }
});