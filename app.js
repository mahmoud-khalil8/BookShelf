import express from 'express';
import morgan from 'morgan';

import bookRouter from './routers/bookroutes.js';
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

export default app;
