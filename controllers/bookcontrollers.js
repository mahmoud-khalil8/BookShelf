import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import Book from '../models/bookModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
// const data = JSON.parse(fs.readFileSync('data.json'));

// export const checkId = (req, res, next, val) => {
//   req.params.id *= 1;
//   if (req.params.id > data.books.length) {
//     return res.status(404).json({ status: 'fail', message: 'invalid id' });
//   }
//   next();
// };

// export const checkBody = (req, res, next, val) => {
//   if (!req.body.title || !req.body.author) {
//     return res
//       .status(404)
//       .json({ status: 'fail', message: 'missing something in the body' });
//   }
//   next();
// };
export const aliasBiggestBooks = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-pageCount,published_year';
  req.query.fields = 'title,author';
  next();
};

export const getAllBooks = async (req, res) => {
  try {
    const features = new APIFeatures(Book.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const books = await features.getBooks();

    // const books = await Book.find(queryObj);

    res.status(200).json({
      status: 'success🙌',
      books,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
export const getBookStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $match: { pageCount: { $gte: 100 } },
      },
      {
        $group: {
          _id: '$ratings',
          avgPageCount: { $avg: '$pageCount' },
          minPageCount: { $min: '$pageCount' },
          maxPageCount: { $max: '$pageCount' },
        },
      },
      {
        $sort: { avgPageCount: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success', 

      stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
export const getGroupFiction = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $match: {
          $or: [{ genre: 'Fiction' }, { genre: { $regex: /Fiction/i } }],
          pageCount: { $gte: 100 },
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $regexMatch: { input: '$genre', regex: /Fiction/i } },
              then: 'Fiction',
              else: '$genre',
            },
          },
          numBooks: { $sum: 1 },
          avgPageCount: { $avg: '$pageCount' },
          minPageCount: { $min: '$pageCount' },
          maxPageCount: { $max: '$pageCount' },
        },
      },
      {
        $sort: { avgPageCount: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getBook = catchAsync(async (req, res,next) => {
    const book = await Book.findById(req.params.id).populate('reviews');
    if(!book){
      return next(new AppError('No book found with that ID', 404));
    }
    // const book = data.books.find((el) => el.id === id);
    res.status(200).json({
      status: 'success',
      book,
    });
   
})

export const postBook = catchAsync(async (req, res, next) => {
    const newBook = await Book.create(req.body);
    console.log(newBook.id);
    console.log(Book.findById(newBook._id))

    res.status(201).json({
      status: 'success',
      data: {
        book: newBook,  
      },
    });
  
});

//});
//};
export const updateBook = catchAsync(async (req, res,next) => {
  
    const bookId = req.params.id;
    console.log('Provided book ID:', bookId);

    // Check if the provided ID is a valid ObjectId

    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    });
    if(!updatedBook){return next(new AppError('No book found with that ID', 404));}


    res.status(200).json({
      status: 'success',
      data: {
        book: updatedBook,
      },
    });
});


export const deleteBook = async (req, res,next) => {
  try{
    const bookId = req.params.id;

    // Check if the bookId is a valid ObjectId
    if (!mongoose.isValidObjectId(bookId)) {
      return next(new AppError('Invalid book ID', 400));
    }

    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      return next(new AppError('No book found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
  });}
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }

  
};
