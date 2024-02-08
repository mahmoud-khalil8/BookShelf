import express from 'express';
import morgan from 'morgan';

import bookRouter from './routers/bookroutes.js';
import AppError from './utils/appError.js';
import{ globalErrorController} from './controllers/errorController.js';
import userRouter from './routers/userRoutes.js';
import reviewRouter from './routers/reviewRoutes.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

const app = express();

// 1) MIDDLEWARES


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//set security http headers
app.use(helmet()) 
//limit requesting from same ip
const limiter =rateLimit({
  max:100 ,
  windowMs:60*60*1000,
  message:'Too many requests from this ip, try again in an hour'
})


app.use('/api' ,limiter)

//body parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}));

//data sanitization against nosql query injection
app.use(mongoSanitize());

//data sanitization against xss
app.use(xss());

//prevent parameter pollution
app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}))


const __dirname = new URL('.', import.meta.url).pathname;

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

//error handling middleware
app.all('*', (req, res, next) => {
  //passing an argument to next() will be treated as an error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController)



export default app;
