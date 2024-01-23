import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
import app from './app.js';

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {})
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the application if there's an issue with the database connection
  });

const port = process.env.PORT || 4000;

app.listen(3000, () => {
  console.log(`Listening on port ${port}`);
});
