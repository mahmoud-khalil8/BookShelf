import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import Book from '../models/bookModel.js';
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
export const getAllBooks = async (req, res) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //console.log(JSON.parse(queryStr));

    let query = Book.find(JSON.parse(queryStr));
    //console.log('💥' + req.query.sort + '💢');

    //console.log(req.query, queryObj);

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numBooks = await Book.countDocuments();
      if (skip >= numBooks) throw new Error('This page does not exist');
    }

    //execution
    const books = await query;
    // const books = await Book.find(queryObj);

    res.status(200).json({
      status: 'success',
      books,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

export const getBook = (req, res) => {
  const book = data.books.find((elem) => elem.id === req.params.id);

  res.status(200).json({
    status: 'success',
    book,
  });
};

export const postBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);

    //const newId = data.books[data.books.length - 1].id + 1;
    //const newItem = Object.assign({ id: newId }, req.body);
    //data.books.push(newItem);
    //fs.writeFile('data.json', JSON.stringify(data), (err) => {
    //if (err) {
    //console.error(err);
    //res.status(500).send('internal server error');
    //} else {
    res.status(201).json({
      status: 'success',
      data: {
        book: newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
//});
//};
export const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log('Provided book ID:', bookId);

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid book ID',
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({
        status: 'fail',
        message: 'Book not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        book: updatedBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
