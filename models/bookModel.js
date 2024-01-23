import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'A book must have an id'],
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'A book must have a title'],
    unique: true,
  },
  author: {
    type: String,
    required: [true, 'A book must have an author'],
  },
  genre: {
    type: String,
    required: [true, 'A book must have a genre'],
  },
  published_year: {
    type: Number,
    required: [true, 'A book must have a published year'],
  },
  description: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: 'English',
  },
  pageCount: {
    type: Number,
    default: 0,
  },
  ISBN: {
    type: String,
    default: '',
  },
  publisher: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: String,
      reviewText: String,
      rating: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  format: String,
  edition: String,
  price: Number,
  availableFormats: [String],
  dimensions: {
    height: Number,
    width: Number,
    thickness: Number,
  },
  weight: Number,
  publishedLocation: String,
  isBestseller: Boolean,
  isRecommended: Boolean,
});
const Book = mongoose.model('Book', bookSchema);

export default Book;