import express from 'express';
import morgan from 'morgan';

import bookRouter from './routers/bookroutes.js';
import AppError from './utils/appError.js';
import{ globalErrorController} from './controllers/errorController.js';
import userRouter from './routers/userRoutes.js';
const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
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

//error handling middleware
app.all('*', (req, res, next) => {
  //passing an argument to next() will be treated as an error
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController)



export default app;
