import mongoose from 'mongoose';
import slugify from 'slugify';

const bookSchema = new mongoose.Schema(
  {
    id:{
      type: Number,
      required: [true, 'A book must have an id'],
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'A book must have a title'],
      unique: true,
      maxlength: [
        40,
        'A book title must have less or equal than 40 characters',
      ],
      minlength: [
        3,
        'A book title must have more or equal than 10 characters',
      ],
      trim: true,
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
      maxlength: [5, 'A book rating must be less or equal than 5'],
      minlength: [1, 'A book rating must be more or equal than 1'],
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
bookSchema.virtual('priceInEgp').get(function () {
  return Math.round(this.price * 60);
});
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  //console.log(this.id);
  next();
});

//query middleware
//showing only the books published after 2000
bookSchema.pre(/^find/, function (next) {
  this.find({ published_year: { $gte: 2000 } });
  next();
});
bookSchema.post(/^find/, function (docs, next) {
  //console.log(docs);
  next();
});
bookSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { published_year: { $gte: 2000 } } });
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
