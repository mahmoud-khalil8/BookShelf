import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Book from './models/bookModel.js';
import app from './app.js';
dotenv.config({ path: './config.env' });

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

const data = JSON.parse(fs.readFileSync('./moreData.json', 'utf-8'));
const importData = async () => {
  try {
    await Book.create(data);
    console.log(data);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const deleteData = async () => {
  try {
    await Book.deleteMany();
    console.log('Data successfully deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
